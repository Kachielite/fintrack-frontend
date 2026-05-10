// FinTrack — Multi-Currency Breakdown

function CurrencyScreen({ theme, tweaks, onOpenTx, embedded = false }) {
  const currenciesActive = ['NGN', 'USD', 'GBP'];
  const [active, setActive] = React.useState('NGN');

  const filtered = TXNS.filter(t => t.currency === active);
  const inflow = filtered.filter(t => t.amount > 0).reduce((s, t) => s + t.amount, 0);
  const outflow = filtered.filter(t => t.amount < 0).reduce((s, t) => s + Math.abs(t.amount), 0);
  const net = inflow - outflow;

  const refRate = FX[active] / FX.NGN;
  const refNet = net * refRate;

  // FX impact (mocked) — only meaningful for foreign currencies
  const fxImpact = active === 'USD' ? 8 : active === 'GBP' ? 4 : null;

  return (
    <div style={{ height: '100%', overflow: 'auto', paddingTop: embedded ? 0 : 56, paddingBottom: embedded ? 24 : 110, background: theme.bg }}>

      {!embedded && (
        <>
          <div style={{
            padding: '14px 20px 4px',
            fontFamily: TYPE.fontSans, fontSize: 28, fontWeight: 700,
            color: theme.text, letterSpacing: -0.6,
          }}>Currencies</div>
          <div style={{
            padding: '0 20px 16px',
            fontFamily: TYPE.fontSans, fontSize: 14, color: theme.textMuted,
          }}>Reference: <strong style={{ color: theme.text, fontWeight: 600 }}>NGN ₦</strong></div>
        </>
      )}

      {/* Currency tabs */}
      <div style={{ padding: '0 16px 18px', display: 'flex', gap: 8, overflowX: 'auto' }}>
        {currenciesActive.map(c => {
          const isActive = active === c;
          return (
            <div key={c} onClick={() => setActive(c)} style={{
              padding: '10px 16px', borderRadius: 99, cursor: 'pointer',
              background: isActive ? theme.text : theme.surface,
              color: isActive ? theme.bg : theme.text,
              border: `1px solid ${isActive ? theme.text : theme.border}`,
              fontFamily: TYPE.fontSans, fontSize: 14, fontWeight: 700,
              letterSpacing: -0.1, whiteSpace: 'nowrap',
              display: 'flex', alignItems: 'center', gap: 6,
            }}>
              <span style={{ fontFamily: TYPE.fontMono, fontWeight: 800 }}>{CURRENCY_SYMBOLS[c]}</span>
              {c}
            </div>
          );
        })}
      </div>

      <div style={{ padding: '0 16px', display: 'flex', flexDirection: 'column', gap: 16 }}>

        {/* Q1 — How much moved through this currency? */}
        <QuestionCard theme={theme} question={`How did my ${active} flow this month?`}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {/* Stacked horizontal bar */}
            <div>
              <div style={{ display: 'flex', height: 12, borderRadius: 99, overflow: 'hidden', background: theme.surface3 }}>
                <div style={{
                  width: `${(inflow / (inflow + outflow || 1)) * 100}%`,
                  background: theme.good, height: '100%',
                }} />
                <div style={{
                  width: `${(outflow / (inflow + outflow || 1)) * 100}%`,
                  background: theme.warn, height: '100%',
                }} />
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                  <div style={{ width: 8, height: 8, borderRadius: 99, background: theme.good }} />
                  <span style={{ fontFamily: TYPE.fontSans, fontSize: 12, fontWeight: 600, color: theme.textMuted }}>In</span>
                </div>
                <Money amount={inflow} currency={active} theme={theme} size={17} weight={700} color={theme.good} />
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4, justifyContent: 'flex-end' }}>
                  <div style={{ width: 8, height: 8, borderRadius: 99, background: theme.warn }} />
                  <span style={{ fontFamily: TYPE.fontSans, fontSize: 12, fontWeight: 600, color: theme.textMuted }}>Out</span>
                </div>
                <Money amount={outflow} currency={active} theme={theme} size={17} weight={700} color={theme.text} />
              </div>
            </div>
            <div style={{
              padding: '12px 14px', borderRadius: 12, background: theme.surface3,
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            }}>
              <span style={{ fontFamily: TYPE.fontSans, fontSize: 13, fontWeight: 600, color: theme.textMuted }}>
                Net change
              </span>
              <Money amount={net} currency={active} theme={theme} size={17} weight={700} signed
                color={net >= 0 ? theme.good : theme.alert} />
            </div>
          </div>
        </QuestionCard>

        {/* Q2 — In NGN terms */}
        {active !== 'NGN' && (
          <QuestionCard theme={theme} question={`What's that in ₦ today?`}
            footer={
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>1 {active} ≈ ₦{refRate.toLocaleString()}</span>
                <span>fetched today, 9:32 AM</span>
              </div>
            }
          >
            <Money amount={refNet} currency="NGN" theme={theme} size={32} weight={700} signed color={theme.text} />
            <div style={{
              fontFamily: TYPE.fontSans, fontSize: 13, color: theme.textMuted, marginTop: 6,
            }}>your net {active} flow, in your reference currency</div>
          </QuestionCard>
        )}

        {/* Q3 — FX impact */}
        {fxImpact !== null && (
          <Card theme={theme} padding={0} style={{
            background: `linear-gradient(135deg, ${theme.primarySoft}, ${theme.surface})`,
            border: `1px solid ${theme.primary}33`,
            overflow: 'hidden',
          }}>
            <div style={{ padding: '18px 20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                <Icons.sparkle size={14} color={theme.primary} strokeWidth={2.2} />
                <span style={{
                  fontFamily: TYPE.fontSans, fontSize: 11, fontWeight: 700,
                  color: theme.primary, textTransform: 'uppercase', letterSpacing: 0.8,
                }}>FX heads up</span>
              </div>
              <div style={{
                fontFamily: TYPE.fontSans, fontSize: 16, fontWeight: 500,
                color: theme.text, lineHeight: 1.4, letterSpacing: -0.2,
                textWrap: 'pretty',
              }}>
                Your {active} subscriptions cost you <strong style={{ fontWeight: 700 }}>{fxImpact}% more</strong> in ₦ terms than 3 months ago. The naira has softened a touch.
              </div>
            </div>
          </Card>
        )}

        {/* Filtered transactions */}
        <div>
          <SectionTitle theme={theme}>{active} transactions</SectionTitle>
          {filtered.length > 0 ? (
            <Card theme={theme} padding={0}>
              <div style={{ padding: '4px 16px' }}>
                {filtered.map((tx, i) => (
                  <div key={tx.id} style={{
                    borderBottom: i < filtered.length - 1 ? `1px solid ${theme.border}` : 'none',
                  }}>
                    <TransactionRow tx={tx} theme={theme} refCurrency="NGN" onClick={() => onOpenTx(tx)} />
                  </div>
                ))}
              </div>
            </Card>
          ) : (
            <Card theme={theme} padding={32} style={{ textAlign: 'center' }}>
              <div style={{ fontFamily: TYPE.fontSans, fontSize: 15, fontWeight: 600, color: theme.text, marginBottom: 4 }}>
                No {active} activity yet
              </div>
              <div style={{ fontFamily: TYPE.fontSans, fontSize: 13, color: theme.textMuted }}>
                Transactions in this currency will appear here.
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { CurrencyScreen });
