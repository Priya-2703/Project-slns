import { useEffect, useState } from "react";

const UseFetchData = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await fetch(
        "https://db6042e21025.ngrok-free.app/api/products",
        {
          // ⭐ ngrok bypass header - IMPORTANT!
          headers: {
            "ngrok-skip-browser-warning": "true",
            // or alternative:
            // "User-Agent": "MyApp"
          },
        }
      );

      // Response check pannunga
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const ans = await res.json();
      console.log("✅ Data received:", ans.products.image);

      setData(ans.products || []);
      setLoading(false);
    } catch (error) {
      console.error("❌ Fetch error:", error);
      setError(error.message);
      setLoading(false);
    }
  };

  return { data, loading, error, refetch: fetchData };
};

export default UseFetchData;
