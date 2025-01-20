import { BrowserRouter, Route, Routes } from "react-router-dom";
import Chat from "./pages/Chat";
import Home from "./pages/Home";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path={`/chat/:chatId`} element={<Chat />} />
        <Route path="*" element={<h1>Not Found</h1>} />
      </Routes>
    </BrowserRouter>
  );
}
