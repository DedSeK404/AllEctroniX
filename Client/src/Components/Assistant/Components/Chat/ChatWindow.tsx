import React, { useState, useRef, useEffect } from "react";

interface Message {
  id: string;
  sender: "user" | "bot";
  text: string;
  timestamp: string;
  avatar: string;
}

const ChatWindow = () => {
const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      sender: "bot",
      text: "Hello! How can I assist you with your PCB diagnostics today?",
      timestamp: "10:42 AM",
      avatar: "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp",
    },
    {
      id: "2",
      sender: "user",
      text: "I have a voltage drop on my 5V power rail. Any ideas?",
      timestamp: "10:43 AM",
      avatar: "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp",
    },
    {
      id: "3",
      sender: "bot",
      text: "Check capacitor C402 for shorts or verify if your linear regulator is thermal throttling. You can also test current draw across the input resistor.",
      timestamp: "10:44 AM",
      avatar: "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp",
    },
  ]);

  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      sender: "user",
      text: input,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      avatar: "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp",
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    // Simulate AI Response
    setTimeout(() => {
      const botMsg: Message = {
        id: (Date.now() + 1).toString(),
        sender: "bot",
        text: "I'm analyzing your input. Stand by for schematic references...",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        avatar: "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp",
      };
      setMessages((prev) => [...prev, botMsg]);
      setIsTyping(false);
    }, 1500);
  };

  return (
    <div className="flex flex-col m-6 bg-base-300">
      {/* Top Header */}
      <div className="navbar bg-base-100 border-b border-base-200 px-6 shadow-sm flex-none">
        <div className="flex-1 gap-3">
          <div className="avatar online">
            <div className="w-10 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
              <img src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp" alt="AI Assistant" />
            </div>
          </div>
          <div>
            <h2 className="font-bold text-base">AllEctronix Copilot</h2>
            <p className="text-xs text-base-content/60">Active now</p>
          </div>
        </div>
      </div>

      {/* Main Chat Scrollable Area */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
        {messages.map((msg) => {
          const isUser = msg.sender === "user";
          return (
            <div
              key={msg.id}
              className={`chat ${isUser ? "chat-end" : "chat-start"}`}
            >
              <div className="chat-image avatar">
                <div className="w-10 rounded-full">
                  <img src={msg.avatar} alt="Avatar" />
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
                } shadow-md`}
              >
                {msg.text}
              </div>
              <div className="chat-footer opacity-50 text-[10px] mt-1">
                {msg.timestamp}
              </div>
            </div>
          );
        })}

        {/* Typing Indicator */}
        {isTyping && (
          <div className="chat chat-start">
            <div className="chat-image avatar">
              <div className="w-10 rounded-full">
                <img src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp" alt="Avatar" />
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
            className="input input-bordered flex-1 focus:outline-none focus:border-primary"
          />
          <button type="submit" className="btn btn-primary px-6">
            Send
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatWindow
