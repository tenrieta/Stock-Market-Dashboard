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
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";

const LogIn = function LogIn() {
  // Local state for Form Data
  const [formData, setFormData] = React.useState({
    formError: null,
    formValidated: false,
    email: "",
    password: "",
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

    // Sending data to Firebase
    // When Firebase approves and logs the user in, user data is dispatched to Redux from App.jsx, where we have a listener onAuthStateChanged
    signInWithEmailAndPassword(auth, formData.email, formData.password)
      // If there is an error, we show it in the form
      .catch((firebaseError) => {
        setFormData((prevState) => ({
          ...prevState,
          formValidated: false,
          formError: `There was an error: ${firebaseError.code}.`,
        }));
        // We also set a timer to clean the error message and form validation
        setTimeout(() => {
          setFormData({
            ...formData,
            formError: "",
          });
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
              <h2 className="text-center mb-4">Log In</h2>
              {formData.formError && (
                <Alert variant="danger">{formData.formError}</Alert>
              )}
              <Form
                noValidate
                validated={formData.formValidated}
                onSubmit={handleSubmit}
              >
                <Form.Group className="mb-3">
                  <Form.Label htmlFor="email">Email</Form.Label>
                  <Form.Control
                    type="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    name="email"
                    id="email"
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label htmlFor="password">Password</Form.Label>
                  <Form.Control
                    type="password"
                    value={formData.password}
                    onChange={handleChange}
                    name="password"
                    id="password"
                  />
                </Form.Group>
                <div className="text-center">
                  <Button
                    disabled={formData.email === "" || formData.password === ""}
                    variant="primary"
                    id="submit"
                    type="submit"
                    name="submit"
                  >
                    Log In
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
export default LogIn;
