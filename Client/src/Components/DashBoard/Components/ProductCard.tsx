import React from "react";
import { Part } from "@/Types/types";

interface ProductCardProps {
  part: Part | any;
}

const ProductCard: React.FC<ProductCardProps> = ({ part }) => {
  // Direct extraction with simple safe fallbacks
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
  } = part;

  return (
    <div className="card bg-base-100 border border-base-200 shadow-sm hover:shadow-md transition-all p-4 flex flex-col justify-between rounded-xl">
      <div className="card bg-base-100 w-96 shadow-sm">
        <figure>
          <img
            src="https://img.daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.webp"
            alt="Shoes"
          />
        </figure>
        <div className="card-body">
          <div className="flex items-center justify-between gap-2 mb-2">
            <span className="badge badge-secondary badge-outline text-xs font-semibold truncate ">
              {brand}
            </span>
            <span className="badge badge-ghost text-[10px] uppercase font-mono tracking-wider">
              {pkg}
            </span>
          </div>
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
          <p className=" text-white text-lg line-clamp-2 my-3" title={describe}>
            {describe}
          </p>
          <div className="pt-3 border-t border-base-200 flex items-center justify-between mt-auto">
            <div>
              <div className="text-base font-extrabold text-primary">
                ${Number(price).toFixed(4)}
              </div>
              <div className="text-[11px] text-gray-400">
                Stock: {Number(stock).toLocaleString()}
              </div>
            </div>

            {/* PDF Datasheet Link */}
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

          <button className="btn btn-primary">Add to Cart</button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
