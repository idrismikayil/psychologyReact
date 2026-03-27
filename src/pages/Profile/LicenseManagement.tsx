import React, { useState, useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import API from "@/api";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import { useUser } from "@/context/UserContext";

interface Invitation {
  id: number;
  recipient_email: string;
  credit_count: number;
  is_shareable: boolean;
  status: string;
  token: string;
  created_at: string;
  expires_at: string;
  redeemed_at: string | null;
  is_expired: boolean;
  redeemed_by_email: string | null;
}

const statusColors: Record<string, string> = {
  PENDING: "bg-yellow-100 text-yellow-800",
  REDEEMED: "bg-green-100 text-green-800",
  REVOKED: "bg-gray-100 text-gray-800",
  EXPIRED: "bg-red-100 text-red-800",
};

const LicenseManagement: React.FC = () => {
  const { t } = useTranslation();
  const { user, refreshUser } = useUser();
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [loading, setLoading] = useState(false);
  const [credits, setCredits] = useState({
    total: 0,
    reserved: 0,
    available: 0,
  });
  const [revokeTarget, setRevokeTarget] = useState<number | null>(null);

  const fetchInvitations = async () => {
    setLoading(true);
    try {
      const res = await API.Auth.myInvitations();
      if (res.status === 200) {
        setInvitations(res.data.invitations);
        setCredits({
          total: res.data.total_credits,
          reserved: res.data.reserved_credits,
          available: res.data.available_credits,
        });
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInvitations();
  }, []);

  const formik = useFormik({
    initialValues: {
      recipient_email: "",
      credit_count: 1,
      is_shareable: false,
      expires_in_days: 7,
    },
    validationSchema: Yup.object({
      recipient_email: Yup.string()
        .email(t("licenses.recipient_email") + " " + t("common.error"))
        .required(t("licenses.recipient_email") + " " + t("common.error")),
      credit_count: Yup.number()
        .min(1, t("licenses.credit_count_min") || "Minimum 1")
        .required(),
      expires_in_days: Yup.number().min(1).max(30),
    }),
    onSubmit: async (values, { resetForm, setSubmitting }) => {
      try {
        const res = await API.Auth.sendInvitation(values);
        if (res.status === 201) {
          toast.success(t("licenses.send_success"));
          resetForm();
          fetchInvitations();
          refreshUser();
        }
      } catch (error: any) {
        const msg =
          error?.response?.data?.non_field_errors?.[0] ||
          error?.response?.data?.recipient_email?.[0] ||
          error?.response?.data?.detail ||
          t("licenses.send_error");
        toast.error(msg);
      } finally {
        setSubmitting(false);
      }
    },
  });

  const handleRevoke = async () => {
    if (!revokeTarget) return;
    try {
      await API.Auth.revokeInvitation(revokeTarget);
      toast.success(t("licenses.revoke_success"));
      fetchInvitations();
      refreshUser();
    } catch {
      toast.error(t("common.error"));
    } finally {
      setRevokeTarget(null);
    }
  };

  const getStatusLabel = (s: string) => {
    const map: Record<string, string> = {
      PENDING: t("licenses.status_pending"),
      REDEEMED: t("licenses.status_redeemed"),
      REVOKED: t("licenses.status_revoked"),
      EXPIRED: t("licenses.status_expired"),
    };
    return map[s] || s;
  };

  return (
    <div className="space-y-8">
      {/* Credit Summary */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-blue-50 rounded-lg p-4 text-center">
          <p className="text-sm text-gray-500">{t("licenses.credits_total")}</p>
          <p className="text-2xl font-bold text-blue-700">{credits.total}</p>
        </div>
        <div className="bg-yellow-50 rounded-lg p-4 text-center">
          <p className="text-sm text-gray-500">{t("licenses.credits_reserved")}</p>
          <p className="text-2xl font-bold text-yellow-700">{credits.reserved}</p>
        </div>
        <div className="bg-green-50 rounded-lg p-4 text-center">
          <p className="text-sm text-gray-500">{t("licenses.credits_available")}</p>
          <p className="text-2xl font-bold text-green-700">{credits.available}</p>
        </div>
      </div>

      {/* Send Invitation Form */}
      <div className="bg-gray-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4">{t("licenses.send_title")}</h3>
        <form onSubmit={formik.handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="recipient_email"
              className="block text-sm font-medium text-gray-900 mb-1"
            >
              {t("licenses.recipient_email")}
            </label>
            <input
              id="recipient_email"
              name="recipient_email"
              type="email"
              placeholder={t("licenses.recipient_email_placeholder")}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.recipient_email}
              className={`block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 border ${
                formik.touched.recipient_email && formik.errors.recipient_email
                  ? "border-red-500"
                  : "border-blue-500"
              } focus:outline-none focus:ring-1 focus:ring-blue-500 placeholder:text-gray-400 sm:text-sm`}
            />
            {formik.touched.recipient_email && formik.errors.recipient_email && (
              <p className="mt-1 text-sm text-red-500">{formik.errors.recipient_email}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="credit_count"
              className="block text-sm font-medium text-gray-900 mb-1"
            >
              {t("licenses.credit_count") || "Number of Tests"}
            </label>
            <input
              id="credit_count"
              name="credit_count"
              type="number"
              min={1}
              max={credits.available}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.credit_count}
              className={`block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 border ${
                formik.touched.credit_count && formik.errors.credit_count
                  ? "border-red-500"
                  : "border-blue-500"
              } focus:outline-none focus:ring-1 focus:ring-blue-500 placeholder:text-gray-400 sm:text-sm`}
            />
            {formik.touched.credit_count && formik.errors.credit_count && (
              <p className="mt-1 text-sm text-red-500">{formik.errors.credit_count}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="expires_in_days"
              className="block text-sm font-medium text-gray-900 mb-1"
            >
              {t("licenses.expiry_days")}
            </label>
            <select
              id="expires_in_days"
              name="expires_in_days"
              onChange={formik.handleChange}
              value={formik.values.expires_in_days}
              className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 border border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 sm:text-sm"
            >
              <option value={1}>1 {t("licenses.day")}</option>
              <option value={3}>3 {t("licenses.days")}</option>
              <option value={7}>7 {t("licenses.days")}</option>
              <option value={14}>14 {t("licenses.days")}</option>
              <option value={30}>30 {t("licenses.days")}</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <input
              id="is_shareable"
              name="is_shareable"
              type="checkbox"
              checked={formik.values.is_shareable}
              onChange={formik.handleChange}
              className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <label htmlFor="is_shareable" className="text-sm text-gray-700">
              {t("licenses.allow_sharing")}
            </label>
            <span className="text-xs text-gray-400">
              ({t("licenses.allow_sharing_hint")})
            </span>
          </div>

          <button
            type="submit"
            disabled={formik.isSubmitting || credits.available <= 0}
            className="bg-blue-500 disabled:bg-blue-300 text-white px-5 py-2 rounded hover:bg-blue-600 transition"
          >
            {formik.isSubmitting ? t("licenses.sending") : t("licenses.send_button")}
          </button>

          {credits.available <= 0 && (
            <p className="text-sm text-red-500">{t("licenses.no_available_credits")}</p>
          )}
        </form>
      </div>

      {/* Invitations Table */}
      <div>
        <h3 className="text-lg font-semibold mb-4">{t("licenses.my_invitations")}</h3>
        {loading ? (
          <div className="text-center text-gray-500">{t("common.loading") || "Loading..."}</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    {t("licenses.recipient")}
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    {t("licenses.redeemed_by") || "Used by"}
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    {t("licenses.credit_count") || "Tests"}
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    {t("licenses.shareable") || "Shareable"}
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    {t("licenses.status")}
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    {t("licenses.sent_date")}
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    {t("licenses.expires")}
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    {t("licenses.actions")}
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {invitations.length > 0 ? (
                  invitations.map((inv) => (
                    <tr key={inv.id}>
                      <td className="px-4 py-3 text-sm text-gray-900">{inv.recipient_email}</td>
                      <td className="px-4 py-3 text-sm text-gray-900">
                        {inv.redeemed_by_email || "-"}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900">{inv.credit_count}</td>
                      <td className="px-4 py-3 text-sm text-gray-900">
                        {inv.is_shareable ? (
                          <span className="text-green-600">{t("common.yes") || "Yes"}</span>
                        ) : (
                          <span className="text-gray-400">{t("common.no") || "No"}</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            statusColors[inv.status] || ""
                          }`}
                        >
                          {getStatusLabel(inv.status)}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-500">
                        {new Date(inv.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-500">
                        {new Date(inv.expires_at).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3 text-sm">
                        {inv.status === "PENDING" && (
                          <button
                            onClick={() => setRevokeTarget(inv.id)}
                            className="text-red-600 hover:text-red-800 font-medium text-sm"
                          >
                            {t("licenses.revoke")}
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={8} className="px-4 py-4 text-center text-sm text-gray-500">
                      {t("licenses.no_invitations")}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
      {/* Revoke Confirmation Modal */}
      {revokeTarget !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black bg-opacity-40"
            onClick={() => setRevokeTarget(null)}
          />
          <div className="relative bg-white rounded-lg shadow-lg p-6 max-w-sm w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {t("licenses.revoke_title")}
            </h3>
            <p className="text-sm text-gray-600 mb-6">
              {t("licenses.revoke_confirm")}
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setRevokeTarget(null)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition"
              >
                {t("licenses.cancel")}
              </button>
              <button
                onClick={handleRevoke}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 transition"
              >
                {t("licenses.revoke")}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LicenseManagement;
