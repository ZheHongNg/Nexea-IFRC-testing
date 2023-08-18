import { useState, useEffect } from "react";
import Axios from "axios";
import { Alert, Card, CardBody, CardTitle, Button } from "reactstrap";
import "./confirm.css";
import { useParams, useNavigate } from "react-router-dom";

export const RegisterConfirmation = () => {
  const [error, setError] = useState("");
  const [errorVisible, setErrorVisible] = useState(false);
  const [alertVisible, setAlertVisible] = useState(false);
  const [isDisabledResend, setIsDisabledResend] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [disableCount, setDisableCount] = useState(60);

  const navigate = useNavigate();
  const params = useParams();

  let template;

  const resendConfEmail = async () => {
    try {
      await Axios.post("/api/register/resendConfirm", {
        confirmationCode: params.confirmationCode,
      });

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
        setError(
          (prev) => err.response.status + " " + err.response.status.text
        );
      }

      setAlertVisible(false);
      setErrorVisible(true);
    }
  };

  useEffect(() => {
    Axios.get(`/api/register/confirm/${params.confirmationCode}`)
      .catch((err) => {
        if (err.response.data.message) {
          setError((prev) => err.response.data.message);
        } else {
          setError(
            (prev) => err.response.status + " " + err.response.statusText
          );
        }
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  if (isLoading) {
    template = (
      <CardBody>
        <div className="text-center">
          <div className="text">
            <p>Loading...</p>
          </div>
        </div>
      </CardBody>
    );
  } else if (!error) {
    template = (
      <CardBody>
        <div className="text-center">
          <div className="confirm ">
            <img className="confirm" src="/images/confirm.svg" alt="confirm" />
          </div>
          <div className="text">
            <p>Your email has been verified!</p>
          </div>
          <Button
            color="primary"
            className="px-3 rounded-pill"
            onClick={() => navigate("/login")}
          >
            Login
          </Button>
        </div>
      </CardBody>
    );
  } else if (error === "User Not found.") {
    template = (
      <CardBody className="pt-1">
        <div className="text text-center">
          <p className="text-danger fs-4">{error}</p>
          <p>User with this verification code not found! </p>
          <p>Please check whether you have registered/verified your account</p>
          <p>Otherwise, check for the latest verification email</p>
          <Button
            color="primary"
            className="px-4 rounded-pill"
            onClick={() => navigate("/login")}
          >
            Login
          </Button>
        </div>
      </CardBody>
    );
  } else if (error === "Confirmation Code Expired!") {
    template = (
      <CardBody>
        <div className="text text-center">
          <p className="text-danger fs-4">{error}</p>
          <p>
            Please resend the verification email by clicking the button below
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
              Please wait {disableCount} to resend the verification email again!
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
    );
  } else {
    template = (
      <CardBody>
        <div className="text text-center">
          <p className="text-danger fs-4">{error}</p>
          {error === "502 Bad Gateway" || error === "No changes made." ? (
            <></>
          ) : (
            <Button
              color="primary"
              className="px-4 rounded-pill"
              onClick={() => {
                navigate("/register");
              }}
            >
              Retry Register
            </Button>
          )}
        </div>
      </CardBody>
    );
  }

  return (
    <div className="forget-password">
      <h4>
        <img src="/images/ifrc.svg" alt="ifrc-logo" className="ifrc-logo" />
        <strong className="mx-2">IFRC Desk Booking</strong>
      </h4>
      <div className="box p-3">
        <Card
          className="mx-auto p-3 shadow bg-body rounded"
          style={{ maxWidth: "25rem" }}
        >
          <CardTitle tag="h5" className="fw-bold mb-1">
            Confirmation
          </CardTitle>
          <hr className="w-25 mx-auto" />
          {template}
        </Card>
      </div>
    </div>
  );
};
