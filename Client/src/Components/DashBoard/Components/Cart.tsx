import { useNavigate } from "react-router-dom";
import {
  CartItem,
  useFrontendCartStore,
} from "@/Components/DashBoard/Components/useCartStore";

const Cart = () => {
  const navigate = useNavigate();

  // Extract items and action methods from Zustand
  const items = useFrontendCartStore((state) => state.items);
  const updateQuantity = useFrontendCartStore((state) => state.updateQuantity);
  const removeItem = useFrontendCartStore((state) => state.removeItem);

  // Derived values computed cleanly on render
  const totalItems = items.reduce((acc, item) => acc + item.quantity, 0);
  const totalPrice = items.reduce(
    (acc, item) => acc + (item.part.price ?? 0) * item.quantity,
    0
  );

  return (
    <div
      tabIndex={0}
      className="dropdown-content card card-compact w-80 sm:w-96 p-2 shadow-xl bg-base-100 text-base-content rounded-box border border-base-300 z-50 mt-5"
    >
      <div className="absolute inset-0 bg-linear-to-r from-purple-600/30 via-indigo-500/20 to-purple-800/30 blur-2xl opacity-60 pointer-events-none -z-10" />
      <div className="card-body">
        <div className="flex justify-between items-center">
          <span className="font-bold text-lg">Your Cart</span>
          <span className="badge badge-primary badge-sm font-semibold">
            {totalItems} {totalItems === 1 ? "Item" : "Items"}
          </span>
        </div>

        <div className="divider my-1 opacity-15"></div>

        {/* Items List */}
        <div className="max-h-60 overflow-y-auto space-y-3 pr-1">
          {items.length === 0 ? (
            <p className="text-center text-base-content/60 py-6 text-sm">
              Your cart is empty.
            </p>
          ) : (
            items.map((item: CartItem) => (
              <div
                key={item.part.code}
                className="flex items-center justify-between gap-2 border-b border-white/20 pb-3"
              >
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm truncate text-base-content">
                    {item.part.model || item.part.code}
                  </p>
                  <p className="text-xs text-base-content/60 text-primary">
                    ${(item.part.price ?? 0).toFixed(2)} each
                  </p>
                </div>

                {/* Quantity Selector */}
                <div className="flex items-center gap-1 bg-base-200/60 p-1 rounded-lg">
                  <button
                    className="btn btn-xs btn-ghost hover:bg-base-300"
                    onClick={() =>
                      updateQuantity(item.part.code, item.quantity - 1)
                    }
                  >
                    -
                  </button>
                  <span className="text-xs font-semibold px-1 min-w-5 text-center">
                    {item.quantity}
                  </span>
                  <button
                    className="btn btn-xs btn-ghost hover:bg-base-300"
                    onClick={() =>
                      updateQuantity(item.part.code, item.quantity + 1)
                    }
                  >
                    +
                  </button>
                </div>

                {/* Remove Button */}
                <button
                  className="btn btn-xs btn-ghost text-error hover:bg-error/10"
                  onClick={() => removeItem(item.part.code)}
                  title="Remove item"
                >
                  ✕
                </button>
              </div>
            ))
          )}
        </div>

        <div className="divider my-1 opacity-15"></div>

        {/* Subtotal & Checkout */}
        <div className="flex justify-between items-center font-bold text-base px-1">
          <span>Subtotal:</span>
          <span className="text-primary">${totalPrice.toFixed(2)}</span>
        </div>

        <div className="card-actions mt-2">
          <button
            className="btn btn-primary btn-block font-medium"
            disabled={items.length === 0}
            onClick={() => navigate("/cart")}
          >
            View Cart / Checkout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Cart;