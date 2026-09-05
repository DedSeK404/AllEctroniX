import { Part } from "@/Types/types";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../../store/useAuthStore";
import { useCartStore } from "@/Components/DashBoard/Components/useCartStore";
import UserProfile from "@/Components/UserProfile/UserProfile";
import Logo from "../../../assets/images/logo.svg";
import AiAssistantDropdown from "./AssistantDropdown";
import Cart from "./Cart";
import { useState } from "react";

interface NavbarProps {
  parts: Part[];
  onSelectCategory: (category: string) => void;
  onSelectView: (currentView: "catalog" | "assistant") => void;
}
export interface CartItem {
  part: Part;
  quantity: number;
}

const Navbar = ({ onSelectCategory, onSelectView }: NavbarProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const user = useAuthStore((state) => state.user);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  // Access cart state and action methods from Zustand store

  const totalItems = useCartStore((state) => state.getTotalItems());

  return (
    <div className="navbar bg-base-100 shadow-sm border-b border-base-200">
      {/* Brand Section */}
      <div className="navbar-start">
        <div className="aura text-purple-400">
          <div className="card bg-base-100 max-w-xs shadow-sm">
            <div className="card-body p-3">
              <img
                src={Logo}
                alt="Brand Logo"
                onClick={() => {
                  onSelectCategory("");
                  navigate("/dashboard");
                }}
                className="w-36 cursor-pointer"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Megamenu Navigation */}
      <div className="navbar-center">
        <div
          className="megamenu max-sm:megamenu-vertical megamenu-full"
          id="my-megamenu-4"
          popover="auto"
        >
          <span className="megamenu-active"></span>

          {/* Tab 1: Live Components Catalog */}
          <button popoverTarget="d1" onClick={() => onSelectView("catalog")}>
            Components Catalog
          </button>
          <div id="d1" popover="auto">
            <div className="flex max-sm:flex-col items-start p-2 gap-4">
              <ul className="menu w-full md:menu-horizontal">
                {/* Active Semiconductors */}
                <li>
                  <a className="font-bold text-secondary">
                    Active Semiconductors
                  </a>
                  <ul>
                    <li>
                      <a
                        className="cursor-pointer"
                        onClick={() =>
                          onSelectCategory("embedded processors & controllers")
                        }
                      >
                        Microcontrollers & Processors
                      </a>
                    </li>
                    <li>
                      <a
                        className="cursor-pointer"
                        onClick={() =>
                          onSelectCategory("power management (pmic)")
                        }
                      >
                        Power Management ICs (PMIC)
                      </a>
                    </li>
                    <li>
                      <a
                        className="cursor-pointer"
                        onClick={() => onSelectCategory("MOSFETs")}
                      >
                        MOSFETs & Transistors
                      </a>
                    </li>
                    <li>
                      <a
                        className="cursor-pointer"
                        onClick={() => onSelectCategory("diodes")}
                      >
                        Diodes & Rectifiers
                      </a>
                    </li>
                    <li>
                      <a
                        className="cursor-pointer"
                        onClick={() => onSelectCategory("memory")}
                      >
                        Memory (Flash & EEPROM)
                      </a>
                    </li>
                    <li>
                      <a
                        className="cursor-pointer"
                        onClick={() => onSelectCategory("interface")}
                      >
                        Interface & Communication ICs
                      </a>
                    </li>
                  </ul>
                </li>

                {/* Passive Components */}
                <li>
                  <a className="font-bold text-secondary">Passive Components</a>
                  <ul>
                    <li>
                      <a
                        className="cursor-pointer"
                        onClick={() => onSelectCategory("capacitors")}
                      >
                        Capacitors (MLCC, Electrolytic, Tantalum)
                      </a>
                    </li>
                    <li>
                      <a
                        className="cursor-pointer"
                        onClick={() => onSelectCategory("resistors")}
                      >
                        Resistors & Potentiometers
                      </a>
                    </li>
                    <li>
                      <a
                        className="cursor-pointer"
                        onClick={() =>
                          onSelectCategory("inductors, coils, chokes")
                        }
                      >
                        Inductors, Coils & Chokes
                      </a>
                    </li>
                    <li>
                      <a
                        className="cursor-pointer"
                        onClick={() => onSelectCategory("filters")}
                      >
                        Filters & Ferrite Beads
                      </a>
                    </li>
                  </ul>
                </li>

                {/* Protection & Timing */}
                <li>
                  <a className="font-bold text-secondary">
                    Protection & Timing
                  </a>
                  <ul>
                    <li>
                      <a
                        className="cursor-pointer"
                        onClick={() => onSelectCategory("circuit protection")}
                      >
                        Circuit Protection (ESD, Fuses, TVS)
                      </a>
                    </li>
                    <li>
                      <a
                        className="cursor-pointer"
                        onClick={() =>
                          onSelectCategory("crystals, oscillators, resonators")
                        }
                      >
                        Crystals & Oscillators
                      </a>
                    </li>
                    <li>
                      <a
                        className="cursor-pointer"
                        onClick={() => onSelectCategory("optoisolators")}
                      >
                        Optoisolators & Photocouplers
                      </a>
                    </li>
                    <li>
                      <a
                        className="cursor-pointer"
                        onClick={() => onSelectCategory("rf & wireless")}
                      >
                        RF & Wireless Modules
                      </a>
                    </li>
                  </ul>
                </li>

                {/* Connectors & Switches */}
                <li>
                  <a className="font-bold text-secondary">
                    Connectors & Switches
                  </a>
                  <ul>
                    <li>
                      <a
                        className="cursor-pointer"
                        onClick={() => onSelectCategory("connectors")}
                      >
                        Connectors & Terminal Blocks
                      </a>
                    </li>
                    <li>
                      <a
                        className="cursor-pointer"
                        onClick={() => onSelectCategory("switches")}
                      >
                        Switches & Buttons
                      </a>
                    </li>
                  </ul>
                </li>
              </ul>
            </div>
          </div>

          {/* Tab 2: AI Hardware Diagnostic Assistant */}
          <button popoverTarget="d2" onClick={() => setIsMenuOpen(true)}>
            AI Assistant
          </button>

          <div id="d2" popover="auto">
            {isMenuOpen && (
              <AiAssistantDropdown
                onSelectView={onSelectView}
                onClose={() => {
                  setIsMenuOpen(false);
                  // Closes the native browser popover when a selection is made
                  document.getElementById("d2")?.hidePopover();
                }}
              />
            )}
          </div>
        </div>
      </div>

      {/* Action / User Controls */}
      <div className="navbar-end gap-3">
        {/* Shopping Cart Dropdown */}
        <div className="dropdown dropdown-end">
          <div tabIndex={0} role="button" className="btn btn-ghost btn-circle">
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
          <UserProfile user={user} />
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
  );
};
export default Navbar;
