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

export function ResultDefect({ defect, ratings }) {
    let avg = averageRating(ratings);
    return (
        <Card className="py-2">
            <Card.Title>{defect["defect name"]}</Card.Title>
            <Card.Body className="pb-0">
                <Row className="text-start gx-3">
                    <Col sm><h5 className='small'>Description</h5><p>{defect["description"]}</p></Col>
                    <Col sm><h5 className='small'>Example</h5><pre dangerouslySetInnerHTML={{ __html: hljs.highlight(defect["code example"], { language: 'python' }).value }} /></Col>
                    <Col sm><h5 className='small'>Fix example</h5><pre dangerouslySetInnerHTML={{ __html: hljs.highlight(defect["code fix example"], { language: 'python' }).value }} /></Col>
                    <Col sm><h5 className='small'>Average rating</h5>{avg}</Col>
                </Row>
                <Row><Col><h5 className='small'>Ratings</h5>{JSON.stringify(ratings)}</Col></Row>
            </Card.Body>
        </Card>
    );
}

export default function Results() {
    let responses = useLoaderData().responses
        .filter(response => !response.name.toLowerCase().includes("test"));
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

    return (
        <Container className="my-3">
            <Stack gap="2">{defectElems}</Stack>
        </Container>
    );
}