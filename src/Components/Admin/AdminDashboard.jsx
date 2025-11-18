import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import AddCategoryModal from "./Categories/AddCategoryModal";

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const BACKEND_URL = import.meta.env.VITE_API_URL;

  //dynamic title
  useEffect(() => {
    document.title = `Admin Dashboard - SLNS Sarees`;
  }, []);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(`${BACKEND_URL}/api/admin/stats`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const responseText = await response.text();
      try {
        const data = JSON.parse(responseText);
        if (response.ok) {
          setStats(data);
        }
      } catch (parseError) {
        console.error("❌ JSON Parse Error:", parseError);
        console.error("Full Response:", responseText);
        alert("JSON parse aagala. Console-a paaru.");
      }
    } catch (err) {
      console.error("Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "processing":
        return "bg-blue-500/20 text-blue-500 border-blue-500/30";
      case "shipped":
        return "bg-purple-500/20 text-purple-500 border-purple-500/30";
      case "delivered":
        return "bg-green-500/20 text-green-500 border-green-500/30";
      case "cancelled":
        return "bg-red-500/20 text-red-500 border-red-500/30";
      default:
        return "bg-white/20 text-white/60 border-white/30";
    }
  };

  const getPaymentStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "paid":
        return "bg-green-500/20 text-green-500";
      case "pending":
        return "bg-yellow-500/20 text-yellow-500";
      case "failed":
        return "bg-red-500/20 text-red-500";
      default:
        return "bg-white/20 text-white/60";
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleCategorySuccess = (data) => {
    console.log("Category added:", data);
    // Refresh stats to show new category
    fetchStats();
    // Optional: Show success message
    alert("Category added successfully!");
  };

  const getImageUrl = (product) => {
    if (product.primary_image_id) {
      return `${BACKEND_URL}/api/images/${product.primary_image_id}`;
    }

    if (product.primary_image) {
      if (
        product.primary_image.startsWith("http://") ||
        product.primary_image.startsWith("https://")
      ) {
        return product.primary_image;
      }
      if (product.primary_image.startsWith("/api/images/")) {
        return `${BACKEND_URL}/${product.primary_image}`;
      }
      if (product.primary_image.startsWith("/static/")) {
        return `${BACKEND_URL}/${product.primary_image}`;
      }
    }

    // For old image_url field
    if (product.image_url) {
      if (
        product.image_url.startsWith("http://") ||
        product.image_url.startsWith("https://")
      ) {
        return product.image_url;
      }
      if (product.image_url.startsWith("/static/")) {
        return `${BACKEND_URL}/${product.image_url}`;
      }
    }

    // Fallback placeholder
    return "/placeholder-image.png";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center cursor-auto">
        <div className="text-white text-xl font-body">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black py-20 mt-14 cursor-auto">
      <div className="w-[90%] mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-10">
          <h1 className="text-4xl font-bold text-white font1">
            ADMIN DASHBOARD
          </h1>
          <div className="flex justify-center items-center gap-3">
            <Link to="/admin/products/add">
              <button className="bg-[#955E30] hover:bg-[#955E30]/80 text-white px-6 py-3 rounded-lg font-body transition-colors">
                + Add Product
              </button>
            </Link>
            <button
              onClick={() => setIsCategoryModalOpen(true)}
              className="bg-[#955E30] hover:bg-[#955E30]/80 text-white px-6 py-3 rounded-lg font-body transition-colors"
            >
              + Add Category
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <div className="bg-white/5 border border-white/10 rounded-xl p-6 backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/60 text-sm font-body mb-2">
                  Total Products
                </p>
                <p className="text-3xl font-bold text-white font1">
                  {stats?.total_products || 0}
                </p>
              </div>
              <div className="bg-[#955E30]/20 p-3 rounded-lg">
                <svg
                  className="w-8 h-8 text-[#955E30]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                  />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-xl p-6 backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/60 text-sm font-body mb-2">
                  Categories
                </p>
                <p className="text-3xl font-bold text-white font1">
                  {stats?.total_categories || 0}
                </p>
              </div>
              <div className="bg-blue-500/20 p-3 rounded-lg">
                <svg
                  className="w-8 h-8 text-blue-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                  />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-xl p-6 backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/60 text-sm font-body mb-2">
                  Low Stock
                </p>
                <p className="text-3xl font-bold text-yellow-500 font1">
                  {stats?.low_stock || 0}
                </p>
              </div>
              <div className="bg-yellow-500/20 p-3 rounded-lg">
                <svg
                  className="w-8 h-8 text-yellow-500"
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
            </div>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-xl p-6 backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/60 text-sm font-body mb-2">
                  Out of Stock
                </p>
                <p className="text-3xl font-bold text-red-500 font1">
                  {stats?.out_of_stock || 0}
                </p>
              </div>
              <div className="bg-red-500/20 p-3 rounded-lg">
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
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">
          <div className="bg-white/5 border border-white/10 rounded-xl p-6">
            <h2 className="text-2xl font-bold text-white font1 mb-6">
              Quick Actions
            </h2>
            <div className="grid gap-2">
              <Link to="/admin/products/add">
                <button className="w-full bg-[#955E30] hover:bg-[#955E30]/80 text-white px-6 py-3 rounded-lg font-body transition-colors text-left flex items-center">
                  <svg
                    className="w-5 h-5 mr-3"
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

              <button
                onClick={() => setIsCategoryModalOpen(true)}
                className="w-full bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-lg font-body transition-colors text-left flex items-center border border-white/20"
              >
                <svg
                  className="w-5 h-5 mr-3"
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
                Add New Category
              </button>
              <Link to="/admin/banner-manage">
                <button className="w-full bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-lg font-body transition-colors text-left flex items-center border border-white/20">
                  <svg
                    className="w-5 h-5 mr-3"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  </svg>
                  Manage Ad Banners
                </button>
              </Link>
              <Link to="/admin/products">
                <button className="w-full bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-lg font-body transition-colors text-left flex items-center border border-white/20">
                  <svg
                    className="w-5 h-5 mr-3"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  </svg>
                  Manage Products
                </button>
              </Link>
              <Link to="/admin/categories">
                <button className="w-full bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-lg font-body transition-colors text-left flex items-center border border-white/20">
                  <svg
                    className="w-5 h-5 mr-3"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                    />
                  </svg>
                  Manage Categories
                </button>
              </Link>
              <Link to="/admin/orders">
                <button className="w-full bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-lg font2 transition-colors text-left flex items-center border border-white/20">
                  <svg
                    className="w-5 h-5 mr-3"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                    />
                  </svg>
                  Manage Orders
                </button>
              </Link>
              <Link to="/admin/import">
                <button className="w-full bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-lg font-body transition-colors text-left flex items-center border border-white/20">
                  <svg
                    className="w-5 h-5 mr-3"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                    />
                  </svg>
                  Bulk Import Products
                </button>
              </Link>
            </div>
          </div>

          {/* Products by Category */}
          <div className="bg-white/5 border border-white/10 rounded-xl p-6">
            <h2 className="text-2xl font-bold text-white font1 mb-6">
              Products by Category
            </h2>
            <div className="space-y-3">
              {stats?.products_by_category?.map((cat, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-white/5 rounded-lg"
                >
                  <span className="text-white font-body">
                    {cat.category_name}
                  </span>
                  <span className="text-[#955E30] font-bold font1">
                    {cat.count}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Orders - ADD THIS SECTION */}
        <div className="bg-white/5 border border-white/10 rounded-xl p-6 mb-10">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white font1">
              Recent Orders
            </h2>
            <Link
              to="/admin/orders"
              className="text-[#955E30] hover:text-[#955E30]/80 font-body text-sm flex items-center cursor-pointer"
            >
              View All
              <svg
                className="w-4 h-4 ml-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </Link>
          </div>

          {!stats?.recent_orders || stats.recent_orders.length === 0 ? (
            <div className="text-center py-10">
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
                  d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                />
              </svg>
              <p className="text-white/60 font-body">No orders yet</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="text-left py-3 px-4 text-white/60 font-body text-sm font-semibold">
                      Order ID
                    </th>
                    <th className="text-left py-3 px-4 text-white/60 font-body text-sm font-semibold">
                      Customer
                    </th>
                    <th className="text-left py-3 px-4 text-white/60 font-body text-sm font-semibold">
                      Date
                    </th>
                    <th className="text-left py-3 px-4 text-white/60 font-body text-sm font-semibold">
                      Items
                    </th>
                    <th className="text-left py-3 px-4 text-white/60 font-body text-sm font-semibold">
                      Amount
                    </th>
                    <th className="text-left py-3 px-4 text-white/60 font-body text-sm font-semibold">
                      Status
                    </th>
                    <th className="text-left py-3 px-4 text-white/60 font-body text-sm font-semibold">
                      Payment
                    </th>
                    <th className="text-left py-3 px-4 text-white/60 font-body text-sm font-semibold">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {stats.recent_orders.map((order) => (
                    <tr
                      key={order.order_id}
                      className="border-b border-white/5 hover:bg-white/5 transition-colors"
                    >
                      {/* Order ID */}
                      <td className="py-3 px-4">
                        <p className="text-white font-body text-sm font-semibold">
                          {order.order_number}
                        </p>
                      </td>

                      {/* Customer */}
                      <td className="py-3 px-4">
                        <p className="text-white font-body text-sm">
                          {order.customer_name || "N/A"}
                        </p>
                        <p className="text-white/40 text-xs">
                          {order.customer_email || "N/A"}
                        </p>
                      </td>

                      {/* Date */}
                      <td className="py-3 px-4">
                        <p className="text-white/80 font-body text-xs">
                          {formatDate(order.order_date || order.created_at)}
                        </p>
                      </td>

                      {/* Items */}
                      <td className="py-3 px-4">
                        <p className="text-white font-body text-sm">
                          {order.items_count || 0}
                        </p>
                      </td>

                      {/* Amount */}
                      <td className="py-3 px-4">
                        <p className="text-[#955E30] font-bold font1">
                          ₹
                          {parseFloat(order.total_amount || 0).toLocaleString()}
                        </p>
                      </td>

                      {/* Status */}
                      <td className="py-3 px-4">
                        <span
                          className={`inline-block px-3 py-1 rounded-lg text-xs font-semibold font-body border ${getStatusColor(
                            order.status
                          )}`}
                        >
                          {order.status}
                        </span>
                      </td>

                      {/* Payment */}
                      <td className="py-3 px-4">
                        <span
                          className={`inline-block px-3 py-1 rounded-lg text-xs font-semibold font-body ${getPaymentStatusColor(
                            order.payment_status
                          )}`}
                        >
                          {order.payment_status || "N/A"}
                        </span>
                      </td>

                      {/* Action */}
                      <td className="py-3 px-4">
                        <Link to={`/admin/orders`}>
                          <button className="bg-[#955E30]/20 hover:bg-[#955E30]/30 text-[#955E30] p-2 rounded-lg transition-colors border border-[#955E30]/30">
                            <svg
                              className="w-4 h-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                              />
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                              />
                            </svg>
                          </button>
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Recent Products */}
        <div className="bg-white/5 border border-white/10 rounded-xl p-6">
          <h2 className="text-2xl font-bold text-white font1 mb-6">
            Recent Products
          </h2>

          {/* Show message if no products */}
          {!stats?.recent_products || stats.recent_products.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-white/60 font-body">No products added yet</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              {stats.recent_products.map((product) => (
                <Link
                  key={product.product_id}
                  to={`/admin/products/edit/${product.product_id}`}
                  className="bg-white/5 rounded-lg overflow-hidden border border-white/10 hover:border-[#955E30] transition-colors group"
                >
                  <div className="relative h-48 bg-white/5 overflow-hidden">
                    <img
                      src={getImageUrl(product)}
                      alt={product.product_name}
                      // onError={(e) => {
                      //   console.error(
                      //     "Image failed to load for product:",
                      //     product.product_id
                      //   );
                      //   e.target.src =
                      //     'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="200" height="200"%3E%3Crect fill="%23333" width="200" height="200"/%3E%3Ctext fill="%23666" font-family="sans-serif" font-size="14" x="50%25" y="50%25" text-anchor="middle" dominant-baseline="middle"%3ENo Image%3C/text%3E%3C/svg%3E';
                      // }}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      loading="lazy"
                    />
                    {/* Image indicator */}
                    <div className="absolute bottom-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded">
                      {product.image_count || 0}{" "}
                      {product.image_count === 1 ? "image" : "images"}
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="text-white font-body text-sm mb-2 truncate group-hover:text-[#955E30] transition-colors">
                      {product.product_name}
                    </h3>
                    <div className="flex items-center justify-between">
                      <span className="text-[#955E30] font-bold">
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
                        {product.stock_quantity} in stock
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Add Category Modal */}
      <AddCategoryModal
        isOpen={isCategoryModalOpen}
        onClose={() => setIsCategoryModalOpen(false)}
        onSuccess={handleCategorySuccess}
      />
    </div>
  );
}
