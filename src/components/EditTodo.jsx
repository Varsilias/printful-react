import React, { useState, useEffect } from "react";
import "../styles/EditTodo.css";
import { Link, useParams, useNavigate } from "react-router-dom";
import { IoArrowBackOutline } from "react-icons/io5";
import Loader from "./Loader";
import axios from "axios";
import PrintfulButton from "./PrintfulButton";

const EditTodo = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [todoList, setTodoList] = useState([]);
  const [error, setError] = useState("");
  const [titleError, setTitleError] = useState("");

  let set = new Set();

  const [isLoading, setIsLoading] = useState(false);
  const [titleAndId, setTitleAndId] = useState({ title: "", id: "" });
  const [selectIdList, setSelectIdList] = useState(set);
  const [count, setCount] = useState(0);
  const [initialTodoListLength, setInitialTodoListLength] = useState(0);

  useEffect(() => {
    const fetchTodoList = async () => {
      setIsLoading(true);
      const res = await axios.get(
        `https://printful-api.herokuapp.com/todos/${id}`
      );
      setTitleAndId({ title: res.data.title, id: res.data.id });
      setTodoList(res.data.todolist);
      setInitialTodoListLength(res.data.todolist.length);
      setIsLoading(false);
      console.log(res.data);
    };

    fetchTodoList();
  }, [id]);

  function setValue(id, val) {
    // console.log(id)
    setTodoList((todoList) =>
      todoList.map((todoItem) => {
        if (todoItem.id === id) {
          return { ...todoItem, title: val };
        } else {
          return todoItem;
        }
      })
    );
  }

  const toggleDelete = (e, id) => {
    // console.log(selectIdList);
    if (selectIdList.has(id)) {
      // console.log("if-before-found", id, selectIdList);
      setSelectIdList((selectIdList) => {
        selectIdList.delete(id);
        // console.log("if-after-found", id, selectIdList);

        return selectIdList;
      });
    } else {
      setSelectIdList((selectIdList) => {
        selectIdList.add(id);
        return selectIdList;
      });
    }
  };

  for (const item of selectIdList) {
    console.log(item);
  }

  const AddNewTodoListObject = () => {
    setCount(count + 1);
    const newtodoItem = {
      createdAt: new Date().toISOString(),
      id: Math.floor(Math.random() * 100000) + 1,
      status: "PENDING",
      title: "",
      todoId: parseInt(id),
      new: true
    };

    setTodoList((todoList) => [...todoList, newtodoItem]);
  };

  const handleSubmit = async () => {
    try {
      const newTodos = todoList.splice(initialTodoListLength, count);
      return Promise.all([
        await updateTodoTitle(titleAndId),
        await updateCurrentTodoList(todoList),
        await creatNewTodoList(newTodos),
        await deleteTodoList(selectIdList)
      ]).then((data) => {
        console.log(data, "real response!!!!");
        if (data) {
          setTimeout(() => {
            navigate(`/todo/${id}`);
          }, 2000);
        }
        // return data;
      });
    } catch (error) {
      throw new Error("Something went wrong");
    }
  };

  const validateInput = (e) => {
    // console.log(e);
    const length = e.target.value.length;
    const keyCode = e.keyCode;

    if (length >= 50 && keyCode !== 8) {
      e.preventDefault();
      setError("Todo Item Should not be more than 50 characters");
    } else {
      setError("");
    }

    console.log(error);
  };

  const validateTitle = (e) => {
    const length = e.target.value.length;
    const keyCode = e.keyCode;

    if (length > 50 && keyCode !== 8) {
      e.preventDefault();
      setTitleError("Title Should not be more than 50 characters");
    } else {
      setTitleError("");
    }

    console.log(error);
  };

  const updateTodoTitle = async (titleAndId) => {
    const { title, id } = titleAndId;
    console.log(titleAndId);
    const res = await axios.patch(
      `https://printful-api.herokuapp.com/todos/${id}`,
      {
        title: title
      }
    );

    return await res.data;
  };

  const updateCurrentTodoList = async (currentTodoListArray) => {
    const responseArray = currentTodoListArray.map(
      async ({ todoId, id, title }) => {
        const res = await axios.patch(
          `https://printful-api.herokuapp.com/todos/${todoId}/todolists/${id}/title`,
          {
            title
          }
        );
        return await res.data;
      }
    );

    return responseArray;
  };

  const creatNewTodoList = async (newTodoListArray) => {
    const responseArray = newTodoListArray.map(async ({ title, todoId }) => {
      const res = await axios.post(
        `https://printful-api.herokuapp.com/todos/${todoId}/todolists`,
        {
          title
        }
      );
      return await res.data;
    });

    return responseArray;
  };

  const deleteTodoList = async (deletedTodoItem) => {
    for (const deletedTodoListId of deletedTodoItem) {
      await axios.delete(
        `https://printful-api.herokuapp.com/todos/${id}/todolists/${deletedTodoListId}`
      );
    }

    return "deleted sucessfully";
  };
  // console.log(count, initialTodoListLength);

  return isLoading ? (
    <div className="h-screen w-full flex items-center justify-center absolute top-0 left-0">
      <Loader />
    </div>
  ) : (
    <section className="w-full p-6">
      <section className="w-full list__header flex justify-center items-center">
        <div className="flex flex-col items-start text-left w-full">
          <div className="flex w-full mb-2">
            <p className="text-base font-semibold hover:text-blue-400 whitespace-nowrap mr-auto">
              Edit Todo:
            </p>
            <Link to={`/todo/${titleAndId.id}`}>
              <div className="icon__container flex items-center">
                <IoArrowBackOutline className="mr-1 text-gray-500" />
                <span className="text-sm text-gray-500 font-semibold hover:underline">
                  Back
                </span>
              </div>
            </Link>
          </div>
          <p className="w-full text-sm p-3 border rounded-lg bg-gray-50">
            {titleAndId.title}
          </p>
        </div>
      </section>

      <div className="w-full mt-5 divider"></div>

      {/* End of Todo List Header */}

      <section className="todolist__container border rounded-lg mt-4">
        <div className="flex items-start p-4">
          <div className="flex flex-col w-full">
            <div className="flex flex-col items-start w-full mb-8">
              <label
                htmlFor="create_todo"
                className="text-sm text-gray-600 mb-2 font-semibold"
              >
                Todo Title
              </label>
              <input
                type="text"
                name="create__todo"
                id="create_todo"
                placeholder="title"
                className="border-2 text-sm rounded-md mb-4 p-2 w-full"
                onChange={(e) => {
                  setTitleAndId((setTitleAndId) => ({
                    ...setTitleAndId,
                    title: e.target.value
                  }));
                }}
                value={titleAndId.title}
                onKeyDown={validateTitle}
              />

              {titleError && (
                <div
                  className={`${
                    titleError ? "block" : "hidden"
                  } text-sm font-normal text-gray-200 bg-red-400 border my-3 border-red-500 p-2 rounded-md`}
                >
                  {titleError}
                </div>
              )}
            </div>

            <div className="flex items-center w-full mb-4">
              <span className="mr-2 text-sm text-gray-600 font-semibold whitespace-nowrap">
                Todo Items
              </span>
              <div className="w-full divider"></div>
            </div>

            {error && (
              <div
                className={`${
                  error ? "block" : "hidden"
                } text-sm font-normal text-gray-200 bg-red-400 border my-3 border-red-500 p-2 rounded-md`}
              >
                {error}
              </div>
            )}

            {todoList.map((todos) => (
              <div
                className="flex flex-col items-start w-full mb-8"
                key={todos.id}
              >
                <input
                  type="text"
                  name="create__todo"
                  id="create_todo"
                  placeholder="title"
                  className="border-2  font-medium text-sm rounded-md mb-4 p-2 w-full"
                  onChange={(e) => {
                    setValue(todos.id, e.target.value);
                  }}
                  value={todos.title}
                  onKeyDown={validateInput}
                />
                <PrintfulButton
                  toggleDelete={toggleDelete}
                  currentTodo={todos}
                />
              </div>
            ))}

            <button
              onClick={AddNewTodoListObject}
              className="text-base mb-2 text-white font-semibold p-2 border rounded-md printful__add__button__secondary"
            >
              Add New Item
            </button>
          </div>
        </div>
      </section>

      <button
        onClick={handleSubmit}
        className="w-full mt-16 text-base text-white font-semibold p-2 border rounded-md submit__button"
      >
        Save Changes
      </button>
    </section>
  );
};

export default EditTodo;
