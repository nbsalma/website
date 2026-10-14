/**
 * NB globe mark, redrawn as a vector for dark and light backgrounds.
 * Colours come from CSS variables so the header can switch them on scroll:
 *   --logo-fg (globe + N), --logo-bg (knock-out behind the letters).
 */
export function LogoMark({ size = 42, className = "" }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" aria-hidden="true" className={`flex-none ${className}`}>
      <g fill="none" stroke="var(--logo-fg, #F4F3EF)" strokeWidth="2.4" className="transition-[stroke] duration-300">
        <circle cx="32" cy="32" r="29" strokeWidth="4" />
        <ellipse cx="32" cy="32" rx="14" ry="29" />
        <path d="M32 3V61M7.2 17H56.8M7.2 47H56.8M3 32H61" />
      </g>
      <rect x="11" y="18" width="42" height="28" fill="var(--logo-bg, #0E1012)" className="transition-[fill] duration-300" />
      <path d="M13.4 20H19L28.6 35.5V20H34V44H28.4L18.8 28.5V44H13.4Z" fill="var(--logo-fg, #F4F3EF)" className="transition-[fill] duration-300" />
      <path
        fillRule="evenodd"
        fill="#F07A3E"
        d="M34 20H43C47.5 20 49.6 22.6 49.6 25.8C49.6 28.1 48.5 29.8 46.7 30.8C49.3 31.8 50.8 34 50.8 37C50.8 41.2 47.8 44 43.2 44H34ZM34 24.8V29.6H42.4C43.9 29.6 44.6 28.8 44.6 27.2C44.6 25.6 43.9 24.8 42.4 24.8ZM34 34.2V39.2H43C44.8 39.2 45.6 38.3 45.6 36.7C45.6 35.1 44.8 34.2 43 34.2Z"
      />
    </svg>
  );
}
