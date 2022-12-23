import React from "react";
import { useSelector } from "react-redux";

// Routing
import { Link } from "react-router-dom";

// Bootstrap
import Container from "react-bootstrap/Container";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import Image from "react-bootstrap/Image";

// Util
import { roundTwoDecimals } from "./ModalForm";

const UserNav = function UserNav() {
  const currentUser = useSelector((state) => state.currentUser);
  const stockDataFromRedux = useSelector((state) => state.stockData);
  const { displayName, photoURL } = currentUser;
  const avatarLetters = displayName || "☺";
  const avatar =
    photoURL || `https://eu.ui-avatars.com/api/?name=${avatarLetters}`;

  const daysAgo = 0;
  const portfolioValue =
    !currentUser.firestore?.stockUnits || !currentUser.firestore?.wallet
      ? 1000
      : currentUser.firestore.wallet +
        Object.keys(currentUser.firestore.stockUnits).reduce((next, key) => {
          if (!next.toString().includes("Missing data")) {
            if (!currentUser.firestore.stockUnits[key]) {
              return next;
            }
            if (!stockDataFromRedux[key]?.seriesCandle?.[0].data[0].y[3]) {
              return "Missing data";
            }
            return roundTwoDecimals(
              next +
                currentUser.firestore.stockUnits[key] *
                  stockDataFromRedux[key].seriesCandle[0].data[daysAgo].y[3]
            );
          }
          return next;
        }, 0);
  return (
    <>
      <Navbar.Text className="me-3">
        Portfolio value:{" "}
        {portfolioValue.toString().includes("Missing data")
          ? "Missing data"
          : `$${portfolioValue}`}
      </Navbar.Text>
      <Link to="/profile">
        <Image
          to="/profile"
          src={avatar}
          roundedCircle
          style={{ maxHeight: "30px", maxWidth: "30px" }}
        />
      </Link>
    </>
  );
};

const VisitorNav = function VisitorNav() {
  return (
    <Nav>
      <Link to="/sign-up" className="nav-link">
        Sign Up
      </Link>
      <Link to="/log-in" className="nav-link">
        Log In
      </Link>
    </Nav>
  );
};

const HeaderNav = function HeaderNav() {
  const currentUser = useSelector((state) => state.currentUser);
  if (currentUser?.uid) return <UserNav />;
  return <VisitorNav />;
};

const Header = function Header() {
  return (
    <Navbar bg="primary" variant="dark" expand="md" className="mb-4">
      <Container>
        <Navbar.Brand as={Link} to="/">
          Stock Market Dashboard
        </Navbar.Brand>
        <div className="d-flex justify-content-end align-items-center">
          <HeaderNav />
        </div>
      </Container>
    </Navbar>
  );
};

export default Header;
