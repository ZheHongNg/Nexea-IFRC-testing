import React from "react";
import "./forgetpassword.css";
import {
  FormGroup,
  Label,
  Input,
  Card,
  CardBody,
  CardTitle,
  Button,
} from "reactstrap";

const ForgotPassword = () => {
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
            Reset Password
          </CardTitle>
          <hr className="w-25 mx-auto" />
          <CardBody>
            <FormGroup>
              <Label for="exampleEmail" className="fw-bold">
                Email
              </Label>
              <Input id="exampleEmail" name="email" type="email" />
            </FormGroup>
            <Button color="primary" className="d-block mx-auto w-100 mt-4">
              Send password reset link
            </Button>
          </CardBody>
        </Card>
      </div>
    </div>
  );
};

export default ForgotPassword;
