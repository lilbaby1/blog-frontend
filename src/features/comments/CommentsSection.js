import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "../../api/axios";
import { compareAsc } from "date-fns";

import "./comments.css";
import AddCommentForm from "./AddCommentForm";
import CommentCard from "./CommentCard";

const CommentsSection = () => {
  const [comments, setComments] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(0);
  const [sortComments, setSortComments] = useState("oldest");

  const { postId } = useParams();

  const effectRan = useRef(false);

  useEffect(() => {
    setIsLoading(true);

    const getComments = async () => {
      try {
        const response = await axios.get(`/comments/${postId}`);
        setComments(response.data);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    if (effectRan.current) {
      getComments();
    }

    return () => {
      effectRan.current = true;
    };
  }, [formSubmitted]);

  // Sorting by date
  const getNewest = () =>
    comments
      .sort((a, b) => compareAsc(new Date(a.date), new Date(b.date)))
      .reverse()
      .map((comment, i) => <CommentCard key={i} comment={comment} />);

  const getOldest = () =>
    comments
      .sort((a, b) => compareAsc(new Date(a.date), new Date(b.date)))
      .map((comment, i) => <CommentCard key={i} comment={comment} />);

  return (
    <>
      <AddCommentForm onSubmit={() => setFormSubmitted((prev) => prev + 1)} />
      <section>
        {isLoading ? (
          <p>"Loading Comments..."</p>
        ) : !comments?.length ? (
          <p>No Comments to display</p>
        ) : (
          <>
            <select
              className="sortBy"
              value={sortComments}
              onChange={(e) => setSortComments(e.target.value)}
            >
              <option value="oldest">Sort by Oldest</option>
              <option value="newest">Sort by Newest</option>
            </select>
            <ol className="commentsList">
              {sortComments === "oldest" ? getOldest() : getNewest()}
            </ol>
          </>
        )}
      </section>
    </>
  );
};

export default CommentsSection;
