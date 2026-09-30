export type IconName =
  | 'folder' | 'folder-lock' | 'chat' | 'txt' | 'txt-warn' | 'trash' | 'terminal'
  | 'browser' | 'image' | 'audio' | 'lock' | 'log' | 'gear' | 'pdf'

// Hand-drawn 32×32 icons on a 1px grid so they stay crisp at desktop sizes.
export function Icon({ name, size = 40 }: { name: IconName; size?: number }) {
  const s = { width: size, height: size }
  switch (name) {
    case 'folder':
    case 'folder-lock':
      return (
        <svg viewBox="0 0 32 32" style={s} aria-hidden>
          <path d="M3 8h10l2 3h14v15H3z" fill="var(--icon-folder-back)" />
          <path d="M3 12h26v14H3z" fill="var(--icon-folder)" />
          <path d="M3 12h26v2H3z" fill="var(--icon-folder-hi)" />
          {name === 'folder-lock' && (
            <g>
              <rect x="19" y="18" width="9" height="8" fill="var(--ink)" />
              <path d="M20.5 18v-2.5a3 3 0 0 1 6 0V18" stroke="var(--ink)" strokeWidth="1.6" fill="none" />
              <rect x="23" y="21" width="1.6" height="3" fill="var(--signal)" />
            </g>
          )}
        </svg>
      )
    case 'chat':
      return (
        <svg viewBox="0 0 32 32" style={s} aria-hidden>
          <path d="M4 6h24v15H14l-6 5v-5H4z" fill="var(--paper)" />
          <path d="M4 6h24v3H4z" fill="var(--signal)" />
          <rect x="8" y="12" width="12" height="2" fill="var(--ink)" />
          <rect x="8" y="16" width="8" height="2" fill="var(--ink)" />
        </svg>
      )
    case 'txt':
    case 'txt-warn':
    case 'log':
    case 'pdf':
      return (
        <svg viewBox="0 0 32 32" style={s} aria-hidden>
          <path d="M7 3h13l6 6v20H7z" fill="var(--paper)" />
          <path d="M20 3v6h6" fill="var(--paper-dim)" />
          {[12, 16, 20, 24].map((y) => (
            <rect key={y} x="10" y={y} width={y === 24 ? 8 : 13} height="1.5" fill="var(--ink-soft)" />
          ))}
          {name === 'txt-warn' && (
            <g>
              <rect x="14" y="16" width="16" height="12" fill="var(--signal)" />
              <text x="22" y="25.5" textAnchor="middle" fontSize="9" fontFamily="var(--f-mono)" fill="var(--paper)" fontWeight="700">!</text>
            </g>
          )}
          {name === 'log' && <rect x="7" y="3" width="3" height="26" fill="var(--ok)" />}
          {name === 'pdf' && <rect x="7" y="3" width="3" height="26" fill="var(--signal)" />}
        </svg>
      )
    case 'trash':
      return (
        <svg viewBox="0 0 32 32" style={s} aria-hidden>
          <rect x="6" y="7" width="20" height="3" fill="var(--paper)" />
          <rect x="13" y="4" width="6" height="3" fill="var(--paper)" />
          <path d="M8 11h16l-1.5 17h-13z" fill="var(--paper-dim)" />
          {[12, 16, 20].map((x) => <rect key={x} x={x} y="14" width="1.5" height="11" fill="var(--ink-soft)" />)}
        </svg>
      )
    case 'terminal':
      return (
        <svg viewBox="0 0 32 32" style={s} aria-hidden>
          <rect x="3" y="5" width="26" height="22" fill="var(--ink)" stroke="var(--paper)" strokeWidth="1.5" />
          <path d="M8 12l4 3-4 3" stroke="var(--ok)" strokeWidth="2" fill="none" />
          <rect x="14" y="18" width="8" height="2" fill="var(--ok)" />
        </svg>
      )
    case 'browser':
      return (
        <svg viewBox="0 0 32 32" style={s} aria-hidden>
          <circle cx="16" cy="16" r="12" fill="var(--paper)" />
          <path d="M4 16h24M16 4c-5 4-5 20 0 24M16 4c5 4 5 20 0 24" stroke="var(--ink)" strokeWidth="1.5" fill="none" />
          <path d="M6 10h20M6 22h20" stroke="var(--ink)" strokeWidth="1" fill="none" opacity=".5" />
        </svg>
      )
    case 'image':
      return (
        <svg viewBox="0 0 32 32" style={s} aria-hidden>
          <rect x="4" y="6" width="24" height="20" fill="var(--paper)" />
          <rect x="6" y="8" width="20" height="14" fill="var(--sky)" />
          <path d="M6 22l6-7 5 5 3-3 6 5z" fill="var(--ink-soft)" />
          <circle cx="21" cy="12" r="2" fill="var(--signal)" />
        </svg>
      )
    case 'audio':
      return (
        <svg viewBox="0 0 32 32" style={s} aria-hidden>
          <path d="M7 3h13l6 6v20H7z" fill="var(--paper)" />
          {[9, 12, 15, 18, 21].map((x, i) => (
            <rect key={x} x={x} y={18 - [3, 6, 8, 5, 2][i]} width="2" height={[3, 6, 8, 5, 2][i] * 2} fill="var(--ink)" />
          ))}
        </svg>
      )
    case 'lock':
      return (
        <svg viewBox="0 0 32 32" style={s} aria-hidden>
          <rect x="7" y="14" width="18" height="14" fill="var(--paper)" />
          <path d="M10 14V10a6 6 0 0 1 12 0v4" stroke="var(--paper)" strokeWidth="3" fill="none" />
          <rect x="15" y="18" width="2" height="6" fill="var(--signal)" />
        </svg>
      )
    case 'gear':
      return (
        <svg viewBox="0 0 32 32" style={s} aria-hidden>
          <circle cx="16" cy="16" r="9" fill="var(--paper-dim)" />
          {[0, 45, 90, 135].map((r) => (
            <rect key={r} x="14" y="3" width="4" height="26" fill="var(--paper-dim)" transform={`rotate(${r} 16 16)`} />
          ))}
          <circle cx="16" cy="16" r="4" fill="var(--ink)" />
        </svg>
      )
  }
}
