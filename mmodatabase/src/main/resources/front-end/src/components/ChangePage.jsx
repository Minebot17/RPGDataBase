import ReactDOM from 'react-dom';
import React, { useState } from 'react';
import { withRouter } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../css/ChangePage.scss'
import {Button, Form} from 'react-bootstrap';
import history from "../history.jsx";
import SelectTableComponent from "./SelectTableComponent.jsx";
import NewElementComponent from "./NewElementComponent.jsx";
import ChangeTableComponent from "./ChangeTableComponent.jsx";

function ChangePage(props){
    const [loadedTableTable, setLoadedTableTable] = useState(null);

    let selectedTable = props.changeState.selectedTable

    return (
        <div>
            <SelectTableComponent dbList={props.dbList} changeState={props.changeState} setChangeState={props.setChangeState} />
            {(selectedTable != null ?
                    <div>
                        <br />
                        <NewElementComponent changeState={props.changeState} setChangeState={props.setChangeState} setLoadedTableTable={setLoadedTableTable} />
                        <br />
                        <ChangeTableComponent changeState={props.changeState} setChangeState={props.setChangeState} loadedTableTable={loadedTableTable} setLoadedTableTable={setLoadedTableTable} />
                    </div>
                :
                    <div></div>
            )}
        </div>
    );
}

export default withRouter(ChangePage);
