"use client";
import { useReducer, useEffect, useRef, useSyncExternalStore } from 'react';
import { Grid } from 'react-window';
import Image from 'next/image';
import Link from 'next/link';
import { useCart } from "../app/cart-context";
import type { Product } from "@/lib/products";

const SKELETON_COUNT = 16;
const COLUMN_COUNT = 4;

function getImageHeight() {
  if (typeof window === 'undefined') return 320;
  return window.innerWidth < 640 ? 200 : 320;
}

function getRowHeight() {
  return getImageHeight() + 160;
}

function SkeletonCard() {
  return (
    <div className="animate-pulse bg-muted rounded h-[340px] sm:h-[460px] w-full flex flex-col" />
  );
}

function getColumnCount() {
  if (typeof window === 'undefined') return COLUMN_COUNT;
  if (window.innerWidth < 640) return 2;
  if (window.innerWidth < 1024) return 3;
  return COLUMN_COUNT;
}

// useSyncExternalStore to detect mount without flash
function subscribeToNothing() { return () => {}; }
function useMounted() {
  return useSyncExternalStore(subscribeToNothing, () => true, () => false);
}

interface CellCustomProps {
  products: Product[];
  cartItems: number[];
  addToCart: (id: number) => void;
  removeFromCart: (id: number) => void;
  columnCount: number;
  cardWidth: number;
  isLoading: boolean;
  imageHeight: number;
  rowHeight: number;
  ariaAttributes?: Record<string, string | number>;
}

function Cell({ columnIndex, rowIndex, style, ariaAttributes, products, cartItems, addToCart, removeFromCart, columnCount, cardWidth, isLoading, imageHeight, rowHeight }: CellCustomProps & {
  columnIndex: number;
  rowIndex: number;
  style: React.CSSProperties;
}) {
  const index = rowIndex * columnCount + columnIndex;
  if (isLoading) {
    return (
      <div style={{ ...style, width: cardWidth, padding: 8 }} {...ariaAttributes}>
        <SkeletonCard />
      </div>
    );
  }
  if (index >= products.length) return null;
  const product: Product = products[index];
  const isInCart = cartItems.includes(product.id);
  const isSold = product.status === 'vendido';
  const isFirstProduct = index < columnCount * 2;
  return (
    <div style={{ ...style, width: cardWidth, maxWidth: 480, padding: 6 }} {...ariaAttributes}>
      <div className="group flex flex-col bg-card border border-border/50 rounded overflow-hidden hover:shadow-lg transition-shadow duration-300" style={{ height: rowHeight - 12 }}>
        <Link href={`/product/${product.id}`} scroll={false} className="relative block overflow-hidden shrink-0" style={{ height: imageHeight }}>
          <Image
            src={`/images/${product.image}`}
            alt={product.title}
            fill
            style={{ objectFit: 'cover' }}
            className={`group-hover:scale-105 transition-transform duration-500${isSold ? ' opacity-50' : ''}`}
            sizes="(max-width: 768px) 50vw, 25vw"
            priority={isFirstProduct}
            {...(!isFirstProduct && {
              placeholder: "blur",
              blurDataURL: "data:image/webp;base64,UklGRiIAAABXRUJQVlA4ICwAAAAwAQCdASoEAAQAAVAfJZgCdAEOkAQA",
            })}
          />
          {isSold && (
            <span
              className="absolute top-3 -right-8 bg-red-600 text-white text-xs px-8 py-1 font-bold tracking-wide uppercase z-10 shadow-lg"
              style={{ transform: 'rotate(45deg)' }}
            >
              VENDIDO
            </span>
          )}
        </Link>

        {/* Details */}
        <div className="flex flex-col flex-1 px-3 py-3 justify-between">
          <div>
            <p className="font-serif text-sm sm:text-base font-medium leading-tight text-center">
              {product.title}
            </p>
            {product.brand && (
              <p className="text-[10px] sm:text-xs tracking-[0.15em] uppercase text-muted-foreground mt-1 text-center">
                {product.brand}
                {product.size && <span className="mx-1.5">|</span>}
                {product.size}
              </p>
            )}
            {product.color && (
              <p className="text-[10px] sm:text-xs text-muted-foreground mt-0.5 text-center">{product.color}</p>
            )}
          </div>

          <div className="mt-2">
            <p className="text-sm sm:text-base font-medium text-center tracking-wide">
              $ {product.price}
            </p>
            <button
              onClick={() => !isSold && (isInCart ? removeFromCart(product.id) : addToCart(product.id))}
              disabled={isSold}
              className={`
                w-full mt-2 py-2 text-[10px] sm:text-xs tracking-[0.2em] uppercase transition-all duration-200 border
                ${isSold
                  ? "border-muted text-muted-foreground cursor-not-allowed"
                  : isInCart
                    ? "border-primary bg-primary text-primary-foreground hover:bg-primary/80"
                    : "border-primary text-primary hover:bg-primary hover:text-primary-foreground"
                }
              `}
            >
              {isSold ? "Vendido" : isInCart ? "Agregado" : "Agregar"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

type GridState = {
  isLoading: boolean;
  containerWidth: number;
  columnCount: number;
  gridHeight: number;
  imageHeight: number;
  rowHeight: number;
};

type GridAction =
  | { type: 'RESIZE'; containerWidth: number; columnCount: number; gridHeight: number; imageHeight: number; rowHeight: number }
  | { type: 'SET_CONTAINER_WIDTH'; containerWidth: number }
  | { type: 'LOADED' };

const initialGridState: GridState = {
  isLoading: true,
  containerWidth: 1280,
  columnCount: COLUMN_COUNT,
  gridHeight: 800,
  imageHeight: 320,
  rowHeight: 480,
};

function gridReducer(state: GridState, action: GridAction): GridState {
  switch (action.type) {
    case 'RESIZE':
      return {
        ...state,
        containerWidth: action.containerWidth,
        columnCount: action.columnCount,
        gridHeight: action.gridHeight,
        imageHeight: action.imageHeight,
        rowHeight: action.rowHeight,
      };
    case 'SET_CONTAINER_WIDTH':
      return { ...state, containerWidth: action.containerWidth };
    case 'LOADED':
      return { ...state, isLoading: false };
    default:
      return state;
  }
}

export default function ProductGrid({ products }: { products: Product[] }) {
  const { cartItems, addToCart, removeFromCart } = useCart();
  const containerRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const mounted = useMounted();

  const [state, dispatch] = useReducer(gridReducer, initialGridState);

  // Save scroll position on scroll, restore on mount
  useEffect(() => {
    if (!mounted || !gridRef.current) return;
    const scrollEl = gridRef.current.querySelector('[style*="overflow"]') as HTMLElement | null;
    if (!scrollEl) return;

    // Only restore scroll on back/forward navigation, not on fresh loads
    const navType = typeof window !== 'undefined' && window.performance?.navigation?.type;
    const isBackForward = navType === 2;
    if (isBackForward) {
      const saved = sessionStorage.getItem('grid-scroll-top');
      if (saved) {
        scrollEl.scrollTop = Number(saved);
      }
    } else {
      sessionStorage.removeItem('grid-scroll-top');
    }

    // Save scroll position on scroll (debounced)
    let timer: ReturnType<typeof setTimeout>;
    const onScroll = () => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        sessionStorage.setItem('grid-scroll-top', String(scrollEl.scrollTop));
      }, 100);
    };
    scrollEl.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      clearTimeout(timer);
      scrollEl.removeEventListener('scroll', onScroll);
    };
  }, [mounted]);

  useEffect(() => {
    const handleResize = () => {
      dispatch({
        type: 'RESIZE',
        containerWidth: containerRef.current
          ? containerRef.current.offsetWidth
          : Math.min(window.innerWidth, 1280),
        columnCount: getColumnCount(),
        gridHeight: window.innerHeight * 0.82,
        imageHeight: getImageHeight(),
        rowHeight: getRowHeight(),
      });
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (containerRef.current) {
      dispatch({ type: 'SET_CONTAINER_WIDTH', containerWidth: containerRef.current.offsetWidth });
    }
  }, [state.columnCount]);

  useEffect(() => {
    if (products && products.length > 0) dispatch({ type: 'LOADED' });
  }, [products]);

  let cardWidth = Math.floor((state.containerWidth - (state.columnCount + 1)) / state.columnCount);
  cardWidth = Math.min(cardWidth, 480);
  const actualGridWidth = cardWidth * state.columnCount + (state.columnCount + 1);

  const rowCount = state.isLoading
    ? Math.ceil(SKELETON_COUNT / state.columnCount)
    : Math.ceil(products.length / state.columnCount);

  if (!mounted) return <div style={{ height: 800 }} />;

  return (
    <div ref={containerRef} className="w-full flex justify-center">
      <div ref={gridRef} style={{ width: actualGridWidth }}>
        <Grid<CellCustomProps>
          cellComponent={Cell}
          cellProps={{ products, cartItems, addToCart, removeFromCart, columnCount: state.columnCount, cardWidth, isLoading: state.isLoading, imageHeight: state.imageHeight, rowHeight: state.rowHeight }}
          columnCount={state.columnCount}
          columnWidth={cardWidth}
          rowCount={rowCount}
          rowHeight={state.rowHeight}
          style={{ height: state.gridHeight, width: actualGridWidth }}
        />
      </div>
    </div>
  );
}
