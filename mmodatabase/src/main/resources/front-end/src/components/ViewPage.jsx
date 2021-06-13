import ReactDOM from 'react-dom';
import React, { useState } from 'react';
import { withRouter } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../css/ViewPage.scss'
import {Button, Form} from 'react-bootstrap';
import history from "../history.jsx";
import SelectTableComponent from "./SelectTableComponent.jsx";
import ViewTableComponent from "./ViewTableComponent.jsx";

function ViewPage(props){
    let selectedTable = props.viewState.selectedTable

    return (
        <div>
            <SelectTableComponent dbList={props.dbList} state={props.viewState} setState={props.setViewState} />
            {(selectedTable != null ?
                    <div>
                        <ViewTableComponent state={props.viewState} setState={props.setViewState} />
                    </div>
                    :
                    <div></div>
            )}
        </div>
    );
}

export default withRouter(ViewPage);
