// FinTrack — Transaction detail bottom sheet

function TransactionDetail({ tx, theme, onClose, onCorrect }) {
  if (!tx) return null;
  const cat = CATEGORIES[tx.category];
  const color = theme.chart[cat.hue];
  const isIncome = tx.amount > 0;

  const [reviewMode, setReviewMode] = React.useState(tx.status === 'unverified');
  const [pickedCat, setPickedCat] = React.useState(tx.category);

  return (
    <div style={{ padding: '4px 20px 24px' }}>
      {/* Big amount */}
      <div style={{ textAlign: 'center', padding: '8px 0 24px' }}>
        <CategoryIcon category={pickedCat} theme={theme} size={56} />
        <div style={{ marginTop: 14 }}>
          <Money amount={tx.amount} currency={tx.currency} theme={theme}
            size={36} weight={700} signed={isIncome}
            color={isIncome ? theme.good : theme.text} />
        </div>
        {tx.currency !== 'NGN' && (
          <div style={{
            marginTop: 4,
            fontFamily: TYPE.fontMono, fontSize: 13, color: theme.textMuted,
          }}>
            ≈ {formatMoney(Math.abs(tx.refAmount), 'NGN')}
          </div>
        )}
        <div style={{
          fontFamily: TYPE.fontSans, fontSize: 16, fontWeight: 600,
          color: theme.text, marginTop: 12, letterSpacing: -0.2,
        }}>{tx.merchant}</div>
        <div style={{
          fontFamily: TYPE.fontSans, fontSize: 13, color: theme.textMuted, marginTop: 2,
        }}>{tx.time} · {tx.bank}</div>
      </div>

      {/* Unverified review banner */}
      {tx.status === 'unverified' && reviewMode && (
        <Card theme={theme} padding={16} style={{
          background: theme.mode === 'dark' ? 'rgba(214,147,86,0.10)' : '#FBF0E0',
          border: `1px solid ${theme.warn}66`,
          marginBottom: 16,
        }}>
          <div style={{
            fontFamily: TYPE.fontSans, fontSize: 13, fontWeight: 700, color: theme.warn,
            textTransform: 'uppercase', letterSpacing: 0.6, marginBottom: 6,
          }}>Needs a quick look</div>
          <div style={{ fontFamily: TYPE.fontSans, fontSize: 14, color: theme.text, lineHeight: 1.4, marginBottom: 12 }}>
            We weren't sure how to categorise this one. Pick the closest fit:
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {Object.entries(CATEGORIES).map(([key, c]) => {
              const active = pickedCat === key;
              return (
                <div key={key} onClick={() => setPickedCat(key)} style={{
                  padding: '6px 10px', borderRadius: 99, cursor: 'pointer',
                  background: active ? theme.primary : theme.surface,
                  color: active ? theme.onPrimary : theme.text,
                  border: `1px solid ${active ? theme.primary : theme.border}`,
                  fontFamily: TYPE.fontSans, fontSize: 12, fontWeight: 600,
                }}>{c.label}</div>
              );
            })}
          </div>
          <div style={{ marginTop: 12 }}>
            <Button variant="primary" size="sm" theme={theme} onClick={() => {
              setReviewMode(false);
              onCorrect && onCorrect(tx.id, pickedCat);
            }}>
              Confirm category
            </Button>
          </div>
        </Card>
      )}

      {/* Detail rows */}
      <Card theme={theme} padding={0} style={{ marginBottom: 16 }}>
        {[
          ['Category', cat.label],
          ['Bank', tx.bank],
          ['Currency', tx.currency],
          ['Time', tx.time],
        ].map(([k, v], i, arr) => (
          <div key={k} style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            padding: '14px 16px',
            borderBottom: i < arr.length - 1 ? `1px solid ${theme.border}` : 'none',
          }}>
            <span style={{ fontFamily: TYPE.fontSans, fontSize: 13, color: theme.textMuted, fontWeight: 600 }}>{k}</span>
            <span style={{ fontFamily: TYPE.fontSans, fontSize: 14, color: theme.text, fontWeight: 600 }}>{v}</span>
          </div>
        ))}
      </Card>

      <div style={{ display: 'flex', gap: 8 }}>
        <Button variant="secondary" theme={theme} full onClick={onClose}>Close</Button>
      </div>
    </div>
  );
}

// ─── Insight detail (food breakdown) ───
function InsightDetail({ theme, onClose }) {
  // mocked: weekend vs weekday food spend
  const days = [
    { day: 'Mon', amount: 4500 },
    { day: 'Tue', amount: 3800 },
    { day: 'Wed', amount: 5200 },
    { day: 'Thu', amount: 4100 },
    { day: 'Fri', amount: 5800 },
    { day: 'Sat', amount: 14600 },
    { day: 'Sun', amount: 13200 },
  ];
  const max = Math.max(...days.map(d => d.amount));
  return (
    <div style={{ padding: '4px 20px 24px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
        <AdvisorMark theme={theme} name="I" size={36} />
        <div>
          <div style={{ fontFamily: TYPE.fontSans, fontSize: 14, fontWeight: 700, color: theme.text }}>
            Iris's read
          </div>
          <div style={{ fontFamily: TYPE.fontSans, fontSize: 12, color: theme.textMuted }}>
            On your food spending
          </div>
        </div>
      </div>

      <div style={{
        fontFamily: TYPE.fontSans, fontSize: 22, fontWeight: 700,
        color: theme.text, letterSpacing: -0.4, lineHeight: 1.25,
        marginBottom: 8, textWrap: 'pretty',
      }}>
        Your weekends are 3× your weekdays.
      </div>
      <div style={{
        fontFamily: TYPE.fontSans, fontSize: 14, color: theme.textMuted, lineHeight: 1.45,
        marginBottom: 22,
      }}>
        Average daily food spend, this month so far. Saturdays and Sundays stand out.
      </div>

      {/* Bar chart */}
      <Card theme={theme} padding={20} style={{ marginBottom: 16 }}>
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8, height: 140, marginBottom: 10 }}>
          {days.map(d => {
            const h = (d.amount / max) * 100;
            const isWeekend = d.day === 'Sat' || d.day === 'Sun';
            return (
              <div key={d.day} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                <div style={{
                  fontFamily: TYPE.fontMono, fontSize: 9, color: theme.textMuted, fontWeight: 600,
                }}>₦{(d.amount / 1000).toFixed(1)}k</div>
                <div style={{
                  width: '100%', height: `${h}%`, borderRadius: 6,
                  background: isWeekend ? theme.primary : theme.surface3,
                  minHeight: 4,
                }} />
                <div style={{
                  fontFamily: TYPE.fontSans, fontSize: 11, color: isWeekend ? theme.primary : theme.textMuted,
                  fontWeight: isWeekend ? 700 : 600,
                }}>{d.day}</div>
              </div>
            );
          })}
        </div>
      </Card>

      <div style={{
        padding: '14px 16px', borderRadius: 14,
        background: theme.primarySoft,
        fontFamily: TYPE.fontSans, fontSize: 14, color: theme.text, lineHeight: 1.45,
        marginBottom: 16, letterSpacing: -0.1, textWrap: 'pretty',
      }}>
        If you brought weekend food spend in line with weekdays, you'd save roughly <strong style={{ fontWeight: 700, color: theme.primary }}>₦18,000 a week</strong> — that's ₦72,000 a month toward your trip.
      </div>

      <Button variant="primary" theme={theme} full size="lg" onClick={onClose}>
        Got it, thanks Iris
      </Button>
    </div>
  );
}

Object.assign(window, { TransactionDetail, InsightDetail });
