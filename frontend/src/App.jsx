import { useEffect, useState } from 'react'
import { Routes, Route, useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';

//importing user components
import Navbar from './Components/Navbar';
import Footer from './Components/Footer';
import ArticleBuilder from './Components/ArticleBuilder';
import DocxUploader from './Components/DocxUploader';

//importing user pages
import Home from './Pages/Home';
import Island from './Pages/Island';
import Login from './Pages/Login';
import About from './Pages/About';
import Account from './Pages/Account';
import Islands from './Pages/Islands';
import Article from './Pages/Article';
import CreateArticle from './Pages/CreateArticle';

//importing admin components
import AdminAllArticles from './admin/components/AllArticles';
import AdminArticle from './admin/components/Article';
import AdminSidebar from './admin/components/Sidebar';

//importing admin pages
import AdminDashBoard from './admin/DashBoard';
import AdminIslands from './admin/Islands';
import AdminPrivillages from './admin/Privillage';
import AdminProfile from './admin/Profile';
import AdminSettings from './admin/Settings';
import AdminUsers from './admin/Users';
import axios from 'axios';
import API_BASE from './API';


function App() {
  const [logged, setLogged] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  const navigator = useNavigate();
  const location = useLocation();
  const hideNavAndFooter = location.pathname.includes('/admin');

  function checkUserLogin() {
    const token = localStorage.getItem('faro-user');

    if (token == null) {
      setLogged(false);
      setIsAdmin(false);
      navigator('/');
    }
    else {
      setLogged(true);
      const userType = JSON.parse(localStorage.getItem('faro-user-info')).user_type;
      if (userType == 'admin')
        setIsAdmin(true);
      else
        setIsAdmin(false);
    }
  }

  useEffect(() => {
    checkUserLogin();
  }, [])

  return (
    <>
      {!isAdmin && !hideNavAndFooter && <Navbar logged={logged} />}
      {isAdmin && <AdminSidebar refresh={checkUserLogin} />}

      <Routes>

        {/* user routes */}
        <Route path='/' element={<Home />} />
        <Route path='/login' element={<Login refresh={checkUserLogin} />} />
        <Route path='/islands' element={<Islands />} />
        <Route path='/about' element={<About />} />
        <Route path='/account' element={<Account refresh={checkUserLogin} />} />
        <Route path='/island/:id' element={<Island logged={logged} />} />
        <Route path='/article/:id' element={<Article />} />
        {/* routes for author */}
        <Route path='/createArticle' element={<CreateArticle />} />
        <Route path='/createArticle/builder' element={<ArticleBuilder />} />
        <Route path='/createArticle/parseDocx' element={<DocxUploader />} />
        {/* end of routes for authors  */}
        {/* end of user routes  */}
        {/* admin routes  */}
        <Route path='/admin' element={<AdminDashBoard />} />
        <Route path='/admin/Islands' element={<AdminIslands />} />
        <Route path='/admin/island/:id' element={<AdminAllArticles />} />
        <Route path='/admin/privillage' element={<AdminPrivillages />} />
        <Route path='/admin/profile' element={<AdminProfile />} />
        <Route path='/admin/settings' element={<AdminSettings />} />
        <Route path='/admin/users' element={<AdminUsers />} />
        <Route path='/admin/article/:id' element={<AdminArticle />} />
        {/* end of admin routes  */}
      </Routes>

      {!isAdmin && !hideNavAndFooter && <Footer />}
      <ToastContainer position="top-right" autoClose={3000} />
    </>
  )
}

export default App
