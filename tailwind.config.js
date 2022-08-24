/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
      './pages/**/*.{js,ts,jsx,tsx}',
      './components/**/*.{js,ts,jsx,tsx}',
  ],
  darkMode: 'class', // or 'media' or 'class'
  theme: {
      screens: {
          xs: { max: '360px' },
          sm: { max: '480px' },
          md: { max: '720px' },
          lg: { max: '1024px' },
          xl: { max: '1366px' },
      },
      colors: {
          primary: {
              DEFAULT: 'rgba(56, 147, 193, 0.8)',
              dark: 'rgb(56, 147, 193)',
              light: 'rgba(56, 147, 193, 0.6)',
              transparent: 'rgba(56, 147, 193, 0.2)',
          },
          success: {
              transparent: 'rgba(9, 171, 35, 0.2)',
              light: 'rgba(9, 171, 35, 0.6)',
              DEFAULT: 'rgba(9, 171, 35, .8)',
              dark: 'rgb(9, 171, 35)',
          },
          danger: {
              transparent: 'rgba(182, 17, 17, 0.2)',
              light: 'rgba(182, 17, 17, 0.6)',
              DEFAULT: 'rgba(182, 17, 17, 0.8)',
              dark: 'rgb(182, 17, 17)',
          },
          skin: {
              DEFAULT: 'var(--skin-default)',
              main: 'var(--skin-main)',
              primary: 'var(--skin-primary)',
              secondary: 'var(--skin-secondary)',
              white: '#fff',
          },
      },
      fontFamily: {
          sans: ['Arimo', 'sans-serif'],
      },
      fontSize: {
          xl: '24px',
          lg: '20px',
          md: '14px',
          sm: '12px',
          xs: '10px',
      },
      spacing: {
          xxl: '40px',
          xl: '30px',
          lg: '20px',
          md: '15px',
          sm: '10px',
          xs: '5px',
      },
      stroke: {
          current: 'rgba(56, 147, 193, 0.6)',
      },
      borderRadius: {
          sm: '5px',
          DEFAULT: '10px',
          full: '2rem',
      },
      extend: {},
  },
  variants: {
      extend: {},
  },
  plugins: [],
};
