import React, { useState, useRef, useEffect, useLayoutEffect } from "react";
import { useChatStore } from "../../../../api/useChatStore";
import { useAuthStore } from "../../../../api/useAuthStore";
import ProductCard from "../../../DashBoard/Components/Products/ProductCard"; // Adjust relative import path as needed
import { Part } from "@/Types/types";

const ChatWindow = () => {
  const user = useAuthStore((state) => state.user);

  const [input, setInput] = useState("");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const chatEndRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const previousScrollHeightRef = useRef<number>(0);

  const userId = useAuthStore((state) => state.user?.id);

  const messages = useChatStore((state) => state.messages);
  const isStreaming = useChatStore((state) => state.isStreaming);
  const isLoading = useChatStore((state) => state.isLoading);
  const hasMore = useChatStore((state) => state.hasMore);
  const isLoadingMore = useChatStore((state) => state.isLoadingMore);
  const fetchOlderMessages = useChatStore((state) => state.fetchOlderMessages);
  const sendMessage = useChatStore((state) => state.sendMessage);

  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = `${Math.min(textarea.scrollHeight, 140)}px`;
    }
  }, [input]);

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

  const handleScroll = () => {
    const container = scrollContainerRef.current;
    if (!container) return;

    if (container.scrollTop <= 50 && hasMore && !isLoadingMore && !isLoading) {
      previousScrollHeightRef.current = container.scrollHeight;
      fetchOlderMessages();
    }
  };

  useLayoutEffect(() => {
    const container = scrollContainerRef.current;
    if (container && previousScrollHeightRef.current > 0) {
      const scrollOffset =
        container.scrollHeight - previousScrollHeightRef.current;
      container.scrollTop = scrollOffset;
      previousScrollHeightRef.current = 0;
    }
  }, [messages.length]);

  const lastMessageContent = messages[messages.length - 1]?.content || "";
  useEffect(() => {
    if (previousScrollHeightRef.current === 0) {
      chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages.length, lastMessageContent, isStreaming]);

  const handleSend = () => {
    if ((!input.trim() && !selectedImage) || isStreaming) return;

    const textToSend = input.trim();
    const imageToSend = selectedImage || undefined;

    setInput("");
    setSelectedImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }

    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }

    sendMessage(textToSend, imageToSend);

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
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setSelectedImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const displayName = user?.username || user?.email?.split("@")[0] || "User";
  const avatarInitial = displayName.charAt(0).toUpperCase();

  // Helper function to extract and normalize products to match ProductCard's expected Part structure
  const extractProducts = (msg: any): Part[] => {
    if (!msg.metadata) return [];

    let rawMeta = msg.metadata;
    if (typeof rawMeta === "string") {
      try {
        rawMeta = JSON.parse(rawMeta);
      } catch (e) {
        return [];
      }
    }

    const rawList = rawMeta?.matched_products || rawMeta?.products || [];

    return rawList.map((item: any) => {
      // Extract price safely as a number
      const priceVal =
        typeof item.price === "number"
          ? item.price
          : parseFloat(String(item.price).replace(/[^0-9.]/g, "")) || 0;

      // Normalize stock count
      const stockVal =
        typeof item.stock === "number"
          ? item.stock
          : item.in_stock
          ? 10
          : 0;

      return {
        code: item.code || item.part_number || item.id || "N/A",
        brand: item.brand || "Generic",
        category: item.category || "General",
        type: item.type || item.category || "Component",
        package: item.package || item.pkg || "SMD",
        describe: item.describe || item.description || item.name || "No description available",
        price: priceVal,
        stock: stockVal,
        file: item.file || item.datasheet || "",
        // Preserve any additional fields that Part might carry
        ...item,
      } as Part;
    });
  };

  return (
    <div className="relative flex flex-col h-full bg-base-300 overflow-hidden">
      {/* Background Ambient Glows */}
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
        <div
          className="absolute -top-32 -left-32 w-120 h-120 rounded-full bg-linear-to-br from-purple-600/45 via-indigo-600/35 to-transparent blur-3xl opacity-100 animate-pulse"
          style={{ animationDuration: "7s" }}
          aria-hidden="true"
        />
        <div
          className="absolute -bottom-32 -right-32 w-120 h-120 rounded-full bg-linear-to-tl from-purple-700/50 via-indigo-700/35 to-transparent blur-3xl opacity-100 animate-pulse"
          style={{ animationDuration: "10s" }}
          aria-hidden="true"
        />
      </div>

      {/* Top Header */}
      <div className="navbar bg-base-100/70 backdrop-blur-md border-b border-purple-900/30 px-6 shadow-sm flex-none z-10">
        <div className="flex-1 gap-3">
          <div className="avatar online">
            <div className="w-10 rounded-full ring ring-purple-600 ring-offset-base-100 ring-offset-2">
              <img
                src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
                alt="AI Assistant"
              />
            </div>
          </div>
          <div>
            <h2 className="font-bold text-base text-base-content">
              AllEctronix Copilot
            </h2>
            <p className="text-xs text-purple-400">
              {isStreaming ? "Streaming response..." : "Active now"}
            </p>
          </div>
        </div>
      </div>

      {/* Scrollable Messages Area */}
      <div
        ref={scrollContainerRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto overflow-x-hidden p-4 sm:p-6 space-y-4 min-w-0 z-10"
      >
        {isLoadingMore && (
          <div className="flex justify-center py-2">
            <span className="loading loading-spinner loading-md text-purple-500"></span>
          </div>
        )}

        {isLoading && messages.length === 0 ? (
          <div className="flex justify-center items-center h-full">
            <span className="loading loading-spinner loading-lg text-purple-500"></span>
          </div>
        ) : messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-base-content/60">
            <p className="text-lg font-medium">No messages yet</p>
            <p className="text-sm text-center">
              Start a conversation or upload a PCB photo for instant diagnostic!
            </p>
          </div>
        ) : (
          messages.map((msg) => {
            const isUser = msg.sender === "user";
            const products = extractProducts(msg);

            return (
              <div
                key={msg.id}
                className={`chat ${isUser ? "chat-end" : "chat-start"} min-w-0`}
              >
                <div className="chat-image avatar">
                  <div className="w-10 rounded-full">
                    {msg.sender === "user" ? (
                      <div
                        tabIndex={0}
                        role="button"
                        className="relative inline-flex items-center justify-center w-10 h-10 rounded-full group focus:outline-none"
                      >
                        <div className="relative w-full h-full rounded-full flex items-center justify-center bg-neutral-900 text-white font-bold border-2 border-[#7E116E] shadow-[0_0_10px_rgba(244,48,152,0.3)]">
                          {avatarInitial}
                        </div>
                      </div>
                    ) : (
                      <img
                        src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
                        alt="AI Assistant"
                      />
                    )}
                  </div>
                </div>
                <div className="chat-header text-xs opacity-60 mb-1">
                  {isUser ? "You" : "Copilot"}
                </div>

                <div
                  className={`chat-bubble shadow-lg whitespace-pre-wrap break-all max-w-[85%] sm:max-w-[75%] ${
                    isUser
                      ? "bg-linear-to-r from-purple-700 to-indigo-600 text-white shadow-purple-900/30"
                      : "bg-black text-white border border-purple-900/30 shadow-black/50"
                  }`}
                >
                  {/* Image attachment inside message */}
                  {(msg.image_url || msg.image_base64) && (
                    <img
                      src={msg.image_url || msg.image_base64}
                      alt="Attached PCB"
                      className="rounded-lg max-h-60 w-auto object-cover mb-2 border border-purple-500/30"
                    />
                  )}
                  {msg.content}

                  {/* Render Product Cards Grid when inventory matches exist */}
                  {!isUser && products.length > 0 && (
                    <div className="w-full mt-4 pt-3 border-t border-purple-900/40 not-prose">
                      <p className="text-xs font-semibold text-purple-300 mb-2">
                        Matching Store Inventory:
                      </p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {products.map((product, idx) => (
                          <div key={product.code || idx} className="w-full text-left">
                            <ProductCard part={product} />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
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
              <div className="chat-bubble bg-black text-white border border-purple-900/30 flex items-center gap-1 py-3">
                <span className="loading loading-dots loading-xs text-purple-400"></span>
              </div>
            </div>
          )}

        <div ref={chatEndRef} />
      </div>

      {/* Input Bar */}
      <div className="p-4 bg-base-100/60 backdrop-blur-lg border-t border-purple-900/30 flex-none z-10">
        <div className="max-w-4xl mx-auto">
          <div className="relative flex flex-col rounded-2xl bg-base-100/90 border border-purple-500/40 focus-within:border-purple-400 focus-within:ring-2 focus-within:ring-purple-500/30 shadow-[0_0_20px_rgba(147,51,234,0.15)] focus-within:shadow-[0_0_25px_rgba(147,51,234,0.3)] transition-all duration-300 p-3">
            
            {/* Selected Image Preview */}
            {selectedImage && (
              <div className="relative mb-2 inline-block w-fit">
                <img
                  src={selectedImage}
                  alt="PCB Preview"
                  className="w-20 h-20 object-cover rounded-lg border border-purple-500/50"
                />
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full p-1 hover:bg-red-700 transition-colors shadow-md"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-3.5 h-3.5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </div>
            )}

            {/* Textarea */}
            <textarea
              ref={textareaRef}
              rows={1}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Describe your PCB issue or upload an image..."
              disabled={isStreaming}
              className="w-full bg-transparent border-0 focus:outline-none focus:ring-0 resize-none max-h-36 overflow-y-auto px-3 py-1.5 text-sm sm:text-base leading-snug break-all text-base-content placeholder:text-white/60"
            />

            {/* Bottom Actions Bar */}
            <div className="flex items-center justify-between pt-2.5 px-1 border-t border-purple-500/20 mt-1">
              {/* Attach PCB Image Button */}
              <label className="btn btn-xs sm:btn-sm btn-ghost gap-2 rounded-xl text-xs text-purple-300 hover:text-white hover:bg-purple-600/30 border border-purple-500/30 cursor-pointer transition-all shadow-xs">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.8}
                  stroke="currentColor"
                  className="w-4 h-4 text-purple-400"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
                  />
                </svg>
                <span className="font-medium">Attach PCB Image</span>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </label>

              {/* Send Button */}
              <button
                type="button"
                onClick={handleSend}
                disabled={isStreaming || (!input.trim() && !selectedImage)}
                className="btn btn-circle btn-sm min-h-0 h-9 w-9 p-0 flex items-center justify-center bg-linear-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white border-0 disabled:bg-base-300 disabled:text-base-content/30 shadow-[0_0_12px_rgba(147,51,234,0.4)] hover:shadow-[0_0_18px_rgba(147,51,234,0.6)] transition-all duration-200"
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