import React, { useState, useRef, useEffect, useLayoutEffect } from "react";
import { useChatStore } from "../../../../api/useChatStore";
import { useAuthStore } from "../../../../api/useAuthStore";

const ChatWindow = () => {
  const [input, setInput] = useState("");
  const chatEndRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Preserve scroll height across pagination loads
  const previousScrollHeightRef = useRef<number>(0);

  // Safely extract userId from Auth store
  const userId = useAuthStore((state) => state.user?.id);

  // Extract reactive state and actions from Chat store
  const messages = useChatStore((state) => state.messages);
  const isStreaming = useChatStore((state) => state.isStreaming);
  const isLoading = useChatStore((state) => state.isLoading);
  const hasMore = useChatStore((state) => state.hasMore);
  const isLoadingMore = useChatStore((state) => state.isLoadingMore);
  const fetchOlderMessages = useChatStore((state) => state.fetchOlderMessages);
  const sendMessage = useChatStore((state) => state.sendMessage);

  // Dynamic height calculation for textarea
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = `${Math.min(textarea.scrollHeight, 140)}px`;
    }
  }, [input]);

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

  // Handle scrolling up to fetch older history
  const handleScroll = () => {
    const container = scrollContainerRef.current;
    if (!container) return;

    if (container.scrollTop <= 50 && hasMore && !isLoadingMore && !isLoading) {
      previousScrollHeightRef.current = container.scrollHeight;
      fetchOlderMessages();
    }
  };

  // Maintain relative scroll position after prepending older messages
  useLayoutEffect(() => {
    const container = scrollContainerRef.current;
    if (container && previousScrollHeightRef.current > 0) {
      const scrollOffset =
        container.scrollHeight - previousScrollHeightRef.current;
      container.scrollTop = scrollOffset;
      previousScrollHeightRef.current = 0;
    }
  }, [messages.length]);

  // Auto-scroll to bottom on new messages / stream updates
  const lastMessageContent = messages[messages.length - 1]?.content || "";
  useEffect(() => {
    if (previousScrollHeightRef.current === 0) {
      chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages.length, lastMessageContent, isStreaming]);

  const handleSend = () => {
    if (!input.trim() || isStreaming) return;

    const textToSend = input.trim();
    setInput("");

    // Reset height and keep focus active without losing cursor
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }

    sendMessage(textToSend);

    requestAnimationFrame(() => {
      textareaRef.current?.focus();
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      console.log("Selected PCB image for diagnostic upload:", file);
      // Attach image handling logic here
    }
  };

  return (
    <div className="flex flex-col h-full bg-base-300 overflow-x-hidden">
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
      <div
        ref={scrollContainerRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto overflow-x-hidden p-4 sm:p-6 space-y-4 min-w-0"
      >
        {isLoadingMore && (
          <div className="flex justify-center py-2">
            <span className="loading loading-spinner loading-md text-primary"></span>
          </div>
        )}

        {isLoading && messages.length === 0 ? (
          <div className="flex justify-center items-center h-full">
            <span className="loading loading-spinner loading-lg text-primary"></span>
          </div>
        ) : messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-base-content/50">
            <p className="text-lg font-medium">No messages yet</p>
            <p className="text-sm">
              Start a conversation or upload a PCB photo for instant diagnostic!
            </p>
          </div>
        ) : (
          messages.map((msg) => {
            const isUser = msg.sender === "user";
            return (
              <div
                key={msg.id}
                className={`chat ${isUser ? "chat-end" : "chat-start"} min-w-0`}
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

                {/* Fixed Bubble Container: break-all forces continuous long text to break */}
                <div
                  className={`chat-bubble ${
                    isUser
                      ? "chat-bubble-primary text-primary-content"
                      : "chat-bubble-neutral text-neutral-content"
                  } shadow-md whitespace-pre-wrap break-all max-w-[85%] sm:max-w-[75%]`}
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

      {/* Dynamic Input Bar Container */}
      <div className="p-4 bg-base-100 border-t border-base-200 flex-none">
        <div className="max-w-4xl mx-auto">
          <div className="relative flex flex-col rounded-2xl bg-base-200 border border-base-300 focus-within:border-primary focus-within:ring-1 focus-within:ring-primary transition-all p-2.5 shadow-inner">
            {/* Top Textarea */}
            <textarea
              ref={textareaRef}
              rows={1}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Describe your PCB issue or upload an image..."
              disabled={isStreaming}
              className="w-full bg-transparent border-0 focus:outline-none focus:ring-0 resize-none max-h-36 overflow-y-auto px-3 py-1.5 text-sm sm:text-base leading-snug break-all"
            />

            {/* Bottom Actions Bar */}
            <div className="flex items-center justify-between pt-2 px-1 border-t border-base-300/40 mt-1">
              {/* Prominent PCB Image Upload Button */}
              <label className="btn btn-xs sm:btn-sm btn-ghost gap-2 rounded-xl text-xs text-base-content/70 hover:text-primary hover:bg-base-300 border border-base-300/60 cursor-pointer transition-all">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.8}
                  stroke="currentColor"
                  className="w-4 h-4 text-primary"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
                  />
                </svg>
                <span className="font-medium">Attach PCB Image</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </label>

              {/* Right Action: Send Arrow Button */}
              <button
                type="button"
                onClick={handleSend}
                disabled={isStreaming || !input.trim()}
                className="btn btn-primary btn-circle btn-sm min-h-0 h-9 w-9 p-0 flex items-center justify-center disabled:bg-base-300 disabled:text-base-content/30 transition-all"
              >
                {isStreaming ? (
                  <span className="loading loading-spinner loading-xs"></span>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="w-4 h-4 translate-x-px"
                  >
                    <path d="M3.478 2.404a.75.75 0 0 0-.926.941l2.432 7.905H13.5a.75.75 0 0 1 0 1.5H4.984l-2.432 7.905a.75.75 0 0 0 .926.94 60.519 60.519 0 0 0 18.445-8.986.75.75 0 0 0 0-1.218A60.517 60.517 0 0 0 3.478 2.404Z" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatWindow;
