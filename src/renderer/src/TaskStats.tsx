import React from 'react';

interface TaskStatsProps {
  total: number;
  completed: number;
}

const TaskStats: React.FC<TaskStatsProps> = ({ total, completed }) => {
  return (
    <div className="stats">
      <p>Total: {total}</p>
      <p>Completed: {completed}</p>
      <p>Pending: {total - completed}</p>
    </div>
  );
};

export default TaskStats;