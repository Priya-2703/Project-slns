import React, { useState, useEffect, useContext } from "react";
import {
  Package,
  RefreshCw,
  DollarSign,
  X,
  Check,
  Clock,
  Eye,
  Download,
  Search,
  Filter,
  ChevronDown,
  User,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Image as ImageIcon,
  CreditCard,
  Building2,
  Loader,
  Link,
} from "lucide-react";
import { ToastContext } from "../../Context/UseToastContext";
import { useNavigate } from "react-router-dom";

const AdminReturnRequests = () => {
  const navigate = useNavigate();
  const [returnRequests, setReturnRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showDetailsPopup, setShowDetailsPopup] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterAction, setFilterAction] = useState("all");
  const [processingId, setProcessingId] = useState(null);

  const { showToast } = useContext(ToastContext);
  const BACKEND_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    fetchReturnRequests();
  }, []);

  // ✅ Fetch all return requests
  const fetchReturnRequests = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("adminToken");

      const response = await fetch(`${BACKEND_URL}/api/admin/return-requests`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch return requests");
      }

      const data = await response.json();
      console.log("Return Requests:", data.returns);
      setReturnRequests(data.returns || []);
    } catch (error) {
      console.error("Error fetching return requests:", error);
      showToast("Failed to load return requests", "error");
      setReturnRequests([]);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Handle approve/reject
  const handleStatusUpdate = async (
    requestId,
    status,
    rejectionReason = ""
  ) => {
    try {
      setProcessingId(requestId);
      const token = localStorage.getItem("adminToken");

      const response = await fetch(
        `${BACKEND_URL}/api/admin/return-requests/${requestId}/status`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status, rejectionReason }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to update status");
      }

      showToast(
        `Return request ${
          status === "approved" ? "approved" : "rejected"
        } successfully!`,
        "success"
      );

      await fetchReturnRequests();
    } catch (error) {
      console.error("Error updating status:", error);
      showToast(error.message || "Failed to update status", "error");
    } finally {
      setProcessingId(null);
    }
  };

  // ✅ View details
  const handleViewDetails = (request) => {
    setSelectedRequest(request);
    setShowDetailsPopup(true);
  };

  // ✅ Filter and search
  const filteredRequests = returnRequests.filter((request) => {
    const matchesSearch =
      request.order_id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.user?.email?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      filterStatus === "all" || request.status === filterStatus;

    const matchesAction =
      filterAction === "all" || request.action === filterAction;

    return matchesSearch && matchesStatus && matchesAction;
  });

  // ✅ Status badge component
  const StatusBadge = ({ status }) => {
    const styles = {
      pending: "bg-yellow-500/20 text-yellow-400 border-yellow-500",
      approved: "bg-green-500/20 text-green-400 border-green-500",
      rejected: "bg-red-500/20 text-red-400 border-red-500",
      processing: "bg-blue-500/20 text-blue-400 border-blue-500",
    };

    const icons = {
      pending: <Clock size={14} />,
      approved: <Check size={14} />,
      rejected: <X size={14} />,
      processing: <Loader size={14} className="animate-spin" />,
    };

    return (
      <span
        className={`px-3 py-1 rounded-full text-xs font-semibold border flex items-center gap-1 ${
          styles[status] || styles.pending
        }`}
      >
        {icons[status]}
        {status.toUpperCase()}
      </span>
    );
  };

  // ✅ Reason badge
  const ReasonBadge = ({ reason }) => {
    const reasonText = {
      size_not_fitting: "Size Issue",
      wrong_item: "Wrong Item",
      damaged: "Damaged",
      quality: "Quality Issue",
    };

    return (
      <span className="px-2 py-1 bg-gray-700 rounded text-xs">
        {reasonText[reason] || reason}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <Loader className="w-12 h-12 text-white animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white p-4 mt-24 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className=" flex justify-between items-center">
          <div className="mb-8">
            <h1 className="text-4xl md:text-[35px] uppercase font-bold">
              Return Requests
            </h1>
            <p className="text-gray-400 text-[14px] font-body">
              Manage customer return and refund requests
            </p>
          </div>
          <button
            onClick={() => navigate("/admin/dashboard")}
            className="text-white hover:text-white/60 font-body flex gap-1 justify-center text-[14px] items-center bg-white/10 hover:bg-black cursor-pointer border border-white/30 rounded-4xl py-2 px-4 duration-300 transition-all"
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
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Back to Dashboard
          </button>
        </div>

        {/* Filters */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-4 md:p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="md:col-span-2">
              <div className="relative">
                <Search
                  size={20}
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                />
                <input
                  type="text"
                  placeholder="Search by Order ID, Name, Email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-white/10 border border-white/20 rounded-lg pl-10 pr-4 py-3 text-white outline-none focus:border-gray-500 transition-colors font-body"
                />
              </div>
            </div>

            {/* Status Filter */}
            <div>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white outline-none focus:border-gray-500 transition-colors font-body"
              >
                <option value="all" className="bg-black">
                  All Status
                </option>
                <option value="pending" className="bg-black">
                  Pending
                </option>
                <option value="approved" className="bg-black">
                  Approved
                </option>
                <option value="rejected" className="bg-black">
                  Rejected
                </option>
              </select>
            </div>

            {/* Action Filter */}
            <div>
              <select
                value={filterAction}
                onChange={(e) => setFilterAction(e.target.value)}
                className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white outline-none focus:border-gray-500 transition-colors font-body"
              >
                <option value="all" className="bg-black">
                  All Actions
                </option>
                <option value="refund" className="bg-black">
                  Refund
                </option>
                <option value="exchange" className="bg-black">
                  Exchange
                </option>
              </select>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
            <div className="bg-white/5 rounded-lg p-3">
              <p className="text-gray-400 text-xs">Total</p>
              <p className="text-2xl font-bold">{returnRequests.length}</p>
            </div>
            <div className="bg-yellow-500/10 rounded-lg p-3">
              <p className="text-gray-400 text-xs">Pending</p>
              <p className="text-2xl font-bold text-yellow-400">
                {returnRequests.filter((r) => r.status === "pending").length}
              </p>
            </div>
            <div className="bg-green-500/10 rounded-lg p-3">
              <p className="text-gray-400 text-xs">Approved</p>
              <p className="text-2xl font-bold text-green-400">
                {returnRequests.filter((r) => r.status === "approved").length}
              </p>
            </div>
            <div className="bg-red-500/10 rounded-lg p-3">
              <p className="text-gray-400 text-xs">Rejected</p>
              <p className="text-2xl font-bold text-red-400">
                {returnRequests.filter((r) => r.status === "rejected").length}
              </p>
            </div>
          </div>
        </div>

        {/* Requests Table */}
        <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-white/5">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    Order ID
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    Reason
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    Action
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {filteredRequests.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="px-6 py-12 text-center">
                      <Package
                        size={48}
                        className="mx-auto mb-4 text-gray-600"
                      />
                      <p className="text-gray-400">No return requests found</p>
                    </td>
                  </tr>
                ) : (
                  filteredRequests.map((request) => (
                    <tr
                      key={request.id || request._id}
                      className="hover:bg-white/5 transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <Package size={16} className="text-gray-400" />
                          <span className="font-mono text-sm">
                            {request.order_id}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-semibold">{request.user?.name}</p>
                          <p className="text-xs text-gray-400">
                            {request.user?.email}
                          </p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <ReasonBadge reason={request.reason} />
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          {request.action === "refund" ? (
                            <>
                              <DollarSign
                                size={16}
                                className="text-green-400"
                              />
                              <span className="text-green-400">Refund</span>
                            </>
                          ) : (
                            <>
                              <RefreshCw size={16} className="text-blue-400" />
                              <span className="text-blue-400">Exchange</span>
                            </>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <StatusBadge status={request.status} />
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-400">
                        {new Date(request.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => handleViewDetails(request)}
                            className="p-2 bg-blue-600/20 border border-blue-700 rounded-lg hover:bg-blue-700 transition-all"
                            title="View Details"
                          >
                            <Eye size={16} />
                          </button>

                          {request.status === "pending" && (
                            <>
                              <button
                                onClick={() =>
                                  handleStatusUpdate(
                                    request.id || request._id,
                                    "approved"
                                  )
                                }
                                disabled={
                                  processingId === (request.id || request._id)
                                }
                                className="p-2 bg-green-600/20 border border-green-700 rounded-lg hover:bg-green-700 transition-all disabled:opacity-50"
                                title="Approve"
                              >
                                {processingId ===
                                (request.id || request._id) ? (
                                  <Loader size={16} className="animate-spin" />
                                ) : (
                                  <Check size={16} />
                                )}
                              </button>

                              <button
                                onClick={() => {
                                  const reason = prompt(
                                    "Enter rejection reason (optional):"
                                  );
                                  if (reason !== null) {
                                    handleStatusUpdate(
                                      request.id || request._id,
                                      "rejected",
                                      reason
                                    );
                                  }
                                }}
                                disabled={
                                  processingId === (request.id || request._id)
                                }
                                className="p-2 bg-red-600/20 border border-red-700 rounded-lg hover:bg-red-700 transition-all disabled:opacity-50"
                                title="Reject"
                              >
                                <X size={16} />
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* ✅ Details Popup */}
      {showDetailsPopup && selectedRequest && (
        <>
          <div
            className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50"
            onClick={() => setShowDetailsPopup(false)}
          />

          <div className="fixed inset-0 flex items-center justify-center z-50 p-4 overflow-y-auto">
            <div
              className="bg-gradient-to-br from-gray-900 to-black border border-white/20 rounded-3xl p-6 md:p-8 max-w-4xl w-full shadow-2xl my-8"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-2xl md:text-3xl font-bold mb-2">
                    Return Request Details
                  </h2>
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-gray-400">
                      {selectedRequest.order_id}
                    </span>
                    <StatusBadge status={selectedRequest.status} />
                  </div>
                </div>
                <button
                  onClick={() => setShowDetailsPopup(false)}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Customer Info */}
                <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                  <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                    <User size={20} />
                    Customer Information
                  </h3>
                  <div className="space-y-3 text-sm">
                    <div>
                      <p className="text-gray-400">Name</p>
                      <p className="font-semibold">
                        {selectedRequest.user?.name}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-400">Email</p>
                      <p className="font-semibold">
                        {selectedRequest.user?.email}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-400">Phone</p>
                      <p className="font-semibold">
                        {selectedRequest.user?.phone || "N/A"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Return Info */}
                <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                  <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                    <RefreshCw size={20} />
                    Return Information
                  </h3>
                  <div className="space-y-3 text-sm">
                    <div>
                      <p className="text-gray-400">Reason</p>
                      <ReasonBadge reason={selectedRequest.reason} />
                    </div>
                    <div>
                      <p className="text-gray-400">Action Required</p>
                      <p className="font-semibold capitalize">
                        {selectedRequest.action}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-400">Submitted On</p>
                      <p className="font-semibold">
                        {new Date(selectedRequest.created_at).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Comments */}
                <div className="md:col-span-2 bg-white/5 rounded-xl p-6 border border-white/10">
                  <h3 className="text-lg font-bold mb-3">Comments</h3>
                  <p className="text-gray-300 text-sm">
                    {selectedRequest.comments}
                  </p>
                </div>

                {/* ✅ Refund Payment Details */}
                {selectedRequest.action === "refund" && (
                  <div className="md:col-span-2 bg-gradient-to-br from-purple-900/20 to-blue-900/20 rounded-xl p-6 border border-purple-500/30">
                    <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                      <DollarSign size={20} className="text-purple-400" />
                      Refund Payment Details
                    </h3>

                    {selectedRequest.refund_method === "upi" ? (
                      <div className="bg-white/5 rounded-lg p-4">
                        <p className="text-gray-400 text-sm mb-2">UPI ID</p>
                        <div className="flex items-center justify-between">
                          <p className="text-xl font-mono font-bold">
                            {selectedRequest.upi_id}
                          </p>
                          <button
                            onClick={() => {
                              navigator.clipboard.writeText(
                                selectedRequest.upi_id
                              );
                              showToast("UPI ID copied!", "success");
                            }}
                            className="px-3 py-1 bg-purple-600 rounded-lg text-sm hover:bg-purple-700 transition-colors"
                          >
                            Copy
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="bg-white/5 rounded-lg p-4">
                            <p className="text-gray-400 text-sm mb-1">
                              Account Holder
                            </p>
                            <p className="font-semibold">
                              {selectedRequest.account_holder_name}
                            </p>
                          </div>
                          <div className="bg-white/5 rounded-lg p-4">
                            <p className="text-gray-400 text-sm mb-1">
                              Bank Name
                            </p>
                            <p className="font-semibold">
                              {selectedRequest.bank_name || "N/A"}
                            </p>
                          </div>
                        </div>
                        <div className="bg-white/5 rounded-lg p-4">
                          <p className="text-gray-400 text-sm mb-1">
                            Account Number
                          </p>
                          <div className="flex items-center justify-between">
                            <p className="font-mono font-bold">
                              {selectedRequest.account_number}
                            </p>
                            <button
                              onClick={() => {
                                navigator.clipboard.writeText(
                                  selectedRequest.account_number
                                );
                                showToast("Account number copied!", "success");
                              }}
                              className="px-3 py-1 bg-purple-600 rounded-lg text-sm hover:bg-purple-700 transition-colors"
                            >
                              Copy
                            </button>
                          </div>
                        </div>
                        <div className="bg-white/5 rounded-lg p-4">
                          <p className="text-gray-400 text-sm mb-1">
                            IFSC Code
                          </p>
                          <div className="flex items-center justify-between">
                            <p className="font-mono font-bold">
                              {selectedRequest.ifsc_code}
                            </p>
                            <button
                              onClick={() => {
                                navigator.clipboard.writeText(
                                  selectedRequest.ifsc_code
                                );
                                showToast("IFSC code copied!", "success");
                              }}
                              className="px-3 py-1 bg-purple-600 rounded-lg text-sm hover:bg-purple-700 transition-colors"
                            >
                              Copy
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* ✅ Uploaded Images */}
                {selectedRequest.images &&
                  selectedRequest.images.length > 0 && (
                    <div className="md:col-span-2 bg-white/5 rounded-xl p-6 border border-white/10">
                      <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                        <ImageIcon size={20} />
                        Uploaded Images ({selectedRequest.images.length})
                      </h3>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {selectedRequest.images.map((image, index) => (
                          <div key={index} className="relative group">
                            <img
                              src={`${BACKEND_URL}${image}`}
                              alt={`Return evidence ${index + 1}`}
                              className="w-full h-32 object-cover rounded-lg border border-white/20"
                            />
                            <a
                              href={`${BACKEND_URL}${image}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-lg"
                            >
                              <Eye size={24} className="text-white" />
                            </a>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
              </div>

              {/* Action Buttons */}
              {selectedRequest.status === "pending" && (
                <div className="flex gap-3 mt-6 pt-6 border-t border-white/10">
                  <button
                    onClick={() => {
                      handleStatusUpdate(
                        selectedRequest.id || selectedRequest._id,
                        "approved"
                      );
                      setShowDetailsPopup(false);
                    }}
                    className="flex-1 bg-green-600/20 border border-green-700 text-white font-bold py-3 rounded-lg hover:bg-green-700 transition-all flex items-center justify-center gap-2"
                  >
                    <Check size={20} />
                    Approve Return
                  </button>
                  <button
                    onClick={() => {
                      const reason = prompt("Enter rejection reason:");
                      if (reason !== null) {
                        handleStatusUpdate(
                          selectedRequest.id || selectedRequest._id,
                          "rejected",
                          reason
                        );
                        setShowDetailsPopup(false);
                      }
                    }}
                    className="flex-1 bg-red-600/20 border border-red-700 text-white font-bold py-3 rounded-lg hover:bg-red-700 transition-all flex items-center justify-center gap-2"
                  >
                    <X size={20} />
                    Reject Return
                  </button>
                </div>
              )}

              {/* Status Message */}
              {selectedRequest.status !== "pending" && (
                <div
                  className={`mt-6 p-4 rounded-lg border ${
                    selectedRequest.status === "approved"
                      ? "bg-green-900/20 border-green-700"
                      : "bg-red-900/20 border-red-700"
                  }`}
                >
                  <p className="font-semibold">
                    This return request has been{" "}
                    {selectedRequest.status.toUpperCase()}
                  </p>
                  {selectedRequest.rejection_reason && (
                    <p className="text-sm text-gray-400 mt-2">
                      Reason: {selectedRequest.rejection_reason}
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default AdminReturnRequests;
