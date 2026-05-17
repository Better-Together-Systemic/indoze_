import { Check } from 'lucide-react'
import { analisarSenha, calcularPontos } from '../../utils/senha.js'

export default function SenhaForca({ senha, prefixo = 'sf', idReqs }) {
  if (!senha) return null

  const r   = analisarSenha(senha)
  const pts = calcularPontos(r)
  const cor = pts <= 2 ? 'ativa-fraca' : pts <= 3 ? 'ativa-media' : 'ativa-forte'
  const rotulos  = { 1: 'Fraca', 2: 'Fraca', 3: 'Média', 4: 'Quase lá!', 5: 'Forte' }
  const rotCls   = { 1: 'fraca', 2: 'fraca', 3: 'media', 4: 'media', 5: 'forte' }

  const reqs = [
    { id: 'len', ok: r.temLen, txt: 'Mínimo 8 caracteres' },
    { id: 'mai', ok: r.temMai, txt: 'Pelo menos 1 letra maiúscula (A–Z)' },
    { id: 'min', ok: r.temMin, txt: 'Pelo menos 1 letra minúscula (a–z)' },
    { id: 'num', ok: r.temNum, txt: 'Pelo menos 1 número (0–9)' },
    { id: 'esp', ok: r.temEsp, txt: 'Pelo menos 1 caractere especial (!@#$%...)' },
  ]

  return (
    <div className="senha-forca-wrap">
      <div className="senha-forca-barra">
        {[1,2,3,4,5].map(i => (
          <div key={i} className={`senha-forca-seg${i <= pts && pts > 0 ? ' ' + cor : ''}`} />
        ))}
      </div>
      <div className={`senha-forca-label${pts > 0 ? ' ' + (rotCls[pts] || '') : ''}`}>
        {pts > 0 ? rotulos[pts] : ''}
      </div>
      <div className="senha-reqs">
        {reqs.map(req => (
          <div key={req.id} className={`sr${req.ok ? ' ok' : ''}`}>
            <span className="sr-icon">{req.ok ? <Check size={9} strokeWidth={3} /> : ''}</span>
            <span className="sr-txt">{req.txt}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
