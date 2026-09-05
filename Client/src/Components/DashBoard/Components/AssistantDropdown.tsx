import React from "react";

export interface NavbarProps {
  onSelectCategory?: (category: string) => void;
  onSelectView: (currentView: "catalog" | "assistant") => void;
  onClose: () => void;
}

export const AiAssistantDropdown: React.FC<NavbarProps> = ({
  onSelectView,
  onClose,
}) => {
  const handlePress = () => {
    onSelectView("assistant");
    onClose();
  };
  return (
    <div className="w-full min-h-[calc(100vh-5rem)] p-6 sm:p-10 bg-base-300/90 backdrop-blur-xl border-t border-primary/20 shadow-2xl flex flex-col justify-between transition-all duration-300 overflow-y-auto">
      <div>
        {/* Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-base-200/50 mb-8 gap-4">
          <div className="flex items-center gap-3">
            <div className="relative flex h-3.5 w-3.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500"></span>
            </div>
            <div>
              <h3 className="font-extrabold text-2xl text-base-content tracking-wide flex items-center gap-2">
                AllEctronix AI Copilot
                <span className="badge badge-primary badge-sm font-mono uppercase tracking-wider">
                  v2.4 Multimodal
                </span>
              </h3>
              <p className="text-xs text-base-content/60 mt-0.5">
                Automated Schematic, PCB & Electrical Diagnostic Engine
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="badge badge-ghost text-xs">
              Vision Engine Ready
            </span>
            <span className="badge badge-ghost text-xs">
              LCSC Catalog Linked
            </span>
          </div>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Card 1 */}
          <div
            onClick={() => {
              handlePress();
            }}
            className="group relative flex flex-col justify-between p-6 rounded-2xl bg-base-100/70 border border-base-200 hover:border-primary/60 hover:bg-base-100 transition-all duration-300 cursor-pointer shadow-md hover:shadow-primary/10 hover:-translate-y-1.5"
          >
            <div>
              <div className="flex justify-between items-start mb-4">
                <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center group-hover:scale-110 transition-transform">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-7 w-7"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="1.5"
                      d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="1.5"
                      d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                </div>
                <span className="badge badge-outline badge-primary text-[11px] font-semibold">
                  Visual AI
                </span>
              </div>
              <h4 className="font-bold text-lg text-base-content mb-2 group-hover:text-primary transition-colors">
                📷 Board Visual & Schematic Inspection
              </h4>
              <p className="text-xs text-base-content/80 leading-relaxed mb-4">
                Upload raw photos of suspect circuit boards or PDF schematics.
                The vision model analyzes components to spot physical failures.
              </p>
              <div className="space-y-2 mb-6 border-t border-base-200/60 pt-4">
                <span className="text-[11px] font-bold uppercase tracking-wider text-base-content/50 block">
                  Capabilities
                </span>
                <ul className="text-xs space-y-1.5 text-base-content/75">
                  <li className="flex items-center gap-2">
                    <span className="text-primary">✓</span> Detect burnt traces,
                    cracked IC packages & blown caps
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-primary">✓</span> Automated SMD
                    package identification (0805, QFN, SOIC)
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-primary">✓</span> Solder bridge & cold
                    joint visual error flagging
                  </li>
                </ul>
              </div>
            </div>
            <div className="pt-4 border-t border-base-200/50 flex items-center justify-between">
              <span className="text-xs font-semibold text-primary group-hover:translate-x-1 transition-transform flex items-center gap-1">
                Upload & Inspect Board →
              </span>
              <span className="text-[10px] text-base-content/40 font-mono">
                JPG / PNG / PDF
              </span>
            </div>
          </div>

          {/* Card 2 */}
          <div
            onClick={() => {
              handlePress();
            }}
            className="group relative flex flex-col justify-between p-6 rounded-2xl bg-base-100/70 border border-base-200 hover:border-secondary/60 hover:bg-base-100 transition-all duration-300 cursor-pointer shadow-md hover:shadow-secondary/10 hover:-translate-y-1.5"
          >
            <div>
              <div className="flex justify-between items-start mb-4">
                <div className="w-12 h-12 rounded-xl bg-secondary/10 text-secondary flex items-center justify-center group-hover:scale-110 transition-transform">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-7 w-7"
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
                <span className="badge badge-outline badge-secondary text-[11px] font-semibold">
                  Interactive Debug
                </span>
              </div>
              <h4 className="font-bold text-lg text-base-content mb-2 group-hover:text-secondary transition-colors">
                ⚡ Circuit & Power Rail Diagnostics
              </h4>
              <p className="text-xs text-base-content/80 leading-relaxed mb-4">
                Troubleshoot live electrical faults step-by-step. Feed
                multimeter, oscilloscope, or logic analyzer readings into the
                agent.
              </p>
              <div className="space-y-2 mb-6 border-t border-base-200/60 pt-4">
                <span className="text-[11px] font-bold uppercase tracking-wider text-base-content/50 block">
                  Capabilities
                </span>
                <ul className="text-xs space-y-1.5 text-base-content/75">
                  <li className="flex items-center gap-2">
                    <span className="text-secondary">✓</span> Short circuit &
                    power rail voltage drop detection
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-secondary">✓</span> Interactive
                    probing steps (where to place leads)
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-secondary">✓</span> Overheating PMIC &
                    regulator thermal failure analysis
                  </li>
                </ul>
              </div>
            </div>
            <div className="pt-4 border-t border-base-200/50 flex items-center justify-between">
              <span className="text-xs font-semibold text-secondary group-hover:translate-x-1 transition-transform flex items-center gap-1">
                Start Fault Diagnostic →
              </span>
              <span className="text-[10px] text-base-content/40 font-mono">
                Multimeter Lead Guide
              </span>
            </div>
          </div>

          {/* Card 3 */}
          <div
            onClick={() => {
              handlePress();
            }}
            className="group relative flex flex-col justify-between p-6 rounded-2xl bg-base-100/70 border border-base-200 hover:border-accent/60 hover:bg-base-100 transition-all duration-300 cursor-pointer shadow-md hover:shadow-accent/10 hover:-translate-y-1.5"
          >
            <div>
              <div className="flex justify-between items-start mb-4">
                <div className="w-12 h-12 rounded-xl bg-accent/10 text-accent flex items-center justify-center group-hover:scale-110 transition-transform">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-7 w-7"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="1.5"
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </div>
                <span className="badge badge-outline badge-accent text-[11px] font-semibold">
                  Live Stock Sync
                </span>
              </div>
              <h4 className="font-bold text-lg text-base-content mb-2 group-hover:text-accent transition-colors">
                🔍 Part Substitutes & Datasheet Matching
              </h4>
              <p className="text-xs text-base-content/80 leading-relaxed mb-4">
                Cross-reference obsolete or out-of-stock microchips, MOSFETs,
                and passive components directly against catalog inventory.
              </p>
              <div className="space-y-2 mb-6 border-t border-base-200/60 pt-4">
                <span className="text-[11px] font-bold uppercase tracking-wider text-base-content/50 block">
                  Capabilities
                </span>
                <ul className="text-xs space-y-1.5 text-base-content/75">
                  <li className="flex items-center gap-2">
                    <span className="text-accent">✓</span> Pinout-compatible
                    replacement suggestions
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-accent">✓</span> Instant pricing,
                    active stock & lead times
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-accent">✓</span> Inline "Add to Cart"
                    recommendations during chat
                  </li>
                </ul>
              </div>
            </div>
            <div className="pt-4 border-t border-base-200/50 flex items-center justify-between">
              <span className="text-xs font-semibold text-accent group-hover:translate-x-1 transition-transform flex items-center gap-1">
                Search Equivalents →
              </span>
              <span className="text-[10px] text-base-content/40 font-mono">
                Catalog Integrated
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Footer CTA */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-base-200/50 mt-auto">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10 text-primary hidden sm:block">
            💡
          </div>
          <p className="text-xs text-base-content/70 max-w-xl">
            <strong className="text-base-content">Pro Tip:</strong> You can drop
            circuit schematics, paste raw pinouts, or type voltage logs directly
            into the prompt box to start a live session immediately.
          </p>
        </div>
        <button
          onClick={() => {
            handlePress();
          }}
          className="btn btn-primary btn-lg w-full sm:w-auto shadow-xl shadow-primary/20 hover:shadow-primary/40 gap-3 text-sm font-bold uppercase tracking-wider"
        >
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
              d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
            />
          </svg>
          Launch Live Chat
        </button>
      </div>
    </div>
  );
};

export default AiAssistantDropdown;
