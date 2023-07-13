import logo from './logo.svg';
import './App.css';
import RegisterForm from './component/register-form';
import LoginForm from './component/login-form';
import Homepage from './component/HomePage';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={<LoginForm/>}></Route>
          <Route path="/register" element={<RegisterForm/>}></Route>
          <Route path="/home page" element={<Homepage/>}/>
        </Routes>
      </Router>
    </div>
  );
}

export default App;
