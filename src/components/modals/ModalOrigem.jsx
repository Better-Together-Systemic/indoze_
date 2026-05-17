export default function ModalOrigem({ aberto, onFechar }) {
  return (
    <div className={`modal-bg${aberto ? ' aberto' : ''}`} id="modal-origem">
      <div className="modal">
        <div className="modal-cab">
          <div className="modal-cab-titulo">O início do INDOZE: O Efeito Indez</div>
          <div className="modal-cab-sub">Da intuição ancestral à inovação digital — a história de uma ideia que já estava pronta muito antes de nascer.</div>
        </div>
        <div className="modal-corpo">

          <div className="origem-item">
            <div className="origem-num">I</div>
            <div className="origem-titulo-item">A Ruptura e o Rascunho — A Semente</div>
            <div className="origem-texto-item">Toda grande inovação exige que, em algum momento, você solte o que é seguro. Em 2021, tomei a decisão de exonerar meu cargo em um concurso público. Foi um salto no escuro. Lembro-me de olhar para o meu pai, imersa na incerteza de quem estava deixando uma vida estável para trás, e perguntar: — Pai, o que eu faço? Eu não sei fazer outra coisa a não ser trabalhar na escola. A resposta dele foi de uma simplicidade que, na época, beirava o absurdo. Ele me olhou e disse:</div>
            <div className="origem-quote">"Vende ovos. Compra galinhas!"</div>
            <div className="origem-texto-item" style={{ marginTop: '.75rem' }}>Anotar aquilo em um rascunho parecia loucura, mas uma voz silenciosa me ancorava. A minha mãe, desnacida em 2016, sempre me dizia: "Calma, você vai conseguir!" Hoje, ela vive em mim. O rascunho foi guardado. A semente estava plantada.</div>
          </div>

          <div className="origem-item">
            <div className="origem-num">II</div>
            <div className="origem-titulo-item">A Sincronicidade — A Incubação</div>
            <div className="origem-texto-item">Cinco anos se passaram. Eu vinha me transformando, testando metodologias, e já havia aplicado a minha série de 12 dias de investigação interior por duas vezes. O terreno estava sendo preparado. Até que, no dia 3 de março de 2026, a Mestra Olinda Guedes, em uma de suas aulas sistêmicas, começou a contar a história do "Indez" — o ovo deixado no ninho para sinalizar às galinhas o lugar seguro para a vida brotar. Aquilo me chamou uma atenção magnética. Como a própria Olinda ensina:</div>
            <div className="origem-quote">"Tudo que você busca dá um jeito de te encontrar."</div>
            <div className="origem-texto-item" style={{ marginTop: '.75rem' }}>E a resposta estava prestes a bater na minha porta.</div>
          </div>

          <div className="origem-item">
            <div className="origem-num">III</div>
            <div className="origem-titulo-item">A Epifania — Conectando os Pontos</div>
            <div className="origem-texto-item">Dias depois, meu pai chegou com um caderno velho de 5ª série, repleto de histórias antigas da nossa linhagem. Ele sentou-se na pontinha do sofá e a narrativa começou. Ele narrou como minha bisavó trançava ninhos de taquara com as próprias mãos. A madeira espetava, machucava, mas ela não parava. O meu pai, ainda menino, a acompanhava, levava pães doces e a ajudava a recolher mais de 100 ovos por dia nos ninhos que ela mesma construía.</div>
            <div className="origem-quote">"Aí eu silenciei... silêncio total. E ele desenrolou a história."</div>
            <div className="origem-texto-item" style={{ marginTop: '.75rem' }}>Foi nesse exato segundo que o tempo dobrou sobre si mesmo. O rascunho de 2021, a aula da Olinda e a história da minha Bisa colidiram na minha mente. O "vender ovos" não era literal; era sobre criar ecossistemas seguros para que as pessoas pudessem botar para fora suas dores e chocar novos começos. Na visão sistêmica, como nos lembra Bert Hellinger: "Assentir. Concordar. Dizer Sim. A vida é o que é!" Ao dizer sim à minha história, o método nasceu. Tomei a decisão imediata:</div>
            <div className="origem-quote">"Me aguarde, porque isso tá sendo meu material de construção."</div>
          </div>

          <div className="origem-item">
            <div className="origem-num">IV</div>
            <div className="origem-titulo-item">A Inovação e a Arquitetura — O Nascimento</div>
            <div className="origem-texto-item">Quando liguei os fatos, uma energia incontrolável tomou conta de mim. Olhei para o meu noivo, Bruno, e gritei com toda a força dos meus pulmões: — "Bruno: Choqueiiiiii!" A percepção foi avassaladora e matemática: se o Efeito Indez e a série de 12 dias foram tão transformadores para mim, eles poderiam ser bons para milhares de pessoas no mundo todo. Peguei minha base de materiais e, às 3h30 da manhã, em um fluxo ininterrupto, comecei a escrever para não perder nenhuma ideia.</div>
            <div className="origem-quote">"Botei tanto ovo que esqueci de carregar o computador."</div>
            <div className="origem-texto-item" style={{ marginTop: '.75rem' }}>Como um brilhante analista de sistemas, Bruno assumiu a linha de frente tecnológica. Como ele mesmo sempre diz diante dos desafios: "Tudo é o jeito." Sem ele, a grandiosidade desta plataforma não existiria. Ele traduziu a alma da minha ancestralidade em códigos de alto nível. Assim surgiu o INDOZE: <strong style={{ color: 'var(--areia)' }}>IN</strong> — o movimento sistêmico de ir para dentro. <strong style={{ color: 'var(--areia)' }}>DOZE</strong> — o ciclo exato de 12 dias de reprogramação mental e ação prática, um estudo completo baseado nos ensinamentos de Byron Katie.</div>
          </div>

          <div className="serie-aviso">
            <div className="serie-aviso-txt">O que começou com as mãos de uma bisavó tecendo taquara, hoje é uma plataforma digital que acolhe histórias, desconstrói crenças e ensina o mundo a transformar dor em potência. A cada 12 dias concluídos, uma nova série se abre. Uma transformação que começa por dentro — e se multiplica.</div>
          </div>

          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '14px', color: 'var(--muted)', marginBottom: '.75rem', letterSpacing: '.05em' }}>Siga e compartilhe</div>
            <button className="insta-btn" onClick={() => window.open('https://www.instagram.com/elianesimoescruz', '_blank')}>
              <svg className="insta-ico" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
              @elianesimoescruz
            </button>
          </div>
        </div>
        <div className="modal-rodape">
          <button className="btn-fechar-modal" onClick={onFechar}>Fechar</button>
        </div>
      </div>
    </div>
  )
}
