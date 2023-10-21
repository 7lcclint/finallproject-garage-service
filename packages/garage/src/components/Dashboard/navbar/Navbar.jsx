import { Link } from "react-router-dom";
import "./navbar.css";
import { useEffect, useState } from "react";
import axios from "axios";

function Navbar() {

  const [firstName, setFirstName ] = useState();
  const [lastName, setLastName ] = useState();
  const [auth, setAuth] = useState(false);
  axios.defaults.withCredentials = true;
  useEffect(() => {
    axios.get('http://localhost:3456/getUserDataByEmail')
    .then(response => {
      console.log(response)
      if (response.data.Status === "Successfully"){
        setAuth(true);
        window.localStorage.setItem('isLoggedIn', true);
        setFirstName(response.data.firstname);
        setLastName(response.data.lastname);
      }else{
        setAuth(false);
        console.log(auth)
        console.log(response.data.Error)
      }
    })
    .then(error => console.log(error));
  }, [auth]);

  return (
    <div className="navbar">
      <div className="logo">
        <Link to='/' ><span>GARAGE SYSTEM</span></Link>
      </div>
      <div className="icons">
        <div className="user">
          <img
            src="https://images.pexels.com/photos/11038549/pexels-photo-11038549.jpeg?auto=compress&cs=tinysrgb&w=1600&lazy=load"
            alt=""
          />
          <Link className='white-text' to='/dashboard/summary'>{firstName} {lastName}</Link>
        </div>
        <Link to='setting'>
          <img src="/settings.svg" alt="" className="icon" />
        </Link>
      </div>
    </div>
  )
}

export default Navbar
