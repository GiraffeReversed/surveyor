import React from 'react';
import { Card, Form, Row, Col, Button, Collapse, ListGroup } from "react-bootstrap";
import { InfoCircle } from "react-bootstrap-icons";
import hljs from 'highlight.js/lib/core';
import python from 'highlight.js/lib/languages/python';
import 'highlight.js/styles/github.css'

hljs.registerLanguage('python', python);

function Voter({ rating, order, disabled, onChange }) {
    let [infoOpen, setInfoOpen] = React.useState(order === 0);
    return (
        // <Row>
        <>
            <div className="d-flex align-items-center">
                <Form>
                    {[...Array(5).keys()].map((i) =>
                        <Form.Check inline
                            id={`voter-${order}-${i}`}
                            key={i}
                            name={`defect${order}`}
                            type="radio"
                            label={i + 1}
                            checked={i + 1 === rating}
                            disabled={disabled}
                            onClick={() => rating !== i + 1 ? onChange(i + 1) : onChange(undefined)}
                            onChange={() => undefined}
                        />)}
                </Form>

                <Button
                    variant="secondary-outline"
                    className="flex-fill p-1"
                    onClick={() => setInfoOpen(!infoOpen)}
                    aria-controls={`info-block-${order}`}
                    aria-expanded={infoOpen}
                ><InfoCircle /></Button>
            </div>
            <Collapse in={infoOpen}>
                <ListGroup className="small">
                    <ListGroup.Item className="mb-0 p-2"><span className="me-2">1</span> in some cases this is not a defect and even when the revised version is an improvement, it is not important one</ListGroup.Item>
                    <ListGroup.Item className="mb-0 p-2"><span className="me-2">2</span> in between</ListGroup.Item>
                    <ListGroup.Item className="mb-0 p-2"><span className="me-2">3</span> it is a defect, revision leads to improved code, but particularly for a novice programmer it is not a top priority to learn about it</ListGroup.Item>
                    <ListGroup.Item className="mb-0 p-2"><span className="me-2">4</span> in between</ListGroup.Item>
                    <ListGroup.Item className="mb-0 p-2"><span className="me-2">5</span> code should be revised, it is very useful to learn to use the improved version, students should be definitely notified</ListGroup.Item>
                </ListGroup>
            </Collapse>
        </>
        // </Row>
    )
}

export default function Defect({ order, disabled, defect, rating, onChange }) {
    return (
        <Card className="py-2">
            <Card.Title>{defect["defect name"]}</Card.Title>
            <Card.Body className="pb-0">
                <Row className="text-start">
                    <Col sm>{defect["description"]}</Col>
                    <Col sm><pre dangerouslySetInnerHTML={{ __html: hljs.highlight(defect["code example"], { language: 'python' }).value }} /></Col>
                    <Col sm><Voter order={order} disabled={disabled} rating={rating} onChange={onChange} /></Col>
                </Row>
            </Card.Body>
        </Card>
    );
}