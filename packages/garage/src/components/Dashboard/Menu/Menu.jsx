import { Link } from "react-router-dom";
import "./menu.css";
import profile from '../../../../public/profile.svg'
import user from '../../../../public/user.svg'
import products from '../../../../public/chart.svg'
import orders from '../../../../public/order.svg'
import calendar from '../../../../public/calendar.svg'
import home from '../../../../public/home.svg'
import axios from "axios";
import { useEffect, useState } from "react";

const Menu = () => {

  const [ userType, setUserType ] = useState();
  const [ auth, setAuth] = useState(false);
  
  axios.defaults.withCredentials = true;
    useEffect(() => {
      axios.get('http://localhost:3456/')
      .then(response => {
        console.log(response)
        if (response.data.Status === "Successfully"){
          setAuth(true);
          window.localStorage.setItem('isLoggedIn', true);
          setUserType(response.data.user_type);
          console.log(userType);
          console.log('ID :',response.data.user_id);
        }else{
          setAuth(false);
          console.log(auth)
          console.log(response.data.Error)
        }
      })
      .then(error => console.log(error));
    }, [auth]);

    const handleLogout = () => {
      axios.defaults.withCredentials = true;
      axios.get('http://localhost:3456/logout')
      .then(response =>{
        window.localStorage.removeItem('isLoggedIn');
        location.reload(true);
        console.log(response);
      }).catch(error => console.log(error));
    }
    

  return (
    <div>
      {userType === 1 ? 
        <div className="menu">
        <div className="item" key={1}>
          <span className="title">Main</span>
            <Link to='setting' className="listItem">
              <img src={profile} alt="" />
              <span className="listItemTitle">Profile</span>
            </Link>
            <Link to='calendar' className="listItem">
              <img src={calendar} alt="" />
              <span className="listItemTitle">Calendar</span>
            </Link>
            <Link onClick={handleLogout} className="listItem">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              height="1em" 
              viewBox="0 0 512 512"
              fill="#ffffff"
              style={{height: '1.5rem'}}>
                <path d="M502.6 278.6c12.5-12.5 12.5-32.8 0-45.3l-128-128c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L402.7 224 192 224c-17.7 0-32 14.3-32 32s14.3 32 32 32l210.7 0-73.4 73.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l128-128zM160 96c17.7 0 32-14.3 32-32s-14.3-32-32-32L96 32C43 32 0 75 0 128L0 384c0 53 43 96 96 96l64 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-64 0c-17.7 0-32-14.3-32-32l0-256c0-17.7 14.3-32 32-32l64 0z"/></svg>
              <span className="listItemTitle">Logout</span>
            </Link>
        </div> 
      </div>
      : 
      <div className="menu">
        <div className="item" key={1}>
          <span className="title">Main</span>
            <Link to='summary' className="listItem">
              <img src={home} alt="" />
              <span className="listItemTitle">Summary</span>
            </Link>
            <Link to='setting' className="listItem">
              <img src={profile} alt="" />
              <span className="listItemTitle">Profile</span>
            </Link>
            <span className="title">lists</span>
            <Link to='users' className="listItem">
              <img src={user} alt="" />
              <span className="listItemTitle">User</span>
            </Link>
            <Link to='products' className="listItem">
              <img src={products} alt="" />
              <span className="listItemTitle">Products</span>
            </Link>
            <span className="title">general</span>
            <Link to='' className="listItem">
              <img src={orders} alt="" />
              <span className="listItemTitle">Orders</span>
            </Link>
            <Link to='' className="listItem">
              <img src={calendar} alt="" />
              <span className="listItemTitle">Calendar</span>
            </Link>
        </div> 
      </div>
      }
    </div>
    
  );
};

export default Menu;
