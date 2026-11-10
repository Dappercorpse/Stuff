import { useState } from 'react'
import { supabase } from '../supabase.js'
import '../styles/login.css'

function toEmail(id) {
  return id.trim().toLowerCase() + '@example.com'
}

export function Login() {
  let [id, setId] = useState('')
  let [password, setPassword] = useState('')
  let [showPassword, setShowPassword] = useState(false)
  let [message, setMessage] = useState('')

  async function signIn(event) {
    event.preventDefault()
    let { error } = await supabase.auth.signInWithPassword({ email: toEmail(id), password })
    if (error) {
      setMessage(error.message)
    }
  }

  async function signUp() {
    let { error } = await supabase.auth.signUp({ email: toEmail(id), password })
    setMessage(error ? error.message : 'Account created. You can sign in now.')
  }

  return (
    <div className='loginPage'>
      <form className='loginCard' onSubmit={signIn}>
        <h1 className='loginTitle'>Music Library</h1>
        <input
          className='loginInput'
          type='text'
          placeholder='ID'
          value={id}
          onChange={(e) => setId(e.target.value)}
        />
        <div className='passwordWrap'>
          <input
            className='loginInput'
            type={showPassword ? 'text' : 'password'}
            placeholder='Password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            className='toggleButton'
            type='button'
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? 'Hide Password' : 'Show Password'}
          </button>
        </div>
        <button className='loginButton primary' type='submit'>Sign in</button>
        <button className='loginButton' type='button' onClick={signUp}>Create account</button>
        <p className='loginMessage'>{message}</p>
      </form>
    </div>
  )
}