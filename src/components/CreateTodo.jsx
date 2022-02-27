import React, { useState } from "react";
import "../styles/CreateTodo.css";
import { IoArrowBackOutline } from "react-icons/io5";
import { Link } from "react-router-dom";
import axios from "axios";

const CreateTodo = () => {
  const [todo, setTodo] = useState("");
  const [error, setError] = useState("");

  const generateIconId = () => {
    const no = Math.floor(Math.random() * 5) + 1;
    return no;
  };

  const validateInput = (e) => {
    // console.log(e);
    const length = e.target.value.length;
    const keyCode = e.keyCode;

    if (length > 50 && keyCode !== 8) {
      e.preventDefault();
      setError("Title Should not be more than 50 characters");
    } else {
      setError("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await axios.post("https://printful-api.herokuapp.com/todos", {
      title: todo,
      iconId: generateIconId()
    });

    setTodo("");
    console.log(await res.data);
  };

  return (
    <section className="w-full p-6">
      <section className="w-full flex justify-center items-center">
        <div className="mr-auto">
          <h1 className="text-base font-semibold">Create Todo</h1>
        </div>
        <Link to={`/`}>
          <div className="icon__container flex items-center">
            <IoArrowBackOutline className="mr-1 text-gray-500" />
            <span className="text-sm text-gray-500 font-semibold hover:underline">
              Back
            </span>
          </div>
        </Link>
      </section>
      {/* End of Create Todo List Header */}

      <section className="todolist__container border rounded-lg mt-4">
        <div className="flex items-start p-4">
          <div className="flex flex-col w-full">
            {error && (
              <div
                className={`${
                  error ? "block" : "hidden"
                } text-sm font-normal text-gray-200 bg-red-400 border my-3 border-red-500 p-2 rounded-md`}
              >
                {error}
              </div>
            )}
            <form className="flex flex-col w-full" onSubmit={handleSubmit}>
              <input
                type="text"
                name="create__todo"
                id="create_todo"
                placeholder="title"
                className="border-2 rounded-md mb-4 p-2"
                value={todo}
                onChange={(e) => setTodo(e.target.value)}
                onKeyDown={validateInput}
              />
              <button
                type="submit"
                className="text-base text-white font-semibold p-2 border rounded-md submit__button"
              >
                Create
              </button>
            </form>
          </div>
        </div>
      </section>
    </section>
  );
};

export default CreateTodo;
