"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { CheckCircle2 } from "lucide-react";
import type { Settings } from "@/lib/types";
import { siteUrlOf } from "@/lib/sheet-core";
import { useSheet } from "./SheetProvider";

export type CartItem = {
  slug: string;
  name: string;
  image: string;
  /** e.g. "Peetal · 6 inch" */
  variant: string;
  /** null = price on request */
  price: number | null;
  qty: number;
};

type CartContextValue = {
  items: CartItem[];
  count: number;
  /** total of items that have a price */
  subtotal: number;
  /** number of lines with price on request */
  porCount: number;
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  addItem: (item: Omit<CartItem, "qty">, qty?: number, open?: boolean) => void;
  removeItem: (key: string) => void;
  setQty: (key: string, qty: number) => void;
  clearCart: () => void;
  toast: (msg: string) => void;
  settings: Settings;
  whatsapp: string;
  freeShippingThreshold: number;
  siteUrl: string;
};

const CartContext = createContext<CartContextValue | null>(null);

const keyOf = (i: { slug: string; variant: string }) => `${i.slug}::${i.variant}`;
const STORAGE_KEY = "shop-cart-v2";

export function CartProvider({ children }: { children: ReactNode }) {
  const { settings } = useSheet();
  const siteUrl = siteUrlOf(settings);
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [hydrated, setHydrated] = useState(false);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (raw) setItems(JSON.parse(raw));
    } catch {
      /* corrupted cart — start fresh */
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      /* storage full — ignore */
    }
  }, [items, hydrated]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const toast = useCallback((msg: string) => {
    setToastMsg(msg);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToastMsg(null), 2600);
  }, []);

  const addItem = useCallback(
    (item: Omit<CartItem, "qty">, qty = 1, open = true) => {
      setItems((prev) => {
        const k = keyOf(item);
        const found = prev.find((p) => keyOf(p) === k);
        if (found) {
          return prev.map((p) => (keyOf(p) === k ? { ...p, qty: Math.min(p.qty + qty, 99) } : p));
        }
        return [...prev, { ...item, qty }];
      });
      if (open) setIsOpen(true);
      toast("Added to your order");
    },
    [toast],
  );

  const removeItem = useCallback((key: string) => {
    setItems((prev) => prev.filter((p) => keyOf(p) !== key));
  }, []);

  const setQty = useCallback((key: string, qty: number) => {
    setItems((prev) =>
      qty <= 0
        ? prev.filter((p) => keyOf(p) !== key)
        : prev.map((p) => (keyOf(p) === key ? { ...p, qty: Math.min(qty, 99) } : p)),
    );
  }, []);

  const clearCart = useCallback(() => setItems([]), []);

  const { count, subtotal, porCount } = useMemo(
    () => ({
      count: items.reduce((a, i) => a + i.qty, 0),
      subtotal: items.reduce((a, i) => a + (i.price === null ? 0 : i.qty * i.price), 0),
      porCount: items.filter((i) => i.price === null).length,
    }),
    [items],
  );

  const value: CartContextValue = {
    items,
    count,
    subtotal,
    porCount,
    isOpen,
    openCart: () => setIsOpen(true),
    closeCart: () => setIsOpen(false),
    addItem,
    removeItem,
    setQty,
    clearCart,
    toast,
    settings,
    whatsapp: settings.whatsapp,
    freeShippingThreshold: Number(settings.free_shipping_threshold) || 0,
    siteUrl,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
      {toastMsg && (
        <div role="status" className="animate-toast-in fixed bottom-24 left-1/2 z-[70] -translate-x-1/2">
          <div className="flex items-center gap-2 rounded-full border border-gold-500/40 bg-espresso-900/95 px-4 py-2 text-sm font-medium text-gold-200 shadow-2xl backdrop-blur">
            <CheckCircle2 className="h-4 w-4 text-gold-400" strokeWidth={2.2} />
            {toastMsg}
          </div>
        </div>
      )}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside <CartProvider>");
  return ctx;
}

export { keyOf as cartKey };
