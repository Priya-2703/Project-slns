import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import AddCategoryModal from "./AddCategoryModal";
import EditCategoryModal from "./EditCategoryModal ";

export default function ManageCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  // Base URL for your API - UPDATE THIS TO YOUR BACKEND URL
  const API_BASE_URL = "https://e6d7d36fc1c2.ngrok-free.app";

  useEffect(() => {
    fetchCategories();
  }, []);

  //saran
  const fetchCategories = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_BASE_URL}/api/categories`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "ngrok-skip-browser-warning": "true",
        },
      });

      const responseText = await response.text();

      // Parse panna try panrom
      try {
        const data = JSON.parse(responseText);
        if (response.ok) {
          setCategories(data.categories);
          console.log("✅ Success! Data:", data);
        }
      } catch (parseError) {
        console.error("❌ JSON Parse Error:", parseError);
        console.error("Full Response:", responseText);
        alert("JSON parse aagala. Console-a paaru.");
      }
    } catch (err) {
      console.error("Failed to fetch categories:", err);
    } finally {
      setLoading(false);
    }
  };

  //priyaa
  // const fetchCategories = async () => {
  //   try {
  //     const token = localStorage.getItem("token");
  //     const response = await fetch(
  //       "https://5b1a1ca66a6b.ngrok-free.app/api/categories",
  //       {
  //         headers: { Authorization: `Bearer ${token}` },
  //       }
  //     );
  //     const data = await response.json();
  //     if (response.ok) {
  //       setCategories(data);
  //     }
  //   } catch (err) {
  //     console.error("Failed to fetch categories:", err);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const handleEdit = (category) => {
    setSelectedCategory(category);
    setIsEditModalOpen(true);
  };

  const handleDelete = async (categoryId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${API_BASE_URL}/api/categories/${categoryId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "ngrok-skip-browser-warning": "69420", // ← Any value works (consistency-kaga)
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        const error = await response.json().catch(() => ({
          message: "Failed to delete category",
        }));
        throw new Error(
          error.message || `HTTP error! status: ${response.status}`
        );
      }

      // Success
      alert("Category deleted successfully!");
      fetchCategories();
      setDeleteConfirm(null);
      console.log("✅ Category deleted:", categoryId);
    } catch (err) {
      console.error("❌ Delete error:", err);
      alert("Failed to delete category: " + err.message);
    }
  };

  const handleSuccess = () => {
    fetchCategories();
    setIsAddModalOpen(false);
    setIsEditModalOpen(false);
  };

  const filteredCategories = categories.filter((cat) =>
    cat.category_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-xl font-body">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black py-20 mt-28 cursor-auto">
      <div className="w-[90%] mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-10">
          <div>
            <Link
              to="/admin/dashboard"
              className="text-white hover:text-white/60 font-body inline-block bg-white/10 hover:bg-black cursor-pointer border border-white/30 rounded-4xl py-2 px-4 duration-300 transition-all my-3"
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
            <h1 className="text-4xl font-bold text-white font1 mb-2">
              MANAGE CATEGORIES
            </h1>
            <p className="text-white/60 font-body">
              Total {filteredCategories.length} categories
            </p>
          </div>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="bg-[#955E30] hover:bg-[#955E30]/80 text-white px-6 py-3 rounded-lg font-body transition-colors"
          >
            + Add Category
          </button>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative">
            <input
              type="text"
              placeholder="Search categories..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white/5 border border-white/20 rounded-lg px-4 py-3 pl-12 text-white placeholder:text-white/40 focus:outline-none focus:border-[#955E30] transition-colors font-body"
            />
            <svg
              className="w-5 h-5 text-white/40 absolute left-4 top-1/2 -translate-y-1/2"
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

        {/* Categories Grid */}
        {filteredCategories.length === 0 ? (
          <div className="bg-white/5 border border-white/10 rounded-xl p-10 text-center">
            <p className="text-white/60 font-body">No categories found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCategories.map((category) => (
              <div
                key={category.category_id}
                className="bg-white/5 border border-white/10 rounded-xl p-6 hover:border-[#955E30] transition-colors group"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-white font1 mb-2">
                      {category.category_name}
                    </h3>
                    {category.description && (
                      <p className="text-white/60 text-sm font-body line-clamp-2">
                        {category.description}
                      </p>
                    )}
                  </div>
                  <div className="bg-[#955E30]/20 px-3 py-1 rounded-full">
                    <span className="text-[#955E30] font-bold text-sm">
                      {category.product_count || 0}
                    </span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2 mt-4 pt-4 border-t border-white/10">
                  <button
                    onClick={() => handleEdit(category)}
                    className="flex-1 bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg font-body transition-colors text-sm flex items-center justify-center gap-2"
                  >
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
                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                      />
                    </svg>
                    Edit
                  </button>

                  {deleteConfirm === category.category_id ? (
                    <div className="flex-1 flex gap-2">
                      <button
                        onClick={() => handleDelete(category.category_id)}
                        className="flex-1 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-body transition-colors text-sm"
                      >
                        Confirm
                      </button>
                      <button
                        onClick={() => setDeleteConfirm(null)}
                        className="flex-1 bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg font-body transition-colors text-sm"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setDeleteConfirm(category.category_id)}
                      disabled={category.product_count > 0}
                      className={`flex-1 ${
                        category.product_count > 0
                          ? "bg-white/5 text-white/30 cursor-not-allowed"
                          : "bg-red-500/20 hover:bg-red-500/30 text-red-500"
                      } px-4 py-2 rounded-lg font-body transition-colors text-sm flex items-center justify-center gap-2`}
                      title={
                        category.product_count > 0
                          ? "Cannot delete category with products"
                          : "Delete category"
                      }
                    >
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
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                      Delete
                    </button>
                  )}
                </div>

                {/* Warning message */}
                {category.product_count > 0 && (
                  <p className="text-yellow-500 text-xs font-body mt-2 flex items-center gap-1">
                    <svg
                      className="w-3 h-3"
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
                    Remove all products before deleting
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modals */}
      <AddCategoryModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSuccess={handleSuccess}
      />

      <EditCategoryModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSuccess={handleSuccess}
        category={selectedCategory}
      />
    </div>
  );
}
