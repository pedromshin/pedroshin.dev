import { useState } from "react";

const ML = () => {
  const [passagerId, setPassagerId] = useState("");

  const addTodo = () => {
    fetch("/titanic", {
      method: "POST",
      body: JSON.stringify({
        PassengerId: {
          "0": passagerId,
        },
        Pclass: {
          "0": 1.0,
        },
        Sex: {
          "0": 1.0,
        },
        Age: {
          "0": 20.5,
        },
        SibSp: {
          "0": 0.0,
        },
        Parch: {
          "0": 0.0,
        },
        Fare: {
          "0": 7.8292,
        },
        Cabin: {
          "14": 5,
        },
        Embarked: {
          "0": 2.0,
        },
        Ticket: {
          "0": 2,
        },
        Name: {
          "0": 2.0,
        },
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
          name="passangerId"
          placeholder="passangerId"
          value={passagerId}
          onChange={(e) => setPassagerId(e.target.value)}
        />
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default ML;
