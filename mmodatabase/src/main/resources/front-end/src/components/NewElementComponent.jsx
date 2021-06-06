import ReactDOM from 'react-dom';
import React, { useState } from 'react';
import { withRouter } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../css/NewElementComponent.scss'
import {Button, Form} from 'react-bootstrap';
import history from "../history.jsx";

function NewElementComponent(props){
    const [loadedTable, setLoadedTable] = useState(null);
    const [columnsName, setColumnsName] = useState([]);
    const [columnsText, setColumnsText] = useState();

    let selectedTable = props.changeState.selectedTable;

    let columnsTextOnChange = (ev, i) => {
        let text = [...columnsText];
        text[i] = ev.target.value;
        setColumnsText(text);
    };

    let onAddClick = () => {
        fetch("http://127.0.0.1:1234/api/addRow", {
            method: "POST",
            body: JSON.stringify({ tableName: selectedTable, tableKeys: columnsName, tableValues: columnsText }),
            headers: { 'Content-Type': 'application/json' }
        })
            .then(res => res.json())
            .then(result => {
                console.log(result)
            }, error => {
                console.log(error);
            })
    };

    if (selectedTable !== loadedTable){
        fetch("http://127.0.0.1:1234/api/getColumns", {
            method: "POST",
            body: JSON.stringify(selectedTable),
            headers: { 'Content-Type': 'application/json' }
        })
            .then(res => res.json())
            .then(result => {
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
            <Button onClick={onAddClick}>Добавить</Button>
        </Form>
    );
}

export default withRouter(NewElementComponent);
