const RECAPTCHA_SITE_KEY = import.meta.env.VITE_RECAPTCHA_SITE_KEY;
const SCRIPT_ID = "recaptcha-lazy-script";

let ready = false;
let promise = null;

export function loadReCaptcha() {
  if (ready) return Promise.resolve(window.grecaptcha);
  if (promise) return promise;

  promise = new Promise((resolve, reject) => {
    const existing = document.getElementById(SCRIPT_ID);
    if (existing) {
      waitForReady(resolve, reject);
      return;
    }

    const script = document.createElement("script");
    script.id = SCRIPT_ID;
    script.src = `https://www.google.com/recaptcha/api.js?render=${RECAPTCHA_SITE_KEY}`;
    script.async = true;
    script.defer = true;
    script.onload = () => waitForReady(resolve, reject);
    script.onerror = () => {
      promise = null;
      reject(new Error("Gagal memuat reCAPTCHA"));
    };
    document.head.appendChild(script);
  });

  return promise;
}

function waitForReady(resolve, reject) {
  const timeout = 10000;
  const start = Date.now();

  const check = () => {
    if (window.grecaptcha?.ready) {
      window.grecaptcha.ready(() => {
        ready = true;
        resolve(window.grecaptcha);
      });
    } else if (Date.now() - start > timeout) {
      promise = null;
      reject(new Error("reCAPTCHA timeout"));
    } else {
      setTimeout(check, 100);
    }
  };

  check();
}

export async function executeReCaptcha(action = "login") {
  const grecaptcha = await loadReCaptcha();

  return new Promise((resolve, reject) => {
    grecaptcha.ready(async () => {
      try {
        const token = await grecaptcha.execute(RECAPTCHA_SITE_KEY, { action });
        resolve(token);
      } catch (err) {
        reject(err);
      }
    });
  });
}

export { RECAPTCHA_SITE_KEY };