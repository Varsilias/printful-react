import "./App.css";
import { Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Todos from "./components/Todos";
import CreateTodo from "./components/CreateTodo";
import TodoItem from "./components/TodoItem";
import EditTodo from "./components/EditTodo";
import PrintfulToaster from "./components/PrintfulToaster";

function App() {
  return (
    <div className="App relative w-full">
        <Header />
        <PrintfulToaster />
        <Routes>
          <Route path="/" element={<Todos />} />
          <Route path="/create" element={<CreateTodo />} />
          <Route path="/todo/:id" element={<TodoItem />} />
          <Route path="/todo/edit/:id" element={<EditTodo />} />
        </Routes>
    </div>
  );
}

export default App;
