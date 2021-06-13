import ReactDOM from 'react-dom';
import React, { useState } from 'react';
import { withRouter } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../css/AnalyticsPage.scss'
import {Button, Form} from 'react-bootstrap';
import history from "../history.jsx";

import SelectSQLComponent from "./SelectSQLComponent.jsx";
import AnalyticsParametersComponent from "./AnalyticsParametersComponent.jsx";
import AnalyticsTableComponent from "./AnalyticsTableComponent.jsx";

function AnalyticsPage(props){
    const [queries, setQueries] = useState(null);
    const [selectedQuery, setSelectedQuery] = useState(null);
    const [columnsData, setColumnsData] = useState(null);

    if (queries === null){
        fetch("http://127.0.0.1:1234/api/getQueriesList", {
            method: "POST",
            body: JSON.stringify({}),
            headers: { 'Content-Type': 'application/json' }
        })
            .then(res => res.json())
            .then(result => {
                setQueries(result);
            }, error => {
                console.log(error);
            })
    }

    return (
        <div>
            {
                queries === null ? <div></div> :
                    <SelectSQLComponent queries={queries} selectedQuery={selectedQuery} setSelectedQuery={setSelectedQuery} setColumnsData={setColumnsData}/>
            }
            {
                selectedQuery === null ? <div></div> :
                    <AnalyticsParametersComponent selectedQuery={selectedQuery} setColumnsData={setColumnsData} />
            }
            {
                columnsData === null ? <div></div> :
                    <AnalyticsTableComponent columnsData={columnsData}  />
            }
        </div>
    );
}

export default withRouter(AnalyticsPage);