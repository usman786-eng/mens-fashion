export interface HeroProduct {
  id: number;
  name: string;
  price: number;
  rating: number;
  image: string;
  top: string;
  bottom: string;
  category: string;
  fabric: string;
  fit: string;
}

export const heroProducts: HeroProduct[] = [
  { id: 1, name: 'Espresso Knit Polo', price: 98, rating: 4.9, image: '/models/1.png', top: '#efe6da', bottom: '#d3c7b8', category: 'Knitwear', fabric: 'Cotton-silk knit', fit: 'Regular' },
  { id: 2, name: 'Riviera Linen Shirt', price: 120, rating: 4.8, image: '/models/2.png', top: '#4c5c6d', bottom: '#aab6c2', category: 'Shirting', fabric: 'Pure linen', fit: 'Relaxed' },
  { id: 3, name: 'Noir Harbour Jacket', price: 189, rating: 4.9, image: '/models/3.png', top: '#9fb0bd', bottom: '#dde3e7', category: 'Outerwear', fabric: 'Brushed cotton twill', fit: 'Boxy' },
  { id: 4, name: 'Oversized Street Tee', price: 75, rating: 4.7, image: '/models/4.png', top: '#e4e8ee', bottom: '#bfc7d1', category: 'Essentials', fabric: 'Heavyweight jersey', fit: 'Oversized' },
  { id: 5, name: 'Taupe Drape Suit', price: 320, rating: 5.0, image: '/models/5.png', top: '#7b7b7b', bottom: '#d2d2d2', category: 'Tailoring', fabric: 'Wool-viscose blend', fit: 'Relaxed drape' },
];

export interface EditProduct {
  image: string;
  name: string;
  category: string;
  fabric: string;
  fit: string;
  price: number;
  rating: number;
}

export const editProducts: EditProduct[] = [
  { image: '/models/6.jpg', name: 'Rust Check Overshirt', category: 'Shirting', fabric: 'Brushed flannel', fit: 'Relaxed', price: 89, rating: 4.8 },
  { image: '/models/7.jpg', name: 'Chambray Work Shirt', category: 'Denim', fabric: 'Washed chambray', fit: 'Regular', price: 79, rating: 4.7 },
  { image: '/models/8.jpg', name: 'Red Plaid Flannel', category: 'Shirting', fabric: 'Cotton flannel', fit: 'Relaxed', price: 85, rating: 4.9 },
  { image: '/models/9.jpg', name: 'Indigo Utility Shirt', category: 'Denim', fabric: 'Garment-dyed cotton', fit: 'Slim', price: 95, rating: 4.8 },
  { image: '/models/10.jpg', name: 'Forest Poplin Shirt', category: 'Shirting', fabric: 'Cotton poplin', fit: 'Tailored', price: 89, rating: 4.7 },
  { image: '/models/11.jpg', name: 'Blue Gingham Shirt', category: 'Shirting', fabric: 'Cotton gingham', fit: 'Regular', price: 69, rating: 4.6 },
  { image: '/models/12.jpg', name: 'Navy Hopsack Blazer', category: 'Tailoring', fabric: 'Wool-blend hopsack', fit: 'Tailored', price: 260, rating: 4.9 },
  { image: '/models/13.jpg', name: 'Sand Linen Blazer', category: 'Tailoring', fabric: 'Linen-cotton', fit: 'Relaxed', price: 240, rating: 5.0 },
];

const unsplash = (id: string) => `https://images.unsplash.com/photo-${id}?w=900&q=75&auto=format&fit=crop`;
const pexels = (id: number) => `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=900`;
const unsplashCat = (id: string) => `https://images.unsplash.com/photo-${id}?w=800&h=1100&q=75&auto=format&fit=crop`;

export interface ProductColor {
  name: string;
  hex: string;
}

export const R: Record<string, ProductColor> = {
  white: { name: 'White', hex: '#f4f3ef' },
  black: { name: 'Black', hex: '#161616' },
  navy: { name: 'Navy', hex: '#1f2a44' },
  grey: { name: 'Grey', hex: '#9a9a98' },
  charcoal: { name: 'Charcoal', hex: '#3a3b3d' },
  olive: { name: 'Olive', hex: '#5f6444' },
  sand: { name: 'Sand', hex: '#cdbb9c' },
  blush: { name: 'Blush', hex: '#e2b8ac' },
  sky: { name: 'Sky', hex: '#a9c4de' },
  mustard: { name: 'Mustard', hex: '#c9962e' },
  red: { name: 'Red', hex: '#a3242b' },
  brown: { name: 'Brown', hex: '#6b4a33' },
};

export interface NewInProduct {
  id: string;
  name: string;
  price: number;
  image: string;
  alt: string;
  colors: ProductColor[];
}

export const de: NewInProduct[] = [
  { id: 'essential-tee', name: 'Essential Tee', price: 45, image: unsplash('1627225924765-552d49cf47ad'), alt: 'Man in a white graphic tee against a white wall', colors: [R.white, R.black, R.grey, R.olive] },
  { id: 'grid-shell', name: 'Grid Shell Jacket', price: 160, image: unsplash('1542327897-d73f4005b533'), alt: 'Man in a black beanie and grid-print shell jacket', colors: [R.black, R.navy, R.olive] },
  { id: 'stitch-tee', name: 'Contrast Stitch Tee', price: 55, image: unsplash('1622519407650-3df9883f76a5'), alt: 'Man in a navy tee with contrast stitching and jeans', colors: [R.navy, R.white, R.charcoal] },
  { id: 'blush-knit', name: 'Crew Knit', price: 95, image: unsplash('1516826957135-700dedea698c'), alt: 'Man in a blush crew-neck knit and light denim', colors: [R.blush, R.sand, R.navy, R.charcoal] },
  { id: 'oxford-sky', name: 'Oxford Shirt', price: 79, image: unsplash('1620012253295-c15cc3e65df4'), alt: 'Man in a sky-blue oxford shirt, tie and sunglasses', colors: [R.sky, R.white, R.blush] },
  { id: 'heavy-hoodie', name: 'Heavy Hoodie', price: 89, image: pexels(1183266), alt: 'Man in a mustard hooded sweatshirt', colors: [R.mustard, R.grey, R.black, R.olive] },
  { id: 'varsity', name: 'Varsity Bomber', price: 180, image: pexels(1681010), alt: 'Man in a red varsity bomber over a grey tee', colors: [R.red, R.navy, R.black] },
  { id: 'wool-blazer', name: 'Wool Blazer', price: 240, image: pexels(2182970), alt: 'Man in a charcoal wool blazer and white shirt', colors: [R.charcoal, R.navy, R.brown] },
];

/** Alias kept for existing imports. */
export const newInProducts: NewInProduct[] = de;

export interface Category {
  id: string;
  name: string;
  image: string;
  alt: string;
}

export const fe: Category[] = [
  { id: 'tees', name: 'Tees', image: unsplashCat('1586790170083-2f9ceadc732d'), alt: 'Man in a plain white tee' },
  { id: 'shirts', name: 'Shirts', image: unsplashCat('1602810318383-e386cc2a3ccf'), alt: 'Folded dress shirts in navy, white and burgundy' },
  { id: 'jackets', name: 'Jackets', image: unsplashCat('1551028719-00167b16eac5'), alt: 'Black leather biker jacket on a hanger' },
  { id: 'suits', name: 'Suits', image: unsplashCat('1594938298603-c8148c4dae35'), alt: 'Man in a blue windowpane three-piece suit' },
  { id: 'jeans', name: 'Jeans', image: unsplashCat('1542272604-787c3835535d'), alt: 'Stacked pairs of blue and black denim jeans' },
  { id: 'sneakers', name: 'Sneakers', image: unsplashCat('1549298916-b41d501d3772'), alt: 'Tan canvas sneaker resting on mustard fabric' },
  { id: 'caps', name: 'Caps', image: unsplashCat('1521369909029-2afed882baee'), alt: 'Washed grey baseball cap' },
  { id: 'watches', name: 'Watches', image: unsplashCat('1524592094714-0f0654e20314'), alt: 'Hand holding a minimalist watch with a leather strap' },
];

/** Alias kept for existing imports. */
export const categories: Category[] = fe;

export const highlightPhrases = [
  'Tailored in small batches',
  'Pure linen & heavyweight jersey',
  'Relaxed modern fits',
  'Free shipping over €150',
  '30-day free returns',
  'Made to be worn often',
];

export const typedText =
  'Avanio is menswear built on restraint — clean lines, honest fabrics and relaxed tailoring that carries you from the studio to the street. Pieces made to be worn often, and remembered always.';

export interface StoreCaption {
  at: [number, number];
  kicker: string;
  title: string;
  body?: string;
  align: 'center' | 'left' | 'right';
}

export const storeCaptions: StoreCaption[] = [
  { at: [-1, 0.16], kicker: 'The store', title: 'Step inside', body: 'A walk through our flagship, one scroll at a time.', align: 'center' },
  { at: [0.2, 0.38], kicker: 'The rails', title: 'Edited, never crowded', body: 'Every piece hung with room to breathe, sorted by fabric and weight.', align: 'left' },
  { at: [0.44, 0.62], kicker: 'The tables', title: 'Touch the cloth', body: 'Knits and jersey folded out on oak, so you can feel them first.', align: 'right' },
  { at: [0.68, 0.84], kicker: 'Fitting rooms', title: 'Try it on, slowly', body: 'Linen-curtained rooms with soft, honest light.', align: 'left' },
  { at: [0.88, 2], kicker: 'Visit us', title: 'See you in store', align: 'center' },
];

export const FRAME_COUNT = 192;
export const frameUrl = (i: number) =>
  `https://avanio.inishchithava.workers.dev/frames/frame_${String(i + 1).padStart(6, '0')}.png`;

export interface FooterNav {
  title: string;
  links: string[];
}

export const footerNav: FooterNav[] = [
  { title: 'Collection', links: ['New In', 'Shirting', 'Knitwear', 'Outerwear', 'Tailoring', 'Essentials', 'Under €100'] },
  { title: 'Company', links: ['About Us', 'Store Locator', 'Journal', 'Careers', 'Privacy Policy'] },
  { title: 'Support', links: ['FAQs', 'Contact Us', 'Returns & Refunds', 'Shipping Policy', 'Size Guide'] },
];

export const footerLinks: Record<string, string[]> = {
  Collection: ['New In', 'Shirting', 'Knitwear', 'Outerwear', 'Tailoring', 'Essentials', 'Under €100'],
  Company: ['About Us', 'Store Locator', 'Journal', 'Careers', 'Privacy Policy'],
  Support: ['FAQs', 'Contact Us', 'Returns & Refunds', 'Shipping Policy', 'Size Guide'],
};
