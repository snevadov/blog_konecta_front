import { useParams } from 'react-router-dom'
import React, {useState, useEffect} from 'react'
import {Modal, ModalBody, ModalFooter, ModalHeader} from 'reactstrap';
import axios from 'axios';
import {Link} from 'react-router-dom';

const Blog = () => {

    const {id} = useParams();
    const [blog, setBlog] = React.useState([]);
    const [blogs, setBlogs] = React.useState([]);
    const [categorias, setCategorias] = React.useState([]);
    const [categoriastexto, setCategoriasTexto] = React.useState([]);
    const baseUrl="http://localhost/blog_konecta/";

    useEffect(() => {
        console.log('UseEffect')
        verBlog();
    }, [])

    //Listado de usuarios via API
    const verBlog=async()=>{
        var f = new FormData();
        f.append("id", id);
        f.append("action", "verBlog");
        await axios.post(baseUrl, f)
        .then(response=>{
            if(response.data.exito)
            {
                setBlog(response.data.blog);
                setCategorias(response.data.categorias);
                setBlogs(response.data.blogs.filter(blog=>blog.id!==response.data.blog.id));
                var categoriasTexto = '';
                response.data.categorias.forEach(categoria => {
                    response.data.blog.idcategorias.forEach(idcategoria => {
                        if(idcategoria == categoria.id){
                            categoriasTexto += categoria.nombre + ' ';
                        }
                    })
                    
                });
                setCategoriasTexto(categoriasTexto);
            } else {
                alert(response.data.mensaje);
            }
        }).catch(error=>{
          console.log(error);
        })
    }

    return (
        <div className="Container">
            <div className="row">
                <div className="col-sm-8">
                    <div className="card">
                    <div className="card-body">
                        <h2 className="card-title">{blog.titulo}</h2>
                        <h5 className="card-title">{categoriastexto}</h5>
                        <p className="card-text">{blog.textocorto}</p>
                        <p className="card-text">{blog.textolargo}</p>
                    </div>
                    </div>
                </div>
                <div className="col-sm-4">
                    <div className="card">
                    <div className="card-body">
                        <h5 className="card-title">Otros blogs</h5>
                        <ul className="list-group">                        
                            {blogs.map(blog=>(
                                <li key={blog.id} className="list-group-item">
                                    <a href={`/blogs/${blog.id}/${blog.slug}`} className="card-link">{blog.slug}</a>
                                </li> 
                            ))}
                        </ul>
                    </div>
                    </div>
                </div>
            </div>
            <Link className="btn btn-success" to={`/blogs/`}>
                Volver
            </Link>
        </div>
    )

}

export default Blog