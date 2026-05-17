import { EDGE_URL } from './dias.js'

export async function apiCall(body, tentativas = 3) {
  const { model, ...resto } = body
  for (let i = 0; i < tentativas; i++) {
    try {
      const r = await fetch(EDGE_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(resto),
      })
      const d = await r.json()
      if (!r.ok) throw new Error(d?.error || 'Erro HTTP ' + r.status)
      if (d.error) throw new Error(d.error)
      return d
    } catch (e) {
      if (i === tentativas - 1) throw e
      await new Promise(r => setTimeout(r, 1500 * (i + 1)))
    }
  }
}
