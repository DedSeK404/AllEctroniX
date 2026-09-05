import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCartStore } from "@/Components/DashBoard/Components/useCartStore";
import { CartItem } from './Navbar';


const Cart = () => {
  const navigate = useNavigate();

  // Access cart state and action methods directly from Zustand
  const items = useCartStore((state) => state.items);
  const totalItems = useCartStore((state) => state.getTotalItems());
  const totalPrice = useCartStore((state) => state.getTotalPrice());
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const removeItem = useCartStore((state) => state.removeItem);

  return (
    <div
      tabIndex={0}
      className="dropdown-content card card-compact w-80 sm:w-96 p-2 shadow-lg bg-base-100 rounded-box border border-base-200 z-[100]"
    >
      <div className="card-body">
        <span className="font-bold text-lg">{totalItems} Items</span>

        <div className="divider my-1"></div>

        {/* Items List */}
        <div className="max-h-60 overflow-y-auto space-y-3">
          {items.length === 0 ? (
            <p className="text-center text-gray-500 py-4">
              Your cart is empty.
            </p>
          ) : (
            items.map((item: CartItem) => (
              <div
                key={item.part.code}
                className="flex items-center justify-between gap-2 border-b border-base-200 pb-2"
              >
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm truncate">
                    {item.part.model || item.part.code}
                  </p>
                  <p className="text-xs text-gray-500">
                    ${item.part.price.toFixed(2)} each
                  </p>
                </div>

                {/* Quantity Selector */}
                <div className="flex items-center gap-1">
                  <button
                    className="btn btn-xs btn-outline"
                    onClick={() =>
                      updateQuantity(item.part.code, item.quantity - 1)
                    }
                  >
                    -
                  </button>
                  <span className="text-xs font-semibold px-1">
                    {item.quantity}
                  </span>
                  <button
                    className="btn btn-xs btn-outline"
                    onClick={() =>
                      updateQuantity(item.part.code, item.quantity + 1)
                    }
                  >
                    +
                  </button>
                </div>

                {/* Remove Button */}
                <button
                  className="btn btn-xs btn-ghost text-error"
                  onClick={() => removeItem(item.part.code)}
                >
                  ✕
                </button>
              </div>
            ))
          )}
        </div>

        <div className="divider my-1"></div>

        {/* Subtotal & Checkout */}
        <div className="flex justify-between items-center font-bold text-base">
          <span>Subtotal:</span>
          <span className="text-primary">${totalPrice.toFixed(2)}</span>
        </div>

        <div className="card-actions mt-2">
          <button
            className="btn btn-primary btn-block"
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