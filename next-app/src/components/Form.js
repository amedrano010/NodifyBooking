"use client";

import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import Dropzone from "/components/ui/Dropzone";

/**
 * Reusable Formik Form Component
 * @param {Object} props
 * @param {Array} props.fields - Array of field configs: { name, label, type, placeholder }
 * @param {Object} props.initialValues - Initial values for the form
 * @param {Object} props.validationSchema - Yup validation schema
 * @param {Function} props.onSubmit - Submit handler
 * @param {React.ReactNode} props.children - Optional custom children (for advanced use)
 */
const ReusableForm = ({
    fields,
    initialValues,
    validationSchema,
    onSubmit,
    children,
}) => {
    return (
        <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={onSubmit}
        >
            {({ isSubmitting, handleSubmit }) => (
                <Form
                    className="w-full h-full flex flex-col py-4 sm:py-0 overflow-y-hidden"
                    onSubmit={handleSubmit}
                >
                    <div className="space-y-4 px-5 flex-grow overflow-y-auto">
                        {fields &&
                            fields.map((field) => (
                                <div
                                    key={field.name}
                                    className="flex flex-col items-start "
                                >
                                    <div>
                                        <label
                                            htmlFor={field.name}
                                            className="mb-1 font-medium"
                                        >
                                            {field.label}:
                                        </label>
                                        {field.required ? "*" : ""}
                                    </div>

                                    {(() => {
                                        switch (field.type) {
                                            case "files":
                                                return (
                                                    <Field name={field.name}>
                                                        {({ field, form }) => (
                                                            <Dropzone
                                                                onDrop={(
                                                                    acceptedFiles
                                                                ) => {
                                                                    form.setFieldValue(
                                                                        field.name,
                                                                        acceptedFiles
                                                                    );
                                                                }}
                                                                value={
                                                                    field.value
                                                                }
                                                            />
                                                        )}
                                                    </Field>
                                                );
                                            case "textarea":
                                                return (
                                                    <Field
                                                        as="textarea"
                                                        id={field.name}
                                                        name={field.name}
                                                        placeholder={
                                                            field.placeholder
                                                        }
                                                        className="border border-gray-300 px-3 py-2 w-full min-h-[80px]"
                                                    />
                                                );
                                            case "select":
                                                return (
                                                    <Field
                                                        as="select"
                                                        id={field.name}
                                                        name={field.name}
                                                        placeholder={
                                                            field.placeholder
                                                        }
                                                        className="border !border-gray-300 h-10 px-3 py-2 w-full !bg-white"
                                                    >
                                                        <option value="fixed">
                                                            Fixed
                                                        </option>
                                                        <option value="from">
                                                            From
                                                        </option>
                                                    </Field>
                                                );
                                            default:
                                                return (
                                                    <Field
                                                        id={field.name}
                                                        name={field.name}
                                                        type={
                                                            field.type || "text"
                                                        }
                                                        step={field.step}
                                                        placeholder={
                                                            field.placeholder
                                                        }
                                                        className="border !border-gray-300 h-10 px-3 py-2 w-full !bg-white"
                                                    />
                                                );
                                        }
                                    })()}
                                    <ErrorMessage
                                        name={field.name}
                                        component="div"
                                        className="text-red-500 text-sm mt-1"
                                    />
                                </div>
                            ))}
                        {children}
                    </div>
                    <div className="flex py-1 mt-2">
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="btn-primary ml-auto"
                        >
                            Submit
                        </button>
                    </div>
                </Form>
            )}
        </Formik>
    );
};

export default ReusableForm;
