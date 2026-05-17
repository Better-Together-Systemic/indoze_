import { useState, useRef, useEffect } from 'react'
import { useApp } from '../../context/AppContext.jsx'
import { sb } from '../../lib/supabase.js'
import LogoHeader from '../ui/LogoHeader.jsx'
import SecaoSala from '../sections/SecaoSala.jsx'
import SecaoDias from '../sections/SecaoDias.jsx'
import SecaoEscrivao from '../sections/SecaoEscrivao.jsx'
import SecaoIndez from '../sections/SecaoIndez.jsx'
import SecaoHistorias from '../sections/SecaoHistorias.jsx'
import ModalConta from '../modals/ModalConta.jsx'
import ModalLivro from '../modals/ModalLivro.jsx'

export default function Plataforma() {
  const { usuarioSessao, perfilUsuario, serieAtiva, sair, secaoAtiva, setSecaoAtiva } = useApp()
  const [dropdownAberto, setDropdownAberto] = useState(false)
  const [modalConta, setModalConta] = useState(false)
  const [livroAberto, setLivroAberto] = useState(false)
  const [livroData, setLivroData] = useState(null)
  const dropRef = useRef(null)

  const nome = perfilUsuario?.nome || usuarioSessao?.email || '—'
  const primeiroNome = nome.split(' ')[0]

  useEffect(() => {
    function handleClick(e) {
      if (dropRef.current && !dropRef.current.contains(e.target)) {
        setDropdownAberto(false)
      }
    }
    document.addEventListener('click', handleClick)
    return () => document.removeEventListener('click', handleClick)
  }, [])

  const SECOES = [
    { id: 'sala',     label: 'A Sala'      },
    { id: 'dias',     label: 'Os 12 Dias'  },
    { id: 'escrivao', label: 'Escrivão'    },
    { id: 'indez',    label: 'Meu Indez'   },
    { id: 'historias',label: 'Histórias'   },
  ]

  return (
    <div className="tela ativa" id="plataforma">
      <header className="plat-header">
        <LogoHeader />
        <div className="ph-nome">INDOZE</div>
        <div className="ph-user user-dropdown" ref={dropRef}>
          <button className="ph-user-nome" onClick={() => setDropdownAberto(v => !v)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', fontFamily: "'DM Sans',sans-serif", fontSize: '16px', fontWeight: 500, color: 'var(--branco)' }}>
            {primeiroNome}
          </button>
          <button className="ph-sair" onClick={sair}>Sair</button>
          {dropdownAberto && (
            <div className="user-dropdown-menu aberto">
              <div className="udm-header">
                <div className="udm-nome">{nome}</div>
                <div className="udm-email">{usuarioSessao?.email || '—'}</div>
              </div>
              <button className="udm-item" onClick={() => { setModalConta(true); setDropdownAberto(false) }}>Minha Conta</button>
              <button className="udm-item danger" onClick={sair}>Sair</button>
            </div>
          )}
        </div>
      </header>

      <nav className="plat-nav">
        {SECOES.map(s => (
          <button key={s.id} className={`pn-btn${secaoAtiva === s.id ? ' ativo' : ''}`}
            onClick={() => setSecaoAtiva(s.id)}>
            {s.label}
          </button>
        ))}
      </nav>

      <main className="plat-body">
        {secaoAtiva === 'sala'      && <SecaoSala />}
        {secaoAtiva === 'dias'      && <SecaoDias onGerarLivro={d => { setLivroData(d); setLivroAberto(true) }} />}
        {secaoAtiva === 'escrivao'  && <SecaoEscrivao />}
        {secaoAtiva === 'indez'     && <SecaoIndez />}
        {secaoAtiva === 'historias' && <SecaoHistorias />}
      </main>

      <ModalConta aberto={modalConta} onFechar={() => setModalConta(false)} perfilUsuario={perfilUsuario} />
      <ModalLivro
        aberto={livroAberto}
        onFechar={() => setLivroAberto(false)}
        dados={livroData}
        perfilUsuario={perfilUsuario}
        usuarioSessao={usuarioSessao}
        serieAtiva={serieAtiva}
        sb={sb}
      />
    </div>
  )
}
