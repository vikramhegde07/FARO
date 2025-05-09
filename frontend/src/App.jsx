import { useEffect, useState } from 'react'
import { Routes, Route } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';
import Navbar from './Components/Navbar';
import Footer from './Components/Footer';
import Home from './Pages/Home';
import Island from './Pages/Island';
import Login from './Pages/Login';
import About from './Pages/About';
import Account from './Pages/Account';
import Islands from './Pages/Islands';
import Article from './Pages/Article';
import CreateArticle from './Pages/CreateArticle';
import ArticleBuilder from './Components/ArticleBuilder';
import DocxUploader from './Components/DocxUploader';
import AdminSideBar from './Components/AdminSideBar';

function App() {
  const [logged, setLogged] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  const location = useLocation();
  const hideNavAndFooter = location.pathname === '/login';

  function checkUserLogin() {
    const token = localStorage.getItem('faro-user');

    if (token == null) {
      setLogged(false);
      setIsAdmin(false)
    }
    else {
      setLogged(true);
      const userType = localStorage.getItem('faro-user-type');
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
      {isAdmin && <AdminSideBar refresh={checkUserLogin} />}

      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/login' element={<Login refresh={checkUserLogin} />} />
        <Route path='/islands' element={<Islands />} />
        <Route path='/about' element={<About />} />
        <Route path='/account' element={<Account refresh={checkUserLogin} />} />
        <Route path='/createArticle' element={<CreateArticle />} />
        <Route path='/createArticle/builder' element={<ArticleBuilder />} />
        <Route path='/createArticle/parseDocx' element={<DocxUploader />} />
        <Route path='/island/:id' element={<Island logged={logged} />} />
        <Route path='/article/:id' element={<Article />} />
      </Routes>

      {!isAdmin && !hideNavAndFooter && <Footer />}
      <ToastContainer position="top-right" autoClose={3000} />
    </>
  )
}

export default App
