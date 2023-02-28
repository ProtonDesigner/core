import React, { useState, FC } from 'react';
import "./user.scss"

import PocketBase from "pocketbase"

async function login(pb: PocketBase, username: string, password: string) {
    try {
        await pb.collection("users").authWithPassword(username, password)
        return null
    } catch (error) {
        throw error
    }
};
async function signup (pb: PocketBase, username: string, password: string, passwordConfirm: string) {
    const data = {
        username,
        password,
        passwordConfirm: passwordConfirm
    }
    try {
        const createdUser = await pb.collection("users").create(data)
        await login(pb, username, password)
        return null
    } catch (error) {
        throw error
    }
};
const logout = (pb: PocketBase) => {
    pb.authStore.clear()
};

interface UserProps {
    pb: PocketBase
    currentUser: any
    setCurrentUser(newState: any): any
    dialogUtils: {
        createDialog: Function,
        setDialog: Function,
        showDialog: Function,
        hideDialog: Function
    }
}

function Login(props: any) {
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState<null | string | any>(null)

    return <div className="login__page">
        <h2>Sign in to access your account and all your projects in the cloud</h2>
        <br />
        <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Username"
        />
        <br />
        <br />
        <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
        />
        {error ? <><br />
        <h5 className="error">{error}</h5></> : <>
        <br />
        <br /></>}
        <button onClick={() => {
            login(props.pb, username, password)
                .catch((err) => setError(err.message))
        }}>Login</button>
        <p>Don't have an account? Click <a onClick={() => props.setLoginPage(false)}>Here</a></p>
    </div>
}

function Signup(props: any) {
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [passwordConfirm, setPasswordConfirm] = useState("")
    const [email, setEmail] = useState("")
    const [error, setError] = useState<null | string | any>(null)

    return <div className="signup__page">
        <h2>Sign Up for saving projects in the cloud</h2>
        <br />
        <label>Username: </label>
        <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Username"
        />
        <br />
        <br />
        <label>Email: </label>
        <input
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
        />
        <br />
        <br />
        <label>Password: </label>
        <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
        />
        <br />
        <br />
        <label>Password Confirmation: </label>
        <input
            type="password"
            value={passwordConfirm}
            onChange={(e) => setPasswordConfirm(e.target.value)}
            placeholder="Confirm Password"
        />
        {error ? <><br />
        <h5 className="error">{error}</h5></> : <>
        <br />
        <br /></>}
        <button onClick={() => {
            signup(props.pb, username, password, passwordConfirm)
                .catch((err) => setError(err.message))
        }} >Signup</button>
        <p>Already have an account? Click <a onClick={() => props.setLoginPage(true)}>Here</a></p>
    </div>
}

function LoggedInUser(props: any) {
    return <div className="logged__in">
        <h2>Hello, {props.currentUser.username}</h2>
        <p>Logged in as <b>{props.currentUser.username}</b></p>
        <button onClick={(e) => logout(props.pb)}>Logout</button>
    </div>
}

export default function User<FC>(props: UserProps) {
    const [loginPage, setLoginPage] = useState(true)

    return <div className="user__page">
        {props.currentUser ? <LoggedInUser currentUser={props.currentUser} pb={props.pb} /> : 
            <form onSubmit={(e) => e.preventDefault()}>
                {loginPage ? <Login setLoginPage={setLoginPage} pb={props.pb} /> : <Signup setLoginPage={setLoginPage} pb={props.pb} />}
            </form>
        }
    </div>
}
