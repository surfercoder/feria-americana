"use client";

import Link from "next/link";
import { useCart } from "@/app/cart-context";
import { ShoppingBag } from "lucide-react";

const CATEGORIES = [
  { label: "Todo", value: "todo" },
  { label: "Mujer", value: "mujer" },
  { label: "Hombre", value: "hombre" },
  { label: "Niños", value: "ninos" },
] as const;

export type CategoryValue = (typeof CATEGORIES)[number]["value"];

interface HeaderProps {
  activeCategory: CategoryValue;
  onCategoryChange: (category: CategoryValue) => void;
}

export default function Header({ activeCategory, onCategoryChange }: HeaderProps) {
  const { cartItems } = useCart();

  return (
    <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-4">
        {/* Top row: Logo + Cart */}
        <div className="flex items-center justify-between py-5">
          <div
            role="button"
            tabIndex={0}
            onClick={() => onCategoryChange("todo")}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') onCategoryChange("todo"); }}
            className="text-left cursor-pointer"
          >
            <h1 className="font-serif text-2xl sm:text-3xl tracking-wide uppercase">
              Feria Americana
            </h1>
          </div>

          <Link
            href="/cart"
            className="relative group flex items-center gap-2 text-sm tracking-wide uppercase hover:text-gold transition-colors"
          >
            <ShoppingBag className="w-5 h-5" strokeWidth={1.5} />
            <span className="hidden sm:inline">Carrito</span>
            {cartItems.length > 0 && (
              <span className="absolute -top-2 -right-2 sm:static sm:top-auto sm:right-auto bg-primary text-primary-foreground text-[10px] font-medium rounded-full w-5 h-5 flex items-center justify-center">
                {cartItems.length}
              </span>
            )}
          </Link>
        </div>

        {/* Category navigation */}
        <nav className="flex items-center justify-center gap-4 sm:gap-8 pb-3 -mt-1">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.value}
              onClick={() => onCategoryChange(cat.value)}
              className={`
                text-xs sm:text-sm tracking-[0.2em] uppercase transition-all duration-200 pb-1 border-b-2
                ${activeCategory === cat.value
                  ? "border-primary text-foreground font-medium"
                  : "border-transparent text-muted-foreground hover:text-foreground hover:border-border"
                }
              `}
            >
              {cat.label}
            </button>
          ))}
        </nav>
      </div>
    </header>
  );
}
