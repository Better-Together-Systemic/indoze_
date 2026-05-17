import { useState } from 'react'
import { BookOpen } from 'lucide-react'
import { DIAS, EMOJIS } from '../../lib/dias.js'
import { gerarPDFEfeito } from '../../utils/pdfGenerator.js'

export default function ModalLivro({ aberto, onFechar, dados, perfilUsuario, usuarioSessao, serieAtiva, sb }) {
  const [gerando, setGerando] = useState(false)

  if (!aberto || !dados) return null

  const { nome, a, reflexoes } = dados
  const titulo   = a?.titulo        || `INDOZE que Nasceu — ${nome}`
  const frase    = a?.frase_semente || 'Uma ação por dia pode mudar a nossa vida.'
  const pergunta = a?.pergunta      || 'E amanhã, o que você vai plantar?'
  const celeb    = a?.celebracao    || 'Você chegou ao fim de uma série que transforma.'

  async function baixarPDF() {
    setGerando(true)
    await gerarPDFEfeito({ perfilUsuario, usuarioSessao, serieAtiva, sb })
    setGerando(false)
  }

  return (
    <div className="livro-modal-bg" style={{ display: 'block' }}>
      <div className="livro-modal">
        <div className="livro-capa">
          <div className="livro-capa-titulo"><BookOpen size={20} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 8 }} />O E-Feito INDOZE</div>
          <div className="livro-capa-sub" style={{ marginBottom: '1.5rem', letterSpacing: '.08em' }}>Parei de brigar com os fatos e executei coisas diferentes em 12 dias.</div>
          <div style={{ borderTop: '1px solid rgba(200,149,42,.25)', paddingTop: '1.25rem', marginTop: '.5rem', textAlign: 'left' }}>
            <div style={{ fontSize: '11px', letterSpacing: '.18em', textTransform: 'uppercase', color: '#888', marginBottom: '.4rem' }}>Autora da própria vida</div>
            <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: '1.5rem', fontWeight: 300, color: '#F0D488', marginBottom: '1rem' }}>{nome}</div>
            <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
              <div><div style={{ fontSize: '14px', letterSpacing: '.15em', textTransform: 'uppercase', color: '#888', marginBottom: '3px' }}>Investimento de Tempo</div><div style={{ fontSize: '13px', color: '#D4C4A8' }}>12 Dias</div></div>
              <div><div style={{ fontSize: '14px', letterSpacing: '.15em', textTransform: 'uppercase', color: '#888', marginBottom: '3px' }}>O Retorno</div><div style={{ fontSize: '13px', color: '#D4C4A8' }}>Conhecimento e Ação</div></div>
            </div>
          </div>
          <div style={{ marginTop: '1.5rem', borderTop: '1px solid rgba(200,149,42,.15)', paddingTop: '1.25rem' }}>
            <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: '1rem', fontStyle: 'italic', fontWeight: 300, color: '#C8952A', lineHeight: 1.7 }}>"Ideias e intenções não mudam a realidade, atitudes SIM! O universo não investe em planos perfeitos, ele amplifica e investe em quem tem a coragem de começar. Este E-Feito é a materialização de que você começou. Execute!"</div>
          </div>
          <div className="livro-capa-sub" style={{ marginTop: '1.25rem' }}>BETTER TOGETHER SYSTEMIC · INDOZE</div>
        </div>

        <div className="livro-inner">
          <div className="livro-frase">
            <div className="livro-frase-label">Sua frase-semente</div>
            <div className="livro-frase-txt">"{frase}"</div>
          </div>

          {Array.from({ length: 12 }, (_, i) => i + 1).map(n => {
            const r   = reflexoes.find(x => x.dia === n)
            const txt = r?.texto || '—'
            const da  = a?.dias?.find(d => d.num === n)
            return (
              <div key={n} className="livro-dia">
                <div className="livro-dia-header">
                  <span style={{ fontSize: '1.5rem' }}>{da?.emoji || EMOJIS[n]}</span>
                  <div>
                    <div className="livro-dia-num">{DIAS[n].fase} · Dia {n}</div>
                    <div className="livro-dia-nome">{DIAS[n].titulo}</div>
                  </div>
                </div>
                {da?.insight && <div className="livro-dia-insight">"{da.insight}"</div>}
                <div className="livro-dia-escrita">{txt}</div>
                {da?.transformacao && <div className="livro-dia-transf">✦ {da.transformacao}</div>}
              </div>
            )
          })}

          <div className="livro-final">
            <div className="livro-final-pergunta">{pergunta}</div>
            <div className="livro-final-txt">{celeb}</div>
            <div className="livro-final-txt">Compartilhe sua história — marque @elianesimoescruz e convide mais pessoas para a próxima série.</div>
            <div className="livro-final-assinatura">BETTER TOGETHER SYSTEMIC · Eliane Simões Cruz</div>
          </div>

          <div className="livro-btns">
            <button className="btn-print" onClick={baixarPDF} disabled={gerando}>
              {gerando ? '⏳ Gerando PDF...' : '⬇ Baixar E-Feito PDF'}
            </button>
            <button className="btn-fechar-livro" onClick={onFechar}>Fechar</button>
          </div>
        </div>
      </div>
    </div>
  )
}
