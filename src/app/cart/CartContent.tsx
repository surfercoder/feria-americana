"use client";
import { useCart } from '../cart-context';
import type { Product } from '@/lib/products';
import Image from 'next/image';
import Link from 'next/link';
import { useReducer, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { z } from 'zod';
import { ArrowLeft, ShoppingBag, Trash2, X } from 'lucide-react';

const orderSchema = z.object({
  name: z.string().min(2, 'Por favor ingresa tu nombre.'),
  email: z.string().email('Por favor ingresa un email válido.'),
  phone: z.string().min(6, 'Por favor ingresa un teléfono válido.'),
});

type FieldErrors = { name?: string; email?: string; phone?: string };

type FormState = {
  showCheckout: boolean;
  name: string;
  email: string;
  phone: string;
  loading: boolean;
  error: string;
  fieldErrors: FieldErrors;
};

type FormAction =
  | { type: 'SET_FIELD'; field: 'name' | 'email' | 'phone'; value: string }
  | { type: 'SET_FIELD_ERRORS'; fieldErrors: FieldErrors }
  | { type: 'SET_ERROR'; error: string }
  | { type: 'SHOW_CHECKOUT' }
  | { type: 'HIDE_CHECKOUT' }
  | { type: 'SUBMIT_START' }
  | { type: 'SUBMIT_ERROR'; error: string }
  | { type: 'RESET' };

const initialFormState: FormState = {
  showCheckout: false,
  name: '',
  email: '',
  phone: '',
  loading: false,
  error: '',
  fieldErrors: {},
};

function formReducer(state: FormState, action: FormAction): FormState {
  switch (action.type) {
    case 'SET_FIELD':
      return { ...state, [action.field]: action.value };
    case 'SET_FIELD_ERRORS':
      return { ...state, fieldErrors: action.fieldErrors };
    case 'SET_ERROR':
      return { ...state, error: action.error };
    case 'SHOW_CHECKOUT':
      return { ...state, showCheckout: true };
    case 'HIDE_CHECKOUT':
      return { ...state, showCheckout: false };
    case 'SUBMIT_START':
      return { ...state, loading: true, error: '', fieldErrors: {} };
    case 'SUBMIT_ERROR':
      return { ...state, loading: false, error: action.error };
    case 'RESET':
      return initialFormState;
    default:
      return state;
  }
}

export default function CartContent({ products }: { products: Product[] }) {
  const { cartItems, removeFromCart, clearCart } = useCart();
  const [form, dispatch] = useReducer(formReducer, initialFormState);
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);

  const cartProducts = products.filter((p) => cartItems.includes(p.id));
  const total = cartProducts.reduce((sum, p) => {
    const price = Number(p.price.replace(/[^\d]/g, '')) || 0;
    return sum + price;
  }, 0);

  const handleBlur = (field: 'name' | 'email' | 'phone') => {
    const result = orderSchema.safeParse({ name: form.name, email: form.email, phone: form.phone });
    if (!result.success) {
      const error = result.error.issues.find(e => e.path[0] === field);
      dispatch({ type: 'SET_FIELD_ERRORS', fieldErrors: { ...form.fieldErrors, [field]: error ? error.message : undefined } });
    } else {
      dispatch({ type: 'SET_FIELD_ERRORS', fieldErrors: { ...form.fieldErrors, [field]: undefined } });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    dispatch({ type: 'SUBMIT_START' });

    const result = orderSchema.safeParse({ name: form.name, email: form.email, phone: form.phone });
    if (!result.success) {
      const errors: FieldErrors = {};
      for (const err of result.error.issues) {
        errors[err.path[0] as 'name' | 'email' | 'phone'] = err.message;
      }
      dispatch({ type: 'SET_FIELD_ERRORS', fieldErrors: errors });
      return;
    }

    try {
      const res = await fetch('/api/send-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          phone: form.phone,
          products: cartProducts,
          total,
        }),
      });
      if (!res.ok) {
        const data = await res.json();
        if (res.status === 409) {
          dispatch({ type: 'SUBMIT_ERROR', error: data.error || 'Algunos productos ya fueron vendidos.' });
          return;
        }
        throw new Error(data.error || 'No se pudo enviar el pedido.');
      }
      clearCart();
      dispatch({ type: 'RESET' });
      if (formRef.current) formRef.current.reset();
      router.push('/thanks');
    } catch {
      dispatch({ type: 'SUBMIT_ERROR', error: 'Hubo un error al enviar el pedido. Intenta de nuevo.' });
    }
  };

  if (cartProducts.length === 0) {
    return (
      <div className="min-h-screen flex flex-col">
        <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between py-5">
              <Link href="/" className="text-left">
                <h1 className="font-serif text-2xl sm:text-3xl tracking-wide uppercase">
                  Feria Americana
                </h1>
              </Link>
            </div>
          </div>
        </header>
        <main className="flex-1 flex flex-col items-center justify-center gap-6 px-4">
          <ShoppingBag className="w-16 h-16 text-muted-foreground/40" strokeWidth={1} />
          <h2 className="font-serif text-2xl sm:text-3xl">Tu carrito esta vacio</h2>
          <Link
            href="/"
            className="mt-2 py-3 px-8 text-xs sm:text-sm tracking-[0.2em] uppercase transition-all duration-200 border border-primary text-primary hover:bg-primary hover:text-primary-foreground"
          >
            Explorar productos
          </Link>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between py-5">
            <Link href="/" className="text-left">
              <h1 className="font-serif text-2xl sm:text-3xl tracking-wide uppercase">
                Feria Americana
              </h1>
            </Link>
            <Link
              href="/"
              className="flex items-center gap-2 text-sm tracking-wide uppercase hover:text-gold transition-colors"
            >
              <ArrowLeft className="w-5 h-5" strokeWidth={1.5} />
              <span className="hidden sm:inline">Volver</span>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1 container mx-auto py-10 px-4">
        <h2 className="font-serif text-2xl sm:text-3xl text-center mb-10">Carrito</h2>

        {/* Cart Items */}
        <div className="max-w-3xl mx-auto">
          <div className="flex flex-col divide-y divide-border">
            {cartProducts.map((product) => (
              <div key={product.id} className="flex gap-4 sm:gap-6 py-6 first:pt-0 last:pb-0">
                {/* Thumbnail */}
                <Link href={`/product/${product.id}`} className="relative shrink-0 w-24 h-24 sm:w-32 sm:h-32 overflow-hidden rounded bg-muted">
                  <Image
                    src={`/images/${product.image}`}
                    alt={product.title}
                    fill
                    style={{ objectFit: 'cover' }}
                    className="rounded"
                    sizes="128px"
                  />
                </Link>

                {/* Details */}
                <div className="flex flex-1 flex-col justify-between min-w-0">
                  <div>
                    <Link href={`/product/${product.id}`}>
                      <h3 className="font-serif text-base sm:text-lg font-medium leading-tight">
                        {product.title}
                      </h3>
                    </Link>
                    {product.brand && (
                      <p className="text-[10px] sm:text-xs tracking-[0.15em] uppercase text-muted-foreground mt-1">
                        {product.brand}
                        {product.size && <span className="mx-1.5">|</span>}
                        {product.size}
                      </p>
                    )}
                    {product.color && (
                      <p className="text-[10px] sm:text-xs text-muted-foreground mt-0.5">{product.color}</p>
                    )}
                  </div>
                  <div className="flex items-end justify-between mt-2">
                    <p className="text-sm sm:text-base font-medium tracking-wide">
                      $ {product.price}
                    </p>
                    <button
                      onClick={() => removeFromCart(product.id)}
                      className="flex items-center gap-1.5 text-[10px] sm:text-xs tracking-[0.15em] uppercase text-muted-foreground hover:text-destructive transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" strokeWidth={1.5} />
                      <span className="hidden sm:inline">Eliminar</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div className="border-t border-border mt-8 pt-8">
            <div className="flex items-center justify-between mb-6">
              <span className="text-xs sm:text-sm tracking-[0.2em] uppercase text-muted-foreground">
                Total ({cartProducts.length} {cartProducts.length === 1 ? 'articulo' : 'articulos'})
              </span>
              <span className="font-serif text-xl sm:text-2xl font-medium">
                $ {total.toLocaleString()}
              </span>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={clearCart}
                className="flex-1 py-3 text-xs sm:text-sm tracking-[0.2em] uppercase transition-all duration-200 border border-border text-muted-foreground hover:text-foreground hover:border-foreground"
              >
                Vaciar carrito
              </button>
              <button
                onClick={() => dispatch({ type: 'SHOW_CHECKOUT' })}
                className="flex-1 py-3 text-xs sm:text-sm tracking-[0.2em] uppercase transition-all duration-200 border border-primary bg-primary text-primary-foreground hover:bg-primary/90"
              >
                Finalizar compra
              </button>
            </div>
          </div>

          {/* Checkout Form */}
          {form.showCheckout && (
            <div className="mt-10 border border-border rounded p-6 sm:p-8 bg-card">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-serif text-lg sm:text-xl">Datos para el pedido</h3>
                <button
                  onClick={() => dispatch({ type: 'HIDE_CHECKOUT' })}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  <X className="w-5 h-5" strokeWidth={1.5} />
                </button>
              </div>
              <form ref={formRef} onSubmit={handleSubmit} className="flex flex-col gap-5">
                <div>
                  <label htmlFor="checkout-name" className="block text-[10px] sm:text-xs tracking-[0.2em] uppercase text-muted-foreground mb-2">
                    Nombre
                  </label>
                  <input
                    id="checkout-name"
                    type="text"
                    placeholder="Tu nombre"
                    className="w-full border border-border bg-background rounded px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-ring transition-shadow"
                    value={form.name}
                    onChange={e => dispatch({ type: 'SET_FIELD', field: 'name', value: e.target.value })}
                    onBlur={() => handleBlur('name')}
                  />
                  {form.fieldErrors.name && <p className="text-destructive text-xs mt-1.5">{form.fieldErrors.name}</p>}
                </div>
                <div>
                  <label htmlFor="checkout-email" className="block text-[10px] sm:text-xs tracking-[0.2em] uppercase text-muted-foreground mb-2">
                    Email
                  </label>
                  <input
                    id="checkout-email"
                    type="email"
                    placeholder="Tu email"
                    className="w-full border border-border bg-background rounded px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-ring transition-shadow"
                    value={form.email}
                    onChange={e => dispatch({ type: 'SET_FIELD', field: 'email', value: e.target.value })}
                    onBlur={() => handleBlur('email')}
                  />
                  {form.fieldErrors.email && <p className="text-destructive text-xs mt-1.5">{form.fieldErrors.email}</p>}
                </div>
                <div>
                  <label htmlFor="checkout-phone" className="block text-[10px] sm:text-xs tracking-[0.2em] uppercase text-muted-foreground mb-2">
                    Telefono
                  </label>
                  <input
                    id="checkout-phone"
                    type="tel"
                    placeholder="Tu telefono"
                    className="w-full border border-border bg-background rounded px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-ring transition-shadow"
                    value={form.phone}
                    onChange={e => dispatch({ type: 'SET_FIELD', field: 'phone', value: e.target.value })}
                    onBlur={() => handleBlur('phone')}
                  />
                  {form.fieldErrors.phone && <p className="text-destructive text-xs mt-1.5">{form.fieldErrors.phone}</p>}
                </div>
                {form.error && <p className="text-destructive text-sm text-center">{form.error}</p>}
                <button
                  type="submit"
                  disabled={form.loading}
                  className="w-full py-3 mt-2 text-xs sm:text-sm tracking-[0.2em] uppercase transition-all duration-200 border border-primary bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 disabled:pointer-events-none"
                >
                  {form.loading ? 'Enviando...' : 'Enviar pedido'}
                </button>
              </form>
            </div>
          )}

          {/* Continue shopping link */}
          <div className="text-center mt-10">
            <Link
              href="/"
              className="text-xs sm:text-sm tracking-[0.15em] uppercase text-muted-foreground hover:text-foreground transition-colors"
            >
              Seguir comprando
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
