import ReactDOM from 'react-dom';
import React, { useState } from 'react';
import { withRouter } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../css/ChangeTableComponent.scss'
import {Button, Form, Table} from 'react-bootstrap';
import history from "../history.jsx";

function ChangeTableComponent(props){
    const [loadedTable, setLoadedTable] = useState(null);
    const [columnsData, setColumnsData] = useState([]);
    const [editColumnNumbers, setEditColumnNumbers] = useState([]);
    const [editColumnData, setEditColumnData] = useState([]);

    let selectedTable = props.changeState.selectedTable;

    if (selectedTable !== loadedTable){
        fetch("http://127.0.0.1:1234/api/getTableRows", {
            method: "POST",
            body: JSON.stringify(selectedTable),
            headers: { 'Content-Type': 'application/json' }
        })
            .then(res => res.json())
            .then(result => {
                setLoadedTable(selectedTable);
                setColumnsData(result);
                setEditColumnNumbers([]);
                setEditColumnData([]);
            }, error => {
                console.log(error);
            })
    }

    let editOnClick = (ev, i) => {
        let columnNumbers = [...editColumnNumbers];
        columnNumbers.push(i);
        setEditColumnNumbers(columnNumbers);

        let columnData = [...editColumnData];
        columnData.push({ id: i, data: Object.values(columnsData[i]) });
        setEditColumnData(columnData);
    };

    let fieldOnChange = (ev, i, j) => {
        let indexInData = editColumnData.findIndex(e => e.id === i );
        let rowData = [...(editColumnData[indexInData].data)];
        rowData[j] = ev.target.value;

        let columnData = [...editColumnData];
        columnData[indexInData] = { id: i, data: rowData };
        setEditColumnData(columnData);
    };

    return (
        columnsData.length !== 0 ? <div>
            <Table striped bordered hover size="sm">
                <thead>
                    <tr>
                        <th className="tableHead"></th>
                        {
                            Object.keys(columnsData[0]).map((obj, i) =>
                                <th>{obj}</th>
                            )
                        }
                    </tr>
                </thead>
                <tbody>
                    {
                        columnsData.map((obj, i) =>
                            <tr>
                                <td>
                                    {
                                        !editColumnNumbers.includes(i) ?
                                        <div>
                                            <Button className="deleteButton" variant="light">
                                                <img src="./res/cross.png"/>
                                            </Button>
                                            <Button className="editButton" variant="light" onClick={ev => editOnClick(ev, i)}>
                                                <img src="./res/pencil.png" />
                                            </Button>
                                        </div>
                                            :
                                        <Button className="okButton" variant="light">
                                            <img src="./res/ok.png"/>
                                        </Button >
                                    }
                                </td>
                                {
                                    !editColumnNumbers.includes(i)
                                    ? Object.values(obj).map((obj1, j) =>
                                        <td>{obj1}</td>
                                    )
                                    : editColumnData.find(e => e.id === i).data.map((obj1, j) =>
                                        <td><Form.Control value={obj1} onChange={ev => fieldOnChange(ev, i, j)} /></td>
                                    )
                                }
                            </tr>
                        )
                    }
                </tbody>
            </Table>
        </div> : <div></div>
    );
}

export default withRouter(ChangeTableComponent);
