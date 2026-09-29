import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../../../store/useAuthStore";

import UserProfile from "@/Components/UserProfile/UserProfile";
import Logo from "../../../../assets/images/logo.svg";
import Cart from "../Cart";
import NavBarMegaMenu from "./NavBarMegaMenu";
import { useCartStore } from "@/api/cartService";


interface NavbarProps {
  onSelectCategory: (category: string) => void;
  onSelectView: (currentView: "catalog" | "assistant") => void;
}

const Navbar = ({ onSelectCategory, onSelectView }: NavbarProps) => {
  const navigate = useNavigate();

  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  // Access cart state and methods
  const items = useCartStore((state) => state.items);
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  const user = useAuthStore((state) => state.user);


  return (
    <div className="navbar bg-neutral shadow-sm border-b border-base-200 w-full px-4">
      {/* Brand Section */}
      <div className="navbar-start">
        <div className="aura text-purple-400">
          <div className="card bg-neutral max-w-xs shadow-sm">
            <div className="card-body p-3">
              <img
                src={Logo}
                alt="Brand Logo"
                onClick={() => {
                  onSelectCategory("");
                  navigate("/dashboard");
                  onSelectView("catalog");
                }}
                className="w-36 cursor-pointer"
              />
            </div>
          </div>
        </div>
      </div>

      {/* MegaMenu Center Section */}
      <NavBarMegaMenu
        onSelectCategory={onSelectCategory}
        onSelectView={onSelectView}
      />

      {/* Action / User Controls */}
      <div className="navbar-end">
        {/* Shopping Cart Dropdown */}
        <div className="flex items-center gap-5">
          <div className="dropdown dropdown-end">
            <div
              tabIndex={0}
              role="button"
              className="btn btn-ghost btn-circle"
            >
              <div className="indicator">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
                {totalItems > 0 && (
                  <span className="badge badge-sm badge-primary indicator-item">
                    {totalItems}
                  </span>
                )}
              </div>
            </div>

            {/* Cart Dropdown Content */}
            <Cart />
          </div>

          {/* User Auth Info */}
          {isAuthenticated && user ? (
            <UserProfile />
          ) : (
            <div className="flex items-center gap-2">
              <button
                className="btn btn-ghost"
                onClick={() => navigate("/login/signin")}
              >
                Sign In
              </button>
              <button
                className="btn btn-primary"
                onClick={() => navigate("/login/signup")}
              >
                Sign Up
              </button>
              <button className="btn sm:hidden" popoverTarget="my-megamenu-4">
                Menu
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
