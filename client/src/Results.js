import React from "react";
import { Card, Row, Col, Container, Stack } from "react-bootstrap";
import { useLoaderData } from "react-router";
import hljs from 'highlight.js/lib/core';
import python from 'highlight.js/lib/languages/python';
import 'highlight.js/styles/github.css'

hljs.registerLanguage('python', python);

function getRatings(responses, defectID) {
    return responses.map(response => response.ratings[defectID]);
}

function averageRating(ratings) {
    let definedRatings = ratings.filter(v => v !== undefined);
    return definedRatings.reduce((lt, rt) => lt + rt, 0) / definedRatings.length;
}

function standardDev(ratings, avg) {
    let definedRatings = ratings.filter(v => v !== undefined);
    return Math.sqrt(definedRatings.map(v => (v - avg) ** 2).reduce((lt, rt) => lt + rt, 0) / definedRatings.length);
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

export function ResultDefect({ defect, ratings }) {
    let avg = averageRating(ratings);
    let std = standardDev(ratings, avg);
    return (
        <Card className="py-2">
            <Card.Title>{defect["defect name"]}</Card.Title>
            <Card.Body className="pb-0">
                <Row className="text-start gx-3">
                    <Col sm><h5 className='small'>Description</h5><p>{defect["description"]}</p></Col>
                    <Col sm><h5 className='small'>Example</h5><pre dangerouslySetInnerHTML={{ __html: hljs.highlight(defect["code example"], { language: 'python' }).value }} /></Col>
                    <Col sm><h5 className='small'>Fix example</h5><pre dangerouslySetInnerHTML={{ __html: hljs.highlight(defect["code fix example"], { language: 'python' }).value }} /></Col>
                    <Col sm><h5 className='small'>Average rating</h5>{Math.round(avg * 100) / 100}</Col>
                    <Col sm><h5 className="small">Standard deviation</h5>{Math.round(std * 100) / 100}</Col>
                </Row>
                <Row><Col><h5 className='small'>Ratings</h5>{JSON.stringify(ratings)}</Col></Row>
            </Card.Body>
        </Card>
    );
}

export default function Results() {
    let responses = useLoaderData().responses
        .filter(response => !response.name.toLowerCase().includes("test") && response.university !== undefined);
    let [defects, setDefects] = React.useState([]);

    React.useEffect(() => {
        fetch("/api/defects").then(
            response => response.json()
        ).then(json => {
            let defects = json.defects;
            defects.sort((lt, rt) => {
                let lavg = averageRating(getRatings(responses, lt.id));
                let ravg = averageRating(getRatings(responses, rt.id));

                lavg = lavg ? lavg : 0;
                ravg = ravg ? ravg : 0;

                return -(lavg - ravg);
            });
            setDefects(defects);
        });
    }, []);

    let defectElems = defects.map(defect =>
        <ResultDefect
            defect={defect}
            key={defect.id}
            ratings={getRatings(responses, defect.id)}
        />
    );

    let avgByRespondent = responses.map(
        response => averageRating(Object.values(response.ratings))
    ).map(avg =>
        Math.round(avg * 100) / 100
    );
    let names = shuffleArray(responses.map(response => response.name + " " + response.university));

    let expYearsCounts = {};
    responses.map(response => response.expYears).forEach(expYear => {
        expYearsCounts[expYear] = (expYearsCounts[expYear] || 0) + 1;
    });

    let expGroupsCounts = {};
    responses.map(response => response.expGroups).forEach(expGroup => {
        Object.entries(expGroup).forEach(([key, val]) => {
            if (val)
                expGroupsCounts[key] = (expGroupsCounts[key] || 0) + 1;
        })
    });

    let texts = (
        <Card className="py-2">
            <Card.Title>Text comments</Card.Title>
            <Card.Body>
                {responses.map(response => response.text).filter(text => text).map(text => <Row><Col className="small">{text}</Col></Row>)}
            </Card.Body>
        </Card>
    );


    let overallStats = (
        <Card className="py-2">
            <Card.Title>Overall</Card.Title>
            <Card.Body className="pb-0">
                <Row className="text-start gx-3">
                    <Col xs="1"><h5 className='small'>Number of respondents</h5>{responses.length}</Col>
                    <Col sm><h5 className='small'>Responses per respondent</h5>{JSON.stringify(responses.map(resp => Object.values(resp.ratings).filter(r => r).length))}</Col>
                    <Col sm><h5 className='small'>Average rating by respondent</h5><p>{JSON.stringify(avgByRespondent)}</p></Col>
                    <Col sm><h5 className='small'>Years of experience counts</h5>{JSON.stringify(expYearsCounts)}</Col>
                    <Col sm><h5 className='small'>Taught student groups counts</h5>{JSON.stringify(expGroupsCounts)}</Col>
                </Row>
                <Row>
                    <Col><h5 className='small'>Name cloud</h5>{`{${names.join(", ")}}`}</Col>
                </Row>
            </Card.Body>
        </Card>
    );

    return (
        <Container className="my-3">
            <Stack gap="2">{overallStats}{texts}{defectElems}</Stack>
        </Container>
    );
}