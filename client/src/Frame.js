import { Navbar, Container } from "react-bootstrap";
import Contents from "./Contents.js";

export default function Frame() {

  return (
    <>
      <Navbar bg="light">
        <Container>
          <p className="navbar-brand" to={`editor`}>Code quality defects survey</p>
        </Container>
      </Navbar >
      <Contents />
    </>
  );
}
