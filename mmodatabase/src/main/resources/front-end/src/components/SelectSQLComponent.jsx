import ReactDOM from 'react-dom';
import React, { useState } from 'react';
import { withRouter } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../css/SelectSQLComponent.scss'
import {Button, Form} from 'react-bootstrap';
import history from "../history.jsx";

function SelectSQLComponent(props){

    if (props.selectedQuery === null)
        props.setSelectedQuery(props.queries[0]);

    return props.selectedQuery === null ? (<div></div>) : (
        <Form>
            <Form.Label>Выберите запрос:</Form.Label>
            <Form.Control as="select" value={props.selectedQuery.queryDescription}
                          onChange={(ev) => {
                              props.setSelectedQuery(props.queries[ev.target.selectedIndex]);
                              props.setColumnsData(null);
                          }}>
                {
                    props.queries.map((obj, i) =>
                        <option>
                            {obj.queryDescription}
                        </option>)
                }
            </Form.Control>
        </Form>
    );
}

export default withRouter(SelectSQLComponent);