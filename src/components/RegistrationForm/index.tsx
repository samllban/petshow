import React from 'react';
import { Formik, Form, Field, FieldArray, ErrorMessage } from 'formik';
import * as yup from 'yup';
import Header from '../Header/Header';

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
    const handleSubmit = (values: FormValues) => {
        console.log('Form submitted:', values);
        // Logic to send data to the server, try doing it later
    };

    return (
        <>
            <Header />
            <Formik
                initialValues={initialValues}
                onSubmit={handleSubmit}
                validationSchema={validationSchema}
            >
                {({ values, setFieldValue }) => (
                    <div className="flex justify-center items-center h-screen bg-purple-700">
                        <div className="container w-4/5 h-4/5 flex shadow-lg">
                            <div className="">

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
                                                        <Field name={`variations[${index}].barcode`} placeholder="Barcode" className="mb-2 p-3 border-none rounded-md shadow-sm hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                                                        <Field name={`variations[${index}].sku`} placeholder="SKU" className="mb-2 p-3 border-none rounded-md shadow-sm hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                                                        <Field name={`variations[${index}].description`} placeholder="Description" className="mb-2 p-3 border-none rounded-md shadow-sm hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                                                        <Field name={`variations[${index}].stock`} type="number" placeholder="Stock Quantity" className="mb-2 p-3 border-none rounded-md shadow-sm hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                                                        <ErrorMessage name={`variations[${index}].stock`} component="span" className="form-error text-red-500" />
                                                        <Field name={`variations[${index}].price`} type="number" placeholder="Price" className="mb-2 p-3 border-none rounded-md shadow-sm hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
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
                                                })} className="mb-4 p-2 bg-indigo-500 text-white rounded-md shadow-sm hover:bg-indigo-600">
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
                                                setFieldValue("photos", event.currentTarget.files);
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
                                    <button type="submit" className="p-2 bg-indigo-500 text-white rounded-md shadow-sm hover:bg-indigo-600">Save</button>
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
