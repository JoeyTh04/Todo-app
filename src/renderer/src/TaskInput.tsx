import React, { useState } from 'react';
import TaskDatePicker from './TaskDatePicker';

interface TaskInputProps {
  onAddTask: (text: string, dueDate?: Date) => void;
}

const TaskInput: React.FC<TaskInputProps> = ({ onAddTask }) => {
  const [inputValue, setInputValue] = useState('');
  const [dueDate, setDueDate] = useState<Date | null>(null);

  const handleSubmit = () => {
    if (inputValue.trim() !== '') {
      onAddTask(inputValue, dueDate || undefined);
      setInputValue('');
      setDueDate(null);
    }
  };

  return (
    <div className="input-container">
      <input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        placeholder="Enter a task..."
        onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
      />
      <TaskDatePicker 
        selectedDate={dueDate} 
        onDateChange={setDueDate} 
      />
      <button onClick={handleSubmit}>Add Task</button>
    </div>
  );
};

export default TaskInput;