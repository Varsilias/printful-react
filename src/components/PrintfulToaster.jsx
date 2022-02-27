import React from "react";
import PropTypes from "prop-types";

const PrintfulToaster = ({
  message = "",
  type = "success",
  isActive = true,
}) => {
  return (
    <section
      className={`${isActive ? "toaster_up" : "toaster_down"} fixed h-10`}
    >
      <div className="w-full ">
        <h3
          className={`${
            type === "error"
              ? "bg-red-100 text-red-800"
              : "bg-green-100 text-teal-800"
          } bg-blue-500`}
        >
          {message}
        </h3>
      </div>
    </section>
  );
};

PrintfulToaster.propType = {
  message: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  isActive: PropTypes.bool.isRequired,
};

export default PrintfulToaster;
