import { useNavigate } from "react-router-dom";

import { useState } from "react";
import { Eye, EyeOff, Mail, User, Loader2 } from "lucide-react";
import { useAuthStore } from "@/store/useAuthStore";
import { fetchCurrentUser, loginUser, registerUser } from "@/api/AuthService";

const SignUpForm = () => {
  const [username, setUsername] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");

  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const login = useAuthStore((state) => state.login);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    // Helper validation functions
    const isValidEmail = (str: string) => /\S+@\S+\.\S+/.test(str);
    const isValidName = (str: string) => /^[a-zA-Z\s'-]+$/.test(str.trim());

    // 1. Client-Side Validation Guards
    if (!username.trim() || !email || !password || !confirmPassword) {
      setError("All fields are required.");
      return;
    }

    if (!isValidName(username)) {
      setError(
        "Username/Name can only contain letters, spaces, hyphens, and apostrophes.",
      );
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

    // 2. Network Request Execution
    setLoading(true);

    try {
      // Register the user on the backend (passing username alongside email & password)
      await registerUser({ username, email, password });

      // Auto-login: retrieve token and user profile right after registration
      const loginData = await loginUser(email, password);

      if (loginData.access_token) {
        const userData = await fetchCurrentUser();

        // Update global Zustand state and navigate to app
        login(loginData.access_token, userData);
        navigate("/dashboard");
      }
    } catch (err: any) {
      const detail = err.response?.data?.detail;

      if (Array.isArray(detail)) {
        // Handles FastAPI/Pydantic 422 error arrays
        setError(detail[0]?.msg || "Invalid input format.");
      } else if (typeof detail === "string") {
        // Handles 400 Bad Request (e.g., "Email or username already registered")
        setError(detail);
      } else {
        setError("An unexpected error occurred during registration.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card-body w-full md:w-1/2 p-6 sm:p-12 overflow-y-auto flex flex-col justify-around">
      <h2 className="card-title text-2xl flex flex-row items-baseline justify-center gap-2">
        <span className="font-bold text-3xl sm:text-5xl text-[#B100D6]">
          Create
        </span>
        <span className="text-xl sm:text-3xl text-neutral-300 font-normal">
          account
        </span>
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        {/* Display Server Errors */}
        {error && (
          <div className="p-3 bg-red-500/10 border border-red-500/50 rounded-lg text-red-400 text-sm">
            {error}
          </div>
        )}

        {/* Username / Full Name */}
        <fieldset className="fieldset">
          <legend className="fieldset-legend text-neutral-300 text-lg">
            Full name
          </legend>
          <div className="relative w-full">
            <input
              required
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="input input-bordered w-full bg-neutral-900 border-neutral-700 text-white placeholder:text-neutral-500"
              placeholder="Type your username here"
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400"
            >
              <User className="w-5 h-5" />
            </button>
          </div>
        </fieldset>

        {/* Email */}
        <fieldset className="fieldset">
          <legend className="fieldset-legend text-neutral-300 text-lg">
            Email
          </legend>
          <div className="relative w-full">
            <input
              required
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input input-bordered w-full bg-neutral-900 border-neutral-700 text-white placeholder:text-neutral-500"
              placeholder="Type your email here"
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400"
            >
              <Mail className="w-5 h-5" />
            </button>
          </div>
        </fieldset>

        {/* Password */}
        <fieldset className="fieldset">
          <legend className="fieldset-legend text-neutral-300 text-lg">
            Password
          </legend>
          <div className="relative w-full">
            <input
              required
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input input-bordered w-full bg-neutral-900 border-neutral-700 text-white placeholder:text-neutral-500 pr-10"
              placeholder="*********"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white transition-colors cursor-pointer"
            >
              {showPassword ? (
                <EyeOff className="w-5 h-5" />
              ) : (
                <Eye className="w-5 h-5" />
              )}
            </button>
          </div>
        </fieldset>

        {/* Confirm Password */}
        <fieldset className="fieldset">
          <legend className="fieldset-legend text-neutral-300 text-lg">
            Confirm password
          </legend>
          <div className="relative w-full">
            <input
              required
              type={showConfirmPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="input input-bordered w-full bg-neutral-900 border-neutral-700 text-white placeholder:text-neutral-500 pr-10"
              placeholder="*********"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white transition-colors cursor-pointer"
            >
              {showConfirmPassword ? (
                <EyeOff className="w-5 h-5" />
              ) : (
                <Eye className="w-5 h-5" />
              )}
            </button>
          </div>
        </fieldset>

        <div className="pt-4">
          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary w-full text-lg flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Creating account...
              </>
            ) : (
              "Sign Up"
            )}
          </button>

          <p className="mt-7 text-xl">
            Already have an account?{" "}
            <a
              className="link link-hover text-[#B100D6] cursor-pointer"
              onClick={() => navigate("/login/signin")}
            >
              Click here
            </a>
          </p>
        </div>
      </form>
    </div>
  );
};

export default SignUpForm;
