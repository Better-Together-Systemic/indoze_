import { useState, useEffect } from 'react'
import { Sprout, Egg, ArrowRight } from 'lucide-react'
import { useApp } from '../../context/AppContext.jsx'
import { sb } from '../../lib/supabase.js'
import { DIAS } from '../../lib/dias.js'

export default function SecaoIndez() {
  const { serieAtiva, usuarioSessao, indezTexto, setIndezTexto, indezDia, setIndezDia, escrivaoContextoDia, setSecaoAtiva, numeroSerie } = useApp()
  const [inputTxt, setInputTxt] = useState('')
  const [inputDia, setInputDia] = useState('')
  const [erro, setErro] = useState('')
  const [ovos, setOvos] = useState([])
  const [contador, setContador] = useState(null)
  const [okMsg, setOkMsg] = useState(null)

  useEffect(() => {
    renderOvos()
  }, [serieAtiva])

  useEffect(() => {
    if (indezTexto) { setInputTxt(indezTexto); setIndezTexto('') }
    if (indezDia)   { setInputDia(String(indezDia)); setIndezDia(null) }
    else if (escrivaoContextoDia) setInputDia(String(escrivaoContextoDia))
  }, [indezTexto, indezDia])

  useEffect(() => {
    atualizarContador(inputDia)
  }, [inputDia])

  async function atualizarContador(diaVal) {
    const dia = parseInt(diaVal)
    if (!diaVal || isNaN(dia) || dia < 1 || dia > 12) { setContador(null); return }
    let qtd = 0
    if (serieAtiva) {
      const { count } = await sb.from('indez').select('id', { count: 'exact', head: true })
        .eq('serie_id', serieAtiva.id).eq('dia', dia)
      qtd = count || 0
    } else {
      try { qtd = JSON.parse(localStorage.getItem('indez_local') || '[]').filter(o => o.dia === dia).length } catch {}
    }
    setContador({ dia, qtd })
  }

  async function botarOvo() {
    const txt = inputTxt.trim()
    const dia = parseInt(inputDia)
    setErro(''); setOkMsg(null)
    if (!txt) { setErro('Escreva seu Indez antes de registrar.'); return }
    if (!inputDia || isNaN(dia) || dia < 1 || dia > 12) { setErro('Informe um dia válido entre 1 e 12.'); return }

    if (serieAtiva) {
      const { error } = await sb.from('indez').insert({
        serie_id: serieAtiva.id, usuario_id: usuarioSessao.id, dia, texto: txt
      })
      if (error) {
        setErro(error.message.includes('Limite') ? `Você já plantou 3 Indez no Dia ${dia}.` : 'Erro ao salvar. Tente novamente.')
        return
      }
    } else {
      const chave = 'indez_local'
      let local = []
      try { local = JSON.parse(localStorage.getItem(chave) || '[]') } catch {}
      if (local.filter(o => o.dia === dia).length >= 3) {
        setErro(`Você já plantou 3 Indez no Dia ${dia}.`); return
      }
      local.push({ dia, texto: txt, numero_semente: local.filter(o => o.dia === dia).length + 1, plantado_em: new Date().toISOString() })
      try { localStorage.setItem(chave, JSON.stringify(local)) } catch {}
    }

    const proximoDia = dia < 12 ? dia + 1 : null
    const temaNome   = proximoDia ? (DIAS[proximoDia]?.titulo || '') : ''
    setOkMsg({ txt, dia, proximoDia, temaNome })
    setInputTxt('')
    await atualizarContador(inputDia)
    await renderOvos()
  }

  async function renderOvos() {
    let lista = []
    if (serieAtiva) {
      const { data } = await sb.from('indez').select('*').eq('serie_id', serieAtiva.id).order('dia').order('numero_semente')
      lista = data || []
    } else {
      try { lista = JSON.parse(localStorage.getItem('indez_local') || '[]') } catch {}
      lista.sort((a, b) => a.dia - b.dia || a.numero_semente - b.numero_semente)
    }
    setOvos(lista)
  }

  const grupos = {}
  ovos.forEach(o => { if (!grupos[o.dia]) grupos[o.dia] = []; grupos[o.dia].push(o) })
  const diasOrdenados = Object.keys(grupos).map(Number).sort((a, b) => b - a)

  return (
    <div>
      <h1 className="sec-titulo">Meu Indez <span className="serie-badge">Série {numeroSerie}</span></h1>
      <p className="indez-intro">"Todo novo começo precisa de um lugar seguro para brotar. O seu Indez é a sua primeira semente — a pequena ação que você acomoda neste ninho. O algoritmo do universo lê os nossos começos e amplifica o que você planta. Qual semente você escolhe acomodar no seu ninho hoje?"</p>

      <div className="indez-form">
        <label className="indez-label">Qual semente você escolhe acomodar no seu ninho hoje? Registre a opção sugerida pelo Espelho da Mente para as suas próximas 24 horas...</label>
        <input type="text" className="indez-input" value={inputTxt}
          onChange={e => setInputTxt(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); botarOvo() } }}
          placeholder="Escreva a ação que você planta nas próximas 24 horas..." />

        <div className="indez-row">
          <div className="indez-dia-wrap">
            <label className="indez-dia-label">Dia (1 a 12)</label>
            <input type="number" className="indez-dia" min="1" max="12" step="1"
              value={inputDia} placeholder="1–12"
              onChange={e => {
                let v = e.target.value.replace(/[^0-9]/g, '')
                if (v && parseInt(v) > 12) v = '12'
                if (v && parseInt(v) < 1) v = '1'
                setInputDia(v)
              }} />
          </div>
          <button className="btn-plantar" onClick={botarOvo}>Plantar semente</button>
        </div>

        {erro && <div className="indez-erro visivel">{erro}</div>}
        {contador && (
          <div className="indez-contador visivel">
            Dia <span style={{ color: 'var(--ouro)', fontWeight: 500 }}>{contador.dia}</span>: <span style={{ color: 'var(--ouro)', fontWeight: 500 }}>{contador.qtd}</span>/3 Indez plantados
          </div>
        )}

        {okMsg && (
          <div style={{ marginTop: '1rem' }}>
            <div style={{ background: 'rgba(200,149,42,.08)', border: '1px solid rgba(200,149,42,.25)', padding: '1.25rem 1.5rem', marginBottom: '.75rem' }}>
              <div style={{ fontSize: '18px', color: '#2ecc71', fontWeight: 500, marginBottom: '.5rem', display: 'flex', alignItems: 'center', gap: 6 }}><Sprout size={18} />Semente plantada! Dia {okMsg.dia} concluído.</div>
              <div style={{ fontSize: '15px', color: 'rgba(250,250,248,.75)', lineHeight: 1.7, marginBottom: '.75rem' }}>
                Você escreveu: <em style={{ color: 'var(--ouro-claro)' }}>"{okMsg.txt}"</em><br />
                Pense em como você vai agir daqui para frente com essa semente.
              </div>
              {okMsg.proximoDia ? (
                <div style={{ borderTop: '1px solid rgba(200,149,42,.15)', paddingTop: '.85rem', marginTop: '.5rem' }}>
                  <div style={{ fontSize: '12px', letterSpacing: '.15em', textTransform: 'uppercase', color: 'var(--ouro)', marginBottom: '.4rem' }}>Próximo passo — Dia {okMsg.proximoDia}</div>
                  <div style={{ fontSize: '16px', color: 'var(--branco)', fontWeight: 400 }}>{okMsg.temaNome}</div>
                  <div style={{ fontSize: '13px', color: 'var(--muted)', marginTop: '.3rem', marginBottom: '.75rem' }}>O universo já leu o seu início de hoje. Volte amanhã para continuar a jornada. ✦</div>
                  <button className="btn-proximo-dia" onClick={() => setSecaoAtiva('dias')}>
                    Ir para os 12 Dias <ArrowRight size={13} style={{ marginLeft: 5, verticalAlign: 'middle' }} />
                  </button>
                </div>
              ) : (
                <div style={{ borderTop: '1px solid rgba(200,149,42,.15)', paddingTop: '.85rem', color: 'var(--ouro-claro)', fontSize: '15px' }}>
                  ✦ Você chegou ao Dia 12! Sua jornada INDOZE está completa. Celebre e gere seu E-Feito.
                  <div style={{ marginTop: '.75rem' }}>
                    <button className="btn-proximo-dia" onClick={() => setSecaoAtiva('dias')}>
                      Ver meu E-Feito <ArrowRight size={13} style={{ marginLeft: 5, verticalAlign: 'middle' }} />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <div className="ovos-lista">
        {diasOrdenados.length === 0 && (
          <div style={{ padding: '1.5rem 0', fontSize: '15px', color: 'var(--muted)' }}>Nenhum Indez plantado ainda. Comece hoje.</div>
        )}
        {diasOrdenados.map(dia => {
          const itens = grupos[dia]
          const cheio = itens.length >= 3
          return (
            <div key={dia} className="ovo-grupo">
              <div className="ovo-grupo-header">
                <span className="ovo-grupo-titulo"><Egg size={15} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 5 }} />Dia {dia} — {DIAS[dia]?.titulo || 'Dia ' + dia}</span>
                <span className={`ovo-grupo-badge${cheio ? ' cheio' : ''}`}>{itens.length}/3{cheio ? ' · completo' : ''}</span>
              </div>
              {itens.map((o, i) => (
                <div key={i} className="ovo-item">
                  <div className="ovo-num">{i + 1}</div>
                  <div>
                    <div className="ovo-txt">{o.texto}</div>
                    <div className="ovo-meta">{new Date(o.plantado_em).toLocaleDateString('pt-BR')}</div>
                  </div>
                </div>
              ))}
            </div>
          )
        })}
      </div>
    </div>
  )
}
