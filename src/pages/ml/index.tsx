import { useState } from "react";

const ML = () => {
  const [description, setDescription] = useState("");
  const addTodo = () => {
    fetch("/model1", {
      method: "POST",
      body: JSON.stringify({
        description,
      }),
      headers: {
        "content-type": "application/json",
      },
    }).catch((e) => console.log(e));
  };

  return (
    <div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          addTodo();
        }}
      >
        <input
          name="description"
          placeholder="Add new todo..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        ></input>
        <button type="submit">Add todo</button>
      </form>
    </div>
  );
};

export default ML;
