import './App.css';
import {BrowserRouter, Routes, Route} from 'react-router-dom';
import Home from './pages/HomePage';
import Login from './pages/Login';
import Register from './pages/Register';
import SearchPage from './pages/SearchPage';

function App() {
  return (
    <div className='App'>
      
      <BrowserRouter>
      <Routes>

        <Route path='/' element={<Home/>}/>
        <Route path='/login' element={<Login/>}/>
        <Route path='/register' element={<Register/>}/>
        <Route path='/search' element={<SearchPage />}/>

      </Routes>
      </BrowserRouter>

    </div>
    
  );
}
export default App;