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
import ListaBlogs from './components/ListaBlogs';
import Home from './components/Home';
import ListaCategorias from './components/ListaCategorias';

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
            Usuarios
          </NavLink>
          <NavLink to="/blogs" className="btn btn-dark">
            Blogs
          </NavLink>
          <NavLink to="/categorias" className="btn btn-dark">
            Categorias
          </NavLink>

        </div>
        <hr />
        <Switch>
          <Route path="/usuarios">
            <ListaUsuarios />
          </Route>
          <Route path="/blogs">
            <ListaBlogs />
          </Route>
          <Route path="/categorias">
            <ListaCategorias />
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