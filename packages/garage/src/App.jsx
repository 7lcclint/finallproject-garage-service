import { Route, Routes, BrowserRouter } from 'react-router-dom';
import './App.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import Home from './components/MainPage/Home';
import Services from './components/MainPage/Services';
import Contact from './components/MainPage/Contact';
import About from './components/MainPage/About';
import Register from './components/Authentication/Register';
import Login from './components/Authentication/Login';
import Summary from './components/Dashboard/page/summary/Summary';
import DashBoard from './components/Dashboard/DashBoard';
import Users from './components/Dashboard/page/users/Users';
import Products from './components/Dashboard/page/products/Products';
import User from './components/Dashboard/page/user/User';
import Product from './components/Dashboard/page/product/Product';
import SettingAccount from './components/Dashboard/settingAccount/SettingAccount';
import Calendar from './components/Dashboard/calendar/Calendar';
import EmployeeTable from './components/Dashboard/employeeTable/EmployeeTable';
import ReserveTable from './components/Dashboard/reserveTable/ReserveTable';
import RepairTable from './components/Dashboard/repairTable/RepairTable';
import Promotions from './components/Dashboard/promotionsTable/PromoTions';
import Reports from './components/Dashboard/reports/Reports';
import ReportsPromotions from './components/Dashboard/reportsPromotions/ReportsPromotions';
import ReportsRevenue from './components/Dashboard/reportsRevenue/ReportsRevenue';

function App() {

  const isLoggedIn = window.localStorage.getItem('isLoggedIn');

  console.log('isLoggedIn : ', isLoggedIn);

  return (
    <BrowserRouter>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/services" element={<Services />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/about" element={<About />} />
      <Route path="/register" element={<Register/>} />
      <Route path="/login" element={<Login/>} />
      {isLoggedIn ? (
        <Route path="/dashboard/*" element={<DashBoard />}>
        <Route path="summary" element={<Summary />} />
        <Route path="users" element={<Users />} />
        <Route path="products" element={<Products />} />
        <Route path="users/:id" element={<User />} />
        <Route path="products/:id" element={<Product />} />
        <Route path="setting" element={<SettingAccount />} />
        <Route path="calendar" element={<Calendar />} />
        <Route path="employee" element={<EmployeeTable />} />
        <Route path="allreserve" element={<ReserveTable />} />
        <Route path="repair" element={<RepairTable />} />
        <Route path="promotions" element={<Promotions />} />
        <Route path="reports" element={<Reports />} />
        <Route path="reportsPromotions" element={<ReportsPromotions />} />
        <Route path="reportsRevenue" element={<ReportsRevenue />} />
      </Route>
      ) : (
        <Route path="dashboard/*" element={<Home />}>
        <Route path="summary" element={<Home />} />
        <Route path="users" element={<Home />} />
        <Route path="products" element={<Home />} />
        <Route path="summary" element={<Home />} />
        <Route path="users/:id" element={<Home />} />
        <Route path="products/:id" element={<Home />} />
      </Route>
      )}
    </Routes>
    </BrowserRouter>
  )
}

export default App
