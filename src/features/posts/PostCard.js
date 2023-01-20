import { Link } from 'react-router-dom'
import TimeAgo from './TimeAgo'

const PostCard = ({ post }) => {
  return (
    <article>
        <h2>{post.title}</h2>
        {post.content.length >= 75 ? <p>{post.content.substring(0,75)}...</p> : <p>{post.content}</p>}
        <p>
          <Link className='postLink' to={`post/${post._id}`}>View post</Link> by {post.author}
          <br />
          { post.edited 
              ? (<TimeAgo edited timestamp={post.edited}/>) 
              : (<TimeAgo timestamp={post.date}/>) 
          }
        </p>
    </article>
  )
}

export default PostCard