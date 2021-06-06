import ReactDOM from 'react-dom';
import React, { useState } from 'react';
import { withRouter } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../css/ChangeTableComponent.scss'
import {Button, Form, Table, Modal} from 'react-bootstrap';
import history from "../history.jsx";

function ChangeTableComponent(props){
    const [columnsData, setColumnsData] = useState([]);
    const [editColumnNumbers, setEditColumnNumbers] = useState([]);
    const [editColumnData, setEditColumnData] = useState([]);
    const [editError, setEditError] = useState(false);

    let selectedTable = props.changeState.selectedTable;

    if (selectedTable !== props.loadedTableTable){
        fetch("http://127.0.0.1:1234/api/getTableRows", {
            method: "POST",
            body: JSON.stringify(selectedTable),
            headers: { 'Content-Type': 'application/json' }
        })
            .then(res => res.json())
            .then(result => {
                props.setLoadedTableTable(selectedTable);
                setColumnsData(result);
                setEditColumnNumbers([]);
                setEditColumnData([]);
            }, error => {
                console.log(error);
            })
    }

    let editOnClick = i => {
        let columnNumbers = [...editColumnNumbers];
        columnNumbers.push(i);
        setEditColumnNumbers(columnNumbers);

        let columnData = [...editColumnData];
        columnData.push({ id: i, data: Object.values(columnsData[i]) });
        setEditColumnData(columnData);
    };

    let endEdit = i => {
        let columnNumbers = [...editColumnNumbers];
        let numberIndex = editColumnNumbers.indexOf(i);
        columnNumbers.splice(numberIndex, 1);
        setEditColumnNumbers(columnNumbers);

        let columnData = [...editColumnData];
        let dataIndex = editColumnData.findIndex(e => e.id === i);
        columnData.splice(dataIndex, 1)
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

    let deleteOnClick = i => {
        fetch("http://127.0.0.1:1234/api/removeRow", {
            method: "POST",
            body: JSON.stringify({
                tableName: selectedTable,
                tableKeys: Object.keys(columnsData[i]),
                tableValues: Object.values(columnsData[i])
            }),
            headers: { 'Content-Type': 'application/json' }
        })
            .then(res => res.json())
            .then(result => {
                props.setLoadedTableTable(null);
            }, error => {
                console.log(error);
            })
    };

    let editSuccessOnClick = i => {
        fetch("http://127.0.0.1:1234/api/editRow", {
            method: "POST",
            body: JSON.stringify({
                tableName: selectedTable,
                tableKeys: Object.keys(columnsData[i]),
                oldValues: Object.values(columnsData[i]),
                newValues: editColumnData.find(e => e.id === i).data
            }),
            headers: { 'Content-Type': 'application/json' }
        })
            .then(res => res.json())
            .then(result => {
                if (result.status === 500){
                    setEditError(true);
                    return;
                }

                endEdit(i);
                props.setLoadedTableTable(null);
            }, error => {
                console.log(error);
            })
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
                                            <Button className="deleteButton" variant="light" onClick={ev => deleteOnClick(i)}>
                                                <img src="./res/cross.png"/>
                                            </Button>
                                            <Button className="editButton" variant="light" onClick={ev => editOnClick(i)}>
                                                <img src="./res/pencil.png" />
                                            </Button>
                                        </div>
                                            :
                                        <Button className="okButton" variant="light" onClick={ev => editSuccessOnClick(i)}>
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

            <Modal show={editError} onHide={() => setEditError(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Ошибка редактирования</Modal.Title>
                </Modal.Header>
                <Modal.Body>Проверьте, что введеные id существуют в БД, и данные корректны.</Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" onClick={() => setEditError(false)}>
                        OK
                    </Button>
                </Modal.Footer>
            </Modal>
        </div> : <div></div>
    );
}

export default withRouter(ChangeTableComponent);
