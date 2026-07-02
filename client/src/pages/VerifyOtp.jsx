import { useEffect, useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { resendOtp, verifyOtp } from "../services/api";

export default function VerifyOtp() {
  const location = useLocation();
  const navigate = useNavigate();
  const [otp, setOtp] = useState("");
  const [email, setEmail] = useState(location.state?.email || "");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [cooldown, setCooldown] = useState(0);

  useEffect(() => {
    if (!email) {
      navigate("/register");
    }
  }, [email, navigate]);

  useEffect(() => {
    if (cooldown <= 0) return;

    const timer = window.setInterval(() => {
      setCooldown((previous) => previous - 1);
    }, 1000);

    return () => window.clearInterval(timer);
  }, [cooldown]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSuccess("");

    if (!otp || otp.length !== 6) {
      setError("Please enter the 6-digit OTP sent to your email.");
      return;
    }

    setIsSubmitting(true);

    try {
      const data = await verifyOtp({ email, otp });
      setSuccess(data?.message || "Email verified successfully.");
      setTimeout(() => navigate("/login"), 1200);
    } catch (err) {
      const serverMsg = err?.response?.data?.message || err?.response?.data?.error;
      setError(serverMsg || "OTP verification failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResend = async () => {
    if (cooldown > 0) return;

    setError("");
    setSuccess("");

    try {
      const data = await resendOtp({ email });
      setSuccess(data?.message || "A new OTP has been sent.");
      setCooldown(30);
    } catch (err) {
      const serverMsg = err?.response?.data?.message || err?.response?.data?.error;
      setError(serverMsg || "Unable to resend OTP right now.");
    }
  };

  return (
    <div className="flex min-h-[70vh] items-center justify-center">
      <div className="w-full max-w-md rounded-xl border border-gray-200 bg-white p-8 shadow-sm">
        <div className="mb-6 text-center">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600 text-xl font-bold text-white">
            OTP
          </div>
          <h2 className="text-xl font-bold text-gray-900">Verify your email</h2>
          <p className="mt-1 text-sm text-gray-500">
            Enter the 6-digit code sent to {email || "your email"}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              One-time password
            </label>
            <input
              type="text"
              inputMode="numeric"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-center text-lg tracking-[0.3em] text-gray-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
              placeholder="______"
              required
            />
          </div>

          {error && (
            <p className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
              {error}
            </p>
          )}
          {success && (
            <p className="rounded-lg border border-green-200 bg-green-50 p-3 text-sm text-green-700">
              {success}
            </p>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-400"
          >
            {isSubmitting ? "Verifying..." : "Verify OTP"}
          </button>
        </form>

        <div className="mt-4 text-center text-sm text-gray-500">
          <button
            type="button"
            onClick={handleResend}
            disabled={cooldown > 0}
            className="font-medium text-blue-600 hover:text-blue-700 disabled:cursor-not-allowed disabled:text-gray-400"
          >
            {cooldown > 0 ? `Resend OTP in ${cooldown}s` : "Resend OTP"}
          </button>
        </div>

        <p className="mt-4 text-center text-sm text-gray-500">
          Back to{" "}
          <Link to="/register" className="font-medium text-blue-600 hover:text-blue-700">
            registration
          </Link>
        </p>
      </div>
    </div>
  );
}
