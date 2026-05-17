export function analisarSenha(senha) {
  return {
    temLen: senha.length >= 8,
    temMai: /[A-Z]/.test(senha),
    temMin: /[a-z]/.test(senha),
    temNum: /[0-9]/.test(senha),
    temEsp: /[^A-Za-z0-9]/.test(senha),
  }
}

export function senhaValida(senha) {
  const r = analisarSenha(senha)
  return r.temLen && r.temMai && r.temMin && r.temNum && r.temEsp
}

export function calcularPontos(r) {
  return [r.temLen, r.temMai, r.temMin, r.temNum, r.temEsp].filter(Boolean).length
}

export function mensagemFaltam(r) {
  const faltam = []
  if (!r.temLen) faltam.push('mínimo 8 caracteres')
  if (!r.temMai) faltam.push('uma letra maiúscula')
  if (!r.temMin) faltam.push('uma letra minúscula')
  if (!r.temNum) faltam.push('um número')
  if (!r.temEsp) faltam.push('um caractere especial')
  return faltam.length ? 'Falta: ' + faltam.join(', ') + '.' : ''
}
