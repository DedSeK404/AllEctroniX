import { Part } from "@/Types/types";
import { fetchParts } from "@/api/partService";
import { useEffect, useState } from "react";
import ProductCard from "./ProductCard";
import ProductSidebar from "./ProductSidebar";
import { Home } from "lucide-react";

interface ProductGridProps {
  selectedCategory: string;
  onResetCategory?: () => void;
}

const ProductGrid = ({
  selectedCategory,
  onResetCategory,
}: ProductGridProps) => {
  const [parts, setParts] = useState<Part[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [loading, setLoading] = useState(false);

  // Filter & Sort States
  const [selectedSort, setSelectedSort] = useState("newest");
  const [inStockOnly, setInStockOnly] = useState(true);
  const [maxPrice, setMaxPrice] = useState(100);
  const [itemsPerPage, setItemsPerPage] = useState(8);

  // Reset to page 1 whenever filters, search query, category selection, or itemsPerPage changes
  useEffect(() => {
    setCurrentPage(1);
  }, [
    searchTerm,
    selectedCategory,
    selectedSort,
    inStockOnly,
    maxPrice,
    itemsPerPage,
  ]);

  // Fetch paginated & filtered parts from backend with debounce
  useEffect(() => {
    const loadParts = async () => {
      setLoading(true);
      try {
        const activeCategory = searchTerm ? "" : selectedCategory;

        const data = await fetchParts({
          page: currentPage,
          limit: itemsPerPage,
          category: activeCategory,
          search: searchTerm,
          sort: selectedSort,
          inStock: inStockOnly ? true : undefined,
          maxPrice: maxPrice,
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

    const timer = setTimeout(() => {
      loadParts();
    }, 300);

    return () => clearTimeout(timer);
  }, [
    currentPage,
    searchTerm,
    selectedCategory,
    selectedSort,
    inStockOnly,
    maxPrice,
    itemsPerPage,
  ]);

  // Handler for popular tags
  const handleTagClick = (tag: string) => {
    setSearchTerm(tag);
    if (onResetCategory) {
      onResetCategory();
    }
  };

  const handleResetFilters = () => {
    setSelectedSort("newest");
    setInStockOnly(true);
    setMaxPrice(100);
    setSearchTerm("");
    setItemsPerPage(20);
    if (onResetCategory) onResetCategory();
  };

  return (
    <div className="p-4 sm:p-6 bg-neutral relative overflow-hidden min-h-screen">
      {/* Search Section Header */}
      <div className="relative flex flex-col items-center justify-center py-6 px-4 mb-6">
        <div
          className="pointer-events-none absolute h-40 w-full max-w-2xl rounded-full bg-linear-to-r from-purple-600/30 via-indigo-500/20 to-purple-800/30 blur-3xl opacity-80 animate-pulse"
          aria-hidden="true"
        />

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
          <div className="relative flex items-center shadow-2xl rounded-2xl bg-base-100/85 backdrop-blur-md border border-secondary/30 transition-all duration-300 focus-within:border-secondary focus-within:ring-2 focus-within:ring-secondary/20">
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

            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by part code (e.g., C10002), brand, or description..."
              className="w-full bg-transparent px-4 py-4 text-sm text-base-content placeholder-base-content/40 focus:outline-none"
            />

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
                  onClick={() => handleTagClick(tag)}
                  className="px-3 py-1 rounded-lg bg-base-100/50 hover:bg-secondary/20 hover:text-secondary border border-base-200 text-base-content/70 transition-all cursor-pointer"
                >
                  {tag}
                </button>
              ),
            )}
          </div>
        </div>
      </div>

      {/* Main Layout: Modular Sidebar + Component Grid */}
      <div className="max-w-screen mx-auto flex flex-col lg:flex-row gap-6 items-start">
        <ProductSidebar
          selectedSort={selectedSort}
          setSelectedSort={setSelectedSort}
          inStockOnly={inStockOnly}
          setInStockOnly={setInStockOnly}
          maxPrice={maxPrice}
          setMaxPrice={setMaxPrice}
          onResetFilters={handleResetFilters}
        />

        {/* Right Content Area (Breadcrumbs, Count, Grid & Pagination) */}
        <div className="flex-1 w-full flex flex-col">
          {/* Breadcrumbs & Total Count Header */}
          <div className="px-2 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
            <div className="text-sm breadcrumbs py-0">
              <ul>
                <li>
                  <a
                    href="/"
                    className="inline-flex items-center gap-1.5 hover:text-secondary transition-colors"
                  >
                    <Home className="w-4 h-4" />
                    <span className="hidden sm:inline">Home</span>
                  </a>
                </li>
                <li>
                  {selectedCategory && !searchTerm ? (
                    <button
                      onClick={onResetCategory}
                      className="hover:text-secondary transition-colors text-left"
                    >
                      Components Catalog
                    </button>
                  ) : searchTerm ? (
                    <span className="text-base-content/60">Search Results</span>
                  ) : (
                    <span
                      className="text-base-content font-semibold"
                      aria-current="page"
                    >
                      All Parts
                    </span>
                  )}
                </li>
                {selectedCategory && !searchTerm && (
                  <li>
                    <span
                      className="text-base-content font-semibold"
                      aria-current="page"
                    >
                      {selectedCategory}
                    </span>
                  </li>
                )}
                {searchTerm && (
                  <li>
                    <span
                      className="text-base-content font-semibold"
                      aria-current="page"
                    >
                      "{searchTerm}"
                    </span>
                  </li>
                )}
              </ul>
            </div>

            <div className="flex flex-wrap items-center gap-3 self-start sm:self-auto">
              {!loading && (
                <div className="badge badge-neutral border border-base-300/40 px-3 py-3 text-xs sm:text-sm">
                  <span className="text-secondary font-bold mr-1">
                    {totalItems.toLocaleString()}
                  </span>{" "}
                  items found
                </div>
              )}
              <div className="flex items-center gap-1.5 text-xs text-base-content/70 bg-base-100/60 border border-base-300/30 px-2.5 py-1.5 rounded-xl">
                <span>Per page:</span>
                <select
                  value={itemsPerPage}
                  onChange={(e) => setItemsPerPage(Number(e.target.value))}
                  className="bg-transparent text-base-content font-semibold focus:outline-none cursor-pointer"
                >
                  <option value={8} className="bg-neutral text-base-content">
                    8
                  </option>
                  <option value={20} className="bg-neutral text-base-content">
                    20
                  </option>
                  <option value={40} className="bg-neutral text-base-content">
                    40
                  </option>
                  <option value={60} className="bg-neutral text-base-content">
                    60
                  </option>
                </select>
              </div>
            </div>
          </div>

          {/* Loading Skeleton, Empty, and Grid States */}
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {Array.from({
                length: itemsPerPage > 12 ? 12 : itemsPerPage,
              }).map((_, i) => (
                <div
                  key={i}
                  className="bg-base-100/50 border border-base-300/30 rounded-2xl p-4 flex flex-col gap-3 h-72 animate-pulse"
                >
                  <div className="w-full h-32 bg-base-300/40 rounded-xl" />
                  <div className="h-4 bg-base-300/40 rounded w-3/4" />
                  <div className="h-3 bg-base-300/40 rounded w-1/2" />
                  <div className="mt-auto flex justify-between items-center pt-2">
                    <div className="h-5 bg-base-300/40 rounded w-16" />
                    <div className="h-8 bg-base-300/40 rounded w-24" />
                  </div>
                </div>
              ))}
            </div>
          ) : parts.length === 0 ? (
            <div className="text-center py-24 bg-base-100/50 rounded-box border border-base-300/30 flex-1 flex flex-col items-center justify-center">
              <p className="text-base-content/60 font-medium">
                No components matched your search, category, or filter criteria.
              </p>
              <button
                onClick={handleResetFilters}
                className="btn btn-sm btn-outline btn-primary mt-4 cursor-pointer"
              >
                Clear Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
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
      </div>
    </div>
  );
};

export default ProductGrid;