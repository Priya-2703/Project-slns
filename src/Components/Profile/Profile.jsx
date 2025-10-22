import React, { useState } from "react";
import {
  User,
  Package,
  Heart,
  MapPin,
  Settings,
  Edit2,
  Save,
  X,
  Mail,
  Phone,
  Calendar,
  ShoppingBag,
  Truck,
  CheckCircle,
  Clock,
} from "lucide-react";

const Profile = () => {
  // User Data State
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState("profile");

  const [userData, setUserData] = useState({
    name: "Rajesh Kumar",
    email: "rajesh@example.com",
    phone: "+91 98765 43210",
    dob: "1995-06-15",
    gender: "Male",
    avatar: "https://ui-avatars.com/api/?name=Rajesh+Kumar&size=200",
  });

  const [editData, setEditData] = useState({ ...userData });

  // Orders Data
  const [orders] = useState([
    {
      id: "#ORD001",
      date: "2024-01-15",
      items: 3,
      total: 2499,
      status: "Delivered",
      products: ["Cotton T-Shirt", "Denim Jeans", "Sneakers"],
    },
    {
      id: "#ORD002",
      date: "2024-01-20",
      items: 2,
      total: 1899,
      status: "Shipped",
      products: ["Formal Shirt", "Trousers"],
    },
    {
      id: "#ORD003",
      date: "2024-01-22",
      items: 1,
      total: 899,
      status: "Processing",
      products: ["Hoodie"],
    },
  ]);

  // Addresses
  const [addresses, setAddresses] = useState([
    {
      id: 1,
      type: "Home",
      address: "123, Anna Nagar, Chennai - 600040",
      isDefault: true,
    },
    {
      id: 2,
      type: "Work",
      address: "456, T Nagar, Chennai - 600017",
      isDefault: false,
    },
  ]);

  // Handle Edit Functions
  const handleEdit = () => {
    setIsEditing(true);
    setEditData({ ...userData });
  };

  const handleSave = () => {
    setUserData({ ...editData });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditData({ ...userData });
    setIsEditing(false);
  };

  const handleInputChange = (e) => {
    setEditData({
      ...editData,
      [e.target.name]: e.target.value,
    });
  };

  const deleteAddress = (id) => {
    setAddresses(addresses.filter((addr) => addr.id !== id));
  };

  const setDefaultAddress = (id) => {
    setAddresses(
      addresses.map((addr) => ({
        ...addr,
        isDefault: addr.id === id,
      }))
    );
  };

  // Status Badge Component
  const StatusBadge = ({ status }) => {
    const styles = {
      Delivered: "bg-green-500/20 text-green-400 border-green-500",
      Shipped: "bg-blue-500/20 text-blue-400 border-blue-500",
      Processing: "bg-yellow-500/20 text-yellow-400 border-yellow-500",
      Cancelled: "bg-red-500/20 text-red-400 border-red-500",
    };

    const icons = {
      Delivered: <CheckCircle size={14} />,
      Shipped: <Truck size={14} />,
      Processing: <Clock size={14} />,
    };

    return (
      <span
        className={`px-3 py-1 rounded-full text-xs font-semibold border flex items-center gap-1 ${styles[status]}`}
      >
        {icons[status]}
        {status}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-black text-white mt-28">
      {/* Header */}
      <div className="">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <h1 className="text-[30px] font1 font-bold">My Account</h1>
          <p className="text-gray-400 font2 text-[13px] tracking-wide">Manage your profile and orders</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <div className="bg-black rounded-[20px] p-6 border border-gray-900 sticky top-6">
              <div className="flex flex-col items-center mb-6">
                <img
                  src={userData.avatar}
                  alt="Profile"
                  className="w-24 h-24 rounded-full border-4 border-white/10 mb-3"
                />
                <h3 className="text-[18px] font1 font-bold">{userData.name}</h3>
                <p className="text-gray-400 font2 text-[13px]">{userData.email}</p>
              </div>

              <nav className="space-y-2">
                {[
                  { id: "profile", icon: User, label: "Profile Info" },
                  { id: "orders", icon: Package, label: "My Orders" },
                  { id: "addresses", icon: MapPin, label: "Addresses" },
                  { id: "settings", icon: Settings, label: "Settings" },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 font2 font-extrabold text-[16px] rounded-[50px] transition-all duration-300 ${
                      activeTab === item.id
                        ? "bg-white text-black font-[900]"
                        : "text-gray-400 hover:bg-gray-800 hover:text-white"
                    }`}
                  >
                    <item.icon size={20} />
                    {item.label}
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Profile Info Tab */}
            {activeTab === "profile" && (
              <div className="bg-black rounded-[20px] p-8 border border-gray-900 animate-fadeIn">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-[24px] font1 font-bold">Profile Information</h2>
                  {!isEditing ? (
                    <button
                      onClick={handleEdit}
                      className="flex items-center font2 gap-2 bg-white text-black px-4 py-2 rounded-lg hover:bg-gray-200 transition-all duration-300"
                    >
                      <Edit2 size={18} />
                      Edit Profile
                    </button>
                  ) : (
                    <div className="flex font2 gap-2">
                      <button
                        onClick={handleSave}
                        className="flex items-center gap-2 bg-green-600 px-4 py-2 rounded-lg hover:bg-green-700 transition-all duration-300"
                      >
                        <Save size={18} />
                        Save
                      </button>
                      <button
                        onClick={handleCancel}
                        className="flex items-center gap-2 bg-red-600 px-4 py-2 rounded-lg hover:bg-red-700 transition-all duration-300"
                      >
                        <X size={18} />
                        Cancel
                      </button>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="text-gray-400 text-sm mb-2 block">
                      Full Name
                    </label>
                    <div className="flex items-center gap-3 bg-black px-4 py-3 font2 rounded-[60px] border border-gray-800">
                      <User size={20} className="text-gray-400" />
                      {isEditing ? (
                        <input
                          type="text"
                          name="name"
                          value={editData.name}
                          onChange={handleInputChange}
                          className="bg-transparent outline-none flex-1 text-white"
                        />
                      ) : (
                        <span>{userData.name}</span>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="text-gray-400 text-sm mb-2 block">
                      Email Address
                    </label>
                    <div className="flex items-center gap-3 bg-black px-4 py-3 font2 rounded-[60px] border border-gray-800">
                      <Mail size={20} className="text-gray-400" />
                      {isEditing ? (
                        <input
                          type="email"
                          name="email"
                          value={editData.email}
                          onChange={handleInputChange}
                          className="bg-transparent outline-none flex-1 text-white"
                        />
                      ) : (
                        <span>{userData.email}</span>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="text-gray-400 text-sm mb-2 block">
                      Phone Number
                    </label>
                    <div className="flex items-center gap-3 bg-black px-4 py-3 font2 rounded-[60px] border border-gray-800">
                      <Phone size={20} className="text-gray-400" />
                      {isEditing ? (
                        <input
                          type="tel"
                          name="phone"
                          value={editData.phone}
                          onChange={handleInputChange}
                          className="bg-transparent outline-none flex-1 text-white"
                        />
                      ) : (
                        <span>{userData.phone}</span>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="text-gray-400 text-sm mb-2 block">
                      Date of Birth
                    </label>
                    <div className="flex items-center gap-3 bg-black px-4 py-3 font2 rounded-[60px] border border-gray-800">
                      <Calendar size={20} className="text-gray-400" />
                      {isEditing ? (
                        <input
                          type="date"
                          name="dob"
                          value={editData.dob}
                          onChange={handleInputChange}
                          className="bg-transparent outline-none flex-1 text-white"
                        />
                      ) : (
                        <span>
                          {new Date(userData.dob).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="text-gray-400 text-sm mb-2 block">
                      Gender
                    </label>
                    <div className="flex items-center gap-3 bg-black px-4 py-3 font2 rounded-[60px] border border-gray-800">
                      <User size={20} className="text-gray-400" />
                      {isEditing ? (
                        <select
                          name="gender"
                          value={editData.gender}
                          onChange={handleInputChange}
                          className=" outline-none flex-1 text-white bg-black"
                        >
                          <option value="Male" className="bg-black">
                            Male
                          </option>
                          <option value="Female" className="bg-black">
                            Female
                          </option>
                          <option value="Other" className="bg-black">
                            Other
                          </option>
                        </select>
                      ) : (
                        <span>{userData.gender}</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Orders Tab */}
            {activeTab === "orders" && (
              <div className="space-y-4 animate-fadeIn">
                <h2 className="text-[24px] font1 font-bold mb-6">My Orders</h2>
                {orders.map((order) => (
                  <div
                    key={order.id}
                    className="bg-black rounded-[20px] p-6 border border-gray-800 hover:border-gray-700 transition-all duration-300"
                  >
                    <div className="flex flex-wrap justify-between items-start mb-4">
                      <div>
                        <h3 className="text-xl font-bold mb-2">{order.id}</h3>
                        <p className="text-gray-400 text-sm">
                          Order Date:{" "}
                          {new Date(order.date).toLocaleDateString()}
                        </p>
                      </div>
                      <StatusBadge status={order.status} />
                    </div>

                    <div className="border-t border-gray-800 pt-4 mt-4">
                      <div className="flex items-center gap-2 mb-3">
                        <ShoppingBag size={18} className="text-gray-400" />
                        <span className="text-gray-400">
                          {order.items} Items
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-2 mb-4">
                        {order.products.map((product, idx) => (
                          <span
                            key={idx}
                            className="bg-gray-800 px-3 py-1 rounded-full text-sm"
                          >
                            {product}
                          </span>
                        ))}
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-2xl font-bold text-green-400">
                          ₹{order.total}
                        </span>
                        <button className="bg-white text-black px-6 py-2 rounded-lg hover:bg-gray-200 transition-all duration-300 font-semibold">
                          Track Order
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Addresses Tab */}
            {activeTab === "addresses" && (
              <div className="animate-fadeIn">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold">Saved Addresses</h2>
                  <button className="bg-white text-black px-4 py-2 rounded-lg hover:bg-gray-200 transition-all duration-300 font-semibold">
                    + Add New Address
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {addresses.map((addr) => (
                    <div
                      key={addr.id}
                      className="bg-black rounded-xl p-6 border border-gray-800 hover:border-gray-700 transition-all duration-300"
                    >
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex items-center gap-2">
                          <MapPin size={20} className="text-gray-400" />
                          <span className="font-bold">{addr.type}</span>
                        </div>
                        {addr.isDefault && (
                          <span className="bg-green-500/20 text-green-400 px-3 py-1 rounded-full text-xs font-semibold border border-green-500">
                            Default
                          </span>
                        )}
                      </div>
                      <p className="text-gray-400 mb-4">{addr.address}</p>
                      <div className="flex gap-2">
                        {!addr.isDefault && (
                          <button
                            onClick={() => setDefaultAddress(addr.id)}
                            className="flex-1 bg-gray-800 hover:bg-gray-700 px-4 py-2 rounded-lg transition-all duration-300"
                          >
                            Set as Default
                          </button>
                        )}
                        <button className="flex-1 bg-gray-800 hover:bg-gray-700 px-4 py-2 rounded-lg transition-all duration-300">
                          Edit
                        </button>
                        <button
                          onClick={() => deleteAddress(addr.id)}
                          className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg transition-all duration-300"
                        >
                          <X size={18} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}


            {/* Settings Tab */}
            {activeTab === "settings" && (
              <div className="bg-black rounded-[20px] p-8 border border-gray-800 animate-fadeIn">
                <h2 className="text-2xl font-bold mb-6">Account Settings</h2>
                <div className="space-y-4">
                  {[
                    {
                      title: "Change Password",
                      desc: "Update your password regularly for security",
                    },
                    {
                      title: "Notification Preferences",
                      desc: "Manage email and SMS notifications",
                    },
                    {
                      title: "Privacy Settings",
                      desc: "Control your data and privacy options",
                    },
                    {
                      title: "Payment Methods",
                      desc: "Manage saved cards and payment options",
                    },
                    {
                      title: "Delete Account",
                      desc: "Permanently delete your account",
                      danger: true,
                    },
                  ].map((setting, idx) => (
                    <div
                      key={idx}
                      className={`p-4 rounded-[20px] border transition-all duration-300 cursor-pointer ${
                        setting.danger
                          ? "border-red-800 bg-red-900/20 hover:bg-red-900/30"
                          : "border-gray-800 bg-gray-800/50 hover:bg-gray-800"
                      }`}
                    >
                      <h3
                        className={`font-bold mb-1 ${
                          setting.danger ? "text-red-400" : ""
                        }`}
                      >
                        {setting.title}
                      </h3>
                      <p className="text-gray-400 text-sm">{setting.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Add fadeIn animation */}
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out;
        }
      `}</style>
    </div>
  );
};

export default Profile;
