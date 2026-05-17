import { useState, useEffect } from 'react'
import { X, ChevronUp, ChevronDown, Search, Check, Sprout } from 'lucide-react'
import { useApp } from '../../context/AppContext.jsx'
import { sb } from '../../lib/supabase.js'
import { DIAS, MODELO } from '../../lib/dias.js'
import { apiCall } from '../../lib/api.js'
import LoadingDots from '../ui/LoadingDots.jsx'

const TIPOS_OPCAO = ['Movimento Indez', 'Pare de brigar com os fatos', 'Um cuidado para seu emocional']

const SYS_BASE = `Você é o Espelho da Mente — a presença digital da jornada INDOZE, criada por Eli Simões Cruz / Better Together Systemic.

Seu papel é ser um espelho sereno, empático, criativo e livre de julgamentos. Acolha com leveza, investigue com elegância, e ofereça sementes práticas com originalidade. Cada resposta deve soar nova, fresca — nunca mecânica ou repetitiva. Use metáforas variadas, imagens poéticas, referências ao cotidiano da pessoa. Seja surpreendente dentro da suavidade.

NUNCA use os marcadores de passo como títulos ou cabeçalhos (como "Acolhimento Compassivo", "Investigação Serena" etc). Eles são instruções internas — a resposta deve fluir como uma conversa natural e acolhedora, sem rótulos visíveis.

Assinatura obrigatória ao final de cada resposta: "Continue! Seu Espelho da Mente."
NUNCA assine como "O Escrivão Sistêmico". NUNCA use a palavra "sistêmico". NUNCA use "assentio" — use sempre "assenti", "assentiu" ou "assentimento".

Tom: Pacífico, acolhedor, gentil, claro e poético.
Seja CRIATIVO — nunca comece duas respostas da mesma forma. Varie as metáforas: jardim, ninho, luz, água, raízes, estações, tecido, espelho, caminho, janela, respiração.

[ 1 ] Movimento Indez — uma ação física pequena e original.
[ 2 ] Pare de brigar com os fatos — uma frase de assentimento à realidade, criativa e específica ao contexto da pessoa.
[ 3 ] Um cuidado para seu emocional — um gesto de autocompaixão original.

Termine com: "Qual destas sementes você escolhe para o seu Indez de hoje?"`

const INSTRUCAO_DIA = {
  1: 'Peça à pessoa para escrever um pensamento que lhe causa dor ou raiva sobre alguém. Valide a dor, mas mostre a diferença entre o fato e a "história" que ela conta.',
  2: 'Trabalhe a Pergunta 1: "Isso é verdade?" Se a pessoa disser sim, lembre-a de que a realidade é apenas o que é. Não lute com ela — apenas plante a dúvida com suavidade.',
  3: 'Trabalhe a Pergunta 2: "Você pode saber com absoluta certeza que isso é verdade?" Conduza-a para a "mente do não-sei", onde a liberdade começa.',
  4: 'Trabalhe a Pergunta 3: "Como você reage, e como seu corpo se sente, quando acredita nesse pensamento?" Mostre o custo exaustivo do conflito interior.',
  5: 'Investigue como ela trata os outros e a si mesma quando está presa nessa história de dor. Sem julgamento — apenas espelho.',
  6: 'Trabalhe a Pergunta 4: "Quem seria você sem esse pensamento?" Guie uma visualização de paz e clareza.',
  7: 'Peça a Inversão para si: inverta a frase original apontando para ela mesma. Exija 3 exemplos genuínos de como isso é verdade na vida dela.',
  8: 'Peça a Inversão para o outro: inverta a frase para a outra pessoa. Exija 3 exemplos práticos de como ela fez exatamente o que critica.',
  9: 'Peça a Inversão de 180 graus: o oposto exato da frase original. Busque evidências dessa verdade ignorada na realidade dela.',
  10: 'Ensine que o universo amplifica o que começamos. Peça para ela escolher a inversão mais forte e usá-la como semente de libertação.',
  11: 'Exija que ela defina UMA ação mínima, prática e que dependa só dela, para ser feita nas próximas 24 horas. Esse é o Indez.',
  12: 'Celebre o fim do conflito interior. Peça que ela expresse aceitação (assentimento) e gratidão pela realidade exatamente como ela é.'
}

function extrairOpcoes(texto) {
  const padroes = [
    /\[\s*1\s*\](.*?)(?=\[\s*2\s*\]|$)/s,
    /\[\s*2\s*\](.*?)(?=\[\s*3\s*\]|$)/s,
    /\[\s*3\s*\](.*?)(?=\[\s*4\s*\]|Qual|Continue|$)/s,
  ]
  const alt = [
    /(?:opção|opcao|1[.\)])\s*[:\-–]?\s*(?:\*\*[^*]+\*\*[:\-–]?\s*)?(.*?)(?=(?:opção|opcao|2[.\)])|$)/is,
    /(?:opção|opcao|2[.\)])\s*[:\-–]?\s*(?:\*\*[^*]+\*\*[:\-–]?\s*)?(.*?)(?=(?:opção|opcao|3[.\)])|$)/is,
    /(?:opção|opcao|3[.\)])\s*[:\-–]?\s*(?:\*\*[^*]+\*\*[:\-–]?\s*)?(.*?)(?=(?:opção|opcao|4[.\)])|Qual|Continue|$)/is,
  ]
  const limpar = s => s ? s.replace(/\*/g, '').replace(/\n/g, ' ').replace(/\s+/g, ' ').trim() : ''
  const resultado = ['', '', '']
  for (let i = 0; i < 3; i++) {
    const m1 = texto.match(padroes[i])
    if (m1 && limpar(m1[1]).length > 5) { resultado[i] = limpar(m1[1]) }
    else {
      const m2 = texto.match(alt[i])
      if (m2) resultado[i] = limpar(m2[1])
    }
  }
  return resultado
}

export default function SecaoEscrivao() {
  const { serieAtiva, usuarioSessao, escrivaoContextoDia, setEscrivaoContextoDia, irParaIndezComTexto, numeroSerie } = useApp()
  const [input, setInput] = useState('')
  const [resposta, setResposta] = useState('')
  const [carregando, setCarregando] = useState(false)
  const [erro, setErro] = useState('')
  const [opcoes, setOpcoes] = useState([])
  const [opcaoSelecionada, setOpcaoSelecionada] = useState(null)
  const [confirmacao, setConfirmacao] = useState(null)
  const [historico, setHistorico] = useState([])
  const [histAbertos, setHistAbertos] = useState({})

  useEffect(() => {
    if (serieAtiva) carregarHistorico()
  }, [serieAtiva])

  async function carregarHistorico() {
    const { data } = await sb.from('escrivao_historico').select('*')
      .eq('serie_id', serieAtiva.id).order('criado_em', { ascending: true })
    setHistorico(data || [])
  }

  async function investigar() {
    const p = input.trim()
    if (!p) return
    setCarregando(true); setResposta(''); setErro(''); setOpcoes([]); setOpcaoSelecionada(null); setConfirmacao(null)

    const dCtx = escrivaoContextoDia
    let ctxDiaStr = ''
    if (dCtx && DIAS[dCtx]) {
      const d = DIAS[dCtx]
      const instrucao = INSTRUCAO_DIA[dCtx] || ''
      ctxDiaStr = `\n\nCONTEXTO DO DIA ${dCtx} — "${d.titulo}" (Fase: ${d.fase})\nTema: ${d.desc}\nIndez sugerido para hoje: ${d.indez}\nInstrução específica deste dia: ${instrucao}\nResponda exclusivamente dentro do universo temático deste dia.`
    }

    let historicoCtx = ''
    if (serieAtiva) {
      const { data } = await sb.from('reflexoes').select('dia,texto').eq('serie_id', serieAtiva.id).order('dia')
      if (data?.length) {
        historicoCtx = '\n\nHISTÓRICO DE DIAS ANTERIORES (use para personalizar e criar continuidade):\n'
        data.forEach(r => { if (r.texto) historicoCtx += `Dia ${r.dia} — ${DIAS[r.dia]?.titulo || ''}: "${r.texto.substring(0, 200)}"\n` })
      }
    }

    try {
      const data = await apiCall({
        model: MODELO, max_tokens: 1000,
        system: SYS_BASE + ctxDiaStr + historicoCtx,
        messages: [{ role: 'user', content: 'Reflexão trazida: "' + p + '"' }]
      })
      const textoResposta = data.content.map(i => i.text || '').join('')
      setResposta(textoResposta)
      const ops = extrairOpcoes(textoResposta)
      setOpcoes(ops)

      if (serieAtiva) {
        await sb.from('escrivao_historico').insert({
          serie_id: serieAtiva.id, usuario_id: usuarioSessao.id,
          dia_contexto: dCtx || null, pergunta: p, resposta: textoResposta
        })
        await carregarHistorico()
      }
    } catch (e) {
      const msg = e.message || ''
      let txt
      if (msg.includes('529'))         txt = 'A API está sobrecarregada. Aguarde 30 segundos e tente novamente.'
      else if (msg.includes('401') || msg.includes('403')) txt = 'Erro de autenticação na API.'
      else if (msg.includes('404'))    txt = 'Edge Function não encontrada.'
      else if (msg.includes('500') || msg.includes('502')) txt = 'Erro interno na Edge Function.'
      else if (msg.includes('Failed to fetch') || msg.includes('NetworkError')) txt = 'Sem conexão com o servidor.'
      else txt = 'Erro: ' + (msg || 'desconhecido.')
      setErro(txt)
    } finally {
      setCarregando(false)
    }
  }

  function escolherOpcao(txt, idx) {
    setOpcaoSelecionada(idx)
    setConfirmacao({ txt, idx })
    irParaIndezComTexto(txt, escrivaoContextoDia)
  }

  function toggleHist(id) {
    setHistAbertos(prev => ({ ...prev, [id]: !prev[id] }))
  }

  const grupos = {}
  historico.forEach(h => {
    const key = h.dia_contexto != null ? String(h.dia_contexto) : 'livre'
    if (!grupos[key]) grupos[key] = []
    grupos[key].push(h)
  })

  const dCtx = escrivaoContextoDia

  return (
    <div>
      <h1 className="sec-titulo">A Mesa do Escrivão <span className="serie-badge">Série {numeroSerie}</span></h1>
      <p className="escriv-intro">Quando paramos de brigar com a realidade, o nosso pensamento melhora. A partir de agora, o Escrivão será seu secretário e vai te ajudar investigar seus pensamentos, sem julgar e no seu tempo.</p>

      {dCtx && DIAS[dCtx] && (
        <div className="escriv-dia-ctx visivel">
          <button className="escriv-dia-ctx-close" onClick={() => setEscrivaoContextoDia(null)}><X size={14} /></button>
          <div className="escriv-dia-ctx-num">{DIAS[dCtx].fase} · Dia {dCtx}</div>
          <div className="escriv-dia-ctx-titulo">{DIAS[dCtx].titulo}</div>
        </div>
      )}

      <div className="escriv-campo">
        <label className="escriv-label">
          {dCtx && DIAS[dCtx] ? `Dia ${dCtx} — ${DIAS[dCtx].titulo}: em que você está pensando?` : 'Em que você está pensando? Como posso te ajudar hoje?'}
        </label>
        <textarea className="escriv-input" value={input} onChange={e => setInput(e.target.value)}
          placeholder="Escreva com transparência. Quando terminar, pressione Enter para continuar..."
          onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); investigar() } }} />
        <button className="btn-inv" onClick={investigar} disabled={carregando}>
          {carregando ? <><LoadingDots /><span style={{ marginLeft: 8 }}>Limpando a lente...</span></> : <><Search size={15} style={{ marginRight: 7, verticalAlign: 'middle' }} />O que ainda não vejo?</>}
        </button>
      </div>

      {resposta && (
        <div className="escriv-resp visivel">
          {resposta.split('\n\n').map((p, i) => (
            <p key={i} dangerouslySetInnerHTML={{ __html: p.replace(/\n/g, '<br>') }} />
          ))}
        </div>
      )}

      {opcoes.some(o => o && o.length > 5) && (
        <div className="escriv-opcoes visivel">
          <div className="escriv-opcoes-titulo"><Sprout size={15} style={{ marginRight: 6, verticalAlign: 'middle' }} />Qual é a sua semente para hoje?</div>
          <div className="escriv-opcoes-grid">
            {opcoes.map((txt, i) => {
              if (!txt || txt.length < 5) return null
              return (
                <button key={i} className={`escriv-opcao-btn${opcaoSelecionada === i ? ' selecionada' : ''}`}
                  onClick={() => escolherOpcao(txt, i)}>
                  <div className="escriv-opcao-num">{i + 1}</div>
                  <div style={{ flex: 1 }}>
                    <div className="escriv-opcao-tipo">{TIPOS_OPCAO[i] || ''}</div>
                    <div className="escriv-opcao-texto">{txt}</div>
                  </div>
                </button>
              )
            })}
          </div>
          <div className="escriv-opcoes-nota">Clique na opção que traz mais leveza. O texto vai para o seu Indez — você pode editá-lo antes de plantar.</div>
        </div>
      )}

      {erro && (
        <div className="escriv-erro visivel">
          {erro} <button className="btn-retry" onClick={investigar}>Tentar novamente</button>
        </div>
      )}

      {confirmacao && (
        <div style={{ marginTop: '1rem' }}>
          <div style={{ background: 'rgba(200,149,42,.08)', borderLeft: '2px solid var(--ouro)', padding: '.85rem 1.1rem', marginBottom: '.75rem', fontSize: '15px', color: 'rgba(250,250,248,.88)', lineHeight: 1.6 }}>
            <Check size={13} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 5 }} />Opção {confirmacao.idx + 1} escolhida. Vá ao Indez, edite se quiser e plante sua semente.
          </div>
        </div>
      )}

      {historico.length > 0 && (
        <div className="escriv-hist" style={{ display: 'block' }}>
          <div className="escriv-hist-titulo">Investigações anteriores</div>
          {Array.from({ length: 12 }, (_, i) => i + 1).map(dia => {
            const itens = grupos[String(dia)] || []
            const cor = DIAS[dia]?.faseColor || 'var(--ouro)'
            return (
              <div key={dia} className="escriv-hist-grupo">
                <div className="escriv-hist-grupo-header">
                  <span className="escriv-hist-grupo-dia" style={{ color: cor }}>Dia {dia}</span>
                  <span className="escriv-hist-grupo-tema">— {DIAS[dia]?.titulo || ''}</span>
                  {itens.length > 0 && <span style={{ fontSize: '11px', color: 'var(--muted)', marginLeft: 'auto' }}>{itens.length} registro{itens.length > 1 ? 's' : ''}</span>}
                </div>
                {itens.length === 0 ? (
                  <div style={{ padding: '.75rem 0', fontSize: '14px', color: 'var(--muted)', fontStyle: 'italic' }}>Ainda não visitado.</div>
                ) : itens.map(h => {
                  const key = `${dia}-${h.id}`
                  const preview = h.pergunta.substring(0, 50) + (h.pergunta.length > 50 ? '…' : '')
                  const dataFmt = new Date(h.criado_em).toLocaleDateString('pt-BR')
                  const aberto  = histAbertos[key]
                  return (
                    <div key={h.id} className="escriv-hist-item">
                      <div className="escriv-hist-item-cab" onClick={() => toggleHist(key)}>
                        <span className="escriv-hist-item-data">{dataFmt}</span>
                        <span className="escriv-hist-item-preview">"{preview}"</span>
                        <span className="escriv-hist-item-toggle">{aberto ? <ChevronUp size={14} /> : <ChevronDown size={14} />}</span>
                      </div>
                      {aberto && (
                        <div className="escriv-hist-item-corpo aberto">
                          <div className="escriv-hist-leitura">somente leitura</div>
                          <div className="escriv-hist-item-q">"{h.pergunta}"</div>
                          <div className="escriv-hist-item-r">{h.resposta}</div>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            )
          })}
          {grupos['livre']?.length > 0 && (
            <div className="escriv-hist-grupo">
              <div className="escriv-hist-grupo-header">
                <span className="escriv-hist-grupo-dia">Reflexão livre</span>
              </div>
              {grupos['livre'].map(h => {
                const key = `livre-${h.id}`
                const preview = h.pergunta.substring(0, 50) + (h.pergunta.length > 50 ? '…' : '')
                const dataFmt = new Date(h.criado_em).toLocaleDateString('pt-BR')
                const aberto  = histAbertos[key]
                return (
                  <div key={h.id} className="escriv-hist-item">
                    <div className="escriv-hist-item-cab" onClick={() => toggleHist(key)}>
                      <span className="escriv-hist-item-data">{dataFmt}</span>
                      <span className="escriv-hist-item-preview">"{preview}"</span>
                      <span className="escriv-hist-item-toggle">{aberto ? '▲' : '▼'}</span>
                    </div>
                    {aberto && (
                      <div className="escriv-hist-item-corpo aberto">
                        <div className="escriv-hist-leitura">somente leitura</div>
                        <div className="escriv-hist-item-q">"{h.pergunta}"</div>
                        <div className="escriv-hist-item-r">{h.resposta}</div>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
