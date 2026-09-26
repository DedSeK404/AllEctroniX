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
    // Pass the full part object, NOT just the string code
    addItem(part, quantity);
    
    setTimeout(() => {
      setIsAdding(false);
    }, 200); // Small UI feedback delay
  };

  const isButtonDisabled = Number(stock) <= 0 || isAdding || isLoading;

  return (
    <div className="card bg-base-100 border border-base-200 shadow-sm hover:shadow-md transition-all flex flex-col justify-between rounded-xl overflow-hidden h-full">
      <figure className="aspect-video w-full overflow-hidden bg-base-200">
        <img
          src="/Circuit.jpg"
          alt={model || code}
          className="w-full h-full object-cover"
        />
      </figure>

      <div className="card-body p-4 flex flex-col justify-between flex-1">
        <div>
          {/* Header badges */}
          <div className="flex items-center justify-between gap-2 mb-2">
            <span className="badge badge-secondary badge-outline text-xs font-semibold truncate">
              {brand}
            </span>
            <span className="badge badge-ghost text-[10px] uppercase font-mono tracking-wider">
              {pkg}
            </span>
          </div>

          {/* Title & Part Code */}
          <h3
            className="font-bold text-base text-base-content leading-tight truncate"
            title={model || code}
          >
            {model || code}
          </h3>
          <p className="text-xs text-primary font-mono mt-0.5">{code}</p>
          <p className="text-[11px] text-gray-400 font-medium capitalize mt-1">
            {type || category}
          </p>

          {/* Description */}
          <p
            className="text-xs text-base-content/80 line-clamp-2 my-3"
            title={describe}
          >
            {describe}
          </p>
        </div>

        {/* Footer info & Actions */}
        <div className="space-y-3 mt-auto pt-3 border-t border-base-200">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-base font-extrabold text-primary">
                ${Number(price).toFixed(4)}
              </div>
              <div className="text-[11px] text-gray-400">
                Stock: {Number(stock).toLocaleString()}
              </div>
            </div>

            {/* Datasheet Button */}
            {file && (
              <a
                href={file}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-xs btn-outline btn-primary gap-1"
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
            <div className="join border border-base-300 rounded-lg">
              <button
                type="button"
                onClick={handleDecrement}
                className="join-item btn btn-sm btn-ghost px-2.5 min-h-0 h-9"
                disabled={isAdding}
              >
                -
              </button>
              <input
                type="number"
                value={quantity}
                onChange={handleInputChange}
                className="join-item input input-sm w-12 text-center p-0 min-h-0 h-9 focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                min="1"
                max={stock || undefined}
                disabled={isAdding}
              />
              <button
                type="button"
                onClick={handleIncrement}
                className="join-item btn btn-sm btn-ghost px-2.5 min-h-0 h-9"
                disabled={isAdding}
              >
                +
              </button>
            </div>

            <button
              onClick={handleAddToCart}
              className="btn btn-primary btn-sm flex-1 h-9 min-h-0"
              disabled={isButtonDisabled}
            >
              {isAdding ? (
                <span className="loading loading-spinner loading-xs"></span>
              ) : (
                "Add to Cart"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;