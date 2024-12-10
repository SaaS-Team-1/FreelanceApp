import React from "react";
import { Timestamp } from "firebase/firestore";
import { FaCalendarAlt, FaClock } from "react-icons/fa";

interface DatePickerProps {
  dueDate: Timestamp;
  onDateChange: (date: Timestamp) => void;
}

const DatePicker: React.FC<DatePickerProps> = ({ dueDate, onDateChange }) => {
  const selectedDate = new Date(dueDate.seconds * 1000);

  return (
    <div className="flex flex-col gap-4 md:flex-row">
      {/* Date Input */}
      <div className="relative w-full md:w-1/2">
        <label className="block text-sm font-medium text-gray-700">
          Due Date
        </label>
        <div className="relative">
          <input
            type="date"
            value={selectedDate.toISOString().split("T")[0]}
            onChange={(e) => {
              const newDate = new Date(e.target.value);
              newDate.setHours(
                selectedDate.getHours(),
                selectedDate.getMinutes(),
              );
              onDateChange(new Timestamp(newDate.getTime() / 1000, 0));
            }}
            className="mt-1 w-full rounded-lg border-gray-300 bg-gray-100 p-3 pr-10 text-gray-800 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500"
          />
          <FaCalendarAlt className="absolute right-4 top-3 text-gray-400" />
        </div>
      </div>

      {/* Time Input */}
      <div className="relative w-full md:w-1/2">
        <label className="block text-sm font-medium text-gray-700">
          Due Time
        </label>
        <div className="relative">
          <input
            type="time"
            value={selectedDate.toTimeString().slice(0, 5)}
            onChange={(e) => {
              const [hours, minutes] = e.target.value.split(":").map(Number);
              const newDate = new Date(selectedDate);
              newDate.setHours(hours, minutes);
              onDateChange(new Timestamp(newDate.getTime() / 1000, 0));
            }}
            className="mt-1 w-full rounded-lg border-gray-300 bg-gray-100 p-3 pr-10 text-gray-800 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500"
          />
          <FaClock className="absolute right-4 top-3 text-gray-400" />
        </div>
      </div>
    </div>
  );
};

export default DatePicker;
