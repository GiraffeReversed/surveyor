import { Container, Stack, Form, Row, Col } from 'react-bootstrap';
import React from 'react';

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

function validInfo(name, expYears, expGroups) {
    return validName(name) && validExpYears(expYears) && validExpGroups(expGroups);
}

function SurveyeeInfo({ name, setName, expYears, setExpYears, expGroups, setExpGroups }) {
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
            </Form>
            <Row className="mb-3">
                {validInfo(name, expYears, expGroups) || <div className="is-invalid" />}
                <div className="invalid-feedback">
                    Fill in the info before you start responding.
                </div >
            </Row>
        </>
    );
}


function getDataObj(name, expYears, expGroups, ratings, userID) {
    return { name: name, expYears: expYears, expGroups: expGroups, ratings: ratings, userID: userID };
}

export default function Contents() {
    let [defects, setDefects] = React.useState([]);


    let data = JSON.parse(window.localStorage.getItem("surveyData"));
    if (data === null)
        data = { name: "", expYears: undefined, expGroups: {}, ratings: Array.apply(undefined, { length: defects.length }), userID: Math.random().toString(36).substring(2, 7) };

    let [ratings, setRatings] = React.useState(data.ratings);

    React.useEffect(() => {
        fetch("/defects").then(
            response => response.json()
        ).then(
            // json => { setDefects(json.defects); setRatings(Array.apply(undefined, { length: json.defects.length })); }
            json => {
                setDefects(json.defects);
                if (ratings.length === 0)
                    setRatings(Array.apply(undefined, { length: json.defects.length }));
            }
        );
    }, []);

    let [userID, setUserID] = React.useState(data.userID);
    let [name, setName] = React.useState(data.name);
    let [expYears, setExpYears] = React.useState(data.expYears);
    let [expGroups, setExpGroups] = React.useState(data.expGroups);

    React.useEffect(() => {
        fetch(`/ratings/${userID}`, {
            headers: { "Content-Type": "application/json" },
        }).then(
            (resp) => { return resp.json(); }
        ).then((body) => {
            console.log(body);
            setName(body.name);
            setExpYears(body.expYears);
            setExpGroups(body.expGroups);
            window.localStorage.setItem("surveyData", JSON.stringify(body));
        });
    }, [userID]);

    React.useEffect(() => {
        if (validInfo(name, expYears, expGroups)) {
            fetch("/ratings", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(getDataObj(name, expYears, expGroups, ratings, userID))
                // body: JSON.stringify({ ...getDataObj(name, expYears, expGroups, ratings), ...{ userID: userID } })
            });
        }
    }, [ratings]);

    React.useEffect(() => {
        window.localStorage.setItem("surveyData", JSON.stringify(getDataObj(name, expYears, expGroups, ratings, userID)));
    }, [name, expYears, expGroups, ratings, userID]);

    let defectElems = defects.map((defect, i) => <Defect
        key={i}
        order={i}
        defect={defect}
        disabled={!validInfo(name, expYears, expGroups)}
        rating={ratings[i]}
        onChange={(newV) => setRatings(ratings.map((v, j) => i === j ? newV : v))}
    />);

    return (
        <Container className="my-3">
            <SurveyeeInfo name={name} setName={setName} expYears={expYears} setExpYears={setExpYears} expGroups={expGroups} setExpGroups={setExpGroups} />
            <Stack gap="2">{defectElems}</Stack>
        </Container>
    );
}