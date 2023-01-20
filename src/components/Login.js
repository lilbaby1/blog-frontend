import { useState, useRef, useEffect } from "react"
import { Link, useNavigate, useLocation } from "react-router-dom"
import useAuth from "../hooks/useAuth"
// import useInput from "../hooks/useInput"
// import useToggle from "../hooks/useToggle"

import axios from '../api/axios'
import useLocalStorage from "../hooks/useLocalStorage"
const LOGIN_URL = '/auth'

const Login = () => {
    const { setAuth } = useAuth();
    const [persist, setPersist] = useLocalStorage('persist', false)

    const navigate = useNavigate()
    const location = useLocation()
    const from = location.state?.from?.pathname || '/'

    const userRef = useRef()
    const errRef = useRef()

    const [user, setUser] = useState('')
    const [pwd, setPwd] = useState('')
    const [errMsg, setErrMsg] = useState('')

    useEffect(() => {
        userRef.current.focus()
    }, [])

    useEffect(() => {
        setErrMsg('')
    }, [user, pwd])

    const handleSubmit = async (e) => {
        e.preventDefault()

        try {
            const response = await axios.post(
                LOGIN_URL,
                JSON.stringify({ user, pwd }),
                {
                    headers: { 'Content-Type': 'application/json' },
                    withCredentials: true
                }
            )
            const accessToken = response?.data?.accessToken
            
            setAuth({ user, accessToken })
            setUser('')
            setPwd('')
            navigate(from, { replace: true })
        } catch (err) {
            if (!err?.response) {
                setErrMsg('No server response.')
            } else if (err.response?.status === 400) {
                setErrMsg('Missing username or password.')
            } else if (err.response?.status === 401) {
                setErrMsg("Unauthorized.")
            } else {
                setErrMsg('Login failed.')
            }
            errRef.current.focus()
            console.error(err)
        }
    }

  return (
    <section>
        <p 
            ref={errRef} 
            className={errMsg ? 'errmsg' : 'offscreen'}
            aria-live='assertive'
        >{errMsg}</p>
        <h1>Sign In</h1>
        <form onSubmit={handleSubmit}>
            <label htmlFor="username">Username:</label>
            <input 
                id="username"
                type='text'
                ref={userRef}
                autoComplete="off"
                value={user}
                onChange={(e) => setUser(e.target.value)}
                required
            />

            <label htmlFor="password">Password:</label>
            <input
                id="password"
                type="password"
                onChange={(e) => setPwd(e.target.value)}
                value={pwd}
                required
            />
            <button>Sign In</button>
            <div className="persistCheck">
                    <input
                        type="checkbox"
                        id="persist"
                        onChange={() => setPersist(prev => !prev)}
                        checked={persist}
                    />
                    <label htmlFor="persist">Trust This Device</label>
            </div>
        </form>
        <p>
            Need an Account?<br />
            <span className="line">
                <Link to="/register">Sign Up</Link>
            </span>
        </p>
    </section>
  )
}

export default Login