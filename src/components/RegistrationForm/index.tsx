import React from 'react';
import { Formik, Form, Field, FieldArray, ErrorMessage } from 'formik';
import * as yup from 'yup';

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
        <Formik
            initialValues={initialValues}
            onSubmit={handleSubmit}
            validationSchema={validationSchema}
        >
            {({ values, setFieldValue }) => (
                <Form>
                    <div>
                        <Field name="productName" placeholder="Product Name" />
                        <ErrorMessage name="productName" component="span" className="form-error" />
                    </div>
                    <div>
                        <Field name="description" placeholder="Product Description" />
                        <ErrorMessage name="description" component="span" className="form-error" />
                    </div>
                    <div>
                        <Field name="supplier" placeholder="Supplier Name" />
                        <ErrorMessage name="supplier" component="span" className="form-error" />
                    </div>

                    <FieldArray name="variations">
                        {({ push, remove }) => (
                            <div>
                                <h3>Variations</h3>
                                {values.variations.map((_, index) => (
                                    <div key={index}>
                                        <Field name={`variations[${index}].variationName`} placeholder="Variation Name" />
                                        <ErrorMessage name={`variations[${index}].variationName`} component="span" className="form-error" />
                                        <Field name={`variations[${index}].barcode`} placeholder="Barcode" />
                                        <Field name={`variations[${index}].sku`} placeholder="SKU" />
                                        <Field name={`variations[${index}].description`} placeholder="Description" />
                                        <Field name={`variations[${index}].stock`} type="number" placeholder="Stock Quantity" />
                                        <ErrorMessage name={`variations[${index}].stock`} component="span" className="form-error" />
                                        <Field name={`variations[${index}].price`} type="number" placeholder="Price" />
                                        <ErrorMessage name={`variations[${index}].price`} component="span" className="form-error" />
                                        <div>
                                            <label>
                                                <Field type="checkbox" name={`variations[${index}].inPromotion`} />
                                                In promotion?
                                            </label>
                                            {values.variations[index].inPromotion && (
                                                <div>
                                                    <Field name={`variations[${index}].promotion.newPrice`} type="number" placeholder="New Price" />
                                                    <Field name={`variations[${index}].promotion.startDate`} type="date" />
                                                    <Field name={`variations[${index}].promotion.endDate`} type="date" />
                                                </div>
                                            )}
                                        </div>
                                        <button type="button" onClick={() => remove(index)}>Remove Variation</button>
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
                                })}>
                                    + Add Variation
                                </button>
                            </div>
                        )}
                    </FieldArray>

                    <div>
                        <input
                            type="file"
                            multiple
                            onChange={(event) => {
                                setFieldValue("photos", event.currentTarget.files);
                            }}
                        />
                        <ErrorMessage name="photos" component="span" className="form-error" />
                    </div>
                    <div>
                        <label>
                            <Field type="radio" name="mainPhoto" value="1" />
                            Set as main photo
                        </label>
                        <ErrorMessage name="mainPhoto" component="span" className="form-error" />
                    </div>
                    <button type="submit">Save</button>
                </Form>
            )}
        </Formik>
    );
};

export default RegistrationForm;
