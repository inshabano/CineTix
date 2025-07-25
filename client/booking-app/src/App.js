import './App.css';
import {BrowserRouter, Routes, Route} from 'react-router-dom';
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

function App() {
    return (
        <div className='App'>
            <BrowserRouter>
             <div className="AppLayout">
                 <Navbar />
                  <main className="AppContent"> 
                <Routes>
                    <Route path='/' element={<Home/>}/>
                    <Route path='/login' element={<Login/>}/>
                    <Route path='/register' element={<Register/>}/>
                    <Route path='/search' element={<SearchPage />}/>
                    <Route path='/movie/:movieid' element = {<MovieDetail/>}/>
                    <Route path='/movie/:movieid/shows' element={<TheatresShowsPage />} />
                    <Route path='/booking/:showId' element = {<Booking/>}/>
                    <Route path="/booking-success/:bookingId" element={<BookingSuccessPage />} />
                </Routes>
                </main>
                <Footer /> {/* Footer is at the bottom */}
                 </div>
            </BrowserRouter>
        </div>
    );
}
export default App;