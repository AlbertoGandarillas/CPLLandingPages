import { useState, useEffect } from "react";
interface FetchResult<T> {
  data: T | null;
  loading: boolean;
  error: string;
}

function useFetchData<T>(url: string): FetchResult<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError("");
      try {
        const response = await fetch(url);
        if (response.ok) {
          const jsonData: T = await response.json();
          setData(jsonData);
        } else if (response.status === 404) {
          setError("No articulations found");
          setData(null); // Optionally set data to null if no data is found
        } else {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
      } catch (error: any) {
        setError(error.message || "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [url]); // Re-run the effect if the URL changes

  return { data, loading, error };
}

export default useFetchData;
