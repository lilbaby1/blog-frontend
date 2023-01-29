import { useState } from "react"
import { useParams } from "react-router-dom"
import axios from "../../api/axios"
import jwt_decode from "jwt-decode";
import useAuth from "../../hooks/useAuth"
import './comments.css'

const AddCommentForm = (props) => {
    const { auth } = useAuth()
    const decoded = auth?.accessToken
        ? jwt_decode(auth.accessToken) : undefined

    const roles = decoded?.UserInfo?.roles

    const postIdObject = useParams()
    const postId = postIdObject.postId

    const [content, setContent] = useState('')
    const [reqStatus, setReqStatus] = useState('idle')

    const onPostCommentClicked = async () => {
        try {
            setReqStatus('pending')

            const response = await axios.post(
                '/comments',
                JSON.stringify({
                    content,
                    postId
                }),
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${auth.accessToken}`
                    },
                    withCredentials: true
                }
            )
            props.onSubmit()
            setContent('')
        } catch (err) {
            console.error('Failed to save the comment.', err)
        } finally {
            setReqStatus('idle')
        }
    }

    return (
        <>
            {roles && roles.includes(2001)
                ? (
                    <form className="commentForm">
                        <label
                            htmlFor="commentContent"
                        >Add a comment:</label>
                        <textarea
                            id="commentContent"
                            name="commentContent"
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                        />

                        <button
                            className="commentButton"
                            type="button"
                            onClick={onPostCommentClicked}
                            disabled={content === ''}
                        >Comment
                        </button>
                    </form>
                ) : (
                    <h4>Sign in to comment</h4>
                )
            }
        </>
    )
}

export default AddCommentForm