import { Part } from "@/Types/types";
import { fetchParts } from "@/api/partsService";
import { useEffect, useState } from "react";
import ProductCard from "./ProductCard";

interface ProductGridProps {
  selectedCategory: string;
}

const ProductGrid = ({ selectedCategory }: ProductGridProps) => {
  const [parts, setParts] = useState<Part[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [loading, setLoading] = useState(false);

  const itemsPerPage = 20;

  // Reset to page 1 whenever search query or category selection changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedCategory]);

  // Fetch paginated & filtered parts from backend
  useEffect(() => {
    const loadParts = async () => {
      setLoading(true);
      try {
        const data = await fetchParts({
          page: currentPage,
          limit: itemsPerPage,
          category: selectedCategory,
          search: searchTerm,
        });

        setParts(data.items);
        setTotalPages(data.total_pages);
        setTotalItems(data.total_items);
      } catch (error) {
        console.error("Error loading parts catalog:", error);
      } finally {
        setLoading(false);
      }
    };

    // 300ms debounce handler so we don't query the API on every single keystroke
    const timer = setTimeout(() => {
      loadParts();
    }, 300);

    return () => clearTimeout(timer);
  }, [currentPage, searchTerm, selectedCategory]);

  return (
    <div className="p-6 bg-neutral">
      {/* Search Input Section */}
      <div className="relative flex w-full items-center justify-center py-12">
        <div className="relative flex w-full items-center justify-center py-12">
          {/* Debug Glow Div: border added inside className, blur removed temporarily */}
          <div
            className="pointer-events-none absolute h-48 w-full max-w-2xl rounded-full bg-linear-to-r from-purple-600/30 via-indigo-500/20 blur-3xl to-purple-800/30 opacity-70 border-2"
            aria-hidden="true"
          />

          {/* Search Bar Container */}
          <div className="relative z-10 w-full max-w-2xl px-4">
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
                  Clear
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Header Info */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">
          {selectedCategory || (searchTerm ? "Search Results" : "All Parts")}{" "}
          {!loading && `(${totalItems} items found)`}
        </h2>
      </div>

      {/* Loading, Empty, and Grid States */}
      {loading ? (
        <div className="flex justify-center items-center py-16">
          <span className="loading loading-spinner loading-lg text-primary"></span>
        </div>
      ) : parts.length === 0 ? (
        <div className="text-center py-12 text-gray-500 font-medium">
          No components matched your search or category filter.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {parts.map((part) => (
            <ProductCard key={part.id || part.code} part={part} />
          ))}
        </div>
      )}

      {/* Pagination Controls */}
      {!loading && totalPages > 1 && (
        <div className="join flex justify-center mt-8">
          <button
            className="join-item btn btn-sm"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          >
            «
          </button>
          <button className="join-item btn btn-sm cursor-default">
            Page {currentPage} of {totalPages}
          </button>
          <button
            className="join-item btn btn-sm"
            disabled={currentPage === totalPages}
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
          >
            »
          </button>
        </div>
      )}
    </div>
  );
};

export default ProductGrid;
