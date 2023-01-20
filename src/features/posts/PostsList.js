import { useEffect, useRef, useState } from 'react'
import axios from '../../api/axios'
import PostCard from './PostCard'
import useAuth from '../../hooks/useAuth'
import { compareAsc } from 'date-fns'

const PostsList = () => {
    const [posts, setPosts] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const [sortPosts, setSortPosts] = useState('Newest')
    const { auth } = useAuth()

    const effectRan = useRef(false)

    useEffect(() => {
        setIsLoading(true)
        const controller = new AbortController()

        const getPosts = async () => {
            try {
                const response = await axios.get('/posts', {
                    signal: controller.signal
                })
                setPosts(response.data)
                setIsLoading(false)
            } catch (err) {
                console.error(err)
            }
        }

        if (effectRan.current){
            getPosts();
        }

        return () => {
            controller.abort();
            effectRan.current = true
        }
    }, [])

    // Sorting by date
    const sortedByNewest = posts.sort((a, b) => compareAsc(new Date(a.date), new Date(b.date))).reverse().map((post, i) => <PostCard key={i} post={post} />)
    const sortedByOldest = posts.sort((a, b) => compareAsc(new Date(a.date), new Date(b.date))).map((post, i) => <PostCard key={i} post={post} />)

  return (
    <section>
        { isLoading 
            ? (<p>"Loading posts..."</p>) 
            : !posts?.length 
                ? (<p>No posts to display</p>) 
                : (
                    <ul className='postsList'>
                        <select
                            className='sortBy'
                            value={sortPosts}
                            onChange={(e) => setSortPosts(e.target.value)}
                        >
                            <option value='Newest'>Sort by Newest</option>
                            <option value='Oldest'>Sort by Oldest</option>
                        </select>
                        { sortPosts === 'Newest' ? sortedByNewest : sortedByOldest }
                    </ul>
                )
        }
    </section>
  )
}

export default PostsList