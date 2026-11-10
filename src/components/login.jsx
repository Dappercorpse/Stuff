import { useState } from 'react'
import { supabase } from '../supabase.js'

export function Login() {
  let [email, setEmail] = useState('')
  let [password, setPassword] = useState('')
  let [message, setMessage] = useState('')

  async function signIn(event) {
    event.preventDefault()
    let { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      setMessage(error.message)
    }
  }

  async function signUp() {
    let { error } = await supabase.auth.signUp({ email, password })
    setMessage(error ? error.message : 'Account created. You can sign in now.')
  }

  return (
    <form onSubmit={signIn}>
      <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
      <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
      <button type="submit">Sign in</button>
      <button type="button" onClick={signUp}>Create account</button>
      <p>{message}</p>
    </form>
  )
}