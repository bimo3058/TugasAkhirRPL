import React from "react";
const Input = (props) => {
    const { type = "text" , placeholder } = props
  return (
    <input
      type={type}
      className="text-sm border rounded w-full py-2 px-3 text-slate-700 placedholder:opacity-50"
      placeholder={placeholder}
    />
  );
};

export default Input