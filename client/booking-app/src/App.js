import './App.css';
import {BrowserRouter, Routes, Route} from 'react-router-dom';
import Home from './pages/HomePage';
import Login from './pages/Login';
import Register from './pages/Register';
import SearchPage from './pages/SearchPage';
import MovieDetail from './pages/MovieDetail';
import Booking from './pages/Booking';
import TheatresShowsPage from './pages/TheatresShowsPage';
import 'react-calendar/dist/Calendar.css';

function App() {
  return (
    <div className='App'>
      
      <BrowserRouter>
      <Routes>

        <Route path='/' element={<Home/>}/>
        <Route path='/login' element={<Login/>}/>
        <Route path='/register' element={<Register/>}/>
        <Route path='/search' element={<SearchPage />}/>
        <Route path='/movie/:movieid' element = {<MovieDetail/>}/>
        <Route path='/movie/:movieid/booking' element = {<Booking/>}/>
         <Route path='/movie/:movieid/shows/:date' element={<TheatresShowsPage />} />
               

      </Routes>
      </BrowserRouter>

    </div>
    
  );
}
export default App;