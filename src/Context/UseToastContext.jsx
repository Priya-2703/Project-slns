import { createContext, useContext, useState } from "react";

export const ToastContext = createContext();

export const ToastProvider = ({ children }) => {
  const [toast, setToast] = useState({ show: false, message: "", type: "" });

  const showToast = (message, type = "success") => {
    setToast({ show: true, message, type });

    setTimeout(() => {
      setToast({ show: false, message: "", type: "" });
    }, 2000);
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}

      {/* Toast UI */}
      {toast.show && (
        <div
          className={`fixed top-[70px] md:top-[100px] capitalize z-999 right-5 px-3 py-2 md:px-6 md:py-4 text-[10px] md:text-[13px] shadow-lg font-['Poppins'] text-white bg-clip-padding backdrop-filter bg-white/5 backdrop-blur-sm bg-opacity-40 justify-center overflow-hidden transform transition-all duration-500 border border-gray-700 ease-in-out`}
        >
          {toast.message}
        </div>
      )}
    </ToastContext.Provider>
  );
};
