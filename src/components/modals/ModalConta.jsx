import { useState } from 'react'
import { X, Check } from 'lucide-react'
import { sb } from '../../lib/supabase.js'
import { senhaValida, mensagemFaltam, analisarSenha } from '../../utils/senha.js'

export default function ModalConta({ aberto, onFechar, perfilUsuario }) {
  const [senhaAtual, setSenhaAtual] = useState('')
  const [senhaNova, setSenhaNova] = useState('')
  const [senhaNova2, setSenhaNova2] = useState('')
  const [ok, setOk] = useState(false)
  const [erro, setErro] = useState('')

  async function alterarSenha() {
    setOk(false); setErro('')
    if (!senhaValida(senhaNova)) { setErro(mensagemFaltam(analisarSenha(senhaNova))); return }
    if (senhaNova !== senhaNova2) { setErro('As novas senhas não conferem.'); return }
    const { error } = await sb.auth.updateUser({ password: senhaNova })
    if (error) { setErro('Erro: ' + error.message); return }
    setSenhaAtual(''); setSenhaNova(''); setSenhaNova2('')
    setOk(true)
  }

  if (!aberto) return null

  return (
    <div className="modal-conta-bg aberto" onClick={e => { if (e.target === e.currentTarget) onFechar() }}>
      <div className="modal-conta">
        <div className="modal-conta-cab">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div className="modal-conta-titulo">Minha Conta</div>
            <button className="modal-login-fechar" style={{ position: 'static' }} onClick={onFechar}><X size={18} /></button>
          </div>
        </div>
        <div className="modal-conta-corpo">
          <div className="conta-info"><div className="conta-info-label">Nome</div><div className="conta-info-valor">{perfilUsuario?.nome || '—'}</div></div>
          <div className="conta-info"><div className="conta-info-label">E-mail</div><div className="conta-info-valor">{perfilUsuario?.email || '—'}</div></div>
          <div className="conta-info"><div className="conta-info-label">Telefone</div><div className="conta-info-valor">{perfilUsuario?.telefone || '—'}</div></div>
          <div className="conta-info"><div className="conta-info-label">Instagram</div><div className="conta-info-valor">{perfilUsuario?.instagram || '—'}</div></div>

          <div className="conta-separador">Alterar senha</div>
          <p className="conta-senha-aviso">Digite sua senha atual e escolha uma nova (mínimo 6 caracteres).</p>
          <div className="campo"><label className="campo-label">Senha atual</label><input type="password" className="campo-input" value={senhaAtual} onChange={e => setSenhaAtual(e.target.value)} /></div>
          <div className="campo"><label className="campo-label">Nova senha</label><input type="password" className="campo-input" value={senhaNova} onChange={e => setSenhaNova(e.target.value)} /></div>
          <div className="campo"><label className="campo-label">Confirmar nova senha</label><input type="password" className="campo-input" value={senhaNova2} onChange={e => setSenhaNova2(e.target.value)} /></div>
          <button className="btn-auth" onClick={alterarSenha}>Salvar nova senha</button>
          {ok   && <div className="conta-ok visivel"><Check size={13} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 4 }} />Senha alterada com sucesso.</div>}
          {erro && <div className="conta-erro visivel">{erro}</div>}
        </div>
      </div>
    </div>
  )
}
