export function trackContact(channel: "whatsapp" | "email", service?: string) {
  if (typeof window === "undefined") return;
  const event = {
    event: "contact_click",
    contact_channel: channel,
    service: service || "general",
    page_path: window.location.pathname,
  };
  window.dispatchEvent(
    new CustomEvent("goatjourney:analytics", { detail: event }),
  );
  const target = window as typeof window & {
    gtag?: (...args: unknown[]) => void;
  };
  target.gtag?.("event", "contact_click", {
    contact_channel: channel,
    service: event.service,
    page_path: event.page_path,
  });
}
