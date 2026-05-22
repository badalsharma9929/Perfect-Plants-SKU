'use client';

import {
  ArrowLeft,
  BadgeIndianRupee,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  CreditCard,
  Heart,
  Menu,
  Minus,
  PackageCheck,
  Plus,
  Radio,
  RotateCcw,
  Search,
  ShieldCheck,
  ShoppingBag,
  ShoppingCart,
  Sparkles,
  Star,
  Truck,
  User,
  X,
} from 'lucide-react';
import {useMemo, useState} from 'react';
import {useStorefrontRealtime} from '@/hooks/useStorefrontRealtime';
import {formatCurrency} from '@/lib/format';
import {
  StorefrontProduct,
  StorefrontSection,
  getProductsBySection,
  getSectionById,
  storefrontProducts,
  storefrontSections,
} from '@/lib/storefront-products';

type CartItem = {
  product: StorefrontProduct;
  quantity: number;
  bundleSelected: boolean;
};

type ViewMode = 'home' | 'section' | 'product' | 'cart' | 'checkout' | 'success';

const fallbackImage =
  'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="900" height="900" viewBox="0 0 900 900"%3E%3Crect width="900" height="900" fill="%23f6f1ea"/%3E%3Cpath d="M188 628h524L574 438 469 566l-71-91-210 153Z" fill="%23ddd6fe"/%3E%3Ccircle cx="605" cy="285" r="62" fill="%23c4b5fd"/%3E%3Ctext x="450" y="740" text-anchor="middle" font-family="Arial" font-size="38" fill="%236d28d9"%3EHome decor%3C/text%3E%3C/svg%3E';

export function ShoppingRealtimeClient() {
  const [view, setView] = useState<ViewMode>('home');
  const [query, setQuery] = useState('');
  const [selectedSectionId, setSelectedSectionId] = useState(storefrontSections[0]!.id);
  const [selectedProduct, setSelectedProduct] = useState<StorefrontProduct>(storefrontProducts[0]!);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [bundleOfferOpen, setBundleOfferOpen] = useState(false);
  const [customerName, setCustomerName] = useState('Aarav Sharma');
  const [phone, setPhone] = useState('9876543210');
  const [address, setAddress] = useState('Bandra West, Mumbai, Maharashtra');
  const {stats, trackProductView, trackCartAdd, trackCheckout, resetStats} = useStorefrontRealtime();

  const selectedSection = useMemo(() => getSectionById(selectedSectionId), [selectedSectionId]);
  const sectionProducts = useMemo(() => getProductsBySection(selectedSectionId), [selectedSectionId]);
  const filteredProducts = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    if (!normalizedQuery) return sectionProducts;

    return storefrontProducts.filter((product) =>
      `${product.name} ${product.category} ${product.brand}`.toLowerCase().includes(normalizedQuery),
    );
  }, [query, sectionProducts]);

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totals = useMemo(() => getTotals(cart), [cart]);
  const checkoutOfferProduct =
    cart.find((item) => !item.bundleSelected)?.product ?? cart[0]?.product ?? selectedProduct;

  function handleSearch(value: string) {
    setQuery(value);
    if (value.trim()) {
      setView('section');
    }
  }

  function openSection(sectionId: string) {
    setSelectedSectionId(sectionId);
    setQuery('');
    setView('section');
  }

  function openProduct(product: StorefrontProduct) {
    setSelectedProduct(product);
    setSelectedSectionId(product.sectionId);
    setSelectedImage(0);
    setQuantity(1);
    setView('product');
    trackProductView(product.name);
  }

  function addToCart(product: StorefrontProduct, bundleSelected = false, amount = 1, openDrawer = true) {
    setCart((items) => {
      const existing = items.find(
        (item) => item.product.id === product.id && item.bundleSelected === bundleSelected,
      );
      if (existing) {
        return items.map((item) =>
          item === existing ? {...item, quantity: item.quantity + amount} : item,
        );
      }
      return [...items, {product, quantity: amount, bundleSelected}];
    });

    trackCartAdd(product.name, (product.price + (bundleSelected ? product.bundle.companionPrice : 0)) * amount);
    if (openDrawer) setDrawerOpen(true);
  }

  function upgradeToBundle(product: StorefrontProduct, openDrawer = false) {
    const plainItem = cart.find((item) => item.product.id === product.id && !item.bundleSelected);
    const bundleItem = cart.find((item) => item.product.id === product.id && item.bundleSelected);
    const upgradedQuantity = plainItem?.quantity ?? 1;
    const shouldTrack = Boolean(plainItem || !bundleItem);

    setCart((items) => {
      const currentPlainItem = items.find((item) => item.product.id === product.id && !item.bundleSelected);
      const currentBundleItem = items.find((item) => item.product.id === product.id && item.bundleSelected);

      if (currentPlainItem) {
        const withoutPlainItem = items.filter((item) => item !== currentPlainItem);
        if (currentBundleItem) {
          return withoutPlainItem.map((item) =>
            item === currentBundleItem ? {...item, quantity: item.quantity + currentPlainItem.quantity} : item,
          );
        }
        return [...withoutPlainItem, {product, quantity: currentPlainItem.quantity, bundleSelected: true}];
      }

      if (currentBundleItem) return items;
      return [...items, {product, quantity: 1, bundleSelected: true}];
    });

    if (shouldTrack) {
      const trackedValue = plainItem
        ? product.bundle.companionPrice * upgradedQuantity
        : getLineTotal({product, quantity: 1, bundleSelected: true});
      trackCartAdd(`${product.name} bundle`, trackedValue);
    }
    if (openDrawer) setDrawerOpen(true);
  }

  function updateQuantity(productId: string, bundleSelected: boolean, direction: 1 | -1) {
    setCart((items) =>
      items
        .map((item) =>
          item.product.id === productId && item.bundleSelected === bundleSelected
            ? {...item, quantity: Math.max(0, item.quantity + direction)}
            : item,
        )
        .filter((item) => item.quantity > 0),
    );
  }

  function removeItem(productId: string, bundleSelected: boolean) {
    setCart((items) =>
      items.filter((item) => !(item.product.id === productId && item.bundleSelected === bundleSelected)),
    );
  }

  function requestCheckout() {
    if (!cart.length) return;
    setDrawerOpen(false);
    if (!cart.some((item) => !item.bundleSelected)) {
      setView('checkout');
      return;
    }
    setBundleOfferOpen(true);
  }

  function acceptBundleAndCheckout() {
    if (checkoutOfferProduct) {
      upgradeToBundle(checkoutOfferProduct, false);
    }
    setBundleOfferOpen(false);
    setView('checkout');
  }

  function skipBundleAndCheckout() {
    setBundleOfferOpen(false);
    setView('checkout');
  }

  function placeOrder() {
    if (!cart.length) return;
    const heroProduct = cart[0]?.product.name ?? 'Home decor order';
    trackCheckout(
      totals.total,
      totals.bundleValue,
      heroProduct,
      cart.map((item) => ({
        productId: item.product.id,
        productName: item.product.name,
        category: item.product.category,
        sectionId: item.product.sectionId,
        quantity: item.quantity,
        lineRevenue: getLineTotal(item),
        bundleValue: item.bundleSelected ? item.product.bundle.companionPrice * item.quantity : 0,
        bundleSelected: item.bundleSelected,
        companionName: item.bundleSelected ? item.product.bundle.companionName : undefined,
      })),
    );
    setCart([]);
    setDrawerOpen(false);
    setView('success');
  }

  return (
    <div className="space-y-6">
      <StoreHeader
        cartCount={cartCount}
        query={query}
        setQuery={handleSearch}
        goHome={() => {
          setQuery('');
          setView('home');
        }}
        goShop={() => openSection(selectedSectionId)}
        openCart={() => setView('cart')}
      />

      <RealtimeStrip stats={stats} onReset={resetStats} />

      {view === 'home' ? (
        <ShoppingHome sections={storefrontSections} openSection={openSection} openProduct={openProduct} />
      ) : null}

      {view === 'section' ? (
        <SectionProducts
          section={selectedSection}
          products={filteredProducts}
          query={query}
          clearSearch={() => setQuery('')}
          goHome={() => setView('home')}
          openProduct={openProduct}
          addToCart={addToCart}
          upgradeToBundle={upgradeToBundle}
        />
      ) : null}

      {view === 'product' ? (
        <ProductPage
          product={selectedProduct}
          section={selectedSection}
          selectedImage={selectedImage}
          setSelectedImage={setSelectedImage}
          quantity={quantity}
          setQuantity={setQuantity}
          addToCart={addToCart}
          buyNow={() => {
            addToCart(selectedProduct, false, quantity, false);
            setDrawerOpen(false);
            setBundleOfferOpen(true);
          }}
          openProduct={openProduct}
          addAllBundle={upgradeToBundle}
          backToSection={() => openSection(selectedProduct.sectionId)}
        />
      ) : null}

      {view === 'cart' ? (
        <CartPage
          cart={cart}
          totals={totals}
          updateQuantity={updateQuantity}
          removeItem={removeItem}
          continueShopping={() => openSection(selectedSectionId)}
          checkout={requestCheckout}
        />
      ) : null}

      {view === 'checkout' ? (
        <CheckoutPage
          cart={cart}
          totals={totals}
          customerName={customerName}
          setCustomerName={setCustomerName}
          phone={phone}
          setPhone={setPhone}
          address={address}
          setAddress={setAddress}
          back={() => setView('cart')}
          placeOrder={placeOrder}
        />
      ) : null}

      {view === 'success' ? (
        <SuccessView total={stats.lastOrderValue} continueShopping={() => setView('home')} />
      ) : null}

      <CartDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        cart={cart}
        totals={totals}
        updateQuantity={updateQuantity}
        removeItem={removeItem}
        checkout={requestCheckout}
        viewCart={() => {
          setDrawerOpen(false);
          setView('cart');
        }}
      />

      <BundleOfferModal
        open={bundleOfferOpen}
        product={checkoutOfferProduct}
        onAccept={acceptBundleAndCheckout}
        onSkip={skipBundleAndCheckout}
      />
    </div>
  );
}

function StoreHeader({
  cartCount,
  query,
  setQuery,
  goHome,
  goShop,
  openCart,
}: {
  cartCount: number;
  query: string;
  setQuery: (value: string) => void;
  goHome: () => void;
  goShop: () => void;
  openCart: () => void;
}) {
  return (
    <header className="rounded-2xl border border-line bg-white shadow-card">
      <div className="flex h-16 items-center gap-4 px-4 sm:px-5">
        <button className="grid h-10 w-10 place-items-center rounded-xl border border-line lg:hidden" aria-label="Open menu">
          <Menu className="h-4 w-4" />
        </button>
        <button onClick={goHome} className="flex items-center gap-2">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-emerald-50 text-success">
            <Sparkles className="h-4 w-4" />
          </span>
          <span className="text-base font-black text-ink">Perfect Homes</span>
        </button>
        <nav className="ml-8 hidden items-center gap-8 text-sm font-bold text-gray-600 lg:flex">
          <button onClick={goHome} className="hover:text-brand">Home</button>
          <button onClick={goShop} className="hover:text-brand">Shop</button>
          <button onClick={goShop} className="inline-flex items-center gap-2 hover:text-brand">
            Decor <span className="rounded-full bg-brand-soft px-2 py-0.5 text-[10px] text-brand">New</span>
          </button>
          <button onClick={goShop} className="hover:text-brand">Collections</button>
          <button className="hover:text-brand">Track Order</button>
        </nav>

        <div className="relative ml-auto hidden w-full max-w-sm md:block">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            className="h-10 w-full rounded-xl border border-line bg-gray-50 pl-10 pr-3 text-sm outline-none focus:border-brand focus:bg-white focus:ring-4 focus:ring-brand/10"
            placeholder="Search sofas, lamps, tables"
          />
        </div>

        <button className="grid h-10 w-10 place-items-center rounded-xl border border-line" aria-label="Account">
          <User className="h-4 w-4" />
        </button>
        <button onClick={openCart} className="relative grid h-10 w-10 place-items-center rounded-xl border border-line" aria-label="Open cart">
          <ShoppingBag className="h-4 w-4" />
          <span className="absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-brand px-1 text-[11px] font-black text-white">
            {cartCount}
          </span>
        </button>
      </div>
    </header>
  );
}

function RealtimeStrip({
  stats,
  onReset,
}: {
  stats: ReturnType<typeof useStorefrontRealtime>['stats'];
  onReset: () => void;
}) {
  return (
    <section className="rounded-2xl border border-line bg-white p-4 shadow-card">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-xs font-black text-success">
            <Radio className="h-3.5 w-3.5" />
            Realtime synced across tabs
          </div>
          <p className="mt-2 text-sm text-muted">
            Campaign money and NLP update only after checkout is completed.
          </p>
        </div>
        <div className="grid flex-1 gap-3 sm:grid-cols-5">
          <MiniMetric label="Views" value={stats.productViews.toLocaleString('en-IN')} />
          <MiniMetric label="Cart adds" value={stats.cartAdds.toLocaleString('en-IN')} />
          <MiniMetric label="Checkouts" value={stats.checkouts.toLocaleString('en-IN')} />
          <MiniMetric label="Campaign money" value={formatCurrency(stats.campaignRevenue)} />
          <MiniMetric label="NLP" value={formatCurrency(stats.netLiftProfit)} />
        </div>
        <button
          onClick={onReset}
          className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-line px-3 text-sm font-black text-ink hover:bg-gray-50"
        >
          <RotateCcw className="h-4 w-4" />
          Reset
        </button>
      </div>
    </section>
  );
}

function MiniMetric({label, value}: {label: string; value: string}) {
  return (
    <div className="rounded-xl bg-gray-50 p-3">
      <p className="text-[11px] font-black uppercase tracking-normal text-muted">{label}</p>
      <p className="mt-1 text-lg font-black text-ink">{value}</p>
    </div>
  );
}

function ShoppingHome({
  sections,
  openSection,
  openProduct,
}: {
  sections: StorefrontSection[];
  openSection: (sectionId: string) => void;
  openProduct: (product: StorefrontProduct) => void;
}) {
  const featuredProducts = storefrontProducts.slice(0, 5);

  return (
    <div className="space-y-6">
      <section className="overflow-hidden rounded-2xl border border-line bg-white shadow-card">
        <div className="grid lg:grid-cols-[0.95fr_1.05fr]">
          <div className="p-6 sm:p-8 lg:p-10">
            <div className="inline-flex items-center gap-2 rounded-full bg-brand-soft px-3 py-1 text-xs font-black text-brand">
              <PackageCheck className="h-3.5 w-3.5" />
              Fast section shopping
            </div>
            <h1 className="mt-5 max-w-xl text-4xl font-black tracking-normal text-ink sm:text-5xl">
              Shop complete home decor rooms in three quick sections.
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-7 text-muted">
              Choose a section, view five curated products, open the product page, add to cart, and see a checkout bundle offer before payment.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              {sections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => openSection(section.id)}
                  className="rounded-xl border border-line bg-white px-4 py-3 text-sm font-black text-ink shadow-sm transition hover:-translate-y-0.5 hover:border-brand hover:text-brand"
                >
                  {section.name}
                </button>
              ))}
            </div>
          </div>
          <div className="grid min-h-[340px] grid-cols-2 gap-3 bg-gradient-to-br from-brand-soft via-white to-emerald-50 p-4 sm:p-6">
            {featuredProducts.slice(0, 4).map((product, index) => (
              <button
                key={product.id}
                onClick={() => openProduct(product)}
                className={`group overflow-hidden rounded-2xl border border-white bg-white text-left shadow-card transition hover:-translate-y-1 ${
                  index === 0 ? 'row-span-2' : ''
                }`}
              >
                <ProductImage image={product.images[0]} alt={product.name} className="h-full min-h-36" />
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-3">
        {sections.map((section) => {
          const products = getProductsBySection(section.id);
          return (
            <article key={section.id} className={`overflow-hidden rounded-2xl border border-line bg-gradient-to-br ${section.accent} shadow-card`}>
              <button onClick={() => openSection(section.id)} className="block w-full text-left">
                <div className="relative">
                  <ProductImage image={section.heroImage} alt={section.name} className="aspect-[1.55/1]" />
                  <span className="absolute left-4 top-4 rounded-full bg-white/95 px-3 py-1 text-xs font-black text-brand shadow-sm">
                    {products.length} products
                  </span>
                </div>
                <div className="p-5">
                  <p className="text-xs font-black uppercase tracking-normal text-muted">{section.eyebrow}</p>
                  <h2 className="mt-2 text-2xl font-black text-ink">{section.name}</h2>
                  <p className="mt-2 text-sm leading-6 text-muted">{section.description}</p>
                  <span className="mt-4 inline-flex items-center gap-2 text-sm font-black text-brand">
                    View section <ChevronRight className="h-4 w-4" />
                  </span>
                </div>
              </button>
            </article>
          );
        })}
      </section>
    </div>
  );
}

function SectionProducts({
  section,
  products,
  query,
  clearSearch,
  goHome,
  openProduct,
  addToCart,
  upgradeToBundle,
}: {
  section: StorefrontSection;
  products: StorefrontProduct[];
  query: string;
  clearSearch: () => void;
  goHome: () => void;
  openProduct: (product: StorefrontProduct) => void;
  addToCart: (product: StorefrontProduct, bundleSelected?: boolean, amount?: number, openDrawer?: boolean) => void;
  upgradeToBundle: (product: StorefrontProduct, openDrawer?: boolean) => void;
}) {
  const hasSearch = Boolean(query.trim());

  return (
    <section className="rounded-2xl border border-line bg-white p-5 shadow-card">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <button onClick={goHome} className="mb-4 inline-flex items-center gap-2 text-sm font-black text-muted hover:text-brand">
            <ArrowLeft className="h-4 w-4" />
            Back to sections
          </button>
          <p className="text-xs font-black uppercase tracking-normal text-brand">
            {hasSearch ? 'Search results' : section.eyebrow}
          </p>
          <h2 className="mt-2 text-3xl font-black text-ink">
            {hasSearch ? `Results for "${query}"` : section.name}
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-muted">
            {hasSearch
              ? `${products.length} matching products across all sections.`
              : 'Five curated products in this section. Open any product to see the full page and checkout offer flow.'}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {hasSearch ? (
            <button onClick={clearSearch} className="rounded-xl border border-line px-3 py-2 text-sm font-black text-ink">
              Clear search
            </button>
          ) : null}
          <button className="inline-flex items-center gap-2 rounded-xl border border-line px-3 py-2 text-sm font-black text-ink">
            Sort by <ChevronDown className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            openProduct={openProduct}
            addToCart={addToCart}
            upgradeToBundle={upgradeToBundle}
          />
        ))}
      </div>
    </section>
  );
}

function ProductCard({
  product,
  openProduct,
  addToCart,
  upgradeToBundle,
}: {
  product: StorefrontProduct;
  openProduct: (product: StorefrontProduct) => void;
  addToCart: (product: StorefrontProduct, bundleSelected?: boolean, amount?: number, openDrawer?: boolean) => void;
  upgradeToBundle: (product: StorefrontProduct, openDrawer?: boolean) => void;
}) {
  const discountPercent = Math.round(((product.compareAt - product.price) / product.compareAt) * 100);

  return (
    <article className="overflow-hidden rounded-2xl border border-line bg-white transition hover:-translate-y-1 hover:shadow-card">
      <button onClick={() => openProduct(product)} className="block w-full text-left">
        <div className="relative bg-gray-100">
          <ProductImage image={product.images[0]} alt={product.name} className="aspect-[1.08/1]" />
          <span className="absolute left-3 top-3 rounded-full bg-success px-2.5 py-1 text-[11px] font-black text-white">
            {discountPercent}% OFF
          </span>
          <Heart className="absolute right-3 top-3 h-4 w-4 text-muted" />
        </div>
        <div className="p-4">
          <p className="text-xs font-black uppercase tracking-normal text-muted">{product.category}</p>
          <h3 className="mt-1 min-h-12 text-base font-black text-ink">{product.name}</h3>
          <Rating rating={product.rating} reviews={product.reviews} compact />
          <div className="mt-3 flex flex-wrap items-end gap-2">
            <span className="text-lg font-black text-ink">{formatCurrency(product.price)}</span>
            <span className="text-xs font-bold text-muted line-through">{formatCurrency(product.compareAt)}</span>
          </div>
        </div>
      </button>
      <div className="grid grid-cols-2 gap-2 p-4 pt-0">
        <button
          onClick={() => addToCart(product, false, 1, true)}
          className="h-10 rounded-xl border border-line text-sm font-black text-ink hover:bg-gray-50"
        >
          Add item
        </button>
        <button
          onClick={() => upgradeToBundle(product, true)}
          className="h-10 rounded-xl bg-brand text-sm font-black text-white shadow-button"
        >
          Bundle
        </button>
      </div>
    </article>
  );
}

function ProductPage({
  product,
  section,
  selectedImage,
  setSelectedImage,
  quantity,
  setQuantity,
  addToCart,
  buyNow,
  openProduct,
  addAllBundle,
  backToSection,
}: {
  product: StorefrontProduct;
  section: StorefrontSection;
  selectedImage: number;
  setSelectedImage: (value: number) => void;
  quantity: number;
  setQuantity: (value: number) => void;
  addToCart: (product: StorefrontProduct, bundleSelected?: boolean, amount?: number, openDrawer?: boolean) => void;
  buyNow: () => void;
  openProduct: (product: StorefrontProduct) => void;
  addAllBundle: (product: StorefrontProduct, openDrawer?: boolean) => void;
  backToSection: () => void;
}) {
  const sameSection = storefrontProducts.filter((item) => item.sectionId === product.sectionId && item.id !== product.id);
  const recommended = (sameSection.length >= 5 ? sameSection : storefrontProducts.filter((item) => item.id !== product.id)).slice(0, 5);

  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-line bg-white p-4 shadow-card sm:p-5">
        <div className="mb-4 flex flex-wrap items-center gap-2 text-xs font-bold text-muted">
          <button onClick={backToSection} className="inline-flex items-center gap-2 text-brand">
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to {section.name}
          </button>
          <ChevronRight className="h-3 w-3" />
          <span>{product.category}</span>
          <ChevronRight className="h-3 w-3" />
          <span className="text-ink">{product.name}</span>
        </div>

        <div className="grid gap-8 xl:grid-cols-[1.08fr_0.92fr]">
          <div className="grid gap-4 md:grid-cols-[82px_1fr]">
            <div className="order-2 grid grid-cols-4 gap-3 md:order-1 md:grid-cols-1">
              {product.images.map((image, index) => (
                <button
                  key={image}
                  onClick={() => setSelectedImage(index)}
                  className={`overflow-hidden rounded-xl border bg-gray-100 ${
                    selectedImage === index ? 'border-brand ring-4 ring-brand/10' : 'border-line'
                  }`}
                >
                  <ProductImage image={image} alt={`${product.name} ${index + 1}`} className="aspect-square" />
                </button>
              ))}
            </div>
            <div className="relative order-1 overflow-hidden rounded-2xl bg-[#f5eadf] md:order-2">
              <span className="absolute left-4 top-4 z-10 rounded-lg bg-success px-3 py-1 text-xs font-black text-white">
                {Math.round(((product.compareAt - product.price) / product.compareAt) * 100)}% OFF
              </span>
              <ProductImage image={product.images[selectedImage] ?? product.images[0]} alt={product.name} className="aspect-[1.18/1]" />
            </div>

            <div className="md:col-start-2">
              <div className="grid grid-cols-4 gap-2 rounded-2xl border border-line p-3 text-center text-[11px] font-bold text-muted">
                <span>Handcrafted</span>
                <span>Premium Quality</span>
                <span>Secure Packaging</span>
                <span>Easy Returns</span>
              </div>
            </div>
          </div>

          <div className="pt-1">
            <h1 className="text-3xl font-black tracking-normal text-ink">{product.name}</h1>
            <div className="mt-3 flex flex-wrap items-center gap-3">
              <Rating rating={product.rating} reviews={product.reviews} />
              <span className="rounded-full bg-brand-soft px-3 py-1 text-xs font-black text-brand">Bestseller</span>
            </div>
            <div className="mt-4 flex flex-wrap items-end gap-3">
              <span className="text-lg font-bold text-muted line-through">{formatCurrency(product.compareAt)}</span>
              <span className="text-3xl font-black text-rose-600">{formatCurrency(product.price)}</span>
              <span className="mb-1 rounded-lg bg-emerald-50 px-3 py-1 text-sm font-black text-success">
                {Math.round(((product.compareAt - product.price) / product.compareAt) * 100)}% OFF
              </span>
            </div>
            <p className="mt-2 text-sm font-bold text-success">
              You save {formatCurrency(product.compareAt - product.price)} today.
            </p>

            <div className="mt-5 rounded-xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm font-bold text-success">
              A heavy bundle discount appears before checkout, so customers can add the matching product at the right moment.
            </div>

            <ul className="mt-5 space-y-3 text-sm font-semibold text-gray-700">
              {product.highlights.map((highlight) => (
                <li key={highlight} className="flex gap-3">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-muted" />
                  {highlight}
                </li>
              ))}
            </ul>

            <p className="mt-5 text-sm font-black text-success">In Stock - Only 12 left</p>

            <div className="mt-5 grid gap-3 sm:grid-cols-[96px_1fr]">
              <QuantityControl quantity={quantity} setQuantity={setQuantity} />
              <button
                onClick={() => addToCart(product, false, quantity, true)}
                className="h-12 rounded-xl bg-brand text-sm font-black text-white shadow-button transition hover:bg-brand-hover"
              >
                Add to Cart
              </button>
              <div />
              <button
                onClick={buyNow}
                className="h-12 rounded-xl border border-line text-sm font-black text-brand transition hover:bg-brand-soft"
              >
                Buy It Now
              </button>
            </div>

            <div className="mt-5 flex items-start gap-3 rounded-xl bg-gray-50 p-3 text-sm text-muted">
              <Truck className="mt-0.5 h-4 w-4 shrink-0 text-brand" />
              Order in the next 2h 15m to get it by <span className="font-black text-ink">Saturday, 25 May</span>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1fr_330px]">
        <div className="rounded-2xl border border-line bg-white p-5 shadow-card">
          <div className="flex flex-wrap gap-6 border-b border-line text-sm font-black">
            {['Description', 'How to Use', 'Shipping & Returns', `Reviews (${product.reviews})`, 'FAQs'].map((tab, index) => (
              <button key={tab} className={`pb-3 ${index === 0 ? 'border-b-2 border-brand text-brand' : 'text-muted'}`}>
                {tab}
              </button>
            ))}
          </div>
          <p className="mt-5 text-sm leading-6 text-gray-700">{product.description}</p>
          <div className="mt-4 grid gap-2 text-sm text-gray-700">
            {product.specs.map((spec) => (
              <p key={spec.label}>
                <span className="font-black text-brand">-</span> {spec.label}: {spec.value}
              </p>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-brand/10 bg-brand-soft p-5 shadow-card">
          {[
            ['Trusted by 10,000+', 'Happy customers'],
            ['100% Genuine', 'Premium quality'],
            ['Built for Homes', 'Furniture and decor verified'],
          ].map(([title, body]) => (
            <div key={title} className="mb-5 flex gap-3 last:mb-0">
              <ShieldCheck className="h-6 w-6 text-brand" />
              <div>
                <p className="font-black text-brand">{title}</p>
                <p className="text-sm text-muted">{body}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <RecommendedProducts products={recommended} openProduct={openProduct} addToCart={addToCart} />
      <FrequentlyBoughtTogether product={product} addAllBundle={addAllBundle} />
    </div>
  );
}

function RecommendedProducts({
  products,
  openProduct,
  addToCart,
}: {
  products: StorefrontProduct[];
  openProduct: (product: StorefrontProduct) => void;
  addToCart: (product: StorefrontProduct, bundleSelected?: boolean, amount?: number, openDrawer?: boolean) => void;
}) {
  return (
    <section className="rounded-2xl border border-line bg-white p-5 shadow-card">
      <h2 className="text-xl font-black text-ink">You may also like</h2>
      <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {products.map((product) => (
          <article key={product.id} className="overflow-hidden rounded-xl border border-line bg-white">
            <button onClick={() => openProduct(product)} className="block w-full text-left">
              <div className="relative bg-gray-100">
                <ProductImage image={product.images[0]} alt={product.name} className="aspect-[1.25/1]" />
                <Heart className="absolute right-3 top-3 h-4 w-4 text-muted" />
              </div>
              <div className="p-3">
                <p className="min-h-10 text-sm font-black text-ink">{product.name}</p>
                <Rating rating={product.rating} reviews={product.reviews} compact />
                <p className="mt-2 text-sm font-black text-ink">{formatCurrency(product.price)}</p>
              </div>
            </button>
            <button
              onClick={() => addToCart(product, false, 1, true)}
              className="m-3 mt-0 h-9 w-[calc(100%-1.5rem)] rounded-lg border border-brand text-xs font-black text-brand hover:bg-brand-soft"
            >
              Add to Cart
            </button>
          </article>
        ))}
      </div>
    </section>
  );
}

function FrequentlyBoughtTogether({
  product,
  addAllBundle,
}: {
  product: StorefrontProduct;
  addAllBundle: (product: StorefrontProduct, openDrawer?: boolean) => void;
}) {
  const bundleBase = product.price + product.bundle.companionPrice;
  const bundleDiscount = Math.round((bundleBase * product.bundle.discountPercent) / 100);
  const total = bundleBase - bundleDiscount;
  const bundlePieces = [
    {name: product.name, price: product.price, image: product.images[0]},
    {name: product.bundle.companionName, price: product.bundle.companionPrice, image: product.images[1]},
    {name: 'Premium Decor Care Kit', price: 799, image: product.images[2]},
  ];
  const allTotal = total + 799;

  return (
    <section className="rounded-2xl border border-line bg-white p-5 shadow-card">
      <h2 className="text-xl font-black text-ink">Complete your home setup</h2>
      <p className="mt-1 text-sm font-semibold text-muted">Frequently bought together</p>
      <div className="mt-5 grid gap-5 xl:grid-cols-[1fr_240px]">
        <div className="grid gap-4 md:grid-cols-[1fr_24px_1fr_24px_1fr]">
          {bundlePieces.map((item, index) => (
            <div key={item.name} className="contents">
              <div className="rounded-xl bg-gray-50 p-3">
                <div className="relative overflow-hidden rounded-lg bg-white">
                  <ProductImage image={item.image} alt={item.name} className="aspect-[1.2/1]" />
                  <CheckCircle2 className="absolute right-2 top-2 h-5 w-5 fill-success text-white" />
                </div>
                <p className="mt-3 text-sm font-black text-ink">{item.name}</p>
                <p className="text-sm font-bold text-muted">{formatCurrency(item.price)}</p>
              </div>
              {index < bundlePieces.length - 1 ? (
                <div className="hidden place-items-center text-2xl font-black text-muted md:grid">+</div>
              ) : null}
            </div>
          ))}
        </div>
        <div className="rounded-2xl bg-brand-soft p-5">
          <p className="text-sm font-bold text-muted">Total Price</p>
          <p className="mt-1 text-2xl font-black text-ink">{formatCurrency(allTotal)}</p>
          <p className="mt-2 text-sm font-black text-success">You save {formatCurrency(bundleDiscount)}</p>
          <button
            onClick={() => addAllBundle(product, true)}
            className="mt-5 h-11 w-full rounded-xl bg-brand text-sm font-black text-white shadow-button"
          >
            Add All to Cart
          </button>
        </div>
      </div>
    </section>
  );
}

function CartPage(props: CartContentProps) {
  return (
    <section className="rounded-2xl border border-line bg-white p-5 shadow-card">
      <div className="mb-5 flex items-center justify-between gap-4">
        <h2 className="text-2xl font-black text-ink">Your Cart ({props.cart.length})</h2>
        <button onClick={props.continueShopping} className="text-sm font-black text-brand">Continue Shopping</button>
      </div>
      <div className="grid gap-6 xl:grid-cols-[1fr_360px]">
        <CartItems {...props} />
        <PriceDetails totals={props.totals} checkout={props.checkout} disabled={!props.cart.length} />
      </div>
    </section>
  );
}

type CartContentProps = {
  cart: CartItem[];
  totals: ReturnType<typeof getTotals>;
  updateQuantity: (productId: string, bundleSelected: boolean, direction: 1 | -1) => void;
  removeItem: (productId: string, bundleSelected: boolean) => void;
  continueShopping: () => void;
  checkout: () => void;
};

function CartItems({cart, updateQuantity, removeItem, continueShopping}: CartContentProps) {
  if (!cart.length) {
    return (
      <div className="rounded-2xl bg-gray-50 p-10 text-center">
        <ShoppingCart className="mx-auto h-10 w-10 text-brand" />
        <h3 className="mt-4 text-xl font-black text-ink">Your cart is empty</h3>
        <button onClick={continueShopping} className="mt-5 rounded-xl bg-brand px-5 py-3 text-sm font-black text-white">
          Continue shopping
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {cart.map((item) => (
        <CartLine
          key={`${item.product.id}-${item.bundleSelected}`}
          item={item}
          updateQuantity={updateQuantity}
          removeItem={removeItem}
        />
      ))}
    </div>
  );
}

function CartLine({
  item,
  updateQuantity,
  removeItem,
}: {
  item: CartItem;
  updateQuantity: (productId: string, bundleSelected: boolean, direction: 1 | -1) => void;
  removeItem: (productId: string, bundleSelected: boolean) => void;
}) {
  const lineBase = getLineBase(item);
  const lineDiscount = getLineDiscount(item);
  const lineTotal = getLineTotal(item);

  return (
    <div className="grid gap-4 rounded-2xl border border-line p-4 md:grid-cols-[116px_1fr_auto]">
      <ProductImage image={item.product.images[0]} alt={item.product.name} className="aspect-square rounded-xl" />
      <div>
        <p className="font-black text-ink">{item.product.name}</p>
        <div className="mt-2 flex flex-wrap items-center gap-2">
          <span className="font-black text-ink">{formatCurrency(lineTotal)}</span>
          <span className="text-sm font-bold text-muted line-through">{formatCurrency(lineBase)}</span>
          {lineDiscount ? (
            <span className="rounded-full bg-emerald-50 px-2 py-1 text-xs font-black text-success">
              Save {formatCurrency(lineDiscount)}
            </span>
          ) : null}
        </div>
        {item.bundleSelected ? (
          <p className="mt-2 text-sm font-bold text-brand">Bundle included: {item.product.bundle.companionName}</p>
        ) : null}
        <div className="mt-3 inline-flex items-center rounded-xl border border-line">
          <button onClick={() => updateQuantity(item.product.id, item.bundleSelected, -1)} className="grid h-9 w-9 place-items-center">
            <Minus className="h-4 w-4" />
          </button>
          <span className="w-9 text-center text-sm font-black">{item.quantity}</span>
          <button onClick={() => updateQuantity(item.product.id, item.bundleSelected, 1)} className="grid h-9 w-9 place-items-center">
            <Plus className="h-4 w-4" />
          </button>
        </div>
      </div>
      <button
        onClick={() => removeItem(item.product.id, item.bundleSelected)}
        className="self-start text-sm font-bold text-muted hover:text-danger"
      >
        Remove
      </button>
    </div>
  );
}

function PriceDetails({
  totals,
  checkout,
  buttonLabel = 'Checkout Securely',
  disabled,
}: {
  totals: ReturnType<typeof getTotals>;
  checkout: () => void;
  buttonLabel?: string;
  disabled?: boolean;
}) {
  return (
    <aside className="h-fit rounded-2xl border border-line p-5">
      <div className="rounded-2xl border border-line p-4">
        <p className="font-black text-rose-700">Add More & Save More</p>
        <p className="mt-1 text-sm text-muted">A bundle offer appears before checkout to unlock the heaviest discount.</p>
        <div className="mt-3 h-2 overflow-hidden rounded-full bg-gray-100">
          <div className="h-full rounded-full bg-brand" style={{width: `${Math.min(100, (totals.total / 50000) * 100)}%`}} />
        </div>
      </div>
      <h3 className="mt-5 text-xl font-black text-ink">Price Details</h3>
      <div className="mt-4 space-y-3 text-sm">
        <SummaryRow label="Subtotal" value={totals.subtotal + totals.bundleValue} />
        <SummaryRow label="Discount" value={-totals.bundleDiscount} tone="success" />
        <SummaryRow label="Shipping" helper="FREE" tone="success" />
      </div>
      <div className="mt-5 border-t border-line pt-5">
        <div className="flex items-center justify-between">
          <span className="text-lg font-black text-ink">Total</span>
          <span className="text-2xl font-black text-ink">{formatCurrency(totals.total)}</span>
        </div>
      </div>
      <button
        onClick={checkout}
        disabled={disabled}
        className="mt-5 h-12 w-full rounded-xl bg-brand text-sm font-black text-white shadow-button transition hover:bg-brand-hover disabled:cursor-not-allowed disabled:bg-gray-300 disabled:shadow-none"
      >
        {buttonLabel}
      </button>
      <p className="mt-4 text-center text-xs font-black text-muted">UPI - VISA - Mastercard - RuPay - Paytm</p>
    </aside>
  );
}

function CartDrawer({
  open,
  onClose,
  cart,
  totals,
  updateQuantity,
  removeItem,
  checkout,
  viewCart,
}: {
  open: boolean;
  onClose: () => void;
  cart: CartItem[];
  totals: ReturnType<typeof getTotals>;
  updateQuantity: (productId: string, bundleSelected: boolean, direction: 1 | -1) => void;
  removeItem: (productId: string, bundleSelected: boolean) => void;
  checkout: () => void;
  viewCart: () => void;
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/45">
      <button className="absolute inset-0 h-full w-full cursor-default" onClick={onClose} aria-label="Close cart drawer" />
      <aside className="absolute right-0 top-0 h-full w-full max-w-md overflow-y-auto bg-white p-5 shadow-2xl">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-black text-ink">My Cart ({cart.length})</h2>
          <button onClick={onClose} className="grid h-9 w-9 place-items-center rounded-xl border border-line">
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="mt-5 space-y-4">
          <CartItems
            cart={cart}
            totals={totals}
            updateQuantity={updateQuantity}
            removeItem={removeItem}
            continueShopping={onClose}
            checkout={checkout}
          />
        </div>
        <div className="mt-5 rounded-2xl bg-gray-50 p-4">
          <SummaryRow label="Subtotal" value={totals.subtotal + totals.bundleValue} />
          <SummaryRow label="Discount" value={-totals.bundleDiscount} tone="success" />
          <div className="mt-4 flex items-center justify-between border-t border-line pt-4">
            <span className="font-black text-ink">Total</span>
            <span className="text-xl font-black text-ink">{formatCurrency(totals.total)}</span>
          </div>
        </div>
        <button
          onClick={checkout}
          disabled={!cart.length}
          className="mt-4 h-12 w-full rounded-xl bg-brand text-sm font-black text-white shadow-button disabled:cursor-not-allowed disabled:bg-gray-300 disabled:shadow-none"
        >
          Checkout Securely
        </button>
        <button onClick={viewCart} className="mt-3 h-11 w-full rounded-xl border border-line text-sm font-black text-ink">
          View cart page
        </button>
      </aside>
    </div>
  );
}

function BundleOfferModal({
  open,
  product,
  onAccept,
  onSkip,
}: {
  open: boolean;
  product: StorefrontProduct;
  onAccept: () => void;
  onSkip: () => void;
}) {
  if (!open) return null;

  const bundleBase = product.price + product.bundle.companionPrice;
  const bundleDiscount = Math.round((bundleBase * product.bundle.discountPercent) / 100);
  const bundleTotal = bundleBase - bundleDiscount;
  const extraPay = Math.max(0, bundleTotal - product.price);

  return (
    <div className="fixed inset-0 z-[60] grid place-items-center bg-black/55 p-4">
      <button className="absolute inset-0 h-full w-full cursor-default" onClick={onSkip} aria-label="Skip bundle offer" />
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="bundle-offer-title"
        className="relative max-h-[calc(100vh-2rem)] w-full max-w-3xl overflow-y-auto rounded-2xl bg-white shadow-2xl"
      >
        <button
          onClick={onSkip}
          className="absolute right-4 top-4 z-10 grid h-9 w-9 place-items-center rounded-xl border border-line bg-white/90"
          aria-label="Close bundle offer"
        >
          <X className="h-4 w-4" />
        </button>
        <div className="grid md:grid-cols-[0.9fr_1.1fr]">
          <div className="relative min-h-56 bg-brand-soft md:min-h-full">
            <ProductImage image={product.images[1] ?? product.images[0]} alt={product.bundle.companionName} className="h-full min-h-56 md:min-h-full" />
            <span className="absolute left-4 top-4 rounded-full bg-rose-600 px-3 py-1 text-xs font-black text-white">
              {product.bundle.discountPercent}% checkout bundle
            </span>
          </div>
          <div className="p-6 sm:p-8">
            <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-xs font-black text-success">
              <BadgeIndianRupee className="h-3.5 w-3.5" />
              Heavy discount unlocked
            </div>
            <h2 id="bundle-offer-title" className="mt-4 text-3xl font-black tracking-normal text-ink">
              Add {product.bundle.companionName} before checkout?
            </h2>
            <p className="mt-3 text-sm leading-6 text-muted">{product.bundle.description}</p>

            <div className="mt-5 rounded-2xl border border-line bg-gray-50 p-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-black text-ink">{product.bundle.title}</p>
                  <p className="mt-1 text-sm text-muted">{product.name} + {product.bundle.companionName}</p>
                </div>
                <span className="rounded-full bg-success px-3 py-1 text-xs font-black text-white">
                  Save {formatCurrency(bundleDiscount)}
                </span>
              </div>
              <div className="mt-4 grid grid-cols-3 gap-3 text-sm">
                <div className="rounded-xl bg-white p-3">
                  <p className="font-bold text-muted">Normal</p>
                  <p className="mt-1 font-black text-ink line-through">{formatCurrency(bundleBase)}</p>
                </div>
                <div className="rounded-xl bg-white p-3">
                  <p className="font-bold text-muted">Bundle</p>
                  <p className="mt-1 font-black text-success">{formatCurrency(bundleTotal)}</p>
                </div>
                <div className="rounded-xl bg-white p-3">
                  <p className="font-bold text-muted">Extra pay</p>
                  <p className="mt-1 font-black text-brand">{formatCurrency(extraPay)}</p>
                </div>
              </div>
            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-[1fr_auto]">
              <button
                onClick={onAccept}
                className="h-12 rounded-xl bg-brand px-5 text-sm font-black text-white shadow-button transition hover:bg-brand-hover"
              >
                Add Bundle & Checkout
              </button>
              <button
                onClick={onSkip}
                className="h-12 rounded-xl border border-line px-5 text-sm font-black text-ink hover:bg-gray-50"
              >
                Skip Offer
              </button>
            </div>
            <p className="mt-4 text-xs font-bold text-muted">
              Checkout opens only after the customer accepts or skips this offer.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

function CheckoutPage({
  cart,
  totals,
  customerName,
  setCustomerName,
  phone,
  setPhone,
  address,
  setAddress,
  back,
  placeOrder,
}: {
  cart: CartItem[];
  totals: ReturnType<typeof getTotals>;
  customerName: string;
  setCustomerName: (value: string) => void;
  phone: string;
  setPhone: (value: string) => void;
  address: string;
  setAddress: (value: string) => void;
  back: () => void;
  placeOrder: () => void;
}) {
  return (
    <section className="grid gap-6 xl:grid-cols-[1fr_360px]">
      <div className="rounded-2xl border border-line bg-white p-5 shadow-card">
        <button onClick={back} className="mb-5 inline-flex items-center gap-2 text-sm font-black text-muted">
          <ArrowLeft className="h-4 w-4" />
          Back to cart
        </button>
        <h2 className="text-2xl font-black text-ink">Checkout</h2>
        <p className="mt-2 text-sm text-muted">Completing checkout updates campaign money and NLP in every open tab.</p>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <label className="space-y-2 text-sm font-bold text-ink">
            Full name
            <input className="field-input" value={customerName} onChange={(event) => setCustomerName(event.target.value)} />
          </label>
          <label className="space-y-2 text-sm font-bold text-ink">
            Phone
            <input className="field-input" value={phone} onChange={(event) => setPhone(event.target.value)} />
          </label>
          <label className="space-y-2 text-sm font-bold text-ink md:col-span-2">
            Delivery address
            <textarea className="field-input min-h-24 py-3" value={address} onChange={(event) => setAddress(event.target.value)} />
          </label>
        </div>

        <div className="mt-6 rounded-2xl border border-line p-4">
          <div className="flex items-center gap-3">
            <CreditCard className="h-5 w-5 text-brand" />
            <p className="font-black text-ink">Payment method</p>
          </div>
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            {['UPI', 'Card', 'Cash on Delivery'].map((method) => (
              <label key={method} className="flex h-12 items-center gap-2 rounded-xl border border-line px-3 text-sm font-bold text-ink">
                <input type="radio" name="payment" className="accent-brand" defaultChecked={method === 'UPI'} />
                {method}
              </label>
            ))}
          </div>
        </div>

        <div className="mt-6 rounded-2xl bg-gray-50 p-4">
          <p className="text-sm font-black text-ink">Items in this order</p>
          <div className="mt-3 space-y-2">
            {cart.map((item) => (
              <div key={`${item.product.id}-${item.bundleSelected}`} className="flex justify-between gap-4 text-sm">
                <span className="font-semibold text-muted">
                  {item.quantity} x {item.product.name}
                  {item.bundleSelected ? ` + ${item.product.bundle.companionName}` : ''}
                </span>
                <span className="font-black text-ink">{formatCurrency(getLineTotal(item))}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      <PriceDetails totals={totals} checkout={placeOrder} buttonLabel="Place Order" disabled={!cart.length} />
    </section>
  );
}

function SuccessView({total, continueShopping}: {total: number; continueShopping: () => void}) {
  return (
    <section className="rounded-2xl border border-line bg-white p-10 text-center shadow-card">
      <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-emerald-50 text-success">
        <CheckCircle2 className="h-8 w-8" />
      </div>
      <h2 className="mt-5 text-3xl font-black text-ink">Order placed</h2>
      <p className="mx-auto mt-2 max-w-xl text-sm text-muted">
        Demo checkout completed for {formatCurrency(total)}. Campaign money and NLP are now synced across tabs.
      </p>
      <button onClick={continueShopping} className="mt-6 rounded-xl bg-brand px-5 py-3 text-sm font-black text-white shadow-button">
        Continue shopping
      </button>
    </section>
  );
}

function ProductImage({image, alt, className}: {image: string; alt: string; className: string}) {
  return (
    <img
      src={image}
      alt={alt}
      className={`w-full object-cover ${className}`}
      onError={(event) => {
        event.currentTarget.src = fallbackImage;
      }}
    />
  );
}

function QuantityControl({
  quantity,
  setQuantity,
}: {
  quantity: number;
  setQuantity: (value: number) => void;
}) {
  return (
    <div className="inline-flex h-12 items-center rounded-xl border border-line">
      <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="grid h-12 w-12 place-items-center">
        <Minus className="h-4 w-4" />
      </button>
      <span className="w-10 text-center text-sm font-black">{quantity}</span>
      <button onClick={() => setQuantity(quantity + 1)} className="grid h-12 w-12 place-items-center">
        <Plus className="h-4 w-4" />
      </button>
    </div>
  );
}

function Rating({rating, reviews, compact}: {rating: number; reviews: number; compact?: boolean}) {
  return (
    <div className={`flex items-center gap-2 ${compact ? 'mt-2' : ''}`}>
      <span className="font-black text-ink">{rating}</span>
      <span className="flex text-amber-400">
        {Array.from({length: 5}, (_, index) => (
          <Star key={index} className="h-3.5 w-3.5 fill-current" />
        ))}
      </span>
      <span className="text-xs font-semibold text-muted">({reviews.toLocaleString('en-IN')} reviews)</span>
    </div>
  );
}

function SummaryRow({
  label,
  value,
  tone,
  helper,
}: {
  label: string;
  value?: number;
  tone?: 'success';
  helper?: string;
}) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="font-semibold text-muted">{label}</span>
      <span className={`font-black ${tone === 'success' ? 'text-success' : 'text-ink'}`}>
        {helper ?? formatCurrency(value ?? 0)}
      </span>
    </div>
  );
}

function getTotals(cart: CartItem[]) {
  const subtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const bundleValue = cart.reduce(
    (sum, item) => sum + (item.bundleSelected ? item.product.bundle.companionPrice * item.quantity : 0),
    0,
  );
  const bundleDiscount = cart.reduce((sum, item) => sum + getLineDiscount(item), 0);

  return {
    subtotal,
    bundleValue,
    bundleDiscount,
    total: Math.max(0, subtotal + bundleValue - bundleDiscount),
  };
}

function getLineBase(item: CartItem) {
  return (item.product.price + (item.bundleSelected ? item.product.bundle.companionPrice : 0)) * item.quantity;
}

function getLineDiscount(item: CartItem) {
  if (!item.bundleSelected) return 0;
  return Math.round((getLineBase(item) * item.product.bundle.discountPercent) / 100);
}

function getLineTotal(item: CartItem) {
  return getLineBase(item) - getLineDiscount(item);
}
