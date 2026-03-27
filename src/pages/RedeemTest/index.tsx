import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useUser } from "@/context/UserContext";
import API from "@/api";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";

interface InvitationInfo {
  id: number;
  sender_email: string;
  recipient_email: string;
  credit_count: number;
  is_shareable: boolean;
  status: string;
  expires_at: string;
}

const RedeemTest: React.FC = () => {
  const { token } = useParams<{ token: string }>();
  const { user, refreshUser, logout, loading: userLoading } = useUser();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [invitation, setInvitation] = useState<InvitationInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [redeemed, setRedeemed] = useState(false);
  const [redeeming, setRedeeming] = useState(false);

  useEffect(() => {
    if (!token) return;
    API.Auth.validateRedeemToken(token)
      .then((res) => {
        setInvitation(res.data);
      })
      .catch(() => {
        setError(t("licenses.redeem_invalid"));
      })
      .finally(() => setLoading(false));
  }, [token]);

  const handleRedeem = async () => {
    if (!token) return;
    setRedeeming(true);
    try {
      await API.Auth.redeemInvitation(token);
      setRedeemed(true);
      refreshUser();
      toast.success(t("licenses.redeem_success"));
    } catch (error: any) {
      const msg =
        error?.response?.data?.detail || t("common.error");
      toast.error(msg);
    } finally {
      setRedeeming(false);
    }
  };

  const handleLoginRedirect = () => {
    localStorage.setItem("pendingRedeemUrl", `/redeem/${token}`);
    navigate("/login");
  };

  const handleRegisterRedirect = () => {
    localStorage.setItem("pendingRedeemUrl", `/redeem/${token}`);
    navigate("/register");
  };

  if (loading || userLoading) {
    return (
      <div className="flex h-dvh items-center justify-center">
        <div className="text-gray-500 text-lg">{t("common.loading") || "Loading..."}</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-dvh flex-col items-center justify-center px-6">
        <div className="bg-white shadow rounded-lg p-8 max-w-md w-full text-center">
          <div className="text-red-500 text-5xl mb-4">!</div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            {t("licenses.redeem_invalid")}
          </h2>
          <p className="text-gray-500 mb-6">{error}</p>
          <Link
            to="/"
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            {t("common.go_home") || "Go to Home"}
          </Link>
        </div>
      </div>
    );
  }

  if (redeemed) {
    return (
      <div className="flex h-dvh flex-col items-center justify-center px-6">
        <div className="bg-white shadow rounded-lg p-8 max-w-md w-full text-center">
          <div className="text-green-500 text-5xl mb-4">&#10003;</div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            {t("licenses.redeem_success")}
          </h2>
          <p className="text-gray-500 mb-6">
            {t("licenses.redeem_success_description") || "Your test credit has been added to your account."}
          </p>
          <button
            onClick={() => navigate("/profile")}
            className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 transition"
          >
            {t("header.profile") || "Go to Profile"}
          </button>
        </div>
      </div>
    );
  }

  if (!invitation) return null;

  const isExpiredOrUsed = invitation.status !== "PENDING";

  if (isExpiredOrUsed) {
    return (
      <div className="flex h-dvh flex-col items-center justify-center px-6">
        <div className="bg-white shadow rounded-lg p-8 max-w-md w-full text-center">
          <div className="text-yellow-500 text-5xl mb-4">!</div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            {t("licenses.redeem_invalid")}
          </h2>
          <p className="text-gray-500 mb-6">
            {invitation.status === "REDEEMED"
              ? t("licenses.already_redeemed") || "This invitation has already been used."
              : invitation.status === "EXPIRED"
              ? t("licenses.token_expired") || "This invitation has expired."
              : t("licenses.token_revoked") || "This invitation has been revoked."}
          </p>
          <Link
            to="/"
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            {t("common.go_home") || "Go to Home"}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-dvh flex-col items-center justify-center px-6">
      <div className="bg-white shadow rounded-lg p-8 max-w-md w-full text-center">
        <div className="text-blue-500 text-5xl mb-4">&#127873;</div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          {t("licenses.redeem_title")}
        </h2>
        <p className="text-gray-500 mb-4">
          {t("licenses.redeem_description")}
        </p>

        <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left space-y-2">
          <p className="text-sm">
            <span className="text-gray-500">{t("licenses.redeem_from")}:</span>{" "}
            <span className="font-medium text-gray-900">{invitation.sender_email}</span>
          </p>
          <p className="text-sm">
            <span className="text-gray-500">{t("licenses.credit_count") || "Test Credits"}:</span>{" "}
            <span className="font-medium text-gray-900">{invitation.credit_count}</span>
          </p>
          <p className="text-sm">
            <span className="text-gray-500">{t("licenses.redeem_expires")}:</span>{" "}
            <span className="font-medium text-gray-900">
              {new Date(invitation.expires_at).toLocaleDateString()}
            </span>
          </p>
        </div>

        {user ? (
          !invitation.is_shareable &&
          user.email?.toLowerCase() !== invitation.recipient_email.toLowerCase() ? (
            <div className="space-y-4">
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-sm text-red-700">
                  {t("licenses.restricted_to_recipient")}
                </p>
                <p className="text-xs text-red-500 mt-1">
                  {t("licenses.restricted_hint")}: {invitation.recipient_email}
                </p>
              </div>
              <p className="text-xs text-gray-500">
                {t("licenses.logged_in_as")}: <span className="font-medium">{user.email}</span>
              </p>
              <button
                onClick={() => {
                  localStorage.setItem("pendingRedeemUrl", `/redeem/${token}`);
                  logout();
                  navigate("/login");
                }}
                className="w-full bg-indigo-600 text-white px-6 py-2.5 rounded hover:bg-indigo-500 transition font-medium"
              >
                {t("licenses.switch_account")}
              </button>
            </div>
          ) : (
            <button
              onClick={handleRedeem}
              disabled={redeeming}
              className="w-full bg-blue-500 disabled:bg-blue-300 text-white px-6 py-2.5 rounded hover:bg-blue-600 transition font-medium"
            >
              {redeeming
                ? (t("common.loading") || "Loading...")
                : t("licenses.redeem_button")}
            </button>
          )
        ) : (
          <div className="space-y-3">
            <p className="text-sm text-gray-600 mb-3">
              {t("licenses.redeem_login_required")}
            </p>
            <button
              onClick={handleLoginRedirect}
              className="w-full bg-indigo-600 text-white px-6 py-2.5 rounded hover:bg-indigo-500 transition font-medium"
            >
              {t("header.login")}
            </button>
            <button
              onClick={handleRegisterRedirect}
              className="w-full bg-white text-indigo-600 border border-indigo-600 px-6 py-2.5 rounded hover:bg-indigo-50 transition font-medium"
            >
              {t("auth.register")}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default RedeemTest;
