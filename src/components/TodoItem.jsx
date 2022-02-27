import React, { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { FaRegTrashAlt } from "react-icons/fa";
import { HiOutlinePencilAlt } from "react-icons/hi";
import { FaEllipsisV } from "react-icons/fa";
import "../styles/Todo.css";
import axios from "axios";
import Empty from "../assets/empty.png";
import Loader from "./Loader";

const TodoItem = () => {
  const [status, setStatus] = useState("PENDING");
  const navigate = useNavigate();
  const [todo, setTodo] = useState({ title: "" });
  const [todoList, setTodoList] = useState([]);
  const [todoListCopy, setTodoListCopy] = useState([])
  const [isLoading, setIsLoading] = useState(false);
  const [dropdown, setDropdown] = useState(false);
  const { id } = useParams();

  useEffect(() => {
    const fetchTodoList = async () => {
      setIsLoading(true);
      const res = await axios.get(
        `https://printful-api.herokuapp.com/todos/${id}`
      );
      setTodo(res.data);
      setTodoList(res.data.todolist);
      setTodoListCopy(res.data.todolist)
      setIsLoading(false);
      console.log(res.data);
    };

    fetchTodoList();
  }, [id]);

  const renderDropdown = () => {
    if (dropdown === false) {
      setDropdown(true);
    } else {
      setDropdown(false);
    }
  };

  const showAllTodoItem = () => {
    setTodoList([...todoListCopy]);
    setDropdown(false);
  };

  const showCompletedTodoItem = () => {
    setTodoList([...todoListCopy.filter((element) => element.status !== "PENDING")]);
    setDropdown(false);
  };

  const showPendingTodoItem = () => {
    setTodoList([...todoListCopy.filter((element) => element.status !== "COMPLETED")]);
    setDropdown(false);
  };

  const handleChange = async (e, status) => {
    console.log(e.target.value);
    if (status === "PENDING") {
      setStatus("COMPLETED");
    } else {
      setStatus("PENDING");
    }
  };

  const handleClicked = async (e, todoListId) => {
    // console.log(status);
    const res = await axios.patch(
      `https://printful-api.herokuapp.com/todos/${id}/todolists/${todoListId}`,
      {
        status: status
      }
    );

    console.log(res.data);
  };

  const deleteTodo = async (_, todoId) => {
    const res = await axios.delete(
      `https://printful-api.herokuapp.com/todos/${todoId}`
    );
    console.log(res.data);
    navigate("/");
    return res.data;
  };


  return isLoading ? (
    <div className="h-screen w-full flex items-center justify-center absolute top-0 left-0">
      <Loader />
    </div>
  ) : (
    <section className="w-full p-6">
      <section className="w-full list__header flex justify-center items-center relative">
        <div className="mr-auto flex flex-col items-start">
          <Link to={`/`}>
            <p className="text-base font-semibold hover:text-blue-400 underline">
              TodoLists
            </p>
          </Link>
          <span className="text-xs text-left text-gray-400">{`/ ${
            todo.title.length > 22
              ? todo.title.split("").slice(0, 22).join("").concat("...")
              : todo.title
          }`}</span>
        </div>
        <div
          className={`${
            todoList.length < 1 ? "hidden" : "icon__container flex items-center"
          }`}
        >
          <Link to={`/todo/edit/${todo.id}`}>
            <div className="flex items-center py-2 sm:px-3 rounded-md sm:border">
              <HiOutlinePencilAlt className="text-xl" />
              <span className="ml-2 hidden sm:block">Edit</span>
            </div>
          </Link>

          <div
            onClick={(e) => deleteTodo(e, todo.id)}
            className="flex items-center ml-4 py-2 sm:px-3 rounded-md sm:border cursor-pointer"
            title="Delete Entire Todo"
          >
            <FaRegTrashAlt className="ml-1" />
            <span className="ml-2 hidden sm:block">Delete</span>
          </div>

          <div
            onClick={renderDropdown}
            className="flex items-center ml-4 py-2 sm:px-3 rounded-md sm:border cursor-pointer"
          >
            <FaEllipsisV className="ml-1" />
          </div>
        </div>
        <div
          className={`${
            !dropdown ? "hidden" : "block"
          } border rounded-md p-4 text-sm font-semibold hover:underline absolute bg-white shadow-lg top-10 right-0`}
        >
          <ul>
            <li onClick={showCompletedTodoItem} className="pb-2">
              COMPLETED
            </li>
            <li onClick={showPendingTodoItem} className="pb-2">
              PENDING
            </li>
            <li onClick={showAllTodoItem}>ALL</li>
          </ul>
        </div>
      </section>
      {/* End of Todo List Header */}

      <section className="todolist__container overflow-hidden border rounded-lg mt-4">
        <ul>
          {todoList.length <= 0 ? (
            <div className="p-8 flex flex-col">
              <div className="mb-8">
                <img
                  src={Empty}
                  alt="Empty-Icon"
                  width="150"
                  className="ml-12"
                />
              </div>

              <Link to={`/todo/edit/${id}`}>
                <div className="flex justify-center w-full">
                  <button
                    type="submit"
                    className="text-base text-white font-semibold mb-12 p-2 border rounded-md submit__button"
                  >
                    Add New Item
                  </button>
                </div>
              </Link>

              <h3 className="text-sm font-semibold">
                Oops! Seems there is nothing here.
                <Link to={`/`} className="ml-1 underline text-blue-500">
                  Go Back
                </Link>
              </h3>
            </div>
          ) : (
            todoList.map((todo) => (
              <li key={todo.id} className="todos flex items-start p-4">
                <div className="flex pt-1 cursor-pointer">
                  <input
                    type="checkbox"
                    name="done"
                    id="done"
                    className="cursor-pointer"
                    checked={todo.status === "COMPLETED"}
                    onChange={(e) => handleChange(e, todo.status)}
                    onClick={(e) => handleClicked(e, todo.id)}
                  />
                </div>
                <div className="flex flex-col w-full items-start ml-4">
                  <h5 className="text-sm text-left mb-2 font-medium ">
                    {todo.title}
                  </h5>
                  <button className="text-xs font-medium p-1 border rounded-md done__button">
                    {todo.status}
                  </button>
                </div>
              </li>
            ))
          )}
        </ul>
      </section>
    </section>
  );
};

export default TodoItem;
