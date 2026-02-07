// bloqlar, haqqımızda, əlaqə, testlər, şəxsiyyət testləri, biznes testləri
import { Link } from "react-router-dom";
import logo from "../../shared/media/imgs/logo.png";
import {
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
} from "react-icons/fa";
import { useTranslation } from "react-i18next";

const Footer = () => {
  const { t } = useTranslation();
  return (
    <div className="bg-[#0f172b]">
      <div className="flex flex-col gap-6">
        <div className="container mx-auto flex flex-col lg:flex-row justify-between items-center gap-10 py-12 px-4">
          {/* Logo */}
          <div className="flex flex-col items-center lg:items-start gap-4">
            <img className="h-[80px] md:h-[90px]" src={logo} alt="white-logo" />
          </div>

          {/* Menu */}
          <div className="flex flex-col lg:flex-row gap-4 lg:gap-6 text-white text-lg text-center">
            <Link
              className="hover:underline hover:text-primary-blue duration-300"
              to="/blogs"
            >
              {t("header.blogs")}
            </Link>
            <Link
              className="hover:underline hover:text-primary-blue duration-300"
              to="/about-us"
            >
              {t("header.about")}
            </Link>
            <Link
              className="hover:underline hover:text-primary-blue duration-300"
              to="/contact-us"
            >
              {t("header.contact")}
            </Link>
            <Link
              className="hover:underline hover:text-primary-blue duration-300"
              to="/test"
            >
              {t("footer.tests")}
            </Link>
          </div>

          {/* Social icons */}
          <div className="flex gap-4 lg:gap-6 text-xl lg:text-2xl text-primary-blue">
            <a
              href="#"
              className="bg-white rounded-full p-2 hover:bg-primary-blue hover:text-white duration-300"
            >
              <FaFacebookF />
            </a>
            <a
              href="#"
              className="bg-white rounded-full p-2 hover:bg-primary-blue hover:text-white duration-300"
            >
              <FaInstagram />
            </a>
            <a
              href="#"
              className="bg-white rounded-full p-2 hover:bg-primary-blue hover:text-white duration-300"
            >
              <FaLinkedinIn />
            </a>
          </div>
        </div>

        {/* Divider */}
        <span className="w-full h-[1px] bg-white opacity-50"></span>

        {/* Copyright */}
        <div className="container px-4 mx-auto text-center text-white pb-6 text-sm md:text-base">
          <p>{t("footer.rights")}</p>
        </div>
      </div>
    </div>
  );
};

export default Footer;
