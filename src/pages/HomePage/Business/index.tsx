import { useNavigate } from 'react-router-dom'
import team from '../../../shared/media/b8b57763-111c-4efb-88fb-ea4261150657.jpg'
import { useTranslation } from "react-i18next";
import { useUser } from "@/context/UserContext";
import { toast, ToastContainer } from "react-toastify";

const Business = () => {
    const { t } = useTranslation();
    const { user } = useUser();
    const navigate = useNavigate();

    const handleStartClick = () => {
        if (!user) {
            toast.error("Zəhmət olmasa, əvvəlcə daxil olun");
            return;
        }

        if (user?.available_test_count === 0) {
            toast.error("Test etmək üçün hesabınızda aktiv test paketi olmalıdır");
            return;
        }

        if (!user?.available_test_count) {
            toast.error("Test etmək üçün hesabınızda aktiv test paketi olmalıdır");
            return;
        }

        navigate("/test");
    };

    return (
        <div className="h-[90vh] relative">
            <span className='absolute inset-0 bg-primary-blue z-10 opacity-50'></span>
            <span className='absolute inset-0 bg-[#0f172b] z-10 opacity-50'></span>
            <img className='absolute w-full h-full object-cover' src={team} alt="team" />

            <div className="container px-2 mx-auto pt-5 relative z-20 text-white flex flex-col items-center justify-center h-full">
                <h2 className='text-3xl md:text-5xl w-1/2 mb-6 text-center leading-tight font-bold'>
                    {t("home.business.title")}
                </h2>
                <p className='text-lg w-2/3 mb-8 text-center'>
                    {t("home.business.description")}
                </p>

                <button
                    onClick={handleStartClick}
                    className='border-4 font-medium px-12 py-3 border-white text-xl hover:bg-white hover:text-emerald-900 duration-300'
                >
                    {t("home.business.start_button")}
                </button>
            </div>

            <ToastContainer />
        </div>
    )
}

export default Business;
