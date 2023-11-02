import React from "react";
import { Card, Row, Col, Container, Stack } from "react-bootstrap";
import { useLoaderData } from "react-router";
import hljs from 'highlight.js/lib/core';
import python from 'highlight.js/lib/languages/python';
import 'highlight.js/styles/github.css'

hljs.registerLanguage('python', python);

export function ResultDefect({ defect, ratings }) {
    // debugger;
    let definedRatings = ratings.filter(v => v !== undefined);
    let avg = definedRatings.reduce((lt, rt) => lt + rt, 0) / definedRatings.length;
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
    let data = useLoaderData();
    let [defects, setDefects] = React.useState([]);

    React.useEffect(() => {
        fetch("/api/defects").then(
            response => response.json()
        ).then(json => setDefects(json.defects));
    }, []);

    let defectElems = defects.map(defect =>
        <ResultDefect
            defect={defect}
            key={defect.id}
            ratings={
                data.responses
                    .filter(response => !response.name.toLowerCase().includes("test"))
                    .map(response => response.ratings[defect.id])
            }
        />
    );

    return (
        <Container className="my-3">
            <Stack gap="2">{defectElems}</Stack>
        </Container>
    );
}