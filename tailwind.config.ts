import type { Config } from 'tailwindcss'

export default <Partial<Config>>{
  darkMode: 'class',
  content: [],
  theme: {
    extend: {
      colors: {
        good: {
          DEFAULT: '#22c55e',
          bg: '#dcfce7'
        },
        warn: {
          DEFAULT: '#f59e0b',
          bg: '#fef3c7'
        },
        bad: {
          DEFAULT: '#ef4444',
          bg: '#fee2e2'
        },
        accent: {
          blue: { DEFAULT: '#2a78d6', dark: '#3987e5' },
          orange: { DEFAULT: '#eb6834', dark: '#d95926' },
          violet: { DEFAULT: '#4a3aa7', dark: '#9085e9' }
        }
      },
      borderRadius: {
        xl2: '1.25rem'
      },
      boxShadow: {
        'glow-blue': '0 0 20px -4px rgba(57,135,229,0.45)',
        'glow-orange': '0 0 20px -4px rgba(217,89,38,0.45)',
        'glow-violet': '0 0 20px -4px rgba(144,133,233,0.45)',
        'glow-good': '0 0 20px -4px rgba(34,197,94,0.45)',
        'glow-warn': '0 0 20px -4px rgba(245,158,11,0.45)',
        'glow-bad': '0 0 20px -4px rgba(239,68,68,0.45)',
        'soft-blue': '0 6px 16px -6px rgba(42,120,214,0.25)',
        'soft-orange': '0 6px 16px -6px rgba(235,104,52,0.25)',
        'soft-violet': '0 6px 16px -6px rgba(74,58,167,0.22)',
        'soft-good': '0 6px 16px -6px rgba(34,197,94,0.25)',
        'card-light': '0 1px 3px rgba(15,23,42,0.06), 0 10px 24px -14px rgba(15,23,42,0.10)'
      },
      backdropBlur: {
        xs: '2px'
      }
    }
  }
}
