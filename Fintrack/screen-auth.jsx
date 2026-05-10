// FinTrack — Splash feature carousel + Auth (Google/Apple)

function SplashCarousel({ theme, onContinue }) {
  const [idx, setIdx] = React.useState(0);
  const slides = [
    {
      title: 'No more spreadsheets.',
      sub: 'FinTrack reads bank emails for you and turns them into clear, organised transactions.',
      visual: 'mail',
    },
    {
      title: 'Many banks.\nOne picture.',
      sub: 'GTBank, Kuda, Wise, Monzo — across naira, dollars and pounds. Always converted to your reference currency.',
      visual: 'globe',
    },
    {
      title: 'A friend who\nunderstands money.',
      sub: 'Iris, your advisor, points out patterns in plain language. No judgment. No jargon.',
      visual: 'iris',
    },
  ];
  const slide = slides[idx];

  // visual content per slide
  const renderVisual = () => {
    if (slide.visual === 'mail') {
      return (
        <div style={{ position: 'relative', width: 240, height: 200 }}>
          <div style={{
            position: 'absolute', left: 0, top: 16, width: 220, height: 56,
            background: theme.surface, borderRadius: 14, border: `1px solid ${theme.border}`,
            transform: 'rotate(-4deg)', display: 'flex', alignItems: 'center', gap: 10, padding: '0 14px',
          }}>
            <div style={{ width: 26, height: 26, borderRadius: 7, background: theme.primarySoft }} />
            <div style={{ flex: 1 }}>
              <div style={{ height: 8, borderRadius: 4, background: theme.surface3, width: '70%', marginBottom: 4 }} />
              <div style={{ height: 6, borderRadius: 3, background: theme.surface3, width: '40%' }} />
            </div>
          </div>
          <div style={{
            position: 'absolute', left: 16, top: 80, width: 220, height: 56,
            background: theme.surface, borderRadius: 14, border: `1px solid ${theme.border}`,
            transform: 'rotate(2deg)', display: 'flex', alignItems: 'center', gap: 10, padding: '0 14px',
            boxShadow: theme.mode === 'dark' ? 'none' : '0 4px 16px rgba(35,28,19,0.06)',
          }}>
            <div style={{ width: 26, height: 26, borderRadius: 7, background: `${theme.primary}33` }} />
            <div style={{ flex: 1 }}>
              <div style={{ height: 8, borderRadius: 4, background: theme.surface3, width: '60%', marginBottom: 4 }} />
              <div style={{ height: 6, borderRadius: 3, background: theme.surface3, width: '35%' }} />
            </div>
          </div>
          <div style={{
            position: 'absolute', right: 4, top: 130, width: 80, height: 80, borderRadius: 99,
            background: `linear-gradient(135deg, ${theme.primary}, ${theme.mode === 'dark' ? '#E2B47C' : '#B25C24'})`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: `0 8px 24px ${theme.primary}55`,
          }}>
            <Icons.check size={40} color={theme.onPrimary} strokeWidth={3} />
          </div>
        </div>
      );
    }
    if (slide.visual === 'globe') {
      return (
        <div style={{ position: 'relative', width: 240, height: 200, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{
            width: 160, height: 160, borderRadius: 99,
            background: `radial-gradient(circle at 30% 30%, ${theme.primarySoft}, ${theme.surface3})`,
            border: `1.5px solid ${theme.border}`, position: 'relative',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Icons.globe size={80} color={theme.primary} strokeWidth={1.4} />
          </div>
          {/* currency chips orbiting */}
          {['₦', '$', '£', 'KSh'].map((c, i) => {
            const angle = (i / 4) * Math.PI * 2 - Math.PI / 2;
            const r = 100;
            const x = 120 + Math.cos(angle) * r - 22;
            const y = 100 + Math.sin(angle) * r - 22;
            return (
              <div key={i} style={{
                position: 'absolute', left: x, top: y,
                width: 44, height: 44, borderRadius: 99,
                background: theme.surface, border: `1px solid ${theme.border}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontFamily: TYPE.fontMono, fontSize: 14, fontWeight: 700, color: theme.text,
                boxShadow: theme.mode === 'dark' ? '0 0 0 1px rgba(255,255,255,0.04)' : '0 4px 12px rgba(35,28,19,0.08)',
              }}>{c}</div>
            );
          })}
        </div>
      );
    }
    // iris
    return (
      <div style={{ position: 'relative', width: 240, height: 200, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ position: 'relative' }}>
          <AdvisorMark theme={theme} name="I" size={100} />
          <div style={{
            position: 'absolute', top: -6, right: -10,
            width: 28, height: 28, borderRadius: 99, background: theme.surface,
            border: `1.5px solid ${theme.border}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Icons.sparkle size={14} color={theme.primary} strokeWidth={2.4} />
          </div>
        </div>
        <div style={{
          position: 'absolute', left: 4, bottom: 24,
          padding: '8px 12px', borderRadius: 14, background: theme.surface,
          border: `1px solid ${theme.border}`, fontFamily: TYPE.fontSans, fontSize: 11, fontWeight: 600,
          color: theme.text, boxShadow: theme.mode === 'dark' ? 'none' : '0 4px 12px rgba(35,28,19,0.06)',
        }}>You're doing well 👌</div>
        <div style={{
          position: 'absolute', right: 8, top: 30,
          padding: '8px 12px', borderRadius: 14, background: theme.primary,
          fontFamily: TYPE.fontSans, fontSize: 11, fontWeight: 600,
          color: theme.onPrimary,
        }}>Try ₦40k dining</div>
      </div>
    );
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', paddingTop: 56 }}>
      <div style={{
        padding: '20px 24px',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{
            width: 28, height: 28, borderRadius: 8,
            background: `linear-gradient(135deg, ${theme.primary}, ${theme.mode === 'dark' ? '#E2B47C' : '#B25C24'})`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: theme.onPrimary, fontFamily: TYPE.fontSans, fontSize: 14, fontWeight: 800,
          }}>F</div>
          <span style={{ fontFamily: TYPE.fontSans, fontSize: 16, fontWeight: 700, color: theme.text, letterSpacing: -0.3 }}>
            FinTrack
          </span>
        </div>
        <button onClick={onContinue} style={{
          background: 'transparent', border: 'none', cursor: 'pointer',
          fontFamily: TYPE.fontSans, fontSize: 14, fontWeight: 600, color: theme.textMuted,
        }}>Skip</button>
      </div>

      <div style={{
        flex: 1, display: 'flex', flexDirection: 'column',
        padding: '40px 28px 0', justifyContent: 'flex-start',
      }}>
        <div style={{
          height: 220, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 36,
        }}>
          {renderVisual()}
        </div>

        <div style={{
          fontFamily: TYPE.fontSans, fontSize: 30, fontWeight: 700,
          color: theme.text, letterSpacing: -0.7, lineHeight: 1.1,
          marginBottom: 14, whiteSpace: 'pre-line', textWrap: 'pretty',
        }}>{slide.title}</div>
        <div style={{
          fontFamily: TYPE.fontSans, fontSize: 16, color: theme.textMuted, lineHeight: 1.45,
          textWrap: 'pretty',
        }}>{slide.sub}</div>
      </div>

      {/* Dots */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: 6, padding: '0 0 24px' }}>
        {slides.map((_, i) => (
          <div key={i} onClick={() => setIdx(i)} style={{
            width: i === idx ? 24 : 6, height: 6, borderRadius: 99,
            background: i === idx ? theme.primary : theme.surface3,
            cursor: 'pointer', transition: 'width 240ms ease, background 240ms ease',
          }} />
        ))}
      </div>

      <div style={{ padding: '0 24px 28px' }}>
        <Button variant="primary" size="lg" theme={theme} full
          onClick={() => idx < slides.length - 1 ? setIdx(idx + 1) : onContinue()}
        >
          {idx < slides.length - 1 ? 'Next' : 'Get started'}
        </Button>
      </div>
    </div>
  );
}

function AuthScreen({ theme, onLogin }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', paddingTop: 56, background: theme.bg }}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '0 32px' }}>
        {/* Logo */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 56 }}>
          <div style={{
            width: 72, height: 72, borderRadius: 20,
            background: `linear-gradient(135deg, ${theme.primary}, ${theme.mode === 'dark' ? '#E2B47C' : '#B25C24'})`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: theme.onPrimary, fontFamily: TYPE.fontSans, fontSize: 36, fontWeight: 800,
            marginBottom: 24, boxShadow: `0 16px 40px ${theme.primary}40`,
          }}>F</div>
          <div style={{
            fontFamily: TYPE.fontSans, fontSize: 28, fontWeight: 700,
            color: theme.text, letterSpacing: -0.6, marginBottom: 8, textAlign: 'center',
          }}>Welcome to FinTrack</div>
          <div style={{
            fontFamily: TYPE.fontSans, fontSize: 15, color: theme.textMuted, lineHeight: 1.45,
            textAlign: 'center', maxWidth: 280, textWrap: 'pretty',
          }}>Sign in to connect your bank emails and meet Iris.</div>
        </div>

        {/* Buttons */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <button onClick={() => onLogin('google')} style={{
            height: 56, borderRadius: 9999, cursor: 'pointer',
            background: theme.surface, border: `1px solid ${theme.borderStrong}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12,
            fontFamily: TYPE.fontSans, fontSize: 16, fontWeight: 600, color: theme.text,
          }}>
            <svg width="20" height="20" viewBox="0 0 20 20">
              <path fill="#4285F4" d="M19.6 10.23c0-.68-.06-1.34-.18-1.97H10v3.73h5.39c-.23 1.25-.94 2.31-2 3.02v2.51h3.23c1.89-1.74 2.98-4.3 2.98-7.29z"/>
              <path fill="#34A853" d="M10 20c2.7 0 4.96-.9 6.62-2.43l-3.23-2.51c-.9.6-2.05.96-3.39.96-2.6 0-4.81-1.76-5.6-4.13H1.06v2.59C2.71 17.74 6.09 20 10 20z"/>
              <path fill="#FBBC05" d="M4.4 11.89A5.96 5.96 0 014.08 10c0-.66.11-1.3.32-1.89V5.52H1.06A9.99 9.99 0 000 10c0 1.61.39 3.14 1.06 4.48L4.4 11.89z"/>
              <path fill="#EA4335" d="M10 3.96c1.47 0 2.79.51 3.83 1.5l2.87-2.87C14.95.99 12.7 0 10 0 6.09 0 2.71 2.26 1.06 5.52L4.4 8.11C5.19 5.74 7.4 3.96 10 3.96z"/>
            </svg>
            Continue with Google
          </button>
          <button onClick={() => onLogin('apple')} style={{
            height: 56, borderRadius: 9999, cursor: 'pointer',
            background: theme.text, border: `1px solid ${theme.text}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12,
            fontFamily: TYPE.fontSans, fontSize: 16, fontWeight: 600, color: theme.bg,
          }}>
            <svg width="18" height="20" viewBox="0 0 18 20" fill={theme.bg}>
              <path d="M14.86 10.6c.02 2.34 2.05 3.12 2.07 3.13-.02.05-.32 1.1-1.06 2.18-.64.94-1.31 1.87-2.36 1.89-1.03.02-1.36-.61-2.54-.61-1.18 0-1.55.59-2.52.63-1.01.04-1.78-1.01-2.43-1.95-1.32-1.91-2.34-5.41-.98-7.78.68-1.17 1.89-1.92 3.2-1.94.99-.02 1.93.67 2.54.67.6 0 1.74-.83 2.94-.7.5.02 1.91.2 2.81 1.53-.07.05-1.68.98-1.67 2.95zM12.95 3.32c.54-.66.91-1.57.81-2.48-.78.03-1.73.52-2.29 1.18-.5.58-.94 1.51-.82 2.4.87.07 1.76-.44 2.3-1.1z"/>
            </svg>
            Continue with Apple
          </button>
        </div>
      </div>

      <div style={{
        padding: '0 32px 32px',
        fontFamily: TYPE.fontSans, fontSize: 12, color: theme.textSubtle, textAlign: 'center',
        lineHeight: 1.5,
      }}>
        By continuing you agree to our <span style={{ color: theme.text, fontWeight: 600 }}>Terms</span> and <span style={{ color: theme.text, fontWeight: 600 }}>Privacy Policy</span>.
      </div>
    </div>
  );
}

Object.assign(window, { SplashCarousel, AuthScreen });
