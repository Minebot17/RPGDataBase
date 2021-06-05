import React, { useState } from 'react';
import { Router, Route, Switch, Link, withRouter } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../css/base.scss';
import history from "../history.jsx";
import { getCookie } from "../cookies.jsx";
import { Button, Nav, Navbar, Form } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { AnimatedSwitch } from 'react-router-transition';
import ChangePage from "./ChangePage.jsx";

function MainApp(){

    if (history.location.pathname === "/")
        history.push("view");

    let onClickShow = () => history.push("/view");
    let onClickChange = () => history.push("/change");
    let onClickAnalytics = () => history.push("/analytics");

    const [dbList, setDbList] = useState([]);
    const [changeState, setChangeState] = useState({ selectedTable: null });

    if (dbList.length === 0){
        fetch("http://127.0.0.1:1234/api/getTables")
            .then(res => res.json())
            .then(result => {
                setDbList(result);
            }, error => {
                console.log(error);
            });
    }

    return (
        <Router history={history}>
            <header>
                <img src="./res/logo.png" />
                <Button onClick={onClickShow}>Просмотр</Button>
                <Button onClick={onClickChange}>Изменение</Button>
                <Button onClick={onClickAnalytics}>Аналитика</Button>
            </header>
            <main>
                <Route path="/view">

                </Route>
                <Route path="/change">
                    <ChangePage dbList={dbList} changeState={changeState} setChangeState={setChangeState} />
                </Route>
                <Route path="/analytics">

                </Route>
            </main>
        </Router>
    );
}

export default MainApp;