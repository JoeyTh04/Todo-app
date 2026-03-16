import { useState } from 'react';
import TaskInput from './TaskInput';
import TaskList from './TaskList';
import TaskStats from './TaskStats';
import './App.css';

interface Task {
  id: number;
  text: string;
  completed: boolean;
  createdAt: Date;
  dueDate?: Date;
}

function App() {
  const [tasks, setTasks] = useState<Task[]>([]);

  const addTask = (text: string, dueDate?: Date) => {
    if (text.trim() !== '') {
      const newTask: Task = {
        id: Date.now(),
        text: text,
        completed: false,
        createdAt: new Date(),
        dueDate: dueDate
      };
      setTasks([...tasks, newTask]);
    }
  };

  const deleteTask = (id: number) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  const toggleTask = (id: number) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  return (
    <div className="app">
      <h1>My To-Do List</h1>
      <TaskInput onAddTask={addTask} />
      <TaskList 
        tasks={tasks} 
        onToggleTask={toggleTask} 
        onDeleteTask={deleteTask} 
      />
      <TaskStats 
        total={tasks.length} 
        completed={tasks.filter(t => t.completed).length} 
      />
    </div>
  );
}

export default App;