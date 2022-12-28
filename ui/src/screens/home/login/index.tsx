import React, { useState } from 'react';

export default function Login(props: any) {
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [passwordConfirm, setPasswordConfirm] = useState("")
    const [email, setEmail] = useState("")
    const [loginPage, setLoginPage] = useState(true)

    const login = async () => {
        try {
            await props.pb.collection("users").authWithPassword(username, password)
        } catch (error) {
            console.log(error)
        }
    };
    const signup = async () => {
        const data = {
            username,
            password,
            passwordConfirm: passwordConfirm
        }
        try {
            const createdUser = await props.pb.collection("users").create(data)
            await login()
        } catch (error) {
            console.log(error)
        }
    };
    const logout = () => {
        props.pb.authStore.clear()
    };

    return <div className="login">
        {props.currentUser ? <>
            <p>Logged in as <b>{props.currentUser.username}</b></p>
            <button onClick={logout}>Logout</button>
            </> : 
            <form onSubmit={(e) => e.preventDefault()}>
                {loginPage ?
                    <>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="Username"
                        />
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Password"
                        />
                        <button onClick={() => login()}>Login</button>
                        <p>Don't have an account? Click <a onClick={() => setLoginPage(false)}>Here</a></p>
                    </> : <>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="Username"
                        />
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Password"
                        />
                        <input
                            type="password"
                            value={passwordConfirm}
                            onChange={(e) => setPasswordConfirm(e.target.value)}
                            placeholder="Confirm Password"
                        />
                        <input
                            type="text"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Email"
                        />
                        <button onClick={() => signup()}>Signup</button>
                        <p>Already have an account? Click <a onClick={() => setLoginPage(true)}>Here</a></p>
                    </>
                }
            </form>
        }
    </div>
}
