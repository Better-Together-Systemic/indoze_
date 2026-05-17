export default function LogoEntrada() {
  return (
    <svg className="entrada-logo" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 480 96" aria-label="Better Together Systemic">
      <defs>
        <style>{`.bt-text-main{font-family:'Cormorant Garamond',Georgia,serif;fill:#F0D488;letter-spacing:.10em}.bt-text-sub{font-family:'DM Sans',Arial,sans-serif;fill:#C8952A;letter-spacing:.30em}`}</style>
      </defs>
      <path d="M 8,74 C 14,54 26,34 46,20 C 38,44 30,62 34,75 C 22,75 14,75 8,74 Z" fill="#C8952A" opacity="0.9"/>
      <path d="M 84,74 C 78,54 66,34 46,20 C 54,44 62,62 58,75 C 70,75 78,75 84,74 Z" fill="#C8952A" opacity="0.42"/>
      <line x1="46" y1="20" x2="46" y2="75" stroke="#F0D488" strokeWidth="1.2" opacity="0.55"/>
      <line x1="10" y1="75" x2="82" y2="75" stroke="#C8952A" strokeWidth="1" opacity="0.4"/>
      <text x="104" y="56" className="bt-text-main" fontSize="27" fontWeight="300">Better Together</text>
      <text x="105" y="78" className="bt-text-sub" fontSize="12" fontWeight="400">SYSTEMIC</text>
    </svg>
  )
}
