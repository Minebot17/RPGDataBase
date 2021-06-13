import ReactDOM from 'react-dom';
import React, { useState } from 'react';
import { withRouter } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../css/AnalyticsTableComponent.scss'
import {Button, Form, Table} from 'react-bootstrap';
import history from "../history.jsx";

function AnalyticsTableComponent(props){
    return (
        props.columnsData.length === 0 ? <div></div> :
            <div>
                <Table striped bordered hover size="sm">
                    <thead>
                    <tr>
                        {
                            Object.keys(props.columnsData[0]).map((obj, i) =>
                                <th>{obj}</th>
                            )
                        }
                    </tr>
                    </thead>
                    <tbody>
                    {
                        props.columnsData.map((obj, i) =>
                            <tr>
                                {
                                    Object.values(obj).map((obj1, j) => {
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

export default withRouter(AnalyticsTableComponent);
