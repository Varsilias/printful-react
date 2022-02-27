import React, { useState } from "react";

const PrintfulButton = ({ toggleDelete, currentTodo }) => {
  const [deleted, setDeleted] = useState(false)
  return (
    <div>
      <button
        onClick={(e) => {
          setDeleted(!deleted)
          toggleDelete(e, currentTodo.id);
        }}
        className={`${
          deleted ? "bg-green-100 text-teal-800" : "bg-red-100 text-red-800"
        } text-base font-semibold p-2 border rounded-md`}
      >
        {`${deleted ? "Undo" : "Delete"}`}
      </button>
    </div>
  );
};

export default PrintfulButton;
