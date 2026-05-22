export type StorefrontSection = {
  id: string;
  name: string;
  eyebrow: string;
  description: string;
  heroImage: string;
  accent: string;
};

export type StorefrontProduct = {
  id: string;
  sectionId: string;
  name: string;
  category: string;
  brand: string;
  rating: number;
  reviews: number;
  price: number;
  compareAt: number;
  shortDescription: string;
  description: string;
  highlights: string[];
  specs: Array<{label: string; value: string}>;
  images: [string, string, string, string];
  bundle: {
    title: string;
    description: string;
    companionName: string;
    companionPrice: number;
    discountPercent: number;
  };
};

const imageParams = 'auto=format&fit=crop&w=900&q=82';

export const storefrontSections: StorefrontSection[] = [
  {
    id: 'living-room',
    name: 'Living Room Comfort',
    eyebrow: 'Sofas, chairs and rugs',
    description: 'Premium seating and floor styling for warm, modern Indian homes.',
    heroImage: `https://images.unsplash.com/photo-1618220179428-22790b461013?${imageParams}`,
    accent: 'from-violet-50 to-emerald-50',
  },
  {
    id: 'tables-storage',
    name: 'Tables & Storage',
    eyebrow: 'Coffee tables, consoles and cabinets',
    description: 'Useful furniture pieces that make everyday rooms feel calmer and better organized.',
    heroImage: `https://images.unsplash.com/photo-1524758631624-e2822e304c36?${imageParams}`,
    accent: 'from-amber-50 to-violet-50',
  },
  {
    id: 'decor-lighting',
    name: 'Decor & Lighting',
    eyebrow: 'Lamps, mirrors and festive accents',
    description: 'Finishing details for bedrooms, entryways, pooja corners and gifting.',
    heroImage: `https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?${imageParams}`,
    accent: 'from-rose-50 to-emerald-50',
  },
];

export const storefrontProducts: StorefrontProduct[] = [
  {
    id: 'jaipur-velvet-sofa',
    sectionId: 'living-room',
    name: 'Jaipur Velvet 3-Seater Sofa',
    category: 'Sofas',
    brand: 'CasaRaga',
    rating: 4.7,
    reviews: 1284,
    price: 38999,
    compareAt: 52999,
    shortDescription: 'Deep-seat velvet sofa with solid wood legs and plush comfort for premium living rooms.',
    description:
      'A premium statement sofa designed for Indian living rooms, lounge corners, and boutique home decor spaces. The velvet upholstery has a soft hand-feel, the seat uses high-resilience foam, and the frame is built for daily family use.',
    highlights: ['Kiln-dried hardwood frame', 'Stain-resistant velvet fabric', 'Removable back cushions', '10-day replacement support'],
    specs: [
      {label: 'Dimensions', value: '84 x 34 x 32 in'},
      {label: 'Material', value: 'Velvet, hardwood, foam'},
      {label: 'Seating', value: '3 adults'},
      {label: 'Assembly', value: 'Legs only'},
    ],
    images: [
      `https://images.unsplash.com/photo-1555041469-a586c61ea9bc?${imageParams}`,
      `https://images.unsplash.com/photo-1540574163026-643ea20ade25?${imageParams}`,
      `https://images.unsplash.com/photo-1618220179428-22790b461013?${imageParams}`,
      `https://images.unsplash.com/photo-1519710164239-da123dc03ef4?${imageParams}`,
    ],
    bundle: {
      title: 'Sofa Comfort Bundle',
      description: 'Add 2 cushion covers and a knitted throw for a better living-room setup.',
      companionName: 'Cushion + Throw Set',
      companionPrice: 3999,
      discountPercent: 35,
    },
  },
  {
    id: 'cane-lounge-chair',
    sectionId: 'living-room',
    name: 'Cane Accent Lounge Chair',
    category: 'Chairs',
    brand: 'Artisan Bay',
    rating: 4.8,
    reviews: 641,
    price: 18999,
    compareAt: 24999,
    shortDescription: 'Handwoven cane chair with a relaxed angled back for reading corners.',
    description:
      'A breezy accent chair that brings handcrafted texture to balconies, bedrooms, and living rooms. The woven cane panel keeps the chair breathable while the padded cushion makes it comfortable for long reading sessions.',
    highlights: ['Handwoven cane back', 'Powder-coated inner support', 'Premium upholstered cushion', 'Ideal for balcony corners'],
    specs: [
      {label: 'Dimensions', value: '28 x 30 x 32 in'},
      {label: 'Material', value: 'Cane, teak, fabric'},
      {label: 'Seat height', value: '17 in'},
      {label: 'Care', value: 'Dry wipe only'},
    ],
    images: [
      `https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?${imageParams}`,
      `https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?${imageParams}`,
      `https://images.unsplash.com/photo-1519947486511-46149fa0a254?${imageParams}`,
      `https://images.unsplash.com/photo-1586023492125-27b2c045efd7?${imageParams}`,
    ],
    bundle: {
      title: 'Reading Corner Bundle',
      description: 'Add a floor lamp and lumbar cushion to build a complete reading nook.',
      companionName: 'Floor Lamp + Cushion',
      companionPrice: 5499,
      discountPercent: 38,
    },
  },
  {
    id: 'handwoven-jute-rug',
    sectionId: 'living-room',
    name: 'Handwoven Jute Area Rug',
    category: 'Rugs',
    brand: 'RootWeave',
    rating: 4.4,
    reviews: 734,
    price: 8999,
    compareAt: 12999,
    shortDescription: 'Natural jute rug for earthy living rooms, bedrooms, and dining spaces.',
    description:
      'A textured neutral rug that anchors a room without making it feel heavy. The weave is firm enough for daily footfall and soft enough to layer under coffee tables or accent chairs.',
    highlights: ['Natural jute fibre', 'Handwoven texture', 'Works with neutral palettes', 'Low pile, easy placement'],
    specs: [
      {label: 'Size', value: '6 x 9 ft'},
      {label: 'Material', value: 'Jute and cotton'},
      {label: 'Pile', value: 'Low pile'},
      {label: 'Use', value: 'Indoor only'},
    ],
    images: [
      `https://images.unsplash.com/photo-1600166898405-da9535204843?${imageParams}`,
      `https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?${imageParams}`,
      `https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?${imageParams}`,
      `https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?${imageParams}`,
    ],
    bundle: {
      title: 'Rug Care Bundle',
      description: 'Add anti-skid rug pads and fabric-safe spot cleaner for long-term care.',
      companionName: 'Rug Pad + Cleaner',
      companionPrice: 1999,
      discountPercent: 34,
    },
  },
  {
    id: 'morning-floor-lamp',
    sectionId: 'living-room',
    name: 'Morning Arc Floor Lamp',
    category: 'Lighting',
    brand: 'GlowNest',
    rating: 4.6,
    reviews: 508,
    price: 9999,
    compareAt: 13999,
    shortDescription: 'Slim arc floor lamp with linen shade for sofa corners and reading zones.',
    description:
      'A tall, balanced floor lamp that throws warm light over sofas, lounge chairs, and bedside corners. The weighted base keeps it steady while the linen shade softens harsh evening light.',
    highlights: ['Weighted metal base', 'Warm ambient throw', 'Linen drum shade', 'Foot switch included'],
    specs: [
      {label: 'Height', value: '68 in'},
      {label: 'Material', value: 'Metal, linen'},
      {label: 'Bulb holder', value: 'E27'},
      {label: 'Cable length', value: '2.2 m'},
    ],
    images: [
      `https://images.unsplash.com/photo-1507473885765-e6ed057f782c?${imageParams}`,
      `https://images.unsplash.com/photo-1540932239986-30128078f3c5?${imageParams}`,
      `https://images.unsplash.com/photo-1524484485831-a92ffc0de03f?${imageParams}`,
      `https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?${imageParams}`,
    ],
    bundle: {
      title: 'Soft Light Bundle',
      description: 'Add two warm bulbs and a woven cable cover for a polished setup.',
      companionName: 'Warm Bulbs + Cable Cover',
      companionPrice: 2199,
      discountPercent: 36,
    },
  },
  {
    id: 'linen-cushion-set',
    sectionId: 'living-room',
    name: 'Linen Cushion Cover Set',
    category: 'Soft Furnishing',
    brand: 'ThreadCasa',
    rating: 4.5,
    reviews: 1092,
    price: 2999,
    compareAt: 4499,
    shortDescription: 'Set of four textured linen cushion covers in warm earthy tones.',
    description:
      'A quick living room refresh for sofas, accent chairs, and day beds. The set mixes solid and patterned covers so the room looks designed without needing a full styling session.',
    highlights: ['Set of 4 covers', 'Concealed zip closure', 'Machine washable', 'Works with 16 x 16 in fillers'],
    specs: [
      {label: 'Size', value: '16 x 16 in each'},
      {label: 'Material', value: 'Cotton linen blend'},
      {label: 'Pieces', value: '4 covers'},
      {label: 'Care', value: 'Gentle wash'},
    ],
    images: [
      `https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?${imageParams}`,
      `https://images.unsplash.com/photo-1567016432779-094069958ea5?${imageParams}`,
      `https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?${imageParams}`,
      `https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?${imageParams}`,
    ],
    bundle: {
      title: 'Sofa Refresh Bundle',
      description: 'Add a knitted throw blanket and save on the full soft-furnishing set.',
      companionName: 'Knitted Throw Blanket',
      companionPrice: 2799,
      discountPercent: 40,
    },
  },
  {
    id: 'sheesham-coffee-table',
    sectionId: 'tables-storage',
    name: 'Sheesham Nesting Coffee Table',
    category: 'Tables',
    brand: 'WoodLoft',
    rating: 4.6,
    reviews: 842,
    price: 12999,
    compareAt: 17999,
    shortDescription: 'Solid sheesham wood nesting tables with warm grain and compact storage.',
    description:
      'A handcrafted coffee table set made for apartments and modern Indian homes. Use the nested table for snacks, decor, lamps, or books, then tuck it back under the main table when the room needs space.',
    highlights: ['Solid sheesham construction', 'Nested space-saving design', 'Natural matte finish', 'Rounded child-safe corners'],
    specs: [
      {label: 'Dimensions', value: '38 x 22 x 17 in'},
      {label: 'Material', value: 'Sheesham wood'},
      {label: 'Finish', value: 'Natural matte'},
      {label: 'Weight capacity', value: '45 kg'},
    ],
    images: [
      `https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?${imageParams}`,
      `https://images.unsplash.com/photo-1532372320572-cda25653a694?${imageParams}`,
      `https://images.unsplash.com/photo-1524758631624-e2822e304c36?${imageParams}`,
      `https://images.unsplash.com/photo-1484101403633-562f891dc89a?${imageParams}`,
    ],
    bundle: {
      title: 'Coffee Table Styling Bundle',
      description: 'Add ceramic coasters and a brass tray to complete the centre-table look.',
      companionName: 'Coasters + Brass Tray',
      companionPrice: 2499,
      discountPercent: 35,
    },
  },
  {
    id: 'marble-side-table',
    sectionId: 'tables-storage',
    name: 'White Marble Side Table',
    category: 'Tables',
    brand: 'StoneNest',
    rating: 4.6,
    reviews: 421,
    price: 14999,
    compareAt: 19999,
    shortDescription: 'Compact marble top side table with a brass-finish metal base.',
    description:
      'A premium side table for sofas, reading chairs, and bedroom corners. The marble top adds a polished accent while the slim base keeps the layout airy and easy to style.',
    highlights: ['Natural marble top', 'Brass-finish metal base', 'Compact footprint', 'Premium accent piece'],
    specs: [
      {label: 'Diameter', value: '18 in'},
      {label: 'Height', value: '21 in'},
      {label: 'Material', value: 'Marble, metal'},
      {label: 'Finish', value: 'Polished stone'},
    ],
    images: [
      `https://images.unsplash.com/photo-1533090481720-856c6e3c1fdc?${imageParams}`,
      `https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?${imageParams}`,
      `https://images.unsplash.com/photo-1616486029423-aaa4789e8c9a?${imageParams}`,
      `https://images.unsplash.com/photo-1594026112284-02bb6f3352fe?${imageParams}`,
    ],
    bundle: {
      title: 'Sofa Side Bundle',
      description: 'Add a ceramic vase and dried stems for a finished side-table look.',
      companionName: 'Vase + Dried Stems',
      companionPrice: 2799,
      discountPercent: 37,
    },
  },
  {
    id: 'minimal-tv-console',
    sectionId: 'tables-storage',
    name: 'Minimal TV Media Console',
    category: 'Storage',
    brand: 'UrbanWood',
    rating: 4.7,
    reviews: 677,
    price: 22999,
    compareAt: 31999,
    shortDescription: 'Low media unit with fluted shutters, cable routing and soft-close storage.',
    description:
      'A clean TV console that hides set-top boxes, chargers, books, and everyday clutter. The fluted front adds quiet texture while the cable ports keep entertainment zones tidy.',
    highlights: ['Soft-close shutters', 'Cable management ports', 'Fluted wooden front', 'Fits TVs up to 65 in'],
    specs: [
      {label: 'Dimensions', value: '64 x 16 x 20 in'},
      {label: 'Material', value: 'Engineered wood, veneer'},
      {label: 'Storage', value: '3 closed compartments'},
      {label: 'Assembly', value: 'Carpenter assisted'},
    ],
    images: [
      `https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?${imageParams}`,
      `https://images.unsplash.com/photo-1615529162924-f8605388461d?${imageParams}`,
      `https://images.unsplash.com/photo-1616486029423-aaa4789e8c9a?${imageParams}`,
      `https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?${imageParams}`,
    ],
    bundle: {
      title: 'Entertainment Wall Bundle',
      description: 'Add cable organizers and a floating shelf set for a clean TV wall.',
      companionName: 'Cable Kit + Wall Shelves',
      companionPrice: 3999,
      discountPercent: 36,
    },
  },
  {
    id: 'ladder-bookshelf',
    sectionId: 'tables-storage',
    name: 'Ladder Display Bookshelf',
    category: 'Storage',
    brand: 'ShelfStory',
    rating: 4.5,
    reviews: 553,
    price: 11999,
    compareAt: 16999,
    shortDescription: 'Leaning five-tier bookshelf for books, plants, frames and collectibles.',
    description:
      'A light, vertical display shelf made for compact walls. The staggered depth keeps the unit airy while giving enough room for books, planters, diffusers, and framed memories.',
    highlights: ['Five open tiers', 'Wall anchor included', 'Compact footprint', 'Matte walnut finish'],
    specs: [
      {label: 'Dimensions', value: '25 x 16 x 72 in'},
      {label: 'Material', value: 'Engineered wood, metal'},
      {label: 'Shelves', value: '5 tiers'},
      {label: 'Load', value: '8 kg per shelf'},
    ],
    images: [
      `https://images.unsplash.com/photo-1521587760476-6c12a4b040da?${imageParams}`,
      `https://images.unsplash.com/photo-1594026112284-02bb6f3352fe?${imageParams}`,
      `https://images.unsplash.com/photo-1497366754035-f200968a6e72?${imageParams}`,
      `https://images.unsplash.com/photo-1519710164239-da123dc03ef4?${imageParams}`,
    ],
    bundle: {
      title: 'Shelf Styling Bundle',
      description: 'Add bookends, a mini planter and a ceramic diffuser for a styled shelf.',
      companionName: 'Bookends + Mini Decor',
      companionPrice: 1899,
      discountPercent: 39,
    },
  },
  {
    id: 'rattan-sideboard',
    sectionId: 'tables-storage',
    name: 'Rattan Sideboard Cabinet',
    category: 'Storage',
    brand: 'RattanRoot',
    rating: 4.8,
    reviews: 396,
    price: 27999,
    compareAt: 37999,
    shortDescription: 'Two-door sideboard with woven rattan shutters and deep dining-room storage.',
    description:
      'A warm storage cabinet for dining rooms, entryways, and living rooms. The woven rattan shutters hide bulkier pieces while keeping the room soft and inviting.',
    highlights: ['Natural rattan shutters', 'Two adjustable shelves', 'Anti-topple hardware', 'Dining and entryway ready'],
    specs: [
      {label: 'Dimensions', value: '54 x 16 x 34 in'},
      {label: 'Material', value: 'Mango wood, rattan'},
      {label: 'Storage', value: '2 doors, 2 shelves'},
      {label: 'Finish', value: 'Warm oak'},
    ],
    images: [
      `https://images.unsplash.com/photo-1595428774223-ef52624120d2?${imageParams}`,
      `https://images.unsplash.com/photo-1602872030490-4a484a7b3ba6?${imageParams}`,
      `https://images.unsplash.com/photo-1618220179428-22790b461013?${imageParams}`,
      `https://images.unsplash.com/photo-1524758631624-e2822e304c36?${imageParams}`,
    ],
    bundle: {
      title: 'Entry Console Bundle',
      description: 'Add a round mirror and table runner for an instantly finished entry wall.',
      companionName: 'Mirror + Table Runner',
      companionPrice: 4999,
      discountPercent: 35,
    },
  },
  {
    id: 'terracotta-table-lamps',
    sectionId: 'decor-lighting',
    name: 'Terracotta Table Lamp Pair',
    category: 'Lighting',
    brand: 'Mitti Studio',
    rating: 4.5,
    reviews: 516,
    price: 6499,
    compareAt: 8999,
    shortDescription: 'Warm ambient lamps with handmade terracotta bases and linen shades.',
    description:
      'A pair of warm table lamps for bedside tables, console units, and pooja-room corners. Each base carries subtle handmade variation, giving the setup a softer artisanal look.',
    highlights: ['Set of 2 lamps', 'Handmade terracotta base', 'Warm white compatible', 'Premium linen shade'],
    specs: [
      {label: 'Height', value: '18 in each'},
      {label: 'Material', value: 'Terracotta, linen'},
      {label: 'Bulb holder', value: 'E27'},
      {label: 'Included', value: '2 shades, 2 bases'},
    ],
    images: [
      `https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?${imageParams}`,
      `https://images.unsplash.com/photo-1540932239986-30128078f3c5?${imageParams}`,
      `https://images.unsplash.com/photo-1507473885765-e6ed057f782c?${imageParams}`,
      `https://images.unsplash.com/photo-1524484485831-a92ffc0de03f?${imageParams}`,
    ],
    bundle: {
      title: 'Ambient Glow Bundle',
      description: 'Add two warm smart bulbs and save more on the complete lighting setup.',
      companionName: 'Warm Smart Bulbs',
      companionPrice: 1899,
      discountPercent: 41,
    },
  },
  {
    id: 'macrame-wall-hanging',
    sectionId: 'decor-lighting',
    name: 'Macrame Wall Hanging',
    category: 'Wall Decor',
    brand: 'BohoHaus',
    rating: 4.5,
    reviews: 912,
    price: 3499,
    compareAt: 4999,
    shortDescription: 'Large handmade cotton macrame panel for bedrooms and living rooms.',
    description:
      'A boho wall accent that instantly softens blank walls. The cotton knots are hand-finished and mounted on a natural wood rod, making it easy to hang above consoles, beds, or sofas.',
    highlights: ['Handmade cotton knots', 'Natural wooden rod', 'Large wall coverage', 'Lightweight and easy to hang'],
    specs: [
      {label: 'Size', value: '36 x 42 in'},
      {label: 'Material', value: 'Cotton cord, wood'},
      {label: 'Mounting', value: 'Wall hook'},
      {label: 'Care', value: 'Dust gently'},
    ],
    images: [
      `https://images.unsplash.com/photo-1522758971460-1d21eed7dc1d?${imageParams}`,
      `https://images.unsplash.com/photo-1522444195799-478538b28823?${imageParams}`,
      `https://images.unsplash.com/photo-1513519245088-0e12902e5a38?${imageParams}`,
      `https://images.unsplash.com/photo-1519710164239-da123dc03ef4?${imageParams}`,
    ],
    bundle: {
      title: 'Wall Styling Bundle',
      description: 'Add a wooden floating shelf and mini planter to complete the wall setup.',
      companionName: 'Shelf + Mini Planter',
      companionPrice: 2199,
      discountPercent: 42,
    },
  },
  {
    id: 'brass-urli-bowl',
    sectionId: 'decor-lighting',
    name: 'Brass Urli Decor Bowl',
    category: 'Decor',
    brand: 'Temple & Table',
    rating: 4.9,
    reviews: 1188,
    price: 4999,
    compareAt: 6999,
    shortDescription: 'Traditional brass urli bowl for festive decor, entrances, and centre tables.',
    description:
      'A polished brass urli designed for flowers, floating candles, and festive styling. It works beautifully in entryways, pooja spaces, living rooms, and home decor gifting hampers.',
    highlights: ['Solid brass finish', 'Works with flowers and candles', 'Gift-ready packaging', 'Traditional Indian styling'],
    specs: [
      {label: 'Diameter', value: '13 in'},
      {label: 'Material', value: 'Brass'},
      {label: 'Finish', value: 'Polished gold'},
      {label: 'Use', value: 'Indoor decor'},
    ],
    images: [
      `https://images.unsplash.com/photo-1609599006353-e629aaabfeae?${imageParams}`,
      `https://images.unsplash.com/photo-1603349206295-dde20617cb6c?${imageParams}`,
      `https://images.unsplash.com/photo-1578662996442-48f60103fc96?${imageParams}`,
      `https://images.unsplash.com/photo-1604014237800-1c9102c219da?${imageParams}`,
    ],
    bundle: {
      title: 'Festive Entryway Bundle',
      description: 'Add lotus candles and dried marigold strings for a complete festive setup.',
      companionName: 'Candles + Marigold Strings',
      companionPrice: 1599,
      discountPercent: 43,
    },
  },
  {
    id: 'arched-wall-mirror',
    sectionId: 'decor-lighting',
    name: 'Arched Wall Mirror',
    category: 'Wall Decor',
    brand: 'MirrorMahal',
    rating: 4.7,
    reviews: 706,
    price: 7999,
    compareAt: 10999,
    shortDescription: 'Slim arched mirror with matte brass frame for bedrooms and entryways.',
    description:
      'A tall arched mirror that opens up compact spaces and gives entryways a premium boutique look. The brass-finish frame is slim enough to blend with modern and traditional decor.',
    highlights: ['Distortion-free glass', 'Matte brass frame', 'Vertical wall mount', 'Entryway and bedroom ready'],
    specs: [
      {label: 'Size', value: '24 x 42 in'},
      {label: 'Material', value: 'Glass, metal'},
      {label: 'Mounting', value: 'Wall mount'},
      {label: 'Frame', value: 'Matte brass'},
    ],
    images: [
      `https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?${imageParams}`,
      `https://images.unsplash.com/photo-1513519245088-0e12902e5a38?${imageParams}`,
      `https://images.unsplash.com/photo-1524758631624-e2822e304c36?${imageParams}`,
      `https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?${imageParams}`,
    ],
    bundle: {
      title: 'Entryway Glow Bundle',
      description: 'Add a wall hook rail and mini diffuser to create a complete entry spot.',
      companionName: 'Hook Rail + Diffuser',
      companionPrice: 2499,
      discountPercent: 40,
    },
  },
  {
    id: 'ceramic-planter-trio',
    sectionId: 'decor-lighting',
    name: 'Ceramic Planter Trio',
    category: 'Decor',
    brand: 'GreenTable',
    rating: 4.4,
    reviews: 884,
    price: 2499,
    compareAt: 3499,
    shortDescription: 'Three glazed ceramic planters for shelves, windowsills and work desks.',
    description:
      'A compact planter set for styling shelves, side tables, balconies, and work desks. Each planter has a drainage hole and a matching tray so indoor styling stays clean.',
    highlights: ['Set of 3 planters', 'Drainage holes included', 'Matching trays', 'Gift-ready carton'],
    specs: [
      {label: 'Diameter', value: '4, 5 and 6 in'},
      {label: 'Material', value: 'Glazed ceramic'},
      {label: 'Pieces', value: '3 planters, 3 trays'},
      {label: 'Use', value: 'Indoor plants'},
    ],
    images: [
      `https://images.unsplash.com/photo-1485955900006-10f4d324d411?${imageParams}`,
      `https://images.unsplash.com/photo-1459156212016-c812468e2115?${imageParams}`,
      `https://images.unsplash.com/photo-1501004318641-b39e6451bec6?${imageParams}`,
      `https://images.unsplash.com/photo-1521334884684-d80222895322?${imageParams}`,
    ],
    bundle: {
      title: 'Plant Parent Bundle',
      description: 'Add potting mix and a brass mist sprayer for an easy plant setup.',
      companionName: 'Potting Mix + Mist Sprayer',
      companionPrice: 1499,
      discountPercent: 45,
    },
  },
];

export function getProductById(productId: string) {
  return storefrontProducts.find((product) => product.id === productId) ?? storefrontProducts[0]!;
}

export function getSectionById(sectionId: string) {
  return storefrontSections.find((section) => section.id === sectionId) ?? storefrontSections[0]!;
}

export function getProductsBySection(sectionId: string) {
  return storefrontProducts.filter((product) => product.sectionId === sectionId);
}
