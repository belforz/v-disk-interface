import { useState, useCallback, useMemo } from "react";
import type { EmailCorpus, ApiError} from "@app/types";
import { notify } from "@app/lib/toast";
import { apiEmails } from "@app/lib/api";

const EMAIL_BASE_URL = import.meta.env.VITE_API_EMAIL;

export function useEmail() {
  const [emails, setEmails] = useState<EmailCorpus[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);

  const sendEmail = useCallback(async (email: EmailCorpus) => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiEmails.post(`${EMAIL_BASE_URL}/send`, email);
      setEmails((prev) => [...prev, response.data]);
      if (response.status === 200) {
        notify.success("Email sent successfully");
      }
    } catch (error: any) {
      setError({ message: error.message, statusCode: error.response?.status });
    } finally {
      setLoading(false);
    }
  }, []);

  const emailChangePassword = useCallback(async (to:string) => {
    setLoading(true);
    setError(null);
  try {
    const url = `${EMAIL_BASE_URL}/change-password?to=${encodeURIComponent(to)}`;
    const response = await apiEmails.post(url, {});
        if (response.status === 200) {
           notify.success("Email sent successfully")
        }
    } catch (error: any) {
      setError({ message: error.message, statusCode: error.response?.status });
      return;
    } finally {
      setLoading(false);
    }
  }, []);

  const resetEmailState = useCallback(async () => {
    setEmails([]);
    setLoading(false);
    setError(null);
  }, []);

  return useMemo(() => ({
    emails,
    loading,
    error,
    resetEmailState,
    sendEmail,
    emailChangePassword
  }), [emails, loading, error, resetEmailState, sendEmail, emailChangePassword]);
}
