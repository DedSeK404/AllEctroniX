import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Eye, EyeOff, Mail, Lock, Loader2, AlertCircle } from "lucide-react";
import { useAuthStore } from "@/store/useAuthStore";
import { fetchCurrentUser, loginUser } from "@/api/AuthService";

const SignInForm = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const login = useAuthStore((state) => state.login);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    const isValidEmail = (str: string) => /\S+@\S+\.\S+/.test(str);

    if (!isValidEmail(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    setLoading(true);

    try {
      const data = await loginUser(email, password);

      if (data.access_token) {
        const userData = await fetchCurrentUser();
        login(data.access_token, userData);
        navigate("/dashboard");
      }
    } catch (err: any) {
      const detail = err.response?.data?.detail;

      if (Array.isArray(detail)) {
        setError(detail[0]?.msg || "Invalid input format.");
      } else if (typeof detail === "string") {
        setError(detail);
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
          Welcome <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#B100D6] to-[#9073E9]">Back</span>
        </h2>
        <p className="text-neutral-400 text-sm mt-2">
          Sign in to access your repair dashboard & saved components.
        </p>
      </div>

      {/* Error Message Alert */}
      {error && (
        <div className="flex items-center gap-3 p-3.5 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm animate-in fade-in slide-in-from-top-1">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-5" noValidate>
        {/* Email Field */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-neutral-300">
            Email Address
          </label>
          <div className="relative">
            <input
              required
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com"
              className="w-full bg-[#1c1929] border border-neutral-700/80 rounded-xl px-4 py-3 pl-11 text-white placeholder:text-neutral-500 focus:outline-none focus:border-[#B100D6] focus:ring-1 focus:ring-[#B100D6] transition-all duration-200"
            />
            <Mail className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
          </div>
        </div>

        {/* Password Field */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-neutral-300">
            Password
          </label>
          <div className="relative">
            <input
              required
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-[#1c1929] border border-neutral-700/80 rounded-xl px-4 py-3 pl-11 pr-11 text-white placeholder:text-neutral-500 focus:outline-none focus:border-[#B100D6] focus:ring-1 focus:ring-[#B100D6] transition-all duration-200"
            />
            <Lock className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white transition-colors"
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Action Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-3.5 px-6 mt-2 rounded-xl font-semibold text-white bg-gradient-to-r from-[#B100D6] to-[#7B2CBF] hover:from-[#a000c2] hover:to-[#6c24ab] active:scale-[0.99] transition-all duration-200 shadow-[0_0_20px_rgba(177,0,214,0.4)] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer"
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Signing in...</span>
            </>
          ) : (
            <span>Sign In</span>
          )}
        </button>

        {/* Switch Link */}
        <p className="text-center text-sm text-neutral-400 pt-2">
          Don't have an account?{" "}
          <button
            type="button"
            onClick={() => navigate("/login/signup")}
            className="text-[#9073E9] hover:text-[#B100D6] font-semibold hover:underline transition-colors ml-1 cursor-pointer"
          >
            Create an account
          </button>
        </p>
      </form>
    </div>
  );
};

export default SignInForm;