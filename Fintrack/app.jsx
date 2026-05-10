// FinTrack — Main app shell

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "dark": false,
  "paletteHex": "#C77638",
  "advisorTone": "warm",
  "density": "cozy"
}/*EDITMODE-END*/;

function App() {
  const [tweaks, setTweak] = useTweaks(TWEAK_DEFAULTS);
  const PALETTE_BY_HEX = {
    [PALETTES.amber[500]]: 'amber',
    [PALETTES.forest[500]]: 'forest',
    [PALETTES.plum[500]]: 'plum',
    [PALETTES.sand[500]]: 'sand',
  };
  const paletteKey = PALETTE_BY_HEX[tweaks.paletteHex] || 'amber';
  const theme = buildTheme(paletteKey, tweaks.dark);

  // App phase: splash -> auth -> onboarding-gmail -> onboarding-goal -> app
  const [phase, setPhase] = React.useState('splash');
  const [tab, setTab] = React.useState('home');
  const [openTx, setOpenTx] = React.useState(null);
  const [insightOpen, setInsightOpen] = React.useState(false);
  const [notifOpen, setNotifOpen] = React.useState(false);
  const [currencyOpen, setCurrencyOpen] = React.useState(false);

  // App-level settings (editable via Profile)
  const [settings, setSettings] = React.useState({
    refCurrency: 'NGN',
    gmailLabel: 'Bank Transactions',
  });
  const updateSettings = (patch) => setSettings(s => ({ ...s, ...patch }));

  let screen = null;
  if (phase === 'splash') {
    screen = <SplashCarousel theme={theme} onContinue={() => setPhase('auth')} />;
  } else if (phase === 'auth') {
    screen = <AuthScreen theme={theme} onLogin={() => setPhase('onboarding-gmail')} />;
  } else if (phase === 'onboarding-gmail') {
    screen = <OnboardingGmail theme={theme} onNext={() => setPhase('onboarding-goal')} onShowHow={() => {}} />;
  } else if (phase === 'onboarding-goal') {
    screen = <OnboardingGoal theme={theme} onNext={() => setPhase('app')} />;
  } else {
    if (tab === 'home') screen = <HomeScreen theme={theme} tweaks={tweaks} refCurrency={settings.refCurrency}
      onTabChange={setTab}
      onOpenInsight={() => setInsightOpen(true)}
      onOpenTx={setOpenTx}
      onOpenNotifications={() => setNotifOpen(true)}
      onOpenCurrencies={() => setCurrencyOpen(true)} />;
    if (tab === 'tx') screen = <TransactionsScreen theme={theme} tweaks={tweaks} onOpenTx={setOpenTx} />;
    if (tab === 'budget') screen = <BudgetScreen theme={theme} tweaks={tweaks} onOpenTx={setOpenTx} />;
    if (tab === 'profile') screen = <ProfileScreen theme={theme} settings={settings} onUpdate={updateSettings} />;
  }

  const inApp = phase === 'app';

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: tweaks.dark
        ? 'radial-gradient(ellipse at top, #2A2218 0%, #0D0B09 70%)'
        : 'radial-gradient(ellipse at top, #F2EAD9 0%, #DDD0BB 80%)',
      padding: 24, fontFamily: TYPE.fontSans,
    }}>
      <div style={{ position: 'relative' }}>
        <IOSDevice width={390} height={844} dark={tweaks.dark}>
          <div style={{
            position: 'relative', height: '100%', width: '100%',
            background: theme.bg, color: theme.text, overflow: 'hidden',
          }} data-screen-label={`FinTrack ${inApp ? tab : phase}`}>
            {screen}

            {inApp && <BottomNav active={tab} onChange={setTab} theme={theme} />}

            <BottomSheet open={!!openTx} onClose={() => setOpenTx(null)} title="Transaction" theme={theme}>
              <TransactionDetail tx={openTx} theme={theme} onClose={() => setOpenTx(null)} />
            </BottomSheet>

            <BottomSheet open={insightOpen} onClose={() => setInsightOpen(false)} title="Insight" theme={theme} maxHeight="92%">
              <InsightDetail theme={theme} onClose={() => setInsightOpen(false)} />
            </BottomSheet>

            <BottomSheet open={notifOpen} onClose={() => setNotifOpen(false)} title="Notifications" theme={theme} maxHeight="80%">
              <NotificationsSheet theme={theme} onClose={() => setNotifOpen(false)} />
            </BottomSheet>

            <BottomSheet open={currencyOpen} onClose={() => setCurrencyOpen(false)} title="Currencies" theme={theme} maxHeight="92%">
              <div style={{ position: 'relative' }}>
                <CurrencyScreen theme={theme} tweaks={tweaks} embedded={true} onOpenTx={(tx) => { setCurrencyOpen(false); setOpenTx(tx); }} />
              </div>
            </BottomSheet>
          </div>
        </IOSDevice>

        {!inApp && (
          <div style={{
            position: 'absolute', bottom: -42, left: 0, right: 0,
            textAlign: 'center',
            fontFamily: TYPE.fontSans, fontSize: 12, fontWeight: 600,
            color: tweaks.dark ? 'rgba(245,239,230,0.5)' : 'rgba(35,28,19,0.45)',
            letterSpacing: 0.2,
          }}>
            {{
              'splash': 'Splash · feature carousel',
              'auth': 'Auth · Google or Apple',
              'onboarding-gmail': 'Onboarding · Gmail label setup (1/2)',
              'onboarding-goal': 'Onboarding · Goal & income (2/2)',
            }[phase]}
            <button onClick={() => setPhase('app')} style={{
              marginLeft: 10, background: 'transparent', border: 'none',
              color: theme.primary, fontFamily: TYPE.fontSans, fontSize: 12, fontWeight: 700,
              cursor: 'pointer', textDecoration: 'underline',
            }}>Skip to app →</button>
          </div>
        )}
      </div>

      <TweaksPanel>
        <TweakSection label="Appearance">
          <TweakToggle label="Dark mode" value={tweaks.dark} onChange={v => setTweak('dark', v)} />
          <TweakColor
            label="Primary"
            value={tweaks.paletteHex}
            options={[PALETTES.amber[500], PALETTES.forest[500], PALETTES.plum[500], PALETTES.sand[500]]}
            onChange={v => setTweak('paletteHex', v)}
          />
          <TweakRadio
            label="Density"
            value={tweaks.density}
            options={[{ value: 'cozy', label: 'Cozy' }, { value: 'compact', label: 'Compact' }]}
            onChange={v => setTweak('density', v)}
          />
        </TweakSection>

        <TweakSection label="Advisor (Iris)">
          <TweakRadio
            label="Tone"
            value={tweaks.advisorTone}
            options={[
              { value: 'warm', label: 'Warm' },
              { value: 'direct', label: 'Direct' },
              { value: 'brief', label: 'Brief' },
            ]}
            onChange={v => setTweak('advisorTone', v)}
          />
        </TweakSection>

        <TweakSection label="Demo flow">
          <TweakButton label="Splash carousel" onClick={() => setPhase('splash')} />
          <TweakButton label="Sign in" onClick={() => setPhase('auth')} />
          <TweakButton label="Gmail onboarding" onClick={() => setPhase('onboarding-gmail')} />
          <TweakButton label="Goal & income" onClick={() => setPhase('onboarding-goal')} />
          <TweakButton label="Main app" onClick={() => setPhase('app')} />
        </TweakSection>
      </TweaksPanel>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
