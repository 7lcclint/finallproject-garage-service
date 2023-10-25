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

    axios.defaults.withCredentials = true;
      const handleSubmit = (event) => {
        event.preventDefault();
        axios.post('http://thammadalok.com/apii/login', values)
        .then(response => {
          console.log(response.data);
          /* if (response.data.Status === "Successfully"){
            window.localStorage.setItem('isLoggedIn', true);
            window.localStorage.setItem('userType',response.data.user_type);
            console.log("Before navigation");
            navigateTo('/');
            location.reload();
            console.log("After navigation");
          }else{
            alert("Error: " + (response.data.Error || 'Unknown Error'));
          } */
          alert("Successs")
        })
        .catch(error => {
          console.log('Error:', error);
          alert("An error occurred. Please try again later.");
        });
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