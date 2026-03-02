import { useState, useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  HiOutlineUser,
  HiOutlineMail,
  HiOutlinePhone,
  HiOutlineLocationMarker,
} from "react-icons/hi";
import API from "@/api";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";

interface ContactInfo {
  id: number;
  location: string;
  location_url: string;
  phone: string;
  email: string;
}

const ContactPage = () => {
  const [contactInfo, setContactInfo] = useState<ContactInfo | null>(null);
  const { t } = useTranslation();

  const getContactInfo = async () => {
    try {
      const response = await API.Auth.contactInfo();
      if (response.status === 200) {
        setContactInfo(response.data);
      } else {
        throw new Error(t("common.error"));
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getContactInfo();
  }, []);

  const formik = useFormik({
    initialValues: {
      full_name: "",
      email: "",
      subject: "",
      message: "",
    },
    validationSchema: Yup.object({
      full_name: Yup.string().required(t("contact.form.name") + " " + t("common.error")),
      email: Yup.string()
        .email(t("auth.email") + " " + t("common.error"))
        .required(t("contact.form.email") + " " + t("common.error")),
      subject: Yup.string().required(t("contact.form.subject") + " " + t("common.error")),
      message: Yup.string().required(t("contact.form.message") + " " + t("common.error")),
    }),
    onSubmit: async (values, { resetForm }) => {
      try {
        const response = await API.Auth.contact(values);
        if (response.status === 201) {
          toast.success(t("common.success"), {
            position: "top-right",
            autoClose: 3000,
          });
          resetForm();
        } else {
          toast.error(
            t("common.error"),
            { position: "top-right", autoClose: 3000 }
          );
        }
      } catch (error) {
        console.error(error);
        toast.error(t("common.error"), {
          position: "top-right",
          autoClose: 3000,
        });
      }
    },
  });

  return (
    <>
      <Helmet>
        <title>{t("contact.title")} | Octopus</title>
        <meta
          name="description"
          content={t("contact.subtitle")}
        />
        <meta property="og:title" content={`${t("contact.title")} | Octopus`} />
        <meta
          property="og:description"
          content={t("contact.subtitle")}
        />
        <meta property="og:type" content="website" />
      </Helmet>

      <div className="container mx-auto py-16 px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="space-y-8">
            <h2 className="text-4xl font-extrabold text-primary-blue mb-6">
              {t("contact.title")}
            </h2>
            <p className="text-gray-700 max-w-lg">
              {t("contact.subtitle")}
            </p>

            {contactInfo && (
              <div className="space-y-8 mt-10">
                <div className="flex items-center space-x-6 p-4 bg-blue-50 rounded-lg shadow-sm border border-blue-100">
                  <div className="bg-white p-3 rounded-full shadow-md">
                    <HiOutlinePhone className="text-primary-blue w-8 h-8" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">{t("contact.phone", "Phone")}</h3>
                    <a href={`tel:${contactInfo.phone}`} className="hover:underline text-xl font-bold text-gray-900 mt-1 block">{contactInfo.phone}</a>
                  </div>
                </div>

                <div className="flex items-center space-x-6 p-4 bg-blue-50 rounded-lg shadow-sm border border-blue-100">
                  <div className="bg-white p-3 rounded-full shadow-md">
                    <HiOutlineMail className="text-primary-blue w-8 h-8" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">{t("contact.email", "Email")}</h3>
                    <a href={`mailto:${contactInfo.email}`} className="hover:underline text-xl font-bold text-gray-900 mt-1 block">{contactInfo.email}</a>
                  </div>
                </div>
              </div>
            )}
          </div>

          <form
            onSubmit={formik.handleSubmit}
            className="bg-white p-8 rounded-lg shadow-lg space-y-6"
            noValidate
          >
            <div>
              <label
                htmlFor="full_name"
                className="block text-sm font-medium text-gray-700"
              >
                {t("contact.form.name")}
              </label>
              <input
                id="full_name"
                name="full_name"
                type="text"
                placeholder={t("contact.form.name_placeholder")}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.full_name}
                className={`block w-full rounded-md border px-3 py-2 ${formik.touched.full_name && formik.errors.full_name
                  ? "border-red-500"
                  : "border-gray-300"
                  } focus:outline-none focus:ring-1 focus:ring-primary-blue text-gray-900`}
              />
              {formik.touched.full_name && formik.errors.full_name && (
                <p className="mt-1 text-sm text-red-600">
                  {formik.errors.full_name}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                {t("contact.form.email")}
              </label>
              <input
                id="email"
                name="email"
                type="email"
                placeholder={t("contact.form.email_placeholder")}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.email}
                className={`block w-full rounded-md border px-3 py-2 ${formik.touched.email && formik.errors.email
                  ? "border-red-500"
                  : "border-gray-300"
                  } focus:outline-none focus:ring-1 focus:ring-primary-blue text-gray-900`}
              />
              {formik.touched.email && formik.errors.email && (
                <p className="mt-1 text-sm text-red-600">
                  {formik.errors.email}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="subject"
                className="block text-sm font-medium text-gray-700"
              >
                {t("contact.form.subject")}
              </label>
              <input
                id="subject"
                name="subject"
                type="text"
                placeholder={t("contact.form.subject_placeholder")}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.subject}
                className={`block w-full rounded-md border px-3 py-2 ${formik.touched.subject && formik.errors.subject
                  ? "border-red-500"
                  : "border-gray-300"
                  } focus:outline-none focus:ring-1 focus:ring-primary-blue text-gray-900`}
              />
              {formik.touched.subject && formik.errors.subject && (
                <p className="mt-1 text-sm text-red-600">
                  {formik.errors.subject}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="message"
                className="block text-sm font-medium text-gray-700"
              >
                {t("contact.form.message")}
              </label>
              <textarea
                id="message"
                name="message"
                rows={4}
                placeholder={t("contact.form.message_placeholder")}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.message}
                className={`block w-full rounded-md border px-3 py-2 ${formik.touched.message && formik.errors.message
                  ? "border-red-500"
                  : "border-gray-300"
                  } focus:outline-none focus:ring-1 focus:ring-primary-blue text-gray-900`}
              />
              {formik.touched.message && formik.errors.message && (
                <p className="mt-1 text-sm text-red-600">
                  {formik.errors.message}
                </p>
              )}
            </div>

            <button
              type="submit"
              className="w-full bg-indigo-600 text-white py-3 rounded-md font-semibold hover:bg-indigo-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:indigo-600"
            >
              {t("contact.form.send")}
            </button>
          </form>
        </div>

        <ToastContainer />
      </div>
    </>
  );
};

export default ContactPage;
