import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import Explore from "./pages/Explore";
import Home from "./pages/Home";
import SinglePost from "./pages/SinglePost"
import WritePost from "./pages/WritePost"
import Login from "./pages/Login"
import Register from "./pages/Register"
import NotFound from "./pages/NotFound"
function App() {
  return (

    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="explore" element={<Explore />} />
        <Route path="/posts/:slug" element={<SinglePost />} />
        <Route path="/create" element={<WritePost />} />
      </Route>
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Register />} />
      <Route pahth="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;