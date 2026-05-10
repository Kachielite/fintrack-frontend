// FinTrack — Home / Dashboard

function HomeScreen({ theme, tweaks, onTabChange, onOpenInsight, onOpenTx, onOpenNotifications, onOpenCurrencies, refCurrency = 'NGN' }) {
  const advisor = ADVISOR_MESSAGES[tweaks.advisorTone || 'warm'];
  const monthSpend = TXNS
    .filter(t => t.amount < 0)
    .reduce((s, t) => s + Math.abs(toRef(t.amount, t.currency)), 0);
  const lastMonth = monthSpend * 1.14; // mocked comparison
  const deltaPct = Math.round((monthSpend - lastMonth) / lastMonth * 100);

  const totals = categoryTotals(TXNS);
  const top = Object.entries(totals)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([cat, val], i) => ({
      cat, value: val, color: theme.chart[CATEGORIES[cat].hue],
    }));

  const recent = TXNS.slice(0, 4);

  const cozy = (tweaks.density || 'cozy') === 'cozy';
  const pad = cozy ? 18 : 12;

  return (
    <div style={{
      height: '100%', overflow: 'auto',
      paddingTop: 56, paddingBottom: 110,
      background: theme.bg,
    }}>
      {/* Header */}
      <div style={{ padding: '18px 20px 24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
          <AdvisorMark theme={theme} name="I" size={36} />
          <div style={{ flex: 1 }}>
            <div style={{
              fontFamily: TYPE.fontSans, fontSize: 13, fontWeight: 600,
              color: theme.textMuted, marginBottom: 1,
            }}>Good morning, {MOCK_USER.firstName}</div>
            <div style={{
              fontFamily: TYPE.fontSans, fontSize: 14, fontWeight: 500,
              color: theme.text, lineHeight: 1.35, letterSpacing: -0.2,
              textWrap: 'pretty',
            }}>{advisor.home}</div>
          </div>
          <button onClick={onOpenNotifications} style={{
            position: 'relative', width: 40, height: 40, borderRadius: 99,
            background: theme.surface, border: `1px solid ${theme.border}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', flexShrink: 0,
          }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={theme.text} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 8a6 6 0 0112 0c0 7 3 9 3 9H3s3-2 3-9"/>
              <path d="M10.3 21a1.94 1.94 0 003.4 0"/>
            </svg>
            <span style={{
              position: 'absolute', top: 8, right: 8,
              width: 8, height: 8, borderRadius: 99, background: theme.alert,
              border: `2px solid ${theme.surface}`,
            }} />
          </button>
        </div>
      </div>

      <div style={{ padding: '0 16px', display: 'flex', flexDirection: 'column', gap: pad }}>

        {/* Q1 — How am I doing this month? */}
        <QuestionCard
          theme={theme}
          question="How am I doing this month?"
          footer={
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Compared to your last 3-month average</span>
                <span style={{ color: deltaPct < 0 ? theme.good : theme.warn, fontWeight: 600 }}>
                  {deltaPct < 0 ? '↓' : '↑'} {Math.abs(deltaPct)}%
                </span>
              </div>
              <button onClick={onOpenCurrencies} style={{
                background: 'transparent', border: 'none', padding: 0, cursor: 'pointer',
                fontFamily: TYPE.fontSans, fontSize: 13, fontWeight: 600,
                color: theme.primary, display: 'flex', alignItems: 'center', gap: 6,
                textAlign: 'left',
              }}>
                See spending across currencies
                <Icons.arrowR size={12} strokeWidth={2.4} />
              </button>
            </div>
          }
        >
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 8 }}>
            <Money amount={-monthSpend} currency="NGN" theme={theme} size={36} weight={700} />
          </div>
          <div style={{
            fontFamily: TYPE.fontSans, fontSize: 13, color: theme.textMuted,
          }}>spent so far in May · 6 days left</div>

          {/* Mini month progress bar with marker */}
          <div style={{ marginTop: 14, position: 'relative', height: 22 }}>
            <div style={{
              position: 'absolute', left: 0, right: 0, top: 8,
              height: 6, borderRadius: 99, background: theme.surface3,
            }} />
            <div style={{
              position: 'absolute', left: 0, top: 8, height: 6, borderRadius: 99,
              background: theme.primary, width: `${(25 / 31) * 100}%`,
            }} />
            <div style={{
              position: 'absolute', top: 0, left: `${(25 / 31) * 100}%`,
              transform: 'translateX(-50%)',
              fontFamily: TYPE.fontMono, fontSize: 10, color: theme.textMuted, fontWeight: 600,
            }}>day 25</div>
          </div>
        </QuestionCard>

        {/* Q2 — Where is my money going? */}
        <QuestionCard theme={theme} question="Where is my money going?">
          <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
            <Donut
              theme={theme}
              size={130} thickness={20}
              data={top.map(t => ({ value: t.value, color: t.color }))}
              total={monthSpend}
            >
              <div style={{ fontFamily: TYPE.fontSans, fontSize: 11, color: theme.textMuted, fontWeight: 600 }}>top 5</div>
              <div style={{ fontFamily: TYPE.fontSans, fontSize: 22, fontWeight: 700, color: theme.text, letterSpacing: -0.4 }}>
                {Math.round(top.reduce((s, t) => s + t.value, 0) / monthSpend * 100)}%
              </div>
              <div style={{ fontFamily: TYPE.fontSans, fontSize: 10, color: theme.textSubtle }}>of spend</div>
            </Donut>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
              {top.map(t => (
                <div key={t.cat} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ width: 8, height: 8, borderRadius: 99, background: t.color, flexShrink: 0 }} />
                  <span style={{ flex: 1, fontFamily: TYPE.fontSans, fontSize: 12, fontWeight: 600, color: theme.text }}>
                    {CATEGORIES[t.cat].label}
                  </span>
                  <span style={{ fontFamily: TYPE.fontMono, fontSize: 11, fontWeight: 600, color: theme.textMuted }}>
                    {Math.round(t.value / monthSpend * 100)}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        </QuestionCard>

        {/* Q3 — Anything I should know? */}
        <Card theme={theme} padding={0} elevated style={{
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
              }}>Iris noticed</span>
            </div>
            <div style={{
              fontFamily: TYPE.fontSans, fontSize: 17, fontWeight: 600,
              color: theme.text, lineHeight: 1.35, letterSpacing: -0.3,
              marginBottom: 14, textWrap: 'pretty',
            }}>
              {advisor.insight}
            </div>
            <button onClick={onOpenInsight} style={{
              background: 'transparent', border: 'none', padding: 0, cursor: 'pointer',
              fontFamily: TYPE.fontSans, fontSize: 14, fontWeight: 600,
              color: theme.primary, display: 'flex', alignItems: 'center', gap: 6,
            }}>
              See the breakdown
              <Icons.arrowR size={14} strokeWidth={2.2} />
            </button>
          </div>
        </Card>

        {/* Recent transactions */}
        <div>
          <SectionTitle theme={theme} action={<span onClick={() => onTabChange('tx')}>See all</span>}>
            Recent
          </SectionTitle>
          <Card theme={theme} padding={0}>
            <div style={{ padding: '4px 16px' }}>
              {recent.map((tx, i) => (
                <div key={tx.id} style={{
                  borderBottom: i < recent.length - 1 ? `1px solid ${theme.border}` : 'none',
                }}>
                  <TransactionRow tx={tx} theme={theme} refCurrency="NGN" onClick={() => onOpenTx(tx)} />
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { HomeScreen });
