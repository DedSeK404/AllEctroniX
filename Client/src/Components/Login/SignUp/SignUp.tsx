import { useNavigate } from "react-router-dom";
import loginArt from "../../../assets/images/loginArt.svg";
import { useState } from "react";
import { Eye, EyeOff, Mail, User, Loader2 } from "lucide-react";
import { registerUser, loginUser, fetchCurrentUser } from "../../../api/AuthService";
import { useAuthStore } from "../../../store/useAuthStore";

export default function SignUp() {
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

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      // 1. Register user with API
      await registerUser(email, password);

      // 2. Automatically log user in after registration
      const data = await loginUser(email, password);
      if (data.access_token) {
        const userData = await fetchCurrentUser();
        login(data.access_token, userData);
        navigate("/dashboard");
      }
    } catch (err: any) {
      const message =
        err.response?.data?.detail || "Registration failed. Please try again.";
      setError(typeof message === "string" ? message : "Error creating account");
    } finally {
      setLoading(false);
    }
  };
console.log(handleSubmit);
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-linear-to-bl from-[#9073E9] to-[#5A39C6] p-4 sm:p-6 lg:p-8">
      <div className="card card-side flex-col md:flex-row bg-[rgb(28,28,34)] text-white shadow-2xl w-full max-w-7xl h-auto overflow-hidden border border-neutral-800">
        {/* Left Side: Illustration Wrapper */}
        <figure className="w-full">
          <img
            src={loginArt}
            alt="Sign up illustration"
            className="w-full h-full object-contain"
            draggable="false"
          />
        </figure>

        {/* Right Side: Form Container */}
        <div className="card-body w-full md:w-1/2 p-6 sm:p-12 overflow-y-auto flex flex-col justify-around">
          <h2 className="card-title text-2xl flex flex-row items-baseline justify-center gap-2">
            <span className="font-bold text-3xl sm:text-5xl text-[#B100D6]">
              Create
            </span>
            <span className="text-xl sm:text-3xl text-neutral-300 font-normal">
              account
            </span>
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
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
      </div>
    </div>
  );
}