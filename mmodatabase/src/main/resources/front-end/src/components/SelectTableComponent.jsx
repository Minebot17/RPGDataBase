import ReactDOM from 'react-dom';
import React, { useState } from 'react';
import { withRouter } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../css/SelectTableComponent.scss'
import {Button, Form} from 'react-bootstrap';
import history from "../history.jsx";

function SelectTableComponent(props){
    let selectedTable = props.state.selectedTable;

    if (props.dbList.length !== 0 && selectedTable == null)
        props.setState({ selectedTable: props.dbList[0] });

    return (
        <Form>
            <Form.Label>Выберите таблицу:</Form.Label>
            <Form.Control as="select" value={selectedTable}
                          onChange={(ev) => props.setState({ selectedTable: ev.target.value })}>
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
