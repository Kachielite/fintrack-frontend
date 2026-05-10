// FinTrack — Notifications sheet content

function NotificationsSheet({ theme, onClose }) {
  const items = [
    { id: 1, type: 'insight', title: 'Iris noticed something', body: 'Your weekend food spend is 3× your weekday average.', time: '2h ago', unread: true },
    { id: 2, type: 'budget',  title: 'Subscriptions near limit', body: 'You\'ve used 95% of your ₦30,000 subscriptions budget.', time: '6h ago', unread: true },
    { id: 3, type: 'fx',      title: 'FX heads up', body: 'The naira has softened — your USD subscriptions cost 8% more this month.', time: 'Yesterday', unread: false },
    { id: 4, type: 'tx',      title: 'Unverified transaction', body: '"Unknown POS terminal" needs a quick category check.', time: 'Yesterday', unread: false },
    { id: 5, type: 'budget',  title: 'Salary received', body: '₦850,000 from Acme Corp landed in your GTBank account.', time: 'May 5', unread: false },
  ];

  const iconFor = (type) => {
    if (type === 'insight') return Icons.sparkle;
    if (type === 'fx')      return Icons.globe;
    if (type === 'tx')      return Icons.tag;
    return Icons.budget;
  };

  return (
    <div style={{ padding: '4px 20px 24px' }}>
      <div style={{ fontFamily: TYPE.fontSans, fontSize: 13, color: theme.textMuted, marginBottom: 14, lineHeight: 1.4 }}>
        Iris will only ping you when something is genuinely worth knowing.
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {items.map(n => {
          const I = iconFor(n.type);
          return (
            <div key={n.id} style={{
              display: 'flex', gap: 12, padding: 14, borderRadius: 14,
              background: n.unread ? theme.primarySoft : theme.surface,
              border: `1px solid ${n.unread ? theme.primary + '33' : theme.border}`,
            }}>
              <div style={{
                width: 36, height: 36, borderRadius: 10,
                background: n.unread ? theme.primary : theme.surface3,
                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
              }}>
                <I size={16} color={n.unread ? theme.onPrimary : theme.textMuted} strokeWidth={2.2} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 8, marginBottom: 2 }}>
                  <span style={{ fontFamily: TYPE.fontSans, fontSize: 14, fontWeight: 700, color: theme.text }}>{n.title}</span>
                  <span style={{ fontFamily: TYPE.fontSans, fontSize: 11, color: theme.textMuted, flexShrink: 0 }}>{n.time}</span>
                </div>
                <div style={{ fontFamily: TYPE.fontSans, fontSize: 13, color: theme.textMuted, lineHeight: 1.4 }}>{n.body}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

Object.assign(window, { NotificationsSheet });
