import React from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

interface TaskDatePickerProps {
  selectedDate: Date | null;
  onDateChange: (date: Date | null) => void;
}

const TaskDatePicker: React.FC<TaskDatePickerProps> = ({ selectedDate, onDateChange }) => {
  return (
    <div className="date-picker-container">
      <DatePicker
        selected={selectedDate}
        onChange={onDateChange}
        placeholderText="Select due date"
        minDate={new Date()}
        dateFormat="MMMM d, yyyy"
        className="date-picker"
      />
    </div>
  );
};

export default TaskDatePicker;