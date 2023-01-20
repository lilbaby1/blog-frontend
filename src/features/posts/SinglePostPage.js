import { useState, useEffect, useRef } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import axios from '../../api/axios'
import TimeAgo from './TimeAgo'
import useAuth from '../../hooks/useAuth'
import jwt_decode from "jwt-decode";

const SinglePostPage = () => {
    const { postId } = useParams()
    const { auth } = useAuth()

    const decoded = auth?.accessToken 
        ? jwt_decode(auth.accessToken) : undefined

    const roles = decoded?.UserInfo?.roles
    const admin = 5150

    const [post, setPost] = useState([])
    const [isLoading, setIsLoading] = useState(false)

    const navigate = useNavigate()

    const effectRan = useRef(false)

    useEffect(() => {
        setIsLoading(true)
        const controller = new AbortController()

        const getPost = async () => {
            try {
                const response = await axios.get(`/posts/${postId}`, {
                    signal: controller.signal
                })
                setPost(response.data)
                setIsLoading(false)
            } catch (err) {
                console.error(err)
            }
        }

        if (effectRan.current){
            getPost();
        }

        return () => {
            controller.abort();
            effectRan.current = true
        }
    }, [])

    const deletePost = async () => {
        try {
            const response = await axios.delete(`/posts/${postId}`, 
                {
                    headers: { 
                        'Content-Type': 'application/json', 
                        'Authorization': `Bearer ${auth.accessToken}`
                    },
                    withCredentials: true
                }
            )
            navigate('/')
        } catch (err) {
            console.error(err)
        }
    }
    
    if (!post) {
        return (
            <section>
                <h2>Post not found!</h2>
            </section>
        )
    }

    if (isLoading) {
        return (
            <section>
                <p>Loading post...</p>
            </section>
        )
    }

  return (
    <article>
        <h2>{post.title}</h2>
        
        <p>{post.content}</p>
        
        <p>
            <i><b>by {post.author}</b></i> 
            <br />
            <TimeAgo timestamp={post.date} />
        
            {post.edited 
                ? (<>
                    <br />
                    <TimeAgo edited timestamp={post.edited} />
                </>) 
                : null
            }
        </p>
        {/* checking if the user has role admin or is the author of the post */}
        <div className='postButtons'>
            { roles && (roles.includes(admin) || post.author === auth.user) && 
                <button className='deleteButton' onClick={async () => { await deletePost()}}>Delete</button> 
            }
            {post.author === auth.user && 
                <Link className="editButton" to={`../edit/${postId}`}>Edit</Link> 
            } 
        </div>
    </article>
  )
}

export default SinglePostPage