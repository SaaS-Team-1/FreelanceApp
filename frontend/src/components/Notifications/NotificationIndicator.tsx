import React, { useState } from 'react';

const NotificationIndicator = ({ shape = 'circle', count = 0 }) => {
    {/* const [count, setCount] = useState(2); // Set an initial number here */}
  
    // Function to handle count changes
    {/* const handleCountChange = (event) => {
      const newCount = parseInt(event.target.value, 10);
      if (!isNaN(newCount)) {
        setCount(newCount);
      }
    }; */}
  
    return (
      <div className="flex items-center justify-center space-x-4">
        {/* Notification Shape */}
        <div
          className={`flex items-center justify-center bg-orange-500 w-8 h-8 ${
            shape === 'circle' ? 'rounded-full' : 'rounded'
          }`}
        >
          <span className="text-black font-bold">{count}</span>
        </div>
  
        {/* Input to change the number */}
        {/* <input
          type="number"
          value={count}
          onChange={handleCountChange}
          className="border p-1 rounded text-center w-12"
          placeholder="Enter number"
        /> */}
      </div> 
    );
  };
  
  export default NotificationIndicator;
