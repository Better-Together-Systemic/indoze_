import { useState, useEffect } from 'react'
import { X, ArrowLeft, Check } from 'lucide-react'
import { sb } from '../../lib/supabase.js'
import { senhaValida, mensagemFaltam, analisarSenha } from '../../utils/senha.js'
import SenhaForca from '../ui/SenhaForca.jsx'

export default function ModalRecuperarSenha({ aberto, passoInicial = 1, onFechar, onAbrirLogin }) {
  const [passo, setPasso] = useState(passoInicial)

  useEffect(() => { setPasso(passoInicial) }, [passoInicial])
  const [email, setEmail] = useState('')
  const [novaSenha, setNovaSenha] = useState('')
  const [novaSenha2, setNovaSenha2] = useState('')
  const [erroEmail, setErroEmail] = useState(false)
  const [erroNova, setErroNova] = useState('')
  const [erroConf, setErroConf] = useState(false)
  const [okEnvio, setOkEnvio] = useState(false)
  const [errEnvio, setErrEnvio] = useState('')
  const [okSalvo, setOkSalvo] = useState(false)
  const [errSalvo, setErrSalvo] = useState('')
  const [carregando, setCarregando] = useState(false)

  async function enviarRecuperacao() {
    setErroEmail(false); setOkEnvio(false); setErrEnvio('')
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { setErroEmail(true); return }
    setCarregando(true)
    const redirectTo = window.location.origin + window.location.pathname + '?modo=resetar-senha'
    const { error } = await sb.auth.resetPasswordForEmail(email, { redirectTo })
    setCarregando(false)
    if (error) setErrEnvio('Erro ao enviar. Verifique o e-mail e tente novamente.')
    else setOkEnvio(true)
  }

  async function salvarNovaSenha() {
    setErroNova(''); setErroConf(false); setOkSalvo(false); setErrSalvo('')
    if (!senhaValida(novaSenha)) { setErroNova(mensagemFaltam(analisarSenha(novaSenha))); return }
    if (novaSenha !== novaSenha2) { setErroConf(true); return }
    setCarregando(true)
    const { error } = await sb.auth.updateUser({ password: novaSenha })
    setCarregando(false)
    if (error) setErrSalvo('Erro ao salvar. O link pode ter expirado. Solicite um novo.')
    else { setOkSalvo(true); setTimeout(onFechar, 2500) }
  }

  if (!aberto) return null

  return (
    <div className="modal-rec-bg aberto">
      <div className="modal-rec">
        <button className="modal-login-fechar" onClick={onFechar}><X size={18} /></button>

        {passo === 1 && (
          <div className="modal-rec-inner">
            <h2 className="auth-titulo" style={{ marginBottom: '.35rem' }}>Recuperar senha</h2>
            <p className="auth-sub" style={{ lineHeight: 1.6 }}>Informe o e-mail cadastrado. Você receberá um link para criar uma nova senha.</p>
            <div className="campo">
              <label className="campo-label">E-mail</label>
              <input type="email" className={`campo-input${erroEmail ? ' erro' : ''}`} value={email} onChange={e => setEmail(e.target.value)} />
              {erroEmail && <div className="campo-erro visivel">E-mail inválido.</div>}
            </div>
            {!okEnvio && (
              <button className="btn-auth" onClick={enviarRecuperacao} disabled={carregando}>
                {carregando ? 'Enviando...' : 'Enviar link'}
              </button>
            )}
            {okEnvio && <div style={{ marginTop: '1rem', fontSize: '13px', color: '#2ecc71', display: 'flex', alignItems: 'center', gap: 5 }}><Check size={13} />Link enviado! Verifique sua caixa de entrada.</div>}
            {errEnvio && <div style={{ marginTop: '.75rem', fontSize: '14px', color: '#e74c3c' }}>{errEnvio}</div>}
            <div className="auth-link" style={{ marginTop: '1.25rem' }}>
              <a onClick={() => { onFechar(); onAbrirLogin() }} style={{ color: 'var(--ouro)', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 4 }}><ArrowLeft size={14} />Voltar para o login</a>
            </div>
          </div>
        )}

        {passo === 2 && (
          <div className="modal-rec-inner">
            <h2 className="auth-titulo" style={{ marginBottom: '.35rem' }}>Nova senha</h2>
            <p className="auth-sub">Escolha uma nova senha para sua conta.</p>
            <div className="campo">
              <label className="campo-label">Nova senha</label>
              <input type="password" className="campo-input" value={novaSenha} onChange={e => setNovaSenha(e.target.value)} autoComplete="new-password" placeholder="Crie uma senha segura" />
              <SenhaForca senha={novaSenha} />
              {erroNova && <div className="campo-erro visivel">{erroNova}</div>}
            </div>
            <div className="campo">
              <label className="campo-label">Confirmar nova senha</label>
              <input type="password" className="campo-input" value={novaSenha2} onChange={e => setNovaSenha2(e.target.value)} autoComplete="new-password" />
              {erroConf && <div className="campo-erro visivel">Senhas não conferem.</div>}
            </div>
            {!okSalvo && (
              <button className="btn-auth" onClick={salvarNovaSenha} disabled={carregando}>
                {carregando ? 'Salvando...' : 'Salvar nova senha'}
              </button>
            )}
            {okSalvo  && <div style={{ marginTop: '1rem', fontSize: '13px', color: '#2ecc71', display: 'flex', alignItems: 'center', gap: 5 }}><Check size={13} />Senha alterada! Você já pode entrar.</div>}
            {errSalvo && <div style={{ marginTop: '.75rem', fontSize: '14px', color: '#e74c3c' }}>{errSalvo}</div>}
          </div>
        )}
      </div>
    </div>
  )
}
