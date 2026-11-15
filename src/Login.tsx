import { useState, type FormEvent } from 'react'
import { supabase } from './lib/supabase'

interface Props {
  onDone: () => void
}

export default function Login({ onDone }: Props) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  const submit = async (e: FormEvent) => {
    e.preventDefault()
    setBusy(true)
    setError('')
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    setBusy(false)
    if (error) setError('Wrong email or password.')
    else onDone()
  }

  return (
    <form className="login" onSubmit={submit}>
      <label>
        Admin email
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required autoFocus />
      </label>
      <label>
        Password
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
      </label>
      {error && <p className="error" role="alert">{error}</p>}
      <div className="form-actions">
        <button type="submit" className="primary" disabled={busy}>{busy ? 'Logging in...' : 'Log in'}</button>
        <button type="button" onClick={onDone}>Cancel</button>
      </div>
    </form>
  )
}
