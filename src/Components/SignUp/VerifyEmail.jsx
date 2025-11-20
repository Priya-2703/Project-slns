import { useState, useEffect } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import { CheckCircle, XCircle, Loader2, Mail } from "lucide-react";
import axios from "axios";

export default function VerifyEmail() {
  const BACKEND_URL = import.meta.env.VITE_API_URL;
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState("verifying"); // verifying, success, error
  const [message, setMessage] = useState("");
  const [resendEmail, setResendEmail] = useState("");
  const [resending, setResending] = useState(false);

  useEffect(() => {
    const token = searchParams.get("token");
    
    if (!token) {
      setStatus("error");
      setMessage("Invalid verification link. Please check your email.");
      return;
    }

    // Verify the email
    verifyEmail(token);
  }, [searchParams]);

  const verifyEmail = async (token) => {
    try {
      const response = await axios.post(`${BACKEND_URL}/api/verify-email`, {
        token: token,
      });

      const data = response.data;
      
      // Store token and user info for auto-login
      if (data.token) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
      }

      setStatus("success");
      setMessage(data.message);

      // Redirect to home after 3 seconds
      setTimeout(() => {
        navigate("/");
      }, 3000);
    } catch (error) {
      setStatus("error");
      setMessage(
        error.response?.data?.error || "Verification failed. Please try again."
      );
      console.error("Verification error:", error);
    }
  };

  const handleResendVerification = async (e) => {
    e.preventDefault();
    setResending(true);

    try {
      const response = await axios.post(
        `${BACKEND_URL}/api/resend-verification`,
        {
          email: resendEmail,
        }
      );

      alert(response.data.message);
      setResendEmail("");
    } catch (error) {
      alert(
        error.response?.data?.error ||
          "Failed to resend verification email. Please try again."
      );
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <div className="max-w-md w-full mx-4">
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl p-8">
          {/* Status Icon */}
          <div className="flex justify-center mb-6">
            {status === "verifying" && (
              <Loader2 className="w-16 h-16 text-blue-400 animate-spin" />
            )}
            {status === "success" && (
              <CheckCircle className="w-16 h-16 text-green-400" />
            )}
            {status === "error" && (
              <XCircle className="w-16 h-16 text-red-400" />
            )}
          </div>

          {/* Status Message */}
          <div className="text-center mb-6">
            {status === "verifying" && (
              <>
                <h2 className="text-2xl font-bold text-white mb-2">
                  Verifying Your Email
                </h2>
                <p className="text-gray-300">
                  Please wait while we verify your account...
                </p>
              </>
            )}

            {status === "success" && (
              <>
                <h2 className="text-2xl font-bold text-green-400 mb-2">
                  Email Verified Successfully! 🎉
                </h2>
                <p className="text-gray-300 mb-4">{message}</p>
                <p className="text-sm text-gray-400">
                  Redirecting you to the homepage...
                </p>
              </>
            )}

            {status === "error" && (
              <>
                <h2 className="text-2xl font-bold text-red-400 mb-2">
                  Verification Failed
                </h2>
                <p className="text-gray-300 mb-4">{message}</p>
              </>
            )}
          </div>

          {/* Resend Verification Form (Only show on error) */}
          {status === "error" && (
            <div className="mt-8 pt-6 border-t border-gray-700">
              <div className="flex items-center justify-center gap-2 mb-4">
                <Mail className="w-5 h-5 text-gray-400" />
                <h3 className="text-lg font-semibold text-white">
                  Resend Verification
                </h3>
              </div>

              <form onSubmit={handleResendVerification} className="space-y-4">
                <input
                  type="email"
                  value={resendEmail}
                  onChange={(e) => setResendEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                  className="w-full px-4 py-3 rounded-lg bg-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-600"
                />

                <button
                  type="submit"
                  disabled={resending}
                  className="w-full bg-amber-600 hover:bg-amber-700 text-white font-semibold py-3 rounded-lg transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {resending ? "Sending..." : "Resend Verification Email"}
                </button>
              </form>
            </div>
          )}

          {/* Action Buttons */}
          <div className="mt-6 flex flex-col gap-3">
            {status === "success" && (
              <button
                onClick={() => navigate("/")}
                className="w-full bg-amber-600 hover:bg-amber-700 text-white font-semibold py-3 rounded-lg transition duration-200"
              >
                Go to Homepage
              </button>
            )}

            {status === "error" && (
              <Link
                to="/signin"
                className="w-full text-center bg-gray-700 hover:bg-gray-600 text-white font-semibold py-3 rounded-lg transition duration-200"
              >
                Back to Sign In
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}