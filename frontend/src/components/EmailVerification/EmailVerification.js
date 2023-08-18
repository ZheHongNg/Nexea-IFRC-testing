import "./emailverification.css";
import { useState } from "react";
import { Card, CardBody, CardTitle, Button, Alert } from "reactstrap";
import { useLocation } from "react-router-dom";
import Axios from "axios";

const EmailVerification = () => {
  let data = useLocation();
  let email = data.state?.email || "";
  const [error, setError] = useState("");
  const [errorVisible, setErrorVisible] = useState(false);
  const [alertVisible, setAlertVisible] = useState(false);
  const [isDisabledResend, setIsDisabledResend] = useState(false);
  const [disableCount, setDisableCount] = useState(60);

  const resendConfEmail = async () => {
    try {
      await Axios.post("/api/register/resendConfirm", { email });

      setIsDisabledResend(true);
      let counter = disableCount;
      setTimeout(() => {
        setIsDisabledResend(false);
      }, 60000);

      const countdown = setInterval(() => {
        counter--;
        setDisableCount(counter);
        if (counter === 0) {
          clearInterval(countdown);
          setDisableCount(60);
        }
      }, 1000);

      setAlertVisible(true);
      setTimeout(() => {
        setAlertVisible(false);
      }, 5000);
    } catch (err) {
      if (err.response.data.message) {
        setError((prev) => err.response.data.message);
      } else {
        setError((prev) => err.response.status + " " + err.response.statusText);
      }

      setAlertVisible(false);
      setErrorVisible(true);
    }
  };

  return (
    <div className="email-verif">
      <h4>
        <img src="/images/ifrc.svg" alt="ifrc-logo" className="ifrc-logo" />
        <strong className="mx-2">IFRC Desk Booking</strong>
      </h4>
      <div className="box p-3">
        <Card
          className="mx-auto p-3 shadow bg-body rounded"
          style={{ maxWidth: "32.5rem" }}
        >
          <CardTitle tag="h5" className="fw-bold mb-0">
            Email Verification
          </CardTitle>
          <hr className="w-25 mx-auto mb-1" />
          <CardBody className="py-0">
            <img
              src="/images/icons8-email-48.png"
              alt="email"
              width="72px"
              height="72px"
              className="mx-auto d-block"
            />

            <div className="text">
              <p className="p-body mb-0">
                An email has been sent to{" "}
                <a
                  href="https://mail.google.com/mail/u/0/#inbox"
                  target="_blank"
                >
                  {email}
                </a>
              </p>
              <p className="p-body">
                Please click the link in your email inbox to confirm the
                registration!
              </p>
              <p className="p-foot">
                If you don't see the email, check your spam folder or click the
                button below to resend verification email
              </p>
              <Button
                color="primary"
                className="px-4 rounded-pill"
                onClick={() => {
                  resendConfEmail();
                }}
                disabled={isDisabledResend}
              >
                Resend Verification Email
              </Button>
              {isDisabledResend && (
                <p className="p-foot mt-1">
                  Please wait {disableCount} to resend the verification email
                  again!
                </p>
              )}
              <Alert className="mt-2 p-2" isOpen={alertVisible}>
                Verification email has been resent!
              </Alert>
              <Alert
                className="mt-2"
                color="danger"
                isOpen={errorVisible}
                toggle={() => setErrorVisible(false)}
              >
                {error}
              </Alert>
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
};

export default EmailVerification;
