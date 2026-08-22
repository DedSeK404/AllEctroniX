import { Part } from "@/Types/types";
import { useState } from "react";

interface ProductGridProps {
  parts: Part[];
  selectedCategory: string;
}

const ProductGrid = ({ parts, selectedCategory }: ProductGridProps) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  const filteredParts = selectedCategory
    ? parts.filter((part: any) => {
        const query = selectedCategory.toLowerCase();
        const category = (part.category || "").toLowerCase();
        const type = (part.type || "").toLowerCase();
        const describe = (part.describe || "").toLowerCase();

        return (
          category.includes(query) ||
          type.includes(query) ||
          describe.includes(query)
        );
      })
    : parts;

  // Pagination Math
  const totalPages = Math.ceil(filteredParts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentParts = filteredParts.slice(
    startIndex,
    startIndex + itemsPerPage,
  );

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">
          {selectedCategory || "All Parts"} ({filteredParts.length} items found)
        </h2>
      </div>

      {/* Product Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {currentParts.map((part: any, index) => {
          // Fallbacks for key properties in case CSV headers vary
          const partCode =
            part.code || part.Code || part["LCSC Part"] || `part-${index}`;
          const brandName =
            part.brand || part.Brand || part.Manufacturer || "Generic";
          const description =
            part.describe ||
            part.Describe ||
            part.Description ||
            "No description available";
          const price = part.price || part.Price || "N/A";
          const stock = part.stock || part.Stock || 0;

          return (
            <div
              key={partCode}
              className="card bg-base-100 border border-base-200 shadow-sm p-4"
            >
              <span className="badge badge-secondary badge-sm mb-2">
                {brandName}
              </span>
              <h3 className="font-bold text-md">{partCode}</h3>
              <p className="text-xs text-gray-500 line-clamp-2 my-2">
                {description}
              </p>
              <div className="mt-auto flex justify-between items-center pt-2 border-t border-base-200">
                <span className="font-bold text-primary">${price}</span>
                <span className="text-xs text-gray-400">
                  Stock: {Number(stock).toLocaleString()}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="join flex justify-center mt-6">
          <button
            className="join-item btn btn-sm"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((prev) => prev - 1)}
          >
            «
          </button>
          <button className="join-item btn btn-sm">
            Page {currentPage} of {totalPages}
          </button>
          <button
            className="join-item btn btn-sm"
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((prev) => prev + 1)}
          >
            »
          </button>
        </div>
      )}
    </div>
  );
};

export default ProductGrid;
