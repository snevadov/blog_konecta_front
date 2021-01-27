import React, {useState, useEffect} from 'react'
import {Modal, ModalBody, ModalFooter, ModalHeader} from 'reactstrap';
import axios from 'axios';

const ListaCategorias = () => {

    const [data, setData] = React.useState([]);
    const baseUrl="http://localhost/blog_konecta/";
    const [modalInsertar, setModalInsertar]= useState(false);
    const [modalEditar, setModalEditar]= useState(false);
    const [modalEliminar, setModalEliminar]= useState(false);
    const [categoriaSeleccionada, setcategoriaSeleccionada]=useState({
        id: '',
        nombre:'',
        descripcion: ''
    });
    
    const handleChange=e=>{
        const {name, value}=e.target;
        setcategoriaSeleccionada((prevState)=>({
            ...prevState,
            [name]: value
        }))
        console.log(categoriaSeleccionada);
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

    const seleccionarCategoria=(categoria, caso)=>{
        setcategoriaSeleccionada(categoria);
    
        (caso==="Editar")?
        abrirCerrarModalEditar():
        abrirCerrarModalEliminar()
    }

    useEffect(() => {
        console.log('UseEffect')
        listarCategorias()
    }, [])

    //Listado de categorias via API
    const listarCategorias=async()=>{
        var f = new FormData();
        f.append("action", "listarCategorias");
        await axios.post(baseUrl, f)
        .then(response=>{
          setData(response.data.categorias);
        }).catch(error=>{
          console.log(error);
        })
    }

    //Crear
    const crearCategoria=async()=>{
        var f = new FormData();
        f.append("nombre", categoriaSeleccionada.nombre);
        f.append("descripcion", categoriaSeleccionada.descripcion);
        f.append("action", "crearCategoria");
        await axios.post(baseUrl, f)
        .then(response=>{
            if(response.data.exito){
                setData(response.data.categorias);
                abrirCerrarModalInsertar();
            }
            alert(response.data.mensaje);
        }).catch(error=>{
            console.log(error);
        })
      }
      
      //Editar
      const editarCategoria=async()=>{
        var f = new FormData();
        f.append("id", categoriaSeleccionada.id);
        f.append("nombre", categoriaSeleccionada.nombre);
        f.append("descripcion", categoriaSeleccionada.descripcion);
        f.append("action", "editarCategoria");
        await axios.post(baseUrl, f)
        .then(response=>{
            if(response.data.exito){
                var dataNueva= response.data.categorias;
                dataNueva.map(categoria=>{
                    if(categoria.id===categoriaSeleccionada.id){
                    categoria.nombre=categoriaSeleccionada.nombre;
                    categoria.descripcion=categoriaSeleccionada.descripcion;
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
      const eliminarCategoria=async()=>{
        var f = new FormData();
        f.append("id", categoriaSeleccionada.id);
        f.append("action", "eliminarCategoria");
        await axios.post(baseUrl, f, {params: {id: categoriaSeleccionada.id}})
        .then(response=>{
            if(response.data.exito){
                setData(response.data.categorias.filter(categoria=>categoria.id!==categoriaSeleccionada.id));
                abrirCerrarModalEliminar();
            }
            alert(response.data.mensaje);
        }).catch(error=>{
          console.log(error);
        })
      }

    return (
        <div>
            <h2>Listado de categorias</h2>
            <table className="table">
                <thead>
                    <tr>
                    <th scope="col">Nombre</th>
                    <th scope="col">Descripcion</th>
                    <th scope="col">Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map(categoria=>(
                        <tr key={categoria.id}>
                            <td>{categoria.nombre}</td>
                            <td>{categoria.descripcion}</td>
                            <td>
                                <button className="btn btn-primary" onClick={()=>seleccionarCategoria(categoria, "Editar")}>Editar</button> {"  "}
                                <button className="btn btn-danger" onClick={()=>seleccionarCategoria(categoria, "Eliminar")}>Eliminar</button>
                            </td>
                        </tr>    
                    ))}
                </tbody>
            </table>

            <button className="btn btn-success" onClick={()=>abrirCerrarModalInsertar()}>Insertar</button>

            <Modal isOpen={modalInsertar}>
            <ModalHeader>Insertar Categoría</ModalHeader>
            <ModalBody>
                <div className="form-group">
                <label>Nombre:* </label>
                <br />
                <input type="text" className="form-control" name="nombre" onChange={handleChange}/>
                <br />
                <label>Descripción:* </label>
                <br />
                <input type="text" className="form-control" name="descripcion" onChange={handleChange}/>
                <br />
                </div>
            </ModalBody>
            <ModalFooter>
                <button className="btn btn-primary" onClick={()=>crearCategoria()}>Insertar</button>{"   "}
                <button className="btn btn-danger" onClick={()=>abrirCerrarModalInsertar()}>Cancelar</button>
            </ModalFooter>
            </Modal>


            
            <Modal isOpen={modalEditar}>
            <ModalHeader>Editar Categoría</ModalHeader>
            <ModalBody>
            <div className="form-group">
                <label>Nombre:* </label>
                <br />
                <input type="text" className="form-control" name="nombre" onChange={handleChange} value={categoriaSeleccionada && categoriaSeleccionada.nombre}/>
                <br />
                <label>Descripción:* </label>
                <br />
                <input type="text" className="form-control" name="descripcion" onChange={handleChange} value={categoriaSeleccionada && categoriaSeleccionada.descripcion}/>
                <br />
                </div>
            </ModalBody>
            <ModalFooter>
                <button className="btn btn-primary" onClick={()=>editarCategoria()}>Editar</button>{"   "}
                <button className="btn btn-danger" onClick={()=>abrirCerrarModalEditar()}>Cancelar</button>
            </ModalFooter>
            </Modal>

            <Modal isOpen={modalEliminar}>
                <ModalBody>
                ¿Estás seguro que deseas eliminar la categoría {categoriaSeleccionada && categoriaSeleccionada.nombre}?
                </ModalBody>
                <ModalFooter>
                <button className="btn btn-danger" onClick={()=>eliminarCategoria()}>
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

export default ListaCategorias