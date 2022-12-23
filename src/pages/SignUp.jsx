import React from "react";

// Bootstrap
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Alert from "react-bootstrap/Alert";

// Firebase
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";

const SignUp = function SignUp() {
  // Local state for Form Data
  const [formData, setFormData] = React.useState({
    formLoading: false,
    formError: null,
    formValidated: false,
    email: "",
    newPassword1: "",
    newPassword2: "",
  });

  // Change handler which updates local state
  // In order to make it universal for all fields, we dynamically use [fieldName]: fieldValue
  const handleChange = (event) => {
    const fieldName = event.target.name;
    const fieldValue = event.target.value;
    setFormData((prevState) => ({ ...prevState, [fieldName]: fieldValue }));
  };

  // Submit handler
  const handleSubmit = (event) => {
    // First preventing default form behavior
    event.preventDefault();

    // Validation with Bootstrap
    setFormData((prevState) => ({ ...prevState, formValidated: true }));
    if (event.currentTarget.checkValidity() === false) {
      event.stopPropagation();
      return null;
    }

    // Verification of passwords
    if (formData.password1 !== formData.password2) {
      setFormData((prevState) => ({
        ...prevState,
        formError: "The passwords don't match.",
      }));
      event.stopPropagation();
      return null;
    }

    // Loading state prevents accidental double clicks on the submit button
    setFormData((prevState) => ({ ...prevState, formLoading: true }));

    // Sending data to Firebase
    // When Firebase approves, creates account, and logs the user in, user data is dispatched to Redux from App.jsx, where we have a listener onAuthStateChanged
    createUserWithEmailAndPassword(auth, formData.email, formData.newPassword1)
      // If there is an error, we show it in the form
      .catch((firebaseError) => {
        setFormData((prevState) => ({
          ...prevState,
          formLoading: false,
          formValidated: false,
          formError: `There was an error: ${firebaseError.code}.`,
        }));
        // We also set a timer to clean the error message and form validation
        setTimeout(() => {
          setFormData((prevState) => ({ ...prevState, formError: "" }));
        }, 3000);
      });
    return null;
  };
  return (
    <Container>
      <Row className="justify-content-md-center">
        <Col className="col-lg-6 col-md-10 mx-auto">
          <Card className="mb-4">
            <Card.Body>
              <h2 className="text-center mb-4">Hello! Please sign up.</h2>
              {formData.formError && (
                <Alert variant="danger">{formData.formError}</Alert>
              )}
              <Form
                noValidate
                validated={formData.formValidated}
                onSubmit={handleSubmit}
              >
                <Form.Group id="email" className="mb-3">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    name="email"
                  />
                </Form.Group>
                <Form.Group id="password" className="mb-3">
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    type="password"
                    value={formData.newPassword1}
                    onChange={handleChange}
                    name="newPassword1"
                  />
                </Form.Group>
                <Form.Group id="password-confirm" className="mb-3">
                  <Form.Label>Password Confirmation</Form.Label>
                  <Form.Control
                    type="password"
                    value={formData.newPassword2}
                    onChange={handleChange}
                    name="newPassword2"
                  />
                </Form.Group>
                <div className="text-center">
                  <Button
                    disabled={formData.formLoading}
                    variant="primary"
                    id="submit-button"
                    type="submit"
                  >
                    Sign Up
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};
export default SignUp;
