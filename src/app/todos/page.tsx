"use client";

import axios, { Axios } from "axios";
import React, { useEffect, useState } from "react";

export type Todo = {
  id: string;
  title: string;
  contents: string;
  isDone: boolean;
};

const page = () => {
  const [title, setTitle] = useState("");
  const [contents, setContents] = useState("");
  const [todoList, setTodoList] = useState<Todo[]>([]);

  //데이터 추가 로직
  const addTodo = async () => {
    const newTodo = {
      title: title,
      contents: contents,
      isDone: false,
    };
    alert("추가됨");
    await axios.post("http://localhost:4000/todos", newTodo);
    const newTodoList = await axios.get("http://localhost:4000/todos");
    // axios로 받아오면 오만가지 다 받아와져서 꼭 그 중에서 data 가져온다고 해야함 아님 배열이 아니네 뭐네 오류남
    setTodoList(newTodoList.data);
    // [...todoList,newTodoList.data ]
  };

  // todoList 가져오는 로직
  useEffect(() => {
    const getTodoList = async () => {
      const todoListData = await axios.get("http://localhost:4000/todos");
      // axios로 get해오면 오만가지 다 들어기있음. 그중에서 data만 뽑아와야 함
      const isNotDone = todoListData.data.filter((todo: Todo) => {
        return todo.isDone === false;
      });

      console.log("isNotDone", isNotDone);
      setTodoList(isNotDone);
    };
    // 그리고 useEffect안에서 함수 실행을 시켜줘야함
    getTodoList();
  }, []);

  //   todoList 완료로 변경
  const changeToIsDone = async (todo: Todo) => {
    const newTodo = {
      title: todo.title,
      contents: todo.contents,
      isDone: true,
    };
    await axios.patch(`http://localhost:4000/todos/${todo.id}`, newTodo);
    const newTodoList = await axios.get("http://localhost:4000/todos");
    setTodoList(newTodoList.data);
  };

  // todoList 삭제
  const deleteTodo = async (id: string) => {
    await axios.delete(`http://localhost:4000/todos/${id}`);
    const newTodoList = await axios.get("http://localhost:4000/todos");
    setTodoList(newTodoList.data);
  };

  return (
    <div>
      <div>
        <input
          type="text"
          placeholder="title"
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
          }}
        />
        <input
          type="text"
          placeholder="contents"
          value={contents}
          onChange={(e) => {
            setContents(e.target.value);
          }}
        />
        <button onClick={addTodo}>추가</button>
      </div>
      <h1 className="text-3xl">Todo List</h1>
      {todoList.map((todo) => {
        return (
          <div key={todo.id}>
            <p>{todo.title}</p>
            <p>{todo.contents}</p>
            <p>{todo.isDone}</p>
            <button
              onClick={() => {
                changeToIsDone(todo);
              }}
            >
              완료
            </button>
            <button onClick={() => deleteTodo(todo.id)}>삭제</button>
          </div>
        );
      })}
    </div>
  );
};

export default page;
