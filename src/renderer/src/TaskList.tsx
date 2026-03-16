import React from 'react';
import { format } from 'date-fns'; // External dependency

interface Task {
  id: number;
  text: string;
  completed: boolean;
  createdAt: Date;
}

interface TaskListProps {
  tasks: Task[];
  onToggleTask: (id: number) => void;
  onDeleteTask: (id: number) => void;
}

const TaskList: React.FC<TaskListProps> = ({ tasks, onToggleTask, onDeleteTask }) => {
  if (tasks.length === 0) {
    return <p className="empty">No tasks yet. Add one above!</p>;
  }

  return (
    <ul className="task-list">
      {tasks.map(task => (
        <li key={task.id} className={task.completed ? 'completed' : ''}>
          <input
            type="checkbox"
            checked={task.completed}
            onChange={() => onToggleTask(task.id)}
          />
          <span className="task-text">{task.text}</span>
          <span className="task-date">
            {format(new Date(task.createdAt), 'MMM d, h:mm a')}
          </span>
          <button onClick={() => onDeleteTask(task.id)} className="delete-btn">
            Delete
          </button>
        </li>
      ))}
    </ul>
  );
};

export default TaskList;