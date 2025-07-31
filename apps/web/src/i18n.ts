import i18n from "i18next";
import HttpBackend from "i18next-http-backend";
import { initReactI18next } from "react-i18next";

i18n
  .use(HttpBackend)
  .use(initReactI18next)
  .init({
    backend: {
      loadPath: "/locales/{{lng}}/common.json"
    },
    defaultNS: "common",
    fallbackLng: "en",
    interpolation: {
      escapeValue: false // React already escapes by default
    },
    lng: "en",
    ns: ["common"],
    preload: ["en", "ar"],
    supportedLngs: ["en", "ar"]
  });

export default i18n;
