import { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css'
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import AuthService from './services/auth-service';
import eventBus from './common/eventBus';

import RegisterForm from './components/register-form';
import LoginForm from './components/login-form';
import Homepage from './components/HomePage';




function App() {
  const [showSuperAdminBoard, setShowSuperAdminBoard] = useState('')
  const [showAdminBoard, setShowAdminBoard] = useState('')
  const [currentUser, setCurrentUser] = useState('')

  useEffect(() => {
    const user = AuthService.getCurrentUser()

    if (user) {
      setCurrentUser(user)
      setShowSuperAdminBoard(user.roles.includes('ROLE_SUPERADMIN'))
      setShowAdminBoard(user.roles.includes('ROLE_ADMIN'))
    }

    eventBus.on('logout', () => {
      logOut()
    })

    return () => {
      eventBus.remove('logout')
    }
  }, [])

  function logOut() {
    AuthService.logout()
    setShowSuperAdminBoard(false)
    setShowAdminBoard(false)
    setCurrentUser(undefined)
  }

  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={<LoginForm />}></Route>
          <Route path="/login" element={<LoginForm />}></Route>
          <Route path="/register" element={<RegisterForm />}></Route>
          <Route path="/home page" element={<Homepage />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
