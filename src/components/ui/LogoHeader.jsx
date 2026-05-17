export default function LogoHeader() {
  return (
    <svg className="ph-logo" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 290 52" aria-label="Better Together">
      <defs>
        <style>{`.ph-text-main{font-family:'Cormorant Garamond',Georgia,serif;fill:#F0D488;letter-spacing:.10em}.ph-text-sub{font-family:'DM Sans',Arial,sans-serif;fill:#C8952A;letter-spacing:.26em}`}</style>
      </defs>
      <path d="M 5,40 C 8,30 14,19 25,11 C 21,24 17,35 19,41 C 13,41 8,41 5,40 Z" fill="#C8952A" opacity="0.9"/>
      <path d="M 45,40 C 42,30 36,19 25,11 C 29,24 33,35 31,41 C 37,41 42,41 45,40 Z" fill="#C8952A" opacity="0.42"/>
      <line x1="25" y1="11" x2="25" y2="41" stroke="#F0D488" strokeWidth="0.9" opacity="0.55"/>
      <line x1="7" y1="41" x2="43" y2="41" stroke="#C8952A" strokeWidth="0.7" opacity="0.4"/>
      <text x="55" y="30" className="ph-text-main" fontSize="15" fontWeight="300">Better Together</text>
      <text x="56" y="44" className="ph-text-sub" fontSize="7" fontWeight="400">SYSTEMIC</text>
    </svg>
  )
}
