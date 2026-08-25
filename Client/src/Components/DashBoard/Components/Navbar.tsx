import { Part } from "@/Types/types";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../../store/useAuthStore";

interface NavbarProps {
  parts: Part[];
  onSelectCategory: (category: string) => void;
}

const Navbar = ({ parts, onSelectCategory }: NavbarProps) => {
  const navigate = useNavigate();

  const user = useAuthStore((state) => state.user);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const logout = useAuthStore((state) => state.logout);

  const handleLogout = () => {
    logout();
    navigate("/dashboard");
  };

  return (
    <div className="navbar bg-base-100 shadow-sm border-b border-base-200">
      {/* Total Count Badge */}
      <div>
        <h2 className="text-sm font-semibold text-gray-600">
          Total Parts: {parts.length}
        </h2>
      </div>

      {/* Brand Section */}
      <div className="navbar-start">
        <a
          onClick={() => {
            onSelectCategory(""); // Clear filter to show all
            navigate("/dashboard");
          }}
          className="btn btn-ghost text-xl font-bold text-[#B100D6] cursor-pointer"
        >
          AllEctronix
        </a>
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
          <button popoverTarget="d1">Components Catalog</button>
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
          <button popoverTarget="d2">AI Assistant</button>
          <div id="d2" popover="auto">
            <div className="flex max-sm:flex-col items-start p-4 gap-4">
              <div className="max-w-md">
                <h3 className="font-bold text-lg text-primary mb-1">
                  Hardware Diagnostic Helper
                </h3>
                <p className="text-xs text-gray-500 mb-3">
                  Describe circuit symptoms or paste schematics/logs to get
                  automated fault detection and component replacement matches.
                </p>
                <button
                  className="btn btn-sm btn-primary"
                  onClick={() => navigate("/assistant")}
                >
                  Launch LLM Helper
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Auth Actions */}
      <div className="navbar-end gap-2">
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
    </div>
  );
};

export default Navbar;
