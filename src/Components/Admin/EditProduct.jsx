import { useState, useEffect, useContext } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { ToastContext } from "../../Context/UseToastContext";
import { X, Plus, Trash2 } from "lucide-react";

export default function EditProduct() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showToast } = useContext(ToastContext);

  const BACKEND_URL = import.meta.env.VITE_API_URL;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [categories, setCategories] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  const [newImages, setNewImages] = useState([]);
  const [newImagePreviews, setNewImagePreviews] = useState([]);
  const [primaryImageId, setPrimaryImageId] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [selectedCategoryName, setSelectedCategoryName] = useState("");
  const [customSubCategories, setCustomSubCategories] = useState([]);
  const [showSubCategoryModal, setShowSubCategoryModal] = useState(false);
  const [newSubCategory, setNewSubCategory] = useState("");

  const [formData, setFormData] = useState({
    product_name: "",
    description: "",
    item_description: "",
    gender: "",
    special_case: "",
    price: "",
    actual_price: "",
    discount: "",
    category_id: "",
    stock_quantity: "",
    video_url: "",
    sub_category: "",
    sizes: [],
  });

  const defaultSareeSubCategories = [
    "Kanchipuram Saree",
    "Mysore Silk Saree",
    "Banarasi Saree",
    "Pochampally Saree",
    "Cotton Saree",
    "Silk Saree",
    "Pattu Saree",
    "Designer Saree",
  ];

  const halfSareeSizeOptions = ["Stitched", "Unstitched"];
  const normalSizeOptions = ["S", "M", "L", "XL", "XXL", "XXXL"];

  useEffect(() => {
    fetchProduct();
    fetchCategories();
    fetchCustomSubCategories();
  }, [id]);

  // 🎯 FIX: Update selectedCategoryName when categories or category_id changes
  useEffect(() => {
    if (formData.category_id && categories.length > 0) {
      const category = categories.find(
        (cat) => cat.category_id === parseInt(formData.category_id)
      );
      if (category) {
        setSelectedCategoryName(category.category_name);
      }
    }
  }, [formData.category_id, categories]);

  const fetchProduct = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${BACKEND_URL}/api/products/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "ngrok-skip-browser-warning": "69420",
        },
      });

      if (!response.ok) throw new Error("Failed to fetch product");

      const data = await response.json();
      const product = data.product || data;

      // 🎯 Parse sizes from JSON if exists
      let parsedSizes = [];
      if (product.sizes) {
        try {
          parsedSizes =
            typeof product.sizes === "string"
              ? JSON.parse(product.sizes)
              : product.sizes;
        } catch (e) {
          console.error("Error parsing sizes:", e);
          parsedSizes = [];
        }
      }

      setFormData({
        product_name: product.product_name || "",
        description: product.description || "",
        item_description: product.item_description || "",
        gender: product.gender || "",
        special_case: product.special_case || "",
        price: product.price || "",
        actual_price: product.actual_price || "",
        discount: product.discount || "",
        category_id: product.category_id || "",
        stock_quantity: product.stock_quantity || "",
        video_url: product.video_url || "",
        sub_category: product.sub_category || "",
        sizes: parsedSizes,
      });

      if (product.product_id) {
        fetchProductImages(product.product_id);
      }

      setPrimaryImageId(product.primary_image_id);
    } catch (err) {
      console.error("Error fetching product:", err);
      setError("Failed to load product");
      setTimeout(() => navigate("/admin/products"), 2000);
    } finally {
      setLoading(false);
    }
  };

  const fetchProductImages = async (productId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${BACKEND_URL}/api/products/${productId}/images`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "ngrok-skip-browser-warning": "69420",
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setExistingImages(data.images || []);
      }
    } catch (err) {
      console.error("Error fetching images:", err);
    }
  };

  const fetchCategories = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${BACKEND_URL}/api/categories`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "ngrok-skip-browser-warning": "69420",
        },
      });

      if (response.ok) {
        const data = await response.json();
        setCategories(data.categories || []);
      }
    } catch (err) {
      console.error("Error fetching categories:", err);
    }
  };

  const fetchCustomSubCategories = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${BACKEND_URL}/api/subcategories`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "ngrok-skip-browser-warning": "69420",
        },
      });

      if (response.ok) {
        const data = await response.json();
        setCustomSubCategories(data.subcategories || []);
      }
    } catch (err) {
      console.error("Failed to fetch sub-categories:", err);
    }
  };

  const handleAddSubCategory = async () => {
    if (!newSubCategory.trim()) {
      setError("Please enter a sub-category name");
      return;
    }

    const allSubCategories = [
      ...defaultSareeSubCategories,
      ...customSubCategories,
    ];
    if (
      allSubCategories.some(
        (sub) => sub.toLowerCase() === newSubCategory.toLowerCase()
      )
    ) {
      setError("This sub-category already exists");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${BACKEND_URL}/api/subcategories`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name: newSubCategory.trim() }),
      });

      if (response.ok) {
        setCustomSubCategories([...customSubCategories, newSubCategory.trim()]);
        setNewSubCategory("");
        setSuccess("Sub-category added successfully!");
        setTimeout(() => setSuccess(""), 3000);
      } else {
        const data = await response.json();
        setError(data.error || "Failed to add sub-category");
      }
    } catch (err) {
      console.error("Error adding sub-category:", err);
      setError("Failed to add sub-category");
    }
  };

  const handleDeleteSubCategory = async (subCategoryName) => {
    if (
      !window.confirm(`Are you sure you want to delete "${subCategoryName}"?`)
    ) {
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${BACKEND_URL}/api/subcategories/${encodeURIComponent(
          subCategoryName
        )}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        setCustomSubCategories(
          customSubCategories.filter((sub) => sub !== subCategoryName)
        );
        setSuccess("Sub-category deleted successfully!");
        setTimeout(() => setSuccess(""), 3000);

        if (formData.sub_category === subCategoryName) {
          setFormData((prev) => ({ ...prev, sub_category: "" }));
        }
      } else {
        const data = await response.json();
        setError(data.error || "Failed to delete sub-category");
      }
    } catch (err) {
      console.error("Error deleting sub-category:", err);
      setError("Failed to delete sub-category");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => {
      const updated = { ...prev, [name]: value };

      // 🎯 If category changes
      if (name === "category_id") {
        const selectedCategory = categories.find(
          (cat) => cat.category_id === parseInt(value)
        );
        const categoryName = selectedCategory
          ? selectedCategory.category_name
          : "";
        setSelectedCategoryName(categoryName);

        // Reset dependent fields only when user changes category (not on initial load)
        if (prev.category_id !== "") {
          updated.sub_category = "";
          updated.sizes = [];
        }
      }

      // Auto-calculate price
      if (name === "actual_price" || name === "discount") {
        const actualPrice =
          parseFloat(name === "actual_price" ? value : updated.actual_price) ||
          0;
        const discount =
          parseFloat(name === "discount" ? value : updated.discount) || 0;

        if (discount > 100) {
          setError("Discount cannot exceed 100%");
          updated.discount = "100";
        }

        if (discount < 0) {
          updated.discount = "0";
        }

        if (actualPrice > 0 && discount >= 0) {
          const discountAmount = actualPrice * (discount / 100);
          const finalPrice = actualPrice - discountAmount;
          updated.price = finalPrice.toFixed(2);
        } else {
          updated.price = "";
        }
      }

      return updated;
    });
  };

  const handleSizeChange = (size) => {
    setFormData((prev) => {
      const currentSizes = [...prev.sizes];

      if (currentSizes.includes(size)) {
        return {
          ...prev,
          sizes: currentSizes.filter((s) => s !== size),
        };
      } else {
        return {
          ...prev,
          sizes: [...currentSizes, size],
        };
      }
    });
  };

  const handleSelectAllSizes = () => {
    const allSizes = isHalfSareeCategory
      ? halfSareeSizeOptions
      : normalSizeOptions;

    if (formData.sizes.length === allSizes.length) {
      setFormData((prev) => ({ ...prev, sizes: [] }));
    } else {
      setFormData((prev) => ({ ...prev, sizes: allSizes }));
    }
  };

  const handleNewImageSelect = (e) => {
    const files = Array.from(e.target.files);
    const totalImages = existingImages.length + newImages.length + files.length;

    if (totalImages > 4) {
      setError("Maximum 4 images allowed");
      return;
    }

    setNewImages((prev) => [...prev, ...files]);

    const previews = files.map((file) => URL.createObjectURL(file));
    setNewImagePreviews((prev) => [...prev, ...previews]);
    setError("");
  };

  const removeNewImage = (index) => {
    setNewImages((prev) => prev.filter((_, i) => i !== index));
    setNewImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const deleteExistingImage = async (imageId) => {
    if (!confirm("Delete this image?")) return;

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${BACKEND_URL}/api/images/${imageId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "ngrok-skip-browser-warning": "69420",
        },
      });

      if (response.ok) {
        setExistingImages((prev) =>
          prev.filter((img) => img.image_id !== imageId)
        );
        if (primaryImageId === imageId) {
          setPrimaryImageId(null);
        }
        setSuccess("Image deleted successfully");
        setTimeout(() => setSuccess(""), 3000);
      }
    } catch (err) {
      console.error("Error deleting image:", err);
      setError("Failed to delete image");
    }
  };

  const setPrimaryImage = async (imageId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${BACKEND_URL}/api/products/${id}/primary-image`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "ngrok-skip-browser-warning": "69420",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ primary_image_id: imageId }),
        }
      );

      if (response.ok) {
        setPrimaryImageId(imageId);
        setSuccess("Primary image updated");
        setTimeout(() => setSuccess(""), 3000);
      }
    } catch (err) {
      console.error("Error setting primary image:", err);
      setError("Failed to set primary image");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        throw new Error("Authentication required. Please login again.");
      }

      const formDataToSend = {
        product_name: formData.product_name.trim(),
        description: formData.description?.trim() || null,
        item_description: formData.item_description?.trim() || null,
        gender: formData.gender,
        special_case: formData.special_case || null,
        price: parseFloat(formData.price),
        actual_price: parseFloat(formData.actual_price),
        discount: parseFloat(formData.discount),
        category_id: parseInt(formData.category_id),
        stock_quantity: parseInt(formData.stock_quantity),
        video_url: formData.video_url?.trim() || null,
        sub_category: formData.sub_category || null,
        sizes: JSON.stringify(formData.sizes),
      };

      if (isNaN(formDataToSend.price) || formDataToSend.price < 0) {
        throw new Error("Invalid price value");
      }
      if (
        isNaN(formDataToSend.actual_price) ||
        formDataToSend.actual_price < 0
      ) {
        throw new Error("Invalid actual price value");
      }
      if (
        isNaN(formDataToSend.discount) ||
        formDataToSend.discount < 0 ||
        formDataToSend.discount > 100
      ) {
        throw new Error("Discount must be between 0 and 100");
      }
      if (isNaN(formDataToSend.category_id)) {
        throw new Error("Please select a category");
      }
      if (
        isNaN(formDataToSend.stock_quantity) ||
        formDataToSend.stock_quantity < 0
      ) {
        throw new Error("Invalid stock quantity");
      }

      const response = await fetch(`${BACKEND_URL}/api/products/${id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "ngrok-skip-browser-warning": "69420",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formDataToSend),
      });

      if (!response.ok) {
        const responseData = await response.json().catch(() => ({}));
        let errorMessage =
          responseData.error ||
          responseData.message ||
          "Failed to update product";

        if (response.status === 401) {
          errorMessage = "Session expired. Please login again.";
          setTimeout(() => navigate("/admin/login"), 2000);
        } else if (response.status === 403) {
          errorMessage = "You don't have permission to edit products.";
        } else if (response.status === 404) {
          errorMessage = "Product not found.";
        } else if (response.status === 500) {
          errorMessage = `Server error: ${errorMessage}`;
        }

        throw new Error(errorMessage);
      }

      const result = await response.json();
      if (newImages.length > 0) {
        const imageFormData = new FormData();
        newImages.forEach((file) => {
          imageFormData.append("images", file);
        });

        const imageResponse = await fetch(
          `${BACKEND_URL}/api/products/${id}/images`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
              "ngrok-skip-browser-warning": "69420",
            },
            body: imageFormData,
          }
        );

        if (imageResponse.ok) {
          console.log("✅ Images uploaded successfully");
        } else {
          console.warn("⚠️ Image upload failed");
        }
      }

      showToast("Product updated successfully!", "success");
      setTimeout(() => navigate("/admin/products"), 1500);
    } catch (err) {
      console.error("❌ Error:", err);
      setError(err.message || "Failed to update product");
      showToast(err.message || "Failed to update product", "error");
    } finally {
      setSaving(false);
    }
  };

  const getAllSubCategories = () => {
    return [...defaultSareeSubCategories, ...customSubCategories];
  };

  const isSareeCategory = selectedCategoryName === "Sarees";
  const isHalfSareeCategory = selectedCategoryName === "Half Sarees";
  const showSubCategory = isSareeCategory;
  const showSizes = !isSareeCategory && selectedCategoryName !== "";

  const getSizeOptions = () => {
    if (isHalfSareeCategory) {
      return halfSareeSizeOptions;
    } else {
      return normalSizeOptions;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-xl font-body">Loading product...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black py-20 mt-14">
      <div className="w-[90%] max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-4 px-4">
          <h1 className="text-4xl font-bold text-white font1">EDIT PRODUCT</h1>
          <Link
            to="/admin/products"
            className="text-white hover:text-white/60 font-body inline-block bg-white/10 hover:bg-black cursor-pointer border border-white/30 rounded-4xl py-2 px-4 duration-300 transition-all"
          >
            <button className="flex gap-1 justify-center text-[14px] items-center">
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
              Back to Products
            </button>
          </Link>
        </div>

        {/* 🎯 SUB-CATEGORY MANAGEMENT MODAL */}
        {showSubCategoryModal && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 px-4">
            <div className="bg-gradient-to-br from-black via-gray-900 to-black border border-white/20 rounded-2xl p-6 md:p-8 w-full max-w-2xl max-h-[80vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-white font1">
                  Manage Sub-Categories
                </h2>
                <button
                  onClick={() => setShowSubCategoryModal(false)}
                  className="text-white/60 hover:text-white transition-colors"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="mb-6">
                <label className="block text-white font-body mb-2">
                  Add New Sub-Category
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newSubCategory}
                    onChange={(e) => setNewSubCategory(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleAddSubCategory();
                      }
                    }}
                    className="flex-1 px-4 py-3 bg-black/30 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-[#955E30] font-body"
                    placeholder="e.g., Kanjeevaram Saree"
                  />
                  <button
                    onClick={handleAddSubCategory}
                    className="bg-[#955E30] hover:bg-[#955E30]/80 text-white px-6 py-3 rounded-lg font-body transition-colors flex items-center gap-2"
                  >
                    <Plus size={20} />
                    Add
                  </button>
                </div>
              </div>

              <div>
                <h3 className="text-white font-body mb-3 flex items-center gap-2">
                  <span className="bg-white/10 px-3 py-1 rounded-full text-sm">
                    {getAllSubCategories().length}
                  </span>
                  Sub-Categories
                </h3>

                <div className="space-y-2 max-h-[400px] overflow-y-auto">
                  <div className="mb-4">
                    <p className="text-white/50 text-xs font-body mb-2 uppercase tracking-wide">
                      Default (Cannot Delete)
                    </p>
                    {defaultSareeSubCategories.map((subCat) => (
                      <div
                        key={subCat}
                        className="flex items-center justify-between bg-black/30 border border-white/10 rounded-lg p-3 mb-2"
                      >
                        <span className="text-white font-body capitalize">
                          {subCat}
                        </span>
                        <span className="bg-blue-500/20 text-blue-400 text-xs px-2 py-1 rounded font-body">
                          Default
                        </span>
                      </div>
                    ))}
                  </div>

                  {customSubCategories.length > 0 && (
                    <div>
                      <p className="text-white/50 text-xs font-body mb-2 uppercase tracking-wide">
                        Custom (Can Delete)
                      </p>
                      {customSubCategories.map((subCat) => (
                        <div
                          key={subCat}
                          className="flex items-center justify-between bg-black/30 border border-white/10 rounded-lg p-3 mb-2 group hover:border-white/30 transition-all"
                        >
                          <span className="text-white font-body capitalize">
                            {subCat}
                          </span>
                          <button
                            onClick={() => handleDeleteSubCategory(subCat)}
                            className="text-red-400 hover:text-red-300 transition-colors opacity-0 group-hover:opacity-100 flex items-center gap-1"
                          >
                            <Trash2 size={16} />
                            Delete
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  {customSubCategories.length === 0 && (
                    <div className="text-center py-8 text-white/40 font-body">
                      No custom sub-categories yet. Add one above!
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-6">
                <button
                  onClick={() => setShowSubCategoryModal(false)}
                  className="w-full bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-lg font-body transition-colors border border-white/20"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="bg-white/5 border border-white/10 rounded-xl p-8 backdrop-blur-sm"
        >
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

          {/* Product Name */}
          <div className="mb-6">
            <label className="block text-white font-body mb-2">
              Product Name *
            </label>
            <input
              type="text"
              name="product_name"
              value={formData.product_name}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 capitalize bg-black/10 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-[#955E30] font-body"
              placeholder="Enter product name"
            />
          </div>

          {/* Description */}
          <div className="mb-6">
            <label className="block text-white font-body mb-2">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="4"
              className="w-full px-4 py-3 bg-black/10 border capitalize border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-[#955E30] font-body"
              placeholder="Enter product description"
            />
          </div>

          {/* Item Description */}
          <div className="mb-6">
            <label className="block text-white font-body mb-2">
              Item Description
            </label>
            <textarea
              name="item_description"
              value={formData.item_description}
              onChange={handleChange}
              rows="4"
              className="w-full px-4 capitalize py-3 bg-black/10 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-[#955E30] font-body"
              placeholder="Enter Items description"
            />
          </div>

          {/* Price and Actual Price Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
            <div>
              <label className="block text-white font-body mb-2">
                Price (₹) *
              </label>
              <div className="relative">
                <input
                  name="price"
                  value={formData.price}
                  readOnly
                  required
                  className="w-full px-4 py-3 bg-black/5 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none cursor-not-allowed font-body"
                  placeholder="Price will be calculated automatically"
                />
                {formData.actual_price &&
                  formData.discount &&
                  formData.price && (
                    <div className="absolute right-4 top-1/2 -translate-y-1/2">
                      <span className="bg-green-500/20 text-green-500 text-sm px-3 py-1 rounded-full font-body font-semibold">
                        {formData.discount}% OFF
                      </span>
                    </div>
                  )}
              </div>
            </div>

            <div>
              <label className="block text-white font-body mb-2">
                Actual Price (₹) *
              </label>
              <input
                type="number"
                name="actual_price"
                value={formData.actual_price}
                onChange={handleChange}
                required
                step="0.01"
                className="w-full px-4 py-3 bg-black/10 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-[#955E30] font-body"
                placeholder="0.00"
              />
            </div>
          </div>

          {/* Discount and Special Case Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-white font-body mb-2">
                Discount *
              </label>
              <input
                type="number"
                name="discount"
                value={formData.discount}
                onChange={handleChange}
                required
                step="0.01"
                min="0"
                max="100"
                className="w-full px-4 py-3 bg-black/10 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-[#955E30] font-body"
                placeholder="Enter discount percentage"
              />
            </div>

            <div>
              <label className="block text-white font-body mb-2">
                Special Case (Optional)
              </label>
              <select
                name="special_case"
                value={formData.special_case}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-black/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-[#955E30] font-body"
              >
                <option
                  className="bg-transparent font-body text-black"
                  value=""
                >
                  Select Special Case
                </option>
                <option
                  className="bg-transparent font-body text-black"
                  value="trending"
                >
                  Trending
                </option>
                <option
                  className="bg-transparent font-body text-black"
                  value="new arrival"
                >
                  New Arrival
                </option>
              </select>
            </div>
          </div>

          {/* Category and Gender Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-white font-body mb-2">
                Category *
              </label>
              <select
                name="category_id"
                value={formData.category_id}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-black/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-[#955E30] font-body"
              >
                <option value="" className="bg-black text-white">
                  Select Category
                </option>
                {categories.map((cat) => (
                  <option
                    key={cat.category_id}
                    value={cat.category_id}
                    className="bg-transparent font-body text-black"
                  >
                    {cat.category_name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-white font-body mb-2">
                Gender *
              </label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-black/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-[#955E30] font-body"
              >
                <option
                  className="bg-transparent font-body text-black"
                  value=""
                >
                  Select Gender
                </option>
                <option
                  className="bg-transparent font-body text-black"
                  value="women"
                >
                  Women
                </option>
                <option
                  className="bg-transparent font-body text-black"
                  value="men"
                >
                  Men
                </option>
                <option
                  className="bg-transparent font-body text-black"
                  value="kids"
                >
                  Kids
                </option>
              </select>
            </div>
          </div>

          {/* 🎯 Sub Category (ONLY FOR SAREES) */}
          {showSubCategory && (
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <label className="block text-white font-body">
                  Sub Category *
                  <span className="text-xs bg-purple-500/20 text-purple-400 px-2 py-0.5 rounded ml-2">
                    Sarees Only
                  </span>
                </label>
                <button
                  type="button"
                  onClick={() => setShowSubCategoryModal(true)}
                  className="text-[#955E30] hover:text-[#955E30]/80 text-sm font-body flex items-center gap-1"
                >
                  <Plus size={16} />
                  Manage Sub-Categories
                </button>
              </div>
              <select
                name="sub_category"
                value={formData.sub_category}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-black/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-[#955E30] font-body"
              >
                <option
                  className="bg-transparent font-body text-black"
                  value=""
                >
                  Select Saree Type
                </option>
                <optgroup label="Default Sub-Categories">
                  {defaultSareeSubCategories.map((subCat) => (
                    <option
                      key={subCat}
                      className="bg-transparent font-body text-black capitalize"
                      value={subCat}
                    >
                      {subCat}
                    </option>
                  ))}
                </optgroup>
                {customSubCategories.length > 0 && (
                  <optgroup label="Custom Sub-Categories">
                    {customSubCategories.map((subCat) => (
                      <option
                        key={subCat}
                        className="bg-transparent font-body text-black capitalize"
                        value={subCat}
                      >
                        {subCat} ⭐
                      </option>
                    ))}
                  </optgroup>
                )}
              </select>
              <p className="text-white/50 text-xs font-body mt-1">
                Select type of Saree or add custom sub-category
              </p>
            </div>
          )}

          {/* 🎯 MULTIPLE SIZE SELECTION */}
          {showSizes && (
            <div className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <label className="block text-white font-body">
                  {isHalfSareeCategory
                    ? "Available Types *"
                    : "Available Sizes *"}
                  <span className="text-xs bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded ml-2">
                    Multiple Selection
                  </span>
                </label>
                <button
                  type="button"
                  onClick={handleSelectAllSizes}
                  className="text-[#955E30] hover:text-[#955E30]/80 text-sm font-body underline"
                >
                  {formData.sizes.length === getSizeOptions().length
                    ? "Deselect All"
                    : "Select All"}
                </button>
              </div>

              <div className="bg-black/10 border border-white/20 rounded-lg p-4">
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                  {getSizeOptions().map((size) => (
                    <label
                      key={size}
                      className={`relative flex items-center justify-center p-3 rounded-lg border-2 cursor-pointer transition-all duration-300 ${
                        formData.sizes.includes(size)
                          ? "border-[#955E30] bg-[#955E30]/20"
                          : "border-white/20 bg-black/20 hover:border-white/40"
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={formData.sizes.includes(size)}
                        onChange={() => handleSizeChange(size)}
                        className="sr-only"
                      />
                      <span className="text-white font-body text-sm font-semibold">
                        {size}
                      </span>
                      {formData.sizes.includes(size) && (
                        <svg
                          className="absolute top-1 right-1 w-4 h-4 text-[#955E30]"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                            clipRule="evenodd"
                          />
                        </svg>
                      )}
                    </label>
                  ))}
                </div>

                {formData.sizes.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-white/10">
                    <p className="text-white/60 text-xs font-body mb-2">
                      Selected ({formData.sizes.length}):
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {formData.sizes.map((size) => (
                        <span
                          key={size}
                          className="bg-[#955E30]/30 text-white px-3 py-1 rounded-full text-xs font-body flex items-center gap-2"
                        >
                          {size}
                          <button
                            type="button"
                            onClick={() => handleSizeChange(size)}
                            className="hover:text-red-400 transition-colors"
                          >
                            ✕
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <p className="text-white/50 text-xs font-body mt-3">
                  {isHalfSareeCategory
                    ? "Select one or both types (Stitched and/or Unstitched)"
                    : "Select all available sizes for this product"}
                </p>
              </div>
            </div>
          )}

          {/* Stock and Video Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-white font-body mb-2">
                Stock Quantity *
              </label>
              <input
                type="number"
                name="stock_quantity"
                value={formData.stock_quantity}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-black/10 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-[#955E30] font-body"
                placeholder="0"
              />
            </div>

            <div>
              <label className="block text-white font-body mb-2">
                Video URL (Optional)
              </label>
              <input
                type="url"
                name="video_url"
                value={formData.video_url}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-black/10 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-[#955E30] font-body"
                placeholder="https://youtube.com/..."
              />
            </div>
          </div>

          {/* Images Section */}
          <div className="mb-6">
            <label className="block text-white font-body mb-2">
              Product Images (Max 4 images) *
            </label>
            <p className="text-white/60 text-sm font-body mb-3">
              Click on images to select primary. Click "Set Primary" button.
            </p>

            {/* Existing Images */}
            {existingImages.length > 0 && (
              <div className="mb-6">
                <h3 className="text-white font-body mb-4">Current Images</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {existingImages.map((image) => (
                    <div
                      key={image.image_id}
                      className={`relative group bg-white/5 rounded-lg overflow-hidden aspect-square border-2 ${
                        primaryImageId === image.image_id
                          ? "border-[#955E30]"
                          : "border-white/20"
                      }`}
                    >
                      <img
                        src={`${BACKEND_URL}/api/images/${image.image_id}`}
                        alt="Product"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.src =
                            'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="200" height="200"%3E%3Crect fill="%23333" width="200" height="200"/%3E%3Ctext fill="%23666" font-family="sans-serif" font-size="14" x="50%25" y="50%25" text-anchor="middle" dominant-baseline="middle"%3ENo Image%3C/text%3E%3C/svg%3E';
                        }}
                      />

                      {primaryImageId === image.image_id && (
                        <div className="absolute top-2 left-2 bg-[#955E30] text-white text-xs px-2 py-1 rounded font-body">
                          Primary
                        </div>
                      )}

                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2">
                        {primaryImageId !== image.image_id && (
                          <button
                            type="button"
                            onClick={() => setPrimaryImage(image.image_id)}
                            className="bg-[#955E30] hover:bg-[#955E30]/80 text-white px-3 py-1 rounded-lg text-xs font-body"
                          >
                            Set Primary
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => deleteExistingImage(image.image_id)}
                          className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-lg"
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
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* New Images Preview */}
            {newImagePreviews.length > 0 && (
              <div className="mb-6">
                <h3 className="text-white font-body mb-4">
                  New Images (will be uploaded on save)
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {newImagePreviews.map((preview, index) => (
                    <div
                      key={index}
                      className="relative group bg-white/5 rounded-lg overflow-hidden aspect-square border-2 border-white/20"
                    >
                      <img
                        src={preview}
                        alt={`Preview ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => removeNewImage(index)}
                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
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
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      </button>
                      <div className="absolute bottom-2 left-2 bg-black/60 text-white text-xs px-2 py-1 rounded font-body">
                        New {index + 1}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Upload New Images */}
            {existingImages.length + newImages.length < 4 && (
              <div
                className="border-2 border-dashed border-white/20 rounded-lg p-6 text-center hover:border-[#955E30] transition-colors cursor-pointer"
                onClick={() => document.getElementById("image-upload").click()}
              >
                <input
                  id="image-upload"
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleNewImageSelect}
                  className="hidden"
                />
                <svg
                  className="mx-auto h-12 w-12 text-white/40 mb-3"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                <p className="text-white font-body">
                  Click to upload more images
                </p>
                <p className="text-white/40 text-sm font-body mt-1">
                  PNG, JPG, WEBP up to 5MB each
                </p>
                <p className="text-white/40 text-xs font-body mt-2">
                  {existingImages.length + newImages.length} / 4 images
                </p>
              </div>
            )}
          </div>

          {/* Submit Buttons */}
          <div className="flex gap-4">
            <button
              type="submit"
              disabled={saving}
              className="flex-1 bg-[#955E30] hover:bg-[#955E30]/80 text-white px-6 py-4 rounded-lg font-body font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? "Updating Product..." : "Update Product"}
            </button>
            <Link to="/admin/products" className="flex-1">
              <button
                type="button"
                className="w-full bg-white/10 hover:bg-white/20 text-white px-6 py-4 rounded-lg font-body transition-colors border border-white/20"
              >
                Cancel
              </button>
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
