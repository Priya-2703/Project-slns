import { useEffect, useState } from 'react';

const UseFetchData = (categoryName = null, searchQuery = null) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchData();
  }, [categoryName, searchQuery]);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // 🔗 CONNECTION POINT: Fetch from Flask backend
      let url = 'http://localhost:5000/api/products';
      
      // Build query parameters
      const params = new URLSearchParams();
      
      if (categoryName) {
        params.append('category_name', categoryName);
      }
      
      if (searchQuery) {
        params.append('search', searchQuery);
      }
      
      // Add params to URL if any exist
      const queryString = params.toString();
      if (queryString) {
        url += `?${queryString}`;
      }

      const res = await fetch(url);
      
      if (!res.ok) {
        throw new Error('Failed to fetch products');
      }

      const ans = await res.json();
      
      // ✨ Transform data to match your existing frontend format
      const transformedData = ans.products.map(product => ({
        id: product.product_id,
        name: product.product_name,
        description: product.description,
        price: product.price,
        category: product.category_name,
        image: product.image_url,
        video: product.video_url,
        stockStatus: product.stock_quantity > 0 ? 'In Stock' : 'Out of Stock',
        stockQuantity: product.stock_quantity,
        // Add additional fields your app might use
        actualPrice: product.actual_price || product.price * 1.2, // 20% discount example
        discount: product.discount || 20, // Default 20% discount
        sizes: product.sizes || ['S', 'M', 'L', 'XL'], // Default sizes
        washCare: product.wash_care || [],
        details: product.details || {}
      }));
      
      setData(transformedData);
    } catch (error) {
      console.error('Error fetching products:', error);
      setError(error.message);
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, error, refetch: fetchData };
};

export default UseFetchData;