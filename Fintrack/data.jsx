// FinTrack — mock transaction data + helpers

const MOCK_USER = { firstName: 'Adaeze', refCurrency: 'NGN', advisorName: 'Iris' };

// Exchange rates (mocked, as of "today")
const FX = {
  NGN: 1,
  USD: 1580,    // 1 USD = 1580 NGN
  GBP: 2010,
  KES: 12.2,
  EUR: 1720,
};
function toRef(amount, currency) {
  return amount * (FX[currency] || 1);
}

// Transactions — last few days, multi-bank, multi-currency
const TXNS = [
  // Today
  { id: 't1', merchant: 'Bolt ride to Yaba',     category: 'transit', bank: 'GTBank', currency: 'NGN', amount: -3200,   time: '8:42 AM', date: 'today', status: 'verified' },
  { id: 't2', merchant: 'Chicken Republic',      category: 'food',    bank: 'Kuda',    currency: 'NGN', amount: -5400,   time: '12:30 PM', date: 'today', status: 'verified' },
  { id: 't3', merchant: 'Unknown POS terminal',  category: 'other',   bank: 'GTBank', currency: 'NGN', amount: -8500,   time: '4:15 PM', date: 'today', status: 'unverified' },
  // Yesterday
  { id: 't4', merchant: 'Spotify Premium',       category: 'subs',    bank: 'Wise',    currency: 'USD', amount: -10.99,  time: 'Yesterday', date: 'yesterday', status: 'verified' },
  { id: 't5', merchant: 'Salary — Acme Corp',    category: 'transfer',bank: 'GTBank', currency: 'NGN', amount: 850000,  time: 'Yesterday', date: 'yesterday', status: 'verified' },
  { id: 't6', merchant: 'Shoprite Lekki',        category: 'food',    bank: 'Kuda',    currency: 'NGN', amount: -22400,  time: 'Yesterday', date: 'yesterday', status: 'verified' },
  // Earlier
  { id: 't7', merchant: 'Netflix',               category: 'subs',    bank: 'Wise',    currency: 'USD', amount: -15.49,  time: 'May 4', date: 'earlier', status: 'verified' },
  { id: 't8', merchant: 'Ikeja Electric',        category: 'utility', bank: 'GTBank', currency: 'NGN', amount: -18000,  time: 'May 4', date: 'earlier', status: 'verified' },
  { id: 't9', merchant: 'Cinemas — IMAX',        category: 'fun',     bank: 'Kuda',    currency: 'NGN', amount: -12000,  time: 'May 3', date: 'earlier', status: 'verified' },
  { id: 't10', merchant: 'Uber Eats',            category: 'food',    bank: 'GTBank', currency: 'NGN', amount: -7800,   time: 'May 3', date: 'earlier', status: 'verified' },
  { id: 't11', merchant: 'Reltime — UK transfer',category: 'transfer',bank: 'Monzo',  currency: 'GBP', amount: -120,    time: 'May 2', date: 'earlier', status: 'verified' },
  { id: 't12', merchant: 'Pharmacy on Awolowo',  category: 'health',  bank: 'Kuda',    currency: 'NGN', amount: -4200,   time: 'May 2', date: 'earlier', status: 'verified' },
  { id: 't13', merchant: 'Notion subscription',  category: 'subs',    bank: 'Wise',    currency: 'USD', amount: -8.00,   time: 'May 1', date: 'earlier', status: 'verified' },
  { id: 't14', merchant: 'Ride to airport',      category: 'transit', bank: 'GTBank', currency: 'NGN', amount: -9500,   time: 'May 1', date: 'earlier', status: 'verified' },
];
// add ref-currency conversion
TXNS.forEach(t => { t.refAmount = toRef(t.amount, t.currency); });

// Category totals for the month
function categoryTotals(txns, refCurrency = 'NGN') {
  const m = {};
  txns.filter(t => t.amount < 0).forEach(t => {
    m[t.category] = (m[t.category] || 0) + Math.abs(toRef(t.amount, t.currency));
  });
  return m;
}

// Budgets
const BUDGETS = [
  { category: 'food',    limit: 120000, spent: 87600 },
  { category: 'transit', limit: 40000,  spent: 32700 },
  { category: 'subs',    limit: 30000,  spent: 28400 },  // close
  { category: 'fun',     limit: 25000,  spent: 28000 },  // over
  { category: 'utility', limit: 30000,  spent: 18000 },
];

const ADVISOR_MESSAGES = {
  warm: {
    home: "You're 12% under your usual spend this week. Nice rhythm.",
    budget: "You've kept food spend tight this month — real progress toward your savings goal. One thing worth watching: your subscriptions have crept up.",
    insight: "Your weekend food spend is 3× your weekday average — worth a peek if you're saving toward something specific.",
  },
  direct: {
    home: "Spend is 12% below your weekly average.",
    budget: "Food: on track. Subscriptions: climbing — Spotify, Netflix and Notion together near limit.",
    insight: "Weekend food spend ran 3× weekday average this month.",
  },
  brief: {
    home: "12% under average.",
    budget: "Food good. Subs near limit.",
    insight: "Weekends 3× weekdays on food.",
  },
};

Object.assign(window, { MOCK_USER, FX, TXNS, BUDGETS, ADVISOR_MESSAGES, toRef, categoryTotals });
