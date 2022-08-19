import React, { useState, useRef, Fragment } from 'react';
import './App.css';

interface todoTypes {
    id: number;
    title: string;
}

const App: React.FC = () => {
    const todoTitleRef = useRef<HTMLInputElement>(null);
    const [todos, setTodos] = useState<todoTypes[]>([]);

    const todoSubmitHandler = (e: React.FormEvent) => {
        e.preventDefault();

        const todoTitle = todoTitleRef.current!.value;
        if (todoTitle.length > 0) {
            const todo = {
                id: Math.random(),
                title: todoTitle,
            };
            setTodos(prevTodos => [...prevTodos, todo]);
        }
    };

    const todoDeleteHandler = (todoId: number) => {
        setTodos(prevTodos => prevTodos.filter(todo => todo.id !== todoId));
    };

    return (
        <Fragment>
            <form onSubmit={todoSubmitHandler}>
                <div>
                    <label htmlFor='todo-title'>Todo Title</label>
                    <input type='text' id='todo-title' ref={todoTitleRef} />
                    <button type='submit'>ADD TODO</button>
                </div>
            </form>
            <ul>
                {todos.map(todo => (
                    <li key={todo.id}>
                        <h2>{todo.title}</h2>
                        <button
                            onClick={() => {
                                todoDeleteHandler(todo.id);
                            }}
                        >
                            DELETE
                        </button>
                    </li>
                ))}
            </ul>
        </Fragment>
    );
};

export default App;
