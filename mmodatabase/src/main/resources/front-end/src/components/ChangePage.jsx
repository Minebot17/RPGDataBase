import ReactDOM from 'react-dom';
import React, { useState } from 'react';
import { withRouter } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../css/ChangePage.scss'
import {Button, Form} from 'react-bootstrap';
import history from "../history.jsx";
import SelectTableComponent from "./SelectTableComponent.jsx";

function ChangePage(props){
    return (
        <div>
            <SelectTableComponent dbList={props.dbList} changeState={props.changeState} setChangeState={props.setChangeState} />
            {(props.changeState.selectedTable != null ?
                    <div>
                        <Form>
                            <Form.Label>Добавить новый элемент:</Form.Label>

                        </Form>
                    </div>
                :
                    <div></div>
            )}
        </div>
    );
}

export default withRouter(ChangePage);
