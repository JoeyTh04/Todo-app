import React from 'react';
import { format } from 'date-fns';

interface Task {
  id: number;
  text: string;
  completed: boolean;
  createdAt: Date;
  dueDate?: Date;
}

interface TaskListProps {
  tasks: Task[];
  onToggleTask: (id: number) => void;
  onDeleteTask: (id: number) => void;
}

const TaskList: React.FC<TaskListProps> = ({ tasks, onToggleTask, onDeleteTask }) => {
  const isOverdue = (dueDate?: Date) => {
    if (!dueDate) return false;
    return new Date(dueDate) < new Date() && !tasks.find(t => t.id === tasks.find(t2 => t2.id === t.id)?.completed);
  };

  if (tasks.length === 0) {
    return <p className="empty">No tasks yet. Add one above!</p>;
  }

  return (
    <ul className="task-list">
      {tasks.map(task => (
        <li 
          key={task.id} 
          className={`
            ${task.completed ? 'completed' : ''} 
            ${isOverdue(task.dueDate) ? 'overdue' : ''}
          `}
        >
          <input
            type="checkbox"
            checked={task.completed}
            onChange={() => onToggleTask(task.id)}
          />
          <span className="task-text">{task.text}</span>
          <div className="task-dates">
            <span className="created-date">
              Created: {format(new Date(task.createdAt), 'MMM d')}
            </span>
            {task.dueDate && (
              <span className={`due-date ${isOverdue(task.dueDate) ? 'overdue-text' : ''}`}>
                Due: {format(new Date(task.dueDate), 'MMM d, yyyy')}
              </span>
            )}
          </div>
          <button onClick={() => onDeleteTask(task.id)} className="delete-btn">
            Delete
          </button>
        </li>
      ))}
    </ul>
  );
};

export default TaskList;