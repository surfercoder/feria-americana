"use client";

import { useCart } from "@/app/cart-context";

export default function AddToCartButton({ productId, isSold }: { productId: number; isSold: boolean }) {
  const { cartItems, addToCart, removeFromCart } = useCart();
  const isInCart = cartItems.includes(productId);

  return (
    <button
      onClick={() => !isSold && (isInCart ? removeFromCart(productId) : addToCart(productId))}
      disabled={isSold}
      className={`
        w-full py-3 text-xs sm:text-sm tracking-[0.2em] uppercase transition-all duration-200 border
        ${isSold
          ? "border-muted text-muted-foreground cursor-not-allowed"
          : isInCart
            ? "border-primary bg-primary text-primary-foreground hover:bg-primary/80"
            : "border-primary text-primary hover:bg-primary hover:text-primary-foreground"
        }
      `}
    >
      {isSold ? "Vendido" : isInCart ? "Agregado al carrito" : "Agregar al carrito"}
    </button>
  );
}
