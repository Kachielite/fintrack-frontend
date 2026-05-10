// FinTrack Design Tokens
// Warm amber/terracotta primary, warm cream neutrals
// Plus Jakarta Sans + JetBrains Mono

const PALETTES = {
  amber: {
    name: 'Amber',
    // a warm terracotta — confident, earthy, premium
    50:  '#FBF5EE',
    100: '#F5E8D6',
    200: '#EDD2AC',
    300: '#E2B47C',
    400: '#D69356',
    500: '#C77638',  // primary
    600: '#B25C24',
    700: '#8E441A',
    800: '#683117',
    900: '#3F1D0E',
  },
  forest: {
    name: 'Forest',
    50:  '#F1F4EF',
    100: '#DDE6D8',
    200: '#B8CBAE',
    300: '#8BA97D',
    400: '#5E8650',
    500: '#3F6A33',
    600: '#2E5024',
    700: '#22391B',
    800: '#172612',
    900: '#0E1A0A',
  },
  plum: {
    name: 'Plum',
    50:  '#F6F0F4',
    100: '#EAD9E4',
    200: '#D2B0C5',
    300: '#B583A1',
    400: '#945C7E',
    500: '#723E5E',
    600: '#562C47',
    700: '#3E1F33',
    800: '#291421',
    900: '#170B12',
  },
  sand: {
    name: 'Sand',
    50:  '#F8F3EB',
    100: '#EFE3CD',
    200: '#DBC59A',
    300: '#C3A368',
    400: '#A88646',
    500: '#876930',
    600: '#684F22',
    700: '#4A3818',
    800: '#2F2310',
    900: '#1B1409',
  },
};

// Semantic tokens — function of palette + mode
function buildTheme(paletteKey, dark) {
  const P = PALETTES[paletteKey];
  if (dark) {
    return {
      mode: 'dark',
      primary: P[400],
      primaryHover: P[300],
      primarySoft: 'rgba(214, 147, 86, 0.15)', // tinted amber on dark
      onPrimary: '#1B1209',
      // surfaces
      bg:        '#141210',  // warm near-black
      surface:   '#1C1916',  // card
      surface2:  '#252119',  // elevated card / sheet header
      surface3:  '#2E2920',
      // text
      text:      '#F5EFE6',
      textMuted: 'rgba(245, 239, 230, 0.62)',
      textSubtle:'rgba(245, 239, 230, 0.42)',
      // lines
      border:    'rgba(245, 239, 230, 0.10)',
      borderStrong: 'rgba(245, 239, 230, 0.18)',
      // status
      good:      '#7BAE6B',
      warn:      '#D69356',
      alert:     '#D87466',
      // chart palette — designed for small swatches
      chart: ['#D69356', '#7BAE6B', '#9B8FD1', '#E8C77D', '#D87466', '#6FA8B5'],
    };
  }
  return {
    mode: 'light',
    primary: P[500],
    primaryHover: P[600],
    primarySoft: P[50],
    onPrimary: '#FFFFFF',
    // surfaces — warm cream
    bg:        '#FAF6EF',  // app background
    surface:   '#FFFFFF',  // card
    surface2:  '#FFFCF6',
    surface3:  '#F5EFE3',
    // text
    text:      '#231C13',  // warm near-black
    textMuted: 'rgba(35, 28, 19, 0.62)',
    textSubtle:'rgba(35, 28, 19, 0.42)',
    // lines
    border:    'rgba(35, 28, 19, 0.08)',
    borderStrong: 'rgba(35, 28, 19, 0.16)',
    // status
    good:      '#5E8650',
    warn:      '#C77638',
    alert:     '#B85948',
    // chart palette
    chart: ['#C77638', '#5E8650', '#7B6FA8', '#D6AC4A', '#B85948', '#467585'],
  };
}

const SPACE = { 1: 4, 2: 8, 3: 12, 4: 16, 5: 20, 6: 24, 8: 32, 10: 40, 12: 48, 16: 64 };
const RADIUS = { sm: 8, md: 12, lg: 16, xl: 20, '2xl': 24, full: 9999 };

const TYPE = {
  // Plus Jakarta Sans, JetBrains Mono for figures
  fontSans: '"Plus Jakarta Sans", -apple-system, system-ui, sans-serif',
  fontMono: '"JetBrains Mono", "SF Mono", Menlo, monospace',
};

// Currency formatter — proper separators, symbol handling
const CURRENCY_SYMBOLS = {
  NGN: '₦', USD: '$', GBP: '£', KES: 'KSh', EUR: '€',
};
function formatMoney(amount, currency = 'NGN', opts = {}) {
  const { showSign = false, decimals = 0 } = opts;
  const sym = CURRENCY_SYMBOLS[currency] || currency;
  const abs = Math.abs(amount);
  const formatted = abs.toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
  const sign = amount < 0 ? '−' : (showSign ? '+' : '');
  return `${sign}${sym}${formatted}`;
}

Object.assign(window, { PALETTES, buildTheme, SPACE, RADIUS, TYPE, CURRENCY_SYMBOLS, formatMoney });
