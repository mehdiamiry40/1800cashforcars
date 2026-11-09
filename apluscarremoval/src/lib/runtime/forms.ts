import { FORM_ID, MESSAGES, type FormResponse } from "@/lib/quote";

/**
 * Submits the Contact Form 7 markup that is part of the page content to /api/contact/, and
 * reproduces what CF7's script did around it: status classes, inline field errors, the
 * response line, and the `wpcf7*` DOM events (Tag Manager conversions listen for those).
 */
declare global {
  interface Window {
    grecaptcha?: { ready(cb: () => void): void; execute(key: string, opts: { action: string }): Promise<string> };
  }
}

const PRODUCTION_HOST = /(^|\.)apluscarremoval\.com\.au$/;

function loadRecaptcha(siteKey: string) {
  // The key is registered for the production domain only; elsewhere Google shows an error badge.
  if (!siteKey || !PRODUCTION_HOST.test(window.location.hostname)) return;
  if (document.querySelector('script[src*="recaptcha/api.js"]')) return;
  const script = document.createElement("script");
  script.src = `https://www.google.com/recaptcha/api.js?render=${encodeURIComponent(siteKey)}`;
  script.async = true;
  document.head.append(script);
}

function recaptchaToken(siteKey: string): Promise<string> {
  const api = window.grecaptcha;
  if (!api || !siteKey) return Promise.resolve("");
  return new Promise((resolve) => {
    const timer = window.setTimeout(() => resolve(""), 4000);
    api.ready(() => {
      api.execute(siteKey, { action: "contactform" }).then(
        (token) => {
          window.clearTimeout(timer);
          resolve(token);
        },
        () => resolve(""),
      );
    });
  });
}

function setStatus(form: HTMLFormElement, status: string) {
  form.classList.remove("init", "submitting", "sent", "invalid", "failed", "spam", "resetting");
  form.classList.add(status);
  form.dataset.status = status;
}

function clearErrors(form: HTMLFormElement) {
  for (const tip of form.querySelectorAll(".wpcf7-not-valid-tip")) tip.remove();
  for (const control of form.querySelectorAll(".wpcf7-not-valid")) {
    control.classList.remove("wpcf7-not-valid");
    control.setAttribute("aria-invalid", "false");
  }
}

function showResponse(wrapper: Element, form: HTMLFormElement, message: string) {
  const output = form.querySelector(".wpcf7-response-output");
  if (output) output.textContent = message;
  const live = wrapper.querySelector('.screen-reader-response [role="status"]');
  if (live) live.textContent = message;
}

export function initForms(recaptchaSiteKey: string): () => void {
  const wrappers = document.querySelectorAll<HTMLElement>("div.wpcf7");
  if (wrappers.length === 0) return () => {};
  loadRecaptcha(recaptchaSiteKey);

  for (const wrapper of wrappers) {
    wrapper.classList.replace("no-js", "js");
    const submit = wrapper.querySelector(".wpcf7-submit");
    if (submit && !submit.parentElement?.querySelector(".wpcf7-spinner")) {
      const spinner = document.createElement("span");
      spinner.className = "wpcf7-spinner";
      submit.after(spinner);
    }
  }

  const onSubmit = async (event: Event) => {
    const form = event.target as HTMLFormElement;
    const wrapper = form.closest<HTMLElement>("div.wpcf7");
    if (!wrapper || !form.classList.contains("wpcf7-form")) return;
    event.preventDefault();
    if (form.dataset.status === "submitting") return;

    const data = new FormData(form);
    const inputs = Array.from(data.entries())
      .filter(([name]) => !name.startsWith("_"))
      .map(([name, value]) => ({ name, value: String(value) }));
    const detail = {
      contactFormId: FORM_ID,
      pluginVersion: String(data.get("_wpcf7_version") ?? ""),
      contactFormLocale: String(data.get("_wpcf7_locale") ?? "en_US"),
      unitTag: wrapper.id,
      containerPostId: Number(data.get("_wpcf7_container_post") ?? 0),
      status: "init",
      inputs,
      formData: data,
      apiResponse: undefined as FormResponse | undefined,
    };
    const emit = (name: string) => wrapper.dispatchEvent(new CustomEvent(`wpcf7${name}`, { bubbles: true, detail }));

    clearErrors(form);
    showResponse(wrapper, form, "");
    setStatus(form, "submitting");
    emit("beforesubmit");

    let result: FormResponse;
    try {
      const payload: Record<string, string> = { _page: window.location.pathname };
      for (const { name, value } of inputs) payload[name] = value;
      payload._wpcf7_recaptcha_response = await recaptchaToken(recaptchaSiteKey);
      const res = await fetch("/api/contact/", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(payload),
      });
      result = (await res.json()) as FormResponse;
    } catch {
      result = { status: "mail_failed", message: MESSAGES.failed };
    }
    detail.status = result.status;
    detail.apiResponse = result;

    if (result.status === "validation_failed") {
      setStatus(form, "invalid");
      for (const { field, message } of result.invalid_fields ?? []) {
        const wrap = form.querySelector(`.wpcf7-form-control-wrap[data-name="${CSS.escape(field)}"]`);
        const control = wrap?.querySelector(".wpcf7-form-control");
        if (!wrap || !control) continue;
        control.classList.add("wpcf7-not-valid");
        control.setAttribute("aria-invalid", "true");
        const tip = document.createElement("span");
        tip.className = "wpcf7-not-valid-tip";
        tip.setAttribute("aria-hidden", "true");
        tip.textContent = message;
        wrap.append(tip);
      }
      emit("invalid");
    } else if (result.status === "mail_sent") {
      setStatus(form, "sent");
      form.reset();
      emit("mailsent");
    } else if (result.status === "spam") {
      setStatus(form, "spam");
      emit("spam");
    } else {
      setStatus(form, "failed");
      emit("mailfailed");
    }
    showResponse(wrapper, form, result.message);
    emit("submit");
  };

  document.addEventListener("submit", onSubmit);
  return () => document.removeEventListener("submit", onSubmit);
}
