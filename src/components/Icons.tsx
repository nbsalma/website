type P = { className?: string; size?: number };

export function ArrowRight({ className = "", size = 16 }: P) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true" className={`flip-rtl ${className}`}>
      <path d="M4 12h15M13 6l6 6-6 6" />
    </svg>
  );
}
export function ArrowLeft({ className = "", size = 18 }: P) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true" className={`flip-rtl ${className}`}>
      <path d="M20 12H5M11 6l-6 6 6 6" />
    </svg>
  );
}
export function Download({ className = "", size = 16 }: P) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true" className={className}>
      <path d="M12 4v11M7 10l5 5 5-5M5 20h14" />
    </svg>
  );
}
export function Upload({ className = "", size = 20 }: P) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true" className={className}>
      <path d="M12 16V4M7 9l5-5 5 5M5 20h14" />
    </svg>
  );
}
export function Check({ className = "", size = 14 }: P) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" aria-hidden="true" className={className}>
      <path d="M5 12.5l4.5 4.5L19 7.5" />
    </svg>
  );
}
export function Chat({ className = "", size = 20 }: P) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true" className={className}>
      <path d="M4 20l1.4-4.2A8 8 0 1 1 8.2 18.6Z" />
    </svg>
  );
}
export function Globe({ className = "", size = 16 }: P) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true" className={className}>
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18M12 3c2.5 2.7 3.8 5.7 3.8 9s-1.3 6.3-3.8 9c-2.5-2.7-3.8-5.7-3.8-9S9.5 5.7 12 3Z" />
    </svg>
  );
}
export function Chevron({ className = "", size = 12 }: P) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true" className={className}>
      <path d="M6 9l6 6 6-6" />
    </svg>
  );
}
export function Menu({ className = "", size = 20 }: P) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true" className={className}>
      <path d="M3 7h18M3 12h18M3 17h18" />
    </svg>
  );
}
export function Close({ className = "", size = 20 }: P) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true" className={className}>
      <path d="M5 5l14 14M19 5L5 19" />
    </svg>
  );
}
export function Certificate({ className = "", size = 22 }: P) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className={className}>
      <path d="M14 3H6a1 1 0 0 0-1 1v16a1 1 0 0 0 1 1h5M14 3l5 5M14 3v5h5M19 8v3" />
      <path d="M8 9h3M8 13h5M8 17h2" />
      <circle cx="17" cy="16" r="3" />
      <path d="M15.5 18.6 15 22l2-1 2 1-.5-3.4" />
    </svg>
  );
}
export function ShieldCheck({ className = "", size = 22 }: P) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className={className}>
      <path d="M12 3 4.5 6v5.5c0 4.5 3.2 8.4 7.5 9.5 4.3-1.1 7.5-5 7.5-9.5V6L12 3Z" />
      <path d="m8.8 12 2.2 2.2 4.2-4.4" />
    </svg>
  );
}
export function CropMarks() {
  const pos = ["-start-[9px] -top-[9px]", "-end-[9px] -top-[9px]", "-start-[9px] -bottom-[9px]", "-end-[9px] -bottom-[9px]"];
  return (
    <>
      {pos.map((p) => (
        <svg key={p} width="17" height="17" viewBox="0 0 17 17" aria-hidden="true" className={`absolute ${p}`}>
          <path d="M8.5 0V17M0 8.5H17" stroke="#15171A" strokeWidth="1" />
        </svg>
      ))}
    </>
  );
}
