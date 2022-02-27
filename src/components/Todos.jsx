import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { MdLibraryAdd } from "react-icons/md";
import { FaArrowUp, FaArrowDown } from "react-icons/fa";
import "../styles/Todo.css";
import CoolGuy from "../assets/cool_guyy.svg";
import Dancer from "../assets/dancing_woman.svg";
import SportMedal from "../assets/sports_medal.svg";
import VictoryHand from "../assets/victory_hand.svg";
import WritingHand from "../assets/writing_hand.svg";
import axios from "axios";
import dayjs from "dayjs";
import Localized from "dayjs/plugin/localizedFormat";
import Loader from "./Loader";

const Todos = () => {
  dayjs.extend(Localized);

  const [todos, setTodos] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [ascending, setAscending] = useState(true);

  useEffect(() => {
    const fetchTodos = async () => {
      setIsLoading(true);
      const res = await axios.get("https://printful-api.herokuapp.com/todos");
      console.log(res.data);
      setTodos(res.data);
      setIsLoading(false);
    };

    fetchTodos();
  }, []);


  const sortTodos = () => {
    if (ascending) {
      setTodos((todos) => [
        ...todos.sort(
          (todo1, todo2) =>
            new Date(todo2.createdAt) - new Date(todo1.createdAt)
        ),
      ]);
      setAscending(false);
    } else {
      setTodos((todos) => [
        ...todos.sort(
          (todo1, todo2) =>
            new Date(todo1.createdAt) - new Date(todo2.createdAt)
        ),
      ]);
      setAscending(true);
    }
  };

  const showPercentage = (todo) => {
    const itemsLength = todo.todolist.length
    if (itemsLength <= 0) {
      return `0%`
    }
    const completedArrayLength = todo.todolist.filter(element => element.status !== "PENDING").length
    const completionPercentage = Math.floor((completedArrayLength / itemsLength) * 100)
    return `${completionPercentage}%`
  }
  console.log(todos);

  const showIcon = (iconId) => {
    if (iconId === 1) {
      return CoolGuy;
    } else if (iconId === 2) {
      return Dancer;
    } else if (iconId === 3) {
      return SportMedal;
    } else if (iconId === 4) {
      return VictoryHand;
    } else {
      return WritingHand;
    }
  };

  return isLoading ? (
    <div className="h-screen w-full flex items-center justify-center absolute top-0 left-0">
      <Loader />
    </div>
  ) : (
    <section className="w-full p-6">
      <section className="w-full list__header flex justify-center items-center">
        <div className="mr-auto">
          <h1 className="text-base font-semibold">Todo Lists</h1>
        </div>
        <div className="icon__container flex items-center">
          <span onClick={sortTodos} className="flex">
            <FaArrowUp
              width={30}
              height={30}
              className={`${ascending ? "block" : "hidden"} text-sm font-light`}
            />
            <FaArrowDown
              width={30}
              height={30}
              className={`${ascending ? "hidden" : "block"} text-sm font-light`}
            />
          </span>
          <Link to={`/create`}>
            <MdLibraryAdd className="ml-2 text-lg font-light" />
          </Link>
        </div>
      </section>
      {/* End of Todo List Header */}

      <section className="todolist__container border rounded-lg mt-4">
        <ul>
          {todos.map((todo) => (
            <Link to={`/todo/${todo.id}`} key={todo.id}>
              <li key={todo.id} className="todos flex items-start p-4">
                <div className="flex pt-1">
                  <img
                    src={showIcon(todo.iconId)}
                    className="icon"
                    alt="todoIcon"
                  />
                </div>
                <div className="flex flex-col w-full items-start ml-4">
                  <div className="flex flex-col items-start mb-4">
                    <h5 className="text-sm text-left mb-1 text-gray-600  font-semibold hover:underline">
                      {todo.title}
                    </h5>
                    <p className="text-xs text-left text-gray-400 font-medium">
                      {dayjs(todo.createdAt).format("llll")}
                    </p>
                  </div>

                  <button className="text-xs font-medium ml-auto p-1 border rounded-md done__button">
                    {showPercentage(todo)} Done
                  </button>
                </div>
              </li>
            </Link>
          ))}
        </ul>
      </section>
    </section>
  );
};

export default Todos;
