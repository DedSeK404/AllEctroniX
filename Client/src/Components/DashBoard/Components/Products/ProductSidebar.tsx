import { Filter, RefreshCcw } from "lucide-react";

interface ProductSidebarProps {
  selectedSort: string;
  setSelectedSort: (sort: string) => void;
  inStockOnly: boolean;
  setInStockOnly: (val: boolean) => void;
  maxPrice: number;
  setMaxPrice: (val: number) => void;
  onResetFilters: () => void;
}

const ProductSidebar = ({
  selectedSort,
  setSelectedSort,
  inStockOnly,
  setInStockOnly,
  maxPrice,
  setMaxPrice,
  onResetFilters,
}: ProductSidebarProps) => {
  return (
    <aside className="w-full lg:w-72 bg-base-100/90 backdrop-blur-md p-5 rounded-box shadow-lg border border-base-300/40 flex flex-col gap-5 shrink-0">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2 font-bold text-base">
          <Filter className="w-4 h-4 text-secondary" />
          <h3>Filters & Sort</h3>
        </div>
        <button
          className="btn btn-ghost btn-xs text-error gap-1 cursor-pointer"
          onClick={onResetFilters}
        >
          <RefreshCcw className="w-3 h-3" />
          Reset
        </button>
      </div>

      <div className="divider my-0"></div>

      {/* Sort By Section */}
      <div className="flex flex-col gap-2">
        <label className="font-semibold text-xs uppercase tracking-wider text-base-content/60">
          Sort By
        </label>
        <div className="form-control">
          <label className="label cursor-pointer justify-start gap-3 py-1">
            <input
              type="radio"
              name="sort-radio"
              className="radio radio-primary radio-sm"
              checked={selectedSort === "newest"}
              onChange={() => setSelectedSort("newest")}
            />
            <span className="label-text text-sm">Newest Arrivals</span>
          </label>
        </div>
        <div className="form-control">
          <label className="label cursor-pointer justify-start gap-3 py-1">
            <input
              type="radio"
              name="sort-radio"
              className="radio radio-primary radio-sm"
              checked={selectedSort === "oldest"}
              onChange={() => setSelectedSort("oldest")}
            />
            <span className="label-text text-sm">Oldest Records</span>
          </label>
        </div>
        <div className="form-control">
          <label className="label cursor-pointer justify-start gap-3 py-1">
            <input
              type="radio"
              name="sort-radio"
              className="radio radio-primary radio-sm"
              checked={selectedSort === "price-low"}
              onChange={() => setSelectedSort("price-low")}
            />
            <span className="label-text text-sm">Price: Low to High</span>
          </label>
        </div>
        <div className="form-control">
          <label className="label cursor-pointer justify-start gap-3 py-1">
            <input
              type="radio"
              name="sort-radio"
              className="radio radio-primary radio-sm"
              checked={selectedSort === "price-high"}
              onChange={() => setSelectedSort("price-high")}
            />
            <span className="label-text text-sm">Price: High to Low</span>
          </label>
        </div>
      </div>

      <div className="divider my-0"></div>

      {/* Availability Filter */}
      <div className="flex flex-col gap-2">
        <label className="font-semibold text-xs uppercase tracking-wider text-base-content/60">
          Availability
        </label>
        <div className="form-control">
          <label className="label cursor-pointer justify-start gap-3 py-1">
            <input
              type="checkbox"
              className="checkbox checkbox-primary checkbox-sm"
              checked={inStockOnly}
              onChange={(e) => setInStockOnly(e.target.checked)}
            />
            <span className="label-text text-sm">In Stock Only (&gt; 0)</span>
          </label>
        </div>
      </div>

      <div className="divider my-0"></div>

      {/* Max Price Slider */}
      <div className="flex flex-col gap-2">
        <div className="flex justify-between text-sm">
          <span className="font-semibold text-xs uppercase tracking-wider text-base-content/60">
            Max Price
          </span>
          <span className="text-secondary font-bold">
            ${maxPrice.toFixed(2)}
          </span>
        </div>
        <input
          type="range"
          min="0.01"
          max="10"
          step="0.1"
          value={maxPrice}
          onChange={(e) => setMaxPrice(Number(e.target.value))}
          className="range range-primary range-sm"
        />
        <div className="w-full flex justify-between text-xs px-1 text-base-content/60">
          <span>$0.01</span>
          <span>$5.00</span>
          <span>$10.00</span>
        </div>
      </div>
    </aside>
  );
};

export default ProductSidebar;
