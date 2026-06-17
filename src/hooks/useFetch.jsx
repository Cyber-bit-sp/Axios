import { useState, useEffect } from "react";
import api from "../api/axiosConfig";

const useFetch = (url, option = {}) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetechData = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await api.get(url, option);
        setData(response.data);
      } catch (err) {
        setError(err.message || "Something went wrong");
        setData(null);
      } finally {
        setLoading(false);
      }
    };

    fetechData();

  }, [url]);

  return {data, loading, error};
}

export default useFetch;