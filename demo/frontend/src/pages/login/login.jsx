import { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { FaLock } from 'react-icons/fa'
import {SiGmail} from 'react-icons/si'
import "./login.css";
import { login } from "../authContext/apiCalls";
import { AuthContext } from "../authContext/AuthContext";
import { useNavigate } from 'react-router-dom';


export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const { dispatch } = useContext(AuthContext);
    const navigate = useNavigate();
    const handleLogin = (e) => {
        e.preventDefault();
        login({ email, password }, dispatch, navigate);
    };
    return (
        <div className="login">
            <div className="body">
                <div className="wrapper">
                    <form action="">
                        <h1>Login</h1>
                        <div className="input-box">
                            <input
                                type="email"
                                placeholder="Email"
                                required
                                onChange={(e) => setEmail(e.target.value)}
                            />
                            <SiGmail className="icon" />
                        </div>
                        <div className="input-box">
                            <input
                                type="password"
                                placeholder="Password"
                                required
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            <FaLock className="icon" />
                        </div>

                        <button type="submit" onClick={handleLogin}>
                            Login
                        </button>

                        <div className="register-link">
                            <p>Don't have an account ?
                                <a href="#">
                                    <Link to="/register">
                                        Register
                                    </Link>
                                    
                                </a>
                            </p>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}