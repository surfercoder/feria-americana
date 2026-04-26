"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { useCart } from "@/app/cart-context";
import { ArrowLeft, ShoppingBag } from "lucide-react";

export function BackArrow() {
  const router = useRouter();
  return (
    <button
      onClick={() => router.back()}
      className="flex items-center gap-2 text-sm tracking-wide uppercase hover:text-gold transition-colors"
    >
      <ArrowLeft className="w-5 h-5" strokeWidth={1.5} />
      <span className="hidden sm:inline">Volver</span>
    </button>
  );
}

export function CartLink() {
  const { cartItems } = useCart();
  return (
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
  );
}

export function BackLink() {
  const router = useRouter();
  return (
    <button
      onClick={() => router.back()}
      className="text-center mt-2 text-xs sm:text-sm tracking-[0.15em] uppercase text-muted-foreground hover:text-foreground transition-colors w-full"
    >
      Seguir comprando
    </button>
  );
}
