import { Link } from 'react-router-dom';
import './NavbarStyle.css';
import { FaBars, FaTimes } from 'react-icons/fa';
import { useEffect, useState } from 'react';
import axios from "axios";

function Navbar() {

  const [clicked, setClicked] = useState(false);
  const handleClick = () => setClicked(!clicked);
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [userType, setUserType] = useState("");

  const [color, setColor] = useState(false);
  const changeColor = () => {
    if(window.scrollY >= 100){
      setColor(true);
    }else{
      setColor(false);
    }
  };

  const [auth, setAuth] = useState(false);
  axios.defaults.withCredentials = true;
  useEffect(() => {
    axios.get('http://localhost:3456/getUserDataByEmail')
    .then(response => {
      if (response.data.Status === "Successfully"){
        setAuth(true);
        window.localStorage.setItem('isLoggedIn',true);
        setFirstname(response.data.firstname);
        setLastname(response.data.lastname);
        setUserType(response.data.user_type);
      }else{
        setAuth(false);
        console.log(auth)
        console.log(response.data.Error)
      }
    })
    .then(error => console.log(error));
  }, [auth]);

  window.addEventListener('scroll', changeColor);
  const handleLogout = () => {
    axios.defaults.withCredentials = true;
    axios.get('http://localhost:3456/logout')
    .then(response =>{
      location.reload(true);
      window.localStorage.setItem('isLoggedIn',false);
      console.log(response);
    }).catch(error => console.log(error));
  }
  

  return (
    <div className={color ? 'header header-bg' : 'header'}>
      <Link className='white-text' to='/'>
        <h1>Garage Service</h1>
      </Link >
      <ul className={clicked ? 'nav-menu active' : 'nav-menu'}>
        <li>
            <Link className='white-text' to='/'>หน้าแรก</Link>
        </li>
        <li>
            <Link className='white-text' to='/services'>บริการ</Link>
        </li>
        <li>
            <Link className='white-text' to='/about'>เกี่ยวกับเรา</Link>
        </li>
        {auth ? (
        <div>
          <li>
            <Link 
              className='white-text'
              to={  
                userType === 1 ? '/dashboard/setting' :
                userType === 2 ? '/dashboard/setting' :
                userType === 3 ? '/dashboard/setting' :
                ('/dashboard')
              }>{firstname} {lastname}</Link>
            <button
              className='btn-logout btn-logout-light' 
              onClick={handleLogout}>
                Logout
            </button>
          </li>
        </div>
        ):(
        <div>
          <li>
            <Link className='white-text' to='/login'>เข้าสู่ระบบ/สมัครสมาชิก</Link> 
          </li>
        </div>
        )
        }
      </ul>
      <div className='hamburger' onClick={handleClick}>
        {clicked ? (<FaTimes size={20} style={{color: "white"}} />) : (<FaBars size={20} style={{color: "white"}} />)}
      </div>
    </div>
  )
}

export default Navbar