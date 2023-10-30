import { Navbar, Container, Nav, Modal, Button } from "react-bootstrap";
import React from 'react';
import Contents from "./Contents.js";
import PrivacyPolicy from "./Privacy.js";

export default function Frame() {
  let [showPrivacy, setShowPrivacy] = React.useState(false);

  const handleClose = () => setShowPrivacy(false);
  const handleShow = () => setShowPrivacy(true);

  return (
    <>
      <Navbar bg="light">
        <Container>
          <p className="navbar-brand" to={`editor`}>Code quality defects survey</p>
          <Nav className="me-auto">
            <Nav.Link onClick={handleShow}>Privacy policy</Nav.Link>
          </Nav>
        </Container>
      </Navbar >
      <Contents />

      <Modal show={showPrivacy} onHide={handleClose} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Privacy policy</Modal.Title>
        </Modal.Header>
        <Modal.Body><PrivacyPolicy /></Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
