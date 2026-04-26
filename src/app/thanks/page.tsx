import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Gracias por tu compra',
  description: 'Tu pedido fue recibido. Pronto nos pondremos en contacto para coordinar la entrega.',
};

export default function ThanksPage() {
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
      <main className="flex-1 flex flex-col items-center justify-center gap-6 px-4 text-center">
        <h2 className="font-serif text-2xl sm:text-3xl">Gracias por tu compra!</h2>
        <p className="text-sm sm:text-base text-muted-foreground leading-relaxed max-w-md">
          Pronto me pondre en contacto contigo para coordinar la entrega y el pago. Gracias por confiar en Feria Americana!
        </p>
        <Link
          href="/"
          className="mt-2 py-3 px-8 text-xs sm:text-sm tracking-[0.2em] uppercase transition-all duration-200 border border-primary text-primary hover:bg-primary hover:text-primary-foreground"
        >
          Volver a la tienda
        </Link>
      </main>
    </div>
  );
}
