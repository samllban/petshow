import React from 'react';
import { Formik, Form, Field, FieldArray, ErrorMessage, FormikHelpers } from 'formik';
import * as yup from 'yup';
import Header from '../Header/Header';
import { fetchProductByBarcode } from '../../api/cosmo';
import axios from 'axios';
//import { saveProduct } from '../../api/apiServerce';
import InputMask from "react-input-mask";


interface Variation {
    barcode?: string;
    sku?: string;
    variationName: string;
    description?: string;
    stock: number;
    price: number;
    inPromotion: boolean;
    promotion?: {
        newPrice: number;
        startDate: string;
        endDate: string;
    };
}

interface FormValues {
    productName: string;
    description: string;
    supplier: string;
    variations: Variation[];
    photos: File[];
    mainPhoto: string;
}

const parsePrice = (value:string): number => {
    const numericValue = value.replace(/[^0-9.,]/g, '')
    return parseFloat(numericValue.replace(',','.'))
}

const initialValues: FormValues = {
    productName: '',
    description: '',
    supplier: '',
    variations: [{
        barcode: '',
        sku: '',
        variationName: '',
        description: '',
        stock: 0,
        price: 0,
        inPromotion: false,
        promotion: {
            newPrice: 0,
            startDate: '',
            endDate: ''
        }
    }],
    photos: [],
    mainPhoto: ''
};

type CustomFieldProps = {
    value: string | number;
    name: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onBlur: (e: React.FocusEvent<HTMLInputElement>) => void;
};

const validationSchema = yup.object().shape({
    productName: yup.string().required('Required field'),
    description: yup.string().required('Required field'),
    supplier: yup.string().required('Required field'),
    variations: yup.array().of(
        yup.object().shape({
            variationName: yup.string().required('Required field'),
            stock: yup.number().required('Required field'),
            price: yup.number().required('Required field'),
            inPromotion: yup.boolean(),
            promotion: yup.object().shape({
                newPrice: yup.number().when('inPromotion', {
                    is: true,
                    then: schema => schema.required('Required field for promotion'),
                    otherwise: schema => schema.notRequired()
                }),
                startDate: yup.date().when('inPromotion', {
                    is: true,
                    then: schema => schema.required('Required field for promotion'),
                    otherwise: schema => schema.notRequired()
                }),
                endDate: yup.date().when('inPromotion', {
                    is: true,
                    then: schema => schema.required('Required field for promotion'),
                    otherwise: schema => schema.notRequired()
                })
            })
        })
    ),
    photos: yup.array().min(1, 'At least one photo is required').required('Required field'),
    mainPhoto: yup.string().required('Required field')
});

const RegistrationForm: React.FC = () => {

    const handleBarcodeChange = async (
        event: React.ChangeEvent<HTMLInputElement>,
        index: number,
        setFieldValue: (field: string, value: string | number | boolean | File[] | null, shouldValidate?: boolean) => void,
    ) => {
        const barcode = event.target.value;
        setFieldValue(`variations[${index}].barcode`, barcode);
        if (barcode.length >= 8) {
            const data = await fetchProductByBarcode(barcode);
            if (data) {
                setFieldValue(`variations[${index}].variationName`, data.description)
                setFieldValue(`variations[${index}].price`, data.price || 0);
            }
        }
    };


    const onSubmit = async (values: FormValues, { setSubmitting }: FormikHelpers<FormValues>) => {
        const formData = new FormData();

        formData.append('productName', values.productName);
        formData.append('description', values.description);
        formData.append('supplier', values.supplier);
        formData.append('variations', JSON.stringify(values.variations));
        formData.append('mainPhoto', values.mainPhoto);

        // Anexando os arquivos de fotos
        for (let i = 0; i < values.photos.length; i++) {
            formData.append('photos', values.photos[i]);
        }

        try {
            const response = await axios.post('http://localhost:5000/save-product', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            console.log('Product saved:', response.data);

        } catch (error) {
            console.error('Error saving product:', error);
        }

        setSubmitting(false);
    };

    return (
        <>
            <Header />
            <Formik
                initialValues={initialValues}
                onSubmit={onSubmit}
                validationSchema={validationSchema}
            >
                {({ values, setFieldValue }) => (
                    <div className="flex justify-center items-center h-screen bg-purple-700">
                        <div className="container w-4/5 h-4/5 flex shadow-lg">
                            <div>
                                <Form>
                                    <div className="form-header mb-12 flex justify-between w-full">
                                        <h1 className="text-xl font-semibold">Product Registration</h1>
                                    </div>
                                    <div className="input-group flex flex-wrap justify-between py-4 w-full">
                                        <div className="input-box flex flex-col mb-4 w-full">
                                            <Field name="productName" placeholder="Product Name" className="mb-2 p-3 border-none rounded-md shadow-sm hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                                            <ErrorMessage name="productName" component="span" className="form-error text-red-500" />
                                        </div>
                                        <div className="input-box flex flex-col mb-4 w-full">
                                            <Field name="description" placeholder="Product Description" className="mb-2 p-3 border-none rounded-md shadow-sm hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                                            <ErrorMessage name="description" component="span" className="form-error text-red-500" />
                                        </div>
                                        <div className="input-box flex flex-col mb-4 w-full">
                                            <Field name="supplier" placeholder="Supplier Name" className="mb-2 p-3 border-none rounded-md shadow-sm hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                                            <ErrorMessage name="supplier" component="span" className="form-error text-red-500" />
                                        </div>
                                    </div>
                                    <FieldArray name="variations">
                                        {({ push, remove }) => (
                                            <div>
                                                <h3 className="text-lg font-semibold">Variations</h3>
                                                {values.variations.map((_, index) => (
                                                    <div key={index} className="input-box flex flex-col mb-4 w-full">
                                                        <Field name={`variations[${index}].variationName`} placeholder="Variation Name" className="mb-2 p-3 border-none rounded-md shadow-sm hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                                                        <ErrorMessage name={`variations[${index}].variationName`} component="span" className="form-error text-red-500" />

                                                        <Field
                                                            name={`variations[${index}].barcode`}
                                                            placeholder="Barcode"
                                                            className="mb-2 p-3 border-none rounded-md shadow-sm hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                                            onChange={async (event: React.ChangeEvent<HTMLInputElement>) => {
                                                                await handleBarcodeChange(event, index, setFieldValue);
                                                            }}
                                                        />
                                                        <Field name={`variations[${index}].sku`} placeholder="SKU" className="mb-2 p-3 border-none rounded-md shadow-sm hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                                                        <Field name={`variations[${index}].description`} placeholder="Description" className="mb-2 p-3 border-none rounded-md shadow-sm hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                                                        <Field name={`variations[${index}].stock`} type="number" placeholder="Stock Quantity" className="mb-2 p-3 border-none rounded-md shadow-sm hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                                                        <ErrorMessage name={`variations[${index}].stock`} component="span" className="form-error text-red-500" />

                                                        <Field name={`variations[${index}].price`}>
                                                            {({ field }: {field: CustomFieldProps}) => (
                                                                <InputMask
                                                                    {...field}
                                                                    mask="$999,999.99"
                                                                    className="mb-2 p-3 border-none rounded-md shadow-sm hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                                                    onChange={(e) => {
                                                                        const parsedValue = parsePrice(e.target.value);
                                                                        setFieldValue(`variations[${index}].price`, parsedValue)
                                                                    }}
                                                                />
                                                            )}
                                                        </Field>
                                                        <ErrorMessage name={`variations[${index}].price`} component="span" className="form-error text-red-500" />
                                                        <div className="flex items-center">
                                                            <label className="mr-2">
                                                                <Field type="checkbox" name={`variations[${index}].inPromotion`} />
                                                                In promotion?
                                                            </label>
                                                            {values.variations[index].inPromotion && (
                                                                <div className="input-box flex flex-col mb-4 w-full">
                                                                    <Field name={`variations[${index}].promotion.newPrice`} type="number" placeholder="New Price" className="mb-2 p-3 border-none rounded-md shadow-sm hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                                                                    <Field name={`variations[${index}].promotion.startDate`} type="date" className="mb-2 p-3 border-none rounded-md shadow-sm hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                                                                    <Field name={`variations[${index}].promotion.endDate`} type="date" className="mb-2 p-3 border-none rounded-md shadow-sm hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                                                                </div>
                                                            )}
                                                        </div>
                                                        <button type="button" onClick={() => remove(index)} className="mb-2 p-2 bg-red-500 text-white rounded-md shadow-sm hover:bg-red-600">Remove Variation</button>
                                                    </div>
                                                ))}
                                                <button type="button" onClick={() => push({
                                                    barcode: '',
                                                    sku: '',
                                                    variationName: '',
                                                    description: '',
                                                    stock: 0,
                                                    price: 0,
                                                    inPromotion: false,
                                                    promotion: {
                                                        newPrice: 0,
                                                        startDate: '',
                                                        endDate: ''
                                                    }
                                                })} className="mb-4 p-2 bg-indigo-500 text-white rounded-md shadow-sm hover:bg-indigo-600"

                                                >
                                                    + Add Variation
                                                </button>
                                            </div>
                                        )}
                                    </FieldArray>
                                    <div className="input-box flex flex-col mb-4 w-full">
                                        <input
                                            type="file"
                                            multiple
                                            onChange={(event) => {
                                                const files = event.currentTarget.files;
                                                if (files) {
                                                    const fileArray = Array.from(files)
                                                    setFieldValue("photos", fileArray)
                                                }
                                            }}
                                            className="mb-2 p-3 border-none rounded-md shadow-sm hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                        />
                                        <ErrorMessage name="photos" component="span" className="form-error text-red-500" />
                                    </div>
                                    <div className="input-box flex flex-col mb-4 w-full">
                                        <label className="flex items-center">
                                            <Field type="radio" name="mainPhoto" value="1" className="mr-2" />
                                            Set as main photo
                                        </label>
                                        <ErrorMessage name="mainPhoto" component="span" className="form-error text-red-500" />
                                    </div>
                                    <button
                                        type="submit"
                                        className="p-2 bg-indigo-500 text-white rounded-md shadow-sm hover:bg-indigo-600"
                                    >
                                        Save
                                    </button>
                                </Form>
                            </div>
                        </div>
                    </div>
                )}
            </Formik>
        </>
    );
};

export default RegistrationForm;
