import { Home, Eye, Mic, BookOpen, Users } from 'lucide-react'

export default function SecaoSala() {
  return (
    <div>
      <h1 className="sec-titulo">A Sala</h1>
      <p className="sec-sub">Que legal você por aqui! Os seus pensamentos podem ser trançados, revistos e questionados. Solte suas ideias e escreva com transparência para você mesmo (a). Seu resultado pode ser surpreendente. A materialização da sua história começa agora!</p>
      <div className="sala-grid">

        <div className="sala-item">
          <span className="sala-ico"><Home size={24} /></span>
          <div className="sala-nome">O Seu Ninho <span style={{ fontSize: '14px', color: 'var(--muted)', fontWeight: 400 }}>(Materiais de Apoio)</span></div>
          <div className="sala-desc">Aqui ficam os conteúdos que podem mudar a sua realidade! É inspirador!</div>
          <div className="sala-desc">Aproveite!</div>
          <span className="sala-tag">Seu refúgio</span>
        </div>

        <div className="sala-item">
          <span className="sala-ico"><Eye size={24} /></span>
          <div className="sala-nome">O Espelho da Mente <span style={{ fontSize: '14px', color: 'var(--muted)', fontWeight: 400 }}>(Sua Investigação Guiada)</span></div>
          <div className="sala-desc">Para mudarmos o que projetamos no mundo, precisamos limpar a nossa própria lente. Através do seu diálogo aqui, você vai descobrir o que ainda não enxerga na sua história e, principalmente, o que já está pronto (a) para fazer diferente.</div>
          <span className="sala-tag">Em breve</span>
        </div>

        <div className="sala-item">
          <span className="sala-ico"><Mic size={24} /></span>
          <div className="sala-nome">A Voz da Sua História <span style={{ fontSize: '14px', color: 'var(--muted)', fontWeight: 400 }}>(Compartilhe o Movimento)</span></div>
          <div className="sala-desc">Quando compartilhamos algo que é bom para gente, criamos a possibilidade de incluir mais pessoas. Durante 12 dias, permita que a sua jornada seja vista. Use suas redes sociais como um diário vivo desse caminho. Compartilhe seus aprendizados, marque a @elianesimoescruz e lembre-se: juntos, é melhor. E talvez, ao dar voz à sua história, você descubra que tudo pode mudar, inclusive você! Fazer isso é um treino poderoso para que você ative a sabedoria do Toque de Tistu e crie possibilidade de inspirar e transformar o dia de outras pessoas que te acompanham!</div>
          <span className="sala-tag">Seu conteúdo</span>
        </div>

        <div className="sala-item" style={{ position: 'relative', overflow: 'hidden' }}>
          <span className="sala-ico"><BookOpen size={24} /></span>
          <div className="sala-nome" style={{ color: 'var(--ouro-claro)', fontSize: '1.15rem', fontWeight: 400 }}>O E-Feito INDOZE</div>
          <div className="sala-desc" style={{ color: 'rgba(250,250,248,.65)', fontStyle: 'italic', marginBottom: '.6rem' }}>Parei de brigar com os fatos e executei coisas diferentes em 12 dias.</div>
          <div className="sala-desc" style={{ color: 'rgba(250,250,248,.85)' }}>Tudo o que você escrever durante os 12 dias será utilizado para registar sua história! No último dia, suas respostas terão um grande efeito! Sim! <strong style={{ color: 'var(--ouro-claro)' }}>Foi você que criou!</strong></div>
          <span className="sala-tag" style={{ background: 'rgba(200,149,42,.25)', color: 'var(--ouro-claro)', border: '1px solid rgba(200,149,42,.5)', fontWeight: 600 }}>✦ Gerado no Dia 12</span>
        </div>

        <div className="sala-item destaque">
          <span className="sala-ico"><Users size={24} /></span>
          <div className="sala-nome">Encontros ao Vivo</div>
          <div className="sala-desc" style={{ marginBottom: '1rem' }}>Três momentos na nossa "Sala entre Histórias" para compartilhar, integrar e comemorar.</div>
          <div className="enc-bloco">
            <div className="enc-item">
              <div className="enc-n">1</div>
              <div className="enc-nome">Limpando a Lente <span style={{ opacity: .6, fontSize: '11px', fontWeight: 400 }}>— A Mente</span></div>
              <div className="enc-desc">Como foram os primeiros passos? Vamos olhar juntos(as) para o que pesou, o que surpreendeu e o alívio que surgiu quando começamos a questionar os pensamentos que nos faziam sofrer. Um encontro para clarear a visão.</div>
              <div className="enc-dia">Após o Dia 4</div>
            </div>
            <div className="enc-item">
              <div className="enc-n">2</div>
              <div className="enc-nome">A Força da Raiz <span style={{ opacity: .6, fontSize: '11px', fontWeight: 400 }}>— O Sistema e o Corpo</span></div>
              <div className="enc-desc">É o momento de olharmos para a nossa ancestralidade e para a sabedoria do nosso corpo. Qual foi a maior "névoa mental" que você dissipou até aqui? Um encontro para alinhar a sua biologia com a sua consciência e reconhecer de onde vem a sua força.</div>
              <div className="enc-dia">Após o Dia 8</div>
            </div>
            <div className="enc-item" style={{ borderColor: 'rgba(200,149,42,.35)' }}>
              <div className="enc-n" style={{ background: 'var(--ouro)', color: '#1a1008' }}>3</div>
              <div className="enc-nome" style={{ color: 'var(--ouro)' }}>O INDOZE que Nasceu ✦ <span style={{ opacity: .7, fontSize: '11px', fontWeight: 400 }}>— A Comemoração Final</span></div>
              <div className="enc-desc">O universo lê e amplifica os nossos inícios! O que nasceu de novo em você nestes 12 dias? A nossa comemoração coletiva é o encontro para enxergar o que construimos nesta jornada: <strong style={{ color: 'var(--areia)' }}>a partir de hoje, você recebe seu INDOZE </strong>, criado por você mesmo(a)!</div>
              <div className="enc-dia" style={{ color: 'var(--ouro)' }}>Dia 12 ✦ Comemoração</div>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}
