"use client";

import { useEffect } from "react";
import { useCart } from "./cart-context";
import { X } from "lucide-react";

export default function SoldNotifications() {
  const { soldNotifications, dismissNotification } = useCart();

  // Auto-dismiss after 5 seconds
  useEffect(() => {
    if (soldNotifications.length === 0) return;
    const timers = soldNotifications.map((n) =>
      setTimeout(() => dismissNotification(n.productId), 5000)
    );
    return () => timers.forEach(clearTimeout);
  }, [soldNotifications, dismissNotification]);

  if (soldNotifications.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-[100] flex flex-col gap-2 max-w-sm">
      {soldNotifications.map((n) => (
        <div
          key={n.productId}
          className="flex items-center gap-3 bg-destructive/10 border border-destructive/30 text-destructive rounded px-4 py-3 shadow-lg animate-in slide-in-from-right"
        >
          <p className="text-sm flex-1">
            <span className="font-medium">&quot;{n.title}&quot;</span> fue
            vendido y se eliminó de tu carrito.
          </p>
          <button
            onClick={() => dismissNotification(n.productId)}
            className="shrink-0 text-destructive/60 hover:text-destructive transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
}
