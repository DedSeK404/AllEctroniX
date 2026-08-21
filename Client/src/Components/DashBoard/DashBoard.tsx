import { useNavigate } from "react-router-dom";
import Papa from 'papaparse';
import { useEffect, useState } from "react";



interface Part {
  code: string;
  brand: string;
  model: string;
  package: string;
  describe: string;
  price: number;
  stock: number;
  category: string;
}


export default function DashBoard() {
const navigate=useNavigate()
const [parts, setParts] = useState<Part[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    Papa.parse<Part>("https://lrks.github.io/jlcpcb-economic-parts/economic-parts.csv", {
      download: true,
      header: true,
      dynamicTyping: true,
      skipEmptyLines: true,
      complete: (results) => {
        setParts(results.data);
        setLoading(false);
      },
      error: (error) => {
        console.error("Failed to parse remote CSV:", error);
        setLoading(false);
      },
    });
  }, []);

  if (loading) return <div>Loading live JLCPCB dataset...</div>;
console.log(parts)
  return (
    <div className="navbar bg-base-100 shadow-sm border-b border-base-200">
      <div>
      <div>
      <h2>Total Parts: {parts.length}</h2>
    </div>
    </div>
      {/* Brand Section */}
      <div className="navbar-start">
        <a 
          onClick={() => navigate("/dashboard")} 
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

          {/* Tab 1: Equipment & Tools */}
          <button popoverTarget="d1">Electronics</button>
          <div id="d1" popover="auto">
            <div className="flex max-sm:flex-col items-start p-2 gap-4">
              <ul className="menu w-full md:menu-horizontal">
                <li>
                  <a className="font-bold text-primary">Test & Diagnostic Equipment</a>
                  <ul>
                    <li><a>Multimeters & Clamp Meters</a></li>
                    <li><a>Oscilloscopes & Logic Analyzers</a></li>
                    <li><a>Bench Power Supplies & LCR Testers</a></li>
                  </ul>
                </li>
                <li>
                  <a className="font-bold text-primary">Prototyping & Development</a>
                  <ul>
                    <li><a>Microcontroller Boards (ESP32, Arduino, STM32)</a></li>
                    <li><a>Breadboards & Prototyping Hardware</a></li>
                  </ul>
                </li>
                <li>
                  <a className="font-bold text-primary">Soldering & Workstation</a>
                  <ul>
                    <li><a>Soldering & Hot Air Stations</a></li>
                    <li><a>ESD Accessories & Inspection Optics</a></li>
                  </ul>
                </li>
              </ul>
              <img
                src="https://img.daisyui.com/images/stock/photo-1559181567-c3190ca9959b.webp"
                className="md:max-w-xs max-md:hidden rounded-lg shadow-sm"
                alt="Electronics Equipment"
              />
            </div>
          </div>

          {/* Tab 2: Components & Semiconductors */}
          <button popoverTarget="d2">Components</button>
          <div id="d2" popover="auto">
            <div className="flex max-sm:flex-col items-start p-2 gap-4">
              <ul className="menu w-full md:menu-horizontal">
                <li>
                  <a className="font-bold text-secondary">Active Semiconductors & ICs</a>
                  <ul>
                    <li><a>Microcontrollers & Processors</a></li>
                    <li><a>Audio & Operational Amplifiers</a></li>
                    <li><a>Timers, Counters & Logic ICs</a></li>
                    <li><a>Voltage Regulators & Power Drivers</a></li>
                    <li><a>Diodes, Transistors & MOSFETs</a></li>
                  </ul>
                </li>
                <li>
                  <a className="font-bold text-secondary">Passive Components & Protection</a>
                  <ul>
                    <li><a>Resistors & Potentiometers</a></li>
                    <li><a>Capacitors (Electrolytic, Ceramic, Tantalum)</a></li>
                    <li><a>Inductors & Power Transformers</a></li>
                    <li><a>Relays, Switches & Push Buttons</a></li>
                  </ul>
                </li>
              </ul>
              <img
                src="https://img.daisyui.com/images/stock/photo-1572635148818-ef6fd45eb394.webp"
                className="md:max-w-xs max-md:hidden rounded-lg shadow-sm"
                alt="Electronic Components"
              />
            </div>
          </div>

          {/* Tab 3: Platform Solutions */}
          <button popoverTarget="d3">Solutions</button>
          <div id="d3" popover="auto">
            <div className="flex max-sm:flex-col items-start p-2 gap-4">
              <ul className="menu w-full md:menu-horizontal">
                <li>
                  <a className="font-bold">Services</a>
                  <ul>
                    <li><a>PCB Prototyping</a></li>
                    <li><a>Component Sourcing</a></li>
                    <li><a>BOM Analysis</a></li>
                  </ul>
                </li>
                <li>
                  <a className="font-bold">Resources</a>
                  <ul>
                    <li><a>Datasheet Hub</a></li>
                    <li><a>Interactive Schematics</a></li>
                    <li><a>Community Forum</a></li>
                  </ul>
                </li>
                <li>
                  <a className="font-bold">Company</a>
                  <ul>
                    <li><a>About Us</a></li>
                    <li><a>Contact Support</a></li>
                    <li><a>Privacy Policy</a></li>
                  </ul>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Auth Actions */}
      <div className="navbar-end gap-2">
        <button className="btn btn-ghost" onClick={() => navigate("/login/signin")}>
          Sign In
        </button>
        <button className="btn btn-primary" onClick={() => navigate("/login/signup")}>
          Sign Up
        </button>
        <button className="btn sm:hidden" popoverTarget="my-megamenu-4">
          Menu
        </button>
      </div>
    </div>
  );
}