"use client";

import { useState, useMemo } from "react";
import Header, { type CategoryValue } from "./Header";
import ProductGrid from "./ProductGrid";
import type { Product } from "@/lib/products";

export default function HomeContent({ products }: { products: Product[] }) {
  const [activeCategory, setActiveCategory] = useState<CategoryValue>("todo");

  const filteredProducts = useMemo(() => {
    if (activeCategory === "todo") return products;
    return products.filter(
      (p) => (p.category ?? "").toLowerCase() === activeCategory
    );
  }, [products, activeCategory]);

  return (
    <>
      <Header
        activeCategory={activeCategory}
        onCategoryChange={setActiveCategory}
      />
      <main className="container mx-auto py-10 px-4">
        <ProductGrid products={filteredProducts} />
      </main>
    </>
  );
}
