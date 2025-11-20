import React from "react";
import { useTranslation } from "react-i18next";

function LanguageSwitcher() {
  const { i18n } = useTranslation();

  const changeLanguage = (lang) => {
    i18n.changeLanguage(lang);
    localStorage.setItem("language", lang);
  };

  return (
    <div className="fixed bottom-4 left-4 bg-linear-to-r from-white/5 via-white/10 to-white/5 backdrop-blur-sm border border-white/10 px-3 py-2 rounded-full shadow-lg z-50 font-body text-white text-[12px]">
      <button
        onClick={() => changeLanguage("en")}
        className={i18n.language === "en" ? "hidden" : "flex"}
      >
        English
      </button>
      <button
        onClick={() => changeLanguage("ta")}
        className={i18n.language === "ta" ? "hidden" : "flex"}
      >
        தமிழ்
      </button>
    </div>
  );
}

export default LanguageSwitcher;
