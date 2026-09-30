import { useParams } from "react-router-dom";
import SignInForm from "./SignInForm";
import SignUpForm from "./SignUpForm";
import DashBoard from "../DashBoard/DashBoard";
import Logo from "../../assets/images/logo.svg";

const LogIn = () => {
  const { mode } = useParams<{ mode: string }>();

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center p-3 sm:p-5 lg:p-8 bg-[#0a0814] overflow-hidden bg-[radial-gradient(#9073E9_1px,transparent_1px)] bg-size-[24px_24px] bg-center">
      {/* Center Ambient Glow Overlay */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(177,0,214,0.22)_0%,#0a0814_80%)]" />

      {/* Ultra-Thin Hairline Glowing Outer Border Frame */}
      <div className="relative z-10 w-full max-w-7xl rounded-xl p-[0.5px] bg-linear-to-r from-[#B100D6]/60 via-[#9073E9]/30 to-[#B100D6]/60 shadow-[0_0_40px_-10px_rgba(177,0,214,0.3)]">
        {/* Main Card Container */}
        <div className="card flex-col lg:flex-row bg-[#13111c]/90 backdrop-blur-xl text-white rounded-[11.5px] w-full h-auto overflow-hidden min-h-180 lg:min-h-195">
          {/* Left Side: Brand Header & Feature Showcase */}
          <div className="w-full lg:w-1/2 bg-linear-to-br from-[#181528]/90 to-[#0f0c1b]/95 p-8 lg:p-14 flex flex-col justify-between items-center relative overflow-hidden border-b lg:border-b-0 lg:border-r border-[#B100D6]/30">
            {/* Corner Decorative Accent Glow */}
            <div className="pointer-events-none absolute -top-12 -left-12 w-48 h-48 bg-[#B100D6]/20 blur-2xl rounded-full" />

            {/* Top Section: Logo */}
            <div className=" w-full flex justify-start">
              <img src={Logo} alt="AllEctronix Logo" />
            </div>

            {/* Central Section: Logo Aura & Store / Repair Platform Features */}
            <div className="z-10 w-full max-w-md my-auto py-8 flex flex-col items-center text-center">
              <div className="relative group mb-8">
                {/* Outer Ambient Glow Ring */}
                <div className="absolute -inset-1 rounded-2xl bg-linear-to-r from-purple-600 via-secondary to-indigo-500 blur-lg opacity-70 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-tilt" />

                {/* DaisyUI Avatar Container */}
                <div className="relative avatar flex items-center justify-center w-28 h-28 rounded-2xl bg-[#0f0c1b] border border-secondary/40 shadow-2xl p-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-14 h-14 text-secondary drop-shadow-[0_0_12px_rgba(177,0,214,0.8)]"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="1.5"
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                </div>
              </div>

              {/* Title Header */}
              <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                Component Store &{" "}
                <span className="text-secondary">AI Repair</span> Hub
              </h2>
              <p className="text-xs sm:text-sm text-white/70 mt-2 max-w-sm">
                Source active semiconductors and passives with live inventory,
                plus instant AI circuit diagnostics.
              </p>

              {/* Enhanced Contrast Feature Cards */}
              <div className="grid grid-cols-2 gap-3.5 mt-8 w-full">
                <div className="p-3.5 rounded-xl bg-white/10 border border-secondary/30 text-left backdrop-blur-md hover:border-secondary/60 transition-colors shadow-lg">
                  <span className="block text-secondary font-bold text-sm tracking-wide">
                    Live Component Store
                  </span>
                  <span className="text-[11px] text-white/70 mt-0.5 block leading-tight">
                    Instant part sourcing & live stock sync
                  </span>
                </div>
                <div className="p-3.5 rounded-xl bg-white/10 border border-secondary/30 text-left backdrop-blur-md hover:border-secondary/60 transition-colors shadow-lg">
                  <span className="block text-secondary font-bold text-sm tracking-wide">
                    AI Repair Copilot
                  </span>
                  <span className="text-[11px] text-white/70 mt-0.5 block leading-tight">
                    Smart diagnostics & part cross-referencing
                  </span>
                </div>
              </div>
            </div>

            {/* Bottom Subtext Banner */}
            <div className="z-10 text-center w-full pt-4 border-t border-white/5">
              <p className="text-xs text-white/50">
                Got a broken circuit or missing a part? We've got you covered.
              </p>
            </div>
          </div>

          {/* Right Side: Dynamic Form Container */}
          <div className="relative w-full lg:w-1/2 p-6 sm:p-12 lg:p-16 flex flex-col justify-center bg-[#13111c]/70">
            {/* Background Radial Light Accent */}
            <div
              className="pointer-events-none absolute h-96 w-full max-w-4xl rounded-full bg-linear-to-r from-purple-600/20 via-indigo-500/15 to-purple-800/20 blur-3xl opacity-80 animate-pulse"
              aria-hidden="true"
            />
            <div className="relative z-10 w-full">
              {mode === "signin" ? (
                <SignInForm />
              ) : mode === "signup" ? (
                <SignUpForm />
              ) : (
                <DashBoard />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LogIn;
