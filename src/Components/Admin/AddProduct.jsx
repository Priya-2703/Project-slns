import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function AddProduct() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
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

  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [primaryImageIndex, setPrimaryImageIndex] = useState(0);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/categories");
      const data = await response.json();
      if (response.ok) {
        setCategories(data.categories);
      }
    } catch (err) {
      console.error("Failed to fetch categories:", err);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => {
      const updated = { ...prev, [name]: value };

      //newly add by sk
      // Auto-calculate price when actual_price or discount changes
      if (name === "actual_price" || name === "discount") {
        const actualPrice =
          parseFloat(name === "actual_price" ? value : updated.actual_price) ||
          0;
        const discount =
          parseFloat(name === "discount" ? value : updated.discount) || 0;

        // Validate discount percentage (0-100)
        if (discount > 100) {
          alert("Discount cannot exceed 100%");
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

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);

    if (files.length > 4) {
      setError("Maximum 4 images allowed");
      return;
    }

    setImages(files);

    // Create previews
    const previews = files.map((file) => URL.createObjectURL(file));
    setImagePreviews(previews);
    setError("");
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

      // Validate that at least one image is uploaded
      if (images.length === 0) {
        setError("Please upload at least one product image");
        setLoading(false);
        return;
      }

      // Create FormData to send all data including images
      const formDataToSend = new FormData();

      // Append product details
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

      // Append primary image index
      formDataToSend.append("primary_image_index", primaryImageIndex);

      // Append all images
      images.forEach((image) => {
        formDataToSend.append("images", image);
      });

      console.log("Submitting product with images...");

      // Send single request with all data
      const response = await fetch("http://localhost:5000/api/products", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formDataToSend,
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess("Product added successfully! Images stored in database.");
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

  return (
    <div className="min-h-screen bg-black py-20">
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

          {/* items Description */}
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

          {/* Price and actual price Row */}
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

          {/* discount and Special case Row */}
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
                  value='new arrival'
                >
                  New Arrival
                </option>
              </select>
            </div>
          </div>

          {/* Category and gender Row */}
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
                <option value="">Select Category</option>
                {categories.map((cat) => (
                  <option key={cat.category_id} className="bg-transparent font-body text-black" value={cat.category_id}>
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
              <p className="text-[#955E30] text-xs font-body mt-2">
                ✓ Stored securely in database
              </p>
            </div>

            {/* Image Previews */}
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
