import { Navbar, Container, Nav, Modal, Button } from "react-bootstrap";
import { redirect, RouterProvider } from "react-router";
import { Route, createBrowserRouter, createRoutesFromElements } from "react-router-dom";
import { QRCodeSVG } from 'qrcode.react';
import { QrCodeScan } from "react-bootstrap-icons";
import React from 'react';
import Contents from "./Contents.js";
import PrivacyPolicy from "./Privacy.js";
import Results from "./Results.js";

export default function Frame() {
  let [showPrivacy, setShowPrivacy] = React.useState(false);

  const handlePrivacyClose = () => setShowPrivacy(false);
  const handlePrivacyShow = () => setShowPrivacy(true);

  let [showQR, setShowQR] = React.useState(false);

  const handleQRClose = () => setShowQR(false);
  const handleQRShow = () => setShowQR(true);

  let data = JSON.parse(window.localStorage.getItem("surveyData"));
  if (data === null)
    data = {};

  let [userID, setUserID] = React.useState(data.userID);
  let restore_url = `${window.location.origin}/load/${userID}`;

  return (
    <>
      <Navbar bg="light" collapseOnSelect expand="md" className="border">
        <Container>
          <Navbar.Brand>Code quality defects survey</Navbar.Brand>
          <Navbar.Toggle aria-controls="responsive-navbar-nav" />
          <Navbar.Collapse id="responsive-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link onClick={handlePrivacyShow}>Privacy policy</Nav.Link>
            </Nav>
            {userID !== undefined &&
              <Nav>
                <Navbar.Text className="small me-2">To open this session at another device, go to <br /><a href={restore_url}>{restore_url}</a><br />Never fill in the survey on multiple devices at once.</Navbar.Text>
                <Button onClick={handleQRShow} variant="outline-secondary" className="p-2"><QrCodeScan size={25} /></Button>
              </Nav>
            }
          </Navbar.Collapse>
        </Container>
      </Navbar >
      <RouterProvider router={createBrowserRouter(
        createRoutesFromElements(
          <>
            <Route path="/" element={<Contents userID={userID} setUserID={setUserID} />} />
            <Route path="/load/:userID" loader={async (req) => {
              await fetch(`/api/ratings/${req.params.userID}`)
                .then(resp => {
                  if (!resp.ok) {
                    throw Error(resp.statusText);
                  }
                  return resp.json();
                })
                .then(data => {
                  window.localStorage.setItem("surveyData", JSON.stringify(data));
                  setUserID(req.params.userID);
                })
                .catch(error => console.log(error));
              return redirect("/");
            }} element={<p>Data is being loaded.</p>} />
            <Route path="/results/:password" loader={async (req) => {
              return await fetch(`/api/export_data/${req.params.password}`)
                .then(resp => {
                  if (!resp.ok) {
                    throw Error(resp.statusText);
                  }
                  return resp.json();
                })
                .catch(error => console.log(error));
            }} element={<Results />} />
          </>
        )
      )} />

      <Modal show={showPrivacy} onHide={handlePrivacyClose} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Privacy policy</Modal.Title>
        </Modal.Header>
        <Modal.Body><PrivacyPolicy /></Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handlePrivacyClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showQR} onHide={handleQRClose} size="sm">
        <Modal.Header closeButton>
          <Modal.Title>Session QR code</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="d-flex justify-content-center"><QRCodeSVG value={restore_url} /></div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleQRClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
