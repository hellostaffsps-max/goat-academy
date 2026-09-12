export const site = {
  url: "https://www.goatjourney.online",
  name: "Goat Journey",
  alternateName: "GoatJourney Academy",
  person: "وائل أرزيقات",
  personEn: "Wael Irzeqat",
  email: "gaotjourney.ps@gmail.com",
  phone: "+970594136723",
  whatsapp: "970594136723",
  description:
    "تدريب الباريستا واستشارات القهوة وتطوير المقاهي في فلسطين مع وائل أرزيقات — Wael Irzeqat، مؤسس Goat Journey.",
  social: [
    "https://instagram.com/goatjourney.ps",
    "https://linkedin.com/company/goatjourney",
  ],
} as const;
export const absoluteUrl = (path = "/") => new URL(path, site.url).toString();
export const personId = `${site.url}/about#wael-irzeqat`;
export const organizationId = `${site.url}/#organization`;
