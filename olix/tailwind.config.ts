const config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}', // Includes all files in the 'pages' directory
    './src/**/*.{js,ts,jsx,tsx}',  // Includes all files in the 'src' directory
    './components/**/*.{js,ts,jsx,tsx}', // Optional: Add if you have a 'components' directory
  ],
  theme: {
    extend: {
      colors: {
        customBlue: '#052d73', // Add your custom color here
        customColorText: '#052d73',
      },
    },
  },
  plugins: [], // Add plugins here if you're using any
};

export default config;
