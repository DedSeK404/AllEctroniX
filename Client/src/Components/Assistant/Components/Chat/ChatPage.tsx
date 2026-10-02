import React, { useEffect } from "react";
import { useChatStore } from "@/api/useChatStore";
import { useAuthStore } from "../../../../api/useAuthStore";
import ChatWindow from "./ChatWindow";

const ChatPage = () => {
  const userId = useAuthStore((state) => state.user?.id);

  // Store state and actions
  const conversations = useChatStore((state) => state.conversations);
  const activeConversationId = useChatStore((state) => state.activeConversationId);
  const messages = useChatStore((state) => state.messages);
  const fetchConversations = useChatStore((state) => state.fetchConversations);
  const selectConversation = useChatStore((state) => state.selectConversation);
  const startNewChat = useChatStore((state) => state.startNewChat);
  const deleteConversation = useChatStore((state) => state.deleteConversation);

  // Disable button if we are already on a new chat with no active messages
  const isCleanSlate = activeConversationId === null && messages.length === 0;

  useEffect(() => {
    if (userId) {
      fetchConversations();
    }
  }, [userId, fetchConversations]);

  const handleDelete = (e: React.MouseEvent, conversationId: string) => {
    e.stopPropagation();
    if (confirm("Are you sure you want to delete this conversation?")) {
      deleteConversation(conversationId);
    }
  };

  return (
    <div className="relative min-h-screen w-full flex h-screen overflow-hidden bg-[#0a0814] bg-[radial-gradient(#9073E9_1px,transparent_1px)] bg-size-[24px_24px] bg-center">
      {/* Center Ambient Glow Overlay */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(177,0,214,0.22)_0%,#0a0814_80%)]" />

      {/* Main Container Frame with Subtle Border Accent */}
      <div className="relative z-10 flex w-full h-full bg-[#13111c]/90 backdrop-blur-xl">
        {/* Sidebar */}
        <aside className="w-80 border-r border-[#B100D6]/30 bg-linear-to-b from-[#181528]/90 to-[#0f0c1b]/95 flex flex-col flex-none relative overflow-hidden">
          {/* Corner Decorative Glow */}
          <div className="pointer-events-none absolute -top-12 -left-12 w-48 h-48 bg-[#B100D6]/20 blur-2xl rounded-full" />

          {/* Top Header & New Chat Action */}
          <div className="p-4 border-b border-[#B100D6]/20 flex items-center justify-between gap-2 z-10">
            <h1 className="font-bold text-lg text-white">Conversations</h1>
            <button
              onClick={startNewChat}
              disabled={isCleanSlate}
              className="btn btn-primary btn-sm gap-2 bg-[#B100D6] hover:bg-[#9073E9] border-none text-white disabled:bg-white/10 disabled:text-white/40"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
              New Chat
            </button>
          </div>

          {/* Conversation List */}
          <div className="flex-1 overflow-y-auto p-2 space-y-1 z-10">
            {conversations.length === 0 ? (
              <div className="text-center py-8 text-xs text-white/50">
                No conversations found.
              </div>
            ) : (
              conversations.map((conv) => {
                const isActive = activeConversationId === conv.id;

                return (
                  <div
                    key={conv.id}
                    onClick={() => selectConversation(conv.id)}
                    className={`group relative flex items-center justify-between p-3 rounded-lg cursor-pointer transition-all ${
                      isActive
                        ? "bg-[#B100D6]/30 border border-[#B100D6]/50 text-white shadow-[0_0_15px_rgba(177,0,214,0.3)]"
                        : "hover:bg-white/5 border border-transparent text-white/80 hover:text-white"
                    }`}
                  >
                    <div className="flex-1 min-w-0 pr-2">
                      <p className="font-medium text-sm truncate">
                        {conv.title || "New Conversation"}
                      </p>
                      {conv.updated_at && (
                        <p
                          className={`text-[10px] ${
                            isActive ? "text-white/70" : "text-white/40"
                          }`}
                        >
                          {new Date(conv.updated_at).toLocaleDateString()}
                        </p>
                      )}
                    </div>

                    <div className="dropdown dropdown-end">
                      <button
                        tabIndex={0}
                        onClick={(e) => e.stopPropagation()}
                        className={`btn btn-ghost btn-xs btn-square ${
                          isActive
                            ? "text-white hover:bg-[#B100D6]/40"
                            : "text-white/60 hover:bg-white/10"
                        }`}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
                          />
                        </svg>
                      </button>
                      <ul
                        tabIndex={0}
                        className="dropdown-content menu p-2 shadow-2xl bg-[#181528] border border-[#B100D6]/30 text-white rounded-xl w-36 z-[10]"
                      >
                        <li>
                          <button
                            onClick={(e) => handleDelete(e, conv.id)}
                            className="text-error hover:bg-error/10 flex items-center gap-2"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-4 w-4"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                              />
                            </svg>
                            Delete
                          </button>
                        </li>
                      </ul>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </aside>

        {/* RIGHT CHAT CONTAINER */}
        <main className="flex-1 h-full overflow-hidden bg-[#13111c]/50 relative">
          <div
            className="pointer-events-none absolute h-96 w-full max-w-4xl rounded-full bg-linear-to-r from-purple-600/10 via-indigo-500/10 to-purple-800/10 blur-3xl opacity-80 animate-pulse"
            aria-hidden="true"
          />
          <div className="relative z-10 h-full">
            <ChatWindow />
          </div>
        </main>
      </div>
    </div>
  );
};

export default ChatPage;