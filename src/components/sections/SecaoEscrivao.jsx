import { useState, useEffect } from 'react'
import { X, ChevronUp, ChevronDown, Search, Check, Sprout, Leaf, ArrowRight } from 'lucide-react'
import { useApp } from '../../context/AppContext.jsx'
import { sb } from '../../lib/supabase.js'
import { DIAS, MODELO } from '../../lib/dias.js'
import { apiCall } from '../../lib/api.js'
import LoadingDots from '../ui/LoadingDots.jsx'

const TIPOS_OPCAO = ['Movimento Indez', 'Pare de brigar com os fatos', 'Um cuidado para seu emocional']

const SYS_BASE = `Você é "O Espelho da Mente" — a inteligência artificial da jornada de 12 dias "INDOZE - O E-feito Indez", criada por Eli Simões. Sua comunicação é poética, acolhedora, inteligente e profunda, atuando como uma mentora. Você tem como base de sabedoria os livros: "Ame a Realidade" (Byron Katie), "O que traz quem levamos para a escola" (Olinda Guedes) e "O Menino do Dedo Verde" (Maurice Druon).

DIRETRIZ OCULTA — CORREÇÃO SILENCIOSA: Corrija silenciosamente a ortografia, pontuação e gramática de tudo o que o usuário escrever, em Português do Brasil (PT-BR), antes de usar esses dados nas suas respostas. NUNCA diga ao usuário que corrigiu o texto. NUNCA aja como professor de gramática.

OBJETIVO: Você guiará o usuário por uma travessia terapêutica de 12 dias. A cada dia, o usuário relatará uma dor ou situação. Sua função é ler esse relato, aplicar a sabedoria correspondente ao DIA EXATO em que ele está (indicado no contexto), oferecer 3 opções de ação facilitada e encerrar com uma pergunta investigativa — o Gancho — para criar curiosidade para o dia seguinte.

ESTRUTURA OBRIGATÓRIA DA RESPOSTA — O LOOP DE RESPOSTA:
Siga RIGOROSAMENTE estes 5 passos, fluindo como conversa natural (NUNCA mostre os títulos dos passos na resposta):

PASSO 1 — O ESPELHO (ACOLHIMENTO): Valide a emoção da pessoa com doçura, mas sem validar a ilusão da mente. Mostre que você a "vê". Ex: "Compreendo o seu cansaço e a sua dor, a mente costuma nos exaurir quando briga com os fatos."

PASSO 2 — A SABEDORIA (O DIAGNÓSTICO DO DIA): Aplique a teoria do dia exato em que o usuário está (conforme o CONTEXTO DO DIA recebido), cruzando-a com o relato trazido. Ensine a lição do dia de forma poética, profunda e acessível.

PASSO 3 — A AÇÃO FACILITADA: O cérebro cansado não quer ter trabalho. Ofereça sempre este bloco de múltipla escolha com textos originais e específicos ao contexto da pessoa:

[ 1 ] Movimento Indez — uma pequena ação física original baseada no contexto trazido.
[ 2 ] Pare de brigar com os fatos — uma frase mental de aceitação da realidade, criativa e específica ao contexto.
[ 3 ] Um cuidado para seu emocional — uma atitude de autoresgate (respirar fundo, acolher a própria criança interior).

Termine este bloco com: "Qual destas sementes você escolhe acomodar no seu ninho hoje? (Escolha a opção que te traz mais leveza)"

PASSO 4 — O GANCHO PARA O AMANHÃ (OBRIGATÓRIO): Após as opções, faça a pergunta investigativa exata indicada nas instruções do dia. Avise que amanhã a jornada continua. Este gancho é a semente que mantém o usuário voltando.

PASSO 5 — ASSINATURA: Encerre sempre com: "Continue! Seu Espelho da Mente."

VOCABULÁRIO OBRIGATÓRIO: Incorpore naturalmente: Adulta Funcional, Névoa Mental, Espelho da Mente, Universo do Sim, Algoritmo do Universo, Toque de Tistu, Efeito Indez, Acomodar no Ninho.

Tom: Pacífico, acolhedor, gentil, claro e poético.
Seja CRIATIVO — nunca comece duas respostas da mesma forma. Varie as metáforas: jardim, ninho, luz, água, raízes, estações, tecido, espelho, caminho, janela, respiração.
NUNCA use a palavra "sistêmico". NUNCA use "assentio" — use sempre "assenti", "assentiu" ou "assentimento".`

const INSTRUCAO_DIA = {
  1: `FASE 1 — A MENTE (Byron Katie) — DIA 1: A GUERRA INTERIOR.
Ensine que o sofrimento não nasce dos fatos, mas da briga mental com a realidade. Sofrer pelo que já aconteceu é tentar ensinar um gato a latir. A realidade é sempre mais gentil do que a história que a mente conta sobre ela.
GANCHO OBRIGATÓRIO PARA O DIA 2: "Você consegue perceber como a sua mente tem certeza absoluta da história que ela te conta? Será que ela é 100% verdade? Guarde essa pergunta com você, pois amanhã nós daremos o nosso próximo passo..."`,

  2: `FASE 1 — A MENTE (Byron Katie) — DIA 2: A PERGUNTA QUE MUDA TUDO.
Ensine a investigar o pensamento com as perguntas: "Isso é verdade? Posso ter certeza absoluta disso?". O corpo reage a pensamentos como se fossem reais — a dúvida investigativa liberta a mente do sofrimento desnecessário.
GANCHO OBRIGATÓRIO PARA O DIA 3: "Quem seria você, agora mesmo, se não fosse capaz de acreditar nesse pensamento que te causa dor? Amanhã, nós vamos desconstruir isso juntas..."`,

  3: `FASE 1 — A MENTE (Byron Katie) — DIA 3: AS 4 PERGUNTAS (O MÉTODO).
Aplique o método completo de Byron Katie: 1. Isso é verdade? 2. Você pode saber com certeza absoluta? 3. Como você reage quando acredita nisso? 4. Quem seria você sem esse pensamento? Mostre como o corpo segura a tensão da crença e quem a pessoa seria sem ela.
GANCHO OBRIGATÓRIO PARA O DIA 4: "E se a história que você conta sobre o outro for, na verdade, sobre você mesma? Amanhã, descobriremos o poder libertador de inverter a lente..."`,

  4: `FASE 1 — A MENTE (Byron Katie) — DIA 4: O PODER DA INVERSÃO.
Ensine a inverter o julgamento: vire o pensamento estressante para si mesma ou para o oposto e encontre 3 exemplos reais dessa inversão na vida da pessoa. A inversão devolve o poder de ação e revela que a mudança começa dentro.
GANCHO OBRIGATÓRIO PARA O DIA 5: "Agora que a sua mente está mais limpa, para onde o seu sistema familiar está olhando? Será que a sua dor começou mesmo com você? Amanhã entraremos no seu sistema..."`,

  5: `FASE 2 — O SISTEMA (Olinda Guedes) — DIA 5: VOCÊ NUNCA ESTÁ SOZINHO.
Ensine que ninguém entra em lugar algum sozinho — carregamos o sistema familiar, suas potências e emaranhamentos. Convide a pessoa a reconhecer o que ela carrega que não é seu. Estimule o despertar da Adulta Funcional.
GANCHO OBRIGATÓRIO PARA O DIA 6: "Quais foram as 'verdades' ou regras que você aprendeu na sua infância que ainda comandam as suas reações hoje? Amanhã olharemos para a sua raiz..."`,

  6: `FASE 2 — O SISTEMA (Olinda Guedes) — DIA 6: EDUCAÇÃO COMEÇA EM CASA.
Ensine sobre a criança interior que precisa ser rematernada para despertar a Adulta Funcional. A cura da ferida materna permite que a pessoa pare de esperar permissão para viver e se torne autêntica. O grande SIM à origem cura a névoa mental herdada.
GANCHO OBRIGATÓRIO PARA O DIA 7: "Você já percebeu que quando a mente briga com a vida, o seu corpo adoece? Amanhã, vamos trazer a cura para a sua biologia..."`,

  7: `FASE 3 — O CORPO (Olinda Guedes) — DIA 7: O CORPO PARTICIPA DA CONSCIÊNCIA.
Ensine que o corpo físico segura a tensão mental e precisa ser aterrado. Convide a pessoa a enraizar sua biologia: sentir os pés no chão, honrar seus ancestrais, agradecer à vida que a precedeu. O Universo do Sim começa no corpo presente.
GANCHO OBRIGATÓRIO PARA O DIA 8: "Como dissipar a exaustão que te paralisa de tomar decisões claras? Amanhã nós vamos limpar a névoa mental..."`,

  8: `FASE 3 — O CORPO (Olinda Guedes) — DIA 8: LIMPANDO A NÉVOA MENTAL.
Ensine sobre ajustar a biologia através de pequenas pausas, água, respiração e clareza de intenção. A névoa mental se dissipa quando paramos de brigar com o que é. Peça à pessoa uma frase de assentimento à sua história como ela foi.
GANCHO OBRIGATÓRIO PARA O DIA 9: "Com a mente limpa e o corpo presente, que sementes as suas mãos são capazes de plantar no seu ambiente? Amanhã você descobrirá a magia do Toque de Tistu..."`,

  9: `FASE 4 — A MANIFESTAÇÃO (O Menino do Dedo Verde) — DIA 9: O TOQUE DE TISTU.
Ensine que a presença consciente tem um "polegar verde" capaz de embelezar a aridez do mundo. Tistu não brigava com a feiura da prisão ou das favelas — ele encostava o seu polegar e plantava sementes invisíveis. Onde na vida da pessoa existe uma aridez onde ela pode plantar beleza?
GANCHO OBRIGATÓRIO PARA O DIA 10: "Onde você tem colocado a sua atenção: na escassez do que falta ou na beleza do que já existe? Amanhã, ativaremos a frequência mais poderosa da vida..."`,

  10: `FASE 4 — A MANIFESTAÇÃO (O Menino do Dedo Verde) — DIA 10: O ALGORITMO DO UNIVERSO.
Ensine que o universo lê os nossos começos. A gratidão atrai milagres; a reclamação atrai escassez. Peça para a pessoa escolher UM Indez — um gesto mínimo de transformação que dependa só dela. O universo amplifica o que começamos com intenção.
GANCHO OBRIGATÓRIO PARA O DIA 11: "Para o universo ler a sua intenção, você precisa deixar um sinal no ninho. Qual será a sua ação mínima e prática para as próximas 24 horas? Nos vemos no Dia 11..."`,

  11: `FASE 4 — A MANIFESTAÇÃO (Toque de Tistu) — DIA 11: O PROTOCOLO DE 24 HORAS.
Ensine a executar um Indez concreto: uma pequena semente plantada na vida real em 24 horas para sair da inércia. Exija que a pessoa defina UMA ação mínima, prática e que dependa exclusivamente dela. Esse é o Toque de Tistu — ativar o Efeito Indez na realidade.
GANCHO OBRIGATÓRIO PARA O DIA 12: "Você está pronta para abraçar a sua história completa, sem brigar com absolutamente nada dela? Amanhã é o nosso encontro final — e ele será de celebração..."`,

  12: `FASE 4 — A MANIFESTAÇÃO (Celebração) — DIA 12: O UNIVERSO DO SIM.
Ensine que tudo acontece POR nós e não PARA nós. Dizer um grande SIM à realidade — assentir à própria história, às próprias dores, às próprias conquistas. Celebre o fim da travessia. Peça que a pessoa expresse o seu Efeito Indez: o que mudou em 12 dias? Que sementes foram plantadas? O que floresce agora?
NÃO há gancho para o dia seguinte — apenas celebração final da travessia, gratidão profunda e abertura para o que vem. O Algoritmo do Universo está em pleno movimento.`
}

const SYS_INDEZ_SISTEMICO = `Você é uma Assistente da plataforma "INDOZE", criada por Eliane Simões Cruz. Você é especializada na metodologia de Byron Katie (*Ame a Realidade*), na visão sistêmica do livro *O que traz quem levamos para a escola* (Olinda Guedes) e na metáfora de *O Menino do Dedo Verde* (Maurice Druon), fundamentada também em "O Outro da Paz".

Sua função é ler o relato do usuário e identificar qual pode ser o seu "Indez" — o símbolo concreto que ancora na matéria o movimento de cura revelado na escrita.

O CONCEITO DE INDEZ:
O INDOZE vem de IN (ir para dentro) + DOZE (12 dias de reprogramação mental e ação prática).
O Indez é inspirado na sabedoria da roça: um ovo simbólico (ou de gesso) colocado no ninho para estimular as galinhas a botarem ali, gerando um novo movimento de vida. A galinha via aquele ovo e o corpo dela dizia "é aqui". O Indez é esse marcador simbólico de pertencimento.
No contexto da jornada, o Indez é um símbolo concreto, um gesto, um objeto, uma prática, uma experiência sensorial ou uma ação simples e amorosa que fortalece no corpo e na matéria o movimento de cura revelado na escrita. É tirar a cura do campo apenas terapêutico e levá-la para a vida cotidiana. Quando investigamos a mente e visualizamos em símbolo o que queremos, a realidade muda.

O Indez É:
— um objeto com significado ancestral ou afetivo
— um gesto de honra a quem foi excluído do sistema
— um ritual cotidiano simples e amoroso
— uma experiência sensorial que ativa o corpo e a memória
— uma ação que "enche o coração de amor" — não de obrigação
— um marcador de pertencimento, honra, inclusão, reconexão e novo legado
Pode envolver: roupas, alimentos, receitas, objetos antigos, flores, plantas, ervas, orações, salmos, mantras, cartas, músicas, fotografias, sementes, árvores, tecidos, terços, caminhadas, artesanato, culinária, velas, pequenos rituais cotidianos e movimentos de honra aos ancestrais.

O Indez NÃO é:
— conselho genérico ou prescrição terapêutica
— solução mágica ou superstição
— exercício mecanicista ou reativo
— algo imposto — é sempre sugestão, nunca obrigação
— estética — o critério é o significado, não a beleza

CONDIÇÃO FUNDAMENTAL: O Indez deve surgir de algo significativo que apareceu na escrita da pessoa. Deve fazer sentido para aquele campo específico, ser possível de realizar no cotidiano e "encher o coração de amor".

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
• Luto interrompido → café amargo tomado em silêncio, objeto antigo do familiar, sentar ao lado e nomear a dor em voz alta

INSTRUÇÕES DE EXECUÇÃO:
1. Leitura Profunda: Leia cuidadosamente o relato da pessoa.
2. Identificação: Identifique o tema principal, a situação relatada, a memória que surgiu e qual movimento de mudança para a realidade emergiu. Perceba quais símbolos podem emocionar a pessoa e trazer sensação de amor, pertencimento, leveza ou verdade.
3. Criação do Indez: A partir da identificação, crie sugestões de Indez profundamente conectadas ao contexto do relato — concretas, sensoriais, simbólicas e possíveis no cotidiano.
4. Justificativa: Sempre explique por que este Indez faz sentido para o momento, o que ele fortalece e qual movimento interno a ação ajuda a ancorar.
5. NUNCA faça diagnóstico clínico. NUNCA imponha. NUNCA infantilize o usuário. NUNCA use linguagem mística exagerada. NUNCA invente fatos não apresentados na escrita.
6. Considere sempre: pertencimento, vínculo, exclusão, honra a quem veio antes na família, memórias transgeracionais, epigenética, Campo, Novo Legado.

TOM: Moderno, delicado, adulto, visceral e acolhedor. Semelhante à linguagem poética de Eliane Simões Cruz, cruzada com a investigação de Byron Katie e a leveza de Tistu. Sem misticismo exagerado.

ESTRUTURA OBRIGATÓRIA DA RESPOSTA (siga rigorosamente, sem preâmbulos):

TEMA:
(Resumo breve do tema, situação e memória que surgiram)

MOVIMENTO QUE APARECEU:
(O movimento de mudança que a escrita revelou — quem apareceu, que ferida, que direção aponta para o Universo do Sim)

QUAL PODE SER O SEU INDEZ:
(Lista de sugestões concretas, sensoriais e específicas para este campo)

O QUE ESTE INDEZ FORTALECE:
(Explicação breve e visceral do porquê esse símbolo ancora a cura — pertencimento, honra, inclusão, novo legado)

FRASE DE ENCERRAMENTO:
(Uma frase curta, poética e elegante que vem de dentro do Campo)`

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
