import { useEffect, useState } from "react";

const UseFetchData = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Base URL for your API - UPDATE THIS TO YOUR BACKEND URL
  const API_BASE_URL = "https://c8f6b21a078d.ngrok-free.app/";

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await fetch(`${API_BASE_URL}`,
      //    {
      //   headers: {
      //     "ngrok-skip-browser-warning": "true",
      //   },
      // }
    );

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const ans = await res.json();
      // console.log("✅ Raw API Response:", ans);

      // Process products to add full image URLs
      const processedProducts = ans.products.map((product) => {
        // Get primary image URL
        let imageUrl = null;
        
        if (product.primary_image_id) {
          // New method: Image stored in database
          imageUrl = `${API_BASE_URL}/api/images/${product.primary_image_id}`;
        } else if (product.primary_image) {
          // Check if it's already a full URL
          if (product.primary_image.startsWith('http://') || product.primary_image.startsWith('https://')) {
            imageUrl = product.primary_image;
          } 
          // Check if it's an API endpoint
          else if (product.primary_image.startsWith('/api/images/')) {
            imageUrl = `${API_BASE_URL}${product.primary_image}`;
          }
          // Check if it's a static file path
          else if (product.primary_image.startsWith('/static/')) {
            imageUrl = `${API_BASE_URL}${product.primary_image}`;
          }
        }

        return {
          ...product,
          image_url: imageUrl || 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="400"%3E%3Crect fill="%23333" width="400" height="400"/%3E%3Ctext fill="%23666" font-family="sans-serif" font-size="18" x="50%25" y="50%25" text-anchor="middle" dominant-baseline="middle"%3ENo Image%3C/text%3E%3C/svg%3E', // Fallback
        };
      });

      console.log("✅ Processed Products with Images:", ans.products);
      setData(processedProducts || []);
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