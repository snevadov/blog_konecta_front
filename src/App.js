import React, {useState, useEffect} from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import {Modal, ModalBody, ModalFooter, ModalHeader} from 'reactstrap';
import axios from 'axios';

import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  NavLink
} from "react-router-dom";
import ListaUsuarios from './components/ListaUsuarios';
import CrearUsuario from './components/CrearUsuario';
import EditarUsuario from './components/EditarUsuario';
import Home from './components/Home';

function App() {
  const baseUrl="http://localhost/blog_konecta/";
  const [data, setData]=useState([]);

  return (
    <Router>
      <div className="container mt-5">
        <h1>Blogs Konecta</h1>
        <div className="btn-group">
          <NavLink to="/" className="btn btn-dark">
            Inicio
          </NavLink>
          <NavLink to="/usuarios" className="btn btn-dark">
            Listado Usuario
          </NavLink>
          <NavLink to="/crearUsuario" className="btn btn-dark">
            Crear Usuario
          </NavLink>
          <NavLink to="/editarUsuario" className="btn btn-dark" activeClassName="active">
            Editar Usuario
          </NavLink>

        </div>
        <hr />
        <Switch>
          <Route path="/usuarios">
            <ListaUsuarios />
          </Route>
          <Route path="/crearUsuario">
            <CrearUsuario />
          </Route>
          <Route path="/editarUsuario">
            <EditarUsuario />
          </Route>
          <Route path="/crearUsuarios">
            <CrearUsuario />
          </Route>
          <Route path="/crearUsuarios">
            <CrearUsuario />
          </Route>
          <Route path="/">
            <Home />
          </Route>
        </Switch>
      </div>
    </Router>
    
  );
}

export default App;