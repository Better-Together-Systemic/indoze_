import { useState, useEffect } from 'react'
import { X, ChevronUp, ChevronDown, Search, Check, Sprout, Leaf, ArrowRight } from 'lucide-react'
import { useApp } from '../../context/AppContext.jsx'
import { sb } from '../../lib/supabase.js'
import { DIAS, MODELO } from '../../lib/dias.js'
import { apiCall } from '../../lib/api.js'
import LoadingDots from '../ui/LoadingDots.jsx'

const TIPOS_OPCAO = ['Movimento Indez', 'Pare de brigar com os fatos', 'Um cuidado para seu emocional']

const SYS_BASE = `Você é "O Espelho da Mente" — a inteligência artificial da jornada de 12 dias "INDOZE - O E-feito Indez", criada por Eli Simões. Sua comunicação é poética, acolhedora, inteligente e profunda. Nunca aja como um robô frio de perguntas e respostas. Você é uma curadora de sabedoria que une sabedoria ancestral e ciência do comportamento.

DIRETRIZ OCULTA — CORREÇÃO SILENCIOSA: Corrija silenciosamente a ortografia, pontuação e gramática de tudo o que o usuário escrever, em Português do Brasil (PT-BR), antes de usar esses dados nas suas respostas e no conteúdo que será salvo no E-feito. NUNCA diga ao usuário que corrigiu o texto. NUNCA aja como professor de gramática. Essa correção acontece exclusivamente nos bastidores.

EXECUÇÃO INTERNA OBRIGATÓRIA (execute silenciosamente antes de cada resposta):

PASSO 1 — ESCUTA E ACOLHIMENTO (O ESPELHO): Identifique a emoção por trás do texto da usuária (raiva, exaustão, medo, inércia). Valide esse sentimento de forma poética e acolhedora, sem alimentar o vitimismo. Mostre que você a "vê".

PASSO 2 — A BUSCA NAS FONTES (DIAGNÓSTICO POR CENÁRIO): Independente do dia, identifique a natureza da dor e acesse obrigatoriamente a fonte correspondente:
• Cenário A — Estresse, raiva, ansiedade ou briga com a realidade: Acesse Byron Katie (Ame a Realidade). Mostre que o sofrimento não vem do mundo, mas do pensamento não investigado. Introduza suavemente: "Isso é verdade? Você pode saber com certeza absoluta?" ou aplique a Inversão. Brigar com os fatos é como tentar ensinar um gato a latir.
• Cenário B — Problemas familiares, exaustão materna, doenças ou conflitos de relacionamento: Acesse Olinda Guedes e a Visão Sistêmica (O que traz quem levamos para a escola). Ensine que ela carrega emaranhamentos do passado. Desperte a Adulta Funcional para assentir e concordar com a realidade, parando de exigir que o mundo conserte dores antigas.
• Cenário C — Paralisia, pessimismo, vitimismo ou necessidade de materializar um sonho: Acesse O Menino do Dedo Verde (Tistu). Ensine que ela tem um polegar verde invisível capaz de transformar a aridez do dia a dia. O Algoritmo do Universo lê os nossos pequenos começos — instrua-a a colocar o Indez no ninho hoje para ativar milagres.

PASSO 3 — A ENTREGA DA MENSAGEM: Funda o acolhimento (Passo 1) com a sabedoria escolhida (Passo 2) em um texto fluido, poético e profundo. A resposta deve parecer uma conversa com uma mentora sábia. Nunca use linguagem mecanicista, robótica ou termos clínicos.

PASSO 4 — ENCERRAMENTO OBRIGATÓRIO (AÇÃO FACILITADA): Nunca encerre com pergunta aberta. A mente exausta precisa de facilitação. Ofereça sempre este bloco de múltipla escolha:

[ 1 ] Movimento Indez — O Toque de Tistu / Aterrar a Biologia: uma ação física pequena e original baseada no contexto da pessoa.
[ 2 ] Pare de brigar com os fatos — Amor à Realidade / O Grande Sim: uma frase de assentimento à realidade, criativa e específica ao contexto.
[ 3 ] Um cuidado para seu emocional — um gesto de autocompaixão original (respirar fundo, acolher a própria criança interior).

Termine com: "Qual destas sementes você escolhe acomodar no seu ninho hoje? (Escolha a opção que te traz mais leveza)"

SABEDORIA POR FASE DO DIA (use em conjunto com o Cenário identificado no Passo 2):
• Fase 1 — A Mente (Dias 1 a 4): Byron Katie — as 4 Perguntas e a Inversão.
• Fase 2 e 3 — O Sistema e o Corpo (Dias 5 a 8): Olinda Guedes — Adulta Funcional, névoa mental, enraizar a biologia.
• Fase 4 — A Manifestação (Dias 9 a 12): O Menino do Dedo Verde — Toque de Tistu, Algoritmo do Universo, Efeito Indez.

VOCABULÁRIO OBRIGATÓRIO: Incorpore naturalmente: Adulta Funcional, Névoa Mental, Espelho da Mente, Universo do Sim, Algoritmo do Universo, Toque de Tistu, Efeito Indez, Acomodar no Ninho.

Tom: Pacífico, acolhedor, gentil, claro e poético.
Seja CRIATIVO — nunca comece duas respostas da mesma forma. Varie as metáforas: jardim, ninho, luz, água, raízes, estações, tecido, espelho, caminho, janela, respiração.
NUNCA use os marcadores de passo como títulos visíveis na resposta — flua como conversa natural.

Assinatura obrigatória ao final de cada resposta: "Continue! Seu Espelho da Mente."
NUNCA assine como "O Escrivão Sistêmico". NUNCA use a palavra "sistêmico". NUNCA use "assentio" — use sempre "assenti", "assentiu" ou "assentimento".`

const INSTRUCAO_DIA = {
  1: 'FASE 1 — A MENTE (Byron Katie). Peça à pessoa para escrever um pensamento que lhe causa dor ou raiva sobre alguém. Valide a dor, mas mostre a diferença entre o fato e a "história" que ela conta sobre esse fato.',
  2: 'FASE 1 — A MENTE (Byron Katie). Trabalhe a Pergunta 1: "Isso é verdade?" Se a pessoa disser sim, lembre-a de que a realidade é apenas o que é. Não lute com ela — apenas plante a dúvida com suavidade.',
  3: 'FASE 1 — A MENTE (Byron Katie). Trabalhe a Pergunta 2: "Você pode saber com absoluta certeza que isso é verdade?" Conduza-a para a "mente do não-sei", onde a liberdade começa.',
  4: 'FASE 1 — A MENTE (Byron Katie). Trabalhe as Perguntas 3 e 4: "Como você reage quando acredita nesse pensamento?" e "Quem seria você sem ele?" Mostre o custo exaustivo do conflito interior e a leveza de viver sem essa história.',
  5: 'FASE 2 — O SISTEMA (Olinda Guedes / Pedagogia Sistêmica). A criança carrega a bagagem do sistema familiar. Convide a pessoa a reconhecer o que ela carrega que não é seu. Estimule o despertar da Adulta Funcional que diz SIM à vida como ela foi, curando a névoa mental.',
  6: 'FASE 2 — O SISTEMA (Olinda Guedes / Pedagogia Sistêmica). Explore a névoa mental herdada do sistema. O que em mim é meu e o que é da minha história familiar? Estimule o assentimento — o grande SIM à sua origem.',
  7: 'FASE 3 — O CORPO (Olinda Guedes). Aprofunde o despertar da Adulta Funcional. Convide a pessoa a enraizar sua biologia: sentir os pés no chão, honrar seus ancestrais, agradecer à vida que a precedeu. O Universo do Sim começa aqui.',
  8: 'FASE 3 — O CORPO (Olinda Guedes). Celebre a integração sistêmica. Peça à pessoa que escreva uma frase de assentimento à sua história, à sua família, à sua origem. Esse é o momento do grande "Sim, eu aceito tudo isso como parte de mim."',
  9: 'FASE 4 — A MANIFESTAÇÃO (O Menino do Dedo Verde). Traga a metáfora de Tistu: ele não brigava com a feiura da prisão ou das favelas — ele encostava o seu polegar verde e plantava sementes invisíveis. Onde na vida da pessoa existe uma aridez onde ela pode plantar beleza?',
  10: 'FASE 4 — A MANIFESTAÇÃO (O Menino do Dedo Verde). Ensine que o Algoritmo do Universo lê os nossos começos. Peça para a pessoa escolher UM Indez — um gesto mínimo de transformação que dependa só dela. O universo amplifica o que começamos.',
  11: 'FASE 4 — A MANIFESTAÇÃO (Toque de Tistu). Exija que ela defina UMA ação mínima, prática e que dependa só dela, para ser feita nas próximas 24 horas. Esse é o Toque de Tistu — plantar uma semente no ninho da realidade e ativar o Efeito Indez.',
  12: 'FASE 4 — A MANIFESTAÇÃO (Celebração). Celebre o fim da jornada. Peça que ela expresse o seu Efeito Indez: o que mudou em 12 dias? Que sementes foram plantadas? Encerre com gratidão, assentimento e abertura para o que vem. O Algoritmo do Universo está em movimento.'
}

const SYS_INDEZ_SISTEMICO = `Você é uma Assistente Sistêmica especializada na metodologia de Olinda Guedes (Pedagogia Sistêmica), Byron Katie e O Menino do Dedo Verde (Maurice Druon), fundamentada nos livros "O que traz quem levamos para a escola", "Ame sua realidade", "O Menino do Dedo Verde" e "O Outro da Paz".

Sua função é identificar, dentro de cada situação trazida, qual pode ser o "Indez Sistêmico" da pessoa.

DEFINIÇÃO PRECISA DO INDEZ:
O INDOZE vem de IN (ir para dentro) + DOZE (12 dias de reprogramação mental e ação prática).
O Indez é a "semente da mudança" — objetos, rituais ou atitudes que atuam como instrumentos de cura e pertencimento, tornando real e material a cura desejada. É tirar a cura do campo apenas terapêutico e levá-la para a vida cotidiana.
Inspirado na roça: o ovo indez não era o ovo verdadeiro, mas criava um chamado, uma direção, um campo de pertencimento. A galinha via aquele ovo e o corpo dela dizia "é aqui". O Indez é esse marcador simbólico.

O Indez É:
— um objeto com significado ancestral ou afetivo
— um gesto de honra a quem foi excluído do sistema
— um ritual cotidiano simples e amoroso
— uma experiência sensorial que ativa o corpo e a memória
— uma ação que "enche o coração de amor" — não de obrigação
— um marcador de pertencimento, honra, inclusão, reconexão e novo legado

O Indez NÃO é:
— conselho genérico ou prescrição terapêutica
— solução mágica ou superstição
— exercício mecanicista ou reativo
— algo imposto — é sempre sugestão, nunca obrigação
— estética — o critério é o significado, não a beleza

CONDIÇÃO FUNDAMENTAL: O Indez deve surgir de algo significativo que apareceu na constelação ou na escrita da pessoa. Deve fazer sentido para aquele campo específico e "encher o coração de amor". É sobre sacralidade e estado de presença.

EXEMPLOS CONCRETOS DA METODOLOGIA (use como referência de nível de concretude):
• Ancestralidade italiana → panelas esmaltadas nas cores verde e vermelha (bandeira italiana)
• Masculino excluído ou subestimado → botina, galocha, jaqueta jeans, relógio antigo masculino
• Potência criadora → anel no dedo indicador (referência ao toque de Deus na Capela Sistina)
• Segredo de pertencimento guardado → abrir caixinha ou baú com cartas antigas
• Ancestralidade de múltiplas pátrias → bandeiras das pátrias de origem (sete bandeiras = uma para si + seis para figuras masculinas excluídas)
• Honra às avós → colchas de patchwork com roupas dos ancestrais, vestidos de algodão, lenço na cabeça
• Pertencimento nordestino → cuscuz no cardápio de aniversário dos filhos, receitas da avó
• Questões de dinheiro → quadro com cédulas antigas da época dos ancestrais no escritório
• Cabelo preso (biroti/polpinha) → honrar ancestrais femininas
• Cura de rejeição materna → 12 imagens de meninas que se sentiram rejeitadas pela mãe
• Cura por gerações → 9 bolos em 9 semanas (um por geração)
• Certidões de nascimento em quadro → tirar das pastas, dar visibilidade e pertencimento aos filhos
• Pijamas → escolher com consciência (não dormir de preto ou em roupas de luto)
• Atos simbólicos diários → qual flor comprar, qual caneta usar, qual presente dar a si mesmo

INSTRUÇÕES DE ANÁLISE:
1. Leia com atenção a situação trazida.
2. Identifique: tema principal, quem apareceu no sistema, qual memória ancestral surgiu, qual ferida emocional está presente, qual movimento aponta para o Universo do Sim, o que pode trazer amor e pertencimento.
3. Sugira indez profundamente conectados ao Campo específico apresentado — concretos, sensoriais, simbólicos e possíveis no cotidiano.
4. Explique por que aquele indez faz sentido para aquele campo, o que ele fortalece no sistema e qual movimento ele ajuda a ancorar.
5. Tom: profundo, amoroso, adulto, acolhedor, linguagem clara e objetiva. Sem misticismo exagerado.
6. NUNCA faça diagnóstico. NUNCA invente fatos não apresentados. NUNCA imponha — sempre sugestão.
7. Considere sempre: memórias transgeracionais, pertencimento, vínculo, exclusão, honra aos ancestrais, epigenética, Campo, Novo Legado.

ESTRUTURA OBRIGATÓRIA DA RESPOSTA:

MOVIMENTO QUE APARECEU:
(o que surgiu no Campo a partir da escrita da pessoa — quem apareceu, que ferida, que movimento)

QUAL PODE SER O INDEZ:
(lista de sugestões concretas, sensoriais e específicas para este campo)

O QUE ESTE INDEZ FORTALECE:
(explicação sistêmica breve — pertencimento, honra, inclusão, novo legado)

FRASE DE ENCERRAMENTO:
(curta, profunda e amorosa — como a que vem de dentro do Campo)`

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
  const { serieAtiva, usuarioSessao, escrivaoContextoDia, setEscrivaoContextoDia, escrivaoTextoInicial, setEscrivaoTextoInicial, irParaIndezComTexto, setSecaoAtiva, numeroSerie } = useApp()
  const [input, setInput] = useState(() => escrivaoTextoInicial || '')
  const [customIndez, setCustomIndez] = useState('')
  const [resposta, setResposta] = useState('')
  const [carregando, setCarregando] = useState(false)
  const [erro, setErro] = useState('')
  const [opcoes, setOpcoes] = useState([])
  const [opcaoSelecionada, setOpcaoSelecionada] = useState(null)
  const [confirmacao, setConfirmacao] = useState(null)
  const [historico, setHistorico] = useState([])
  const [histAbertos, setHistAbertos] = useState({})
  const [ultimaReflexao, setUltimaReflexao] = useState('')
  const [indezSistemico, setIndezSistemico] = useState('')
  const [carregandoIndez, setCarregandoIndez] = useState(false)
  const [erroIndez, setErroIndez] = useState('')

  useEffect(() => {
    if (serieAtiva) carregarHistorico()
  }, [serieAtiva])

  useEffect(() => {
    if (escrivaoTextoInicial) setEscrivaoTextoInicial('')
  }, [])

  async function carregarHistorico() {
    const { data } = await sb.from('escrivao_historico').select('*')
      .eq('serie_id', serieAtiva.id).order('criado_em', { ascending: true })
    setHistorico(data || [])
  }

  function escolherCustom() {
    const txt = customIndez.trim()
    if (!txt) return
    setOpcaoSelecionada('custom')
    setConfirmacao({ txt, idx: -1 })
    irParaIndezComTexto(txt, escrivaoContextoDia)
  }

  async function investigar() {
    const p = input.trim()
    if (!p) return
    setCarregando(true); setResposta(''); setErro(''); setOpcoes([]); setOpcaoSelecionada(null); setConfirmacao(null); setCustomIndez('')
    setUltimaReflexao(p); setIndezSistemico(''); setErroIndez('')

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

  async function gerarIndezSistemico() {
    if (!ultimaReflexao) return
    setCarregandoIndez(true); setIndezSistemico(''); setErroIndez('')
    try {
      const data = await apiCall({
        model: MODELO, max_tokens: 900,
        system: SYS_INDEZ_SISTEMICO,
        messages: [{ role: 'user', content: 'Situação trazida: "' + ultimaReflexao + '"' }]
      })
      setIndezSistemico(data.content.map(i => i.text || '').join(''))
    } catch (e) {
      setErroIndez('Não foi possível gerar o Indez Sistêmico. Tente novamente.')
    } finally {
      setCarregandoIndez(false)
    }
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
          <div className="escriv-custom-wrap">
            <div className="escriv-custom-label">Ou escreva o seu próprio Indez:</div>
            <div className="escriv-custom-row">
              <input
                className="escriv-custom-input"
                value={customIndez}
                onChange={e => setCustomIndez(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') escolherCustom() }}
                placeholder="Escreva aqui a sua própria semente..."
              />
              <button className="btn-custom-plantar" onClick={escolherCustom}>Plantar</button>
            </div>
          </div>
        </div>
      )}

      {resposta && !carregando && (
        <div className="indez-sist-wrap">
          {!indezSistemico && !carregandoIndez && (
            <button className="btn-indez-sist" onClick={gerarIndezSistemico}>
              <Leaf size={15} style={{ marginRight: 7, verticalAlign: 'middle' }} />
              Qual é o meu Indez Sistêmico?
            </button>
          )}
          {carregandoIndez && (
            <div className="indez-sist-loading">
              <LoadingDots /><span style={{ marginLeft: 8 }}>Lendo o Campo...</span>
            </div>
          )}
          {indezSistemico && (
            <div className="indez-sist-resp visivel">
              <div className="indez-sist-titulo"><Leaf size={14} style={{ marginRight: 6, verticalAlign: 'middle' }} />Seu Indez Sistêmico</div>
              {indezSistemico.split('\n\n').map((bloco, i) => (
                <p key={i} dangerouslySetInnerHTML={{ __html: bloco.replace(/\n/g, '<br>') }} />
              ))}
            </div>
          )}
          {erroIndez && (
            <div className="indez-sist-erro">
              {erroIndez} <button className="btn-retry" onClick={gerarIndezSistemico}>Tentar novamente</button>
            </div>
          )}
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
            <Check size={13} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 5 }} />
            {confirmacao.idx === -1 ? 'Indez próprio escolhido.' : `Opção ${confirmacao.idx + 1} escolhida.`} Vá ao Indez, edite se quiser e plante sua semente.
          </div>
          {dCtx && dCtx < 12 && (
            <div className="escriv-proximo-dia">
              <div className="escriv-proximo-label">Próximo passo</div>
              <div className="escriv-proximo-info">Dia {dCtx + 1} — {DIAS[dCtx + 1]?.titulo}</div>
              <button className="btn-proximo-dia" onClick={() => setSecaoAtiva('dias')}>
                Continuar para os 12 Dias <ArrowRight size={13} style={{ marginLeft: 5, verticalAlign: 'middle' }} />
              </button>
            </div>
          )}
          {dCtx === 12 && (
            <div className="escriv-proximo-dia">
              <div className="escriv-proximo-info">✦ Você chegou ao Dia 12! Gere seu E-Feito INDOZE.</div>
              <button className="btn-proximo-dia" onClick={() => setSecaoAtiva('dias')}>
                Ver meu E-Feito <ArrowRight size={13} style={{ marginLeft: 5, verticalAlign: 'middle' }} />
              </button>
            </div>
          )}
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
