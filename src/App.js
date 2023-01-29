import { Routes, Route } from "react-router-dom";
import Layout from './components/Layout'
import RequireAuth from "./components/RequireAuth";
import PersistLogin from "./components/PersistLogin";

import Login from "./components/Login";
import Register from './components/Register'
import Logout from "./components/Logout";
import Unauthorized from "./components/Unauthorized";

import PostList from './features/posts/PostsList'
import SinglePostPage from "./features/posts/SinglePostPage";
import AddPostForm from "./features/posts/AddPostForm";
import EditPostForm from "./features/posts/EditPostForm";

import UsersList from "./features/users/UsersList";
import Missing from "./components/Missing";

const ROLES = {
  "User": 2001,
  "Admin": 5150
}

function App() {
  return (
    <Routes>
      <Route element={<PersistLogin />}>
      <Route path='/' element={<Layout />}>

        {/* public routes */}
        <Route index element={<PostList />} />
        <Route path="register" element={<Register />} />
        <Route path="login" element={<Login />} />
        <Route path="logout" element={<Logout />} />
        <Route path='unauthorized' element={<Unauthorized />} />

        <Route path='post'>
          
          <Route path=':postId' element={<SinglePostPage />} />

          {/* Protected routes */}
          <Route element={<RequireAuth allowedRoles={[ROLES.User]} />}>
            <Route path='new' element={<AddPostForm />} />
            <Route path='edit/:postId' element={<EditPostForm />} />
          </Route>
          
        </Route>

        <Route element={<RequireAuth allowedRoles={[ROLES.Admin]} />}>
          <Route path="users" element={<UsersList />} />
        </Route>
        
        <Route path="*" element={<Missing />} />

      </Route>
      </Route>
    </Routes>
  );
}

export default App;
