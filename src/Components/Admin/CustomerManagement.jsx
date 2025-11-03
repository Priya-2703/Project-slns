import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Search,
  Filter,
  UserCheck,
  UserX,
  Edit,
  Trash2,
  Eye,
  X,
  Mail,
  Phone,
  MapPin,
  Calendar,
  ShoppingBag,
  IndianRupee,
  ChevronLeft,
  ChevronRight,
  Download,
  TrendingUp,
  Users,
} from "lucide-react";

export default function CustomerManagement() {
  const API_BASE_URL = "http://localhost:5000";

  const [customers, setCustomers] = useState([]);
  const [filteredCustomers, setFilteredCustomers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Search & Filter
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("name");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [customersPerPage] = useState(10);

  // Modals
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  // Statistics
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    inactive: 0,
    totalRevenue: 0,
  });

  useEffect(() => {
    fetchCustomers();
  }, []);

  useEffect(() => {
    filterAndSortCustomers();
  }, [customers, searchQuery, statusFilter, sortBy]);

  // Fetch Customers
  const fetchCustomers = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_BASE_URL}/api/customers`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "ngrok-skip-browser-warning": "true",
        },
      });

      if (response.ok) {
        const data = await response.json();
        setCustomers(data.customers || []);
        calculateStats(data.customers || []);
      } else {
        setError("Failed to fetch customers");
      }
    } catch (err) {
      console.error("Error:", err);
      setError("Failed to load customers");
    } finally {
      setLoading(false);
    }
  };

  // Calculate Statistics
  const calculateStats = (customerData) => {
    const total = customerData.length;
    const active = customerData.filter((c) => c.status === "active").length;
    const inactive = total - active;
    const totalRevenue = customerData.reduce(
      (sum, c) => sum + (c.total_spent || 0),
      0
    );

    setStats({ total, active, inactive, totalRevenue });
  };

  // Filter and Sort
  const filterAndSortCustomers = () => {
    let filtered = [...customers];

    // Search
    if (searchQuery) {
      filtered = filtered.filter(
        (customer) =>
          customer.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          customer.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          customer.phone?.includes(searchQuery)
      );
    }

    // Status Filter
    if (statusFilter !== "all") {
      filtered = filtered.filter(
        (customer) => customer.status === statusFilter
      );
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.name?.localeCompare(b.name);
        case "email":
          return a.email?.localeCompare(b.email);
        case "orders":
          return (b.total_orders || 0) - (a.total_orders || 0);
        case "spent":
          return (b.total_spent || 0) - (a.total_spent || 0);
        case "date":
          return new Date(b.created_at) - new Date(a.created_at);
        default:
          return 0;
      }
    });

    setFilteredCustomers(filtered);
    setCurrentPage(1);
  };

  // Pagination
  const indexOfLastCustomer = currentPage * customersPerPage;
  const indexOfFirstCustomer = indexOfLastCustomer - customersPerPage;
  const currentCustomers = filteredCustomers.slice(
    indexOfFirstCustomer,
    indexOfLastCustomer
  );
  const totalPages = Math.ceil(filteredCustomers.length / customersPerPage);

  // Update Customer Status
  const handleStatusToggle = async (customerId, currentStatus) => {
    try {
      const token = localStorage.getItem("token");
      const newStatus = currentStatus === "active" ? "inactive" : "active";

      const response = await fetch(
        `${API_BASE_URL}/api/customers/${customerId}/status`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ status: newStatus }),
        }
      );

      if (response.ok) {
        setSuccess(
          `Customer ${
            newStatus === "active" ? "activated" : "deactivated"
          } successfully`
        );
        fetchCustomers();
        setTimeout(() => setSuccess(""), 3000);
      } else {
        setError("Failed to update status");
      }
    } catch (err) {
      setError("Error updating status");
    }
  };

  // Delete Customer
  const handleDelete = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${API_BASE_URL}/api/customers/${selectedCustomer.customer_id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        setSuccess("Customer deleted successfully");
        setDeleteModalOpen(false);
        fetchCustomers();
        setTimeout(() => setSuccess(""), 3000);
      } else {
        setError("Failed to delete customer");
      }
    } catch (err) {
      setError("Error deleting customer");
    }
  };

  // Update Customer
  const handleUpdateCustomer = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${API_BASE_URL}/api/customers/${selectedCustomer.customer_id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(selectedCustomer),
        }
      );

      if (response.ok) {
        setSuccess("Customer updated successfully");
        setEditModalOpen(false);
        fetchCustomers();
        setTimeout(() => setSuccess(""), 3000);
      } else {
        setError("Failed to update customer");
      }
    } catch (err) {
      setError("Error updating customer");
    }
  };

  // Export to CSV
  const exportToCSV = () => {
    const headers = [
      "Name",
      "Email",
      "Phone",
      "Total Orders",
      "Total Spent",
      "Status",
      "Joined Date",
    ];
    const csvData = filteredCustomers.map((c) => [
      c.name,
      c.email,
      c.phone,
      c.total_orders || 0,
      c.total_spent || 0,
      c.status,
      new Date(c.created_at).toLocaleDateString(),
    ]);

    const csvContent = [
      headers.join(","),
      ...csvData.map((row) => row.join(",")),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `customers_${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
  };

  return (
    <div className="min-h-screen bg-black py-20 mt-14">
      <div className="w-[95%] max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-white font1 mb-2">
              Customer Management
            </h1>
            <p className="text-white/60 font-body text-sm">
              Manage and monitor your customer base
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={exportToCSV}
              className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg font-body transition-all duration-300 border border-white/20"
            >
              <Download size={18} />
              Export CSV
            </button>
            <Link to="/admin/dashboard">
              <button className="flex items-center gap-2 bg-white/10 hover:bg-black text-white px-4 py-2 rounded-lg font-body transition-all duration-300 border border-white/30">
                <ChevronLeft size={18} />
                Back
              </button>
            </Link>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-white/5 border border-white/10 rounded-xl p-6 backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/60 font-body text-sm mb-1">
                  Total Customers
                </p>
                <h3 className="text-3xl font-bold text-white font1">
                  {stats.total}
                </h3>
              </div>
              <div className="bg-blue-500/20 p-3 rounded-lg">
                <Users size={24} className="text-blue-400" />
              </div>
            </div>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-xl p-6 backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/60 font-body text-sm mb-1">
                  Active Customers
                </p>
                <h3 className="text-3xl font-bold text-white font1">
                  {stats.active}
                </h3>
              </div>
              <div className="bg-green-500/20 p-3 rounded-lg">
                <UserCheck size={24} className="text-green-400" />
              </div>
            </div>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-xl p-6 backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/60 font-body text-sm mb-1">
                  Inactive Customers
                </p>
                <h3 className="text-3xl font-bold text-white font1">
                  {stats.inactive}
                </h3>
              </div>
              <div className="bg-red-500/20 p-3 rounded-lg">
                <UserX size={24} className="text-red-400" />
              </div>
            </div>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-xl p-6 backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/60 font-body text-sm mb-1">
                  Total Revenue
                </p>
                <h3 className="text-3xl font-bold text-white font1 flex items-center">
                  <IndianRupee size={24} />
                  {stats.totalRevenue.toLocaleString()}
                </h3>
              </div>
              <div className="bg-[#955E30]/20 p-3 rounded-lg">
                <TrendingUp size={24} className="text-[#955E30]" />
              </div>
            </div>
          </div>
        </div>

        {/* Success/Error Messages */}
        {success && (
          <div className="mb-6 p-4 bg-green-500/20 border border-green-500 rounded-lg text-green-400 font-body">
            {success}
          </div>
        )}
        {error && (
          <div className="mb-6 p-4 bg-red-500/20 border border-red-500 rounded-lg text-red-400 font-body">
            {error}
          </div>
        )}

        {/* Filters & Search */}
        <div className="bg-white/5 border border-white/10 rounded-xl p-4 md:p-6 backdrop-blur-sm mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="md:col-span-2">
              <div className="relative">
                <Search
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40"
                  size={20}
                />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by name, email, or phone..."
                  className="w-full pl-10 pr-4 py-3 bg-black/30 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-[#955E30] font-body"
                />
              </div>
            </div>

            {/* Status Filter */}
            <div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-4 py-3 bg-black/30 border border-white/20 rounded-lg text-white focus:outline-none focus:border-[#955E30] font-body"
              >
                <option value="all" className="bg-black text-white">
                  All Status
                </option>
                <option value="active" className="bg-black text-white">
                  Active
                </option>
                <option value="inactive" className="bg-black text-white">
                  Inactive
                </option>
              </select>
            </div>

            {/* Sort By */}
            <div>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-4 py-3 bg-black/30 border border-white/20 rounded-lg text-white focus:outline-none focus:border-[#955E30] font-body"
              >
                <option value="name" className="bg-black text-white">
                  Sort by Name
                </option>
                <option value="email" className="bg-black text-white">
                  Sort by Email
                </option>
                <option value="orders" className="bg-black text-white">
                  Sort by Orders
                </option>
                <option value="spent" className="bg-black text-white">
                  Sort by Spending
                </option>
                <option value="date" className="bg-black text-white">
                  Sort by Join Date
                </option>
              </select>
            </div>
          </div>
        </div>

        {/* Customer Table */}
        <div className="bg-white/5 border border-white/10 rounded-xl backdrop-blur-sm overflow-hidden">
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#955E30]"></div>
            </div>
          ) : currentCustomers.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-white/60 font-body">No customers found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-white/10">
                  <tr>
                    <th className="px-6 py-4 text-left text-white font-body text-sm">
                      Customer
                    </th>
                    <th className="px-6 py-4 text-left text-white font-body text-sm hidden md:table-cell">
                      Contact
                    </th>
                    <th className="px-6 py-4 text-left text-white font-body text-sm hidden lg:table-cell">
                      Orders
                    </th>
                    <th className="px-6 py-4 text-left text-white font-body text-sm hidden lg:table-cell">
                      Total Spent
                    </th>
                    <th className="px-6 py-4 text-left text-white font-body text-sm">
                      Status
                    </th>
                    <th className="px-6 py-4 text-center text-white font-body text-sm">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {currentCustomers.map((customer, index) => (
                    <tr
                      key={customer.customer_id}
                      className="border-t border-white/10 hover:bg-white/5 transition-colors"
                    >
                      {/* Customer Info */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-[#955E30]/20 flex items-center justify-center text-[#955E30] font-bold">
                            {customer.name?.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="text-white font-body font-semibold capitalize">
                              {customer.name}
                            </p>
                            <p className="text-white/60 text-xs font-body md:hidden">
                              {customer.email}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Contact */}
                      <td className="px-6 py-4 hidden md:table-cell">
                        <div className="flex flex-col gap-1">
                          <p className="text-white/80 font-body text-sm flex items-center gap-2">
                            <Mail size={14} />
                            {customer.email}
                          </p>
                          <p className="text-white/60 font-body text-sm flex items-center gap-2">
                            <Phone size={14} />
                            {customer.phone || "N/A"}
                          </p>
                        </div>
                      </td>

                      {/* Orders */}
                      <td className="px-6 py-4 hidden lg:table-cell">
                        <div className="flex items-center gap-2">
                          <ShoppingBag size={16} className="text-white/60" />
                          <span className="text-white font-body">
                            {customer.total_orders || 0}
                          </span>
                        </div>
                      </td>

                      {/* Total Spent */}
                      <td className="px-6 py-4 hidden lg:table-cell">
                        <div className="flex items-center gap-1 text-white font-body">
                          <IndianRupee size={16} />
                          {(customer.total_spent || 0).toLocaleString()}
                        </div>
                      </td>

                      {/* Status */}
                      <td className="px-6 py-4">
                        <button
                          onClick={() =>
                            handleStatusToggle(
                              customer.customer_id,
                              customer.status
                            )
                          }
                          className={`px-3 py-1 rounded-full text-xs font-body font-semibold transition-all ${
                            customer.status === "active"
                              ? "bg-green-500/20 text-green-400 hover:bg-green-500/30"
                              : "bg-red-500/20 text-red-400 hover:bg-red-500/30"
                          }`}
                        >
                          {customer.status === "active" ? "Active" : "Inactive"}
                        </button>
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => {
                              setSelectedCustomer(customer);
                              setViewModalOpen(true);
                            }}
                            className="p-2 hover:bg-blue-500/20 rounded-lg transition-colors group"
                            title="View Details"
                          >
                            <Eye
                              size={18}
                              className="text-white/60 group-hover:text-blue-400"
                            />
                          </button>
                          <button
                            onClick={() => {
                              setSelectedCustomer(customer);
                              setEditModalOpen(true);
                            }}
                            className="p-2 hover:bg-[#955E30]/20 rounded-lg transition-colors group"
                            title="Edit"
                          >
                            <Edit
                              size={18}
                              className="text-white/60 group-hover:text-[#955E30]"
                            />
                          </button>
                          <button
                            onClick={() => {
                              setSelectedCustomer(customer);
                              setDeleteModalOpen(true);
                            }}
                            className="p-2 hover:bg-red-500/20 rounded-lg transition-colors group"
                            title="Delete"
                          >
                            <Trash2
                              size={18}
                              className="text-white/60 group-hover:text-red-400"
                            />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 mt-6">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="p-2 bg-white/10 hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors"
            >
              <ChevronLeft size={20} className="text-white" />
            </button>

            <div className="flex gap-2">
              {[...Array(totalPages)].map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentPage(index + 1)}
                  className={`px-4 py-2 rounded-lg font-body transition-all ${
                    currentPage === index + 1
                      ? "bg-[#955E30] text-white"
                      : "bg-white/10 text-white/60 hover:bg-white/20"
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
              className="p-2 bg-white/10 hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors"
            >
              <ChevronRight size={20} className="text-white" />
            </button>
          </div>
        )}

        {/* View Customer Modal */}
        {viewModalOpen && selectedCustomer && (
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setViewModalOpen(false)}
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="bg-gradient-to-br from-black via-gray-900 to-black border border-white/20 rounded-2xl p-6 md:p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            >
              {/* Modal Header */}
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-white font1">
                  Customer Details
                </h2>
                <button
                  onClick={() => setViewModalOpen(false)}
                  className="text-white/60 hover:text-white transition-colors"
                >
                  <X size={24} />
                </button>
              </div>

              {/* Customer Info */}
              <div className="space-y-6">
                {/* Avatar & Name */}
                <div className="flex items-center gap-4 pb-6 border-b border-white/10">
                  <div className="w-16 h-16 rounded-full bg-[#955E30]/20 flex items-center justify-center text-[#955E30] font-bold text-2xl">
                    {selectedCustomer.name?.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white capitalize">
                      {selectedCustomer.name}
                    </h3>
                    <span
                      className={`inline-block mt-1 px-3 py-1 rounded-full text-xs font-semibold ${
                        selectedCustomer.status === "active"
                          ? "bg-green-500/20 text-green-400"
                          : "bg-red-500/20 text-red-400"
                      }`}
                    >
                      {selectedCustomer.status}
                    </span>
                  </div>
                </div>

                {/* Contact Information */}
                <div>
                  <h4 className="text-white/60 font-body text-sm mb-3 uppercase tracking-wide">
                    Contact Information
                  </h4>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 text-white font-body">
                      <Mail size={18} className="text-white/60" />
                      <span>{selectedCustomer.email}</span>
                    </div>
                    <div className="flex items-center gap-3 text-white font-body">
                      <Phone size={18} className="text-white/60" />
                      <span>{selectedCustomer.phone || "Not provided"}</span>
                    </div>
                    {selectedCustomer.address && (
                      <div className="flex items-start gap-3 text-white font-body">
                        <MapPin size={18} className="text-white/60 mt-1" />
                        <span>{selectedCustomer.address}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Order Statistics */}
                <div>
                  <h4 className="text-white/60 font-body text-sm mb-3 uppercase tracking-wide">
                    Order Statistics
                  </h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                      <p className="text-white/60 font-body text-xs mb-1">
                        Total Orders
                      </p>
                      <p className="text-2xl font-bold text-white">
                        {selectedCustomer.total_orders || 0}
                      </p>
                    </div>
                    <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                      <p className="text-white/60 font-body text-xs mb-1">
                        Total Spent
                      </p>
                      <p className="text-2xl font-bold text-white flex items-center">
                        <IndianRupee size={20} />
                        {(selectedCustomer.total_spent || 0).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Account Information */}
                <div>
                  <h4 className="text-white/60 font-body text-sm mb-3 uppercase tracking-wide">
                    Account Information
                  </h4>
                  <div className="flex items-center gap-3 text-white font-body">
                    <Calendar size={18} className="text-white/60" />
                    <span>
                      Joined on{" "}
                      {new Date(selectedCustomer.created_at).toLocaleDateString(
                        "en-IN",
                        {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        }
                      )}
                    </span>
                  </div>
                </div>
              </div>

              {/* Close Button */}
              <div className="mt-6 pt-6 border-t border-white/10">
                <button
                  onClick={() => setViewModalOpen(false)}
                  className="w-full bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-lg font-body transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Edit Customer Modal */}
        {editModalOpen && selectedCustomer && (
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setEditModalOpen(false)}
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="bg-gradient-to-br from-black via-gray-900 to-black border border-white/20 rounded-2xl p-6 md:p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            >
              {/* Modal Header */}
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-white font1">
                  Edit Customer
                </h2>
                <button
                  onClick={() => setEditModalOpen(false)}
                  className="text-white/60 hover:text-white transition-colors"
                >
                  <X size={24} />
                </button>
              </div>

              {/* Edit Form */}
              <form onSubmit={handleUpdateCustomer} className="space-y-4">
                <div>
                  <label className="block text-white font-body mb-2">
                    Name *
                  </label>
                  <input
                    type="text"
                    value={selectedCustomer.name || ""}
                    onChange={(e) =>
                      setSelectedCustomer({
                        ...selectedCustomer,
                        name: e.target.value,
                      })
                    }
                    required
                    className="w-full px-4 py-3 bg-black/30 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-[#955E30] font-body capitalize"
                  />
                </div>

                <div>
                  <label className="block text-white font-body mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    value={selectedCustomer.email || ""}
                    onChange={(e) =>
                      setSelectedCustomer({
                        ...selectedCustomer,
                        email: e.target.value,
                      })
                    }
                    required
                    className="w-full px-4 py-3 bg-black/30 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-[#955E30] font-body"
                  />
                </div>

                <div>
                  <label className="block text-white font-body mb-2">
                    Phone
                  </label>
                  <input
                    type="tel"
                    value={selectedCustomer.phone || ""}
                    onChange={(e) =>
                      setSelectedCustomer({
                        ...selectedCustomer,
                        phone: e.target.value,
                      })
                    }
                    className="w-full px-4 py-3 bg-black/30 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-[#955E30] font-body"
                  />
                </div>

                <div>
                  <label className="block text-white font-body mb-2">
                    Address
                  </label>
                  <textarea
                    value={selectedCustomer.address || ""}
                    onChange={(e) =>
                      setSelectedCustomer({
                        ...selectedCustomer,
                        address: e.target.value,
                      })
                    }
                    rows="3"
                    className="w-full px-4 py-3 bg-black/30 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-[#955E30] font-body capitalize"
                  />
                </div>

                <div>
                  <label className="block text-white font-body mb-2">
                    Status
                  </label>
                  <select
                    value={selectedCustomer.status || "active"}
                    onChange={(e) =>
                      setSelectedCustomer({
                        ...selectedCustomer,
                        status: e.target.value,
                      })
                    }
                    className="w-full px-4 py-3 bg-black/30 border border-white/20 rounded-lg text-white focus:outline-none focus:border-[#955E30] font-body"
                  >
                    <option value="active" className="bg-black">
                      Active
                    </option>
                    <option value="inactive" className="bg-black">
                      Inactive
                    </option>
                  </select>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-4 pt-4">
                  <button
                    type="submit"
                    className="flex-1 bg-[#955E30] hover:bg-[#955E30]/80 text-white px-6 py-3 rounded-lg font-body transition-colors"
                  >
                    Save Changes
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditModalOpen(false)}
                    className="flex-1 bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-lg font-body transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {deleteModalOpen && selectedCustomer && (
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setDeleteModalOpen(false)}
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="bg-gradient-to-br from-black via-gray-900 to-black border border-red-500/30 rounded-2xl p-6 md:p-8 w-full max-w-md"
            >
              {/* Warning Icon */}
              <div className="flex justify-center mb-4">
                <div className="bg-red-500/20 p-4 rounded-full">
                  <Trash2 size={32} className="text-red-400" />
                </div>
              </div>

              {/* Title */}
              <h2 className="text-2xl font-bold text-white text-center mb-2">
                Delete Customer?
              </h2>

              {/* Description */}
              <p className="text-white/60 font-body text-center mb-6">
                Are you sure you want to delete{" "}
                <span className="text-white font-semibold capitalize">
                  {selectedCustomer.name}
                </span>
                ? This action cannot be undone.
              </p>

              {/* Action Buttons */}
              <div className="flex gap-4">
                <button
                  onClick={handleDelete}
                  className="flex-1 bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-lg font-body transition-colors"
                >
                  Delete
                </button>
                <button
                  onClick={() => setDeleteModalOpen(false)}
                  className="flex-1 bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-lg font-body transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
