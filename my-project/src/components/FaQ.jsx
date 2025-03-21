import axiosInstance from '../axios/axiosInstance';
import React, { useEffect, useState } from 'react';
import { Languages } from 'lucide-react';

const languagesList = [
  { code: "en", label: "English" },
  { code: "hi", label: "Hindi" },
  { code: "gu", label: "Gujarati" },
  { code: "fr", label: "French" },
  { code: "bn", label: "Bengali" },
];

const FaQ = () => {
  const [faqs, setFaqs] = useState([]);
  const [language, setLanguage] = useState("en");

  const fetchFaqs = async () => {
    try {
      const response = await axiosInstance.get("/faqs", {
        params: {
          lang: language,
        },
      });
      setFaqs(response.data.faqs);
      console.log(response);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchFaqs();
  }, [language]);

  // Update openList length when faqs change
  const [openList, setOpenList] = useState([]);
  useEffect(() => {
    setOpenList(Array(faqs.length).fill(false));
  }, [faqs]);

  const toggleFaq = (index) => {
    const newOpenList = [...openList];
    newOpenList[index] = !newOpenList[index];
    setOpenList(newOpenList);
  };

  return (
    <div className="flex h-full relative w-[100vw] bg-secondary opacity-70 justify-center pt-44 z-0">
      <div className="dropdown absolute dropdown-right right-[24.5%] top-[15%] dropdown-hover">
        <div tabIndex={0} role="button" className="btn m-1">
          <span className="flex text-[18px] font-garamond text-base gap-2 items-center justify-center">
            Languages <Languages />
          </span>
        </div>
        <ul
          tabIndex={0}
          className="dropdown-content menu bg-base-100 rounded-box z-1 w-52 p-2 shadow-sm"
        >
          {languagesList.map((lang) => (
            <li key={lang.code}>
              <a
                className="hover:bg-slate-300 transition duration-200"
                onClick={() => setLanguage(lang.code)}
              >
                {lang.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
      <div className="join flex gap-3 bg-transparent join-vertical min-w-[50%] bg-base-100">
        {faqs.map((faq, index) => (
          <div
            key={index}
            onClick={() => toggleFaq(index)}
            className={`collapse ${
              openList[index] ? "collapse-open" : "collapse-close"
            } py-2 collapse-arrow bg-base-200 join-item hover:bg-slate-300 transition-all transform duration-200 hover:scale-105 shadow-2xl border-base-300 border`}
          >
            <div className="collapse-title font-semibold">
              <span className="text-xl text-primary-100 font-playfair">
                {faq.question} ?
              </span>
            </div>
            <hr />
            <div className="collapse-content text-sm before:content-[''] before:w-auto before:justify-center before:h-[1px] before:left-[0.5%] before:right-[0.5%] before:bg-black before:absolute">
              <span className="text-primary-100 text-lg font-extralight ">
                {faq.answer}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FaQ;
