import { useState } from "react";
import type { EmailCorpus, ApiError} from "@app/types";
import axios from "axios";
import { notify } from "@app/lib/toast";

const EMAIL_BASE_URL = import.meta.env.VITE_API_EMAIL;

export function useEmail() {
  const [emails, setEmails] = useState<EmailCorpus[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);

  async function sendEmail(email: EmailCorpus) {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post(`${EMAIL_BASE_URL}/send`, email);
      setEmails((prev) => [...prev, response.data]);
      if (response.status === 200) {
        notify.success("Email sent successfully");
      }
    } catch (error: any) {
      setError({ message: error.message, statusCode: error.response?.status });
    } finally {
      setLoading(false);
    }
  }

  async function emailChangePassword(to:string) {
    setLoading(true);
    setError(null);
    try {
        const response = await axios.post(`${EMAIL_BASE_URL}/change-password`, { to });
        if (response.status === 200) {
           notify.success("Email sent successfully")
        }
    } catch (error: any) {
      setError({ message: error.message, statusCode: error.response?.status });
      return;
    } finally {
      setLoading(false);
    }
  }

  async function resetEmailState() {
    setEmails([]);
    setLoading(false);
    setError(null);
  }

  return {
    emails,
    loading,
    error,
    resetEmailState,
    sendEmail,
    emailChangePassword
  };
}
