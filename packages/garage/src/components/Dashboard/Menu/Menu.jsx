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
