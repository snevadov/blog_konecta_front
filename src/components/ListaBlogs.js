import React, {useState, useEffect} from 'react'
import {Modal, ModalBody, ModalFooter, ModalHeader} from 'reactstrap';
import axios from 'axios';
import {Link} from 'react-router-dom';

const ListaBlogs = () => {

    const [data, setData] = React.useState([]);
    const [categorias, setCategorias] = React.useState([]);
    const baseUrl="http://localhost/blog_konecta/";
    const [modalInsertar, setModalInsertar]= useState(false);
    const [modalEditar, setModalEditar]= useState(false);
    const [modalEliminar, setModalEliminar]= useState(false);
    const [blogSeleccionado, setblogSeleccionado]=useState({
        id: '',
        titulo:'',
        slug: '',
        textocorto: '',
        textolargo: '',
        rutaimagen:'',
        idcategorias: [],
        categorias:''
    });
    
    const handleChange=e=>{
        const {name, value}=e.target;
        var nombre = '';
        categorias.forEach(element => {
            if(element.id==value){
                nombre = element.nombre;
            }
        });

        if(name == 'idcategorias'){
            setblogSeleccionado((prevState)=>({
                ...prevState,
                [name]: value,
                ['categorias']: nombre
            }))
        } else {
            setblogSeleccionado((prevState)=>({
                ...prevState,
                [name]: value
            }))
        }
        console.log(blogSeleccionado);
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

    const seleccionarBlog=(blog, caso)=>{
        setblogSeleccionado(blog);
        console.log(blog);
    
        (caso==="Editar")?
        abrirCerrarModalEditar():
        abrirCerrarModalEliminar()
    }

    useEffect(() => {
        listarBlogs();
        listarCategorias();
    }, [])

    //Listado de blogs via API
    const listarBlogs=async()=>{
        var f = new FormData();
        f.append("action", "listarBlogs");
        await axios.post(baseUrl, f)
        .then(response=>{
          setData(response.data.blogs);
        }).catch(error=>{
          console.log(error);
        })
    }

    //Listado de categorías via API
    const listarCategorias=async()=>{
        var f = new FormData();
        f.append("action", "listarCategorias");
        await axios.post(baseUrl, f)
        .then(response=>{
          setCategorias(response.data.categorias);
        }).catch(error=>{
          console.log(error);
        })
    }

    //Crear
    const crearBlog=async()=>{
        var f = new FormData();
        f.append("titulo", blogSeleccionado.titulo);
        f.append("slug", blogSeleccionado.slug);
        f.append("textocorto", blogSeleccionado.textocorto);
        f.append("textolargo", blogSeleccionado.textolargo);
        f.append("rutaimagen", blogSeleccionado.rutaimagen);
        f.append("idcategorias", blogSeleccionado.idcategorias);
        f.append("categorias", blogSeleccionado.categorias);
        f.append("action", "crearBlog");
        await axios.post(baseUrl, f)
        .then(response=>{
            if(response.data.exito)
            {
                setData(response.data.blogs);
                abrirCerrarModalInsertar();
            }
            alert(response.data.mensaje);
        }).catch(error=>{
            console.log(error);
        })
      }
      
      //Editar
      const editarBlog=async()=>{
        var f = new FormData();
        f.append("id", blogSeleccionado.id);
        f.append("titulo", blogSeleccionado.titulo);
        f.append("slug", blogSeleccionado.slug);
        f.append("textocorto", blogSeleccionado.textocorto);
        f.append("textolargo", blogSeleccionado.textolargo);
        f.append("rutaimagen", blogSeleccionado.rutaimagen);
        f.append("idcategorias", blogSeleccionado.idcategorias);
        f.append("categorias", blogSeleccionado.categorias);
        f.append("action", "editarBlog");

        await axios.post(baseUrl, f)
        .then(response=>{
            if(response.data.exito)
            {
                var dataNueva= response.data.blogs;
                dataNueva.map(blog=>{
                    if(blog.id===blogSeleccionado.id){
                    blog.titulo=blogSeleccionado.titulo;
                    blog.slug=blogSeleccionado.slug;
                    blog.textocorto=blogSeleccionado.textocorto;
                    blog.textolargo=blogSeleccionado.textolargo;
                    blog.rutaimagen=blogSeleccionado.rutaimagen;
                    blog.categorias=blogSeleccionado.categorias;
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
      const eliminarBlog=async()=>{
        var f = new FormData();
        f.append("id", blogSeleccionado.id);
        f.append("action", "eliminarBlog");
        await axios.post(baseUrl, f, {params: {id: blogSeleccionado.id}})
        .then(response=>{
            if(response.data.exito)
            {
                setData(response.data.blogs.filter(blog=>blog.id!==blogSeleccionado.id));
                abrirCerrarModalEliminar();
            }
            alert(response.data.mensaje);
        }).catch(error=>{
          console.log(error);
        })
      }

    return (
        <div className="Container">
            <h2>Listado de Blogs</h2>
            {data.map(blog=>(
                <div key={blog.id} className="card mb-3">
                    <div className="row g-0">
                        <div className="col-md-2 bg-dark">
                            <img className="img-thumbnai"></img>
                        </div>
                        <div className="col-md-8">
                            <div className="card-body">
                                <h5 className="card-title">{blog.titulo}</h5>
                                <p className="card-text">{blog.textocorto}</p>
                                <p className="card-text"><small className="text-muted">{blog.categorias}</small></p>
                            </div>
                            <div className="card-body">
                                <Link className="btn btn-secondary" to={`/blogs/${blog.id}/${blog.slug}`}>
                                    Leer más...
                                </Link>{"  "}
                                <button className="btn btn-primary" onClick={()=>seleccionarBlog(blog, "Editar")}>Editar</button> {"  "}
                                <button className="btn btn-danger" onClick={()=>seleccionarBlog(blog, "Eliminar")}>Eliminar</button>
                            </div>
                        </div>
                    </div>
                </div>
            ))}


            <button className="btn btn-success" onClick={()=>abrirCerrarModalInsertar()}>Insertar</button>

            <Modal isOpen={modalInsertar}>
            <ModalHeader>Insertar Blog</ModalHeader>
            <ModalBody>
                <div className="form-group">
                <label>Título:* </label>
                <br />
                <input type="text" className="form-control" name="titulo" onChange={handleChange}/>
                <br />
                <label>Texto corto:* </label>
                <br />
                <input type="text" className="form-control" name="textocorto" onChange={handleChange}/>
                <br />
                <label>Texto largo:* </label>
                <br />
                <input type="text" className="form-control" name="textolargo" rows="3" onChange={handleChange}/>
                <br />
                <label>URL Amigable (SLUG):* </label>
                <br />
                <input type="text" className="form-control" name="slug" onChange={handleChange}/>
                <br />
                <label>Ruta Imagen: </label>
                <br />
                <input type="text" className="form-control" name="rutaimagen" onChange={handleChange}/>
                <br />
                <label>Categorías:* </label>
                <br />
                <select className="form-select" aria-label="Default select example" name="idcategorias" onChange={handleChange}>
                    <option key="0" value="0" selected> Seleccione una opción</option>
                    {categorias.map(categoria=>(
                            <option key={categoria.id} id={categoria.id} value={categoria.id}>{categoria.nombre}</option>
                        ))}
                </select>
                <br />
                </div>
            </ModalBody>
            <ModalFooter>
                <button className="btn btn-primary" onClick={()=>crearBlog()}>Insertar</button>{"   "}
                <button className="btn btn-danger" onClick={()=>abrirCerrarModalInsertar()}>Cancelar</button>
            </ModalFooter>
            </Modal>


            
            <Modal isOpen={modalEditar}>
            <ModalHeader>Editar Blog</ModalHeader>
            <ModalBody>
            <div className="form-group">
                <label>Título:* </label>
                <br />
                <input type="text" className="form-control" name="titulo" onChange={handleChange} value={blogSeleccionado && blogSeleccionado.titulo}/>
                <br />
                <label>Texto corto:* </label>
                <br />
                <input type="text" className="form-control" name="textocorto" onChange={handleChange} value={blogSeleccionado && blogSeleccionado.textocorto}/>
                <br />
                <label>Texto largo:* </label>
                <br />
                <input type="text" className="form-control" name="textolargo" rows="3" onChange={handleChange} value={blogSeleccionado && blogSeleccionado.textolargo}/>
                <br />
                <label>URL Amigable (SLUG):* </label>
                <br />
                <input type="text" className="form-control" name="slug" onChange={handleChange} value={blogSeleccionado && blogSeleccionado.slug}/>
                <br />
                <label>Ruta Imagen: </label>
                <br />
                <input type="text" className="form-control" name="rutaimagen" onChange={handleChange} value={blogSeleccionado && blogSeleccionado.rutaimagen}/>
                <br />
                <label>Categorías:* </label>
                <br />
                <select className="form-select" aria-label="Default select example" name="idcategorias" onChange={handleChange} value={blogSeleccionado && blogSeleccionado.idcategorias}>
                    <option> Seleccione una opción</option>
                    {categorias.map(categoria=>(
                            <option key={categoria.id} id={categoria.id} value={categoria.id}>{categoria.nombre}</option>
                        ))}
                </select>
                <br />
                </div>
            </ModalBody>
            <ModalFooter>
                <button className="btn btn-primary" onClick={()=>editarBlog()}>Editar</button>{"   "}
                <button className="btn btn-danger" onClick={()=>abrirCerrarModalEditar()}>Cancelar</button>
            </ModalFooter>
            </Modal>

            <Modal isOpen={modalEliminar}>
                <ModalBody>
                ¿Estás seguro que deseas eliminar el blog {blogSeleccionado && blogSeleccionado.titulo}?
                </ModalBody>
                <ModalFooter>
                <button className="btn btn-danger" onClick={()=>eliminarBlog()}>
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

export default ListaBlogs