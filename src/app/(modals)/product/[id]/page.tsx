import { getProductById, getAllProducts } from '@/lib/products';
import Image from 'next/image';
import Link from 'next/link';
import AddToCartButton from './AddToCartButton';
import { CartLink, BackLink } from './BackButton';
import type { Metadata } from 'next';

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const product = await getProductById(id);
  if (!product) {
    return { title: 'Producto no encontrado' };
  }
  return {
    title: product.title,
    description: product.description || `${product.title} — ${product.brand ?? ''} ${product.size ?? ''}`.trim(),
  };
}

export async function generateStaticParams() {
  const products = await getAllProducts();
  return products.map((product) => ({ id: String(product.id) }));
}

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = await getProductById(id);

  if (!product) {
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
        <main className="flex-1 flex items-center justify-center">
          <p className="text-muted-foreground text-lg">Producto no encontrado.</p>
        </main>
      </div>
    );
  }

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
            <CartLink />
          </div>
        </div>
      </header>

      <main className="flex-1 container mx-auto py-8 px-4">
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Product Image */}
          <div className="relative aspect-square w-full overflow-hidden rounded bg-muted">
            <Image
              src={`/images/${product.image}`}
              alt={product.title}
              fill
              style={{ objectFit: 'cover' }}
              className={`rounded${product.status === 'vendido' ? ' opacity-50' : ''}`}
              sizes="(max-width: 768px) 100vw, 50vw"
              placeholder="blur"
              blurDataURL="data:image/webp;base64,UklGRiIAAABXRUJQVlA4ICwAAAAwAQCdASoEAAQAAVAfJZgCdAEOkAQA"
              priority
            />
            {product.status === 'vendido' && (
              <span
                className="absolute top-6 -right-10 bg-red-600 text-white text-sm sm:text-base px-12 py-1.5 font-bold tracking-wide uppercase z-10 shadow-lg"
                style={{ transform: 'rotate(45deg)' }}
              >
                VENDIDO
              </span>
            )}
          </div>

          {/* Product Details */}
          <div className="flex flex-col justify-center gap-4">
            <h2 className="font-serif text-2xl sm:text-3xl font-medium leading-tight">
              {product.title}
            </h2>

            {product.brand && (
              <p className="text-xs sm:text-sm tracking-[0.15em] uppercase text-muted-foreground">
                {product.brand}
              </p>
            )}

            {product.description && (
              <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                {product.description}
              </p>
            )}

            <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground">
              {product.size && (
                <span>
                  <span className="tracking-[0.15em] uppercase text-xs">Talle:</span>{' '}
                  {product.size}
                </span>
              )}
              {product.color && (
                <span>
                  <span className="tracking-[0.15em] uppercase text-xs">Color:</span>{' '}
                  {product.color}
                </span>
              )}
            </div>

            <p className="text-xl sm:text-2xl font-medium tracking-wide mt-2">
              $ {product.price}
            </p>

            <AddToCartButton productId={product.id} isSold={product.status === 'vendido'} />

            <BackLink />
          </div>
        </div>
      </main>
    </div>
  );
}
