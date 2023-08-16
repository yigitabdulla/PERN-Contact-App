import React, { useState } from "react";
import axios from "axios"
import {useCookies} from "react-cookie"
import { useNavigate } from "react-router-dom";

export const Auth = () => {
    const [show, setShow] = useState(false)
  
    const handleShow = () => {
        show ? setShow(false) : setShow(true)
    }

    return (
        <div>
            {show ? <Login handleShow={handleShow} /> : <Register handleShow={handleShow} />}
        </div>
    )
}


const Login = ({handleShow}) => {

    const[username,setUsername] = useState("")
    const[password,setPassword] = useState("")

    const [,setCookies] = useCookies(["access_token"])
    const navigate = useNavigate()

    const onSubmit = async (e) => {
        e.preventDefault()

        try {
            const response = await axios.post("http://localhost:8000/auth/login", {username,password})
            
            setCookies("access_token",response.data.token)
            console.log(response)
            window.localStorage.setItem("user_id",response.data.userID)
            window.localStorage.setItem("username",username)
            navigate("/")
            
        } catch (error) {
            console.error(error)
        }

    }

    return (
        
        <div>
            <div className="wrapper">
                <div className="main">
                    <div className="form-container">
                        <form className="form-group" autoComplete="off" onSubmit={onSubmit}>
                            <label>Username</label>
                            <input type="text" className="form-control" 
                            onChange={(e) => setUsername(e.target.value)} value={username} />
                            <br />
                            <label>Password</label>
                            <input type="password" className="form-control" 
                            onChange={(e) => setPassword(e.target.value)} value={password}/>
                            <br />
                            <button type="submit" id="save-btn" className="sign-btns" >Sign In</button>
                            <div>You don't have an account?</div>
                            <button className="sign-btns" type="button" onClick={handleShow}>Sign Up</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>

    )
}



const Register = ({handleShow}) => {

    const[username,setUsername] = useState("")
    const[password,setPassword] = useState("")

    const onSubmit = async (e) => {
        e.preventDefault()

        try {
            await axios.post("http://localhost:8000/auth/register", {username,password})
            alert("Resitration completed!")
        } catch (error) {
            console.error(error)
        }

    }

    return (

        <div>
            <div className="wrapper">
                <div className="main">
                    <div className="form-container" id="sign-form">
                        <form id="user-form" className="form-group" autoComplete="off" onSubmit={onSubmit}>
                            <label>Username</label>
                            <input type="text" id="username" className="form-control" 
                            onChange={(e) => setUsername(e.target.value)} value={username} />
                            <br />
                            <label>Password</label>
                            <input type="password" id="password" className="form-control" 
                            onChange={(e) => setPassword(e.target.value)} value={password}/>
                            <br />
                            <button type="submit" className="sign-btns" id="signup-btn">Sign Up</button>
                            <div>You already have an account?</div>
                            <button type="button" className="sign-btns" id="signin-btn" onClick={handleShow}>Sign In</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}

  