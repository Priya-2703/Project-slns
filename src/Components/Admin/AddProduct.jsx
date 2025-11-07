import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { X, Plus, Trash2, Edit2 } from "lucide-react";

export default function AddProduct() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const BACKEND_URL = import.meta.env.VITE_API_URL;


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

  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [primaryImageIndex, setPrimaryImageIndex] = useState(0);
  const [selectedCategoryName, setSelectedCategoryName] = useState("");

  // 🎯 Sub-Category Management State
  const [customSubCategories, setCustomSubCategories] = useState([]);
  const [showSubCategoryModal, setShowSubCategoryModal] = useState(false);
  const [newSubCategory, setNewSubCategory] = useState("");
  const [editingSubCategory, setEditingSubCategory] = useState(null);

  // 🎯 Size options
  const halfSareeSizeOptions = ["Stitched","Semi-stitched", "Unstitched"];
  const normalSizeOptions = ["S", "M", "L", "XL", "XXL", "XXXL"];
  const kidsSizeOptions = ["1-2", "3-4", "5-6", "7-8", "9-10", "11-12","13-14","15-16"];

  useEffect(() => {
    fetchCategories();
    fetchCustomSubCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${BACKEND_URL}/api/categories`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "ngrok-skip-browser-warning": "true",
        },
      });
      const responseText = await response.text();

      try {
        const data = JSON.parse(responseText);
        if (response.ok) {
          setCategories(data.categories);
        }
      } catch (parseError) {
        console.error("❌ JSON Parse Error:", parseError);
      }
    } catch (err) {
      console.error("Failed to fetch categories:", err);
    }
  };

  // 🎯 Fetch Custom Sub-Categories from Backend
  const fetchCustomSubCategories = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${BACKEND_URL}/api/subcategories`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "ngrok-skip-browser-warning": "true",
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

  // 🎯 Add New Sub-Category
  const handleAddSubCategory = async () => {
    if (!newSubCategory.trim()) {
      setError("Please enter a sub-category name");
      return;
    }

    // Check for duplicates
    const allSubCategories = [
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
        const data = await response.json();
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

  // 🎯 Delete Sub-Category
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

        // Reset selected sub-category if it was deleted
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

      if (name === "category_id") {
        const selectedCategory = categories.find(
          (cat) => cat.category_id === parseInt(value)
        );
        setSelectedCategoryName(
          selectedCategory ? selectedCategory.category_name : ""
        );
        updated.sub_category = "";
        updated.sizes = [];
      }

      if (name === "actual_price" || name === "discount") {
        const actualPrice =
          parseFloat(name === "actual_price" ? value : updated.actual_price) ||
          0;
        const discount =
          parseFloat(name === "discount" ? value : updated.discount) || 0;

        if (discount > 100) {
          alert("Discount cannot exceed 100%");
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
    const allSizes = isKidsCategory
    ? kidsSizeOptions
    : isHalfSareeCategory
    ? halfSareeSizeOptions
    : normalSizeOptions;

    if (formData.sizes.length === allSizes.length) {
      setFormData((prev) => ({ ...prev, sizes: [] }));
    } else {
      setFormData((prev) => ({ ...prev, sizes: allSizes }));
    }
  };

  const handleImageChange = (e) => {
    const newFiles = Array.from(e.target.files);
    const totalImages = images.length + newFiles.length;

    if (totalImages > 4) {
      const remaining = 4 - images.length;
      setError(
        remaining > 0
          ? `Maximum 4 images allowed. You can add ${remaining} more image(s).`
          : "Maximum 4 images reached. Please remove some images first."
      );
      return;
    }

    const updatedImages = [...images, ...newFiles];
    setImages(updatedImages);

    const newPreviews = newFiles.map((file) => URL.createObjectURL(file));
    const updatedPreviews = [...imagePreviews, ...newPreviews];
    setImagePreviews(updatedPreviews);

    setError("");
    e.target.value = "";
  };

  const removeImage = (index) => {
    const newImages = images.filter((_, i) => i !== index);
    const newPreviews = imagePreviews.filter((_, i) => i !== index);

    setImages(newImages);
    setImagePreviews(newPreviews);

    if (primaryImageIndex === index) {
      setPrimaryImageIndex(0);
    } else if (primaryImageIndex > index) {
      setPrimaryImageIndex(primaryImageIndex - 1);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        setError("Please login as admin");
        setLoading(false);
        return;
      }

      if (images.length === 0) {
        setError("Please upload at least one product image");
        setLoading(false);
        return;
      }

      if (!isSareeCategory && formData.sizes.length === 0) {
        setError("Please select at least one size");
        setLoading(false);
        return;
      }

      const formDataToSend = new FormData();

      formDataToSend.append("product_name", formData.product_name);
      formDataToSend.append("item_description", formData.item_description);
      formDataToSend.append("actual_price", formData.actual_price);
      formDataToSend.append("discount", formData.discount);
      formDataToSend.append("special_case", formData.special_case);
      formDataToSend.append("gender", formData.gender);
      formDataToSend.append("description", formData.description);
      formDataToSend.append("price", formData.price);
      formDataToSend.append("category_id", formData.category_id);
      formDataToSend.append("stock_quantity", formData.stock_quantity);
      formDataToSend.append("video_url", formData.video_url);
      formDataToSend.append("sub_category", formData.sub_category || "");
      formDataToSend.append("sizes", JSON.stringify(formData.sizes));
      formDataToSend.append("primary_image_index", primaryImageIndex);

      images.forEach((image) => {
        formDataToSend.append("images", image);
      });

      const response = await fetch(`${BACKEND_URL}/api/products`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formDataToSend,
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess("Product added successfully!");
        setTimeout(() => {
          navigate("/admin/products");
        }, 2000);
      } else {
        setError(data.error || "Failed to add product");
      }
    } catch (err) {
      console.error("Submit error:", err);
      setError(err.message || "Failed to add product. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // 🎯 Get all sub-categories (default + custom)
  const getAllSubCategories = () => {
    return [...customSubCategories];
  };

  const isSareeCategory = selectedCategoryName === "Sarees";
  const isHalfSareeCategory = selectedCategoryName === "Half Sarees";
  const isKidsCategory = selectedCategoryName === "Kids Dhosti's";
  const showSubCategory = isSareeCategory;
  const showSizes = !isSareeCategory && selectedCategoryName !== "";

  const getSizeOptions = () => {
    if (isHalfSareeCategory) {
      return halfSareeSizeOptions;
    }else if(isKidsCategory){
      return kidsSizeOptions;
    } else {
      return normalSizeOptions;
    }
  };

  return (
    <div className="min-h-screen bg-black py-20  mt-14">
      <div className="w-[90%] max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-4 px-4">
          <h1 className="text-4xl font-bold text-white font1">
            ADD NEW PRODUCT
          </h1>
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

        {/* 🎯 SUB-CATEGORY MANAGEMENT MODAL */}
        {showSubCategoryModal && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 px-4">
            <div className="bg-gradient-to-br from-black via-gray-900 to-black border border-white/20 rounded-2xl p-6 md:p-8 w-full max-w-2xl max-h-[80vh] overflow-y-auto">
              {/* Modal Header */}
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

              {/* Add New Sub-Category */}
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

              {/* Existing Sub-Categories List */}
              <div>
                <h3 className="text-white font-body mb-3 flex items-center gap-2">
                  <span className="bg-white/10 px-3 py-1 rounded-full text-sm">
                    {getAllSubCategories().length}
                  </span>
                  Sub-Categories
                </h3>

                <div className="space-y-2 max-h-[400px] overflow-y-auto">
                  {/* Default Sub-Categories */}
                  {/* <div className="mb-4">
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
                  </div> */}

                  {/* Custom Sub-Categories */}
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

              {/* Close Button */}
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
          {/* Success Message */}
          {success && (
            <div className="mb-6 p-4 bg-green-500/20 border border-green-500 rounded-lg text-green-400 font-body">
              {success}
            </div>
          )}

          {/* Error Message */}
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
              Item Description *
            </label>
            <textarea
              name="item_description"
              value={formData.item_description}
              onChange={handleChange}
              rows="4"
              required
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
                step="0"
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
                <option className="bg-transparent font-body text-black" value="">Select Category</option>
                {categories.map((cat) => (
                  <option
                    key={cat.category_id}
                    className="bg-transparent font-body text-black"
                    value={cat.category_id}
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

          {/* 🎯 Sub Category (ONLY FOR SAREES) with Management Button */}
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
                {/* <optgroup className="bg-transparent font-body text-black" label="Default Sub-Categories">
                  {defaultSareeSubCategories.map((subCat) => (
                    <option
                      key={subCat}
                      className="bg-transparent font-body text-black capitalize"
                      value={subCat}
                    >
                      {subCat}
                    </option>
                  ))}
                </optgroup> */}
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

          {/* MULTIPLE SIZE SELECTION */}
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
                    ? "Select one or all types (Stitched and/or Semi-stitched and/or Unstitched)"
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

          {/* Product Images */}
          <div className="mb-6">
            <label className="block text-white font-body mb-2">
              Product Images (Max 4 images) *
            </label>
            <p className="text-white/60 text-sm font-body mb-3">
              Click on images to select primary. First image is primary by
              default.
            </p>

            <div
              className="border-2 border-dashed border-white/20 rounded-lg p-6 text-center hover:border-[#955E30] transition-colors cursor-pointer"
              onClick={() => document.getElementById("image-upload").click()}
            >
              <input
                id="image-upload"
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageChange}
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
              <p className="text-white font-body">Click to upload images</p>
              <p className="text-white/40 text-sm font-body mt-1">
                PNG, JPG, WEBP up to 5MB each
              </p>
            </div>

            {imagePreviews.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                {imagePreviews.map((preview, index) => (
                  <div
                    key={index}
                    className={`relative rounded-lg overflow-hidden border-2 ${
                      index === primaryImageIndex
                        ? "border-[#955E30]"
                        : "border-white/20"
                    } cursor-pointer`}
                    onClick={() => setPrimaryImageIndex(index)}
                  >
                    <img
                      src={preview}
                      alt={`Preview ${index + 1}`}
                      className="w-full h-40 object-cover"
                    />
                    {index === primaryImageIndex && (
                      <div className="absolute top-2 left-2 bg-[#955E30] text-white text-xs px-2 py-1 rounded font-body">
                        Primary
                      </div>
                    )}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeImage(index);
                      }}
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
                      Image {index + 1}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Submit Button */}
          <div className="flex gap-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-[#955E30] hover:bg-[#955E30]/80 text-white px-6 py-4 rounded-lg font-body transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Adding Product..." : "Add Product"}
            </button>
            <Link to="/admin/dashboard" className="flex-1">
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
