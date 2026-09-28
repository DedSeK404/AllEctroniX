import React from "react";

export interface NavbarProps {
  onSelectCategory?: (category: string) => void;
  onSelectView: (currentView: "catalog" | "assistant") => void;
  onClose: () => void;
}

const FEATURE_CARDS = [
  {
    title: "📷 Board Visual & Schematic Inspection",
    badge: "Visual AI",
    badgeClass: "badge-outline badge-primary text-[11px] font-semibold",
    description:
      "Upload raw photos of suspect circuit boards or PDF schematics. The vision model analyzes components to spot physical failures.",
    capabilities: [
      "Detect burnt traces, cracked IC packages & blown caps",
      "Automated SMD package identification (0805, QFN, SOIC)",
      "Solder bridge & cold joint visual error flagging",
    ],
    ctaText: "Upload & Inspect Board →",
    fileTypes: "JPG / PNG / PDF",
    borderColor: "hover:border-primary/60",
    shadowColor: "hover:shadow-primary/10",
    iconBg: "bg-primary/10 text-primary",
    textColor: "text-primary",
    bulletColor: "text-primary",
    icon: (
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
    ),
  },
  {
    title: "⚡ Circuit & Power Rail Diagnostics",
    badge: "Interactive Debug",
    badgeClass: "badge-outline badge-secondary text-[11px] font-semibold",
    description:
      "Troubleshoot live electrical faults step-by-step. Feed multimeter, oscilloscope, or logic analyzer readings into the agent.",
    capabilities: [
      "Short circuit & power rail voltage drop detection",
      "Interactive probing steps (where to place leads)",
      "Overheating PMIC & regulator thermal failure analysis",
    ],
    ctaText: "Start Fault Diagnostic →",
    fileTypes: "Multimeter Lead Guide",
    borderColor: "hover:border-secondary/60",
    shadowColor: "hover:shadow-secondary/10",
    iconBg: "bg-secondary/10 text-secondary",
    textColor: "text-secondary",
    bulletColor: "text-secondary",
    icon: (
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
    ),
  },
  {
    title: "🔍 Part Substitutes & Datasheet Matching",
    badge: "Live Stock Sync",
    badgeClass: "badge-outline badge-accent text-[11px] font-semibold",
    description:
      "Cross-reference obsolete or out-of-stock microchips, MOSFETs, and passive components directly against catalog inventory.",
    capabilities: [
      "Pinout-compatible replacement suggestions",
      "Instant pricing, active stock & lead times",
      'Inline "Add to Cart" recommendations during chat',
    ],
    ctaText: "Search Equivalents →",
    fileTypes: "Catalog Integrated",
    borderColor: "hover:border-accent/60",
    shadowColor: "hover:shadow-accent/10",
    iconBg: "bg-accent/10 text-accent",
    textColor: "text-accent",
    bulletColor: "text-accent",
    icon: (
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
    ),
  },
];

export const AiAssistantDropdown: React.FC<NavbarProps> = ({
  onSelectView,
  onClose,
}) => {
  const handlePress = () => {
    onSelectView("assistant");
    onClose();
  };

  return (
    <div className="w-full min-h-[calc(100vh-5rem)] p-6 sm:p-10 flex flex-col justify-between transition-all duration-300 overflow-y-auto">
      <div>
        {/* Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-white/20 mb-8 gap-4">
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
          {FEATURE_CARDS.map((card, idx) => (
            <div
              key={idx}
              onClick={handlePress}
              className={`group relative flex flex-col justify-between p-6 rounded-2xl bg-base-100/70 border border-base-200 ${card.borderColor} hover:bg-base-100 transition-all duration-300 cursor-pointer shadow-md ${card.shadowColor} hover:-translate-y-1.5`}
            >
              <div>
                <div className="flex justify-between items-start mb-4">
                  <div
                    className={`w-12 h-12 rounded-xl ${card.iconBg} flex items-center justify-center group-hover:scale-110 transition-transform`}
                  >
                    {card.icon}
                  </div>
                  <span className={`badge ${card.badgeClass}`}>
                    {card.badge}
                  </span>
                </div>
                <h4
                  className={`font-bold text-lg text-base-content mb-2 group-hover:${card.textColor} transition-colors`}
                >
                  {card.title}
                </h4>
                <p className="text-xs text-base-content/80 leading-relaxed mb-4">
                  {card.description}
                </p>
                <div className="space-y-2 mb-6 border-t border-white/20 pt-4">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-base-content/50 block">
                    Capabilities
                  </span>
                  <ul className="text-xs space-y-1.5 text-base-content/75">
                    {card.capabilities.map((cap, cIdx) => (
                      <li key={cIdx} className="flex items-center gap-2">
                        <span className={card.bulletColor}>✓</span> {cap}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              <div className="pt-4 border-t border-white/20 flex items-center justify-between">
                <span
                  className={`text-xs font-semibold ${card.textColor} group-hover:translate-x-1 transition-transform flex items-center gap-1`}
                >
                  {card.ctaText}
                </span>
                <span className="text-[10px] text-base-content/40 font-mono">
                  {card.fileTypes}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer CTA */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-white/20 mt-auto">
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
          onClick={handlePress}
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
