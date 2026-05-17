import { useState, useEffect, useRef } from 'react'
import { AppProvider, useApp } from './context/AppContext.jsx'
import Entrada from './components/screens/Entrada.jsx'
import Plataforma from './components/screens/Plataforma.jsx'
import ModalOrigem from './components/modals/ModalOrigem.jsx'
import ModalLogin from './components/modals/ModalLogin.jsx'
import ModalRecuperarSenha from './components/modals/ModalRecuperarSenha.jsx'
import { sb } from './lib/supabase.js'

function AppInner() {
  const { tela } = useApp()
  const [modalOrigem, setModalOrigem] = useState(false)
  const [modalLogin, setModalLogin] = useState(false)
  const [modalRecuperar, setModalRecuperar] = useState(false)
  const [passoCuperar, setPassoRecuperar] = useState(1)
  const telaAnterior = useRef(tela)

  useEffect(() => {
    if (tela === 'plataforma' && telaAnterior.current !== 'plataforma') {
      setModalLogin(false)
      setModalOrigem(false)
      setModalRecuperar(false)
    }
    telaAnterior.current = tela
  }, [tela])

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    if (params.get('modo') === 'resetar-senha') {
      setPassoRecuperar(2)
      setModalRecuperar(true)
      window.history.replaceState({}, '', window.location.pathname)
    }

    const { data: { subscription } } = sb.auth.onAuthStateChange((_event) => {
      if (_event === 'PASSWORD_RECOVERY') {
        setPassoRecuperar(2)
        setModalRecuperar(true)
      }
    })
    return () => subscription.unsubscribe()
  }, [])

  return (
    <>
      {tela === 'entrada' && (
        <Entrada
          onEntrar={() => setModalLogin(true)}
          onOrigem={() => setModalOrigem(true)}
        />
      )}
      {tela === 'plataforma' && <Plataforma />}

      <ModalOrigem
        aberto={modalOrigem}
        onFechar={() => setModalOrigem(false)}
      />
      <ModalLogin
        aberto={modalLogin}
        onFechar={() => setModalLogin(false)}
        onRecuperarSenha={() => { setModalLogin(false); setPassoRecuperar(1); setModalRecuperar(true) }}
      />
      <ModalRecuperarSenha
        aberto={modalRecuperar}
        passoInicial={passoCuperar}
        onFechar={() => setModalRecuperar(false)}
        onAbrirLogin={() => setModalLogin(true)}
      />
    </>
  )
}

export default function App() {
  return (
    <AppProvider>
      <AppInner />
    </AppProvider>
  )
}
