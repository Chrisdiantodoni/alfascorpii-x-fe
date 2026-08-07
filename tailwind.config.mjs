/** @type {import('tailwindcss').Config} */
export default {
  safelist: [
    // Memaksa Tailwind generate SEMUA variasi gap dan display
    { pattern: /^gap-/ },
    { pattern: /^(hidden|flex|block|grid)$/ },
    { pattern: /^(sm|md|lg|xl):hidden$/ },
    { pattern: /^(sm|md|lg|xl):flex$/ },
  ],
};
