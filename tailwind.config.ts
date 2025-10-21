import type { Config } from 'tailwindcss';
import tailwindScrollbar from 'tailwind-scrollbar';
import tailwindForms from '@tailwindcss/forms';

const config: Config = {
  content: ['./components/**/*.{js,ts,jsx,tsx,mdx}', './src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-mulish)', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'blue-left-gradient': 'linear-gradient(90deg, #4B49EB 40.5%, rgba(75, 73, 235, 0) 100%)',
        'blue-right-gradient': 'linear-gradient(270deg, #4B49EB 40.5%, rgba(75, 73, 235, 0) 100%)',
        'white-left-gradient': 'linear-gradient(90deg, #FFFFFF 40.5%, rgba(255, 255, 255, 0) 100%)',
        'white-right-gradient':
          'linear-gradient(270deg, #FFFFFF 40.5%, rgba(255, 255, 255, 0) 100%)',
      },
      colors: {
        pink: {
          500: '#FA0F9C',
          600: '#DE1777',
          700: '#C6186B',
        },
        grey: {
          100: '#F7F7F7',
          200: '#E8E8EA',
          300: '#D1D1D4',
          500: '#8D8B94',
          700: '#0E0E0F',
        },
        blue: {
          500: '#4B49EB',
        },
        navy: {
          100: '#EFEDF4',
          500: '#2C1277',
        },
        yellow: {
          500: '#FFC122',
        },
      },
      screens: {
        mobileS: '320px',
        mobileM: '375px',
        mobileL: '425px',
        'mid-tablet': '550px',
        'mid-lg': '1200px',
      },
    },
  },
  plugins: [tailwindScrollbar({ preferredStrategy: 'pseudoelements' }), tailwindForms()],
};
export default config;
