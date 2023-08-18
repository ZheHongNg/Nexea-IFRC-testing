import "./App.css";
import { Route, Routes, Link } from "react-router-dom";
import Register from "./components/Register/Register";
import Login from "./components/Login/Login";
import ForgotPassword from "./components/Forgetpassword/ForgetPassword";
import { RegisterConfirmation } from "./components/RegisterConfirmation/RegisterConfirmation";
import EmailVerification from "./components/EmailVerification/EmailVerification";
import Homepage from "./components/Homepage/Homepage";

function App() {
  return (
    <>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forget-password" element={<ForgotPassword />} />
        <Route
          path="/register-confirm/:confirmationCode"
          element={<RegisterConfirmation />}
        />
        <Route path="/email-verification" element={<EmailVerification />} />
        <Route path = "/homepage" element={<Homepage/>}/>
      </Routes>
    </>
  );
}

export default App;
