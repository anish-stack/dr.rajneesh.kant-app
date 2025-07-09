import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { API_ENDPOINT, LOCAL_API_ENDPOINT } from "../constant/url";
const BASE_URL =
  process.env.NODE_ENV === "development" ? LOCAL_API_ENDPOINT : API_ENDPOINT;

const TOKEN_KEY = "auth_token";

export const useGetBooking = () => {
    const [data, setData] = useState<[] | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchBooking = async () => {
        setLoading(true);
        setError(null);

        try {
            const tokenString = await AsyncStorage.getItem(TOKEN_KEY);
            if (!tokenString) throw new Error("No token found");

            const parsed = JSON.parse(tokenString);
            const token = parsed?.token;
            if (!token) throw new Error("Invalid token");

            const response = await axios.get(`${BASE_URL}/user/found-bookings`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.data.success) {
                setData(response.data.bookings);
            } else {
                setError("Booking not found");
                setData(null);
            }

        } catch (err: any) {
            console.error("❌ Error fetching bookings:", err);
            const message = err?.response?.data?.message || err.message || "Order Not Found";
            setError(message);
            setData(null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBooking();
    }, []);

    return { data, loading, error, fetchBooking };
};
