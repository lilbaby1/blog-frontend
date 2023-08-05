import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import TimeAgo from "./TimeAgo";

const PostCard = ({ post }) => {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    function handleResize() {
      setWindowWidth(window.innerWidth);
    }

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <article className="postCard">
      <h2>{post.title}</h2>
      {post.content.length >= 75 && windowWidth <= 700 ? (
        <p>{post.content.substring(0, 75)}...</p>
      ) : (
        <p>{post.content.substring(0, 500)}</p>
      )}
      <p>
        <Link className="postLink" to={`post/${post._id}`}>
          View post
        </Link>{" "}
        by {post.author}
        <br />
        {post.edited ? (
          <TimeAgo edited timestamp={post.edited} />
        ) : (
          <TimeAgo timestamp={post.date} />
        )}
      </p>
    </article>
  );
};

export default PostCard;
