import { useState } from "react";
import AiAssistantDropdown from "../AssistantDropdown";

interface NavbarProps {
  onSelectCategory: (category: string) => void;
  onSelectView: (currentView: "catalog" | "assistant") => void;
}

const NavBarMegaMenu = ({ onSelectCategory, onSelectView }: NavbarProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"catalog" | "assistant">(
    "catalog",
  );

  return (
    <div className="navbar-center flex items-center">
      {/* Container Island */}
      <div className="bg-base-200/90 shadow-[0_0_20px_rgba(168,85,247,0.15)] rounded-2xl p-1.5 flex items-center gap-2 backdrop-blur-md relative">
        <div
          className="megamenu max-sm:megamenu-vertical megamenu-full flex items-center gap-2"
          id="my-megamenu-4"
          popover="auto"
        >
          <span className="megamenu-active"></span>

          {/* Tab 1: Live Components Catalog */}
          <button
            popoverTarget="d1"
            className={`flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-medium transition-all duration-200 cursor-pointer ${
              activeTab === "catalog"
                ? "bg-secondary text-secondary-content shadow-[0_0_15px_rgba(168,85,247,0.4)] font-semibold"
                : "text-base-content/80 hover:text-secondary hover:bg-secondary/10"
            }`}
            onClick={() => {
              setActiveTab("catalog");
              onSelectView("catalog");
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
            Components Catalog
          </button>

          <div
            id="d1"
            popover="auto"
            className="dropdown-content mt-5 p-6 shadow-2xl rounded-2xl text-base-content w-[92vw] max-w-7xl h-auto"
          >
            {/* Background Glow Layer (Isolated) */}
            <div className="absolute inset-0 bg-linear-to-r from-purple-600/30 via-indigo-500/20 to-purple-800/30 blur-2xl opacity-60 pointer-events-none -z-10" />

            <div className="relative z-10 grid grid-cols-1 md:grid-cols-4 gap-6 items-start p-2">
              <ul className="menu w-full md:menu-horizontal grid grid-cols-1 md:grid-cols-4 gap-6 col-span-4 p-0">
                {/* Active Semiconductors */}
                <li className="flex flex-col gap-2 p-0">
                  <span className="text-xs font-bold uppercase tracking-wider text-secondary px-3 py-1 bg-secondary/10 rounded-lg w-fit cursor-default pointer-events-none select-none">
                    Active Semiconductors
                  </span>
                  <ul className="flex flex-col gap-1 mt-1 p-0">
                    <li>
                      <a
                        className="px-3 py-2 rounded-lg text-sm hover:bg-secondary/20 hover:text-secondary cursor-pointer transition-colors block"
                        onClick={() =>
                          onSelectCategory("embedded processors & controllers")
                        }
                      >
                        Microcontrollers & Processors
                      </a>
                    </li>
                    <li>
                      <a
                        className="px-3 py-2 rounded-lg text-sm hover:bg-secondary/20 hover:text-secondary cursor-pointer transition-colors block"
                        onClick={() =>
                          onSelectCategory("power management (pmic)")
                        }
                      >
                        Power Management ICs (PMIC)
                      </a>
                    </li>
                    <li>
                      <a
                        className="px-3 py-2 rounded-lg text-sm hover:bg-secondary/20 hover:text-secondary cursor-pointer transition-colors block"
                        onClick={() => onSelectCategory("MOSFETs")}
                      >
                        MOSFETs & Transistors
                      </a>
                    </li>
                    <li>
                      <a
                        className="px-3 py-2 rounded-lg text-sm hover:bg-secondary/20 hover:text-secondary cursor-pointer transition-colors block"
                        onClick={() => onSelectCategory("diodes")}
                      >
                        Diodes & Rectifiers
                      </a>
                    </li>
                    <li>
                      <a
                        className="px-3 py-2 rounded-lg text-sm hover:bg-secondary/20 hover:text-secondary cursor-pointer transition-colors block"
                        onClick={() => onSelectCategory("memory")}
                      >
                        Memory (Flash & EEPROM)
                      </a>
                    </li>
                    <li>
                      <a
                        className="px-3 py-2 rounded-lg text-sm hover:bg-secondary/20 hover:text-secondary cursor-pointer transition-colors block"
                        onClick={() => onSelectCategory("interface")}
                      >
                        Interface & Communication ICs
                      </a>
                    </li>
                  </ul>
                </li>

                {/* Passive Components */}
                <li className="flex flex-col gap-2 p-0">
                  <span className="text-xs font-bold uppercase tracking-wider text-secondary px-3 py-1 bg-secondary/10 rounded-lg w-fit cursor-default pointer-events-none select-none">
                    Passive Components
                  </span>
                  <ul className="flex flex-col gap-1 mt-1 p-0">
                    <li>
                      <a
                        className="px-3 py-2 rounded-lg text-sm hover:bg-secondary/20 hover:text-secondary cursor-pointer transition-colors block"
                        onClick={() => onSelectCategory("capacitors")}
                      >
                        Capacitors (MLCC, Electrolytic, Tantalum)
                      </a>
                    </li>
                    <li>
                      <a
                        className="px-3 py-2 rounded-lg text-sm hover:bg-secondary/20 hover:text-secondary cursor-pointer transition-colors block"
                        onClick={() => onSelectCategory("resistors")}
                      >
                        Resistors & Potentiometers
                      </a>
                    </li>
                    <li>
                      <a
                        className="px-3 py-2 rounded-lg text-sm hover:bg-secondary/20 hover:text-secondary cursor-pointer transition-colors block"
                        onClick={() =>
                          onSelectCategory("inductors, coils, chokes")
                        }
                      >
                        Inductors, Coils & Chokes
                      </a>
                    </li>
                    <li>
                      <a
                        className="px-3 py-2 rounded-lg text-sm hover:bg-secondary/20 hover:text-secondary cursor-pointer transition-colors block"
                        onClick={() => onSelectCategory("filters")}
                      >
                        Filters & Ferrite Beads
                      </a>
                    </li>
                  </ul>
                </li>

                {/* Protection & Timing */}
                <li className="flex flex-col gap-2 p-0">
                  <span className="text-xs font-bold uppercase tracking-wider text-secondary px-3 py-1 bg-secondary/10 rounded-lg w-fit cursor-default pointer-events-none select-none">
                    Protection & Timing
                  </span>
                  <ul className="flex flex-col gap-1 mt-1 p-0">
                    <li>
                      <a
                        className="px-3 py-2 rounded-lg text-sm hover:bg-secondary/20 hover:text-secondary cursor-pointer transition-colors block"
                        onClick={() => onSelectCategory("circuit protection")}
                      >
                        Circuit Protection (ESD, Fuses, TVS)
                      </a>
                    </li>
                    <li>
                      <a
                        className="px-3 py-2 rounded-lg text-sm hover:bg-secondary/20 hover:text-secondary cursor-pointer transition-colors block"
                        onClick={() =>
                          onSelectCategory("crystals, oscillators, resonators")
                        }
                      >
                        Crystals & Oscillators
                      </a>
                    </li>
                    <li>
                      <a
                        className="px-3 py-2 rounded-lg text-sm hover:bg-secondary/20 hover:text-secondary cursor-pointer transition-colors block"
                        onClick={() => onSelectCategory("optoisolators")}
                      >
                        Optoisolators & Photocouplers
                      </a>
                    </li>
                    <li>
                      <a
                        className="px-3 py-2 rounded-lg text-sm hover:bg-secondary/20 hover:text-secondary cursor-pointer transition-colors block"
                        onClick={() => onSelectCategory("rf & wireless")}
                      >
                        RF & Wireless Modules
                      </a>
                    </li>
                  </ul>
                </li>

                {/* Connectors & Switches */}
                <li className="flex flex-col gap-2 p-0">
                  <span className="text-xs font-bold uppercase tracking-wider text-secondary px-3 py-1 bg-secondary/10 rounded-lg w-fit cursor-default pointer-events-none select-none">
                    Connectors & Switches
                  </span>
                  <ul className="flex flex-col gap-1 mt-1 p-0">
                    <li>
                      <a
                        className="px-3 py-2 rounded-lg text-sm hover:bg-secondary/20 hover:text-secondary cursor-pointer transition-colors block"
                        onClick={() => onSelectCategory("connectors")}
                      >
                        Connectors & Terminal Blocks
                      </a>
                    </li>
                    <li>
                      <a
                        className="px-3 py-2 rounded-lg text-sm hover:bg-secondary/20 hover:text-secondary cursor-pointer transition-colors block"
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
          <button
            popoverTarget="d2"
            className={`flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-medium transition-all duration-200 cursor-pointer ${
              activeTab === "assistant"
                ? "bg-secondary text-secondary-content shadow-[0_0_15px_rgba(168,85,247,0.4)] font-semibold"
                : "text-base-content/80 hover:text-secondary hover:bg-secondary/10"
            }`}
            onClick={() => {
              setActiveTab("assistant");
              setIsMenuOpen(true);
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M13 10V3L4 14h7v7l9-11h-7z"
              />
            </svg>
            AI Assistant
          </button>

          <div
            id="d2"
            popover="auto"
            className="dropdown-content shadow-2xl rounded-2xl w-[92vw] max-w-7xl h-auto mt-5"
          >
            {/* Background Glow Layer (Isolated) */}
            <div className="absolute inset-0 bg-linear-to-r from-purple-600/30 via-indigo-500/20 to-purple-800/30 blur-2xl opacity-60 pointer-events-none -z-10" />

            <div className="relative z-10">
              {isMenuOpen && (
                <AiAssistantDropdown
                  onSelectView={onSelectView}
                  onClose={() => {
                    setIsMenuOpen(false);
                    document.getElementById("d2")?.hidePopover();
                  }}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NavBarMegaMenu;
