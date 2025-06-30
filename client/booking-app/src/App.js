import './App.css';
import {BrowserRouter, Routes, Route} from 'react-router-dom';
import Home from './pages/HomePage';
import Login from './pages/Login';
import Register from './pages/Register';
import SearchPage from './pages/SearchPage';
import MovieDetail from './pages/MovieDetail';

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

      </Routes>
      </BrowserRouter>

    </div>
    
  );
}
export default App;