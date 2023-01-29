import { useEffect, useRef, useState } from 'react'
import axios from '../../api/axios'
import PostCard from './PostCard'
import useAuth from '../../hooks/useAuth'
import { AnimatePresence, motion } from 'framer-motion'

const PostsList = () => {
    const [posts, setPosts] = useState([])
    const [postsNumber, setPostsNumber] = useState(0)
    const [isLoading, setIsLoading] = useState(false)

    const { sortPosts, updateSortPosts, currentPage, updateCurrentPage } = useAuth()
    const sortQuery = sortPosts === 'Oldest' ? '&sort=oldest' : ''

    const [postsPerPage] = useState(5)

    const effectRan = useRef(false)

    useEffect(() => {
        setIsLoading(true)
        const controller = new AbortController()

        const getPosts = async () => {
            try {
                const response = await axios.get(
                    `/posts?page=${currentPage}&limit=${postsPerPage}${sortQuery}`,
                    {
                        signal: controller.signal
                    })
                setPosts(response.data.posts)
                setPostsNumber(response.data.count)
                setIsLoading(false)
            } catch (err) {
                console.error(err)
            }
        }

        if (effectRan.current) {
            getPosts();
        }

        return () => {
            controller.abort();
            effectRan.current = true
        }
    }, [sortPosts, currentPage])

    const numPages = Math.ceil(postsNumber / postsPerPage)

    return (
        <section>
            {isLoading
                ? (<p>"Loading posts..."</p>)
                : !posts?.length
                    ? (<p>No posts to display</p>)
                    : (
                        <ol className='postsList'>
                            <select
                                className='sortBy'
                                value={sortPosts}
                                onChange={(e) => updateSortPosts(e.target.value)}
                            >
                                <option value='Newest'>Sort by Newest</option>
                                <option value='Oldest'>Sort by Oldest</option>
                            </select>
                            <AnimatePresence>
                                {posts.map((post, i) => (
                                    <motion.li
                                        key={i}
                                        animateKey={post.id}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                    >
                                        <PostCard key={post.id} post={post} />
                                    </motion.li>
                                ))}
                            </AnimatePresence>
                            <div className='pagination'>
                                <button
                                    className='pageButton'
                                    disabled={currentPage === 1}
                                    onClick={() => updateCurrentPage(1)}>
                                    First
                                </button>
                                <button
                                    className='pageButton'
                                    disabled={currentPage === 1}
                                    onClick={() => updateCurrentPage(currentPage - 1)}>
                                    Prev
                                </button>
                                <span>{`${currentPage} of ${numPages}`}</span>
                                <button
                                    className='pageButton'
                                    disabled={currentPage === numPages}
                                    onClick={() => updateCurrentPage(currentPage + 1)}>
                                    Next
                                </button>
                                <button
                                    className='pageButton'
                                    disabled={currentPage === numPages}
                                    onClick={() => updateCurrentPage(numPages)}>
                                    Last
                                </button>
                            </div>
                        </ol>
                    )
            }
        </section>
    )
}

export default PostsList