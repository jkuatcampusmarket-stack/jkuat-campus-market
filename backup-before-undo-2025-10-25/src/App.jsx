
import { Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home";
import PostItem from "./pages/PostItem";
import Categories from "./pages/Categories";
import Login from "./pages/Login";
import AddPost from "./pages/AddPost";

function App() {
  return (
    <div style={{ padding: 20 }}>
      <nav style={{ marginBottom: 20 }}>
        <Link to="/">Home</Link> | <Link to="/categories">Categories</Link> |{" "}
        <Link to="/login">Login</Link>
        <Link to="/add">Add Post</Link> |

      </nav>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/categories" element={<Categories />} />
        <Route path="/login" element={<Login />} />
        <Route path="/post/:id" element={<PostItem />} />
        <Route path="/add" element={<AddPost />} />
      </Routes>
    </div>
  );
}

export default App;
