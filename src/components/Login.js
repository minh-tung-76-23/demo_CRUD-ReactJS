import { useState,useEffect, useContext } from "react";
import {loginApi} from "../Services/UserService";
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom'
import { UserContext } from "../Context/UserContext";

const Login = ( ) => {

    const { loginContext } = useContext(UserContext);
    const navigate = useNavigate();
    const [email, setEmail ] = useState("");
    const [password, setPassword] = useState("");
    const [isShowPassword, setIsShowPassWord] = useState(false);
    const [loadingApi, setLoadingApi] = useState(false);

        useEffect(() => {
            let token = localStorage.getItem('token');
            if (token) {
                navigate('/');
            }
        }, [])

    const handleLogin = async () => {
        if(!email || !password) {
            toast.error("Email or password is required!");
            return;
        } 
        setLoadingApi(true);
        let res = await loginApi(email, password);
        if(res && res.token) {
            loginContext(email, res.token)
            navigate('/')
        } else {
            if (res && res.status === 400 ) {
                toast.error("Invalid")
            }
        }
        setLoadingApi(false);
    }

    const handleGoBack = () => {
        navigate("/")
    }
    return (
        <>
        <div className="login-container col-12 col-sm-4">
            <div className="title"> Login </div>
            <div className="text"> Email or user </div>
            <input 
                type="text" 
                placeholder="eve.holt@reqres.in"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
            />
            <div className="input-password">
                <input 
                    type={isShowPassword === false ? "password" : "text"}
                    placeholder="Password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                />
                <i className={isShowPassword === true ? "fa-solid fa-eye-slash": "fa-solid fa-eye"}
                    onClick={() => setIsShowPassWord(!isShowPassword)}
                ></i>
            </div>
            <button 
                className={email && password ? "active" : ""} 
                disabled={email && password ? false : true}
                onClick={() => handleLogin()}
            >
                {loadingApi && <i class="fa-solid fa-spinner fa-spin-pulse fa-spin-reverse"></i>}
                Login</button>
            <div className="back">
                <i className="fa-solid fa-angle-left"></i>
               <span onClick={() => handleGoBack()}>  Go back</span>
            </div>
        </div>
        </>
    )
}

export default Login;