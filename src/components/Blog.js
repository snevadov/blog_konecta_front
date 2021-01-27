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
          setBlog(response.data.blog);
          setBlogs(response.data.blogs);
          setCategorias(response.data.categorias);
        }).catch(error=>{
          console.log(error);
        })
    }

    return (
        <div className="Container">
            <div class="row">
                <div class="col-sm-8">
                    <div class="card">
                    <div class="card-body">
                        <h2 class="card-title">{blog.titulo}</h2>
                        <h5 class="card-title">{blog.titulo}</h5>
                        <p class="card-text">{blog.textocorto}</p>
                        <p class="card-text">{blog.textolargo}</p>
                    </div>
                    </div>
                </div>
                <div class="col-sm-4">
                    <div class="card">
                    <div class="card-body">
                        <h5 class="card-title">Otros blogs</h5>
                        <ul class="list-group">                        
                            {blogs.map(blog=>(
                                <li class="list-group-item">
                                    <a href={`/blogs/${blog.id}/${blog.slug}`} class="card-link">{blog.slug}</a>
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