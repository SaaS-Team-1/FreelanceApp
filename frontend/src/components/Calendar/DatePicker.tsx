import React from "react";
import { Timestamp } from "firebase/firestore";

interface DatePickerProps {
  dueDate: Timestamp;
  onDateChange: (date: Timestamp) => void;
}

const DatePicker: React.FC<DatePickerProps> = ({ dueDate, onDateChange }) => {
  const selectedDate = new Date(dueDate.seconds * 1000);

  return (
    <div className="flex gap-4">
      {/* Date Input */}
      <div className="relative w-1/2">
        <label className="mb-2 block text-sm font-bold">Due Date</label>
        <input
          type="date"
          value={selectedDate.toISOString().split("T")[0]}
          onChange={(e) => {
            const newDate = new Date(e.target.value);
            newDate.setHours(selectedDate.getHours(), selectedDate.getMinutes());
            onDateChange(new Timestamp(newDate.getTime() / 1000, 0));
          }}
          className="w-full rounded border-gray-700 bg-gray-800 p-2 text-white"
        />
      </div>
      {/* Time Input */}
      <div className="relative w-1/2">
        <label className="mb-2 block text-sm font-bold">Due Time</label>
        <input
          type="time"
          value={selectedDate.toTimeString().slice(0, 5)}
          onChange={(e) => {
            const [hours, minutes] = e.target.value.split(":").map(Number);
            const newDate = new Date(selectedDate);
            newDate.setHours(hours, minutes);
            onDateChange(new Timestamp(newDate.getTime() / 1000, 0));
          }}
          className="w-full rounded border-gray-600 bg-gray-800 p-2 text-white"
        />
      </div>
      {/* Custom Styles */}
      <style>
        {`
          input[type="date"]::-webkit-calendar-picker-indicator,
          input[type="time"]::-webkit-calendar-picker-indicator {
            background-color: #2d2d2; /* Gray background */
            color: #2d2d2d; /* Adjusted gray for numbers */
            border-radius: 50%;
            cursor: pointer;
          }

          input[type="date"],
          input[type="time"] {
            color-scheme: dark; /* Ensures dropdown matches dark theme */
          }
        `}
      </style>
    </div>
  );
};

export default DatePicker;
