import { useState } from 'react'
import { X, Sprout } from 'lucide-react'
import { sb } from '../../lib/supabase.js'
import { senhaValida, mensagemFaltam, analisarSenha } from '../../utils/senha.js'
import SenhaForca from '../ui/SenhaForca.jsx'

export default function ModalLogin({ aberto, onFechar, onRecuperarSenha }) {
  const [modo, setModo] = useState('login')
  const [logEmail, setLogEmail] = useState('')
  const [logSenha, setLogSenha] = useState('')
  const [erroLogEmail, setErroLogEmail] = useState(false)
  const [erroLog, setErroLog] = useState(false)
  const [carregandoLog, setCarregandoLog] = useState(false)

  const [cadNome, setCadNome] = useState('')
  const [cadEmail, setCadEmail] = useState('')
  const [cadTel, setCadTel] = useState('')
  const [cadInsta, setCadInsta] = useState('')
  const [cadSenha, setCadSenha] = useState('')
  const [cadSenha2, setCadSenha2] = useState('')
  const [errosCad, setErrosCad] = useState({})
  const [carregandoCad, setCarregandoCad] = useState(false)
  const [cadastroOk, setCadastroOk] = useState(false)
  const [emailCadastrado, setEmailCadastrado] = useState('')

  async function fazerLogin() {
    setErroLogEmail(false); setErroLog(false)
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(logEmail)) { setErroLogEmail(true); return }
    setCarregandoLog(true)
    try {
      const { data, error } = await sb.auth.signInWithPassword({ email: logEmail, password: logSenha })
      console.log('[login] data:', data, 'error:', error)
      if (error) setErroLog(true)
    } catch (e) {
      console.log('[login] catch:', e)
      setErroLog(true)
    } finally {
      setCarregandoLog(false)
    }
  }

  async function cadastrar() {
    const erros = {}
    if (!cadNome.trim()) erros.nome = 'Informe seu nome.'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cadEmail)) erros.email = 'E-mail inválido.'
    if (!/^\d{8,}$/.test(cadTel.trim())) erros.tel = 'Apenas números.'
    if (!cadInsta.startsWith('@')) erros.insta = 'Deve começar com @.'
    const r = analisarSenha(cadSenha)
    if (!r.temLen || !r.temMai || !r.temMin || !r.temNum || !r.temEsp) erros.senha = mensagemFaltam(r)
    if (cadSenha !== cadSenha2) erros.senha2 = 'Senhas não conferem.'
    setErrosCad(erros)
    if (Object.keys(erros).length) return

    setCarregandoCad(true)
    const { error } = await sb.auth.signUp({
      email: cadEmail, password: cadSenha,
      options: { data: { nome: cadNome, telefone: cadTel, instagram: cadInsta } }
    })
    setCarregandoCad(false)
    if (error) {
      let msg = error.message
      if (msg.includes('already registered')) msg = 'Este e-mail já possui cadastro. Clique em Entrar.'
      if (msg.includes('password')) msg = 'Senha fraca. Use pelo menos 8 caracteres.'
      if (msg.includes('rate')) msg = 'Muitas tentativas. Aguarde alguns minutos e tente novamente.'
      setErrosCad({ senha2: msg })
      return
    }
    setEmailCadastrado(cadEmail)
    setCadastroOk(true)
  }

  if (!aberto) return null

  return (
    <div className="modal-login-bg aberto">
      <div className="modal-login">
        <button className="modal-login-fechar" onClick={onFechar}><X size={18} /></button>

        {modo === 'login' && (
          <div className="modal-login-inner">
            <h2 className="auth-titulo" style={{ marginBottom: '.35rem' }}>Que legal você aqui!</h2>
            <p className="auth-sub">Entre com seu e-mail e senha.</p>
            <div className="campo">
              <label className="campo-label">E-mail</label>
              <input type="email" className={`campo-input${erroLogEmail ? ' erro' : ''}`} value={logEmail} onChange={e => setLogEmail(e.target.value)} />
              {erroLogEmail && <div className="campo-erro visivel">E-mail inválido.</div>}
            </div>
            <div className="campo">
              <label className="campo-label">Senha</label>
              <input type="password" className={`campo-input${erroLog ? ' erro' : ''}`} value={logSenha} onChange={e => setLogSenha(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') fazerLogin() }} />
              {erroLog && <div className="campo-erro visivel">E-mail ou senha incorretos.</div>}
            </div>
            <button className="btn-auth" onClick={fazerLogin} disabled={carregandoLog}>
              {carregandoLog ? 'Entrando...' : 'Entrar'}
            </button>
            <div className="auth-link" style={{ marginTop: '1rem' }}>
              <a onClick={() => { onFechar(); onRecuperarSenha() }} style={{ color: 'var(--ouro)', cursor: 'pointer' }}>Esqueceu sua senha?</a>
            </div>
            <div className="auth-link" style={{ marginTop: '.5rem' }}>
              Não tem cadastro? <a onClick={() => setModo('cadastro')} style={{ color: 'var(--ouro)', cursor: 'pointer' }}>Crie sua conta</a>
            </div>
          </div>
        )}

        {modo === 'cadastro' && !cadastroOk && (
          <div className="modal-login-inner">
            <h2 className="auth-titulo" style={{ marginBottom: '.35rem' }}>Criar conta</h2>
            <p className="auth-sub">Preencha para registrar seu acesso ao INDOZE.</p>
            <div className="campo">
              <label className="campo-label">Nome completo</label>
              <input type="text" className={`campo-input${errosCad.nome ? ' erro' : ''}`} value={cadNome} onChange={e => setCadNome(e.target.value)} />
              {errosCad.nome && <div className="campo-erro visivel">{errosCad.nome}</div>}
            </div>
            <div className="campo">
              <label className="campo-label">E-mail</label>
              <input type="email" className={`campo-input${errosCad.email ? ' erro' : ''}`} value={cadEmail} onChange={e => setCadEmail(e.target.value)} />
              {errosCad.email && <div className="campo-erro visivel">{errosCad.email}</div>}
            </div>
            <div className="campo">
              <label className="campo-label">Telefone (somente números)</label>
              <input type="tel" className={`campo-input${errosCad.tel ? ' erro' : ''}`} value={cadTel}
                onChange={e => setCadTel(e.target.value.replace(/\D/g, ''))} maxLength={15} />
              {errosCad.tel && <div className="campo-erro visivel">{errosCad.tel}</div>}
            </div>
            <div className="campo">
              <label className="campo-label">Instagram</label>
              <input type="text" className={`campo-input${errosCad.insta ? ' erro' : ''}`} value={cadInsta}
                placeholder="@seuperfil" onChange={e => setCadInsta(e.target.value)}
                onBlur={e => { if (e.target.value && !e.target.value.startsWith('@')) setCadInsta('@' + e.target.value) }} />
              {errosCad.insta && <div className="campo-erro visivel">{errosCad.insta}</div>}
            </div>
            <div className="campo">
              <label className="campo-label">Senha</label>
              <input type="password" className="campo-input" value={cadSenha}
                onChange={e => setCadSenha(e.target.value)} autoComplete="new-password" placeholder="Crie uma senha segura" />
              <SenhaForca senha={cadSenha} />
              {errosCad.senha && <div className="campo-erro visivel">{errosCad.senha}</div>}
            </div>
            <div className="campo">
              <label className="campo-label">Confirmar senha</label>
              <input type="password" className={`campo-input${errosCad.senha2 ? ' erro' : ''}`} value={cadSenha2}
                onChange={e => setCadSenha2(e.target.value)} autoComplete="new-password" />
              {errosCad.senha2 && <div className="campo-erro visivel">{errosCad.senha2}</div>}
            </div>
            <button className="btn-auth" onClick={cadastrar} disabled={carregandoCad}>
              {carregandoCad ? 'Criando conta...' : 'Criar conta'}
            </button>
            <div className="auth-link" style={{ marginTop: '1.25rem' }}>
              Já tem conta? <a onClick={() => setModo('login')} style={{ color: 'var(--ouro)', cursor: 'pointer' }}>Entrar</a>
            </div>
          </div>
        )}

        {modo === 'cadastro' && cadastroOk && (
          <div className="modal-login-inner" style={{ textAlign: 'center', padding: '1rem 0' }}>
            <div style={{ marginBottom: '1rem', color: '#2ecc71' }}><Sprout size={40} /></div>
            <h2 className="auth-titulo" style={{ marginBottom: '.75rem' }}>Conta criada!</h2>
            <p className="auth-sub" style={{ lineHeight: 1.7 }}>
              Enviamos um e-mail de confirmação para<br />
              <strong style={{ color: 'var(--branco)' }}>{emailCadastrado}</strong><br /><br />
              Clique no link do e-mail e depois volte aqui para entrar.
            </p>
            <button className="btn-auth" style={{ marginTop: '1.5rem' }} onClick={() => setModo('login')}>Ir para o login</button>
          </div>
        )}
      </div>
    </div>
  )
}
