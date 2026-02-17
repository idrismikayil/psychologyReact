import { useFormik } from "formik";
import * as Yup from "yup";
import logo from "../../shared/media/imgs/logo.png";
import { useNavigate, Link } from "react-router-dom";
import API from "@/api";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useUser } from "@/context/UserContext";
import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "@/shared/components/LanguageSwitcher";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useState } from "react";

const Index = () => {
  const { refreshUser } = useUser();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [showPassword, setShowPassword] = useState(false);

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: Yup.object({
      email: Yup.string().required(t("auth.email") + " " + t("common.error")),
      password: Yup.string()
        .min(6, t("auth.password") + " min 6")
        .required(t("auth.password") + " " + t("common.error")),
    }),
    onSubmit: async (values) => {
      try {
        const response = await API.Auth.login(values);

        if (response.status === 200) {
          localStorage.setItem("refresh", response.data.refresh);
          localStorage.setItem("access", response.data.access);
          refreshUser();
          navigate("/");
        } else {
          throw new Error(response.data.message || t("common.error"));
        }
      } catch (error: any) {
        // Toast notification ilə mesaj göstər
        toast.error(
          error?.response?.data?.detail || error?.response?.data?.message || error?.response?.data?.error || t("common.error"),
          { position: "top-right", autoClose: 3000 }
        );
      }
    },
  });

  return (
    <>
      <Helmet>
        <title>{t("header.login")} | Octopus</title>
        <meta
          name="description"
          content="Octopus platformasına daxil olun və şəxsiyyət testləri, nəticələr və digər xidmətlərdən yararlanın."
        />
        <meta name="robots" content="noindex, nofollow" />
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
            {t("auth.already_have_account")}
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
                    {formik.errors.email}
                  </p>
                )}
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-900"
                >
                  {t("auth.password")}
                </label>
                <div className="text-sm">
                  <Link
                    to="/forgot-password"
                    className="font-semibold text-indigo-600 hover:text-indigo-500"
                  >
                    {t("auth.forgot_password")}
                  </Link>
                </div>
              </div>
              <div className="mt-2 relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder={t("auth.password")}
                  autoComplete="current-password"
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
                {formik.touched.password && formik.errors.password && (
                  <p className="mt-1 text-sm text-red-500">
                    {formik.errors.password}
                  </p>
                )}
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                {t("header.login")}
              </button>
            </div>
          </form>

          <p className="mt-10 text-center text-sm text-gray-500">
            <Link to="/register" className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500">
              {t("auth.dont_have_account")}
            </Link>
          </p>

        </div>

        {/* Toast container */}
        <ToastContainer />
      </div>
    </>
  );
};

export default Index;
