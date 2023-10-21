import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useState } from "react";
import Navbar from "../MainPage/Navbar";
import './login.css'
function Login() {

    const [values, setValues] = useState({
        email: '',
        password: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setValues({
          ...values,
          [name]: value,
        });
    };

    const navigateTo = useNavigate();
    axios.defaults.withCredentials = true;
      const handleSubmit = (event) => {
        event.preventDefault();
        axios.post('http://localhost:3456/login', values)
        .then(response => {
          console.log(response)
          if (response.data.Status === "Successfully"){
            navigateTo('/')
            location.reload(true)
          }else{
            alert("Error: " + response.data.Error)
          }
        })
        .then(error => console.log(error));
      }

    return (
        <div>
          <Navbar/>
            <div className="container-login">
                <div className="form-container">
                    <h2>Sign In</h2>
                    <form onSubmit={handleSubmit}>
                        <div>
                            <label htmlFor="email"><strong>Email</strong></label>
                            <input 
                                type="email" 
                                name="email" 
                                placeholder="Enter Email" 
                                className="form-control rounded-0"
                                value={values.email}
                                onChange={handleChange}/>
                        </div>
                        <div>
                            <label htmlFor="password"><strong>Password</strong></label>
                            <input 
                                type="password" 
                                name="password" 
                                placeholder="Enter Password" 
                                className="form-control rounded-0"
                                value={values.password}
                                onChange={handleChange}/>
                        </div>
                        <button type="submit" className="login-button">Log in</button>
                        <p>Register ?</p>
                        <Link to='/register' className="login-button-light">Create Account</Link>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default Login