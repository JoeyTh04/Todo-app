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
}

function App() {
  const [tasks, setTasks] = useState<Task[]>([]);

  // Add task function
  const addTask = (text: string) => {
    if (text.trim() !== '') {
      const newTask: Task = {
        id: Date.now(),
        text: text,
        completed: false,
        createdAt: new Date()
      };
      setTasks([...tasks, newTask]);
    }
  };

  // Delete task function
  const deleteTask = (id: number) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  // Toggle completed function
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