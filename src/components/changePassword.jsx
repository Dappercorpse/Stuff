import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import '../styles/login.css'

function PasswordInput({ placeholder, value, onChange }) {
  let [visible, setVisible] = useState(false)

  return (
    <div className='passwordWrap'>
      <input
        className='loginInput'
        type={visible ? 'text' : 'password'}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      <button
        className='toggleButton'
        type='button'
        onClick={() => setVisible(!visible)}
      >
        {visible ? 'Hide' : 'Show'}
      </button>
    </div>
  )
}

export function ChangePassword({ onChange }) {
  let [currentPassword, setCurrentPassword] = useState('')
  let [newPassword, setNewPassword] = useState('')
  let [confirmPassword, setConfirmPassword] = useState('')
  let [errors, setErrors] = useState([])
  let [success, setSuccess] = useState('')

  async function submit(event) {
    event.preventDefault()
    setSuccess('')

    let problems = []
    if (!currentPassword) problems.push('Enter your current password.')
    if (newPassword.length < 6) problems.push('New password must be at least 6 characters.')
    if (newPassword !== confirmPassword) problems.push('New passwords do not match.')

    if (problems.length > 0) {
      setErrors(problems)
      return
    }

    let result = await onChange(currentPassword, newPassword)

    if (result === 'Password changed.') {
      setErrors([])
      setSuccess(result)
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
    } else {
      setErrors([result])
    }
  }

  return (
    <div className='loginPage'>
      <form className='loginCard' onSubmit={submit}>
        <h1 className='loginTitle'>Change Password</h1>

        <PasswordInput
          placeholder='Current password'
          value={currentPassword}
          onChange={setCurrentPassword}
        />
        <PasswordInput
          placeholder='New password'
          value={newPassword}
          onChange={setNewPassword}
        />
        <PasswordInput
          placeholder='Confirm new password'
          value={confirmPassword}
          onChange={setConfirmPassword}
        />

        <button className='loginButton primary' type='submit'>Save</button>
        <NavLink className='loginButton' to='/'>Back to library</NavLink>

        {errors.map((error) => (
          <p key={error} className='loginMessage'>{error}</p>
        ))}
        {success && <p className='loginMessage'>{success}</p>}
      </form>
    </div>
  )
}