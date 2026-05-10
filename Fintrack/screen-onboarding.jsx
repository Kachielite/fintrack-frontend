// FinTrack — Onboarding screens (Step A: Gmail, Step B: Goal)

function OnboardingStep({ step, total = 2, theme }) {
  // dot indicator
  return (
    <div style={{ display: 'flex', gap: 6, alignItems: 'center', padding: '0 24px' }}>
      {Array.from({ length: total }).map((_, i) => (
        <div key={i} style={{
          height: 4, borderRadius: 99,
          flex: i < step ? 2 : 1,
          background: i < step ? theme.primary : theme.surface3,
          transition: 'flex 320ms ease, background 320ms ease',
        }} />
      ))}
    </div>
  );
}

// ─── Step A: Gmail label setup ───
function OnboardingGmail({ theme, onNext, onShowHow }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', paddingTop: 64 }}>
      <OnboardingStep step={1} total={2} theme={theme} />
      <div style={{ padding: '32px 24px 0', flex: 1, overflow: 'auto' }}>

        {/* Visual: stylized Gmail label illustration — non-technical */}
        <div style={{
          height: 220, marginBottom: 28,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          position: 'relative',
        }}>
          {/* envelopes */}
          <div style={{
            position: 'absolute', width: 240, height: 160,
            transform: 'rotate(-8deg) translateY(8px)',
            background: theme.surface3,
            borderRadius: 16,
            border: `1px solid ${theme.border}`,
          }} />
          <div style={{
            position: 'absolute', width: 240, height: 160,
            transform: 'rotate(4deg)',
            background: theme.surface, borderRadius: 16,
            border: `1px solid ${theme.border}`,
            padding: 20, display: 'flex', flexDirection: 'column', gap: 12,
            boxShadow: theme.mode === 'dark' ? 'none' : '0 8px 24px rgba(35,28,19,0.08)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ width: 28, height: 28, borderRadius: 8, background: theme.primarySoft, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Icons.tag size={14} color={theme.primary} />
              </div>
              <div style={{
                fontFamily: TYPE.fontSans, fontSize: 13, fontWeight: 700, color: theme.text,
              }}>Bank Transactions</div>
            </div>
            <div style={{ height: 1, background: theme.border }} />
            {['GTBank · Debit alert', 'Kuda · Transfer', 'Wise · Card payment'].map((t, i) => (
              <div key={i} style={{
                display: 'flex', alignItems: 'center', gap: 8,
                fontFamily: TYPE.fontSans, fontSize: 11, color: theme.textMuted,
              }}>
                <div style={{ width: 6, height: 6, borderRadius: 99, background: theme.primary }} />
                {t}
              </div>
            ))}
          </div>
        </div>

        <div style={{
          fontFamily: TYPE.fontSans, fontSize: 28, fontWeight: 700,
          color: theme.text, letterSpacing: -0.6, lineHeight: 1.15,
          marginBottom: 12, textWrap: 'pretty',
        }}>
          Let's give your bank emails<br/>a home in Gmail.
        </div>

        <div style={{
          fontFamily: TYPE.fontSans, fontSize: 16, fontWeight: 400,
          color: theme.textMuted, lineHeight: 1.45,
          marginBottom: 24, textWrap: 'pretty',
        }}>
          Create a label called <strong style={{ color: theme.text, fontWeight: 600 }}>Bank Transactions</strong> in Gmail, then route your bank alerts there with a filter. We'll only ever read from that one label.
        </div>

        {/* Reassurance card */}
        <Card theme={theme} padding={16} style={{ display: 'flex', gap: 12, alignItems: 'flex-start', marginBottom: 24 }}>
          <div style={{
            width: 36, height: 36, borderRadius: 10,
            background: theme.primarySoft,
            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
          }}>
            <Icons.shield size={18} color={theme.primary} />
          </div>
          <div>
            <div style={{ fontFamily: TYPE.fontSans, fontSize: 14, fontWeight: 600, color: theme.text, marginBottom: 2 }}>
              Just this label. Nothing else.
            </div>
            <div style={{ fontFamily: TYPE.fontSans, fontSize: 13, color: theme.textMuted, lineHeight: 1.4 }}>
              We can't see your inbox, drafts, or other folders — only the bank emails you route to this label.
            </div>
          </div>
        </Card>
      </div>

      <div style={{ padding: '12px 24px 28px', display: 'flex', flexDirection: 'column', gap: 10 }}>
        <Button variant="primary" size="lg" theme={theme} full onClick={onNext}>
          I've set up the label
        </Button>
        <Button variant="ghost" size="md" theme={theme} full onClick={onShowHow}>
          Show me how →
        </Button>
      </div>
    </div>
  );
}

// ─── Step B: Goal + Income ───
function OnboardingGoal({ theme, onNext }) {
  const [goal, setGoal] = React.useState('save');
  const [incomeIdx, setIncomeIdx] = React.useState(2);
  const [pay, setPay] = React.useState('monthly');

  const goals = [
    { id: 'save',  label: 'Build savings', sub: 'Grow a cushion for the future' },
    { id: 'debt',  label: 'Clear debt',     sub: 'Pay down what you owe, faster' },
    { id: 'daily', label: 'Manage day-to-day', sub: 'Just keep things in check' },
    { id: 'goal',  label: 'Save for something specific', sub: 'A trip, a thing, a milestone' },
  ];
  const incomes = [
    { label: 'Under ₦200k', range: '0 – 200k' },
    { label: '₦200k – ₦600k', range: '200k – 600k' },
    { label: '₦600k – ₦1.5M', range: '600k – 1.5M' },
    { label: '₦1.5M – ₦3M', range: '1.5M – 3M' },
    { label: 'Over ₦3M', range: '3M+' },
  ];
  const paySchedules = [
    { id: 'weekly', label: 'Weekly' },
    { id: 'biweekly', label: 'Bi-weekly' },
    { id: 'monthly', label: 'Monthly' },
    { id: 'irregular', label: 'Irregular' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', paddingTop: 64 }}>
      <OnboardingStep step={2} total={2} theme={theme} />
      <div style={{ padding: '28px 24px 24px', flex: 1, overflow: 'auto' }}>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
          <AdvisorMark theme={theme} name="I" size={32} />
          <span style={{ fontFamily: TYPE.fontSans, fontSize: 13, fontWeight: 600, color: theme.textMuted }}>
            Iris, your advisor
          </span>
        </div>

        <div style={{
          fontFamily: TYPE.fontSans, fontSize: 26, fontWeight: 700,
          color: theme.text, letterSpacing: -0.5, lineHeight: 1.2,
          marginBottom: 8,
        }}>
          Let's get to know your situation a little.
        </div>
        <div style={{
          fontFamily: TYPE.fontSans, fontSize: 15, color: theme.textMuted,
          marginBottom: 24, lineHeight: 1.4,
        }}>
          Three quick questions. No exact numbers needed — rough is fine.
        </div>

        {/* Q1 — Goal */}
        <div style={{ marginBottom: 24 }}>
          <div style={{ fontFamily: TYPE.fontSans, fontSize: 14, fontWeight: 700, color: theme.text, marginBottom: 10 }}>
            What matters most right now?
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {goals.map(g => {
              const active = goal === g.id;
              return (
                <div key={g.id} onClick={() => setGoal(g.id)} style={{
                  padding: '14px 16px', borderRadius: 14,
                  background: active ? theme.primarySoft : theme.surface,
                  border: `1.5px solid ${active ? theme.primary : theme.border}`,
                  cursor: 'pointer',
                  transition: 'background 160ms ease, border-color 160ms ease',
                }}>
                  <div style={{ fontFamily: TYPE.fontSans, fontSize: 15, fontWeight: 600, color: active ? theme.primary : theme.text }}>
                    {g.label}
                  </div>
                  <div style={{ fontFamily: TYPE.fontSans, fontSize: 13, color: theme.textMuted, marginTop: 2 }}>
                    {g.sub}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Q2 — Income */}
        <div style={{ marginBottom: 24 }}>
          <div style={{ fontFamily: TYPE.fontSans, fontSize: 14, fontWeight: 700, color: theme.text, marginBottom: 4 }}>
            Roughly, how much comes in each month?
          </div>
          <div style={{ fontFamily: TYPE.fontSans, fontSize: 12, color: theme.textSubtle, marginBottom: 12 }}>
            We'll never share this. It just helps Iris give better advice.
          </div>

          {/* stepped slider */}
          <div style={{ padding: '8px 4px' }}>
            <div style={{
              fontFamily: TYPE.fontMono, fontSize: 22, fontWeight: 700,
              color: theme.primary, marginBottom: 14, letterSpacing: -0.3,
            }}>
              {incomes[incomeIdx].label}
            </div>
            <div style={{ position: 'relative', height: 28, display: 'flex', alignItems: 'center' }}>
              {/* track */}
              <div style={{
                position: 'absolute', left: 0, right: 0, height: 4, borderRadius: 99,
                background: theme.surface3,
              }} />
              <div style={{
                position: 'absolute', left: 0, height: 4, borderRadius: 99,
                background: theme.primary,
                width: `${(incomeIdx / (incomes.length - 1)) * 100}%`,
              }} />
              {/* steps */}
              {incomes.map((_, i) => {
                const left = (i / (incomes.length - 1)) * 100;
                const active = i <= incomeIdx;
                return (
                  <div key={i} onClick={() => setIncomeIdx(i)} style={{
                    position: 'absolute', left: `${left}%`,
                    transform: 'translate(-50%, 0)',
                    width: i === incomeIdx ? 22 : 12,
                    height: i === incomeIdx ? 22 : 12,
                    borderRadius: 99,
                    background: active ? theme.primary : theme.surface3,
                    border: i === incomeIdx ? `4px solid ${theme.surface}` : 'none',
                    boxShadow: i === incomeIdx ? '0 2px 8px rgba(199, 118, 56, 0.4)' : 'none',
                    cursor: 'pointer',
                    transition: 'all 160ms ease',
                  }} />
                );
              })}
            </div>
          </div>
        </div>

        {/* Q3 — Pay frequency */}
        <div style={{ marginBottom: 8 }}>
          <div style={{ fontFamily: TYPE.fontSans, fontSize: 14, fontWeight: 700, color: theme.text, marginBottom: 10 }}>
            How often do you get paid?
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            {paySchedules.map(p => {
              const active = pay === p.id;
              return (
                <div key={p.id} onClick={() => setPay(p.id)} style={{
                  padding: '14px 12px', borderRadius: 14, textAlign: 'center',
                  background: active ? theme.primarySoft : theme.surface,
                  border: `1.5px solid ${active ? theme.primary : theme.border}`,
                  fontFamily: TYPE.fontSans, fontSize: 14, fontWeight: 600,
                  color: active ? theme.primary : theme.text,
                  cursor: 'pointer',
                }}>
                  {p.label}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div style={{ padding: '12px 24px 28px' }}>
        <Button variant="primary" size="lg" theme={theme} full onClick={onNext}>
          Continue
        </Button>
      </div>
    </div>
  );
}

Object.assign(window, { OnboardingGmail, OnboardingGoal });
