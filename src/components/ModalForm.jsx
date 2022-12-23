import React from "react";
import { useSelector, useDispatch } from "react-redux";

// Bootstrap
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import Button from "react-bootstrap/Button";

// Modal
import Modal from "react-modal";
import modalStyles from "../../data/modalStyles";

// Firestore
import { saveFirestore } from "../firebase";

// Redux
import { setUser } from "../actions/userActions";

// Modal readability
if (process.env.NODE_ENV !== "test") Modal.setAppElement("#app");

// Simple utility function
export const roundTwoDecimals = (value) =>
  Math.round(Number(value) * 100) / 100;

// Component
const ModalForm = function ModalForm({ modalStatus, setModalStatus }) {
  // Connection to Redux
  const currentUser = useSelector((state) => state.currentUser);
  const stockData = useSelector((state) => state.stockData);
  const dispatch = useDispatch();

  // Props for Modal visibility and active Stock symbol
  // They come from the local state of the parent element (Table)
  const { modalOpened, activeStock } = modalStatus;

  // Local state for Form
  const [formData, setFormData] = React.useState({
    numberOfStocks: 0,
    finalAmount: 0,
    wallet: 1000,
    units: 0,
    unitPrice: 0,
  });

  React.useEffect(() => {
    // Update local state for form
    // We have to do it with useEffect because of async nature of Firestore
    // And also because we can use the dependencies to update the state when for example activeStock changes
    setFormData({
      numberOfStocks: 0,
      finalAmount: 0,
      wallet: currentUser.firestore?.wallet || 1000,
      units: currentUser.firestore?.stockUnits?.[activeStock] || 0,
      unitPrice: stockData?.[activeStock]?.seriesCandle[0]?.data[0]?.y[3]
        ? roundTwoDecimals(stockData[activeStock].seriesCandle[0].data[0].y[3])
        : 0,
    });
  }, [activeStock, currentUser.firestore, stockData]);

  // Change handler
  const handleChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      numberOfStocks: e.target.value,
      finalAmount: roundTwoDecimals(
        formData.unitPrice * Number(e.target.value)
      ),
    }));
  };

  // Submit handler
  // We use the same handler for Buy and Sell stock, we receive the desired action as a parameter
  const handleSubmit = (type) => {
    const prevUnits = formData.units || 0;

    // We calculate new Wallet and new Number of Stocks based on the desired action
    const newWallet =
      type === "buy"
        ? roundTwoDecimals(formData.wallet - Number(formData.finalAmount))
        : roundTwoDecimals(formData.wallet + Number(formData.finalAmount));
    const newNumberOfStocks =
      type === "buy"
        ? prevUnits + Number(formData.numberOfStocks)
        : prevUnits - Number(formData.numberOfStocks);

    // Composing data for Firestore
    const dataForFirestore = {
      wallet: newWallet,
      stockUnits: {
        ...currentUser.firestore.stockUnits,
        [activeStock]: Math.round(newNumberOfStocks),
      },
    };

    // Saving Firestore
    saveFirestore(dataForFirestore).then(() => {
      // After Firestore saves the data, we dispatch them to Redux to update the state as well
      const data = {
        ...currentUser,
        firestore: dataForFirestore,
      };
      dispatch(setUser(data));
    });
  };
  return (
    <Modal isOpen={modalOpened} style={modalStyles}>
      <Container>
        <Row className="justify-content-md-center">
          <Col className="mx-auto mb-4">
            <Form>
              <h2 className="text-center mb-3">{activeStock}</h2>
              <Row>
                <Col>
                  <Form.Group className="mb-3">
                    <Form.Label>Current price per unit</Form.Label>
                    <InputGroup>
                      <InputGroup.Text id="basic-addon1">$</InputGroup.Text>
                      <Form.Control
                        placeholder="Disabled input"
                        value={formData.unitPrice}
                        disabled
                      />
                    </InputGroup>
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group className="mb-3">
                    <Form.Label>In your portfolio</Form.Label>
                    <Form.Control
                      placeholder="Disabled input"
                      value={formData.units}
                      disabled
                    />
                  </Form.Group>
                </Col>
              </Row>
              <Form.Group className="mb-3">
                <Form.Label>Quantity to buy/sell</Form.Label>
                <Form.Control
                  value={formData.numberOfStocks}
                  onChange={handleChange}
                  name="numberOfStocks"
                  type="number"
                />
              </Form.Group>
              <Row>
                <Col>
                  <Form.Group className="mb-3">
                    <Form.Label>Your current cash</Form.Label>
                    <InputGroup>
                      <InputGroup.Text id="basic-addon1">$</InputGroup.Text>
                      <Form.Control value={formData.wallet} disabled />
                    </InputGroup>
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group className="mb-3">
                    <Form.Label>Expected change</Form.Label>
                    <InputGroup>
                      <InputGroup.Text id="basic-addon1">$</InputGroup.Text>
                      <Form.Control value={formData.finalAmount} disabled />
                    </InputGroup>
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Col>
                  <Button
                    onClick={() =>
                      setModalStatus({
                        modalOpened: false,
                        activeStock: null,
                      })
                    }
                    variant="secondary"
                    className="col-12"
                  >
                    Cancel
                  </Button>
                </Col>
                <Col>
                  <Button
                    disabled={
                      /* we keep the button disabled till the action makes sense */
                      formData.numberOfStocks < 1 ||
                      formData.finalAmount > formData.wallet
                    }
                    onClick={() => handleSubmit("buy")}
                    variant="success"
                    className="col-12"
                    type="button"
                  >
                    Buy
                  </Button>
                </Col>
                <Col>
                  <Button
                    disabled={
                      /* we keep the button disabled till the action makes sense */
                      formData.numberOfStocks < 1 ||
                      formData.numberOfStocks > formData.units
                    }
                    onClick={() => handleSubmit("sell")}
                    variant="danger"
                    className="col-12"
                    type="button"
                  >
                    Sell
                  </Button>
                </Col>
              </Row>
            </Form>
          </Col>
        </Row>
      </Container>
    </Modal>
  );
};
export default ModalForm;
