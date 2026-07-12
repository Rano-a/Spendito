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
        }
      },
      borderRadius: {
        xl2: '1.25rem'
      }
    }
  }
}
