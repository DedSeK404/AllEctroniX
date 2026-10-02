// src/features/assistant/AssistantMainPage.tsx
import React, { useState } from "react";
import ChatPage from "../Components/Chat/ChatPage";
import { useAuthStore } from "../../../api/useAuthStore"; // 👈 Ensure correct file path & casing
import { Link } from "react-router-dom";
import { Bot, LogIn } from "lucide-react";

export const AssistantMainPage: React.FC = () => {
  const [initialPrompt, setInitialPrompt] = useState<string>("");
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

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
            className="btn btn-xs btn-outline btn-primary gap-1 whitespace-nowrap"
          >
            📷 Inspect PCB Photo
          </button>
          <button
            onClick={() => handlePresetClick("⚡ Troubleshoot power rail voltage drop")}
            className="btn btn-xs btn-outline btn-secondary gap-1 whitespace-nowrap"
          >
            ⚡ Debug Power Rail
          </button>
          <button
            onClick={() => handlePresetClick("🔍 Find substitute for obsolete IC")}
            className="btn btn-xs btn-outline btn-accent gap-1 whitespace-nowrap"
          >
            🔍 Component Search
          </button>
        </div>
      </div>

      {/* Main Container */}
      <div className="flex-1 bg-base-100 rounded-2xl border border-base-200 shadow-md flex flex-col overflow-hidden min-h-[400px]">
        {isAuthenticated ? (
          <ChatPage />
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-base-100">
            <div className="w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-4 text-primary">
              <Bot className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-bold text-base-content mb-2">
              AllEctronix AI Copilot
            </h2>
            <p className="text-base-content/60 text-sm max-w-md mb-6">
              Please log in to your account to start interactive circuit diagnostics, upload PCB schematics, and view your saved diagnostic history.
            </p>
            <Link
              to="/login/signin"
              className="btn btn-primary gap-2 px-6 rounded-xl shadow-md"
            >
              <LogIn className="w-4 h-4" />
              Log in to start using AI
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default AssistantMainPage;