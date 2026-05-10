// FinTrack — Transaction Feed

function TransactionsScreen({ theme, tweaks, onOpenTx }) {
  const [search, setSearch] = React.useState('');
  const [filterOpen, setFilterOpen] = React.useState(false);
  const [filters, setFilters] = React.useState({ banks: [], categories: [], currencies: [] });

  const banks = [...new Set(TXNS.map(t => t.bank))];
  const cats = [...new Set(TXNS.map(t => t.category))];
  const currencies = [...new Set(TXNS.map(t => t.currency))];

  const filtered = TXNS.filter(t => {
    if (search && !t.merchant.toLowerCase().includes(search.toLowerCase())) return false;
    if (filters.banks.length && !filters.banks.includes(t.bank)) return false;
    if (filters.categories.length && !filters.categories.includes(t.category)) return false;
    if (filters.currencies.length && !filters.currencies.includes(t.currency)) return false;
    return true;
  });

  const groups = {
    today: filtered.filter(t => t.date === 'today'),
    yesterday: filtered.filter(t => t.date === 'yesterday'),
    earlier: filtered.filter(t => t.date === 'earlier'),
  };

  const filterCount = filters.banks.length + filters.categories.length + filters.currencies.length;

  const toggle = (key, val) => {
    setFilters(f => ({
      ...f,
      [key]: f[key].includes(val) ? f[key].filter(x => x !== val) : [...f[key], val],
    }));
  };

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: theme.bg }}>
      {/* Header */}
      <div style={{ paddingTop: 56, paddingBottom: 8 }}>
        <div style={{
          padding: '14px 20px 10px',
          fontFamily: TYPE.fontSans, fontSize: 28, fontWeight: 700,
          color: theme.text, letterSpacing: -0.6,
        }}>Transactions</div>

        {/* Search + filter */}
        <div style={{ padding: '4px 16px 10px', display: 'flex', gap: 8 }}>
          <div style={{
            flex: 1, height: 42, borderRadius: 12,
            background: theme.surface, border: `1px solid ${theme.border}`,
            display: 'flex', alignItems: 'center', gap: 8, padding: '0 12px',
          }}>
            <Icons.search size={16} color={theme.textMuted} />
            <input
              value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search transactions"
              style={{
                flex: 1, background: 'transparent', border: 'none', outline: 'none',
                fontFamily: TYPE.fontSans, fontSize: 14, color: theme.text,
              }}
            />
          </div>
          <button onClick={() => setFilterOpen(true)} style={{
            position: 'relative',
            width: 42, height: 42, borderRadius: 12,
            background: filterCount > 0 ? theme.primary : theme.surface,
            border: `1px solid ${filterCount > 0 ? theme.primary : theme.border}`,
            cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Icons.filter size={18} color={filterCount > 0 ? theme.onPrimary : theme.text} />
            {filterCount > 0 && (
              <span style={{
                position: 'absolute', top: -4, right: -4,
                background: theme.alert, color: '#fff',
                width: 18, height: 18, borderRadius: 99,
                fontFamily: TYPE.fontSans, fontSize: 10, fontWeight: 700,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>{filterCount}</span>
            )}
          </button>
        </div>
      </div>

      {/* Feed */}
      <div style={{ flex: 1, overflow: 'auto', padding: '0 16px 110px' }}>
        {filtered.length === 0 ? (
          <EmptyState theme={theme} />
        ) : (
          Object.entries(groups).map(([key, txns]) => txns.length > 0 && (
            <div key={key} style={{ marginBottom: 18 }}>
              <SectionTitle theme={theme} style={{ padding: '12px 4px 8px' }}>
                {key === 'today' ? 'Today' : key === 'yesterday' ? 'Yesterday' : 'Earlier'}
              </SectionTitle>
              <Card theme={theme} padding={0}>
                <div style={{ padding: '4px 16px' }}>
                  {txns.map((tx, i) => (
                    <div key={tx.id} style={{
                      borderBottom: i < txns.length - 1 ? `1px solid ${theme.border}` : 'none',
                    }}>
                      <TransactionRow tx={tx} theme={theme} refCurrency="NGN" onClick={() => onOpenTx(tx)} />
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          ))
        )}
      </div>

      {/* Filter sheet */}
      <BottomSheet open={filterOpen} onClose={() => setFilterOpen(false)} theme={theme} title="Filter">
        <div style={{ padding: '4px 20px 20px', display: 'flex', flexDirection: 'column', gap: 24 }}>
          <FilterGroup theme={theme} label="Bank" options={banks} selected={filters.banks} onToggle={v => toggle('banks', v)} />
          <FilterGroup theme={theme} label="Category" options={cats} selected={filters.categories} onToggle={v => toggle('categories', v)} fmt={c => CATEGORIES[c].label} />
          <FilterGroup theme={theme} label="Currency" options={currencies} selected={filters.currencies} onToggle={v => toggle('currencies', v)} />
          <div style={{ display: 'flex', gap: 8 }}>
            <Button variant="secondary" theme={theme} full onClick={() => setFilters({ banks: [], categories: [], currencies: [] })}>
              Clear
            </Button>
            <Button variant="primary" theme={theme} full onClick={() => setFilterOpen(false)}>
              Show {filtered.length} results
            </Button>
          </div>
        </div>
      </BottomSheet>
    </div>
  );
}

function FilterGroup({ label, options, selected, onToggle, theme, fmt = x => x }) {
  return (
    <div>
      <div style={{
        fontFamily: TYPE.fontSans, fontSize: 12, fontWeight: 700, color: theme.textMuted,
        textTransform: 'uppercase', letterSpacing: 0.6, marginBottom: 10,
      }}>{label}</div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
        {options.map(o => {
          const active = selected.includes(o);
          return (
            <div key={o} onClick={() => onToggle(o)} style={{
              padding: '8px 14px', borderRadius: 99, cursor: 'pointer',
              background: active ? theme.primary : theme.surface3,
              color: active ? theme.onPrimary : theme.text,
              fontFamily: TYPE.fontSans, fontSize: 13, fontWeight: 600,
              border: `1px solid ${active ? theme.primary : 'transparent'}`,
            }}>{fmt(o)}</div>
          );
        })}
      </div>
    </div>
  );
}

function EmptyState({ theme }) {
  return (
    <div style={{
      padding: 48, textAlign: 'center', display: 'flex', flexDirection: 'column',
      alignItems: 'center', gap: 12, marginTop: 40,
    }}>
      <div style={{
        width: 64, height: 64, borderRadius: 99, background: theme.primarySoft,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <Icons.search size={28} color={theme.primary} />
      </div>
      <div style={{ fontFamily: TYPE.fontSans, fontSize: 17, fontWeight: 700, color: theme.text }}>
        Nothing matches that
      </div>
      <div style={{ fontFamily: TYPE.fontSans, fontSize: 14, color: theme.textMuted, maxWidth: 240, lineHeight: 1.4 }}>
        Try a different search or clear a filter to see more.
      </div>
    </div>
  );
}

Object.assign(window, { TransactionsScreen, EmptyState });
