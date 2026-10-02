import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Eye, EyeOff, Mail, User, Lock, Loader2, AlertCircle } from "lucide-react";
import { useAuthStore } from "../../api/useAuthStore";
import { fetchCurrentUser, loginUser, registerUser } from "@/api/AuthService";

const SignUpForm = () => {
  const [username, setUsername] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");

  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const login = useAuthStore((state) => state.login);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    const isValidEmail = (str: string) => /\S+@\S+\.\S+/.test(str);
    const isValidName = (str: string) => /^[a-zA-Z\s'-]+$/.test(str.trim());

    if (!username.trim() || !email || !password || !confirmPassword) {
      setError("All fields are required.");
      return;
    }

    if (!isValidName(username)) {
      setError("Username can only contain letters, spaces, hyphens, and apostrophes.");
      return;
    }

    if (!isValidEmail(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      await registerUser({ username, email, password });
      const loginData = await loginUser(email, password);

      if (loginData.access_token) {
        const userData = await fetchCurrentUser();
        login(loginData.access_token, userData);
        navigate("/dashboard");
      }
    } catch (err: any) {
      const detail = err.response?.data?.detail;

      if (Array.isArray(detail)) {
        setError(detail[0]?.msg || "Invalid input format.");
      } else if (typeof detail === "string") {
        setError(detail);
      } else {
        setError("An unexpected error occurred during registration.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto space-y-5">
      {/* Header */}
      <div>
        <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
          Create <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#B100D6] to-[#9073E9]">Account</span>
        </h2>
        <p className="text-neutral-400 text-sm mt-1">
          Get started with your free repair engineer account.
        </p>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="flex items-center gap-3 p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm animate-in fade-in slide-in-from-top-1">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-3.5" noValidate>
        {/* Full Name / Username */}
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-neutral-300 uppercase tracking-wider">
            Full Name
          </label>
          <div className="relative">
            <input
              required
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="John Doe"
              className="w-full bg-[#1c1929] border border-neutral-700/80 rounded-xl px-4 py-2.5 pl-11 text-white placeholder:text-neutral-500 focus:outline-none focus:border-[#B100D6] focus:ring-1 focus:ring-[#B100D6] transition-all duration-200 text-sm"
            />
            <User className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
          </div>
        </div>

        {/* Email */}
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-neutral-300 uppercase tracking-wider">
            Email Address
          </label>
          <div className="relative">
            <input
              required
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com"
              className="w-full bg-[#1c1929] border border-neutral-700/80 rounded-xl px-4 py-2.5 pl-11 text-white placeholder:text-neutral-500 focus:outline-none focus:border-[#B100D6] focus:ring-1 focus:ring-[#B100D6] transition-all duration-200 text-sm"
            />
            <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
          </div>
        </div>

        {/* Password */}
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-neutral-300 uppercase tracking-wider">
            Password
          </label>
          <div className="relative">
            <input
              required
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-[#1c1929] border border-neutral-700/80 rounded-xl px-4 py-2.5 pl-11 pr-11 text-white placeholder:text-neutral-500 focus:outline-none focus:border-[#B100D6] focus:ring-1 focus:ring-[#B100D6] transition-all duration-200 text-sm"
            />
            <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white transition-colors"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Confirm Password */}
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-neutral-300 uppercase tracking-wider">
            Confirm Password
          </label>
          <div className="relative">
            <input
              required
              type={showConfirmPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-[#1c1929] border border-neutral-700/80 rounded-xl px-4 py-2.5 pl-11 pr-11 text-white placeholder:text-neutral-500 focus:outline-none focus:border-[#B100D6] focus:ring-1 focus:ring-[#B100D6] transition-all duration-200 text-sm"
            />
            <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white transition-colors"
            >
              {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 px-6 mt-2 rounded-xl font-semibold text-white bg-gradient-to-r from-[#B100D6] to-[#7B2CBF] hover:from-[#a000c2] hover:to-[#6c24ab] active:scale-[0.99] transition-all duration-200 shadow-[0_0_20px_rgba(177,0,214,0.4)] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer text-sm"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Creating account...</span>
            </>
          ) : (
            <span>Sign Up</span>
          )}
        </button>

        {/* Footer Link */}
        <p className="text-center text-xs text-neutral-400 pt-1">
          Already have an account?{" "}
          <button
            type="button"
            onClick={() => navigate("/login/signin")}
            className="text-[#9073E9] hover:text-[#B100D6] font-semibold hover:underline transition-colors ml-1 cursor-pointer"
          >
            Sign in
          </button>
        </p>
      </form>
    </div>
  );
};

export default SignUpForm;