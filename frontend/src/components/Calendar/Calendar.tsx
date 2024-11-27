import React, { useState, useEffect } from "react";
import { Gig } from "@/utils/database/schema";

interface CalendarProps {
  scheduledGigs: Gig[];
  pendingGigs: Gig[];
}

const Calendar: React.FC<CalendarProps> = ({ scheduledGigs, pendingGigs }) => {
  const getFirstScheduledDate = () => {
    if (scheduledGigs.length > 0) {
      return new Date(
        Math.min(...scheduledGigs.map((gig) => gig.dueDate.seconds * 1000)),
      );
    }
    return new Date();
  };

  const [currentDate, setCurrentDate] = useState(getFirstScheduledDate());

  useEffect(() => {
    setCurrentDate(getFirstScheduledDate());
  }, [scheduledGigs]);

  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();

  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();

  const handlePrevMonth = () => {
    setCurrentDate(
      (prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1),
    );
  };

  const handleNextMonth = () => {
    setCurrentDate(
      (prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1),
    );
  };

  const isSameDay = (date1: Date, date2: Date) =>
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate();

  const getGigDates = (gigs: Gig[]) =>
    gigs.map((gig) => new Date(gig.dueDate.seconds * 1000));

  const scheduledDates = getGigDates(scheduledGigs);
  const pendingDates = getGigDates(pendingGigs);

  const noGigsMessage =
    scheduledGigs.length === 0 && pendingGigs.length === 0
      ? "No scheduled or pending gigs available."
      : null;

  return (
    <div className="rounded-lg bg-gray-900 p-6 shadow-lg">
      <div className="rounded-lg bg-gray-800 p-4 text-white shadow-md">
        {/* Calendar Header */}
        <div className="mb-4 flex items-center justify-between">
          <button
            onClick={handlePrevMonth}
            className="rounded-full bg-gray-700 p-2 hover:bg-gray-600"
          >
            &lt;
          </button>
          <h2 className="text-lg font-bold">
            {new Date(currentYear, currentMonth).toLocaleString("default", {
              month: "long",
              year: "numeric",
            })}
          </h2>
          <button
            onClick={handleNextMonth}
            className="rounded-full bg-gray-700 p-2 hover:bg-gray-600"
          >
            &gt;
          </button>
        </div>

        {/* Days of the Week */}
        <div className="mb-2 grid grid-cols-7 text-gray-400">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
            <div key={day} className="text-center">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-y-2">
          {/* Empty slots for the days before the first day of the month */}
          {Array.from({ length: firstDayOfMonth }).map((_, index) => (
            <div key={index}></div>
          ))}

          {/* Days of the month */}
          {Array.from({ length: daysInMonth }, (_, index) => {
            const day = index + 1;
            const currentDate = new Date(currentYear, currentMonth, day);

            const isScheduled = scheduledDates.some((date) =>
              isSameDay(date, currentDate),
            );
            const isPending = pendingDates.some((date) =>
              isSameDay(date, currentDate),
            );

            return (
              <div
                key={day}
                className={`rounded-lg p-2 text-center ${
                  isScheduled
                    ? "bg-orange-500 text-white"
                    : isPending
                      ? "bg-blue-500 text-white"
                      : "hover:bg-gray-600"
                }`}
              >
                {day}
              </div>
            );
          })}
        </div>
      </div>
      {noGigsMessage && (
        <div className="mt-4 text-center text-gray-400">{noGigsMessage}</div>
      )}
    </div>
  );
};

export default Calendar;
