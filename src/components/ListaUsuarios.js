import React, {useState, useEffect} from 'react'
import {Modal, ModalBody, ModalFooter, ModalHeader} from 'reactstrap';
import axios from 'axios';

const ListaUsuarios = () => {

    const [data, setData] = React.useState([]);
    const baseUrl="http://localhost/blog_konecta/";
    const [modalInsertar, setModalInsertar]= useState(false);
    const [modalEditar, setModalEditar]= useState(false);
    const [modalEliminar, setModalEliminar]= useState(false);
    const [usuarioSeleccionado, setusuarioSeleccionado]=useState({
        id: '',
        identificacion:'',
        nombre: '',
        correo: '',
        contrasena: '',
        numeromovil:'',
        idtipousuario: 2,
        tipousuario:'Usuario'
    });
    
    const handleChange=e=>{
        const {name, value}=e.target;
        setusuarioSeleccionado((prevState)=>({
            ...prevState,
            [name]: value
        }))
        if(name == 'idtipousuario'){
            if (value == 1){
                setusuarioSeleccionado((prevState)=>({
                    ...prevState,
                    ['tipousuario']: 'Administrador'
                }))
            }
            if (value == 2){
                setusuarioSeleccionado((prevState)=>({
                    ...prevState,
                    ['tipousuario']: 'Usuario'
                }))
            }
        }
        console.log(usuarioSeleccionado);
    }
    
    const abrirCerrarModalInsertar=()=>{
        setModalInsertar(!modalInsertar);
    }
    
    const abrirCerrarModalEditar=()=>{
        setModalEditar(!modalEditar);
    }
    
    const abrirCerrarModalEliminar=()=>{
        setModalEliminar(!modalEliminar);
    }

    const seleccionarUsuario=(usuario, caso)=>{
        setusuarioSeleccionado(usuario);
    
        (caso==="Editar")?
        abrirCerrarModalEditar():
        abrirCerrarModalEliminar()
    }

    useEffect(() => {
        console.log('UseEffect')
        listarUsuarios()
    }, [])

    //Listado de usuarios via API
    const listarUsuarios=async()=>{
        var f = new FormData();
        f.append("action", "listarUsuarios");
        await axios.post(baseUrl, f)
        .then(response=>{
          setData(response.data.usuarios);
        }).catch(error=>{
          console.log(error);
        })
    }

    //Crear
    const crearUsuario=async()=>{
        var f = new FormData();
        f.append("identificacion", usuarioSeleccionado.identificacion);
        f.append("nombre", usuarioSeleccionado.nombre);
        f.append("correo", usuarioSeleccionado.correo);
        f.append("contrasena", usuarioSeleccionado.contrasena);
        f.append("numeromovil", usuarioSeleccionado.numeromovil);
        f.append("idtipousuario", usuarioSeleccionado.idtipousuario);
        f.append("tipousuario", usuarioSeleccionado.tipousuario);
        f.append("action", "crearUsuario");
        await axios.post(baseUrl, f)
        .then(response=>{
            if(response.data.exito)
            {
                setData(response.data.usuarios);
                abrirCerrarModalInsertar();
            }
            alert(response.data.mensaje);

        }).catch(error=>{
            console.log(error);
        })
      }
      
      //Editar
      const editarUsuario=async()=>{
        var f = new FormData();
        f.append("id", usuarioSeleccionado.id);
        f.append("identificacion", usuarioSeleccionado.identificacion);
        f.append("nombre", usuarioSeleccionado.nombre);
        f.append("correo", usuarioSeleccionado.correo);
        f.append("contrasena", (usuarioSeleccionado.contrasena != null) ? usuarioSeleccionado.contrasena : "");
        f.append("numeromovil", usuarioSeleccionado.numeromovil);
        f.append("idtipousuario", usuarioSeleccionado.idtipousuario);
        f.append("tipousuario", usuarioSeleccionado.tipousuario);
        f.append("action", "editarUsuario");
        await axios.post(baseUrl, f)
        .then(response=>{
            if(response.data.exito)
            {
                var dataNueva= response.data.usuarios;
                dataNueva.map(usuario=>{
                    if(usuario.id===usuarioSeleccionado.id){
                    usuario.nombre=usuarioSeleccionado.nombre;
                    usuario.identificacion=usuarioSeleccionado.identificacion;
                    usuario.correo=usuarioSeleccionado.correo;
                    usuario.numeromovil=usuarioSeleccionado.numeromovil;
                    usuario.idtipousuario=usuarioSeleccionado.idtipousuario;
                    usuario.tipousuario=usuarioSeleccionado.tipousuario;
                    }
                });
                setData(dataNueva);
                abrirCerrarModalEditar();
            }
            alert(response.data.mensaje);
        }).catch(error=>{
          console.log(error);
        })
      }
      
      //Eliminar
      const eliminarUsuario=async()=>{
        var f = new FormData();
        f.append("id", usuarioSeleccionado.id);
        f.append("action", "eliminarUsuario");
        await axios.post(baseUrl, f, {params: {id: usuarioSeleccionado.id}})
        .then(response=>{
            if(response.data.exito)
            {
                setData(response.data.usuarios.filter(usuario=>usuario.id!==usuarioSeleccionado.id));
                abrirCerrarModalEliminar();
            }
            alert(response.data.mensaje);
        }).catch(error=>{
          console.log(error);
        })
      }

    return (
        <div>
            <h2>Listado de usuarios</h2>
            <table className="table">
                <thead>
                    <tr>
                    <th scope="col">Identificacion</th>
                    <th scope="col">Nombre</th>
                    <th scope="col">Correo</th>
                    <th scope="col">Tipo Usuario</th>
                    <th scope="col">Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map(usuario=>(
                        <tr key={usuario.id}>
                            <td>{usuario.identificacion}</td>
                            <td>{usuario.nombre}</td>
                            <td>{usuario.correo}</td>
                            <td>{usuario.tipousuario}</td>
                            <td>
                                <button className="btn btn-primary" onClick={()=>seleccionarUsuario(usuario, "Editar")}>Editar</button> {"  "}
                                <button className="btn btn-danger" onClick={()=>seleccionarUsuario(usuario, "Eliminar")}>Eliminar</button>
                            </td>
                        </tr>    
                    ))}
                </tbody>
            </table>

            <button className="btn btn-success" onClick={()=>abrirCerrarModalInsertar()}>Insertar</button>

            <Modal isOpen={modalInsertar}>
            <ModalHeader>Insertar Usuario</ModalHeader>
            <ModalBody>
                <div className="form-group">
                <label>Identificación:* </label>
                <br />
                <input type="text" className="form-control" name="identificacion" onChange={handleChange}/>
                <br />
                <label>Nombre:* </label>
                <br />
                <input type="text" className="form-control" name="nombre" onChange={handleChange}/>
                <br />
                <label>Correo:* </label>
                <br />
                <input type="text" className="form-control" name="correo" onChange={handleChange}/>
                <br />
                <label>Contraseña:* </label>
                <br />
                <input type="password" className="form-control" name="contrasena" onChange={handleChange}/>
                <br />
                <label>Número Móvil:* </label>
                <br />
                <input type="text" className="form-control" name="numeromovil" onChange={handleChange}/>
                <br />
                <label>Tipo usuario:* </label>
                <br />
                <select className="form-select" aria-label="Default select example" name="idtipousuario" onChange={handleChange}>
                    <option value="1">Administrador</option>
                    <option value="2" selected>Usuario</option>
                </select>
                <br />
                </div>
            </ModalBody>
            <ModalFooter>
                <button className="btn btn-primary" onClick={()=>crearUsuario()}>Insertar</button>{"   "}
                <button className="btn btn-danger" onClick={()=>abrirCerrarModalInsertar()}>Cancelar</button>
            </ModalFooter>
            </Modal>


            
            <Modal isOpen={modalEditar}>
            <ModalHeader>Editar Usuario</ModalHeader>
            <ModalBody>
            <div className="form-group">
                <label>Identificación: </label>
                <br />
                <input type="text" className="form-control" name="identificacion" onChange={handleChange} value={usuarioSeleccionado && usuarioSeleccionado.identificacion}/>
                <br />
                <label>Nombre:* </label>
                <br />
                <input type="text" className="form-control" name="nombre" onChange={handleChange} value={usuarioSeleccionado && usuarioSeleccionado.nombre}/>
                <br />
                <label>Correo:* </label>
                <br />
                <input type="text" className="form-control" name="correo" onChange={handleChange} value={usuarioSeleccionado && usuarioSeleccionado.correo}/>
                <br />
                <label>Contraseña:* </label>
                <br />
                <input type="password" className="form-control" name="contrasena" onChange={handleChange} />
                <br />
                <label>Número Móvil:* </label>
                <br />
                <input type="text" className="form-control" name="numeromovil" onChange={handleChange} value={usuarioSeleccionado && usuarioSeleccionado.numeromovil}/>
                <br />
                <label>Tipo usuario:* </label>
                <br />
                <select className="form-select" aria-label="Default select example" name="idtipousuario" onChange={handleChange} value={usuarioSeleccionado && usuarioSeleccionado.idtipousuario}>
                    <option value="1">Administrador</option>
                    <option value="2">Usuario</option>
                </select>
                <br />
                </div>
            </ModalBody>
            <ModalFooter>
                <button className="btn btn-primary" onClick={()=>editarUsuario()}>Editar</button>{"   "}
                <button className="btn btn-danger" onClick={()=>abrirCerrarModalEditar()}>Cancelar</button>
            </ModalFooter>
            </Modal>

            <Modal isOpen={modalEliminar}>
                <ModalBody>
                ¿Estás seguro que deseas eliminar el usuario {usuarioSeleccionado && usuarioSeleccionado.nombre}?
                </ModalBody>
                <ModalFooter>
                <button className="btn btn-danger" onClick={()=>eliminarUsuario()}>
                    Sí
                </button>
                <button
                    className="btn btn-secondary"
                    onClick={()=>abrirCerrarModalEliminar()}
                >
                    No
                </button>
                </ModalFooter>
            </Modal>
        </div>
    )

}

export default ListaUsuarios