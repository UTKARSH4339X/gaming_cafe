import { HashRouter, Route, Routes } from "react-router-dom";
import { DeskProvider } from "./desk";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Schemes from "./pages/Schemes";
import Register from "./pages/Register";
import Book from "./pages/Book";
import Pass from "./pages/Pass";
import NotFound from "./pages/NotFound";

export default function App() {
  return (
    <DeskProvider>
      <HashRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="schemes" element={<Schemes />} />
            <Route path="register" element={<Register />} />
            <Route path="book" element={<Book />} />
            <Route path="pass" element={<Pass />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </HashRouter>
    </DeskProvider>
  );
}
