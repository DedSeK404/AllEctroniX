import React, { useState } from "react";
import { Part } from "@/Types/types";
import { useBackendCartStore } from "@/api/cartService";
import { useFrontendCartStore } from "./useCartStore";

interface ProductCardProps {
  part: Part;
}

const ProductCard: React.FC<ProductCardProps> = ({ part }) => {
  const [quantity, setQuantity] = useState<number>(1);
  const [isAdding, setIsAdding] = useState<boolean>(false);

  // Extract store actions
  const addItem = useFrontendCartStore((state) => state.addItem);
  const isLoading = useBackendCartStore((state) => state.isLoading);

  // Fallbacks
  const {
    brand = "Generic",
    code = "N/A",
    model = "",
    category = "",
    type = "",
    package: pkg = "SMD",
    describe = "No description available",
    price = 0,
    stock = 0,
    file = "",
  } = part || {};

  const handleDecrement = () => {
    setQuantity((prev) => Math.max(1, prev - 1));
  };

  const handleIncrement = () => {
    setQuantity((prev) => (stock ? Math.min(stock, prev + 1) : prev + 1));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value, 10);
    if (isNaN(val) || val < 1) {
      setQuantity(1);
    } else if (stock && val > stock) {
      setQuantity(stock);
    } else {
      setQuantity(val);
    }
  };

  const handleAddToCart = () => {
    if (!code || code === "N/A") return;

    setIsAdding(true);
    addItem(part, quantity);

    setTimeout(() => {
      setIsAdding(false);
    }, 200);
  };

  const isButtonDisabled = Number(stock) <= 0 || isAdding || isLoading;
  console.log("ProductCard Rendered:", part);
  return (
    // Outer wrapper handles the glow/gradient border effect
    <div className="relative rounded-2xl p-px bg-linear-to-r from-purple-500 via-indigo-500 to-purple-600 shadow-xl overflow-hidden h-full flex flex-col">
      {/* Inner body background: explicitly dark and translucent so the gradient forms a glowing border */}
      <div className="flex flex-col justify-between flex-1 bg-zinc-950/85 backdrop-blur-md rounded-[15px] overflow-hidden">
        {/* Card Image Figure */}
        <figure className="aspect-video w-full overflow-hidden bg-zinc-900/50">
          <img
            src="/Circuit.jpg"
            alt={model || code}
            className="w-full h-full object-cover opacity-90 hover:opacity-100 transition-opacity"
          />
        </figure>

        {/* Main Content Area */}
        <div className="p-4 flex flex-col justify-between flex-1">
          <div>
            {/* Header badges */}

            <div className="flex items-center justify-between gap-2 mb-2">
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/10 border border-secondary/30 text-secondary text-xs font-semibold mb-3 shadow-sm">
                {brand}
              </span>
              <span className="px-2 py-0.5 text-[10px] uppercase font-mono tracking-wider rounded-md bg-zinc-800 text-zinc-300">
                {pkg}
              </span>
            </div>

            {/* Title & Part Code */}
            <h3
              className="font-bold text-base text-[#F43098] leading-tight truncate"
              title={code}
            >
              {code}
            </h3>

            <p className="text-[11px] text-white font-medium capitalize mt-1">
              {type || category}
            </p>

            {/* Description */}
            <p
              className="text-xs text-white line-clamp-2 my-3"
              title={describe}
            >
              {describe}
            </p>
          </div>

          {/* Footer info & Actions */}
          <div className="space-y-3 mt-auto pt-3 border-t border-zinc-800">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-base font-extrabold text-[#F43098]">
                  ${Number(price).toFixed(4)}
                </div>
                <div className="text-[11px] text-zinc-500">
                  Stock: {Number(stock).toLocaleString()}
                </div>
              </div>

              {/* Datasheet Button */}
              {file && (
                <a
                  href={file}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-2.5 py-1 text-xs font-medium rounded-lg border border-zinc-700 bg-zinc-900 text-zinc-200 hover:bg-zinc-800 hover:text-white transition-colors flex items-center gap-1"
                  title="View Datasheet PDF"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-3.5 w-3.5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1.007 1.007 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                  PDF
                </a>
              )}
            </div>

            {/* Quantity Controls & Add to Cart */}
            <div className="flex gap-2 items-center">
              <div className="flex items-center border border-zinc-700 rounded-lg bg-zinc-900 overflow-hidden">
                <button
                  type="button"
                  onClick={handleDecrement}
                  className="px-2.5 py-1.5 text-zinc-300 hover:bg-zinc-800 transition-colors text-sm"
                  disabled={isAdding}
                >
                  -
                </button>
                <input
                  type="number"
                  value={quantity}
                  onChange={handleInputChange}
                  className="w-10 text-center text-xs bg-transparent text-zinc-200 focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  min="1"
                  max={stock || undefined}
                  disabled={isAdding}
                />
                <button
                  type="button"
                  onClick={handleIncrement}
                  className="px-2.5 py-1.5 text-zinc-300 hover:bg-zinc-800 transition-colors text-sm"
                  disabled={isAdding}
                >
                  +
                </button>
              </div>

              <button
                onClick={handleAddToCart}
                className="flex-1 py-2 px-3 text-xs font-semibold rounded-lg bg-purple-600 hover:bg-purple-500 text-white transition-colors shadow-sm disabled:opacity-50"
                disabled={isButtonDisabled}
              >
                {isAdding ? (
                  <span className="inline-block animate-spin">⏳</span>
                ) : (
                  "Add to Cart"
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
