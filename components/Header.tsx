import React from 'react';
import { DashboardIcon, ScheduleIcon, ExpensesIcon, ReportIcon, SettingsIcon, AccountingIcon } from './Icons';
import type { View } from '../types';

interface BottomNavProps {
  currentView: View;
  onNavigate: (view: View) => void;
}

const BottomNav: React.FC<BottomNavProps> = ({ currentView, onNavigate }) => {
  const navItems: { id: View; label: string, icon: React.ReactNode }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: <DashboardIcon className="w-6 h-6 mb-1" /> },
    { id: 'schedule', label: 'Agenda', icon: <ScheduleIcon className="w-6 h-6 mb-1" /> },
    { id: 'expenses', label: 'Despesas', icon: <ExpensesIcon className="w-6 h-6 mb-1" /> },
    { id: 'report', label: 'Relatório', icon: <ReportIcon className="w-6 h-6 mb-1" /> },
    { id: 'accounting', label: 'Contábil', icon: <AccountingIcon className="w-6 h-6 mb-1" /> },
    { id: 'settings', label: 'Ajustes', icon: <SettingsIcon className="w-6 h-6 mb-1" /> },
  ];

  const getButtonClass = (view: View) => {
    const baseClass = "flex flex-col items-center justify-center w-full h-16 transition-colors duration-200";
    if (currentView === view) {
      return `${baseClass} text-primary dark:text-primary-light`;
    }
    return `${baseClass} text-brand-gray dark:text-gray-400 hover:text-primary dark:hover:text-primary-light`;
  };

  const getLabelClass = (view: View) => {
    const baseClass = "text-xs font-medium";
     if (currentView === view) {
      return `${baseClass} text-primary dark:text-primary-light`;
    }
    return `${baseClass} text-brand-gray dark:text-gray-400`;
  }

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-brand-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 shadow-[0_-2px_5px_rgba(0,0,0,0.05)] dark:shadow-[0_-2px_5px_rgba(0,0,0,0.2)]">
      <div className="container mx-auto flex justify-around items-center">
        {navItems.map(item => (
          <button
            key={item.id}
            onClick={() => onNavigate(item.id)}
            className={getButtonClass(item.id)}
            title={item.label}
          >
            {item.icon}
            <span className={getLabelClass(item.id)}>{item.label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
};

export default BottomNav;