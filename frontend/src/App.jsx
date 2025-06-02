import { useEffect, useState } from 'react'
import { Routes, Route, useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';

//importing loading animation and context
import { LoadingProvider, useLoading } from './Context/LoadingContext';
import LoadingAnimation from './Components/LoadingAnimation';

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
import Event from './Pages/Event';
import EventDetails from './Pages/EventDetails';
import Samples from './Pages/Samples';
import Profile from './Pages/Profile';
import Privillage from './Pages/Privillage';
import Review from './Pages/Review';

//importing admin components
import AdminIslandArticles from './admin/components/IslandArticles';
import AdminArticle from './admin/components/Article';
import AdminSidebar from './admin/components/Sidebar';
import AdminAddEvent from './admin/components/AddEvent';
import AdminArticleEditor from './admin/components/ArticleLoader';

//importing admin pages
import AdminDashBoard from './admin/DashBoard';
import AdminIslands from './admin/Islands';
import AdminPrivillages from './admin/Privillage';
import AdminProfile from './admin/Profile';
import AdminSettings from './admin/Settings';
import AdminUsers from './admin/Users';
import AdminEvents from './admin/Events';
import AdminAllArticles from './admin/AllArticles';
import AdminEventDetails from './admin/EventDetails';



function App() {
  const [logged, setLogged] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const { isLoading } = useLoading();
  const navigator = useNavigate();
  const location = useLocation();

  const hiddenRoutes = ['/admin', '/login'];
  const hideNavAndFooter = hiddenRoutes.some((route) => location.pathname.includes(route));

  function checkUserLogin() {
    const token = localStorage.getItem('faro-user');

    if (token == null) {
      setLogged(false);
      setIsAdmin(false);
      if (location.pathname.includes('/admin'))
        navigator('/');
    }
    else {
      setLogged(true);
      const userType = JSON.parse(localStorage.getItem('faro-user-info')).user_type;
      if (userType == 'admin') {
        setIsAdmin(true);
        if (!location.pathname.includes('/admin'))
          navigator('/admin');
      }
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
        <Route path='/' element={<Home logged={logged} />} />
        <Route path='/login' element={<Login refresh={checkUserLogin} />} />
        <Route path='/islands' element={<Islands />} />
        <Route path='/about' element={<About />} />
        <Route path='/account' element={<Account refresh={checkUserLogin} />} />
        <Route path='/account/profile' element={<Profile />} />
        <Route path='/account/privillage' element={<Privillage />} />
        <Route path='/island/:islandId' element={<Island logged={logged} />} />
        <Route path='/article/:id' element={<Article />} />
        <Route path='/samples' element={<Samples />} />
        <Route path='/events' element={<Event />} />
        <Route path='/review' element={<Review />} />
        <Route path='/event/:eventId' element={<EventDetails />} />

        {/* routes for author */}
        <Route path='/createArticle' element={<CreateArticle />} />
        <Route path='/createArticle/builder' element={<ArticleBuilder />} />
        <Route path='/createArticle/parseDocx' element={<DocxUploader />} />
        {/* end of routes for authors  */}
        {/* end of user routes  */}

        {/* admin routes  */}
        <Route path='/admin' element={<AdminDashBoard />} />
        <Route path='/admin/Islands' element={<AdminIslands />} />
        <Route path='/admin/island/:id' element={<AdminIslandArticles />} />
        <Route path='/admin/privillage' element={<AdminPrivillages />} />
        <Route path='/admin/profile' element={<AdminProfile />} />
        <Route path='/admin/settings' element={<AdminSettings />} />
        <Route path='/admin/users' element={<AdminUsers />} />
        <Route path='/admin/article/:id' element={<AdminArticle />} />
        <Route path='/admin/edit/:articleId' element={<AdminArticleEditor />} />
        <Route path='/admin/articles/' element={<AdminAllArticles />} />
        <Route path='/admin/events/' element={<AdminEvents />} />
        <Route path='/admin/event/:eventId' element={<AdminEventDetails />} />
        <Route path='/admin/addEvent/' element={<AdminAddEvent />} />
        {/* end of admin routes  */}
      </Routes>

      {!isAdmin && !hideNavAndFooter && <Footer />}
      <ToastContainer position="top-right" autoClose={3000} />
      {isLoading && <LoadingAnimation />}
    </>
  )
}

export default App
