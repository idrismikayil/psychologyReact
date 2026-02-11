import React, { useEffect } from 'react';
import { useFormik } from "formik";
import * as Yup from "yup";
import logo from "../../../shared/media/imgs/logo.png";
import { useNavigate, useLocation, Link } from "react-router-dom";
import API from "@/api";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "@/shared/components/LanguageSwitcher";

const ResetPassword = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { t } = useTranslation();

    // Get email from previous step
    const initialEmail = location.state?.email || "";

    const formik = useFormik({
        initialValues: {
            email: initialEmail,
            code: "",
            new_password: "",
            confirm_password: ""
        },
        validationSchema: Yup.object({
            email: Yup.string().required(t("auth.email") + " " + t("common.error")),
            code: Yup.string().required(t("auth.code") + " " + t("common.error")),
            new_password: Yup.string().min(6, "Min 6").required(t("auth.password") + " " + t("common.error")),
            confirm_password: Yup.string()
                .oneOf([Yup.ref('new_password'), null], t("auth.password_mismatch"))
                .required(t("auth.password") + " " + t("common.error")),
        }),
        onSubmit: async (values) => {
            try {
                const response = await API.Auth.resetPassword({
                    email: values.email,
                    code: values.code,
                    new_password: values.new_password
                });

                if (response.status === 200) {
                    toast.success(response.data.message || "Password reset successfully", { position: "top-right", autoClose: 3000 });
                    setTimeout(() => {
                        navigate("/login");
                    }, 2000);
                } else {
                    throw new Error(response.data.message || t("common.error"));
                }
            } catch (error: any) {
                toast.error(
                    error?.response?.data?.detail || error?.response?.data?.message || error?.response?.data?.error || t("common.error"),
                    { position: "top-right", autoClose: 3000 }
                );
            }
        },
    });

    // If no email provided, redirect potentially? Or let user type it.
    useEffect(() => {
        if (!initialEmail) {
            // Optional: toast.warning("Email not found, please enter manually");
        }
    }, [initialEmail]);


    return (
        <>
            <Helmet>
                <title>{t("auth.reset_password")} | Octopus</title>
            </Helmet>

            <div className="flex h-dvh flex-1 flex-col justify-center px-6 py-12 lg:px-8 relative">
                <div className="absolute top-4 right-4">
                    <LanguageSwitcher />
                </div>
                <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                    <Link to="/">
                        <img
                            alt="Your Company"
                            src={logo}
                            className="mx-auto h-[90px] w-auto"
                        />
                    </Link>
                    <h2 className="mt-10 text-center text-2xl font-bold tracking-tight text-gray-900">
                        {t("auth.reset_password")}
                    </h2>
                </div>

                <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                    <form onSubmit={formik.handleSubmit} className="space-y-6">
                        <div>
                            <label
                                htmlFor="email"
                                className="block text-sm font-medium text-gray-900"
                            >
                                {t("auth.email")}
                            </label>
                            <div className="mt-2">
                                <input
                                    id="email"
                                    name="email"
                                    type="text"
                                    placeholder={t("auth.email")}
                                    autoComplete="email"
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    value={formik.values.email}
                                    className={`block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 border ${formik.touched.email && formik.errors.email
                                        ? "border-red-500"
                                        : "border-indigo-600"
                                        } focus:outline-none focus:ring-1 focus:ring-indigo-400 placeholder:text-gray-400 sm:text-sm`}
                                />
                                {formik.touched.email && formik.errors.email && (
                                    <p className="mt-1 text-sm text-red-500">
                                        {formik.errors.email as string}
                                    </p>
                                )}
                            </div>
                        </div>

                        <div>
                            <label
                                htmlFor="code"
                                className="block text-sm font-medium text-gray-900"
                            >
                                {t("auth.code")}
                            </label>
                            <div className="mt-2">
                                <input
                                    id="code"
                                    name="code"
                                    type="text"
                                    placeholder="Code"
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    value={formik.values.code}
                                    className={`block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 border ${formik.touched.code && formik.errors.code
                                        ? "border-red-500"
                                        : "border-indigo-600"
                                        } focus:outline-none focus:ring-1 focus:ring-indigo-400 placeholder:text-gray-400 sm:text-sm`}
                                />
                                {formik.touched.code && formik.errors.code && (
                                    <p className="mt-1 text-sm text-red-500">
                                        {formik.errors.code as string}
                                    </p>
                                )}
                            </div>
                        </div>

                        <div>
                            <label
                                htmlFor="new_password"
                                className="block text-sm font-medium text-gray-900"
                            >
                                {t("auth.new_password")}
                            </label>
                            <div className="mt-2">
                                <input
                                    id="new_password"
                                    name="new_password"
                                    type="password"
                                    placeholder={t("auth.new_password")}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    value={formik.values.new_password}
                                    className={`block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 border ${formik.touched.new_password && formik.errors.new_password
                                        ? "border-red-500"
                                        : "border-indigo-600"
                                        } focus:outline-none focus:ring-1 focus:ring-indigo-400 placeholder:text-gray-400 sm:text-sm`}
                                />
                                {formik.touched.new_password && formik.errors.new_password && (
                                    <p className="mt-1 text-sm text-red-500">
                                        {formik.errors.new_password as string}
                                    </p>
                                )}
                            </div>
                        </div>

                        <div>
                            <label
                                htmlFor="confirm_password"
                                className="block text-sm font-medium text-gray-900"
                            >
                                {t("auth.confirm_password")}
                            </label>
                            <div className="mt-2">
                                <input
                                    id="confirm_password"
                                    name="confirm_password"
                                    type="password"
                                    placeholder={t("auth.confirm_password")}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    value={formik.values.confirm_password}
                                    className={`block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 border ${formik.touched.confirm_password && formik.errors.confirm_password
                                        ? "border-red-500"
                                        : "border-indigo-600"
                                        } focus:outline-none focus:ring-1 focus:ring-indigo-400 placeholder:text-gray-400 sm:text-sm`}
                                />
                                {formik.touched.confirm_password && formik.errors.confirm_password && (
                                    <p className="mt-1 text-sm text-red-500">
                                        {formik.errors.confirm_password as string}
                                    </p>
                                )}
                            </div>
                        </div>

                        <div>
                            <button
                                type="submit"
                                className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                            >
                                {t("common.reset")}
                            </button>
                        </div>
                    </form>
                </div>

                <ToastContainer />
            </div>
        </>
    );
};

export default ResetPassword;
