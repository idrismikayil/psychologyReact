import React, { useState, useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import API from "@/api";
import { FiUser, FiMail, FiEye, FiEyeOff, FiHash } from "react-icons/fi";
import UserImg from "../../shared/media/imgs/userImg.jpg";
import ProfileTestResults from "../../shared/components/ProfileTestResults";
import { useUser } from "@/context/UserContext";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";

interface ProfileFormValues {
  first_name: string;
  last_name: string;
  email: string;
}

interface PasswordFormValues {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

const InputField = ({
  id,
  name,
  type = "text",
  placeholder,
  formik,
  isPassword = false,
}: {
  id: string;
  name: keyof ProfileFormValues | keyof PasswordFormValues;
  type?: string;
  placeholder?: string;
  formik: any;
  isPassword?: boolean;
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const inputType = isPassword ? (showPassword ? "text" : "password") : type;
  const { t } = useTranslation();

  const hasError = formik.touched[name] && formik.errors[name];

  const getLabel = () => {
    if (id === "first_name") return t("profile.fields.name");
    if (id === "last_name") return t("profile.fields.surname");
    if (id === "email") return t("profile.fields.email");
    if (id === "currentPassword") return t("profile.fields.current_pass");
    if (id === "newPassword") return t("profile.fields.new_pass");
    if (id === "confirmPassword") return t("profile.fields.confirm_pass");
    return id;
  }

  return (
    <div className="relative mb-4">
      <label
        htmlFor={id}
        className="block text-sm font-medium text-gray-900 mb-1"
      >
        {getLabel()}
      </label>

      <div className="relative">
        <input
          id={id}
          name={name as string}
          type={inputType}
          placeholder={placeholder || (getLabel() + "...")}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values[name as string] || ""}
          className={`block w-full rounded-md bg-white px-3 pr-10 py-1.5 text-base text-gray-900 border ${hasError ? "border-red-500" : "border-blue-500"
            } focus:outline-none focus:ring-1 focus:ring-blue-500 placeholder:text-gray-400 sm:text-sm`}
          autoComplete={
            isPassword
              ? "current-password"
              : id.toLowerCase() === "email"
                ? "email"
                : undefined
          }
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-500"
            tabIndex={-1}
          >
            {showPassword ? <FiEyeOff /> : <FiEye />}
          </button>
        )}
      </div>

      {hasError && (
        <p className="mt-1 text-sm text-red-500">
          {formik.errors[name as string]}
        </p>
      )}
    </div>
  );
};

const ProfilePage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("info");
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [userData, setUserData] = useState<{
    id?: string | number;
    first_name: string;
    last_name: string;
    email: string;
    image: string | null;
  }>({
    id: "",
    first_name: "",
    last_name: "",
    email: "",
    image: null,
  });

  const tabs = [
    { id: "info", label: t("profile.tabs.info") },
    { id: "update", label: t("profile.tabs.update") },
    { id: "avatar", label: t("profile.tabs.avatar") },
    { id: "password", label: t("profile.tabs.password") },
  ];

  const location = useLocation();
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const paypal = params.get("paypal");
    if (!paypal) return;
    sessionStorage.setItem("paypal", "1");
    if (paypal === "success") {
      toast.success(t("common.success"));
       refreshUser();
    }
  }, [location.search, t]);


  const [profileStatus, setProfileStatus] = useState<{
    success?: string;
    error?: string;
  }>({});

  const getProfile = async () => {
    try {
      const response = await API.Auth.profile();
      if (response.status === 200) {
        setUserData(response.data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    getProfile();
  }, []);

  const profileFormik = useFormik<ProfileFormValues>({
    enableReinitialize: true,
    initialValues: {
      first_name: userData.first_name,
      last_name: userData.last_name,
      email: userData.email || "",
    },
    validationSchema: Yup.object({
      first_name: Yup.string().required(t("profile.fields.name") + " " + t("common.error")),
      last_name: Yup.string().required(t("profile.fields.surname") + " " + t("common.error")),
      email: Yup.string()
        .email("Doğru email daxil edin")
        .required(t("profile.fields.email") + " " + t("common.error")),
    }),
    onSubmit: async (values, { setSubmitting }) => {
      try {
        const data: any = {};
        if (values.first_name.trim()) data.first_name = values.first_name;
        if (values.last_name.trim()) data.last_name = values.last_name;
        if (values.email.trim()) data.email = values.email;

        const response = await API.Auth.profileUpdate(data);
        if (response.status === 200) {
          setUserData((prev) => ({
            ...prev,
            ...response.data,
            image: prev.image,
          }));
          setProfileStatus({ success: t("common.success") });
          await getProfile();
        } else {
          setProfileStatus({ error: t("common.error") });
        }
      } catch (err) {
        setProfileStatus({ error: "Xəta baş verdi" });
      } finally {
        setSubmitting(false);
      }
    },
  });
  const { refreshUser, user } = useUser();
  // ------------------ Profile Picture Update ------------------
  const avatarFormik = useFormik({
    initialValues: { image: null },
    onSubmit: async (_, { setStatus, setSubmitting }) => {
      if (!avatarFile) return;

      try {
        const formData = new FormData();
        formData.append("image", avatarFile);

        const response = await API.Auth.profilePPUpdate(formData);
        if (response.status === 200) {
          setStatus({ success: t("common.success") });
          setAvatarFile(null);
          setAvatarPreview(null);
          await getProfile();
          refreshUser();
        } else {
          setStatus({ error: t("common.error") });
        }
      } catch (err) {
        setStatus({ error: "Xəta baş verdi" });
      } finally {
        setSubmitting(false);
      }
    },
  });

  // ------------------ Password Update ------------------
  const passwordFormik = useFormik<PasswordFormValues>({
    initialValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
    validationSchema: Yup.object({
      currentPassword: Yup.string().required(t("profile.fields.current_pass") + " " + t("common.error")),
      newPassword: Yup.string()
        .min(6, "min 6")
        .required(t("profile.fields.new_pass") + " " + t("common.error")),
      confirmPassword: Yup.string()
        .oneOf([Yup.ref("newPassword")], "Mismatch")
        .required(t("profile.fields.confirm_pass") + " " + t("common.error")),
    }),
    onSubmit: async (values, { setSubmitting, resetForm, setStatus }) => {
      try {
        const data = {
          old_password: values.currentPassword,
          new_password: values.newPassword,
        };
        const response = await API.Auth.profilePasswordUpdate(data);
        if (response.status === 200) {
          setStatus({ success: t("common.success") });
          resetForm();
        } else {
          setStatus({ error: t("common.error") });
        }
      } catch (err) {
        setStatus({ error: "Xəta baş verdi" });
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <>
      <div className="container mx-auto mt-10 mb-11 bg-white p-8 rounded shadow">
        <h1 className="text-3xl font-semibold mb-6">{t("profile.title")}</h1>

        <div className="border-b border-gray-300 mb-6">
          <div className="flex gap-4 overflow-x-auto scrollbar-hide whitespace-nowrap">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                className={`px-4 py-2 border-b-2 font-medium text-sm shrink-0 ${activeTab === tab.id
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-600 hover:text-blue-600"
                  }`}
                onClick={() => setActiveTab(tab.id)}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          {/* ---------- INFO TAB ---------- */}
          {activeTab === "info" && (
            <div>
              <div className="flex items-center mb-5">
                <div className="flex-shrink-0 bg-blue-100 text-blue-600 rounded-full p-3 mr-4">
                  <FiUser size={24} />
                </div>
                <div>
                  <p className="text-gray-500 text-sm">{t("profile.fields.name")} & {t("profile.fields.surname")}</p>
                  <p className="text-lg font-medium text-gray-900">
                    {userData.first_name} {userData.last_name}
                  </p>
                </div>
              </div>
              <div className="flex items-center mb-5">
                <div className="flex-shrink-0 bg-blue-100 text-blue-600 rounded-full p-3 mr-4">
                  <FiHash size={24} />
                </div>
                <div>
                  <p className="text-gray-500 text-sm">{t("profile.fields.active_test_count")}</p>
                  <p className="text-lg font-medium text-gray-900">
                    {user?.active_test_count}
                  </p>
                </div>
              </div>

              <div className="flex items-center">
                <div className="flex-shrink-0 bg-green-100 text-green-600 rounded-full p-3 mr-4">
                  <FiMail size={24} />
                </div>
                <div>
                  <p className="text-gray-500 text-sm">{t("profile.fields.email")}</p>
                  <p className="text-lg font-medium text-gray-900">
                    {userData.email}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* ---------- PROFILE INFO UPDATE TAB ---------- */}
          {activeTab === "update" && (
            <form
              onSubmit={profileFormik.handleSubmit}
              noValidate
              className="space-y-6"
            >
              <InputField
                id="first_name"
                name="first_name"
                formik={profileFormik}
              />
              <InputField
                id="last_name"
                name="last_name"
                formik={profileFormik}
              />
              <InputField
                id="email"
                name="email"
                type="email"
                formik={profileFormik}
              />

              {profileStatus.success && (
                <p className="text-green-600 font-medium">
                  {profileStatus.success}
                </p>
              )}
              {profileStatus.error && (
                <p className="text-red-600 font-medium">
                  {profileStatus.error}
                </p>
              )}

              <button
                type="submit"
                disabled={profileFormik.isSubmitting}
                className="bg-blue-500 disabled:bg-blue-300 text-white px-5 py-2 rounded hover:bg-blue-600 transition"
              >
                {t("profile.buttons.update")}
              </button>
            </form>
          )}

          {/* ---------- PROFILE PICTURE UPDATE TAB ---------- */}
          {activeTab === "avatar" && (
            <form onSubmit={avatarFormik.handleSubmit} className="space-y-6">
              <div className="flex items-center gap-6">
                <div className="relative w-24 h-24">
                  <img
                    src={avatarPreview || userData.image || UserImg}
                    alt="Profil Şəkli"
                    className="w-24 h-24 rounded-full object-cover border-2 border-blue-500"
                  />
                  <label
                    htmlFor="avatar"
                    className="absolute inset-0 bg-black bg-opacity-40 rounded-full flex items-center justify-center text-white opacity-0 hover:opacity-100 transition-opacity cursor-pointer"
                    title="Profil şəklini dəyiş"
                  >
                    <span className="text-sm">✎</span>
                  </label>
                  <input
                    id="avatar"
                    name="avatar"
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.currentTarget.files?.[0] ?? null;
                      setAvatarFile(file);
                      if (file) {
                        const reader = new FileReader();
                        reader.onloadend = () =>
                          setAvatarPreview(reader.result as string);
                        reader.readAsDataURL(file);
                      } else {
                        setAvatarPreview(null);
                      }
                    }}
                    className="hidden"
                  />
                </div>
              </div>

              {avatarFormik.status?.success && (
                <p className="text-green-600 font-medium">
                  {avatarFormik.status.success}
                </p>
              )}
              {avatarFormik.status?.error && (
                <p className="text-red-600 font-medium">
                  {avatarFormik.status.error}
                </p>
              )}

              <button
                type="submit"
                disabled={avatarFormik.isSubmitting || !avatarFile}
                className="bg-blue-500 disabled:bg-blue-300 text-white px-5 py-2 rounded hover:bg-blue-600 transition"
              >
                {t("profile.buttons.update")}
              </button>
            </form>
          )}

          {/* ---------- PASSWORD TAB ---------- */}
          {activeTab === "password" && (
            <form
              onSubmit={passwordFormik.handleSubmit}
              noValidate
              className="space-y-6"
            >
              <InputField
                id="currentPassword"
                name="currentPassword"
                isPassword
                formik={passwordFormik}
              />
              <InputField
                id="newPassword"
                name="newPassword"
                isPassword
                formik={passwordFormik}
              />
              <InputField
                id="confirmPassword"
                name="confirmPassword"
                isPassword
                formik={passwordFormik}
              />

              {passwordFormik.status?.success && (
                <p className="text-green-600 font-medium">
                  {passwordFormik.status.success}
                </p>
              )}
              {passwordFormik.status?.error && (
                <p className="text-red-600 font-medium">
                  {passwordFormik.status.error}
                </p>
              )}

              <button
                type="submit"
                disabled={passwordFormik.isSubmitting}
                className="bg-blue-500 disabled:bg-blue-300 text-white px-5 py-2 rounded hover:bg-blue-600 transition"
              >
                {t("profile.buttons.change_pass")}
              </button>
            </form>
          )}
        </div>
      </div>

      <ProfileTestResults user={userData} />
    </>
  );
};

export default ProfilePage;
