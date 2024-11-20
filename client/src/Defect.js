import React from 'react';
import { Card, Form, Row, Col, Button, Collapse, ListGroup } from "react-bootstrap";
import { InfoCircle } from "react-bootstrap-icons";
import hljs from 'highlight.js/lib/core';
import python from 'highlight.js/lib/languages/python';
import 'highlight.js/styles/github.css'

hljs.registerLanguage('python', python);

function Voter({ rating, order, disabled, onChange }) {
    const options = [
        { short_label: "no notify", long_label: "The student should not be notified of the defect." },
        { short_label: "low notify", long_label: "Notifying the student has low priority." },
        { short_label: "medium notify, low fix", long_label: "Notifying the student has medium priority but fixing the defect has low priority." },
        { short_label: "high notify, medium fix", long_label: "Notifying the student has high priority and fixing the defect has medium priority." },
        { short_label: "high notify, high fix", long_label: "Both notifying the student and fixing the defect has high priority." },
    ];

    let [infoOpen, setInfoOpen] = React.useState(order === 0);
    return (
        <>
            <div className='d-flex mb-1'>
                <h5 className='small mb-0'>Would you notify/ask to fix?</h5>
                <Button
                    variant="secondary-outline"
                    className="flex-fill p-0 border border-0"
                    onClick={() => setInfoOpen(!infoOpen)}
                    aria-controls={`info-block-${order}`}
                    aria-expanded={infoOpen}
                ><InfoCircle /></Button>
            </div>

            <div className="d-flex align-items-center">
                <Form>
                    {options.map((option, i) =>
                        <Form.Check
                            id={`voter-${order}-${i}`}
                            key={i}
                            name={`defect${order}`}
                            type="radio"
                            label={<><span className='me-2'>{i + 1}</span>{option.short_label}</>}
                            checked={i + 1 === rating}
                            disabled={disabled}
                            onClick={() => rating !== i + 1 ? onChange(i + 1) : onChange(undefined)}
                            onChange={() => undefined}
                        />)}
                </Form>
            </div>
            <Collapse in={infoOpen}>
                <ListGroup className="small">
                    {options.map((option, i) => <ListGroup.Item className="mb-0 p-2" key={i}><span className="me-2">{i + 1}</span>{option.long_label}</ListGroup.Item>)}
                </ListGroup>
            </Collapse>
        </>
    )
}

export default function Defect({ order, disabled, defect, rating, onChange }) {
    return (
        <Card className="py-2">
            <Card.Title>{defect["defect name"]}</Card.Title>
            <Card.Body className="pb-0">
                <Row className="text-start gx-3">
                    <Col md="12" lg="3"><h5 className='small'>Description</h5><p>{defect["description"]}</p></Col>
                    <Col md="12" lg="3"><h5 className='small'>Example</h5><pre dangerouslySetInnerHTML={{ __html: hljs.highlight(defect["code example"], { language: 'python' }).value }} /></Col>
                    <Col md="12" lg="3"><h5 className='small'>Fix example</h5><pre dangerouslySetInnerHTML={{ __html: hljs.highlight(defect["code fix example"], { language: 'python' }).value }} /></Col>
                    <Col md="12" lg="3"><Voter order={order} disabled={disabled} rating={rating} onChange={onChange} /></Col>
                </Row>
            </Card.Body>
        </Card>
    );
}