import { useState } from "react";
import { useAuthStore } from "../../api/useAuthStore";
import { useCartStore } from "@/api/cartService";
import { useNavigate } from "react-router-dom";
import { Cpu, PackageCheck, X } from "lucide-react";

// Types matching Backend CartHistoryResponse schema
interface OrderItemSnapshot {
  part_code: string;
  product_name: string;
  price: number;
  image_url?: string | null;
  quantity: number;
}

interface OrderHistoryItem {
  id: number;
  cart_id: number;
  user_id: number;
  creation_date: string | number;
  items_snapshot?: OrderItemSnapshot[];
}

const UserProfile = () => {
  const user = useAuthStore((state) => state.user);
  const navigate = useNavigate();
  const logout = useAuthStore((state) => state.logout);

  // Order history store actions & state
  const orderHistory = useCartStore(
    (state) => state.orderHistory,
  ) as OrderHistoryItem[];
  const fetchOrderHistory = useCartStore((state) => state.fetchOrderHistory);
  const isLoading = useCartStore((state) => state.isLoading);

  // Modal State
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const handleOpenHistory = async () => {
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
    setIsHistoryOpen(true);
    await fetchOrderHistory();
  };

  // Safe date formatting helper function
  const formatDate = (dateValue: any) => {
    if (!dateValue) return "N/A";

    if (typeof dateValue === "number") {
      const timestamp = dateValue < 10000000000 ? dateValue * 1000 : dateValue;
      return new Date(timestamp).toLocaleDateString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    }

    const parsedDate = new Date(dateValue);
    if (isNaN(parsedDate.getTime())) {
      return "N/A";
    }

    return parsedDate.toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const displayName = user?.username || user?.email?.split("@")[0] || "User";
  const avatarInitial = displayName.charAt(0).toUpperCase();

  return (
    <>
      <div className="navbar-end gap-2">
        <div className="dropdown dropdown-end">
          <div
            tabIndex={0}
            role="button"
            className="relative inline-flex items-center justify-center w-10 h-10 rounded-full cursor-pointer group focus:outline-none"
          >
            <div className="relative w-full h-full rounded-full flex items-center justify-center bg-neutral-900 text-white font-bold border-2 border-[#7E116E] shadow-[0_0_10px_rgba(244,48,152,0.3)] group-hover:shadow-[0_0_18px_rgba(244,48,152,0.6)] group-hover:border-[#F43098] transition-all duration-300">
              {avatarInitial}
            </div>
          </div>

          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content z-50 p-2 shadow-lg bg-neutral-900 rounded-box w-52 mt-5"
          >
            <div className="absolute inset-0 bg-linear-to-r from-purple-600/30 via-indigo-500/20 to-purple-800/30 blur-2xl opacity-60 pointer-events-none -z-10" />
            <li className="px-3 py-2 border-b border-neutral-800 pointer-events-none select-none">
              <span className="font-semibold text-[#F43098] p-0 block">
                {displayName}
              </span>
              <span className="text-xs text-neutral-400 p-0 block">
                {user?.email}
              </span>
            </li>
            <li>
              <a onClick={handleOpenHistory}>Order History</a>
            </li>
            <li>
              <button
                onClick={handleLogout}
                className="text-red-500 hover:text-red-400"
              >
                Logout
              </button>
            </li>
          </ul>
        </div>
      </div>

      {/* Expanded Order History Modal */}
      {isHistoryOpen && (
        <dialog className="modal modal-open">
          {/* Increased size: max-w-3xl */}
          <div className="modal-box max-w-3xl bg-neutral-900 text-neutral-200 border border-neutral-800 relative p-6">
            <div className="absolute inset-0 bg-linear-to-r from-purple-600/20 via-indigo-500/10 to-purple-800/20 blur-2xl opacity-50 pointer-events-none -z-10" />

            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-2">
                <PackageCheck className="w-6 h-6 text-[#F43098]" />
                <h3 className="font-bold text-xl text-[#F43098]">
                  Order History
                </h3>
              </div>
              <button
                className="btn btn-sm btn-circle btn-ghost text-neutral-400 hover:text-white"
                onClick={() => setIsHistoryOpen(false)}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="divider my-1 border-neutral-800" />

            {/* List of Orders with expanded max height */}
            <div className="max-h-120 overflow-y-auto space-y-4 py-2 pr-1">
              {isLoading ? (
                <div className="flex justify-center py-12">
                  <span className="loading loading-spinner loading-lg text-[#F43098]"></span>
                </div>
              ) : orderHistory.length === 0 ? (
                <p className="text-center text-neutral-400 py-12 text-sm">
                  No order history found.
                </p>
              ) : (
                orderHistory.map((order) => {
                  const totalCost =
                    order.items_snapshot?.reduce(
                      (acc, item) => acc + item.price * item.quantity,
                      0,
                    ) || 0;

                  return (
                    <div
                      key={order.id}
                      className="p-5 bg-neutral-800/60 rounded-xl border border-neutral-700/50 space-y-4"
                    >
                      {/* Header Info */}
                      <div className="flex items-center justify-between border-b border-neutral-700/50 pb-3">
                        <div>
                          <p className="font-semibold text-base text-white">
                            Order #{order.id}
                          </p>
                          <p className="text-xs text-neutral-400">
                            {formatDate(order.creation_date)}
                          </p>
                        </div>
                        <div className="text-right">
                          <span className="badge badge-[#7E116E] text-xs font-semibold px-3 py-2">
                            Confirmed
                          </span>
                          <p className="text-sm font-bold text-[#F43098] mt-1">
                            ${totalCost.toFixed(2)}
                          </p>
                        </div>
                      </div>

                      {/* Purchased Items List */}
                      <div className="space-y-2">
                        {order.items_snapshot &&
                        order.items_snapshot.length > 0 ? (
                          order.items_snapshot.map((item, idx) => (
                            <div
                              key={idx}
                              className="flex items-center justify-between bg-neutral-900/50 p-3 rounded-lg border border-neutral-800"
                            >
                              <div className="flex items-center gap-3">
                                {/* Component / Electronics Icon Box */}
                                <div className="w-10 h-10 rounded-lg bg-neutral-800 border border-purple-500/30 flex items-center justify-center text-[#F43098] shadow-inner shrink-0">
                                  <Cpu className="w-5 h-5 text-[#F43098]" />
                                </div>

                                <div>
                                  <p className="text-sm font-medium text-white line-clamp-1">
                                    {item.product_name}
                                  </p>
                                  <p className="text-xs text-neutral-400">
                                    Code:{" "}
                                    <span className="text-neutral-300 font-mono">
                                      {item.part_code}
                                    </span>{" "}
                                    | Qty: {item.quantity} × $
                                    {item.price.toFixed(2)}
                                  </p>
                                </div>
                              </div>
                              <div className="text-right">
                                <p className="text-sm font-semibold text-neutral-200">
                                  ${(item.quantity * item.price).toFixed(2)}
                                </p>
                              </div>
                            </div>
                          ))
                        ) : (
                          <p className="text-xs text-neutral-500 italic">
                            No items recorded for this order.
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            <div className="modal-action">
              <button
                className="btn btn-sm btn-ghost text-neutral-400 hover:text-white"
                onClick={() => setIsHistoryOpen(false)}
              >
                Close
              </button>
            </div>
          </div>

          <form method="dialog" className="modal-backdrop">
            <button onClick={() => setIsHistoryOpen(false)}>close</button>
          </form>
        </dialog>
      )}
    </>
  );
};

export default UserProfile;
