// FinTrack — shared icons (rounded, slightly filled style)
// Hand-drawn to fit the warm advisor mood. 24x24 viewBox by default.

const Icon = ({ children, size = 24, color = 'currentColor', strokeWidth = 1.8, fill = 'none', style = {} }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke={color}
       strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" style={style}>
    {children}
  </svg>
);

const Icons = {
  home: (p) => <Icon {...p}><path d="M3 11.5L12 4l9 7.5"/><path d="M5 10v9a1 1 0 001 1h4v-6h4v6h4a1 1 0 001-1v-9" fill={p?.fill || 'none'}/></Icon>,
  list: (p) => <Icon {...p}><path d="M4 6h16M4 12h16M4 18h10"/></Icon>,
  budget: (p) => <Icon {...p}><circle cx="12" cy="12" r="8"/><path d="M12 4v8l5 3"/></Icon>,
  user: (p) => <Icon {...p}><circle cx="12" cy="8" r="4"/><path d="M4 20c1-4 4.5-6 8-6s7 2 8 6"/></Icon>,
  chevR: (p) => <Icon {...p}><path d="M9 5l7 7-7 7"/></Icon>,
  chevL: (p) => <Icon {...p}><path d="M15 5l-7 7 7 7"/></Icon>,
  chevDn: (p) => <Icon {...p}><path d="M5 9l7 7 7-7"/></Icon>,
  close: (p) => <Icon {...p}><path d="M6 6l12 12M18 6L6 18"/></Icon>,
  search: (p) => <Icon {...p}><circle cx="11" cy="11" r="7"/><path d="M16.5 16.5L21 21"/></Icon>,
  filter: (p) => <Icon {...p}><path d="M4 6h16M7 12h10M10 18h4"/></Icon>,
  check: (p) => <Icon {...p}><path d="M5 12.5l4.5 4.5L19 7"/></Icon>,
  arrowUp: (p) => <Icon {...p}><path d="M12 19V5M5 12l7-7 7 7"/></Icon>,
  arrowDn: (p) => <Icon {...p}><path d="M12 5v14M19 12l-7 7-7-7"/></Icon>,
  arrowR: (p) => <Icon {...p}><path d="M5 12h14M12 5l7 7-7 7"/></Icon>,
  plus: (p) => <Icon {...p}><path d="M12 5v14M5 12h14"/></Icon>,
  sparkle: (p) => <Icon {...p}><path d="M12 3v4M12 17v4M3 12h4M17 12h4M5.6 5.6l2.8 2.8M15.6 15.6l2.8 2.8M5.6 18.4l2.8-2.8M15.6 8.4l2.8-2.8"/></Icon>,
  shield: (p) => <Icon {...p}><path d="M12 3l8 3v6c0 5-3.5 8.5-8 9-4.5-.5-8-4-8-9V6l8-3z"/></Icon>,
  mail: (p) => <Icon {...p}><rect x="3" y="6" width="18" height="13" rx="2"/><path d="M3 8l9 6 9-6"/></Icon>,
  tag: (p) => <Icon {...p}><path d="M3 12V5a2 2 0 012-2h7l9 9-9 9-9-9z"/><circle cx="8" cy="8" r="1.5" fill={p?.color || 'currentColor'}/></Icon>,
  globe: (p) => <Icon {...p}><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c2.5 3 4 6 4 9s-1.5 6-4 9c-2.5-3-4-6-4-9s1.5-6 4-9z"/></Icon>,
  calendar: (p) => <Icon {...p}><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M8 3v4M16 3v4M3 10h18"/></Icon>,
  // categories — slightly filled rounded
  cat_food: (p) => <Icon {...p} fill={p?.color || 'currentColor'} stroke="none"><path d="M7 4c0 4 0 6 1.5 6.5V21a1 1 0 002 0V10.5C12 10 12 8 12 4h-1v5h-1V4H9v5H8V4H7zM16 4c-2 0-3 3-3 6.5 0 1.8 1 3 2 3.2V21a1 1 0 002 0V4z"/></Icon>,
  cat_transit: (p) => <Icon {...p} fill={p?.color || 'currentColor'} stroke="none"><path d="M6 5a3 3 0 013-3h6a3 3 0 013 3v12a2 2 0 01-2 2v1a1 1 0 01-2 0v-1H8v1a1 1 0 01-2 0v-1a2 2 0 01-2-2V5h2zm2 1a1 1 0 00-1 1v3a1 1 0 001 1h8a1 1 0 001-1V7a1 1 0 00-1-1H8zm0 9a1.5 1.5 0 100 3 1.5 1.5 0 000-3zm8 0a1.5 1.5 0 100 3 1.5 1.5 0 000-3z"/></Icon>,
  cat_utility: (p) => <Icon {...p} fill={p?.color || 'currentColor'} stroke="none"><path d="M13 2L4 14h6l-1 8 9-12h-6l1-8z"/></Icon>,
  cat_subs: (p) => <Icon {...p} fill={p?.color || 'currentColor'} stroke="none"><path d="M21 12a9 9 0 11-3.5-7.1L19 6V2h-1v4M3 12a9 9 0 0015.5 6.1L17 18v4h1v-4"/><circle cx="12" cy="12" r="3"/></Icon>,
  cat_transfer: (p) => <Icon {...p}><path d="M5 8h14M16 5l3 3-3 3M19 16H5M8 19l-3-3 3-3"/></Icon>,
  cat_fun: (p) => <Icon {...p} fill={p?.color || 'currentColor'} stroke="none"><path d="M3 7a3 3 0 013-3h12a3 3 0 013 3v10a3 3 0 01-3 3H6a3 3 0 01-3-3V7zm6 3a1 1 0 100 2 1 1 0 000-2zm6 0a1 1 0 100 2 1 1 0 000-2zM8 16c1 1 2.5 1.5 4 1.5s3-.5 4-1.5"/></Icon>,
  cat_health: (p) => <Icon {...p} fill={p?.color || 'currentColor'} stroke="none"><path d="M12 21s-8-4.5-8-11a5 5 0 019-3 5 5 0 019 3c0 6.5-8 11-8 11h-2z"/></Icon>,
  cat_other: (p) => <Icon {...p}><circle cx="12" cy="12" r="9"/><path d="M9.5 9.5a2.5 2.5 0 015 0c0 1.5-2.5 2-2.5 4M12 17.5h.01"/></Icon>,
};

// Category metadata: icon + chart color slot
const CATEGORIES = {
  food:      { label: 'Food & Dining', icon: 'cat_food',     hue: 0 },
  transit:   { label: 'Transport',     icon: 'cat_transit',  hue: 5 },
  utility:   { label: 'Utilities',     icon: 'cat_utility',  hue: 3 },
  subs:      { label: 'Subscriptions', icon: 'cat_subs',     hue: 2 },
  transfer:  { label: 'Transfers',     icon: 'cat_transfer', hue: 4 },
  fun:       { label: 'Entertainment', icon: 'cat_fun',      hue: 1 },
  health:    { label: 'Health',        icon: 'cat_health',   hue: 5 },
  other:     { label: 'Other',         icon: 'cat_other',    hue: 4 },
};

Object.assign(window, { Icon, Icons, CATEGORIES });
