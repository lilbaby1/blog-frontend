import { createContext, useState } from "react";

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({});

  // Persist Login of user
  const [persist, setPersist] = useState(
    JSON.parse(localStorage.getItem("persist")) || false
  );

  // Sorting posts by newest or oldest
  const [sortPosts, setSortPosts] = useState(
    JSON.parse(localStorage.getItem("sortPosts")) || "Newest"
  );

  const [sortComments, setSortComments] = useState(
    JSON.parse(localStorage.getItem("sortComments")) || "Oldest"
  );

  // Current page
  const [currentPage, setCurrentPage] = useState(
    JSON.parse(localStorage.getItem("currentPage")) || 1
  );

  const updateCurrentPage = (newPage) => {
    setCurrentPage(newPage);
    localStorage.setItem("currentPage", JSON.stringify(newPage));
  };

  const updateSortPosts = (newSortPosts) => {
    setSortPosts(newSortPosts);
    localStorage.setItem("sortPosts", JSON.stringify(newSortPosts));
    updateCurrentPage(1);
  };

  return (
    <AuthContext.Provider
      value={{
        auth,
        setAuth,
        persist,
        setPersist,
        sortPosts,
        updateSortPosts,
        currentPage,
        updateCurrentPage,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
