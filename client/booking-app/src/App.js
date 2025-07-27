import './App.css';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/navbar';
import Footer from './components/footer';
import Home from './pages/HomePage';
import Login from './pages/Login';
import Register from './pages/Register';
import SearchPage from './pages/SearchPage';
import MovieDetail from './pages/MovieDetail';
import Booking from './pages/Booking';
import TheatresShowsPage from './pages/TheatresShowsPage';
import BookingSuccessPage from './pages/BookingSuccess';
import 'react-calendar/dist/Calendar.css';
import MyBookings from './pages/myBooking';
import Watchlist from './pages/Watchlist';
import MyProfile from './pages/MyProfile';

const Layout = ({ children }) => {
    const location = useLocation();
    const noNavFooterPaths = ['/login', '/register'];
    const showNavFooter = !noNavFooterPaths.includes(location.pathname);

    return (
        <div className="AppLayout">
            {showNavFooter && <Navbar />}
            <main className="AppContent">
                {children} 
            </main>
            {showNavFooter && <Footer />}
        </div>
    );
};

function App() {
    return (
        <div className='App'>
            <BrowserRouter>
                <Layout>
                    <Routes>
                        <Route path='/' element={<Home/>}/>
                        <Route path='/login' element={<Login/>}/>
                        <Route path='/register' element={<Register/>}/>
                        <Route path='/search' element={<SearchPage />}/>
                        <Route path='/movie/:movieid' element = {<MovieDetail/>}/>
                        <Route path='/movie/:movieid/shows' element={<TheatresShowsPage />} />
                        <Route path='/booking/:showId' element = {<Booking/>}/>
                        <Route path="/booking-success/:bookingId" element={<BookingSuccessPage />} />
                        <Route path="/mybookings" element={<MyBookings/>} />
                        <Route path="/my-watchlist" element={<Watchlist />} />
                        <Route path="/my-profile" element={<MyProfile />} />
                    </Routes>
                </Layout>
            </BrowserRouter>
        </div>
    );
}

export default App;