import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

export default function ManageOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [paymentFilter, setPaymentFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showOrderDetails, setShowOrderDetails] = useState(false);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    processing: 0,
    shipped: 0,
    delivered: 0,
    cancelled: 0,
    totalRevenue: 0,
  });

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        "https://5b1a1ca66a6b.ngrok-free.app/api/admin/orders",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const data = await response.json();
      if (response.ok) {
        setOrders(data);
        calculateStats(data);
      }
    } catch (err) {
      console.error("Failed to fetch orders:", err);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (orderList) => {
    const stats = {
      total: orderList.length,
      pending: orderList.filter((o) => o.status === "pending").length,
      processing: orderList.filter((o) => o.status === "processing").length,
      shipped: orderList.filter((o) => o.status === "shipped").length,
      delivered: orderList.filter((o) => o.status === "delivered").length,
      cancelled: orderList.filter((o) => o.status === "cancelled").length,
      totalRevenue: orderList
        .filter((o) => o.status !== "cancelled")
        .reduce((sum, o) => sum + parseFloat(o.total_amount || 0), 0),
    };
    setStats(stats);
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `https://5b1a1ca66a6b.ngrok-free.app/api/admin/orders/${orderId}/status`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ status: newStatus }),
        }
      );

      if (response.ok) {
        setOrders(
          orders.map((o) =>
            o.order_id === orderId ? { ...o, status: newStatus } : o
          )
        );
        if (selectedOrder?.order_id === orderId) {
          setSelectedOrder({ ...selectedOrder, status: newStatus });
        }
        alert("Order status updated successfully!");
      }
    } catch (err) {
      console.error("Failed to update order status:", err);
      alert("Failed to update order status");
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "pending":
        return "bg-yellow-500/20 text-yellow-500 border-yellow-500/30";
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

  // Filter orders
  const filteredOrders = orders
    .filter((order) => {
      const matchesSearch =
        order.order_id.toString().includes(searchTerm) ||
        order.customer_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customer_email?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus =
        statusFilter === "all" || order.status === statusFilter;
      const matchesPayment =
        paymentFilter === "all" || order.payment_status === paymentFilter;

      let matchesDate = true;
      if (dateFilter !== "all") {
        const orderDate = new Date(order.created_at);
        const today = new Date();
        const diffDays = Math.floor(
          (today - orderDate) / (1000 * 60 * 60 * 24)
        );

        switch (dateFilter) {
          case "today":
            matchesDate = diffDays === 0;
            break;
          case "week":
            matchesDate = diffDays <= 7;
            break;
          case "month":
            matchesDate = diffDays <= 30;
            break;
        }
      }

      return matchesSearch && matchesStatus && matchesPayment && matchesDate;
    })
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentOrders = filteredOrders.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-xl font-body">Loading orders...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black py-20">
      <div className="w-[90%] mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-4xl font-bold text-white font1 mt-2">
              ORDER MANAGEMENT
            </h1>
            <p className="text-white/60 font-body mt-2">
              {filteredOrders.length} orders found
            </p>
          </div>
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
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4 mb-8">
          <div className="bg-white/5 border border-white/10 rounded-xl p-4">
            <p className="text-white/60 text-xs font-body mb-1">Total Orders</p>
            <p className="text-2xl font-bold text-white font1">{stats.total}</p>
          </div>
          <div className="bg-white/5 border border-yellow-500/20 rounded-xl p-4">
            <p className="text-yellow-500/60 text-xs font-body mb-1">Pending</p>
            <p className="text-2xl font-bold text-yellow-500 font1">
              {stats.pending}
            </p>
          </div>
          <div className="bg-white/5 border border-blue-500/20 rounded-xl p-4">
            <p className="text-blue-500/60 text-xs font-body mb-1">
              Processing
            </p>
            <p className="text-2xl font-bold text-blue-500 font1">
              {stats.processing}
            </p>
          </div>
          <div className="bg-white/5 border border-purple-500/20 rounded-xl p-4">
            <p className="text-purple-500/60 text-xs font-body mb-1">Shipped</p>
            <p className="text-2xl font-bold text-purple-500 font1">
              {stats.shipped}
            </p>
          </div>
          <div className="bg-white/5 border border-green-500/20 rounded-xl p-4">
            <p className="text-green-500/60 text-xs font-body mb-1">
              Delivered
            </p>
            <p className="text-2xl font-bold text-green-500 font1">
              {stats.delivered}
            </p>
          </div>
          <div className="bg-white/5 border border-red-500/20 rounded-xl p-4">
            <p className="text-red-500/60 text-xs font-body mb-1">Cancelled</p>
            <p className="text-2xl font-bold text-red-500 font1">
              {stats.cancelled}
            </p>
          </div>
          <div className="bg-[#955E30]/10 border border-[#955E30]/30 rounded-xl p-4">
            <p className="text-[#955E30]/60 text-xs font-body mb-1">Revenue</p>
            <p className="text-xl font-bold text-[#955E30] font1">
              ₹{stats.totalRevenue.toLocaleString()}
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white/5 border border-white/10 rounded-xl p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Search */}
            <div>
              <label className="block text-white/60 text-xs font-body mb-2">
                Search Orders
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Order ID, Name, Email..."
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

            {/* Status Filter */}
            <div>
              <label className="block text-white/60 text-xs font-body mb-2">
                Order Status
              </label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full bg-black/10 border border-white/20 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-[#955E30] transition-colors font-body"
              >
                <option className="text-black bg-transparent" value="all">All Status</option>
                <option className="text-black bg-transparent" value="pending">Pending</option>
                <option className="text-black bg-transparent" value="processing">Processing</option>
                <option className="text-black bg-transparent" value="shipped">Shipped</option>
                <option className="text-black bg-transparent" value="delivered">Delivered</option>
                <option className="text-black bg-transparent" value="cancelled">Cancelled</option>
              </select>
            </div>

            {/* Payment Filter */}
            <div>
              <label className="block text-white/60 text-xs font-body mb-2">
                Payment Status
              </label>
              <select
                value={paymentFilter}
                onChange={(e) => setPaymentFilter(e.target.value)}
                className="w-full bg-black/10 border border-white/20 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-[#955E30] transition-colors font-body"
              >
                <option className="text-black bg-transparent" value="all">All Payments</option>
                <option className="text-black bg-transparent" value="paid">Paid</option>
                <option className="text-black bg-transparent" value="pending">Pending</option>
                <option className="text-black bg-transparent" value="failed">Failed</option>
              </select>
            </div>

            {/* Date Filter */}
            <div>
              <label className="block text-white/60 text-xs font-body mb-2">
                Date Range
              </label>
              <select
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="w-full bg-black/10 border border-white/20 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-[#955E30] transition-colors font-body"
              >
                <option className="text-black bg-transparent" value="all">All Time</option>
                <option className="text-black bg-transparent" value="today">Today</option>
                <option className="text-black bg-transparent" value="week">Last 7 Days</option>
                <option className="text-black bg-transparent" value="month">Last 30 Days</option>
              </select>
            </div>
          </div>
        </div>

        {/* Orders Table */}
        {currentOrders.length === 0 ? (
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
                d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
              />
            </svg>
            <p className="text-white/40 font-body">No orders found</p>
          </div>
        ) : (
          <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden">
            {/* Table Header */}
            <div className="bg-white/5 border-b border-white/10 px-6 py-4 grid grid-cols-12 gap-4 text-white/60 font-body text-sm font-semibold">
              <div className="col-span-1">Order ID</div>
              <div className="col-span-2">Customer</div>
              <div className="col-span-2">Date</div>
              <div className="col-span-1">Items</div>
              <div className="col-span-1">Amount</div>
              <div className="col-span-2">Status</div>
              <div className="col-span-2">Payment</div>
              <div className="col-span-1">Actions</div>
            </div>

            {/* Table Body */}
            <div className="divide-y divide-white/10">
              {currentOrders.map((order) => (
                <div
                  key={order.order_id}
                  className="px-6 py-4 hover:bg-white/5 transition-colors grid grid-cols-12 gap-4 items-center"
                >
                  {/* Order ID */}
                  <div className="col-span-1">
                    <p className="text-white font-body font-semibold">
                      #{order.order_id}
                    </p>
                  </div>

                  {/* Customer */}
                  <div className="col-span-2">
                    <p className="text-white font-body text-sm">
                      {order.customer_name || "N/A"}
                    </p>
                    <p className="text-white/40 text-xs truncate">
                      {order.customer_email || "N/A"}
                    </p>
                  </div>

                  {/* Date */}
                  <div className="col-span-2">
                    <p className="text-white/80 font-body text-sm">
                      {formatDate(order.created_at)}
                    </p>
                  </div>

                  {/* Items */}
                  <div className="col-span-1">
                    <p className="text-white font-body">
                      {order.items_count || 0} items
                    </p>
                  </div>

                  {/* Amount */}
                  <div className="col-span-1">
                    <p className="text-[#955E30] font-bold font1">
                      ₹{parseFloat(order.total_amount || 0).toLocaleString()}
                    </p>
                  </div>

                  {/* Status */}
                  <div className="col-span-2">
                    <select
                      value={order.status}
                      onChange={(e) =>
                        updateOrderStatus(order.order_id, e.target.value)
                      }
                      className={`w-full px-3 py-1.5 rounded-lg text-xs font-semibold font-body border transition-colors ${getStatusColor(
                        order.status
                      )} cursor-pointer`}
                    >
                      <option value="pending">Pending</option>
                      <option value="processing">Processing</option>
                      <option value="shipped">Shipped</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>

                  {/* Payment */}
                  <div className="col-span-2">
                    <div className="flex items-center gap-2">
                      <span
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold font-body ${getPaymentStatusColor(
                          order.payment_status
                        )}`}
                      >
                        {order.payment_status || "N/A"}
                      </span>
                      <span className="text-white/40 text-xs">
                        {order.payment_method || "N/A"}
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="col-span-1">
                    <button
                      onClick={() => {
                        setSelectedOrder(order);
                        setShowOrderDetails(true);
                      }}
                      className="bg-[#955E30]/20 hover:bg-[#955E30]/30 text-[#955E30] p-2 rounded-lg transition-colors border border-[#955E30]/30"
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
                  </div>
                </div>
              ))}
            </div>
          </div>
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

      {/* Order Details Modal */}
      {showOrderDetails && selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            onClick={() => setShowOrderDetails(false)}
          ></div>

          <div className="relative bg-black border border-white/20 rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto my-8">
            {/* Header */}
            <div className="sticky top-0 bg-black border-b border-white/10 px-6 py-4 flex items-center justify-between z-10">
              <div>
                <h2 className="text-2xl font-bold text-white font1">
                  Order #{selectedOrder.order_id}
                </h2>
                <p className="text-white/60 font-body text-sm mt-1">
                  {formatDate(selectedOrder.created_at)}
                </p>
              </div>
              <button
                onClick={() => setShowOrderDetails(false)}
                className="text-white/60 hover:text-white transition-colors"
              >
                <svg
                  className="w-6 h-6"
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
              </button>
            </div>

            {/* Body */}
            <div className="p-6 space-y-6">
              {/* Status & Payment */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                  <p className="text-white/60 text-sm font-body mb-2">
                    Order Status
                  </p>
                  <span
                    className={`inline-block px-4 py-2 rounded-lg text-sm font-semibold font-body border ${getStatusColor(
                      selectedOrder.status
                    )}`}
                  >
                    {selectedOrder.status}
                  </span>
                </div>
                <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                  <p className="text-white/60 text-sm font-body mb-2">
                    Payment Status
                  </p>
                  <div className="flex items-center gap-2">
                    <span
                      className={`inline-block px-4 py-2 rounded-lg text-sm font-semibold font-body ${getPaymentStatusColor(
                        selectedOrder.payment_status
                      )}`}
                    >
                      {selectedOrder.payment_status}
                    </span>
                    <span className="text-white/60 text-sm font-body">
                      via {selectedOrder.payment_method}
                    </span>
                  </div>
                </div>
              </div>

              {/* Customer Info */}
              <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                <h3 className="text-white font1 font-semibold mb-3 flex items-center">
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
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                  Customer Information
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-white/60 text-xs font-body mb-1">Name</p>
                    <p className="text-white font-body">
                      {selectedOrder.customer_name || "N/A"}
                    </p>
                  </div>
                  <div>
                    <p className="text-white/60 text-xs font-body mb-1">
                      Email
                    </p>
                    <p className="text-white font-body">
                      {selectedOrder.customer_email || "N/A"}
                    </p>
                  </div>
                  <div>
                    <p className="text-white/60 text-xs font-body mb-1">
                      Phone
                    </p>
                    <p className="text-white font-body">
                      {selectedOrder.customer_phone || "N/A"}
                    </p>
                  </div>
                  <div>
                    <p className="text-white/60 text-xs font-body mb-1">
                      User ID
                    </p>
                    <p className="text-white font-body">
                      {selectedOrder.user_id || "Guest"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Shipping Address */}
              <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                <h3 className="text-white font1 font-semibold mb-3 flex items-center">
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
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  Shipping Address
                </h3>
                <p className="text-white font-body">
                  {selectedOrder.shipping_address || "No address provided"}
                </p>
              </div>

              {/* Order Items */}
              <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                <h3 className="text-white font1 font-semibold mb-3 flex items-center">
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
                      d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                    />
                  </svg>
                  Order Items ({selectedOrder.items?.length || 0})
                </h3>
                <div className="space-y-3">
                  {selectedOrder.items?.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-4 p-3 bg-white/5 rounded-lg"
                    >
                      <div className="w-16 h-16 bg-white/10 rounded-lg overflow-hidden flex-shrink-0">
                        <img
                          src={item.image_url || "placeholder.png"}
                          alt={item.product_name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-white font-body font-semibold">
                          {item.product_name}
                        </h4>
                        <p className="text-white/60 text-sm font-body">
                          Size: {item.size || "N/A"} | Color:{" "}
                          {item.color || "N/A"}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-white font-body">
                          Qty: {item.quantity}
                        </p>
                        <p className="text-[#955E30] font-bold font1">
                          ₹{item.price}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Order Summary */}
              <div className="bg-[#955E30]/10 border border-[#955E30]/30 rounded-xl p-4">
                <h3 className="text-white font1 font-semibold mb-3">
                  Order Summary
                </h3>
                <div className="space-y-2">
                  <div className="flex justify-between text-white/80 font-body">
                    <span>Subtotal</span>
                    <span>
                      ₹
                      {(
                        parseFloat(selectedOrder.total_amount) -
                        parseFloat(selectedOrder.shipping_cost || 0)
                      ).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between text-white/80 font-body">
                    <span>Shipping</span>
                    <span>
                      ₹
                      {parseFloat(
                        selectedOrder.shipping_cost || 0
                      ).toLocaleString()}
                    </span>
                  </div>
                  {selectedOrder.discount > 0 && (
                    <div className="flex justify-between text-green-500 font-body">
                      <span>Discount</span>
                      <span>
                        -₹{parseFloat(selectedOrder.discount).toLocaleString()}
                      </span>
                    </div>
                  )}
                  <div className="border-t border-white/20 pt-2 flex justify-between text-white font1 text-lg font-bold">
                    <span>Total</span>
                    <span className="text-[#955E30]">
                      ₹{parseFloat(selectedOrder.total_amount).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Order Timeline */}
              <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                <h3 className="text-white font1 font-semibold mb-4 flex items-center">
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
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  Order Timeline
                </h3>
                <div className="space-y-4">
                  {["pending", "processing", "shipped", "delivered"].map(
                    (status, index) => {
                      const isActive =
                        [
                          "pending",
                          "processing",
                          "shipped",
                          "delivered",
                        ].indexOf(selectedOrder.status) >= index;
                      return (
                        <div key={status} className="flex items-center gap-3">
                          <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                              isActive
                                ? "bg-[#955E30] text-white"
                                : "bg-white/10 text-white/40"
                            }`}
                          >
                            {isActive ? (
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
                                  d="M5 13l4 4L19 7"
                                />
                              </svg>
                            ) : (
                              <div className="w-2 h-2 rounded-full bg-current"></div>
                            )}
                          </div>
                          <div className="flex-1">
                            <p
                              className={`font-body font-semibold capitalize ${
                                isActive ? "text-white" : "text-white/40"
                              }`}
                            >
                              {status}
                            </p>
                          </div>
                        </div>
                      );
                    }
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <button
                  onClick={() => window.print()}
                  className="flex-1 bg-white/10 hover:bg-white/20 text-white px-4 py-3 rounded-lg font-body font-semibold transition-colors border border-white/20 flex items-center justify-center"
                >
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
                      d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"
                    />
                  </svg>
                  Print Invoice
                </button>
                <button
                  onClick={() => setShowOrderDetails(false)}
                  className="flex-1 bg-[#955E30] hover:bg-[#955E30]/80 text-white px-4 py-3 rounded-lg font-body font-semibold transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
