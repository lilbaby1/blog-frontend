import { Link } from "react-router-dom"

const Missing = () => {
    return (
        <article>
            <h1>Oops!</h1>
            <p>It seems like the page you were looking for cannot be found.</p>
            <div className="flexGrow">
                <Link to="/">Visit Our Homepage</Link>
            </div>
        </article>
    )
}

export default Missing