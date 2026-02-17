import { useFormik } from "formik";
import * as Yup from "yup";
import logo from "../../shared/media/imgs/logo.png";
import { useNavigate, Link } from "react-router-dom";
import API from "@/api";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const Register = () => {
    const navigate = useNavigate();
    const { t } = useTranslation();
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const formik = useFormik({
        initialValues: {
            email: "",
            password: "",
            confirm_password: "",
            phone_number: "",
        },
        validationSchema: Yup.object({
            email: Yup.string().required(t("auth.email") + " " + t("common.error")),
            password: Yup.string()
                .min(6, t("auth.password") + " min 6")
                .required(t("auth.password") + " " + t("common.error")),
            confirm_password: Yup.string()
                .oneOf([Yup.ref("password"), undefined], t("auth.confirm_password") + " mismatch")
                .required(t("auth.confirm_password") + " " + t("common.error")),
        }),
        onSubmit: async (values) => {
            setLoading(true);
            try {
                const response = await API.Auth.register(values);

                if (response.status === 201) {
                    toast.success(t("common.success"));
                    navigate("/verify-email", { state: { email: values.email } });
                } else {
                    console.log(response);
                    throw new Error(response.data.message || t("common.error"));
                }
            } catch (error: any) {
                toast.error(error?.response?.data?.message || t("common.error"));
            } finally {
                setLoading(false);
            }
        },
    });

    return (
        <>
            <Helmet>
                <title>{t("auth.register")} | Octopus</title>
            </Helmet>

            <div className="flex h-dvh flex-1 flex-col justify-center px-6 py-12 lg:px-8">
                <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                    <Link to="/">
                        <img
                            alt="Logo"
                            src={logo}
                            className="mx-auto h-[90px] w-auto"
                        />
                    </Link>

                    <h2 className="mt-10 text-center text-2xl font-bold tracking-tight text-gray-900">
                        {t("auth.register")}
                    </h2>
                </div>

                <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                    <form onSubmit={formik.handleSubmit} className="space-y-6">
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-900">
                                {t("auth.email")}
                            </label>
                            <div className="mt-2">
                                <input
                                    id="email"
                                    name="email"
                                    type="text"
                                    placeholder={t("auth.email")}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    value={formik.values.email}
                                    className={`block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 border ${formik.touched.email && formik.errors.email
                                        ? "border-red-500"
                                        : "border-indigo-600"
                                        } focus:outline-none focus:ring-1 focus:ring-indigo-400 placeholder:text-gray-400 sm:text-sm`}
                                />
                                {formik.touched.email && formik.errors.email && (
                                    <p className="mt-1 text-sm text-red-500">{formik.errors.email}</p>
                                )}
                            </div>
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-900">
                                {t("auth.password")}
                            </label>
                            <div className="mt-2 relative">
                                <input
                                    id="password"
                                    name="password"
                                    type={showPassword ? "text" : "password"}
                                    placeholder={t("auth.password")}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    value={formik.values.password}
                                    className={`block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 border ${formik.touched.password && formik.errors.password
                                        ? "border-red-500"
                                        : "border-indigo-600"
                                        } focus:outline-none focus:ring-1 focus:ring-indigo-400 placeholder:text-gray-400 sm:text-sm`}
                                />
                                <button
                                    type="button"
                                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                                </button>
                            </div>
                            {formik.touched.password && formik.errors.password && (
                                <p className="mt-1 text-sm text-red-500">{formik.errors.password}</p>
                            )}
                        </div>

                        <div>
                            <label htmlFor="confirm_password" className="block text-sm font-medium text-gray-900">
                                {t("auth.confirm_password")}
                            </label>
                            <div className="mt-2 relative">
                                <input
                                    id="confirm_password"
                                    name="confirm_password"
                                    type={showConfirmPassword ? "text" : "password"}
                                    placeholder={t("auth.confirm_password")}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    value={formik.values.confirm_password}
                                    className={`block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 border ${formik.touched.confirm_password && formik.errors.confirm_password
                                        ? "border-red-500"
                                        : "border-indigo-600"
                                        } focus:outline-none focus:ring-1 focus:ring-indigo-400 placeholder:text-gray-400 sm:text-sm`}
                                />
                                <button
                                    type="button"
                                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                >
                                    {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                                </button>
                            </div>
                            {formik.touched.confirm_password && formik.errors.confirm_password && (
                                <p className="mt-1 text-sm text-red-500">{formik.errors.confirm_password}</p>
                            )}
                        </div>

                        <div>
                            <button
                                type="submit"
                                disabled={formik.isSubmitting}
                                className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                            >
                                {formik.isSubmitting ? "Loading..." : t("auth.register")}
                            </button>
                        </div>
                    </form>

                    <p className="mt-10 text-center text-sm text-gray-500">
                        <Link to="/login" className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500">
                            {t("auth.already_have_account")}
                        </Link>
                    </p>
                </div>
                <ToastContainer />
            </div>
        </>
    );
};

export default Register;
