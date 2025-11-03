import { useState, useEffect, useContext } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { ToastContext } from "../../Context/UseToastContext";

export default function EditProduct() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showToast } = useContext(ToastContext);

  const API_BASE_URL = "http://localhost:5000";

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [categories, setCategories] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  const [newImages, setNewImages] = useState([]);
  const [newImagePreviews, setNewImagePreviews] = useState([]);
  const [primaryImageId, setPrimaryImageId] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

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
  });

  useEffect(() => {
    fetchProduct();
    fetchCategories();
  }, [id]);

  const fetchProduct = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_BASE_URL}/api/products/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "ngrok-skip-browser-warning": "69420",
        },
      });

      if (!response.ok) throw new Error("Failed to fetch product");

      const data = await response.json();
      const product = data.product || data;

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
      });

      // Fetch product images
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
        `${API_BASE_URL}/api/products/${productId}/images`,
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
      const response = await fetch(`${API_BASE_URL}/api/categories`, {
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

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => {
      const updated = { ...prev, [name]: value };

      // Auto-calculate price when actual_price or discount changes
      if (name === "actual_price" || name === "discount") {
        const actualPrice =
          parseFloat(name === "actual_price" ? value : updated.actual_price) ||
          0;
        const discount =
          parseFloat(name === "discount" ? value : updated.discount) || 0;

        // Validate discount percentage (0-100)
        if (discount > 100) {
          setError("Discount cannot exceed 100%");
          updated.discount = "100";
        }

        if (discount < 0) {
          updated.discount = "0";
        }

        // Calculate price = actual_price - (actual_price * discount / 100)
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

  const handleNewImageSelect = (e) => {
    const files = Array.from(e.target.files);
    const totalImages = existingImages.length + newImages.length + files.length;

    if (totalImages > 4) {
      setError("Maximum 4 images allowed");
      return;
    }

    setNewImages((prev) => [...prev, ...files]);

    // Create previews
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
      const response = await fetch(`${API_BASE_URL}/api/images/${imageId}`, {
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
        `${API_BASE_URL}/api/products/${id}/primary-image`,
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

      // ✅ Convert empty strings to null for optional fields
      const formDataToSend = {
        product_name: formData.product_name.trim(),
        description: formData.description?.trim() || null, // ← Changed to null
        item_description: formData.item_description?.trim() || null, // ← Changed to null
        gender: formData.gender,
        special_case: formData.special_case || null, // ← Changed to null
        price: parseFloat(formData.price),
        actual_price: parseFloat(formData.actual_price),
        discount: parseFloat(formData.discount),
        category_id: parseInt(formData.category_id),
        stock_quantity: parseInt(formData.stock_quantity),
        video_url: formData.video_url?.trim() || null, // ← Changed to null
      };

      // ✅ Validate numbers
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

      console.log("📤 Sending data:", formDataToSend);

      const response = await fetch(`${API_BASE_URL}/api/products/${id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "ngrok-skip-browser-warning": "69420",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formDataToSend),
      });

      console.log("📥 Response status:", response.status);

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
      console.log("✅ Product updated successfully:", result);

      // Upload new images if any
      if (newImages.length > 0) {
        console.log("📤 Uploading", newImages.length, "new images...");

        const imageFormData = new FormData();
        newImages.forEach((file) => {
          imageFormData.append("images", file);
        });

        const imageResponse = await fetch(
          `${API_BASE_URL}/api/products/${id}/images`,
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

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-xl font-body">Loading product...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black py-20">
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
                        src={`${API_BASE_URL}/api/images/${image.image_id}`}
                        alt="Product"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.src =
                            'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="200" height="200"%3E%3Crect fill="%23333" width="200" height="200"/%3E%3Ctext fill="%23666" font-family="sans-serif" font-size="14" x="50%25" y="50%25" text-anchor="middle" dominant-baseline="middle"%3ENo Image%3C/text%3E%3C/svg%3E';
                        }}
                      />

                      {/* Primary Badge */}
                      {primaryImageId === image.image_id && (
                        <div className="absolute top-2 left-2 bg-[#955E30] text-white text-xs px-2 py-1 rounded font-body">
                          Primary
                        </div>
                      )}

                      {/* Actions */}
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
