import {  useState } from "react";
import Navbar from "./Components/Navbar";
import ProductGrid from "./Components/ProductGrid";
import AssistantMainPage from "../Assistant/pages/AssistantMainPage";

export default function DashBoard() {

  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [currentView, setCurrentView] = useState<"catalog" | "assistant">(
    "catalog",
  );

 
  

  return (
    <div>
      <Navbar  onSelectCategory={setSelectedCategory} onSelectView={setCurrentView} />
      {currentView === "catalog" ? (
        <ProductGrid  selectedCategory={selectedCategory} />
      ) : (
        <AssistantMainPage />
      )}
    </div>
  );
}
