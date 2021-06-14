import ReactDOM from 'react-dom';
import React, { useState } from 'react';
import { withRouter } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../css/AnalyticsParametersComponent.scss'
import {Button, Form, OverlayTrigger, Popover} from 'react-bootstrap';
import history from "../history.jsx";

function AnalyticsParametersComponent(props){
    const [loadedQuery, setLoadedQuery] = useState(-1);
    const [columnsText, setColumnsText] = useState(null);
    const [popoverShow, setPopoverShow] = useState(0);

    let parametersNames = props.selectedQuery.queryParametersNames;

    if (props.selectedQuery.queryId !== loadedQuery) {
        setLoadedQuery(props.selectedQuery.queryId);

        let toColumnsText = [];
        for (var i = 0; i < parametersNames.length; i++)
            toColumnsText.push("");

        setColumnsText(toColumnsText);
    }

    let columnsTextOnChange = (ev, i) => {
        let text = [...columnsText];
        text[i] = ev.target.value;
        setColumnsText(text);
    };

    let onRequestClick = () => {
        fetch("/api/getQueryResult", {
            method: "POST",
            body: JSON.stringify({ queryId: loadedQuery, queryParameters: columnsText }),
            headers: { 'Content-Type': 'application/json' }
        })
            .then(res => res.json())
            .then(result => {
                if (result.status === 500){
                    setPopoverShow(2);
                    setTimeout(() => setPopoverShow(0), 2000);
                    return;
                }

                props.setColumnsData(result);
                setPopoverShow(1);
                setTimeout(() => setPopoverShow(0), 2000);
            }, error => {
                console.log(error);
            })
    };

    let popoverOk = (
        <Popover id="popover-basic">
            <Popover.Title as="h3">Запрос выполнен</Popover.Title>
        </Popover>
    );

    let popoverError = (
        <Popover id="popover-basic">
            <Popover.Title as="h3">Ошибка выполнения запроса</Popover.Title>
            <Popover.Content>
                Проверьте введенные данные на корректность.
            </Popover.Content>
        </Popover>
    );

    return (
        columnsText === null ? <div></div> :
        <Form>
            <Form.Label>Заполните параметры:</Form.Label>
            {
                parametersNames.map((obj, i) =>
                    <Form.Group>
                        <Form.Label>{obj}</Form.Label>
                        <Form.Control type="text" value={columnsText[i]} onChange={ev => columnsTextOnChange(ev, i)} />
                        <br/>
                    </Form.Group>
                )
            }
            <OverlayTrigger show={popoverShow !== 0} placement="right" overlay={popoverShow === 2 ? popoverError : popoverOk}>
                <Button onClick={onRequestClick}>Запросить</Button>
            </OverlayTrigger>
        </Form>
    );
}

export default withRouter(AnalyticsParametersComponent);
