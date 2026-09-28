import { Part } from "@/Types/types";
import { fetchParts } from "@/api/partService";
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
    <div className="p-6 bg-neutral relative overflow-hidden">
      {/* Enhanced Search Input Section */}
      <div className="relative flex flex-col items-center justify-center py-8 px-4">
        {/* Background Glow Effect (Isolated Layer) */}
        <div
          className="pointer-events-none absolute h-40 w-full max-w-2xl rounded-full bg-linear-to-r from-purple-600/30 via-indigo-500/20 to-purple-800/30 blur-3xl opacity-80 animate-pulse"
          aria-hidden="true"
        />

        {/* Header / Intro Card above Search */}
        <div className="relative z-10 text-center mb-6 max-w-lg">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/10 border border-secondary/30 text-secondary text-xs font-semibold mb-3 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-secondary animate-ping" />
            Live Inventory Engine
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-base-content tracking-tight">
            Find Any Component Instantly
          </h2>
          <p className="text-xs text-base-content/60 mt-1">
            Search across active semiconductors, passives, and alternative
            datasheets with real-time stock sync.
          </p>
        </div>

        {/* Search Bar Container */}
        <div className="relative z-10 w-full max-w-2xl">
          <div className="relative flex items-center shadow-2xl rounded-2xl bg-base-100/80 backdrop-blur-md border border-secondary/30 transition-all duration-300 focus-within:border-secondary focus-within:ring-2 focus-within:ring-secondary/20">
            {/* Search Icon */}
            <div className="pl-4 text-secondary/70">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>

            {/* Input Field */}
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by part code (e.g., TDA7388, STM32), brand, or description..."
              className="w-full bg-transparent px-4 py-4 text-sm text-base-content placeholder-base-content/40 focus:outline-none"
            />

            {/* Action Buttons / Clear */}
            <div className="pr-3 flex items-center gap-2">
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="px-3 py-1.5 rounded-xl text-xs font-medium bg-base-200/80 hover:bg-base-300 text-base-content/70 hover:text-base-content transition-colors cursor-pointer"
                >
                  Clear
                </button>
              )}
            </div>
          </div>

          {/* Quick Filters / Tags Below Search */}
          <div className="flex flex-wrap items-center justify-center gap-2 mt-4 text-xs">
            <span className="text-base-content/40 font-medium mr-1">
              Popular:
            </span>
            {["Switch", "MOSFET", "Resistor", "Inductor", "Capacitor"].map(
              (tag) => (
                <button
                  key={tag}
                  onClick={() => setSearchTerm(tag)}
                  className="px-3 py-1 rounded-lg bg-base-100/50 hover:bg-secondary/20 hover:text-secondary border border-base-200 text-base-content/70 transition-all cursor-pointer"
                >
                  {tag}
                </button>
              ),
            )}
          </div>
        </div>
      </div>

      {/* Header Info */}
      <div className="flex justify-between items-center mb-6 mt-4">
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
