import { Container, Stack, Form, Row, Col } from 'react-bootstrap';
import React from 'react';
import ReactDOM from 'react-dom';
import {QRCodeSVG} from 'qrcode.react';

import Defect from './Defect.js';

function validName(name) {
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

function validInfo(name, expYears, expGroups, considersCS1) {
    return validName(name) && validExpYears(expYears) && validExpGroups(expGroups) && validConsidersCS1(considersCS1);
}

function SurveyeeInfo({ name, setName, expYears, setExpYears, expGroups, setExpGroups, considersCS1, setConsidersCS1 }) {
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

    let expGroupsRadios = ["IT university students", "other university students", "high school"].map((label, i) => {
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
            <Form as={Row}>
                <Form.Group md="4" as={Col}>
                    <Form.Label>Full name</Form.Label>
                    <Form.Control
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        isInvalid={!validName(name)}
                    />
                </Form.Group>
                <Form.Group md="4" as={Col}>
                    <Form.Label>Years of experience</Form.Label>
                    <div>
                        {expYearsRadios}
                    </div>
                </Form.Group>
                <Form.Group md="4" as={Col}>
                    <Form.Label>Taught student groups</Form.Label>
                    <div>
                        {expGroupsRadios}
                    </div>
                </Form.Group>
                <Form.Group md="6" as={Col}>
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
                {validInfo(name, expYears, expGroups, considersCS1) || <div className="is-invalid" />}
                <div className="invalid-feedback">
                    Fill in the info before you start responding.
                </div >
            </Row>
        </>
    );
}


function getDataObj(name, expYears, expGroups, considersCS1, ratings, defectsOrder, userID) {
    return { name: name, expYears: expYears, expGroups: expGroups, considersCS1: considersCS1, ratings: ratings, defectsOrder: defectsOrder, userID: userID };
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

export default function Contents() {
    let [defects, setDefects] = React.useState([]);

    let data = JSON.parse(window.localStorage.getItem("surveyData"));
    if (data === null)
        data = { name: "", expYears: undefined, expGroups: {}, considersCS1: false, ratings: {}, defectsOrder: undefined, userID: Math.random().toString(36).substring(2, 7) };

    let restore_url = `${window.location.origin}/save.html?id=${data.userID}`;
    ReactDOM.render( <QRCodeSVG value={restore_url} />, document.getElementById('qrcode') );

    let [defectsOrder, setDefectsOrder] = React.useState(data.defectsOrder);
    let [ratings, setRatings] = React.useState(data.ratings);

    React.useEffect(() => {
        fetch("/defects").then(
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
    let [expYears, setExpYears] = React.useState(data.expYears);
    let [expGroups, setExpGroups] = React.useState(data.expGroups);
    let [considersCS1, setConsidersCS1] = React.useState(data.considersCS1);
    let [userID, _setUserID] = React.useState(data.userID);

    React.useEffect(() => {
        if (validInfo(name, expYears, expGroups, considersCS1)) {
            fetch("/ratings", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(getDataObj(name, expYears, expGroups, considersCS1, ratings, defectsOrder, userID))
            });
        }
    }, [ratings]);

    React.useEffect(() => {
        window.localStorage.setItem("surveyData", JSON.stringify(getDataObj(name, expYears, expGroups, considersCS1, ratings, defectsOrder, userID)));
    }, [name, expYears, expGroups, considersCS1, ratings, defectsOrder, userID]);

    let defectElems = defects.map((defect, i) => <Defect
        key={defect.id}
        order={i}
        defect={defect}
        disabled={!validInfo(name, expYears, expGroups, considersCS1)}
        rating={ratings[defect.id]}
        onChange={(newV) => { let copy = { ...ratings }; copy[defect.id] = newV; setRatings(copy); }}
    />);

    return (
        <Container className="my-3">
            <SurveyeeInfo
                name={name} setName={setName}
                expYears={expYears} setExpYears={setExpYears}
                expGroups={expGroups} setExpGroups={setExpGroups}
                considersCS1={considersCS1} setConsidersCS1={setConsidersCS1}
            />
            <Stack gap="2">{defectElems}</Stack>
        </Container>
    );
}