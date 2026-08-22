import Papa from "papaparse";
import { useEffect, useState } from "react";
import Navbar from "./Components/Navbar";
import { Part } from "@/Types/types";
import ProductGrid from "./Components/ProductGrid";

export default function DashBoard() {
  const [parts, setParts] = useState<Part[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedCategory, setSelectedCategory] = useState<string>("");

  useEffect(() => {
    Papa.parse<Part>(
      "https://lrks.github.io/jlcpcb-economic-parts/economic-parts.csv",
      {
        download: true,
        header: true,
        dynamicTyping: true,
        skipEmptyLines: true,
        complete: (results) => {
          setParts(results.data);
          setLoading(false);
        },
        error: (error) => {
          console.error("Failed to parse remote CSV:", error);
          setLoading(false);
        },
      },
    );
  }, []);

  if (loading) return <div>Loading live JLCPCB dataset...</div>;

  return (
    <div>
      <Navbar parts={parts} onSelectCategory={setSelectedCategory} />
      {/* Pass selectedCategory here instead of onSelectCategory */}
      <ProductGrid parts={parts} selectedCategory={selectedCategory} />
    </div>
  );
}
