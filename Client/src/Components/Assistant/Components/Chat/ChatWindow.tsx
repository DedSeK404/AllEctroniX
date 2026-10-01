import React, { useState, useRef, useEffect } from "react";
import { useChatStore } from "../../../../api/useChatStore";
import { useAuthStore } from "@/store/useAuthStore";

const ChatWindow = () => {
  const [input, setInput] = useState("");
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Safely extract userId from Auth store
  const userId = useAuthStore((state) => state.user?.id);

  // Extract reactive state and actions from Chat store
  const messages = useChatStore((state) => state.messages);
  const isStreaming = useChatStore((state) => state.isStreaming);
  const isLoading = useChatStore((state) => state.isLoading);
  const sendMessage = useChatStore((state) => state.sendMessage);

  // Initialize and clean up WebSocket connection
  useEffect(() => {
    if (userId) {
      const numericUserId = Number(userId);
      if (!isNaN(numericUserId)) {
        console.log("🚀 Initializing WebSocket for User ID:", numericUserId);
        useChatStore.getState().initWebSocket(numericUserId);
      }
    }

    return () => {
      useChatStore.getState().disconnectWebSocket();
    };
  }, [userId]);

  // Auto-scroll to bottom on new messages or streaming tokens
  const lastMessageContent = messages[messages.length - 1]?.content || "";
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length, lastMessageContent, isStreaming]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isStreaming) return;

    sendMessage(input.trim());
    setInput("");
  };

  return (
    <div className="flex flex-col h-full bg-base-300">
      {/* Top Header */}
      <div className="navbar bg-base-100 border-b border-base-200 px-6 shadow-sm flex-none">
        <div className="flex-1 gap-3">
          <div className="avatar online">
            <div className="w-10 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
              <img
                src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
                alt="AI Assistant"
              />
            </div>
          </div>
          <div>
            <h2 className="font-bold text-base">AllEctronix Copilot</h2>
            <p className="text-xs text-base-content/60">
              {isStreaming ? "Streaming response..." : "Active now"}
            </p>
          </div>
        </div>
      </div>

      {/* Main Chat Scrollable Area */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
        {isLoading && messages.length === 0 ? (
          <div className="flex justify-center items-center h-full">
            <span className="loading loading-spinner loading-lg text-primary"></span>
          </div>
        ) : messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-base-content/50">
            <p className="text-lg font-medium">No messages yet</p>
            <p className="text-sm">
              Start a conversation or ask about a PCB diagnostic!
            </p>
          </div>
        ) : (
          messages.map((msg) => {
            const isUser = msg.sender === "user";
            return (
              <div
                key={msg.id}
                className={`chat ${isUser ? "chat-end" : "chat-start"}`}
              >
                <div className="chat-image avatar">
                  <div className="w-10 rounded-full">
                    <img
                      src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
                      alt="Avatar"
                    />
                  </div>
                </div>
                <div className="chat-header text-xs opacity-50 mb-1">
                  {isUser ? "You" : "Copilot"}
                </div>
                <div
                  className={`chat-bubble ${
                    isUser
                      ? "chat-bubble-primary text-primary-content"
                      : "chat-bubble-neutral text-neutral-content"
                  } shadow-md whitespace-pre-wrap`}
                >
                  {msg.content}
                </div>
                <div className="chat-footer opacity-50 text-[10px] mt-1">
                  {msg.created_at
                    ? new Date(msg.created_at).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })
                    : ""}
                </div>
              </div>
            );
          })
        )}

        {/* Typing / Streaming Indicator */}
        {isStreaming &&
          messages[messages.length - 1]?.sender !== "assistant" && (
            <div className="chat chat-start">
              <div className="chat-image avatar">
                <div className="w-10 rounded-full">
                  <img
                    src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
                    alt="Avatar"
                  />
                </div>
              </div>
              <div className="chat-bubble chat-bubble-neutral flex items-center gap-1 py-3">
                <span className="loading loading-dots loading-xs"></span>
              </div>
            </div>
          )}

        <div ref={chatEndRef} />
      </div>

      {/* Fixed Bottom Input Form */}
      <div className="p-4 bg-base-100 border-t border-base-200 flex-none">
        <form onSubmit={handleSend} className="max-w-5xl mx-auto flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type a message or paste schematic specs..."
            disabled={isStreaming}
            className="input input-bordered flex-1 focus:outline-none focus:border-primary disabled:bg-base-200"
          />
          <button
            type="submit"
            disabled={isStreaming || !input.trim()}
            className="btn btn-primary px-6"
          >
            {isStreaming ? (
              <span className="loading loading-spinner loading-xs"></span>
            ) : (
              "Send"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatWindow;
