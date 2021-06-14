import ReactDOM from 'react-dom';
import React, { useState } from 'react';
import { withRouter } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../css/ViewTableComponent.scss'
import {Button, Form, Table} from 'react-bootstrap';
import history from "../history.jsx";

function ViewTableComponent(props){
    let selectedTable = props.state.selectedTable
    const [loadedTable, setLoadedTable] = useState(null);
    const [columnsData, setColumnsData] = useState([]);
    const [columnsExclude, setColumnsExclude] = useState([]);

    if (selectedTable !== loadedTable){
        fetch("/api/getJoinedTable", {
            method: "POST",
            mode:'no-cors',
            body: JSON.stringify(selectedTable),
            headers: { 'Content-Type': 'application/json' }
        })
            .then(res => res.json())
            .then(result => {
                setLoadedTable(selectedTable);
                setColumnsData(result.data);
                setColumnsExclude(result.fk);
            }, error => {
                console.log(error);
            })
    }

    return (
        columnsData.length === 0 ? <div></div> :
        <div>
            <Table striped bordered hover size="sm">
                <thead>
                    <tr>
                        {
                            Object.keys(columnsData[0]).map((obj, i) => {
                                if (!columnsExclude.includes(obj))
                                    return <th>{obj}</th>
                            })
                        }
                    </tr>
                </thead>
                <tbody>
                {
                    columnsData.map((obj, i) =>
                        <tr>
                            {
                                Object.values(obj).map((obj1, j) => {
                                    if (!columnsExclude.includes(Object.keys(columnsData[0])[j]))
                                        return <td>{obj1}</td>
                                })
                            }
                        </tr>
                    )
                }
                </tbody>
            </Table>
        </div>
    );
}

export default withRouter(ViewTableComponent);
