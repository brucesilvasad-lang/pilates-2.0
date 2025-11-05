// FIX: Implemented a simple date picker component for navigating between dates.
import React from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from './Icons';
import { getTodayDateString } from '../utils/helpers';

interface DayNavigatorProps {
  currentDate: string;
  onDateChange: (date: string) => void;
  theme: 'light' | 'dark';
}

const DayNavigator: React.FC<DayNavigatorProps> = ({ currentDate, onDateChange, theme }) => {
  const handleDateChange = (increment: number) => {
    const date = new Date(currentDate + 'T00:00:00');
    date.setDate(date.getDate() + increment);
    onDateChange(date.toISOString().split('T')[0]);
  };
  
  const handleDateInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value) {
        onDateChange(e.target.value);
    }
  };
  
  const goToToday = () => {
    onDateChange(getTodayDateString());
  };

  return (
    <div className="flex items-center space-x-2 bg-brand-white dark:bg-gray-800 p-2 rounded-lg shadow">
      <button 
        onClick={() => handleDateChange(-1)} 
        className="p-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 transition" 
        aria-label="Dia anterior"
      >
        <ChevronLeftIcon className="w-5 h-5 text-brand-darkgray dark:text-gray-300" />
      </button>
      
      <input
        type="date"
        value={currentDate}
        onChange={handleDateInput}
        className="bg-white dark:bg-gray-700 p-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-primary-dark focus:border-transparent transition text-center font-medium text-brand-darkgray dark:text-gray-200 w-40"
        aria-label="Selecionar data"
        style={{ colorScheme: theme }}
      />
      
      <button 
        onClick={() => handleDateChange(1)} 
        className="p-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 transition" 
        aria-label="Próximo dia"
      >
        <ChevronRightIcon className="w-5 h-5 text-brand-darkgray dark:text-gray-300" />
      </button>

      <button
        onClick={goToToday}
        className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 transition text-sm font-medium text-brand-darkgray dark:text-gray-300"
      >
        Hoje
      </button>
    </div>
  );
};

export default DayNavigator;