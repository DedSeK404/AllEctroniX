// src/features/assistant/AssistantMainPage.tsx
import React, { useState } from "react";


import ChatWindow from "../Components/Chat/ChatWindow";

export const AssistantMainPage: React.FC = () => {
  const [initialPrompt, setInitialPrompt] = useState<string>("");

  const handlePresetClick = (promptText: string) => {
    setInitialPrompt(promptText);
  };

  return (
    <div className="w-full min-h-[calc(100vh-4rem)] bg-base-300/60 flex flex-col p-4 sm:p-6 lg:p-8">
      {/* Top Header / Diagnostic Presets Bar */}
      <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-base-100 p-4 rounded-2xl border border-base-200 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
          </div>
          <div>
            <h1 className="font-bold text-lg text-base-content flex items-center gap-2">
              AllEctronix AI Diagnostic Copilot
              <span className="badge badge-primary badge-xs">v2.4</span>
            </h1>
            <p className="text-xs text-base-content/60">
              Freeform multimodal assistant for circuit board analysis & part substitution
            </p>
          </div>
        </div>

        {/* Quick Diagnostic Shortcut Chips */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0">
          <button
            onClick={() => handlePresetClick("📷 Inspect PCB board photo for damage")}
            className="btn btn-xs btn-outline btn-primary gap-1 whitespace-nowrap pointer-events-none"
          >
            📷 Inspect PCB Photo
          </button>
          <button
            onClick={() => handlePresetClick("⚡ Troubleshoot power rail voltage drop")}
            className="btn btn-xs btn-outline btn-secondary gap-1 whitespace-nowrap pointer-events-none"
          >
            ⚡ Debug Power Rail
          </button>
          <button
            onClick={() => handlePresetClick("🔍 Find substitute for obsolete IC")}
            className="btn btn-xs btn-outline btn-accent gap-1 whitespace-nowrap pointer-events-none"
          >
            🔍 Component Search
          </button>
        </div>
      </div>

      {/* Main Freeform Chat Area */}
      <div className="flex-1 bg-base-100 rounded-2xl border border-base-200 shadow-md flex flex-col overflow-hidden">
        <ChatWindow  />
       
      </div>
    </div>
  );
};

export default AssistantMainPage;