export const Logo = ({ size = 32 }) => (
  <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
    <path d="M20 4 L28 10 L36 8 L34 16 L40 22 L33 24 L30 32 L22 28 L14 34 L13 26 L6 22 L11 15 L8 7 L16 10 Z" fill="url(#g1)" opacity="0.15"/>
    <path d="M20 8 L26 13 L33 11 L31 18 L36 23 L30 25 L27 31 L21 28 L15 32 L14 25 L8 22 L13 16 L10 10 L17 12 Z" fill="url(#g1)" opacity="0.3"/>
    <path d="M20 13 L24 17 L29 15 L28 20 L32 24 L27 25 L25 30 L20 27 L15 30 L14 25 L9 23 L13 19 L11 14 L16 16 Z" fill="url(#g1)" opacity="0.6"/>
    <path d="M20 17 L23 20 L27 19 L26 22 L28 25 L25 26 L23 29 L20 27 L17 29 L16 26 L13 25 L15 22 L14 19 L17 20 Z" fill="url(#g1)"/>
    <circle cx="20" cy="20" r="3.5" fill="white" opacity="0.9"/>
    <defs>
      <linearGradient id="g1" x1="6" y1="4" x2="36" y2="36" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#c084fc"/>
        <stop offset="100%" stopColor="#7c3aed"/>
      </linearGradient>
    </defs>
  </svg>
);