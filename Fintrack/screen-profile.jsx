// FinTrack — Profile / Settings screen

function ProfileScreen({ theme, settings, onUpdate }) {
  const [labelEdit, setLabelEdit] = React.useState(false);
  const [tmpLabel, setTmpLabel] = React.useState(settings.gmailLabel);
  const [currencyOpen, setCurrencyOpen] = React.useState(false);

  const allCurrencies = ['NGN', 'USD', 'GBP', 'KES', 'EUR'];

  return (
    <div style={{ height: '100%', overflow: 'auto', paddingTop: 56, paddingBottom: 110, background: theme.bg }}>
      <div style={{
        padding: '14px 20px 4px',
        fontFamily: TYPE.fontSans, fontSize: 28, fontWeight: 700,
        color: theme.text, letterSpacing: -0.6,
      }}>Profile</div>

      <div style={{ padding: '12px 16px', display: 'flex', flexDirection: 'column', gap: 16 }}>
        {/* Profile card */}
        <Card theme={theme} padding={20}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{
              width: 56, height: 56, borderRadius: 99,
              background: `linear-gradient(135deg, ${theme.primary}, ${theme.mode === 'dark' ? '#E2B47C' : '#B25C24'})`,
              color: theme.onPrimary, fontFamily: TYPE.fontSans, fontSize: 22, fontWeight: 700,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>{MOCK_USER.firstName[0]}</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: TYPE.fontSans, fontSize: 17, fontWeight: 700, color: theme.text }}>
                {MOCK_USER.firstName} Okafor
              </div>
              <div style={{ fontFamily: TYPE.fontSans, fontSize: 13, color: theme.textMuted }}>
                adaeze@gmail.com
              </div>
            </div>
          </div>
        </Card>

        {/* Reference currency */}
        <div>
          <SectionTitle theme={theme}>Reference currency</SectionTitle>
          <Card theme={theme} padding={0} onClick={() => setCurrencyOpen(true)}>
            <div style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: theme.primarySoft,
                display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Icons.globe size={18} color={theme.primary} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: TYPE.fontSans, fontSize: 15, fontWeight: 600, color: theme.text }}>
                  {settings.refCurrency} · {CURRENCY_SYMBOLS[settings.refCurrency]} Nigerian Naira
                </div>
                <div style={{ fontFamily: TYPE.fontSans, fontSize: 12, color: theme.textMuted, marginTop: 2 }}>
                  Everything is summarised in this currency
                </div>
              </div>
              <Icons.chevR size={16} color={theme.textMuted} />
            </div>
          </Card>
        </div>

        {/* Gmail label */}
        <div>
          <SectionTitle theme={theme}>Gmail label</SectionTitle>
          <Card theme={theme} padding={0}>
            <div style={{ padding: '16px 20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: labelEdit ? 12 : 0 }}>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: theme.primarySoft,
                  display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Icons.tag size={18} color={theme.primary} />
                </div>
                <div style={{ flex: 1 }}>
                  {labelEdit ? (
                    <input value={tmpLabel} onChange={e => setTmpLabel(e.target.value)}
                      autoFocus style={{
                        width: '100%', fontFamily: TYPE.fontSans, fontSize: 15, fontWeight: 600,
                        color: theme.text, background: theme.surface3, border: 'none',
                        borderRadius: 8, padding: '8px 12px', outline: 'none',
                      }} />
                  ) : (
                    <>
                      <div style={{ fontFamily: TYPE.fontSans, fontSize: 15, fontWeight: 600, color: theme.text }}>
                        {settings.gmailLabel}
                      </div>
                      <div style={{ fontFamily: TYPE.fontSans, fontSize: 12, color: theme.textMuted, marginTop: 2 }}>
                        Reading from this Gmail label only
                      </div>
                    </>
                  )}
                </div>
                {!labelEdit && (
                  <button onClick={() => { setTmpLabel(settings.gmailLabel); setLabelEdit(true); }} style={{
                    background: 'transparent', border: 'none', cursor: 'pointer',
                    fontFamily: TYPE.fontSans, fontSize: 13, fontWeight: 600, color: theme.primary,
                  }}>Edit</button>
                )}
              </div>
              {labelEdit && (
                <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
                  <Button variant="secondary" size="sm" theme={theme} onClick={() => setLabelEdit(false)}>Cancel</Button>
                  <Button variant="primary" size="sm" theme={theme} onClick={() => {
                    onUpdate({ gmailLabel: tmpLabel.trim() || 'Bank Transactions' });
                    setLabelEdit(false);
                  }}>Save</Button>
                </div>
              )}
            </div>
          </Card>
        </div>

        {/* Other settings */}
        <div>
          <SectionTitle theme={theme}>App</SectionTitle>
          <Card theme={theme} padding={0}>
            {[
              { icon: Icons.shield, label: 'Privacy & permissions', sub: 'Manage what we read' },
              { icon: Icons.budget, label: 'Notification preferences', sub: 'When Iris reaches out' },
              { icon: Icons.user, label: 'Connected banks', sub: '4 active · GTBank, Kuda, Wise, Monzo' },
            ].map((row, i, arr) => (
              <div key={i} style={{
                padding: '14px 20px', display: 'flex', alignItems: 'center', gap: 12,
                borderBottom: i < arr.length - 1 ? `1px solid ${theme.border}` : 'none',
                cursor: 'pointer',
              }}>
                <div style={{ width: 32, height: 32, borderRadius: 8, background: theme.surface3,
                  display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <row.icon size={16} color={theme.text} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontFamily: TYPE.fontSans, fontSize: 14, fontWeight: 600, color: theme.text }}>{row.label}</div>
                  <div style={{ fontFamily: TYPE.fontSans, fontSize: 12, color: theme.textMuted, marginTop: 1 }}>{row.sub}</div>
                </div>
                <Icons.chevR size={14} color={theme.textMuted} />
              </div>
            ))}
          </Card>
        </div>

        <Button variant="ghost" theme={theme} full size="md" style={{ color: theme.alert, marginTop: 8 }}>
          Sign out
        </Button>
      </div>

      <BottomSheet open={currencyOpen} onClose={() => setCurrencyOpen(false)} title="Reference currency" theme={theme}>
        <div style={{ padding: '4px 20px 24px' }}>
          <div style={{ fontFamily: TYPE.fontSans, fontSize: 13, color: theme.textMuted, marginBottom: 14, lineHeight: 1.4 }}>
            All totals and conversions across the app will use this currency.
          </div>
          {allCurrencies.map(c => {
            const active = settings.refCurrency === c;
            return (
              <div key={c} onClick={() => { onUpdate({ refCurrency: c }); setCurrencyOpen(false); }} style={{
                padding: '14px 16px', borderRadius: 12, cursor: 'pointer', marginBottom: 6,
                background: active ? theme.primarySoft : theme.surface,
                border: `1.5px solid ${active ? theme.primary : theme.border}`,
                display: 'flex', alignItems: 'center', gap: 12,
              }}>
                <div style={{
                  width: 36, height: 36, borderRadius: 99, background: theme.surface3,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontFamily: TYPE.fontMono, fontSize: 14, fontWeight: 700, color: theme.text,
                }}>{CURRENCY_SYMBOLS[c]}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontFamily: TYPE.fontSans, fontSize: 15, fontWeight: 600, color: active ? theme.primary : theme.text }}>{c}</div>
                  <div style={{ fontFamily: TYPE.fontSans, fontSize: 12, color: theme.textMuted }}>
                    {{ NGN: 'Nigerian Naira', USD: 'US Dollar', GBP: 'British Pound', KES: 'Kenyan Shilling', EUR: 'Euro' }[c]}
                  </div>
                </div>
                {active && <Icons.check size={18} color={theme.primary} strokeWidth={2.4} />}
              </div>
            );
          })}
        </div>
      </BottomSheet>
    </div>
  );
}

Object.assign(window, { ProfileScreen });
