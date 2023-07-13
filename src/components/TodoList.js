import React, { useState } from "react";
import TodoForm from "./TodoForm";
import Todo from "./Todo";
import { useEffect } from "react";

function TodoList() {
  const [todos, setTodos] = useState([]);
  const get = async () => {
    const response = await fetch("http://localhost:4000/api");
    const responseJson = await response.json();
    console.log(responseJson);
    setTodos(responseJson.data);
  };
  useEffect(() => {
    get();
  }, []);
  useEffect(() => {
    console.log(todos);
  }, [todos]);

  const addTodo = async (todo) => {
    if (!todo.title || /^\s*$/.test(todo.title)) {
      return;
    }
    const resul = await fetch("http://localhost:4000/api", {
      method: "POST",
      body: JSON.stringify({
        title: todo.title,
        description: todo.description,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    const resulJson = await resul.json();
    console.log(resulJson);

    const newtoDo = {
      id: resulJson.toDos.id,
      description: resulJson.toDos.description,
      title: resulJson.toDos.title,
      isDone: false,
      showDescription: false,
      create_at: resulJson.toDos.create_at,
    };

    const newTodos = [...todos, newtoDo];

    setTodos(newTodos);
    //console.log(...todos);
  };

  const showDescription = (todoId) => {
    let updatedTodos = todos.map((todo) => {
      if (todo.id === todoId) {
        todo.showDescription = !todo.showDescription;
      }
      return todo;
    });
    setTodos(updatedTodos);
  };

  const updateTodo = async (todoId, newValue) => {
    if (!newValue.title || /^\s*$/.test(newValue.title)) {
      return;
    }
    const resul = await fetch(`http://localhost:4000/api/${todoId}`, {
      method: "PATCH",
      body: JSON.stringify({
        title: newValue.title,
        description: newValue.description,
        isDone: newValue.isDone,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    const resulJson = await resul.json();
    console.log(resulJson);
    const newData = resulJson.toDos;

    setTodos((prev) =>
      prev.map((item) => (item.id === todoId ? newData : item))
    );
  };

  const removeTodo = async (id) => {
    const resul = await fetch(`http://localhost:4000/api/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const resulJson = await resul.json();
    console.log(resulJson);
    const removedArr = [...todos].filter((todo) => todo.id !== id);

    setTodos(removedArr);
  };
  const update_isDone = async (id, isDone) => {
    const resul = await fetch(`http://localhost:4000/api/${id}`, {
      method: "PATCH",
      body: JSON.stringify({
        isDone: isDone,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });
  };
  const completeTodo = (id) => {
    let updatedTodos = todos.map((todo) => {
      if (todo.id === id) {
        todo.isDone = !todo.isDone;
        update_isDone(id, todo.isDone);
      }
      return todo;
    });
    setTodos(updatedTodos);
  };

  return (
    <>
      <h1>What's the Plan for Today?</h1>
      <TodoForm onSubmit={addTodo} />
      <Todo
        todos={todos}
        completeTodo={completeTodo}
        removeTodo={removeTodo}
        updateTodo={updateTodo}
        showDescription={showDescription}
      />
    </>
  );
}

export default TodoList;
