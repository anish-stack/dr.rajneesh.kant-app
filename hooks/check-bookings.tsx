import { useState, useCallback } from 'react';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_ENDPOINT, LOCAL_API_ENDPOINT } from '../constant/url';

const BASE_URL =
  process.env.NODE_ENV === "development" ? LOCAL_API_ENDPOINT : API_ENDPOINT;

const TOKEN_KEY = "auth_token";


interface BookingCheckParams {
    date: string;
    time: string;
    service_id: string;
    clinic_id: string
}

interface BookingAvailabilityResponse {
    success: boolean;
    available: boolean;
    bookedCount: number;
    limit: number;
    specialSlotApplied: boolean;
}

export function useCheckBookings({ date, time, service_id, clinic_id }: BookingCheckParams) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [data, setData] = useState<BookingAvailabilityResponse | null>(null);

    const checkAvailability = useCallback(async () => {
        const tokenString = await AsyncStorage.getItem(TOKEN_KEY);
        if (!tokenString) throw new Error("No token found");

        const parsed = JSON.parse(tokenString);
        const token = parsed?.token;
        if (!token) throw new Error("Invalid token");


        setLoading(true);
        setError(null);

        try {
            const response = await axios.post<BookingAvailabilityResponse>(
                `${BASE_URL}/user/bookings/availability`,
                {
                    date,
                    time,
                    service_id,
                    clinic_id
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json', // Optional, but good practice
                    },
                }
            );

            console.log("availabilityData", response.data);
            setData(response.data);
            return response.data;

        } catch (err: any) {
            console.log("err?.response?.data?.message", err)
            setError(err?.response?.data?.message || 'Error checking availability');
            setData(null);
            return null;

        } finally {
            setLoading(false);
        }

    }, [date, time, service_id, clinic_id]);

    return { checkAvailability, data, loading, error };
}
