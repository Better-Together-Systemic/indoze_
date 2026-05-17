import { useState, useEffect } from 'react'
import { BookOpen, ArrowRight, Check } from 'lucide-react'
import { useApp } from '../../context/AppContext.jsx'
import { sb } from '../../lib/supabase.js'
import { DIAS, EMOJIS, FC } from '../../lib/dias.js'
import { apiCall } from '../../lib/api.js'
import { MODELO } from '../../lib/dias.js'
import LoadingDots from '../ui/LoadingDots.jsx'

export default function SecaoDias({ onGerarLivro }) {
  const { serieAtiva, usuarioSessao, perfilUsuario, irParaEscrivaoComDia, iniciarNovaSerie } = useApp()
  const [diaAberto, setDiaAberto] = useState(null)
  const [reflexoes, setReflexoes] = useState({})
  const [escrita, setEscrita] = useState('')
  const [salvoOk, setSalvoOk] = useState(false)
  const [diasSalvos, setDiasSalvos] = useState(new Set())
  const [mostrarLivro, setMostrarLivro] = useState(false)
  const [gerandoLivro, setGerandoLivro] = useState(false)
  const [livroErro, setLivroErro] = useState(false)
  const [livroJaGerado, setLivroJaGerado] = useState(false)
  const [confirmandoNovaSerie, setConfirmandoNovaSerie] = useState(false)
  const [iniciandoNovaSerie, setIniciandoNovaSerie] = useState(false)

  useEffect(() => {
    if (serieAtiva) marcarDiasSalvos()
  }, [serieAtiva])

  async function marcarDiasSalvos() {
    const { data } = await sb.from('reflexoes').select('dia,texto').eq('serie_id', serieAtiva.id)
    const salvos = new Set()
    ;(data || []).forEach(r => { if (r.texto?.trim()) salvos.add(r.dia) })
    setDiasSalvos(salvos)
    verificarLivro(salvos.size)
    if (salvos.size >= 12) {
      const { data: livro } = await sb.from('livros').select('id').eq('serie_id', serieAtiva.id).maybeSingle()
      setLivroJaGerado(!!livro)
    }
  }

  function verificarLivro(qtd) {
    setMostrarLivro(!!serieAtiva && qtd >= 12)
  }

  async function abrirDia(n) {
    if (diaAberto === n) { setDiaAberto(null); setSalvoOk(false); return }
    setDiaAberto(n); setSalvoOk(false)
    let txt = ''
    if (serieAtiva) {
      const { data } = await sb.from('reflexoes').select('texto')
        .eq('serie_id', serieAtiva.id).eq('dia', n).single()
      txt = data?.texto || ''
    }
    setEscrita(txt)
  }

  async function salvarDia() {
    if (!diaAberto) return
    const n = diaAberto
    if (serieAtiva) {
      await sb.from('reflexoes').upsert({
        serie_id: serieAtiva.id, usuario_id: usuarioSessao.id, dia: n, texto: escrita
      }, { onConflict: 'serie_id,dia' })
    }
    if (escrita.trim()) {
      setDiasSalvos(prev => new Set([...prev, n]))
      setSalvoOk(true)
      verificarLivro(diasSalvos.size + (diasSalvos.has(n) ? 0 : 1))
      setTimeout(() => { irParaEscrivaoComDia(n, escrita.trim()) }, 800)
    } else {
      setSalvoOk(true)
      setTimeout(() => setSalvoOk(false), 2500)
    }
  }

  async function confirmarNovaSerie() {
    setIniciandoNovaSerie(true)
    await iniciarNovaSerie()
    setIniciandoNovaSerie(false)
    setConfirmandoNovaSerie(false)
    setLivroJaGerado(false)
    setMostrarLivro(false)
    setDiasSalvos(new Set())
    setDiaAberto(null)
  }

  async function gerarLivro() {
    setGerandoLivro(true); setLivroErro(false)
    const nome = perfilUsuario?.nome || 'Participante'
    const { data: refl } = await sb.from('reflexoes').select('dia,texto').eq('serie_id', serieAtiva.id).order('dia')
    let txt = ''
    ;(refl || []).forEach(r => { if (r.texto) txt += `Dia ${r.dia} — ${DIAS[r.dia].titulo}:\n${r.texto}\n\n` })
    try {
      const data = await apiCall({
        model: MODELO, max_tokens: 2000,
        system: 'Você é o Escrivão Sistêmico do INDOZE. Analise a jornada de 12 dias e crie o livro "INDOZE que Nasceu". Responda APENAS em JSON sem markdown: {"titulo":"título personalizado","frase_semente":"frase poderosa","dias":[{"num":1,"emoji":"🌱","insight":"frase breve","transformacao":"ponto de potencial"}...],"pergunta":"E amanhã, o que você vai plantar?","celebracao":"mensagem pessoal"}',
        messages: [{ role: 'user', content: `Nome: ${nome}\n\n${txt || 'Participante completou os 12 dias.'}` }]
      })
      let a
      try { a = JSON.parse(data.content[0].text.replace(/```json|```/g, '').trim()) } catch { a = null }
      if (serieAtiva) {
        await sb.from('livros').upsert({
          serie_id: serieAtiva.id, usuario_id: usuarioSessao.id,
          titulo: a?.titulo || `INDOZE que Nasceu — ${nome}`,
          frase_semente: a?.frase_semente || '',
          conteudo_json: a || {}
        }, { onConflict: 'serie_id' })
      }
      onGerarLivro({ nome, a, reflexoes: refl || [] })
      setLivroJaGerado(true)
    } catch {
      setLivroErro(true)
    } finally {
      setGerandoLivro(false)
    }
  }

  const d = diaAberto ? DIAS[diaAberto] : null

  return (
    <div>
      <h1 className="sec-titulo">Os 12 Dias por Dentro</h1>
      <p className="sec-sub">Selecione um dia para acessar o conteúdo e registrar sua reflexão.</p>

      <div className="grade-fases">
        <span className="fase-tag"><span className="fase-dot" style={{ background: '#D85A30' }} />A Mente</span>
        <span className="fase-tag" style={{ marginLeft: '12px' }}><span className="fase-dot" style={{ background: '#3B6D11' }} />Honrando as Raízes</span>
        <span className="fase-tag" style={{ marginLeft: '12px' }}><span className="fase-dot" style={{ background: '#185FA5' }} />Florescer</span>
        <span className="fase-tag" style={{ marginLeft: '12px' }}><span className="fase-dot" style={{ background: 'var(--ouro)' }} />Algoritmo do Sim</span>
      </div>

      <div className="grade-dias">
        {Array.from({ length: 12 }, (_, i) => i + 1).map(n => (
          <div key={n} className={`dia-item ${FC[n]}${diaAberto === n ? ' ativo' : ''}${diasSalvos.has(n) ? ' salvo' : ''}`}
            onClick={() => abrirDia(n)}>
            <span className="dia-emoji">{EMOJIS[n]}</span>
            <div className="dia-num">Dia {n}</div>
            <div className="dia-nome">{DIAS[n].titulo}</div>
            <div className="dia-ok" />
          </div>
        ))}
      </div>

      {diaAberto && d && (
        <div className="det-dia" style={{ display: 'block' }}>
          <div className="det-fase" style={{ color: d.faseColor }}>{d.fase} · Dia {diaAberto}</div>
          <div className="det-titulo">{d.titulo}</div>
          <div className="det-desc">{d.desc}</div>
          <div className="det-indez">
            <div className="det-indez-label">Seu Indez de hoje</div>
            <div className="det-indez-txt">{d.indez}</div>
          </div>
          <textarea className="det-escrita" value={escrita} onChange={e => setEscrita(e.target.value)}
            placeholder="Escreva aqui o que surgiu para você neste dia..." />
          <div className="det-acoes">
            <button className="btn-salvar" onClick={salvarDia}>Salvar reflexão</button>
            <button className="btn-fechar-det" onClick={() => { setDiaAberto(null); setSalvoOk(false) }}>Fechar</button>
            {salvoOk && <span className="det-ok visivel"><Check size={13} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 4 }} />Salvo — indo para o Escrivão...</span>}
          </div>
        </div>
      )}

      {mostrarLivro && (
        <div className="livro-bloco">
          <div className="livro-titulo"><BookOpen size={20} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 8 }} />O E-Feito INDOZE</div>
          <div className="livro-desc" style={{ fontStyle: 'italic', color: 'var(--ouro)', marginBottom: '.5rem' }}>Uhuuuu! Parei de brigar com os fatos e executei coisas diferentes em 12 dias.</div>
          <div className="livro-desc">Tudo o que foi escrito durante os seus 12 dias será o registro autoral e vivo da sua história. As suas respostas ganharão forma agora e terão um grande efeito. Criado através de você!</div>
          {!gerandoLivro && !livroErro && (
            <button className="btn-gerar" onClick={gerarLivro}>
              <span>Gerar meu livro</span>
              <ArrowRight size={14} style={{ opacity: .6 }} />
            </button>
          )}
          {gerandoLivro && (
            <div className="carregando" style={{ display: 'flex' }}>
              <LoadingDots />
              <span style={{ marginLeft: '8px' }}>Preparando seu livro...</span>
            </div>
          )}
          {livroErro && (
            <div className="livro-erro" style={{ display: 'block' }}>
              Não foi possível conectar agora.
              <button className="btn-retry" onClick={gerarLivro}>Tentar novamente</button>
            </div>
          )}
        </div>
      )}

      {mostrarLivro && livroJaGerado && !confirmandoNovaSerie && (
        <div className="nova-serie-bloco">
          <div className="nova-serie-txt">Pronto para uma nova jornada de 12 dias?</div>
          <button className="btn-nova-serie" onClick={() => setConfirmandoNovaSerie(true)}>
            Iniciar nova Série
          </button>
        </div>
      )}

      {confirmandoNovaSerie && (
        <div className="nova-serie-confirm">
          <div className="nova-serie-confirm-txt">
            Ao iniciar uma nova série, todos os dias, conversas com o Escrivão e Indez serão reiniciados. Seu E-Feito gerado fica salvo.
          </div>
          <div className="nova-serie-confirm-acoes">
            <button className="btn-confirmar-serie" onClick={confirmarNovaSerie} disabled={iniciandoNovaSerie}>
              {iniciandoNovaSerie ? 'Iniciando...' : 'Sim, iniciar nova Série'}
            </button>
            <button className="btn-cancelar-serie" onClick={() => setConfirmandoNovaSerie(false)} disabled={iniciandoNovaSerie}>
              Cancelar
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
