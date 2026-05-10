// FinTrack — shared UI components

// ─── Button ───
function Button({ variant = 'primary', size = 'md', children, onClick, disabled, theme, style = {}, leading, trailing, full = false }) {
  const T = theme;
  const sizes = {
    sm: { h: 36, px: 14, fs: 14, gap: 6 },
    md: { h: 48, px: 18, fs: 15, gap: 8 },
    lg: { h: 56, px: 22, fs: 16, gap: 10 },
  };
  const s = sizes[size];
  const variants = {
    primary: { bg: T.primary, fg: T.onPrimary, border: 'transparent' },
    secondary: { bg: T.surface, fg: T.text, border: T.borderStrong },
    ghost: { bg: 'transparent', fg: T.primary, border: 'transparent' },
    soft: { bg: T.primarySoft, fg: T.primary, border: 'transparent' },
  };
  const v = variants[variant];
  return (
    <button
      onClick={onClick} disabled={disabled}
      style={{
        height: s.h, padding: `0 ${s.px}px`, gap: s.gap,
        background: v.bg, color: v.fg,
        border: `1px solid ${v.border}`,
        borderRadius: 9999,
        fontFamily: TYPE.fontSans, fontWeight: 600, fontSize: s.fs, letterSpacing: -0.1,
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.5 : 1,
        width: full ? '100%' : 'auto',
        transition: 'transform 120ms ease, background 120ms ease',
        ...style,
      }}
      onMouseDown={e => !disabled && (e.currentTarget.style.transform = 'scale(0.98)')}
      onMouseUp={e => (e.currentTarget.style.transform = 'scale(1)')}
      onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
    >
      {leading}{children}{trailing}
    </button>
  );
}

// ─── Card ───
function Card({ children, theme, style = {}, padding = 20, onClick, elevated = false }) {
  return (
    <div onClick={onClick} style={{
      background: theme.surface,
      borderRadius: 20,
      padding,
      border: `1px solid ${theme.border}`,
      boxShadow: elevated
        ? (theme.mode === 'dark' ? '0 1px 0 rgba(255,255,255,0.04)' : '0 1px 2px rgba(35, 28, 19, 0.04), 0 8px 24px rgba(35, 28, 19, 0.04)')
        : 'none',
      cursor: onClick ? 'pointer' : 'default',
      ...style,
    }}>{children}</div>
  );
}

// ─── Pill / tag ───
function Pill({ children, theme, color, bg, size = 'sm', style = {} }) {
  const sizes = { xs: { h: 18, fs: 10, px: 6 }, sm: { h: 22, fs: 11, px: 8 }, md: { h: 26, fs: 12, px: 10 } };
  const s = sizes[size];
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 4,
      height: s.h, padding: `0 ${s.px}px`, borderRadius: 9999,
      background: bg || theme.surface3,
      color: color || theme.textMuted,
      fontFamily: TYPE.fontSans, fontSize: s.fs, fontWeight: 600,
      letterSpacing: 0.1, textTransform: 'none',
      whiteSpace: 'nowrap',
      ...style,
    }}>{children}</span>
  );
}

// ─── Mono number ───
function Money({ amount, currency = 'NGN', className, theme, style = {}, color, size = 16, weight = 600, decimals = 0, signed = false }) {
  return (
    <span style={{
      fontFamily: TYPE.fontMono,
      fontSize: size,
      fontWeight: weight,
      color: color || theme.text,
      letterSpacing: -0.3,
      fontVariantNumeric: 'tabular-nums',
      whiteSpace: 'nowrap',
      ...style,
    }}>{formatMoney(amount, currency, { showSign: signed, decimals })}</span>
  );
}

// ─── Category icon chip ───
function CategoryIcon({ category, size = 40, theme }) {
  const c = CATEGORIES[category];
  if (!c) return null;
  const color = theme.chart[c.hue];
  const IconCmp = Icons[c.icon];
  // tinted bg
  const bg = theme.mode === 'dark'
    ? `color-mix(in oklab, ${color} 22%, transparent)`
    : `color-mix(in oklab, ${color} 14%, transparent)`;
  return (
    <div style={{
      width: size, height: size, borderRadius: size * 0.32,
      background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center',
      flexShrink: 0,
    }}>
      <IconCmp size={size * 0.5} color={color} strokeWidth={2} />
    </div>
  );
}

// ─── Transaction row ───
function TransactionRow({ tx, theme, refCurrency = 'NGN', onClick, showStatus = true }) {
  const isUnverified = tx.status === 'unverified';
  return (
    <div onClick={onClick} style={{
      display: 'flex', alignItems: 'center', gap: 12,
      padding: '12px 4px',
      cursor: onClick ? 'pointer' : 'default',
    }}>
      <CategoryIcon category={tx.category} theme={theme} size={40} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 2 }}>
          <span style={{
            fontFamily: TYPE.fontSans, fontSize: 15, fontWeight: 600,
            color: theme.text, letterSpacing: -0.2,
            overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
            minWidth: 0, flex: '0 1 auto',
          }}>{tx.merchant}</span>
          {isUnverified && showStatus && (
            <Pill theme={theme} size="xs" color={theme.warn} bg={theme.mode === 'dark' ? 'rgba(214,147,86,0.18)' : '#FBF0E0'}>review</Pill>
          )}
        </div>
        <div style={{
          fontFamily: TYPE.fontSans, fontSize: 12,
          color: theme.textMuted, display: 'flex', alignItems: 'center', gap: 6,
          whiteSpace: 'nowrap', overflow: 'hidden',
        }}>
          <span style={{
            display: 'inline-block', padding: '1px 6px', borderRadius: 4,
            background: theme.surface3, fontSize: 10, fontWeight: 600, letterSpacing: 0.2,
            flexShrink: 0,
          }}>{tx.bank}</span>
          <span>·</span>
          <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>{tx.time}</span>
        </div>
      </div>
      <div style={{ textAlign: 'right', flexShrink: 0 }}>
        <Money
          amount={tx.amount} currency={tx.currency} theme={theme}
          size={15} weight={600}
          color={tx.amount > 0 ? theme.good : theme.text}
          signed={tx.amount > 0}
        />
        {tx.currency !== refCurrency && (
          <div style={{
            fontFamily: TYPE.fontMono, fontSize: 11, color: theme.textMuted,
            marginTop: 2, fontVariantNumeric: 'tabular-nums',
          }}>
            ≈ {formatMoney(Math.abs(tx.refAmount), refCurrency)}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Bottom sheet ───
function BottomSheet({ open, onClose, title, children, theme, height = 'auto', maxHeight = '80%' }) {
  return (
    <>
      {/* scrim */}
      <div
        onClick={onClose}
        style={{
          position: 'absolute', inset: 0, zIndex: 100,
          background: 'rgba(0,0,0,0.4)',
          opacity: open ? 1 : 0,
          pointerEvents: open ? 'auto' : 'none',
          transition: 'opacity 240ms ease',
        }}
      />
      {/* sheet */}
      <div style={{
        position: 'absolute', left: 0, right: 0, bottom: 0, zIndex: 101,
        background: theme.surface,
        borderTopLeftRadius: 28, borderTopRightRadius: 28,
        transform: open ? 'translateY(0)' : 'translateY(100%)',
        transition: 'transform 320ms cubic-bezier(0.32, 0.72, 0, 1)',
        maxHeight,
        display: 'flex', flexDirection: 'column',
        boxShadow: '0 -10px 40px rgba(0,0,0,0.18)',
        paddingBottom: 34,
      }}>
        {/* grabber */}
        <div style={{ display: 'flex', justifyContent: 'center', padding: '10px 0 6px' }}>
          <div style={{ width: 40, height: 5, borderRadius: 99, background: theme.borderStrong }} />
        </div>
        {title && (
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '8px 20px 14px',
          }}>
            <span style={{
              fontFamily: TYPE.fontSans, fontSize: 18, fontWeight: 700,
              color: theme.text, letterSpacing: -0.3,
            }}>{title}</span>
            <button onClick={onClose} style={{
              width: 32, height: 32, borderRadius: 99,
              background: theme.surface3, border: 'none', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: theme.textMuted,
            }}>
              <Icons.close size={16} />
            </button>
          </div>
        )}
        <div style={{ flex: 1, overflow: 'auto' }}>{children}</div>
      </div>
    </>
  );
}

// ─── Bottom nav ───
function BottomNav({ active, onChange, theme }) {
  const tabs = [
    { id: 'home', label: 'Home', icon: Icons.home },
    { id: 'tx', label: 'Transactions', icon: Icons.list },
    { id: 'budget', label: 'Budget', icon: Icons.budget },
    { id: 'profile', label: 'Profile', icon: Icons.user },
  ];
  return (
    <div style={{
      position: 'absolute', left: 0, right: 0, bottom: 0, zIndex: 50,
      paddingBottom: 24, paddingTop: 8,
      background: theme.mode === 'dark'
        ? 'linear-gradient(to top, rgba(20,18,16,0.92), rgba(20,18,16,0.65) 70%, rgba(20,18,16,0))'
        : 'linear-gradient(to top, rgba(250,246,239,0.95), rgba(250,246,239,0.7) 70%, rgba(250,246,239,0))',
      backdropFilter: 'blur(12px)',
      WebkitBackdropFilter: 'blur(12px)',
    }}>
      <div style={{
        display: 'flex', justifyContent: 'space-around',
        padding: '0 12px',
      }}>
        {tabs.map(t => {
          const isActive = active === t.id;
          const Cmp = t.icon;
          return (
            <button key={t.id} onClick={() => onChange(t.id)} style={{
              flex: 1, padding: '8px 4px',
              background: 'transparent', border: 'none', cursor: 'pointer',
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
              color: isActive ? theme.primary : theme.textMuted,
              fontFamily: TYPE.fontSans,
            }}>
              <Cmp size={22} strokeWidth={isActive ? 2.2 : 1.8} />
              <span style={{ fontSize: 10, fontWeight: 600, letterSpacing: 0.1 }}>{t.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ─── Donut chart ───
function Donut({ data, total, theme, size = 160, thickness = 22, children }) {
  // data: [{ value, color, label }]
  const sum = data.reduce((s, d) => s + d.value, 0) || 1;
  const r = (size - thickness) / 2;
  const c = size / 2;
  const circ = 2 * Math.PI * r;
  let offset = 0;
  return (
    <div style={{ position: 'relative', width: size, height: size }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        <circle cx={c} cy={c} r={r} fill="none" stroke={theme.surface3} strokeWidth={thickness} />
        {data.map((d, i) => {
          const len = (d.value / sum) * circ;
          const dasharray = `${len} ${circ - len}`;
          const dashoffset = -offset;
          const seg = (
            <circle key={i} cx={c} cy={c} r={r} fill="none"
              stroke={d.color} strokeWidth={thickness}
              strokeDasharray={dasharray} strokeDashoffset={dashoffset}
              strokeLinecap="butt" />
          );
          offset += len + 1.5; // tiny gap
          return seg;
        })}
      </svg>
      {children && (
        <div style={{
          position: 'absolute', inset: 0,
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        }}>{children}</div>
      )}
    </div>
  );
}

// ─── Progress bar (advisory color) ───
function ProgressBar({ value, max, theme, color, height = 8, bg }) {
  const pct = Math.min(100, Math.max(0, (value / max) * 100));
  return (
    <div style={{
      height, borderRadius: 99,
      background: bg || theme.surface3,
      overflow: 'hidden', position: 'relative',
    }}>
      <div style={{
        height: '100%', width: `${pct}%`,
        background: color || theme.primary,
        borderRadius: 99,
        transition: 'width 480ms cubic-bezier(0.32, 0.72, 0, 1)',
      }} />
    </div>
  );
}

// ─── Section header ───
function SectionTitle({ children, theme, action, style = {} }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'baseline', justifyContent: 'space-between',
      padding: '0 4px 12px',
      ...style,
    }}>
      <span style={{
        fontFamily: TYPE.fontSans, fontSize: 13, fontWeight: 700,
        color: theme.textMuted, textTransform: 'uppercase', letterSpacing: 0.6,
      }}>{children}</span>
      {action && <span style={{
        fontFamily: TYPE.fontSans, fontSize: 13, fontWeight: 600,
        color: theme.primary, cursor: 'pointer',
      }}>{action}</span>}
    </div>
  );
}

// ─── Question card (the "data as questions" pattern) ───
// A card framed by a question; the answer is the visual.
function QuestionCard({ question, children, theme, footer, style = {} }) {
  return (
    <Card theme={theme} padding={0} style={{ overflow: 'hidden', ...style }}>
      <div style={{
        padding: '18px 20px 6px',
      }}>
        <div style={{
          fontFamily: TYPE.fontSans, fontSize: 15, fontWeight: 600,
          color: theme.text, letterSpacing: -0.2,
          lineHeight: 1.3,
        }}>{question}</div>
      </div>
      <div style={{ padding: '12px 20px 18px' }}>{children}</div>
      {footer && (
        <div style={{
          padding: '12px 20px',
          borderTop: `1px solid ${theme.border}`,
          fontFamily: TYPE.fontSans, fontSize: 13,
          color: theme.textMuted,
          background: theme.surface2,
        }}>{footer}</div>
      )}
    </Card>
  );
}

// ─── Advisor avatar mark ───
// Subtle mark — initial in a soft circle. Feels human without being a mascot.
function AdvisorMark({ size = 28, theme, name = 'A' }) {
  return (
    <div style={{
      width: size, height: size, borderRadius: 9999,
      background: `linear-gradient(135deg, ${theme.primary}, ${theme.mode === 'dark' ? '#E2B47C' : '#B25C24'})`,
      color: theme.onPrimary,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: TYPE.fontSans, fontSize: size * 0.42, fontWeight: 700,
      letterSpacing: 0,
      flexShrink: 0,
      boxShadow: theme.mode === 'dark' ? '0 0 0 1px rgba(255,255,255,0.06)' : '0 1px 2px rgba(199, 118, 56, 0.25)',
    }}>{name}</div>
  );
}

Object.assign(window, {
  Button, Card, Pill, Money, CategoryIcon, TransactionRow,
  BottomSheet, BottomNav, Donut, ProgressBar, SectionTitle,
  QuestionCard, AdvisorMark,
});
