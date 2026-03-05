import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import API from "@/api";
import { toast } from "react-toastify";
import { Spin } from "antd";
import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import { useUser } from "@/context/UserContext";

interface Plan {
  id: number | string;
  title: string;
  tests_count: number;
  price: string;
  customerPrice: string;
  currency: string;
  short_description: string;
  is_active: boolean;
}

export default function Packages() {
  const { t } = useTranslation();
  const [plans, setPlans] = useState<Plan[]>([]);
  const [selectedInfo, setSelectedInfo] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { refreshUser } = useUser();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const paypal = params.get("paypal");
    const token = params.get("token");
    const payerID = params.get("PayerID");

    if (paypal === "0") {
      toast.error(t("plans.payment_fail"));
    }

    if (!token || localStorage.getItem(`paypal-${token}`)) return;

    if (paypal === "1" && token) {
      setLoading(true);
      API.Auth.buysuccess({ params: { token: token, payer_id: payerID } })
        .then(async () => {
          localStorage.setItem(`paypal-${token}`, "done");
          await refreshUser();
          navigate("/profile/?paypal=success", { replace: true });
        })
        .catch(() => {
          if (localStorage.getItem(`paypal-${token}`) === "done") return;
          toast.error(t("plans.payment_error"));
        })
        .finally(() => setLoading(false));
    }
  }, [location.search, navigate, t]);

  const getPlans = async () => {
    try {
      const response = await API.Auth.plans();
      if (response.status === 200) {
        setPlans(response.data);
      } else {
        throw new Error(t("plans.no_plan"));
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getPlans();
  }, []);

  const toggleInfo = (id: string | number) => {
    setSelectedInfo((prev) => (prev === String(id) ? null : String(id)));
  };

  const handleBuy = async (planId: string | number) => {
    try {
      setLoading(true);
      const response = await API.Auth.buyplan({ plan_id: planId });
      if (response.data.approve_url) {
        window.location.href = response.data.approve_url;
      } else {
        toast.error(t("plans.redirect_error"));
      }
    } catch (err) {
      console.error(err);
      toast.error(t("plans.payment_error"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>{t("plans.title")} | Octopus</title>
        <meta
          name="description"
          content="Octopus planları ilə fərdi testlər və psixologiya xidmətlərini əldə edin."
        />
        <meta property="og:title" content={`${t("plans.title")} | Octopus`} />
        <meta
          property="og:description"
          content="Octopus planları ilə fərdi testlər və psixologiya xidmətlərini əldə edin."
        />
        <meta property="og:type" content="website" />
      </Helmet>

      <div className="max-w-7xl mx-auto p-6">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Spin size="large" />
          </div>
        ) : plans?.length ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {plans.map((plan) => (
              <div
                key={plan.id}
                className={`cursor-pointer flex flex-col rounded-lg border 
                  border-yellow-500 bg-white p-8 text-center 
                  transition hover:border-blue-600 hover:shadow-xl hover:shadow-blue-200`}
              >
                <span className="text-sm font-semibold tracking-widest uppercase text-gray-700">
                  {plan.title}
                </span>

                <div className="mt-4 flex items-center justify-center text-5xl font-extrabold text-gray-900">
                  {plan.customerPrice}
                  <span className="text-xl font-normal ml-1">{plan.currency}</span>
                </div>

                <hr className="my-6 border-gray-300" />

                <ul className="mb-6 space-y-3 text-left">
                  <li className="flex items-center text-gray-600">
                    <svg
                      className="w-5 h-5 text-gray-400 mr-2 flex-shrink-0"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                    {t("plans.test_count")}: {plan.tests_count}
                  </li>
                </ul>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleInfo(plan.id);
                  }}
                  className="mb-4 text-blue-600 font-medium hover:underline focus:outline-none"
                >
                  {selectedInfo === `${plan.id}` ? t("plans.close_info") : t("plans.more_info")}
                </button>

                {selectedInfo === `${plan.id}` && (
                  <div className="my-4 p-4 border-l-4 rounded-lg shadow-sm animate-fadeIn bg-blue-50 border-blue-500 text-blue-600">
                    <div className="flex items-start">
                      <p className="text-sm leading-relaxed">{plan.short_description}</p>
                    </div>
                  </div>
                )}

                <button
                  onClick={(e) => handleBuy(plan.id)}
                  className="mt-auto bg-blue-600 text-white font-semibold py-3 rounded hover:bg-blue-700 transition"
                >
                  {t("plans.buy_now")}
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div
            className="flex w-full items-center justify-center p-10"
            style={{ fontSize: "30px" }}
          >
            {t("plans.no_plan")}
          </div>
        )}
      </div>
    </>
  );
}
