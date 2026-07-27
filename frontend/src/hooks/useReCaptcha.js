import { useState, useCallback, useRef, useEffect } from "react";
import { loadReCaptcha, executeReCaptcha } from "../utils/recaptcha";

export function useReCaptcha() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isExecuting, setIsExecuting] = useState(false);
  const triggered = useRef(false);

  const triggerLoad = useCallback(() => {
    if (triggered.current) return;
    triggered.current = true;

    loadReCaptcha()
      .then(() => setIsLoaded(true))
      .catch((err) => {
        console.warn("reCAPTCHA load gagal:", err);
        triggered.current = false;
      });
  }, []);

  const getToken = useCallback(async (action = "login") => {
    setIsExecuting(true);
    try {
      return await executeReCaptcha(action);
    } catch (err) {
      console.warn("reCAPTCHA execute gagal:", err);
      return null;
    } finally {
      setIsExecuting(false);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!triggered.current) triggerLoad();
    }, 8000);
    return () => clearTimeout(timer);
  }, [triggerLoad]);

  return { isLoaded, isExecuting, triggerLoad, getToken };
}