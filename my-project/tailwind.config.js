/** @type {import('tailwindcss').Config} */
export default {
	darkMode: ["class"],
	content: [
	  "./index.html",
	  "./src/**/*.{js,ts,jsx,tsx}",
	],
	theme: {
	  extend: {
		// (Optional) If you still need your custom borderRadius or colors, you can include them here.
		// Just be cautious if they rely on custom CSS variables that conflict with daisyUI.
		animation: {
		  'accordion-down': 'accordion-down 0.2s ease-out',
		  'accordion-up': 'accordion-up 0.2s ease-out',
		},
		fontFamily: {
			publico: ['Publico', 'sans-serif',''],
			playfair: ['"Playfair Display"', 'serif'],
			garamond: ['"EB Garamond"', 'serif'],

			 // Fallback to sans-serif if needed
		  },
		keyframes: {
		  'accordion-down': {
			from: { height: '0' },
			to: { height: 'var(--radix-accordion-content-height)' },
		  },
		  'accordion-up': {
			from: { height: 'var(--radix-accordion-content-height)' },
			to: { height: '0' },
		  },
		},
	  },
	},
	plugins: [
	  require('daisyui'),
	  require("tailwindcss-animate")
	],
	daisyui: {
	  themes: [
		'light',
		'dark',
		'cupcake',
		'bumblebee',
		'emerald',
		'corporate',
		'synthwave',
		'retro',
		'cyberpunk',
		'valentine',
		'halloween',
		'garden',
		'forest',
		'aqua',
		'lofi',
		'pastel',
		'fantasy',
		'wireframe',
		'black',
		'luxury',
		'dracula',
		'cmyk',
		'autumn',
		'business',
		'acid',
		'lemonade',
		'night',
		'coffee',
		'winter',
	  ],
	},
  }
  