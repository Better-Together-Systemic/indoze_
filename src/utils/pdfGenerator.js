import { jsPDF } from 'jspdf'
import { DIAS, EMOJIS } from '../lib/dias.js'

export async function gerarPDFEfeito({ perfilUsuario, usuarioSessao, serieAtiva, sb }) {
  try {
    const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' })
    const W = 210, H = 297, ML = 18, MR = 18, TW = W - ML - MR

    const OURO     = [180, 125, 20]
    const OURO_BG  = [255, 248, 230]
    const OURO_MED = [212, 160, 50]
    const VERDE    = [34, 139, 80]
    const VERDE_BG = [236, 252, 243]
    const AZUL     = [37, 99, 180]
    const AZUL_BG  = [237, 244, 255]
    const LARANJA  = [200, 80, 40]
    const LAR_BG   = [255, 242, 236]
    const CINZA_ESC = [30, 30, 28]
    const CINZA_MED = [90, 90, 85]
    const CINZA_CLR = [200, 200, 196]
    const CINZA_BG  = [246, 246, 244]
    const BRANCO   = [255, 255, 255]
    const PRETO    = [20, 20, 18]
    const INSTA    = [150, 50, 180]

    const nome         = perfilUsuario?.nome || 'Participante'
    const primeiroNome = nome.split(' ')[0]
    const email        = perfilUsuario?.email || usuarioSessao?.email || ''
    const insta        = perfilUsuario?.instagram || ''
    const dataHoje     = new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })
    const nomeArquivo  = `${primeiroNome}-E-Feito-INDOZE-12-Dias.pdf`

    let reflexoes = [], indezItens = [], escrivaoHist = []
    if (serieAtiva) {
      const [r1, r2, r3] = await Promise.all([
        sb.from('reflexoes').select('dia,texto').eq('serie_id', serieAtiva.id).order('dia'),
        sb.from('indez').select('dia,texto,numero_semente').eq('serie_id', serieAtiva.id).order('dia').order('numero_semente'),
        sb.from('escrivao_historico').select('dia_contexto,pergunta,resposta').eq('serie_id', serieAtiva.id).order('criado_em', { ascending: true })
      ])
      reflexoes    = r1.data || []
      indezItens   = r2.data || []
      escrivaoHist = r3.data || []
    }

    const totalRef = reflexoes.filter(r => r.texto?.trim()).length
    const totalSem = indezItens.length
    const totalInt = escrivaoHist.length
    const pct      = Math.round((totalRef / 12) * 100)

    const fill   = (...rgb) => doc.setFillColor(...rgb)
    const stroke = (...rgb) => doc.setDrawColor(...rgb)
    const txt    = (...rgb) => doc.setTextColor(...rgb)
    const font   = (f, s, sz) => { doc.setFont(f, s); doc.setFontSize(sz) }
    const box    = (x, y, w, h, r = 0) => { if (r) doc.roundedRect(x, y, w, h, r, r, 'F'); else doc.rect(x, y, w, h, 'F') }

    const wrapTxt = (text, x, y, maxW, lh) => {
      const lines = doc.splitTextToSize(String(text || '—'), maxW)
      doc.text(lines, x, y)
      return y + lines.length * lh
    }

    const addRodape = (pag) => {
      fill(...CINZA_BG); box(0, H - 14, W, 14)
      stroke(...CINZA_CLR); doc.setLineWidth(0.2); doc.line(0, H - 14, W, H - 14)
      font('helvetica', 'normal', 6.5); txt(...CINZA_MED)
      doc.text('Better Together Systemic  ·  Eliane Simões Cruz', ML, H - 8)
      txt(...INSTA)
      doc.textWithLink('@elianesimoescruz', W / 2, H - 8, { align: 'center', url: 'https://instagram.com/elianesimoescruz' })
      txt(...CINZA_MED)
      doc.text(`Pág. ${pag}`, W - ML, H - 8, { align: 'right' })
    }

    const addHeader = (label) => {
      fill(...BRANCO); box(0, 0, W, 14)
      stroke(...CINZA_CLR); doc.setLineWidth(0.2); doc.line(0, 14, W, 14)
      font('helvetica', 'bold', 7); txt(...OURO)
      doc.text('INDOZE — 12 DIAS POR DENTRO', ML, 9)
      font('helvetica', 'normal', 7); txt(...CINZA_MED)
      doc.text(label, W - ML, 9, { align: 'right' })
    }

    const faseCor = { 'A Mente': LARANJA, 'O Sistema': VERDE, 'O Corpo': AZUL, 'A Manifestação': OURO_MED }
    const faseBg  = { 'A Mente': LAR_BG,  'O Sistema': VERDE_BG, 'O Corpo': AZUL_BG, 'A Manifestação': OURO_BG }

    // PÁG 1 — CAPA
    fill(...BRANCO); box(0, 0, W, H)
    fill(...OURO); box(0, 0, W, 52)
    stroke(255, 255, 255); doc.setLineWidth(0.8)
    doc.line(W - 40, 6, W - 30, 18); doc.line(W - 30, 18, W - 20, 6)
    doc.line(W - 30, 6, W - 30, 18)
    doc.line(W - 52, 6, W - 42, 18); doc.line(W - 42, 18, W - 32, 6)

    font('helvetica', 'bold', 8); txt(255, 255, 255)
    doc.text('BETTER TOGETHER SYSTEMIC', ML, 14)
    font('helvetica', 'normal', 7)
    doc.text('Eliane Simões Cruz · Psicopedagoga e Terapeuta', ML, 20)
    font('helvetica', 'bold', 34); txt(255, 255, 255)
    doc.text('INDOZE', ML, 44)
    font('helvetica', 'normal', 10)
    doc.text('12 DIAS POR DENTRO', ML + 1, 51)

    const nomeY = 68
    font('helvetica', 'normal', 10); txt(...CINZA_MED)
    doc.text('Este E-Feito pertence a', ML, nomeY)
    font('helvetica', 'bold', 26); txt(...PRETO)
    doc.text(nome, ML, nomeY + 10)
    stroke(...OURO); doc.setLineWidth(1.5)
    doc.line(ML, nomeY + 14, ML + doc.getTextWidth(nome), nomeY + 14)
    font('helvetica', 'normal', 9); txt(...CINZA_MED)
    doc.text(`Concluído em ${dataHoje}`, ML, nomeY + 22)

    const cy = 102
    fill(...CINZA_BG); box(ML, cy, TW, 36, 3)
    stroke(...CINZA_CLR); doc.setLineWidth(0.3)
    doc.roundedRect(ML, cy, TW, 36, 3, 3, 'S')
    font('helvetica', 'bold', 8); txt(...CINZA_MED)
    doc.text('SUA JORNADA EM NÚMEROS', ML + 8, cy + 9)

    const stats = [
      { v: String(totalRef), l: 'Dias refletidos',          c: AZUL    },
      { v: String(totalSem), l: 'Sementes plantadas',        c: VERDE   },
      { v: String(totalInt), l: 'Interações com o Espelho',  c: OURO    },
      { v: `${pct}%`,        l: 'Taxa de conclusão',         c: LARANJA }
    ]
    stats.forEach((s, i) => {
      const sx = ML + 8 + i * 42
      fill(...s.c); box(sx, cy + 13, 3, 18, 1)
      font('helvetica', 'bold', 16); txt(...s.c)
      doc.text(s.v, sx + 7, cy + 24)
      font('helvetica', 'normal', 6.5); txt(...CINZA_MED)
      const sl = doc.splitTextToSize(s.l, 35)
      doc.text(sl, sx + 7, cy + 28)
    })

    fill(...OURO_BG); box(ML, cy + 44, TW, 28, 3)
    stroke(...OURO_MED); doc.setLineWidth(0.3)
    doc.roundedRect(ML, cy + 44, TW, 28, 3, 3, 'S')
    fill(...OURO_MED); box(ML, cy + 44, 3, 28, 1)
    font('helvetica', 'italic', 10); txt(...CINZA_ESC)
    doc.text('"Parei de brigar com os fatos e executei', ML + 8, cy + 55)
    doc.text('coisas diferentes em 12 dias."', ML + 8, cy + 63)
    font('helvetica', 'normal', 7.5); txt(...OURO)
    doc.text('— Método INDOZE · Better Together Systemic', ML + 8, cy + 68)

    const fY = cy + 80
    font('helvetica', 'bold', 8); txt(...CINZA_MED)
    doc.text('OS 4 MOMENTOS DA JORNADA', ML, fY)
    const fases = [
      { n: 'A Mente',      d: 'Dias 1–4',   c: LARANJA, bg: LAR_BG   },
      { n: 'O Sistema',    d: 'Dias 5–6',   c: VERDE,   bg: VERDE_BG },
      { n: 'O Corpo',      d: 'Dias 7–9',   c: AZUL,    bg: AZUL_BG  },
      { n: 'Manifestação', d: 'Dias 10–12', c: OURO_MED,bg: OURO_BG  }
    ]
    fases.forEach((f, i) => {
      const fx = ML + i * 44
      fill(...f.bg); box(fx, fY + 5, 40, 22, 2)
      fill(...f.c);  box(fx, fY + 5, 40, 4, 2)
      font('helvetica', 'bold', 8); txt(...f.c)
      doc.text(f.n, fx + 20, fY + 16, { align: 'center' })
      font('helvetica', 'normal', 7); txt(...CINZA_MED)
      doc.text(f.d, fx + 20, fY + 22, { align: 'center' })
    })

    const bY = fY + 36
    font('helvetica', 'normal', 7); txt(...CINZA_MED)
    doc.text(`Progresso: ${totalRef} de 12 dias registrados`, ML, bY)
    fill(...CINZA_CLR); box(ML, bY + 3, TW, 4, 2)
    fill(...OURO_MED); box(ML, bY + 3, TW * (totalRef / 12), 4, 2)

    fill(...CINZA_BG); box(ML, bY + 14, TW, 30, 3)
    font('helvetica', 'bold', 9); txt(...PRETO)
    doc.text(`${primeiroNome}, você fez algo raro:`, ML + 8, bY + 24)
    font('helvetica', 'normal', 9); txt(...CINZA_MED)
    doc.text('escolheu olhar para dentro e agiu. Cada semente', ML + 8, bY + 31)
    doc.text('plantada aqui é a prova de que o universo já leu', ML + 8, bY + 37)
    doc.text('o seu início. O E-Feito é seu — criado por você.', ML + 8, bY + 43)

    stroke(...CINZA_CLR); doc.setLineWidth(0.2); doc.line(ML, H - 20, W - ML, H - 20)
    font('helvetica', 'bold', 7); txt(...OURO)
    doc.text('BETTER TOGETHER SYSTEMIC', ML, H - 14)
    font('helvetica', 'normal', 7); txt(...CINZA_MED)
    doc.text('Eliane Simões Cruz · Psicopedagoga e Terapeuta', ML, H - 9)
    txt(...INSTA)
    doc.textWithLink('@elianesimoescruz', W - ML, H - 9, { align: 'right', url: 'https://instagram.com/elianesimoescruz' })

    // PÁG 2 — MAPA
    doc.addPage(); fill(...BRANCO); box(0, 0, W, H)
    addHeader(`${primeiroNome} · Mapa da Jornada`)

    let y = 24
    font('helvetica', 'bold', 18); txt(...PRETO)
    doc.text('Sua Jornada Completa', ML, y); y += 5
    stroke(...OURO_MED); doc.setLineWidth(1); doc.line(ML, y, ML + 60, y); y += 8
    font('helvetica', 'normal', 9); txt(...CINZA_MED)
    doc.text(`${nome}  ·  ${dataHoje}`, ML, y); y += 10

    for (let d = 1; d <= 12; d++) {
      const col   = (d - 1) % 2
      const row   = Math.floor((d - 1) / 2)
      const dx    = ML + col * (TW / 2 + 2)
      const dy    = y + row * 22
      const dInfo = DIAS[d]
      const cor   = faseCor[dInfo.fase] || OURO_MED
      const bg    = faseBg[dInfo.fase]  || OURO_BG
      const ref   = reflexoes.find(r => r.dia === d)
      const feito = ref?.texto?.trim()
      const semD  = indezItens.filter(x => x.dia === d).length

      fill(...bg); box(dx, dy, TW / 2 - 2, 18, 2)
      fill(...cor); box(dx, dy, 4, 18, 1)
      font('helvetica', 'bold', 7.5); txt(...cor)
      doc.text(`Dia ${d}`, dx + 7, dy + 7)
      font('helvetica', 'normal', 7); txt(...PRETO)
      const tLines = doc.splitTextToSize(dInfo.titulo, TW / 2 - 20)
      doc.text(tLines[0], dx + 7, dy + 12)
      if (feito) { fill(...VERDE); box(dx + TW / 2 - 10, dy + 4, 8, 10, 2); font('helvetica', 'bold', 6); txt(255, 255, 255); doc.text('✓', dx + TW / 2 - 6.5, dy + 10) }
      else       { fill(...CINZA_CLR); box(dx + TW / 2 - 10, dy + 4, 8, 10, 2); font('helvetica', 'normal', 6); txt(...CINZA_MED); doc.text('—', dx + TW / 2 - 6.5, dy + 10) }
      if (semD) { font('helvetica', 'normal', 6); txt(...VERDE); doc.text(`${semD}🌱`, dx + TW / 2 - 10, dy + 17) }
    }
    y += 6 * 22 + 6

    fill(...CINZA_BG); box(ML, y, TW, 42, 3)
    font('helvetica', 'bold', 8); txt(...PRETO)
    doc.text('O Método INDOZE em 3 pilares', ML + 8, y + 9)
    const pilares = [
      { t: '1 · A Mente',  d: 'The Work de Byron Katie. Quando paramos de brigar com a realidade, o sofrimento dissolve.', c: LARANJA },
      { t: '2 · O Sistema',d: 'Bert Hellinger & Olinda Guedes. Nossa história familiar nos forma — e pode nos libertar.',   c: VERDE   },
      { t: '3 · A Ação',   d: 'O Efeito Indez. Uma ação mínima em 24h tem mais poder que mil intenções.',                  c: OURO_MED}
    ]
    pilares.forEach((p, i) => {
      font('helvetica', 'bold', 7.5); txt(...p.c)
      doc.text(p.t, ML + 8, y + 17 + i * 9)
      font('helvetica', 'normal', 7); txt(...CINZA_MED)
      doc.text(p.d, ML + 8 + 28, y + 17 + i * 9)
    })
    addRodape(2)

    // PÁG 3–14 — UM DIA POR PÁGINA
    for (let dia = 1; dia <= 12; dia++) {
      doc.addPage(); fill(...BRANCO); box(0, 0, W, H)

      const dInfo  = DIAS[dia]
      const cor    = faseCor[dInfo.fase] || OURO_MED
      const bgFase = faseBg[dInfo.fase]  || OURO_BG
      const reflex = reflexoes.find(r => r.dia === dia)
      const indezD = indezItens.filter(x => x.dia === dia)
      const escrD  = escrivaoHist.filter(x => x.dia_contexto === dia)
      const feito  = reflex?.texto?.trim()

      addHeader(`${primeiroNome}  ·  E-Feito INDOZE`)

      let cy2 = 26
      fill(...cor); box(ML, cy2 - 4, 10, 10, 1)
      font('helvetica', 'bold', 8); txt(255, 255, 255)
      doc.text(String(dia), ML + 5, cy2 + 3, { align: 'center' })
      font('helvetica', 'bold', 18); txt(...PRETO)
      doc.text(dInfo.titulo, ML + 14, cy2 + 3)
      cy2 += 12

      stroke(...CINZA_CLR); doc.setLineWidth(0.2); doc.line(ML, cy2, W - ML, cy2); cy2 += 7

      font('helvetica', 'italic', 8.5); txt(...CINZA_MED)
      cy2 = wrapTxt(dInfo.desc, ML, cy2, TW, 5) + 4

      fill(...bgFase); box(ML, cy2, TW, 18, 2)
      fill(...cor); box(ML, cy2, 3, 18, 1)
      font('helvetica', 'bold', 7); txt(...cor)
      doc.text('INDEZ SUGERIDO', ML + 7, cy2 + 7)
      font('helvetica', 'italic', 8); txt(...PRETO)
      const iSugL = doc.splitTextToSize(dInfo.indez, TW - 12)
      doc.text(iSugL.slice(0, 2), ML + 7, cy2 + 13)
      cy2 += 22

      font('helvetica', 'bold', 9); txt(...PRETO)
      doc.text('✍  Sua reflexão', ML, cy2); cy2 += 6

      if (feito) {
        const rfLines = doc.splitTextToSize(feito, TW - 8)
        const rfH = Math.min(rfLines.length * 4.8 + 10, 55)
        fill(...CINZA_BG); box(ML, cy2, TW, rfH, 2)
        stroke(...CINZA_CLR); doc.setLineWidth(0.2)
        doc.roundedRect(ML, cy2, TW, rfH, 2, 2, 'S')
        font('helvetica', 'normal', 8); txt(...PRETO)
        const vis = rfLines.slice(0, Math.floor((rfH - 10) / 4.8))
        doc.text(vis, ML + 5, cy2 + 7)
        cy2 += rfH + 6
      } else {
        fill(...CINZA_BG); box(ML, cy2, TW, 12, 2)
        font('helvetica', 'italic', 8); txt(...CINZA_MED)
        doc.text('Reflexão não registrada neste dia.', ML + 5, cy2 + 8)
        cy2 += 16
      }

      if (indezD.length) {
        font('helvetica', 'bold', 9); txt(...VERDE)
        doc.text('🌱  Sementes plantadas', ML, cy2); cy2 += 6
        indezD.forEach((iv, ii) => {
          if (cy2 > H - 36) return
          fill(...VERDE_BG); box(ML, cy2, TW, 13, 2)
          fill(...VERDE); box(ML, cy2, 3, 13, 1)
          font('helvetica', 'bold', 7); txt(...VERDE)
          doc.text(`Semente ${iv.numero_semente || ii + 1}`, ML + 7, cy2 + 6)
          font('helvetica', 'normal', 7.5); txt(...PRETO)
          const sL = doc.splitTextToSize(iv.texto, TW - 16)
          doc.text(sL[0] || '', ML + 7, cy2 + 11)
          cy2 += 16
        })
        cy2 += 2
      }

      if (escrD.length && cy2 < H - 55) {
        font('helvetica', 'bold', 9); txt(...AZUL)
        doc.text('🪞  Espelho da Mente', ML, cy2); cy2 += 6
        escrD.slice(0, 1).forEach(e => {
          if (cy2 > H - 40) return
          fill(...AZUL_BG); box(ML, cy2, TW * 0.85, 12, 2)
          stroke(...AZUL); doc.setLineWidth(0.2)
          doc.roundedRect(ML, cy2, TW * 0.85, 12, 2, 2, 'S')
          font('helvetica', 'italic', 7); txt(...AZUL)
          const qL = doc.splitTextToSize('→ ' + e.pergunta, TW * 0.82 - 4)
          doc.text(qL[0], ML + 4, cy2 + 8)
          cy2 += 15
          if (cy2 > H - 35) return
          fill(...CINZA_BG); box(ML + TW * 0.08, cy2, TW * 0.92, 14, 2)
          font('helvetica', 'normal', 7); txt(...CINZA_ESC)
          const rL = doc.splitTextToSize(e.resposta.replace(/\n/g, ' ').substring(0, 200), TW * 0.87 - 4)
          doc.text(rL.slice(0, 2), ML + TW * 0.08 + 4, cy2 + 6)
          cy2 += 17
        })
      }

      if (feito) {
        fill(...VERDE); box(W - ML - 18, 26, 18, 7, 2)
        font('helvetica', 'bold', 6.5); txt(255, 255, 255)
        doc.text('FEITO ✓', W - ML - 9, 31, { align: 'center' })
      } else {
        fill(...CINZA_CLR); box(W - ML - 18, 26, 18, 7, 2)
        font('helvetica', 'normal', 6.5); txt(...CINZA_MED)
        doc.text('PENDENTE', W - ML - 9, 31, { align: 'center' })
      }

      addRodape(dia + 2)
    }

    // PÁG 15 — CONQUISTAS
    doc.addPage(); fill(...BRANCO); box(0, 0, W, H)
    addHeader(`${primeiroNome} · Suas Conquistas`)

    let ly = 24
    font('helvetica', 'bold', 22); txt(...PRETO)
    doc.text('Suas Conquistas', ML, ly); ly += 5
    stroke(...OURO_MED); doc.setLineWidth(1); doc.line(ML, ly, ML + 60, ly); ly += 12

    const conquistas = [
      { ico: '🎒', n: String(totalRef), l: 'Dias\nrefletidos',       c: AZUL    },
      { ico: '🌱', n: String(totalSem), l: 'Sementes\nplantadas',    c: VERDE   },
      { ico: '🪞', n: String(totalInt), l: 'Interações com\no Espelho',c: OURO  },
      { ico: '⭐', n: `${pct}%`,        l: 'Taxa de\nconclusão',     c: LARANJA }
    ]
    conquistas.forEach((c, i) => {
      const cx = ML + i * 44
      fill(faseBg['A Mente']); box(cx, ly, 39, 36, 3)
      stroke(...c.c); doc.setLineWidth(0.5)
      doc.roundedRect(cx, ly, 39, 36, 3, 3, 'S')
      font('helvetica', 'normal', 14); txt(...c.c)
      doc.text(c.ico, cx + 19.5, ly + 13, { align: 'center' })
      font('helvetica', 'bold', 16); txt(...c.c)
      doc.text(c.n, cx + 19.5, ly + 24, { align: 'center' })
      font('helvetica', 'normal', 6.5); txt(...CINZA_MED)
      const ll = c.l.split('\n')
      doc.text(ll[0], cx + 19.5, ly + 30, { align: 'center' })
      doc.text(ll[1] || '', cx + 19.5, ly + 34, { align: 'center' })
    })
    ly += 44

    fill(...CINZA_BG); box(ML, ly, TW, 36, 3)
    font('helvetica', 'bold', 9); txt(...PRETO)
    doc.text(`${primeiroNome}, aqui está o que você construiu:`, ML + 8, ly + 9)
    font('helvetica', 'normal', 8.5); txt(...CINZA_MED)
    const msgs = [
      `· Você plantou ${totalSem} sementes — ${totalSem} inícios reais que o universo já leu.`,
      `· Você trocou ${totalInt} reflexões com o Espelho da Mente.`,
      `· Você completou ${totalRef} dos 12 dias. Isso é autoria.`
    ]
    msgs.forEach((m, i) => { doc.text(m, ML + 8, ly + 17 + i * 7) })
    ly += 44

    fill(...VERDE_BG); box(ML, ly, TW, 28, 3)
    fill(...VERDE); box(ML, ly, 3, 28, 1)
    font('helvetica', 'bold', 9); txt(...VERDE)
    doc.text('Continue plantando!', ML + 8, ly + 9)
    font('helvetica', 'normal', 8); txt(...CINZA_MED)
    doc.text('Compartilhe sua história, marque @elianesimoescruz e', ML + 8, ly + 17)
    doc.text('convide mais pessoas para a próxima série.', ML + 8, ly + 23)
    ly += 36

    stroke(...CINZA_CLR); doc.setLineWidth(0.2); doc.line(ML, ly, W - ML, ly); ly += 8
    font('helvetica', 'bold', 10); txt(...PRETO)
    doc.text('Better Together Systemic', ML, ly)
    font('helvetica', 'normal', 8); txt(...CINZA_MED)
    doc.text('Eliane Simões Cruz · Psicopedagoga e Terapeuta', ML, ly + 7)
    txt(...INSTA)
    doc.textWithLink('@elianesimoescruz', ML, ly + 14, { url: 'https://instagram.com/elianesimoescruz' })

    fill(...OURO_BG); box(W - ML - 30, ly - 4, 30, 30, 3)
    fill(...OURO_MED); doc.circle(W - ML - 15, ly + 10, 10, 'S')
    font('helvetica', 'bold', 5.5); txt(...OURO)
    doc.text('Instagram', W - ML - 15, ly + 10, { align: 'center' })
    doc.text('@elianesimoescruz', W - ML - 15, ly + 15, { align: 'center' })

    stroke(...CINZA_CLR); doc.setLineWidth(0.2); doc.line(0, H - 14, W, H - 14)
    fill(...CINZA_BG); box(0, H - 14, W, 14)
    font('helvetica', 'normal', 6.5); txt(...CINZA_MED)
    doc.text('Better Together Systemic  ·  Eliane Simões Cruz', ML, H - 8)
    txt(...INSTA)
    doc.textWithLink('@elianesimoescruz', W / 2, H - 8, { align: 'center', url: 'https://instagram.com/elianesimoescruz' })
    txt(...CINZA_MED)
    doc.text('Pág. 15', W - ML, H - 8, { align: 'right' })

    doc.save(nomeArquivo)
  } catch (err) {
    console.error('Erro PDF:', err)
    alert('Não foi possível gerar o PDF. Erro: ' + err.message)
  }
}
