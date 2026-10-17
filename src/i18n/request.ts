import { getRequestConfig } from "next-intl/server";
import { routing, type Locale } from "./routing";
import { getSiteMessages } from "@/lib/content";

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale;
  if (!locale || !routing.locales.includes(locale as Locale)) {
    locale = routing.defaultLocale;
  }
  return {
    locale,
    // Published content from the admin dashboard, merged over the bundled /messages files.
    messages: await getSiteMessages(locale as Locale),
  };
});
