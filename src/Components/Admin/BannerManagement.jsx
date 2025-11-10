import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { X, Plus, Trash2, Edit2, Image as ImageIcon } from "lucide-react";

export default function BannerManagement() {
  const BACKEND_URL = import.meta.env.VITE_API_URL;
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedBanner, setSelectedBanner] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Form state
  const [formData, setFormData] = useState({
    page_type: "home_carousel",
    title: "",
    subtitle: "",
    description: "",
    gradient: "from-purple-600/30 via-pink-600/30 to-red-600/30",
    is_active: true,
  });

  // Image handling
  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [primaryImageIndex, setPrimaryImageIndex] = useState(0);

  const pageTypes = [
    { value: "home_carousel", label: "Home Page - Main Carousel" },
    { value: "home_3d_carousel", label: "Home Page - 3D Carousel" },
    { value: "product_page", label: "Product Page - Top Banner" },
  ];

  const gradientOptions = [
    {
      value: "from-purple-600/30 via-pink-600/30 to-red-600/30",
      label: "Purple to Red",
    },
    {
      value: "from-blue-600/30 via-cyan-600/30 to-teal-600/30",
      label: "Blue to Teal",
    },
    {
      value: "from-orange-600/30 via-amber-600/30 to-yellow-600/30",
      label: "Orange to Yellow",
    },
    {
      value: "from-green-600/30 via-emerald-600/30 to-lime-600/30",
      label: "Green to Lime",
    },
    { value: "from-purple-600/40 to-pink-600/40", label: "Purple to Pink" },
    { value: "from-blue-600/40 to-cyan-600/40", label: "Blue to Cyan" },
    { value: "from-orange-600/40 to-amber-600/40", label: "Orange to Amber" },
  ];

  // Fetch all banners
  const fetchBanners = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${BACKEND_URL}/api/admin/banners`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "ngrok-skip-browser-warning": "true",
        },
      });

      if (response.ok) {
        const data = await response.json();
        setBanners(data.banners || []);
      }
      setLoading(false);
    } catch (err) {
      console.error("Error fetching banners:", err);
      setError("Failed to fetch banners");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBanners();
  }, []);

  // Handle form input change
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Handle multiple image selection
  const handleImageChange = (e) => {
    const newFiles = Array.from(e.target.files);
    const totalImages = images.length + newFiles.length;

    if (totalImages > 3) {
      const remaining = 5 - images.length;
      setError(
        remaining > 0
          ? `Maximum 3 images allowed. You can add ${remaining} more image(s).`
          : "Maximum 3 images reached. Please remove some images first."
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

  // Remove image
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

  // Open modal for adding new banner
  const handleAddNew = () => {
    setEditMode(false);
    setSelectedBanner(null);
    setFormData({
      page_type: "home_carousel",
      title: "",
      subtitle: "",
      description: "",
      gradient: "from-purple-600/30 via-pink-600/30 to-red-600/30",
      is_active: true,
    });
    setImages([]);
    setImagePreviews([]);
    setPrimaryImageIndex(0);
    setError("");
    setSuccess("");
    setShowModal(true);
  };

  // Open modal for editing
  const handleEdit = (banner) => {
    setEditMode(true);
    setSelectedBanner(banner);
    setFormData({
      page_type: banner.page_type,
      title: banner.title,
      subtitle: banner.subtitle,
      description: banner.description,
      gradient: banner.gradient,
      is_active: banner.is_active,
    });
    setImages([]);
    setImagePreviews([`${BACKEND_URL}${banner.image_url}`]);
    setPrimaryImageIndex(0);
    setError("");
    setSuccess("");
    setShowModal(true);
  };

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    // Validation
    if (!editMode && images.length === 0) {
      setError("Please upload at least one banner image");
      setLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const data = new FormData();

      data.append("page_type", formData.page_type);
      data.append("title", formData.title);
      data.append("subtitle", formData.subtitle);
      data.append("description", formData.description);
      data.append("gradient", formData.gradient);
      data.append("is_active", formData.is_active);
      data.append("primary_image_index", primaryImageIndex);

      // Append all images
      images.forEach((image) => {
        data.append("images", image);
      });

      const url = editMode
        ? `${BACKEND_URL}/api/admin/banners/${selectedBanner.id}`
        : `${BACKEND_URL}/api/admin/banners`;

      const response = await fetch(url, {
        method: editMode ? "PUT" : "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: data,
      });

      const result = await response.json();

      if (response.ok) {
        setSuccess(
          editMode
            ? "Banner updated successfully!"
            : "Banner added successfully!"
        );
        fetchBanners();
        setTimeout(() => {
          setShowModal(false);
          setSuccess("");
        }, 2000);
      } else {
        setError(result.error || "Failed to save banner");
      }
    } catch (err) {
      console.error("Error saving banner:", err);
      setError("Failed to save banner");
    } finally {
      setLoading(false);
    }
  };

  // Delete banner
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this banner?")) {
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${BACKEND_URL}/api/admin/banners/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        setSuccess("Banner deleted successfully!");
        fetchBanners();
        setTimeout(() => setSuccess(""), 3000);
      } else {
        const data = await response.json();
        setError(data.error || "Failed to delete banner");
      }
    } catch (err) {
      console.error("Error deleting banner:", err);
      setError("Failed to delete banner");
    }
  };

  // Group banners by page type
  const groupedBanners = banners.reduce((acc, banner) => {
    if (!acc[banner.page_type]) {
      acc[banner.page_type] = [];
    }
    acc[banner.page_type].push(banner);
    return acc;
  }, {});

  if (loading && banners.length === 0) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#955E30]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black py-20 mt-14">
      <div className="w-[90%] max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-4 px-4">
          <h1 className="text-4xl font-bold text-white font1">
            BANNER MANAGEMENT
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

        {/* Add New Banner Button */}
        <div className="mb-6 px-4">
          <button
            onClick={handleAddNew}
            className="bg-[#955E30] hover:bg-[#955E30]/80 text-white px-6 py-3 rounded-lg flex items-center gap-2 font-body transition-colors"
          >
            <Plus size={20} />
            Add New Banner
          </button>
        </div>

        {/* Success/Error Messages */}
        {success && (
          <div className="mb-6 mx-4 p-4 bg-green-500/20 border border-green-500 rounded-lg text-green-400 font-body">
            {success}
          </div>
        )}

        {error && !showModal && (
          <div className="mb-6 mx-4 p-4 bg-red-500/20 border border-red-500 rounded-lg text-red-400 font-body">
            {error}
          </div>
        )}

        {/* Banners grouped by page type */}
        {pageTypes.map(({ value, label }) => (
          <div key={value} className="mb-8 px-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-white font-body">
                {label}
              </h2>
              <span className="bg-white/10 text-white text-sm px-3 py-1 rounded-full font-body">
                {groupedBanners[value]?.length || 0} Banners
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {groupedBanners[value]?.map((banner) => (
                <div
                  key={banner.id}
                  className="bg-white/5 border border-white/10 rounded-xl overflow-hidden backdrop-blur-sm hover:border-[#955E30] transition-all"
                >
                  {/* Banner Image */}
                  <div className="relative h-48">
                    <img
                      src={`${BACKEND_URL}${banner.image_url}`}
                      alt={banner.title}
                      className="w-full h-full object-cover"
                    />
                    <div
                      className={`absolute inset-0 bg-gradient-to-r ${banner.gradient}`}
                    ></div>
                    {!banner.is_active && (
                      <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                        <span className="bg-red-500 text-white px-4 py-2 rounded-lg font-body text-sm">
                          Inactive
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Banner Info */}
                  <div className="p-4">
                    <h3 className="text-lg font-semibold text-white mb-1 font-body capitalize">
                      {banner.title}
                    </h3>
                    <p className="text-sm text-white/60 mb-2 font-body capitalize">
                      {banner.subtitle}
                    </p>
                    <p className="text-xs text-white/40 line-clamp-2 font-body capitalize">
                      {banner.description}
                    </p>

                    {/* Actions */}
                    <div className="flex items-center gap-2 mt-4">
                      <button
                        onClick={() => handleEdit(banner)}
                        className="flex-1 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 px-4 py-2 rounded-lg font-body transition-colors flex items-center justify-center gap-2"
                      >
                        <Edit2 size={16} />
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(banner.id)}
                        className="flex-1 bg-red-500/20 hover:bg-red-500/30 text-red-400 px-4 py-2 rounded-lg font-body transition-colors flex items-center justify-center gap-2"
                      >
                        <Trash2 size={16} />
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {(!groupedBanners[value] || groupedBanners[value].length === 0) && (
              <div className="bg-white/5 border border-white/10 rounded-xl p-8 text-center backdrop-blur-sm">
                <ImageIcon size={48} className="mx-auto text-white/20 mb-3" />
                <p className="text-white/40 font-body">
                  No banners found for this page
                </p>
              </div>
            )}
          </div>
        ))}

        {/* Add/Edit Modal */}
        {showModal && (
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setShowModal(false)}
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="bg-gradient-to-br from-black via-gray-900 to-black border border-white/20 rounded-2xl p-6 md:p-8 w-full max-w-3xl max-h-[90vh] overflow-y-auto"
            >
              {/* Modal Header */}
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-white font1">
                  {editMode ? "EDIT BANNER" : "ADD NEW BANNER"}
                </h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-white/60 hover:text-white transition-colors"
                >
                  <X size={24} />
                </button>
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

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Page Type */}
                <div>
                  <label className="block text-white font-body mb-2">
                    Page Type *
                  </label>
                  <select
                    name="page_type"
                    value={formData.page_type}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 bg-black/30 border border-white/20 rounded-lg text-white focus:outline-none focus:border-[#955E30] font-body"
                  >
                    {pageTypes.map(({ value, label }) => (
                      <option
                        key={value}
                        value={value}
                        className="bg-black text-white"
                      >
                        {label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Banner Images */}
                <div>
                  <label className="block text-white font-body mb-2">
                    Banner Images (Max 3 images) *
                    {editMode && (
                      <span className="text-xs text-white/60 ml-2">
                        (Upload new images to replace current)
                      </span>
                    )}
                  </label>
                  <p className="text-white/60 text-sm font-body mb-3">
                    Click on images to select primary. First image is primary by
                    default.
                  </p>

                  <div
                    className="border-2 border-dashed border-white/20 rounded-lg p-6 text-center hover:border-[#955E30] transition-colors cursor-pointer"
                    onClick={() =>
                      document.getElementById("banner-upload").click()
                    }
                  >
                    <input
                      id="banner-upload"
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
                    <p className="text-white font-body">
                      Click to upload images
                    </p>
                    <p className="text-white/40 text-sm font-body mt-1">
                      PNG, JPG, WEBP up to 5MB each
                    </p>
                  </div>

                  {/* Image Previews */}
                  {imagePreviews.length > 0 && (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
                      {imagePreviews.map((preview, index) => (
                        <div
                          key={index}
                          className={`relative rounded-lg overflow-hidden border-2 ${
                            index === primaryImageIndex
                              ? "border-[#955E30]"
                              : "border-white/20"
                          } cursor-pointer transition-all`}
                          onClick={() => setPrimaryImageIndex(index)}
                        >
                          <img
                            src={preview}
                            alt={`Preview ${index + 1}`}
                            className="w-full h-40 object-cover"
                          />
                          <div
                            className={`absolute inset-0 bg-gradient-to-r ${formData.gradient}`}
                          ></div>

                          {index === primaryImageIndex && (
                            <div className="absolute top-2 left-2 bg-[#955E30] text-white text-xs px-2 py-1 rounded font-body">
                              Primary
                            </div>
                          )}

                          {!editMode && (
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                removeImage(index);
                              }}
                              className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                            >
                              <X size={16} />
                            </button>
                          )}

                          <div className="absolute bottom-2 left-2 bg-black/60 text-white text-xs px-2 py-1 rounded font-body">
                            Image {index + 1}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Title */}
                <div>
                  <label className="block text-white font-body mb-2">
                    Title *
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 bg-black/30 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-[#955E30] font-body capitalize"
                    placeholder="e.g., New Collection 2026"
                  />
                </div>

                {/* Subtitle */}
                <div>
                  <label className="block text-white font-body mb-2">
                    Subtitle *
                  </label>
                  <input
                    type="text"
                    name="subtitle"
                    value={formData.subtitle}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 bg-black/30 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-[#955E30] font-body capitalize"
                    placeholder="e.g., Exclusive Designer Sarees"
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-white font-body mb-2">
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows="3"
                    className="w-full px-4 py-3 bg-black/30 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-[#955E30] font-body resize-none capitalize"
                    placeholder="e.g., Up to 50% OFF"
                  />
                </div>

                {/* Gradient */}
                <div>
                  <label className="block text-white font-body mb-2">
                    Gradient Overlay
                  </label>
                  <select
                    name="gradient"
                    value={formData.gradient}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-black/30 border border-white/20 rounded-lg text-white focus:outline-none focus:border-[#955E30] font-body"
                  >
                    {gradientOptions.map(({ value, label }) => (
                      <option
                        key={value}
                        value={value}
                        className="bg-black text-white"
                      >
                        {label}
                      </option>
                    ))}
                  </select>

                  {/* Gradient Preview */}
                  <div className="mt-3 h-16 rounded-lg bg-gray-900 relative overflow-hidden">
                    <div
                      className={`absolute inset-0 bg-gradient-to-r ${formData.gradient}`}
                    ></div>
                  </div>
                </div>

                {/* Active Status */}
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    name="is_active"
                    id="is_active"
                    checked={formData.is_active}
                    onChange={handleInputChange}
                    className="w-5 h-5 accent-[#955E30] cursor-pointer"
                  />
                  <label
                    htmlFor="is_active"
                    className="text-white font-body cursor-pointer"
                  >
                    Active (Show on website)
                  </label>
                </div>

                {/* Submit Buttons */}
                <div className="flex gap-4 pt-4 border-t border-white/10">
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 bg-[#955E30] hover:bg-[#955E30]/80 text-white py-3 rounded-lg font-body transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading
                      ? editMode
                        ? "Updating..."
                        : "Adding..."
                      : editMode
                      ? "Update Banner"
                      : "Add Banner"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="px-8 bg-white/10 hover:bg-white/20 text-white py-3 rounded-lg font-body transition-colors border border-white/20"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
