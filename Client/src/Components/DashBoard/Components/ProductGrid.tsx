import { Part } from "@/Types/types";
import { useEffect, useState } from "react";
import ProductCard from "./ProductCard";

interface ProductGridProps {
  parts: Part[];
  selectedCategory: string;
}

const ProductGrid = ({ parts, selectedCategory }: ProductGridProps) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const itemsPerPage = 20;

  // Reset pagination whenever search input or category changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedCategory]);

  // Combined real-time filtering
  const filteredParts = parts.filter((part: any) => {
    const categoryQuery = selectedCategory.toLowerCase();
    const searchQuery = searchTerm.toLowerCase().trim();

    const code = (part.code || part.Code || "").toString().toLowerCase();
    const brand = (part.brand || part.Brand || "").toString().toLowerCase();
    const category = (part.category || "").toLowerCase();
    const type = (part.type || "").toLowerCase();
    const describe = (part.describe || "").toLowerCase();

    // Check category filter
    const matchesCategory = categoryQuery
      ? category.includes(categoryQuery) ||
        type.includes(categoryQuery) ||
        describe.includes(categoryQuery)
      : true;

    // Check live search query across part attributes
    const matchesSearch = searchQuery
      ? code.includes(searchQuery) ||
        brand.includes(searchQuery) ||
        category.includes(searchQuery) ||
        type.includes(searchQuery) ||
        describe.includes(searchQuery)
      : true;

    return matchesCategory && matchesSearch;
  });

  // Pagination Math
  const totalPages = Math.ceil(filteredParts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentParts = filteredParts.slice(
    startIndex,
    startIndex + itemsPerPage,
  );

  return (
    <div className="p-6">
      {/* Search Input Section */}
      <div className="mb-6 max-w-xl">
        <div className="relative w-full">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by part code, brand, type or description..."
            className="input input-bordered w-full pr-8 focus:outline-primary"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Header Info */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">
          {selectedCategory || (searchTerm ? `Search Results` : "All Parts")}{" "}
          ({filteredParts.length} items found)
        </h2>
      </div>

      {/* Empty State */}
      {filteredParts.length === 0 && (
        <div className="text-center py-12 text-gray-500 font-medium">
          No components matched your search or category filter.
        </div>
      )}

      {/* Product Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {currentParts.map((part: any, index: number) => (
          <ProductCard key={part.code || `part-${index}`} part={part} />
        ))}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="join flex justify-center mt-6">
          <button
            className="join-item btn btn-sm"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          >
            «
          </button>
          <button className="join-item btn btn-sm">
            Page {currentPage} of {totalPages}
          </button>
          <button
            className="join-item btn btn-sm"
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
          >
            »
          </button>
        </div>
      )}
    </div>
  );
};

export default ProductGrid;