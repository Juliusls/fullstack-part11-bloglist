import React, { useState } from 'react'

const LoginForm = ({ userCreditentials }) => {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')

    const handleLogin = async (event) => {
        event.preventDefault()
        userCreditentials({ username, password })
        setUsername('')
        setPassword('')
    }

    return (
        <div>
            <h2>Login</h2>
            <form onSubmit={handleLogin}>
                <div>
                    username
                    <input
                        type='text'
                        value={username}
                        id='username'
                        name='Username'
                        onChange={({ target }) => setUsername(target.value)}
                    />
                </div>
                <div>
                    password
                    <input
                        type='password'
                        value={password}
                        id='password'
                        name='Password'
                        onChange={({ target }) => setPassword(target.value)}
                    />
                </div>
                <button id='submitbutton'type='submit'>login</button>
            </form>
        </div>
    )
}

export default LoginForm