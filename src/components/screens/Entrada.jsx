import LogoEntrada from '../ui/LogoEntrada.jsx'

export default function Entrada({ onEntrar, onOrigem }) {
  return (
    <div className="tela ativa" id="entrada">
      <div className="entrada-bg" />
      <div className="entrada-linhas" />
      <div className="entrada-header">
        <button className="link-origem" onClick={onOrigem}>
          Como o INDOZE nasceu
        </button>
      </div>
      <div className="entrada-conteudo">
        <LogoEntrada />
        <div className="entrada-divisor" />
        <div className="entrada-titulo">INDOZE</div>
        <div className="entrada-sub">12 dias por dentro</div>
        <div className="entrada-frase">O que dentro de você<br />espera há muito tempo?</div>
        <button className="btn-entrar" onClick={onEntrar}>Entrar</button>
      </div>
    </div>
  )
}
