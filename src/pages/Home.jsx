import React from "react";

// Bootstrap
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";

// Components
import Table from "../components/Table";
import Chart from "../components/Chart";

const Home = function Home() {
  return (
    <Container>
      <Row>
        <Col className="mb-4" xs={7}>
          <Card>
            <Card.Body>
              <Table />
            </Card.Body>
          </Card>
        </Col>
        <Col>
          <Card>
            <Card.Body>
              <Chart />
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};
export default Home;
