import { Container, Stack, Form, Row, Col, Button, Alert, Navbar, Nav, Accordion } from 'react-bootstrap';
import React from 'react';

import Defect from './Defect.js';

function validName(name) {
    return name !== "";
}

function validUniversity(name) {
    return name !== "";
}

function validExpYears(expYears) {
    return expYears !== undefined;
}

function validExpGroups(expGroups) {
    return Object.values(expGroups).some((v) => v);
}

function validConsidersCS1(considersCS1) {
    return considersCS1;
}

function validInfo(name, university, expYears, expGroups, considersCS1) {
    return validName(name) && validUniversity(university) && validExpYears(expYears) && validExpGroups(expGroups) && validConsidersCS1(considersCS1);
}

function SurveyeeInfo({ name, setName, university, setUniversity, expYears, setExpYears, expGroups, setExpGroups, considersCS1, setConsidersCS1 }) {
    let expYearsRadios = ["0", "1", "2-3", ">=4"].map((label, i) => {
        return (
            <Form.Check inline key={i} id={`expYears-${label}`}>
                <Form.Check.Input
                    type="radio"
                    name="expYears"
                    isInvalid={!validExpYears(expYears)}
                    checked={expYears === label}
                    onChange={() => setExpYears(label)}
                />
                <Form.Check.Label>{label}</Form.Check.Label>
            </Form.Check>
        );
    });

    let expGroupsRadios = ["IT university students", "other university students", "high school students or younger in-person", "high school students or younger online", "none of the above"].map((label, i) => {
        return (
            <Form.Check key={i} id={`expGroups-${label}`}>
                <Form.Check.Input
                    type="checkbox"
                    name="expYears"
                    isInvalid={!validExpGroups(expGroups)}
                    checked={expGroups[label] === true}
                    onChange={(e) => { let copy = { ...expGroups }; copy[label] = e.target.checked; setExpGroups(copy) }}
                />
                <Form.Check.Label>{label}</Form.Check.Label>
            </Form.Check>
        );
    });

    return (
        <>
            <Form as={Row} className="text-start">
                <Col>
                    <Form.Group md="3" as={Row}>
                        <Form.Label>Full name</Form.Label>
                        <Form.Control
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            isInvalid={!validName(name)}
                        />

                        <Form.Control.Feedback type="invalid">
                            We need this information to later verify you are an educator
                            (and actual human).
                        </Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group md="3" as={Row}>
                        <Form.Label className="mt-3">University/Affiliation</Form.Label>
                        <Form.Control
                            value={university}
                            onChange={(e) => setUniversity(e.target.value)}
                            isInvalid={!validUniversity(university)}
                        />
                        <Form.Control.Feedback type="invalid">
                            We need this information to later verify you are an educator
                            (and actual human).
                        </Form.Control.Feedback>
                    </Form.Group>
                </Col>
                <Form.Group md="3" as={Col}>
                    <Form.Label>Years of experience in teaching programming</Form.Label>
                    <div>
                        {expYearsRadios}
                    </div>
                </Form.Group>
                <Form.Group md="3" as={Col}>
                    <Form.Label>Taught student groups</Form.Label>
                    <div>
                        {expGroupsRadios}
                    </div>
                </Form.Group>
                <Form.Group md="3" as={Col}>
                    <Form.Label>When filling in the survey, consider the perspective of teaching CS1 students (CS1 = introductory programming course at an university).</Form.Label>
                    <Form.Check id="considersCS1">
                        <Form.Check.Input
                            type="checkbox"
                            isInvalid={!validConsidersCS1(considersCS1)}
                            checked={considersCS1 === true}
                            onChange={() => { setConsidersCS1(!considersCS1) }}
                        />
                        <Form.Check.Label>I will consider this perspective.</Form.Check.Label>
                    </Form.Check>
                </Form.Group>
            </Form>
            <Row className="mb-3">
                {validInfo(name, university, expYears, expGroups, considersCS1) || <div className="is-invalid" />}
                <div className="invalid-feedback">
                    Fill in the info before you start responding.
                </div >
            </Row>
        </>
    );
}


function getDataObj(name, university, expYears, expGroups, considersCS1, ratings, defectsOrder, userID, text) {
    return {
        name: name,
        university: university,
        expYears: expYears,
        expGroups: expGroups,
        considersCS1: considersCS1,
        ratings: ratings,
        defectsOrder: defectsOrder,
        userID: userID,
        text: text
    };
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    return array;
}

function submitData(name, university, expYears, expGroups, considersCS1, ratings, defectsOrder, userID, text, setLastSuccessfulSubmit) {
    if (validInfo(name, university, expYears, expGroups, considersCS1)) {
        fetch("/api/ratings", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(getDataObj(name, university, expYears, expGroups, considersCS1, ratings, defectsOrder, userID, text))
        }).then(response => {
            if (response.ok) setLastSuccessfulSubmit(new Date());
        });
    }
}

export function WelcomeWagon() {
    return <Row><Alert variant="secondary">
        <Alert.Heading>Welcome to the code quality defect
            survey and thank you so much for participating.</Alert.Heading>
        <p className='mb-0 text-start'>
            There are 30 code quality defects in the survey. For each one,
            fill in whether <b>you personally</b> would notify a CS1 student of the
            defect and whether you would require the student to fix the defect.
            Fill in information on your teaching experience below to enable the survey.</p>
    </Alert></Row >;
}

export function FreeFormComment({ text, setText, onBlur }) {
    return <Accordion style={{ width: "100%" }}>
        <Accordion.Item eventKey="0">
            <Accordion.Header>Free form comment (optional)</Accordion.Header>
            <Accordion.Body>
                <Form.Group className="mb-3">
                    <Form.Control
                        as="textarea"
                        rows={3}
                        value={text}
                        onChange={(e) => { setText(e.target.value) }}
                        onBlur={onBlur}
                    />
                </Form.Group>
            </Accordion.Body>
        </Accordion.Item>
    </Accordion>;
}

export default function Contents({ userID, setUserID }) {
    let [defects, setDefects] = React.useState([]);

    let data = JSON.parse(window.localStorage.getItem("surveyData"));
    if (data === null) {
        data = {
            name: "",
            university: "",
            expYears: undefined,
            expGroups: {},
            considersCS1: false,
            ratings: {},
            defectsOrder: undefined,
            userID: Math.random().toString(36).substring(2, 7),
            text: "",
        };
        setUserID(data.userID);
    }

    let [defectsOrder, setDefectsOrder] = React.useState(data.defectsOrder);
    let [ratings, setRatings] = React.useState(data.ratings);

    React.useEffect(() => {
        fetch("/api/defects").then(
            response => response.json()
        ).then(
            json => {
                let defects = json.defects;
                if (defectsOrder === undefined || Object.keys(defectsOrder).length != defects.length) {
                    defectsOrder = Object.fromEntries(shuffleArray(defects.map((defect) => defect.id)).map((id, index) => [id, index]));
                    setDefectsOrder(defectsOrder);
                }
                setDefects(defects.sort((e1, e2) => defectsOrder[e1.id] - defectsOrder[e2.id]));
            }
        );
    }, []);

    let [name, setName] = React.useState(data.name);
    let [university, setUniversity] = React.useState(data.university);
    let [expYears, setExpYears] = React.useState(data.expYears);
    let [expGroups, setExpGroups] = React.useState(data.expGroups);
    let [considersCS1, setConsidersCS1] = React.useState(data.considersCS1);
    let [freeFormText, setFreeFormText] = React.useState(data.text);

    let [lastSuccessfulSubmit, setLastSuccessfulSubmit] = React.useState(undefined);

    React.useEffect(() => {
        submitData(name, university, expYears, expGroups, considersCS1, ratings, defectsOrder, userID, freeFormText, setLastSuccessfulSubmit);
    }, [ratings]);

    React.useEffect(() => {
        document.onvisibilitychange = function () {
            if (document.visibilityState === 'hidden') {
                submitData(name, university, expYears, expGroups, considersCS1, ratings, defectsOrder, userID, freeFormText, setLastSuccessfulSubmit);
            }
        };

        window.addEventListener("beforeunload", () => submitData(name, university, expYears, expGroups, considersCS1, ratings, defectsOrder, userID, freeFormText, setLastSuccessfulSubmit));
    });

    React.useEffect(() => {
        window.localStorage.setItem("surveyData", JSON.stringify(getDataObj(name, university, expYears, expGroups, considersCS1, ratings, defectsOrder, userID, freeFormText)));
    }, [name, university, expYears, expGroups, considersCS1, ratings, defectsOrder, userID, freeFormText]);

    let defectElems = defects.map((defect, i) => <Defect
        key={defect.id}
        order={i}
        defect={defect}
        disabled={!validInfo(name, university, expYears, expGroups, considersCS1)}
        rating={ratings[defect.id]}
        onChange={(newV) => { let copy = { ...ratings }; copy[defect.id] = newV; setRatings(copy); }}
    />);

    return (
        <>
            <Container className="my-3">
                <WelcomeWagon />
                <SurveyeeInfo
                    name={name} setName={setName}
                    university={university} setUniversity={setUniversity}
                    expYears={expYears} setExpYears={setExpYears}
                    expGroups={expGroups} setExpGroups={setExpGroups}
                    considersCS1={considersCS1} setConsidersCS1={setConsidersCS1}
                />
                <Stack gap="2">{defectElems}</Stack>

                <footer className="text-center text-lg-start bg-light text-muted">

                    <Container className="text-center mt-3 p-2 d-flex justify-content-center small">
                        <Stack direction="horizontal" gap={3}>
                            {lastSuccessfulSubmit !== undefined && <span>Data is submitted on every change.<br />Last submitted on {lastSuccessfulSubmit.toLocaleString()}.</span>}
                            <Button
                                variant="outline-secondary"
                                size="sm"
                                disabled={!validInfo(name, university, expYears, expGroups, considersCS1)}
                                onClick={() => submitData(name, university, expYears, expGroups, considersCS1, ratings, defectsOrder, userID, setLastSuccessfulSubmit)}
                            >Resubmit now</Button>
                        </Stack>
                    </Container>
                </footer>
            </Container>
            <Navbar bg="light" expand="md" fixed="bottom" className="border">
                <Container>
                    <Nav className="me-auto"></Nav>
                    <Nav className="col">
                        <FreeFormComment
                            text={freeFormText}
                            setText={setFreeFormText}
                            onBlur={() => submitData(name, university, expYears, expGroups, considersCS1, ratings, defectsOrder, userID, freeFormText, setLastSuccessfulSubmit)}
                        />
                    </Nav>
                </Container>
            </Navbar>
        </>
    );
}