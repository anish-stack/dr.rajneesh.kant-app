

import { useState, useCallback, useEffect } from "react";
import axios from "axios";
import { API_ENDPOINT, LOCAL_API_ENDPOINT } from "../constant/url";

// Decide base URL based on environment
const BASE_URL =
  process.env.NODE_ENV === "development" ? LOCAL_API_ENDPOINT : API_ENDPOINT;



// ======================
// 🔁 Hook: useService
// ======================
export const useService = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchServices = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(`${BASE_URL}/get-all-service?limit=20`);

      if (response.data.success) {
        setServices(response.data.data);
      } else {
        setError("Failed to load services");
      }
    } catch (err: any) {
      console.error("Error fetching services:", err);
      setError(err?.message || "Something went wrong while fetching services.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchServices();
  }, [fetchServices]);

  return {
    services,
    loading,
    error,
    fetchServices,
  };
};

// ==============================
// 🔁 Hook: useServiceBySlug
// ==============================
export const useServiceBySlug = (slug: string) => {
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchServiceBySlug = useCallback(async () => {
    if (!slug) return;

    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(`${BASE_URL}/get-service-slug/${slug}`);

      if (response.data.success) {
        setService(response.data.data);
      } else {
        setError("Service not found.");
      }
    } catch (err: any) {
      console.error("Error fetching service by slug:", err);
      setError(err?.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }, [slug]);

  useEffect(() => {
    fetchServiceBySlug();
  }, [fetchServiceBySlug]);

  return {
    service,
    loading,
    error,
    fetchServiceBySlug,
  };
};
