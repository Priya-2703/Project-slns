import { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { ToastContext } from "../../Context/UseToastContext";

export default function ManageProducts() {
  const { showToast } = useContext(ToastContext);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [categories, setCategories] = useState([]);
  const [sortBy, setSortBy] = useState("newest");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(12);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const [stats, setStats] = useState({
    total: 0,
    inStock: 0,
    lowStock: 0,
    outOfStock: 0,
  });

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, [stats]);

  // Base URL for your API - UPDATE THIS TO YOUR BACKEND URL
  const API_BASE_URL = "http://localhost:5000";

  //priya
  // const fetchProducts = async () => {
  //   try {
  //     const token = localStorage.getItem("token");
  //     const response = await fetch(
  //       `${API_BASE_URL}/api/products`,
  //       {
  //         headers: { Authorization: `Bearer ${token}` },
  //       }
  //     );
  //     const data = await response.json();
  //     if (response.ok) {
  //       setProducts(data);
  //       calculateStats(data);
  //     }
  //   } catch (err) {
  //     console.error("Failed to fetch products:", err);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  //   const fetchCategories = async () => {
  //   try {
  //     const token = localStorage.getItem("token");
  //     const response = await fetch(`${API_BASE_URL}/api/categories`, {
  //       headers: { Authorization: `Bearer ${token}` },
  //     });
  //     const data = await response.json();
  //     if (response.ok) {
  //       setCategories(data);
  //     }
  //   } catch (err) {
  //     console.error("Failed to fetch categories:", err);
  //   }
  // };

  //saran fetchProducts
  
  


  const fetchProducts = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_BASE_URL}/api/products`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "ngrok-skip-browser-warning": "true",
        },
      });
      // Raw text edukurom
      const responseText = await response.text();

      // Parse panna try panrom
      try {
        const data = JSON.parse(responseText);
        if (response.ok) {
          setProducts(data.products);
          calculateStats(data.products)
          // console.log("✅ Success! Data:", data.products);
        }
      } catch (parseError) {
        console.error("❌ JSON Parse Error:", parseError);
        console.error("Full Response:", responseText);
        alert("JSON parse aagala. Console-a paaru.");
      }
    } catch (err) {
      console.error("Failed to fetch products:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_BASE_URL}/api/categories`, {
        headers: { Authorization: `Bearer ${token}`,
         "ngrok-skip-browser-warning": "true",
        },
      });
      // Raw text edukurom
      const responseText = await response.text();

      // Parse panna try panrom
      try {
        const data = JSON.parse(responseText);
        if (response.ok) {
          setCategories(data.categories);
          // console.log("✅ Success! Data:", data.categories);
        }
      } catch (parseError) {
        console.error("❌ JSON Parse Error:", parseError);
        console.error("Full Response:", responseText);
        alert("JSON parse aagala. Console-a paaru.");
      }
    } catch (err) {
      console.error("Failed to fetch categories:", err);
    }
  };

  const calculateStats = (productList) => {
    const total = productList.length;
    const inStock = productList.filter((p) => p.stock_quantity > 10).length;
    const lowStock = productList.filter(
      (p) => p.stock_quantity > 0 && p.stock_quantity <= 10
    ).length;
    const outOfStock = productList.filter((p) => p.stock_quantity === 0).length;
    setStats({ total, inStock, lowStock, outOfStock });
  };

  const handleDelete = async (productId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${API_BASE_URL}/api/products/${productId}`, //  change api
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.ok) {
        setProducts(products.filter((p) => p.product_id !== productId));
        setShowDeleteConfirm(false);
        setProductToDelete(null);
        showToast("Product deleted successfully!");
      }
    } catch (err) {
      console.error("Failed to delete product:", err);
      showToast("Failed to delete product");
    }
  };

  const handleBulkDelete = async () => {
    if (selectedProducts.length === 0) return;

    if (
      !confirm(
        `Are you sure you want to delete ${selectedProducts.length} products?`
      )
    ) {
      return;
    }

    try {
      const token = localStorage.getItem("token");
      await Promise.all(
        selectedProducts.map((id) =>
          fetch(`${API_BASE_URL}/api/products/${id}`, {
            // change api
            method: "DELETE",
            headers: { Authorization: `Bearer ${token}` },
          })
        )
      );

      setProducts(
        products.filter((p) => !selectedProducts.includes(p.product_id))
      );
      setSelectedProducts([]);
      alert("Products deleted successfully!");
    } catch (err) {
      console.error("Failed to delete products:", err);
      alert("Failed to delete some products");
    }
  };

  const toggleSelectProduct = (productId) => {
    setSelectedProducts((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );
  };

  const toggleSelectAll = () => {
    if (selectedProducts.length === filteredProducts.length) {
      setSelectedProducts([]);
    } else {
      setSelectedProducts(filteredProducts.map((p) => p.product_id));
    }
  };

  const getImageUrl = (product) => {
    if (product.primary_image_id) {
      return `${API_BASE_URL}/api/images/${product.primary_image_id}`; //change api
    }
    if (product.primary_image) {
      if (
        product.primary_image.startsWith("http://") ||
        product.primary_image.startsWith("https://")
      ) {
        return product.primary_image;
      }
      if (product.primary_image.startsWith("/api/images/")) {
        return `http://localhost:5000${product.primary_image}`; // change api
      }
    }
    return 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="200" height="200"%3E%3Crect fill="%23333" width="200" height="200"/%3E%3Ctext fill="%23666" font-family="sans-serif" font-size="14" x="50%25" y="50%25" text-anchor="middle" dominant-baseline="middle"%3ENo Image%3C/text%3E%3C/svg%3E';
  };

  // Filter and sort products
  const filteredProducts = products.filter((product) => {
      const matchesSearch =
        product.product_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.product_id.toString().includes(searchTerm);
      const matchesCategory =
        !selectedCategory ||
        product.category_id.toString() === selectedCategory;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return b.product_id - a.product_id;
        case "oldest":
          return a.product_id - b.product_id;
        case "price-low":
          return a.price - b.price;
        case "price-high":
          return b.price - a.price;
        case "name-az":
          return a.product_name.localeCompare(b.product_name);
        case "name-za":
          return b.product_name.localeCompare(a.product_name);
        case "stock-low":
          return a.stock_quantity - b.stock_quantity;
        case "stock-high":
          return b.stock_quantity - a.stock_quantity;
        default:
          return 0;
      }
    });

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentProducts = filteredProducts.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-xl font-body">Loading products...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black py-20">
      <div className="w-[90%] mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <Link
              to="/admin/dashboard"
              className="text-white hover:text-white/60 font-body inline-block bg-white/10 hover:bg-black cursor-pointer border border-white/30 rounded-4xl py-2 px-4 duration-300 transition-all"
            >
              <button className="flex gap-1 justify-center text-[14px] items-center cursor-pointer">
                <svg
                  className="w-4 h-4 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 19l-7-7m0 0l7-7m-7 7h18"
                  />
                </svg>
                Back to Dashboard
              </button>
            </Link>
            <h1 className="text-4xl font-bold text-white font1 mt-2">
              MANAGE PRODUCTS
            </h1>
            <p className="text-white/60 font-body mt-2">
              {filteredProducts.length} products found
            </p>
          </div>
          <Link to="/admin/products/add">
            <button className="bg-[#955E30] hover:bg-[#955E30]/80 text-white px-6 py-3 rounded-lg font-body font-semibold transition-colors flex items-center">
              <svg
                className="w-5 h-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
              Add New Product
            </button>
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white/5 border border-white/10 rounded-xl p-4">
            <p className="text-white/60 text-xs font-body mb-1">
              Total Products
            </p>
            <p className="text-2xl font-bold text-white font1">{stats.total}</p>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-xl p-4">
            <p className="text-white/60 text-xs font-body mb-1">In Stock</p>
            <p className="text-2xl font-bold text-green-500 font1">
              {stats.total}
            </p>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-xl p-4">
            <p className="text-white/60 text-xs font-body mb-1">Low Stock</p>
            <p className="text-2xl font-bold text-yellow-500 font1">
              {stats.lowStock}
            </p>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-xl p-4">
            <p className="text-white/60 text-xs font-body mb-1">Out of Stock</p>
            <p className="text-2xl font-bold text-red-500 font1">
              {stats.outOfStock}
            </p>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white/5 border border-white/10 rounded-xl p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="md:col-span-2">
              <label className="block text-white/60 text-xs font-body mb-2">
                Search Products
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search by name or ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-black/10 border border-white/20 rounded-lg px-4 py-2.5 pl-10 text-white placeholder-white/40 focus:outline-none focus:border-[#955E30] transition-colors font-body"
                />
                <svg
                  className="w-5 h-5 text-white/40 absolute left-3 top-1/2 -translate-y-1/2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
            </div>

            {/* Category Filter */}
            <div>
              <label className="block text-white/60 text-xs font-body mb-2">
                Category
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full bg-black/10  border border-white/20 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-[#955E30] transition-colors font-body"
              >
                <option
                  className="bg-transparent text-black font-body"
                  value=""
                >
                  All Categories
                </option>
                {categories.map((cat) => (
                  <option key={cat.category_id} className="text-black bg-transparent" value={cat.category_id}>
                    {cat.category_name}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort */}
            <div>
              <label className="block text-white/60 text-xs font-body mb-2">
                Sort By
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full bg-black/10 border border-white/20 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-[#955E30] transition-colors font-body"
              >
                <option
                  className="bg-transparent font-body text-black"
                  value="newest"
                >
                  Newest First
                </option>
                <option
                  className="bg-transparent font-body text-black"
                  value="oldest"
                >
                  Oldest First
                </option>
                <option
                  className="bg-transparent font-body text-black"
                  value="name-az"
                >
                  Name (A-Z)
                </option>
                <option
                  className="bg-transparent font-body text-black"
                  value="name-za"
                >
                  Name (Z-A)
                </option>
                <option
                  className="bg-transparent font-body text-black"
                  value="price-low"
                >
                  Price (Low to High)
                </option>
                <option
                  className="bg-transparent font-body text-black"
                  value="price-high"
                >
                  Price (High to Low)
                </option>
                <option
                  className="bg-transparent font-body text-black"
                  value="stock-low"
                >
                  Stock (Low to High)
                </option>
                <option
                  className="bg-transparent font-body text-black"
                  value="stock-high"
                >
                  Stock (High to Low)
                </option>
              </select>
            </div>
          </div>

          {/* Bulk Actions */}
          {selectedProducts.length > 0 && (
            <div className="mt-4 pt-4 border-t border-white/10 flex items-center justify-between">
              <p className="text-white font-body">
                {selectedProducts.length} product
                {selectedProducts.length > 1 ? "s" : ""} selected
              </p>
              <button
                onClick={handleBulkDelete}
                className="bg-red-500/20 hover:bg-red-500/30 text-red-500 px-4 py-2 rounded-lg font-body transition-colors border border-red-500/30 flex items-center"
              >
                <svg
                  className="w-4 h-4 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
                Delete Selected
              </button>
            </div>
          )}
        </div>

        {/* Products Grid */}
        {currentProducts.length === 0 ? (
          <div className="bg-white/5 border border-white/10 rounded-xl p-12 text-center">
            <svg
              className="w-16 h-16 text-white/20 mx-auto mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
              />
            </svg>
            <p className="text-white/40 font-body">No products found</p>
          </div>
        ) : (
          <>
            {/* Select All */}
            <div className="bg-white/5 border border-white/10 rounded-t-xl px-6 py-3 flex items-center">
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={
                    selectedProducts.length === currentProducts.length &&
                    currentProducts.length > 0
                  }
                  onChange={toggleSelectAll}
                  className="w-4 h-4 rounded border-white/20 bg-white/10 text-[#955E30] focus:ring-[#955E30] focus:ring-offset-0"
                />
                <span className="ml-2 text-white/60 font-body text-sm">
                  Select All
                </span>
              </label>
            </div>

            {/* Products List */}
            <div className="bg-white/5 border border-white/10 border-t-0 rounded-b-xl divide-y divide-white/10">
              {currentProducts.map((product) => (
                <div
                  key={product.product_id}
                  className="p-4 hover:bg-white/5 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    {/* Checkbox */}
                    <input
                      type="checkbox"
                      checked={selectedProducts.includes(product.product_id)}
                      onChange={() => toggleSelectProduct(product.product_id)}
                      className="w-4 h-4 rounded border-white/20 bg-white/10 text-[#955E30] focus:ring-[#955E30] focus:ring-offset-0"
                    />

                    {/* Image */}
                    <div className="w-20 h-20 bg-white/5 rounded-lg overflow-hidden flex-shrink-0">
                      <img
                        src={getImageUrl(product)}
                        alt={product.product_name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.src =
                            'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="200" height="200"%3E%3Crect fill="%23333" width="200" height="200"/%3E%3Ctext fill="%23666" font-family="sans-serif" font-size="14" x="50%25" y="50%25" text-anchor="middle" dominant-baseline="middle"%3ENo Image%3C/text%3E%3C/svg%3E';
                        }}
                      />
                    </div>

                    {/* Product Info */}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-white font-body font-semibold truncate">
                        {product.product_name}
                      </h3>
                      <p className="text-white/40 text-sm font-body">
                        ID: {product.product_id}
                      </p>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="text-[#955E30] font-bold font1">
                          ₹{product.price}
                        </span>
                        <span
                          className={`text-xs px-2 py-1 rounded ${
                            product.stock_quantity > 10
                              ? "bg-green-500/20 text-green-500"
                              : product.stock_quantity > 0
                              ? "bg-yellow-500/20 text-yellow-500"
                              : "bg-red-500/20 text-red-500"
                          }`}
                        >
                          Stock: {product.stock_quantity}
                        </span>
                        <span className="text-white/40 text-xs">
                          {categories.find(
                            (c) => c.category_id === product.category_id
                          )?.category_name || "Uncategorized"}
                        </span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <Link to={`/admin/products/edit/${product.product_id}`}>
                        <button className="bg-[#955E30]/20 hover:bg-[#955E30]/30 text-[#955E30] p-2 rounded-lg transition-colors border border-[#955E30]/30">
                          <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                            />
                          </svg>
                        </button>
                      </Link>
                      <button
                        onClick={() => {
                          setProductToDelete(product);
                          setShowDeleteConfirm(true);
                        }}
                        className="bg-red-500/20 hover:bg-red-500/30 text-red-500 p-2 rounded-lg transition-colors border border-red-500/30"
                      >
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 mt-8">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg font-body transition-colors disabled:opacity-50 disabled:cursor-not-allowed border border-white/20"
            >
              Previous
            </button>

            <div className="flex gap-2">
              {[...Array(totalPages)].map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentPage(index + 1)}
                  className={`px-4 py-2 rounded-lg font-body transition-colors ${
                    currentPage === index + 1
                      ? "bg-[#955E30] text-white"
                      : "bg-white/10 hover:bg-white/20 text-white border border-white/20"
                  }`}
                >
                  {index + 1}
                </button>
              ))}
            </div>

            <button
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
              className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg font-body transition-colors disabled:opacity-50 disabled:cursor-not-allowed border border-white/20"
            >
              Next
            </button>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && productToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            onClick={() => setShowDeleteConfirm(false)}
          ></div>

          <div className="relative bg-black border border-white/20 rounded-2xl p-6 max-w-md w-full">
            <div className="text-center">
              <div className="bg-red-500/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-red-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white font1 mb-2">
                Delete Product?
              </h3>
              <p className="text-white/60 font-body mb-6">
                Are you sure you want to delete "{productToDelete.product_name}
                "? This action cannot be undone.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="flex-1 bg-white/10 hover:bg-white/20 text-white px-4 py-3 rounded-lg font-body font-semibold transition-colors border border-white/20"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDelete(productToDelete.product_id)}
                  className="flex-1 bg-red-500 hover:bg-red-600 text-white px-4 py-3 rounded-lg font-body font-semibold transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
