import React from "react";
import { useDispatch, useSelector } from "react-redux";

// Bootstrap
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import FormControl from "react-bootstrap/FormControl";
import Button from "react-bootstrap/Button";
import Alert from "react-bootstrap/Alert";

// Firebase
import { signOut } from "firebase/auth";
import { auth } from "../firebase";

// Redux
import { updateUser } from "../actions/userActions";

const Profile = function Profile() {
  // Get state for currentUser from Redux
  const currentUser = useSelector((state) => state.currentUser);
  // Get dispatch for updating the state
  const dispatch = useDispatch();

  // Local state for Form Data
  const [formData, setFormData] = React.useState({
    formLoading: false,
    formError: null,
    formSuccess: null,
    formValidated: false,
    email: currentUser.email || "",
    displayName: currentUser.displayName || "",
    photoURL: currentUser.photoURL || "",
    newPassword1: "",
    newPassword2: "",
    oldPassword: "",
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

    // Verification of passwords. Password is updated only when filled out.
    if (
      (formData.newPassword1 || formData.newPassword2) &&
      formData.newPassword1 !== formData.newPassword2
    ) {
      setFormData((prevState) => ({
        ...prevState,
        formError: "The passwords don't match.",
      }));
      return null;
    }

    // Loading state prevents accidental double clicks on the submit button
    setFormData((prevState) => ({ ...prevState, formLoading: true }));

    // We send the data to the Action Creator, which takes care of the async connection with Firebase and Firestore
    // The Action creator then dispatches the action to Redux
    dispatch(updateUser(formData, setFormData, currentUser.firestore));

    return null;
  };

  // Sign out
  // When Firebase signs the user out, nulled user data is dispatched to Redux from App.jsx, where we have a listener onAuthStateChanged
  const handleSignout = () => {
    signOut(auth);
  };

  return (
    <Container>
      <Row className="justify-content-md-center">
        <Col className="col-lg-6 col-md-10 mx-auto">
          <Card className="mb-4">
            <Card.Body>
              <h2 className="text-center mb-4" id="profile">
                Update Profile
              </h2>
              {formData.formError && (
                <Alert variant="danger">{formData.formError}</Alert>
              )}
              {formData.formSuccess && (
                <Alert variant="success">{formData.formSuccess}</Alert>
              )}
              <Form
                noValidate
                validated={formData.formValidated}
                onSubmit={handleSubmit}
              >
                <Form.Group className="mb-3">
                  <Form.Label>Email</Form.Label>
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
                  <Form.Label>Display Name</Form.Label>
                  <Form.Control
                    type="text"
                    required
                    value={formData.displayName}
                    onChange={handleChange}
                    name="displayName"
                    id="displayName"
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Photo URL</Form.Label>
                  <Form.Control
                    type="text"
                    value={formData.photoURL}
                    onChange={handleChange}
                    name="photoURL"
                    id="photoURL"
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    type="password"
                    value={formData.newPassword1}
                    onChange={handleChange}
                    name="newPassword1"
                    id="newPassword1"
                    placeholder="Leave blank to keep the same"
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Password Confirmation</Form.Label>
                  <Form.Control
                    type="password"
                    value={formData.newPassword2}
                    onChange={handleChange}
                    name="newPassword2"
                    id="newPassword2"
                    placeholder="Leave blank to keep the same"
                  />
                </Form.Group>
                <p className="text-center fs-4 mb-3">
                  Ready to update your profile?
                </p>
                <p className="text-center mb-3">
                  To save changes, please verify your old password.
                </p>
                <InputGroup className="mb-3">
                  <FormControl
                    placeholder="Your old password"
                    required
                    type="password"
                    name="oldPassword"
                    id="oldPassword"
                    value={formData.oldPassword}
                    onChange={handleChange}
                    role="textbox"
                    title="oldPassword"
                  />
                  <Button
                    disabled={
                      formData.formLoading || formData.oldPassword === ""
                    }
                    variant="primary"
                    id="submit-button"
                    type="submit"
                  >
                    Update your profile
                  </Button>
                </InputGroup>
              </Form>
              <div className="text-center mb-3">
                <div className="fs-4 mb-3">Ready to leave?</div>
                <Button
                  className=""
                  variant="outline-secondary"
                  type="button"
                  onClick={handleSignout}
                  id="sign-out"
                >
                  Sign out
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};
export default Profile;
