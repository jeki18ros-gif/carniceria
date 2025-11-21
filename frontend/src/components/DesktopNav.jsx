import React from "react";
import { useTranslation } from "react-i18next";

export default function DesktopNav() {
  const { t } = useTranslation();

  const linkBase =
    "transition-all duration-200 hover:scale-110 font-semibold " +
    "hover:text-[var(--color-accent-light)] dark:hover:text-[var(--color-accent-dark)]";

  return (
    <ul
      className="
        hidden sm:flex
        justify-center
        gap-4 sm:gap-8     /* más pequeño en pantallas chicas */
        text-sm sm:text-base  /* texto más pequeño en pantallas chicas */
        text-white dark:text-white
      "
    >
      <li>
        <a href="#productos" className={linkBase}>
          {t("header.nav.productos")}
        </a>
      </li>
      <li>
        <a href="#nosotros" className={linkBase}>
          {t("header.nav.nosotros")}
        </a>
      </li>
      <li>
        <a href="#resenas" className={linkBase}>
          {t("header.nav.resenas")}
        </a>
      </li>
      <li>
        <a href="#contacto" className={linkBase}>
          {t("header.nav.contacto")}
        </a>
      </li>
    </ul>
  );
}
