import Menu from '../Menu/Menu'
import Navbar from '../navbar/Navbar'
import '../style/dashboardGlobal.css'
import {Outlet} from "react-router-dom";


function DashBoard() {
  const Layout = () => {
    return (
      <div className="dashboard-main">
        <Navbar />
        <div className="dashboard-container">
          <div className="menuContainer">
            <Menu />
          </div>
          <div className="contentContainer">
            <Outlet />
          </div>
        </div>
      </div>
    );
  };

  return <Layout/>
}

export default DashBoard
