import { Check, Sprout } from 'lucide-react'

export default function SecaoHistorias() {
  return (
    <div>
      <h1 className="sec-titulo">Histórias que chegaram</h1>
      <p className="sec-sub">Pessoas que encontraram um lugar para entrar — e começaram.</p>

      <div className="hist-item">
        <div className="hist-avatar">J.L</div>
        <div>
          <div className="hist-nome">J. L.</div>
          <div className="hist-cargo">Colega da formação · Série 1</div>
          <div className="hist-texto">Celebrou 6 anos da sua sala de atendimento com a história do Indez. As mulheres chegaram com ninho e ovos de verdade — um presente que ela não esperava. Cada pessoa recebeu o seu Indez naquela noite. A sala floresceu.</div>
          <span className="hist-selo"><Check size={10} strokeWidth={2.5} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '3px' }} /> Concluiu</span>
        </div>
      </div>

      <div className="hist-item">
        <div className="hist-avatar"><Sprout size={18} /></div>
        <div>
          <div className="hist-nome">Eliane · A Fundadora</div>
          <div className="hist-cargo">Better Together Systemic · Séries 1 e 2</div>
          <div className="hist-texto">Ao descobrir este conhecimento através de Olinda Guedes, o efeito foi imediato. Depois de 2 séries, nasce a multiplicação. Em um dia intenso, quando o pai adoeceu, percebeu que algo havia mudado. Ela lidou diferente. As ações se transformaram. As sensações foram aceitas através do Sim do universo — com compreensão, aceitação da realidade como ela é. O Indez da aceitação e do "eu acredito na vida".</div>
          <span className="hist-selo"><Check size={10} strokeWidth={2.5} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '3px' }} /> Fundou o método</span>
        </div>
      </div>

      <div className="hist-item">
        <div className="hist-avatar">M.A</div>
        <div>
          <div className="hist-nome">M. A.</div>
          <div className="hist-cargo">A mulher que disse sim sem saber por quê · Série 3</div>
          <div className="hist-texto">"Agora eu sei por que eu queria fazer isso sem saber por que — era minha alma que queria estar aqui."</div>
          <span className="hist-selo"><Check size={10} strokeWidth={2.5} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '3px' }} /> Concluiu</span>
        </div>
      </div>

      <div className="hist-item">
        <div className="hist-avatar">F.L</div>
        <div>
          <div className="hist-nome">F. L. M. M.</div>
          <div className="hist-cargo">Série 3</div>
          <div className="hist-texto">"Fiquei emocionada, achei muito interessante e descobri muitas coisas que não sabia! Saí contando para minha nora e meu filho — eles amaram e também querem fazer!"</div>
          <span className="hist-selo"><Check size={10} strokeWidth={2.5} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '3px' }} /> Concluiu</span>
        </div>
      </div>

      <div className="hist-item">
        <div className="hist-avatar">B.M</div>
        <div>
          <div className="hist-nome">B. M. M.</div>
          <div className="hist-cargo">Série 3</div>
          <div className="hist-texto">"Esta série de 12 dias faz a gente pensar em coisas que parecem não ter fim — e ao mesmo tempo em coisas mais palpáveis. Gostei muito."</div>
          <span className="hist-selo"><Check size={10} strokeWidth={2.5} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '3px' }} /> Concluiu</span>
        </div>
      </div>

      <div className="hist-convite">Sua história pode ser a próxima.</div>
    </div>
  )
}
