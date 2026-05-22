import type {Config} from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: '#6D28D9',
          hover: '#5B21B6',
          soft: '#F3E8FF',
          ink: '#321068',
        },
        surface: '#F8F9FC',
        ink: '#111827',
        muted: '#6B7280',
        line: '#E5E7EB',
        success: '#10B981',
        danger: '#EF4444',
        warning: '#F59E0B',
      },
      boxShadow: {
        card: '0 18px 45px rgba(17, 24, 39, 0.07)',
        button: '0 12px 24px rgba(109, 40, 217, 0.22)',
      },
    },
  },
  plugins: [],
};

export default config;
