import { Link } from "react-router-dom";
import API from "@/api";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

interface Props {
  showThree?: boolean;
}

const Blogs = ({ showThree }: Props) => {
  const { t } = useTranslation();
  const [blogs, setBlogs] = useState([]);
  const getBlogs = async () => {
    const response = await API.Auth.blog();

    if (response.status === 200) {
      setBlogs(response.data.results);
    } else {
      throw new Error(response.data);
    }
  };

  useEffect(() => {
    getBlogs();
  }, []);

  const truncate = (text?: string, max = 40) =>
    text && text.length > max ? `${text.slice(0, max)}...` : text;

  return (
    <div className="py-20">
      <div className="container px-2 mx-auto flex flex-col gap-10">
        <h2 className="text-4xl font-bold text-center text-primary-blue">
          {t("blogs.title_latest_articles")}
        </h2>
        <div className="grid gap-10 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
          {blogs
            .slice(0, showThree ? 3 : 6)
            .map(({ id, image, title, content }) => (
              <div
                key={id}
                className="bg-white rounded-2xl shadow-md p-6 flex flex-col hover:shadow-lg transition-shadow duration-300"
              >
                <div className="overflow-hidden rounded-xl h-48 mb-6">
                  <img
                    src={image}
                    alt={title}
                    className="object-cover w-full h-full rounded-xl"
                  />
                </div>
                <h3 className="text-xl text-gray-900 font-semibold leading-8 mb-4 hover:text-indigo-600 cursor-pointer">
                  {title}
                </h3>
                <p className="text-gray-500 flex-grow">
                  {truncate(content, 55)}
                </p>

                <Link
                  to={`/blog-detail/${id}`}
                  className="mt-6 flex items-center gap-2 text-lg text-indigo-700 font-semibold cursor-pointer group"
                >
                  {t("blogs.read_more")}
                  <svg
                    width="15"
                    height="12"
                    viewBox="0 0 15 12"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="transition-transform duration-300 ease-in-out group-hover:translate-x-2"
                  >
                    <path
                      d="M1.25 6L13.25 6M9.5 10.5L13.4697 6.53033C13.7197 6.28033 13.8447 6.15533 13.8447 6C13.8447 5.84467 13.7197 5.71967 13.4697 5.46967L9.5 1.5"
                      stroke="#4338CA"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </Link>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default Blogs;
