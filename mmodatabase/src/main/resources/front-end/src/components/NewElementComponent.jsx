import ReactDOM from 'react-dom';
import React, { useState } from 'react';
import { withRouter } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../css/NewElementComponent.scss'
import {Button, Form, OverlayTrigger, Popover} from 'react-bootstrap';
import history from "../history.jsx";

function NewElementComponent(props){
    const [loadedTable, setLoadedTable] = useState(null);
    const [columnsName, setColumnsName] = useState([]);
    const [columnsText, setColumnsText] = useState();
    const [popoverShow, setPopoverShow] = useState(0);

    let selectedTable = props.changeState.selectedTable;

    let columnsTextOnChange = (ev, i) => {
        let text = [...columnsText];
        text[i] = ev.target.value;
        setColumnsText(text);
    };

    let onAddClick = () => {
        fetch("/api/addRow", {
            method: "POST",
            body: JSON.stringify({ tableName: selectedTable, tableKeys: columnsName, tableValues: columnsText }),
            headers: { 'Content-Type': 'application/json' }
        })
            .then(res => res.json())
            .then(result => {
                if (result.status === 500){
                    setPopoverShow(2);
                    setTimeout(() => setPopoverShow(0), 2000);
                    return;
                }

                props.setLoadedTableTable(null);
                setLoadedTable(null);
                setPopoverShow(1);
                setTimeout(() => setPopoverShow(0), 2000);
            }, error => {
                console.log(error);
            })
    };

    if (selectedTable !== loadedTable){
        fetch("/api/getColumns", {
            method: "POST",
            body: JSON.stringify(selectedTable),
            headers: { 'Content-Type': 'application/json' }
        })
            .then(res => res.json())
            .then(result => {
                let idIndex = result.indexOf("id");
                if (idIndex !== -1)
                    result.splice(idIndex, 1);

                let toColumnsText = [];
                for (var i = 0; i < result.length; i++){
                    toColumnsText.push("");
                }

                setLoadedTable(selectedTable);
                setColumnsText(toColumnsText);
                setColumnsName(result);
            }, error => {
                console.log(error);
            })
    }

    let popoverOk = (
        <Popover id="popover-basic">
            <Popover.Title as="h3">Элемент добавлен</Popover.Title>
        </Popover>
    );

    let popoverError = (
        <Popover id="popover-basic">
            <Popover.Title as="h3">Ошибка добавления</Popover.Title>
            <Popover.Content>
                Проверьте, что введеные id существуют в БД, и данные корректны.
            </Popover.Content>
        </Popover>
    );

    return (
        <Form>
            <Form.Label>Добавить новый элемент:</Form.Label>
            {
                columnsName.map((obj, i) =>
                    <Form.Group>
                        <Form.Label>{obj}</Form.Label>
                        <Form.Control type="text" value={columnsText[i]} onChange={ev => columnsTextOnChange(ev, i)} />
                        <br/>
                    </Form.Group>
                )
            }
            <OverlayTrigger show={popoverShow !== 0} placement="right" overlay={popoverShow === 2 ? popoverError : popoverOk}>
                <Button onClick={onAddClick}>Добавить</Button>
            </OverlayTrigger>
        </Form>
    );
}

export default withRouter(NewElementComponent);
