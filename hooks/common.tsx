import axios from 'axios';
import { useState, useEffect } from 'react';
import { API_ENDPOINT, LOCAL_API_ENDPOINT } from '../constant/url';

const BASE_URL =
  process.env.NODE_ENV === "development" ? LOCAL_API_ENDPOINT : API_ENDPOINT;


export const useGetAllDoctor = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios
            .get(`${BASE_URL}/get-all-doctor`)
            .then((res) => {
                setData(res.data.data);
            })
            .catch((error) => {
                console.error('Error fetching doctors:', error);
                setData([]);
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    return { data, loading };
};

export const useGetAllClinic = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios
            .get(`${BASE_URL}/get-all-clinic`)
            .then((res) => {
                setData(res.data.data?.clinics);
            })
            .catch((error) => {
                console.error('Error fetching clinics:', error);
                setData([]);
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    return { data, loading };
};
