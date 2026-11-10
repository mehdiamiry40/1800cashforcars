export type MenuItem = {
  id: number;
  label: string;
  /** Undefined for a parent that only opens a dropdown and has no link of its own. */
  href?: string;
  rel?: string;
  children?: MenuItem[];
};

export const HEADER_MENU: MenuItem[] = [
  { id: 8821, label: "Home", href: "/" },
  { id: 6147, label: "About Us", href: "/about-us/" },
  {
    id: 200,
    label: "Services",
    children: [
      { id: 8751, label: "Cash for Trucks", href: "/cash-for-trucks-brisbane/" },
      { id: 8713, label: "Damaged & Accident Cars", href: "/cash-for-damaged-cars-brisbane/" },
      { id: 8690, label: "Unregistered Cars", href: "/cash-for-unregistered-cars/" },
      { id: 9267, label: "Cash For Scrap Cars", href: "/cash-for-scrap-cars-brisbane/" },
    ],
  },
  {
    id: 8822,
    label: "Helpful Guides",
    href: "#",
    children: [
      { id: 8708, label: "Scrap Value Guide", href: "/scrap-car-price-brisbane/" },
      { id: 8733, label: "QLD Paperwork Checklist", href: "/qld-paperwork-for-selling-a-car/" },
      { id: 8773, label: "Eco-Friendly Process", href: "/eco-friendly-car-recycling-brisbane/" },
    ],
  },
  {
    id: 9138,
    label: "Locations",
    href: "#",
    children: [
      { id: 9140, label: "Brisbane Locations", href: "/brisbane-locations/" },
      { id: 9139, label: "Logan Locations", href: "/logan-locations/" },
      { id: 9141, label: "Gold Coast Locations", href: "/gold-coast-locations/" },
      { id: 9142, label: "Ipswich Locations", href: "/ipswich-locations/" },
      { id: 9158, label: "Cash For Cars Caboolture", href: "/cash-for-cars-caboolture/" },
    ],
  },
  { id: 8824, label: "FAQ", href: "/faq/" },
  { id: 1411, label: "Contact Us", href: "/contact-us/" },
];

export type FooterMenu = { widgetId: string; slug: string; title: string; items: MenuItem[] };

export const FOOTER_MENUS_TOP: FooterMenu[] = [
  {
    widgetId: "nav_menu-8",
    slug: "our-services",
    title: "Our Services",
    items: [
      { id: 8863, label: "Cash for Trucks Brisbane", href: "/cash-for-trucks-brisbane/" },
      { id: 8864, label: "Damaged & Accident Cars", href: "/cash-for-damaged-cars-brisbane/" },
      { id: 8865, label: "Unregistered Cars", href: "/cash-for-unregistered-cars/" },
      { id: 9269, label: "Cash For Scrap Cars", href: "/cash-for-scrap-cars-brisbane/" },
      { id: 8856, label: "Second Hand Auto Parts", href: "/second-hand-auto-parts/" },
    ],
  },
  {
    widgetId: "nav_menu-4",
    slug: "cash-for-cars",
    title: "Cash for Cars",
    items: [
      { id: 5691, label: "Cash For Cars Sunshine Coast", href: "/cash-for-cars-sunshine-coast/" },
      { id: 1312, label: "Cash For Cars Gold Coast", href: "/cash-for-cars-gold-coast/" },
      { id: 1311, label: "Cash For Cars Caboolture", href: "/cash-for-cars-caboolture/" },
      { id: 1313, label: "Cash For Cars Ipswich", href: "/cash-for-cars-ipswich/" },
      { id: 7878, label: "Cash For Cars Logan", href: "/cash-for-cars-logan/" },
    ],
  },
  {
    widgetId: "nav_menu-7",
    slug: "helpful-guides",
    title: "Helpful Guides",
    items: [
      { id: 8868, label: "Scrap Car Price Brisbane", href: "/scrap-car-price-brisbane/" },
      { id: 8866, label: "Eco Friendly Car Recycling Brisbane", href: "/eco-friendly-car-recycling-brisbane/" },
      { id: 8867, label: "QLD Paperwork for Selling a Car", href: "/qld-paperwork-for-selling-a-car/" },
    ],
  },
  {
    widgetId: "nav_menu-5",
    slug: "service-areas",
    title: "Service Areas",
    items: [
      { id: 8829, label: "Brisbane Locations", href: "/brisbane-locations/" },
      { id: 8826, label: "Ipswich Locations", href: "/ipswich-locations/" },
      { id: 8827, label: "Gold Coast Locations", href: "/gold-coast-locations/" },
      { id: 9087, label: "Logan Locations", href: "/logan-locations/" },
      { id: 9159, label: "Cash For Cars Caboolture", href: "/cash-for-cars-caboolture/" },
    ],
  },
];

export const FOOTER_QUICK_LINKS: FooterMenu = {
  widgetId: "nav_menu-3",
  slug: "quick-links",
  title: "Quick Links",
  items: [
    { id: 8843, label: "Home", href: "/" },
    { id: 6061, label: "About Us", href: "/about-us/" },
    { id: 8869, label: "Blog", href: "/blog/" },
    { id: 7776, label: "FAQ", href: "/faq/" },
    { id: 6186, label: "Contact Us", href: "/contact-us/" },
    { id: 9198, label: "All Car Brands We Buy", href: "/cash-for-vehicle-brand/" },
    { id: 6262, label: "Recent Car Removals Brisbane", href: "/recent-car-removals-brisbane/" },
    { id: 8043, label: "Our Stories", href: "/our-stories/" },
    { id: 8870, label: "Terms and Conditions", href: "/terms-and-conditions/" },
    { id: 8871, label: "Privacy Policy", href: "/privacy-policy/", rel: "privacy-policy" },
  ],
};

export const SOCIAL_LINKS = [
  { key: "facebook", label: "Facebook", href: "https://www.facebook.com/Apluscarsremoval/" },
  { key: "instagram", label: "Instagram", href: "https://www.instagram.com/apluscarremovalau/?hl=en" },
  { key: "tiktok", label: "TikTok", href: "https://www.tiktok.com/@apluscarremoval" },
  { key: "twitter", label: "Twitter", href: "https://twitter.com/apluscarremoval" },
  { key: "pinterest", label: "Pinterest", href: "https://www.pinterest.com/apluscarremovalau/" },
  { key: "youtube", label: "YouTube", href: "https://www.youtube.com/@AplusCashforCarsBrisbane" },
] as const;
