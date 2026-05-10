// FinTrack — Budget / Advisor View

function BudgetScreen({ theme, tweaks, onAcceptSuggestion, onOpenTx }) {
  const advisor = ADVISOR_MESSAGES[tweaks.advisorTone || 'warm'];
  const [budgets, setBudgets] = React.useState(BUDGETS);
  const [acceptedSuggestion, setAcceptedSuggestion] = React.useState(false);
  const [openCat, setOpenCat] = React.useState(null);

  // Goal progress (mocked)
  const goal = { name: 'Lagos to Cape Town trip', target: 1500000, saved: 487000 };
  const goalPct = (goal.saved / goal.target) * 100;

  return (
    <div style={{ height: '100%', overflow: 'auto', paddingTop: 56, paddingBottom: 110, background: theme.bg }}>
      {/* Header */}
      <div style={{
        padding: '14px 20px 4px',
        fontFamily: TYPE.fontSans, fontSize: 28, fontWeight: 700,
        color: theme.text, letterSpacing: -0.6,
      }}>Budget</div>

      <div style={{ padding: '12px 16px', display: 'flex', flexDirection: 'column', gap: 18 }}>

        {/* Advisor message — top, sets the emotional tone */}
        <Card theme={theme} padding={0} style={{
          background: `linear-gradient(160deg, ${theme.primarySoft} 0%, ${theme.surface} 70%)`,
          border: `1px solid ${theme.primary}33`,
          overflow: 'hidden',
        }}>
          <div style={{ padding: '20px 20px 18px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
              <AdvisorMark theme={theme} name="I" size={32} />
              <div>
                <div style={{ fontFamily: TYPE.fontSans, fontSize: 13, fontWeight: 700, color: theme.text }}>
                  Iris
                </div>
                <div style={{ fontFamily: TYPE.fontSans, fontSize: 11, color: theme.textMuted }}>
                  Reflecting on your May
                </div>
              </div>
            </div>
            <div style={{
              fontFamily: TYPE.fontSans, fontSize: 16, fontWeight: 500,
              color: theme.text, lineHeight: 1.45, letterSpacing: -0.2,
              textWrap: 'pretty',
            }}>{advisor.budget}</div>
          </div>
        </Card>

        {/* Budget cards */}
        <div>
          <SectionTitle theme={theme}>How are my budgets doing?</SectionTitle>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {budgets.map(b => <BudgetCard key={b.category} budget={b} theme={theme} onClick={() => setOpenCat(b.category)} />)}
          </div>
        </div>

        {/* Suggested */}
        {!acceptedSuggestion && (
          <Card theme={theme} padding={0} style={{ overflow: 'hidden', border: `1.5px dashed ${theme.borderStrong}` }}>
            <div style={{ padding: '18px 20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10 }}>
                <Icons.sparkle size={13} color={theme.primary} strokeWidth={2.2} />
                <span style={{
                  fontFamily: TYPE.fontSans, fontSize: 11, fontWeight: 700,
                  color: theme.primary, textTransform: 'uppercase', letterSpacing: 0.8,
                }}>Suggested for you</span>
              </div>
              <div style={{
                fontFamily: TYPE.fontSans, fontSize: 16, fontWeight: 500,
                color: theme.text, lineHeight: 1.4, marginBottom: 14, letterSpacing: -0.2,
                textWrap: 'pretty',
              }}>
                Based on your last 3 months, a <strong style={{ fontWeight: 700 }}>₦40,000</strong> dining budget seems realistic. Want to set it?
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <Button variant="primary" size="sm" theme={theme} onClick={() => {
                  setAcceptedSuggestion(true);
                  onAcceptSuggestion && onAcceptSuggestion();
                }}>Accept ₦40,000</Button>
                <Button variant="secondary" size="sm" theme={theme}>Adjust</Button>
                <Button variant="ghost" size="sm" theme={theme}>Not now</Button>
              </div>
            </div>
          </Card>
        )}

        {/* Goal progress */}
        <div>
          <SectionTitle theme={theme}>Am I getting closer to my goal?</SectionTitle>
          <Card theme={theme} padding={20}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 14 }}>
              <div>
                <div style={{ fontFamily: TYPE.fontSans, fontSize: 12, fontWeight: 600, color: theme.textMuted, marginBottom: 2 }}>
                  Saving toward
                </div>
                <div style={{ fontFamily: TYPE.fontSans, fontSize: 17, fontWeight: 700, color: theme.text, letterSpacing: -0.3 }}>
                  {goal.name}
                </div>
              </div>
              <Pill theme={theme} bg={theme.primarySoft} color={theme.primary} size="md">
                {Math.round(goalPct)}%
              </Pill>
            </div>

            {/* Progress bar with goal markers */}
            <div style={{ position: 'relative', marginBottom: 14 }}>
              <ProgressBar value={goal.saved} max={goal.target} theme={theme} color={theme.primary} height={10} />
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
              <div>
                <Money amount={goal.saved} theme={theme} size={20} weight={700} color={theme.text} />
                <span style={{ fontFamily: TYPE.fontSans, fontSize: 13, color: theme.textMuted, marginLeft: 6 }}>saved</span>
              </div>
              <div style={{ fontFamily: TYPE.fontSans, fontSize: 13, color: theme.textMuted }}>
                of <span style={{ fontFamily: TYPE.fontMono, fontWeight: 600 }}>{formatMoney(goal.target)}</span>
              </div>
            </div>

            <div style={{
              marginTop: 14, padding: '10px 12px', borderRadius: 10,
              background: theme.surface3, fontFamily: TYPE.fontSans, fontSize: 12,
              color: theme.textMuted, lineHeight: 1.4,
            }}>
              At your current pace, you'll get there by <strong style={{ color: theme.text, fontWeight: 600 }}>March 2027</strong>.
            </div>
          </Card>
        </div>
      </div>

      <BottomSheet open={!!openCat} onClose={() => setOpenCat(null)}
        title={openCat ? CATEGORIES[openCat].label : ''}
        theme={theme} maxHeight="88%">
        {openCat && (
          <BudgetCategoryDetail
            theme={theme}
            budget={budgets.find(b => b.category === openCat)}
            onOpenTx={(tx) => { setOpenCat(null); onOpenTx && onOpenTx(tx); }}
          />
        )}
      </BottomSheet>
    </div>
  );
}

function BudgetCategoryDetail({ theme, budget, onOpenTx }) {
  const cat = CATEGORIES[budget.category];
  const pct = (budget.spent / budget.limit) * 100;
  let barColor = theme.good, label = 'On track';
  if (pct >= 100) { barColor = theme.alert; label = 'Over budget'; }
  else if (pct >= 85) { barColor = theme.warn; label = 'Heads up'; }

  // pull this category's transactions, converted to ref currency
  const txns = TXNS
    .filter(t => t.category === budget.category && t.amount < 0)
    .sort((a, b) => new Date(b.date) - new Date(a.date));

  // group by merchant for the top-merchants block
  const byMerchant = {};
  txns.forEach(t => {
    const ref = Math.abs(toRef(t.amount, t.currency));
    if (!byMerchant[t.merchant]) byMerchant[t.merchant] = { merchant: t.merchant, total: 0, count: 0 };
    byMerchant[t.merchant].total += ref;
    byMerchant[t.merchant].count += 1;
  });
  const topMerchants = Object.values(byMerchant).sort((a, b) => b.total - a.total).slice(0, 3);

  // group txns by date for the list
  const grouped = {};
  txns.forEach(t => {
    const day = t.date;
    (grouped[day] ||= []).push(t);
  });
  const dayKeys = Object.keys(grouped).sort((a, b) => new Date(b) - new Date(a));

  const remaining = budget.limit - budget.spent;

  return (
    <div style={{ padding: '4px 16px 24px' }}>
      {/* Hero summary */}
      <Card theme={theme} padding={20} style={{ marginBottom: 14 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
          <CategoryIcon category={budget.category} theme={theme} size={44} />
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: TYPE.fontSans, fontSize: 11, fontWeight: 700,
              color: barColor, textTransform: 'uppercase', letterSpacing: 0.6, marginBottom: 2 }}>
              {label}
            </div>
            <div style={{ fontFamily: TYPE.fontSans, fontSize: 13, color: theme.textMuted }}>
              {txns.length} {txns.length === 1 ? 'expense' : 'expenses'} · 6 days left
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 4 }}>
          <Money amount={-budget.spent} currency="NGN" theme={theme} size={30} weight={700}
            color={pct >= 100 ? barColor : theme.text} />
        </div>
        <div style={{ fontFamily: TYPE.fontSans, fontSize: 12, color: theme.textMuted, marginBottom: 14 }}>
          spent of <span style={{ fontFamily: TYPE.fontMono, fontWeight: 600, color: theme.text }}>
            {formatMoney(budget.limit)}
          </span> budget
        </div>

        <ProgressBar value={budget.spent} max={budget.limit} theme={theme} color={barColor} height={8} />

        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 10,
          fontFamily: TYPE.fontSans, fontSize: 12, color: theme.textMuted }}>
          <span><strong style={{ color: theme.text, fontWeight: 600 }}>{Math.round(pct)}%</strong> used</span>
          <span>{remaining >= 0
            ? <><span style={{ fontFamily: TYPE.fontMono, fontWeight: 600, color: theme.text }}>{formatMoney(remaining)}</span> left</>
            : <span style={{ color: barColor, fontWeight: 600 }}>{formatMoney(Math.abs(remaining))} over</span>}
          </span>
        </div>
      </Card>

      {/* Top merchants */}
      {topMerchants.length > 0 && (
        <>
          <SectionTitle theme={theme}>Where it's going</SectionTitle>
          <Card theme={theme} padding={0} style={{ marginBottom: 14 }}>
            <div style={{ padding: '6px 16px' }}>
              {topMerchants.map((m, i) => {
                const share = (m.total / budget.spent) * 100;
                return (
                  <div key={m.merchant} style={{
                    padding: '12px 0',
                    borderBottom: i < topMerchants.length - 1 ? `1px solid ${theme.border}` : 'none',
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 6 }}>
                      <div style={{ fontFamily: TYPE.fontSans, fontSize: 14, fontWeight: 600, color: theme.text }}>
                        {m.merchant}
                      </div>
                      <Money amount={-m.total} currency="NGN" theme={theme} size={14} weight={700} />
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div style={{ flex: 1, height: 4, borderRadius: 99, background: theme.surface3, overflow: 'hidden' }}>
                        <div style={{ height: '100%', width: `${share}%`, background: theme.chart[cat.hue], borderRadius: 99 }} />
                      </div>
                      <div style={{ fontFamily: TYPE.fontMono, fontSize: 11, color: theme.textMuted, fontWeight: 600, minWidth: 48, textAlign: 'right' }}>
                        {Math.round(share)}% · {m.count}×
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        </>
      )}

      {/* All transactions */}
      <SectionTitle theme={theme}>All expenses ({txns.length})</SectionTitle>
      {txns.length === 0 ? (
        <Card theme={theme} padding={24} style={{ textAlign: 'center' }}>
          <div style={{ fontFamily: TYPE.fontSans, fontSize: 14, color: theme.textMuted }}>
            No expenses in this category yet this month.
          </div>
        </Card>
      ) : (
        <Card theme={theme} padding={0}>
          <div style={{ padding: '4px 16px' }}>
            {dayKeys.map(day => (
              <div key={day}>
                <div style={{
                  padding: '10px 0 6px',
                  fontFamily: TYPE.fontSans, fontSize: 11, fontWeight: 700,
                  color: theme.textMuted, textTransform: 'uppercase', letterSpacing: 0.6,
                }}>{day}</div>
                {grouped[day].map((tx, i, arr) => (
                  <div key={tx.id} style={{
                    borderBottom: i < arr.length - 1 ? `1px solid ${theme.border}` : 'none',
                  }}>
                    <TransactionRow tx={tx} theme={theme} refCurrency="NGN" onClick={() => onOpenTx(tx)} />
                  </div>
                ))}
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}

function BudgetCard({ budget, theme, onClick }) {
  const pct = (budget.spent / budget.limit) * 100;
  const cat = CATEGORIES[budget.category];
  const color = theme.chart[cat.hue];

  // advisory color logic — green / amber / soft red. NEVER harsh red.
  let state = 'healthy', barColor = theme.good, label = 'On track';
  if (pct >= 100) { state = 'over'; barColor = theme.alert; label = 'Over budget'; }
  else if (pct >= 85) { state = 'warning'; barColor = theme.warn; label = 'Heads up'; }

  return (
    <Card theme={theme} padding={16} onClick={onClick}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
        <CategoryIcon category={budget.category} theme={theme} size={36} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontFamily: TYPE.fontSans, fontSize: 15, fontWeight: 700, color: theme.text, letterSpacing: -0.2 }}>
            {cat.label}
          </div>
          <div style={{ fontFamily: TYPE.fontSans, fontSize: 11, fontWeight: 600, color: barColor }}>
            {label} · 6 days left
          </div>
        </div>
        <div style={{ textAlign: 'right', flexShrink: 0 }}>
          <Money amount={budget.spent} theme={theme} size={15} weight={700} color={state === 'over' ? barColor : theme.text} />
          <div style={{ fontFamily: TYPE.fontMono, fontSize: 11, color: theme.textMuted, fontVariantNumeric: 'tabular-nums' }}>
            of {formatMoney(budget.limit)}
          </div>
        </div>
        <Icons.chevR size={14} color={theme.textMuted} />
      </div>
      <ProgressBar value={budget.spent} max={budget.limit} theme={theme} color={barColor} height={6} />
    </Card>
  );
}

Object.assign(window, { BudgetScreen, BudgetCard });
