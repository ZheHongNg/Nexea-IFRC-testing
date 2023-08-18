import React from "react";
import "./login.css";
import {
  FormGroup,
  Label,
  Input,
  Card,
  CardBody,
  CardTitle,
  Button,
  Form,
  Spinner,
} from "reactstrap";
import { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

const Login = () => {
  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState({});
  const [isSubmit, setIsSubmit] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("/api/login/get-cookie")
      .then((response) => {
        const cookieValue = response.data.value;
        if (cookieValue) {
          navigate("/homepage");
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  function handleChange(e) {
    const { name, value } = e.target;
    setCredentials((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  const handleRememberMe = () => {
    setRememberMe(!rememberMe);
  };

  useEffect(() => {
    if (Object.keys(error).length === 0 && isSubmit) {
      console.log(credentials);
    }
  }, [error]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate(credentials);

    if (Object.keys(validationErrors).length > 0) {
      setError(validationErrors);
    } else {
      setIsSubmit(true);
      loginUser();
    }
  };

  const validate = (values) => {
    const errors = {};
    if (!values.email) {
      errors.email = "Email is required";
    }

    if (!values.password) {
      errors.password = "Password is required";
    }

    return errors;
  };

  const errorStyle = {
    fontSize: "11px",
    color: "red",
    marginTop: "11px",
  };

  const loginUser = async () => {
    try {
      const response = await axios.post("/api/login/login-user", {
        ...credentials,
        rememberMe,
      });
      setIsSubmit(false);
      if (rememberMe) {
        document.cookie = `jwt_token=${response.data.token}; max-age=86400; path=/`;
      }
      return navigate("/homepage", {
        state: { email: credentials.email },
      });
    } catch (error) {
      console.log(error);
      setIsSubmit(false);
      const { data } = error.response;
      for (let x in data) {
        setError((prev) => ({
          ...prev,
          [Object.keys(data[x])]: Object.values(data[x]),
          email:
            data.message === "User does not exist" ? "User does not exist" : "",
          password: data.message === "Wrong password" ? "Wrong password" : "",
          activated:
            data.message === "Pending Account. Please Verify Your Email!"
              ? "Pending Account. Please Verify Your Email!"
              : "",
        }));
      }
      return;
    }
  };

  return (
    <div className="login">
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
            Login
          </CardTitle>
          <hr className="w-25 mx-auto" />
          <CardBody>
            <Form onSubmit={handleSubmit}>
              <FormGroup>
                <Label for="email" className="fw-bold">
                  Email
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  onChange={handleChange}
                />
                {error.email && <span style={errorStyle}>{error.email}</span>}
                {error.activated && (
                  <span style={errorStyle}>{error.activated}</span>
                )}
              </FormGroup>
              <FormGroup>
                <Label for="password" className="fw-bold">
                  Password
                </Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  onChange={handleChange}
                />
                {error.password && (
                  <span style={errorStyle}>{error.password}</span>
                )}
              </FormGroup>
              <FormGroup check inline className="mt-4">
                <Input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={handleRememberMe}
                />
                <Label check>Remember me</Label>
              </FormGroup>
              <Button
                color="primary"
                type="submit"
                className="d-block mx-auto w-100 mt-4"
              >
                {isSubmit ? (
                  <Spinner size="sm">Loading...</Spinner>
                ) : (
                  <span>Login</span>
                )}
              </Button>
            </Form>
            <Link
              to="/forget-password"
              style={{ textDecoration: "none" }}
              className="text-center"
            >
              <h6 className="mt-4">Forget your password ?</h6>
            </Link>
            <div className="text-center mt-4">
              <span className="d-inline">Don't have account ? </span>
              <Link
                to="/register"
                style={{ textDecoration: "none" }}
                className="text-center"
              >
                <h6 className="mt-4 d-inline">Register</h6>
              </Link>
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
};

export default Login;
