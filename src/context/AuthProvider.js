import { createContext, useState } from "react";

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
    const [auth, setAuth] = useState({});
    const [persist, setPersist] = useState(JSON.parse(localStorage.getItem("persist")) || false);
    const [sortPosts, setSortPosts] = useState(JSON.parse(localStorage.getItem("sortPosts")) || 'Newest')
    const [currentPage, setCurrentPage] = useState(JSON.parse(localStorage.getItem("currentPage")) || 1)

    const updateSortPosts = (newSortPosts) => {
        setSortPosts(newSortPosts);
        localStorage.setItem("sortPosts", JSON.stringify(newSortPosts));
    }

    const updateCurrentPage = (newPage) => {
        setCurrentPage(newPage)
        localStorage.setItem('currentPage', JSON.stringify(newPage))
    }

    return (
        <AuthContext.Provider value={
            {
                auth, setAuth,
                persist, setPersist,
                sortPosts, updateSortPosts,
                currentPage, updateCurrentPage
            }}>
            {children}
        </AuthContext.Provider>
    )
}

export default AuthContext;