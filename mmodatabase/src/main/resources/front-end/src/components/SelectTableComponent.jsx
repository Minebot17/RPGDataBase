import ReactDOM from 'react-dom';
import React, { useState } from 'react';
import { withRouter } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../css/SelectTableComponent.scss'
import {Button, Form} from 'react-bootstrap';
import history from "../history.jsx";

function SelectTableComponent(props){
    if (props.dbList.length !== 0 && props.changeState.selectedTable == null)
        props.setChangeState({ selectedTable: props.dbList[0] });

    let onChangeComboBox = () => {

    };

    let selectTable = () => {

    };

    return (
        <Form>
            <Form.Label>Выберите таблицу:</Form.Label>
            <Form.Control as="select" value={props.changeState.selectedTable}
                          onChange={(ev) => props.setChangeState({ selectedTable: ev.target.value })}>
                {
                    props.dbList.map((obj, i) =>
                        <option>
                            {obj}
                        </option>)
                }
            </Form.Control>
        </Form>
    );
}

export default withRouter(SelectTableComponent);
