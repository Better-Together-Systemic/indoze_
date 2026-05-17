import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { sb } from '../lib/supabase.js'

const AppContext = createContext(null)

export function AppProvider({ children }) {
  const [tela, setTela] = useState('entrada')
  const [usuarioSessao, setUsuarioSessao] = useState(null)
  const [perfilUsuario, setPerfilUsuario] = useState(null)
  const [serieAtiva, setSerieAtiva] = useState(null)
  const [numeroSerie, setNumeroSerie] = useState(1)
  const [secaoAtiva, setSecaoAtiva] = useState('sala')
  const [escrivaoContextoDia, setEscrivaoContextoDia] = useState(null)
  const [indezTexto, setIndezTexto] = useState('')
  const [indezDia, setIndezDia] = useState(null)

  const carregarPerfil = useCallback(async (authUser) => {
    setUsuarioSessao(authUser)

    const { data: perfil } = await sb
      .from('usuarios')
      .select('*')
      .eq('id', authUser.id)
      .single()
    setPerfilUsuario(perfil)

    const { data: serie } = await sb
      .from('series')
      .select('*')
      .eq('usuario_id', authUser.id)
      .eq('ativa', true)
      .single()
    setSerieAtiva(serie)

    const { count } = await sb
      .from('series')
      .select('id', { count: 'exact', head: true })
      .eq('usuario_id', authUser.id)
    setNumeroSerie(count || 1)

    setTela('plataforma')
    setSecaoAtiva('sala')
  }, [])

  const deslogar = useCallback(() => {
    setUsuarioSessao(null)
    setPerfilUsuario(null)
    setSerieAtiva(null)
    setNumeroSerie(1)
    setTela('entrada')
    setSecaoAtiva('sala')
    setEscrivaoContextoDia(null)
  }, [])

  const sair = useCallback(async () => {
    try { await sb.auth.signOut() } catch {}
    deslogar()
  }, [deslogar])

  const iniciarNovaSerie = useCallback(async () => {
    if (!usuarioSessao) return null
    if (serieAtiva) {
      await sb.from('series').update({ ativa: false }).eq('id', serieAtiva.id)
    }
    const { data: novaSerie } = await sb
      .from('series')
      .insert({ usuario_id: usuarioSessao.id, ativa: true })
      .select()
      .single()
    setSerieAtiva(novaSerie)
    setNumeroSerie(prev => prev + 1)
    setEscrivaoContextoDia(null)
    setIndezTexto('')
    setIndezDia(null)
    setSecaoAtiva('sala')
    return novaSerie
  }, [usuarioSessao, serieAtiva])

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    if (params.get('modo') === 'resetar-senha') {
      window.history.replaceState({}, '', window.location.pathname)
    }

    sb.auth.getSession().then(({ data: { session } }) => {
      if (session) carregarPerfil(session.user)
    })

    const { data: { subscription } } = sb.auth.onAuthStateChange((_event, session) => {
      console.log('[auth] evento:', _event, 'session:', session?.user?.email)
      if (_event === 'PASSWORD_RECOVERY') return
      if (session) carregarPerfil(session.user)
      else deslogar()
    })

    return () => subscription.unsubscribe()
  }, [carregarPerfil, deslogar])

  const irParaEscrivaoComDia = useCallback((n, texto) => {
    setEscrivaoContextoDia(n)
    setSecaoAtiva('escrivao')
  }, [])

  const irParaIndezComTexto = useCallback((texto, dia) => {
    setIndezTexto(texto)
    setIndezDia(dia)
    setSecaoAtiva('indez')
  }, [])

  return (
    <AppContext.Provider value={{
      tela, setTela,
      usuarioSessao, perfilUsuario, serieAtiva,
      numeroSerie,
      carregarPerfil, deslogar, sair, iniciarNovaSerie,
      secaoAtiva, setSecaoAtiva,
      escrivaoContextoDia, setEscrivaoContextoDia,
      indezTexto, setIndezTexto,
      indezDia, setIndezDia,
      irParaEscrivaoComDia, irParaIndezComTexto,
    }}>
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  return useContext(AppContext)
}
