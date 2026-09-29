import { useParams } from "react-router-dom";
import loginArt from "../../assets/images/loginArt.svg";
import SignInForm from "./SignInForm";
import SignUpForm from "./SignUpForm";
import DashBoard from "../DashBoard/DashBoard";

const LogIn = () => {
  const { mode } = useParams<{ mode: string }>();

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-linear-to-bl from-[#9073E9] to-[#5A39C6] p-4 sm:p-6 lg:p-8">
      <div className="card card-side flex-col md:flex-row bg-[rgb(28,28,34)] text-white shadow-2xl w-full max-w-7xl h-auto overflow-hidden border border-neutral-800">
        {/* Left Side: Illustration Wrapper */}
        <figure className="w-full">
          <img
            src={loginArt}
            alt="Login illustration"
            className="w-full h-full object-contain"
            draggable="false"
          />
        </figure>
        {mode == "signin" ? (
          <SignInForm />
        ) : mode == "signup" ? (
          <SignUpForm />
        ) : (
          <DashBoard />
        )}
      </div>
    </div>
  );
};

export default LogIn;
