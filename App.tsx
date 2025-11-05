// FIX: Implemented the main App component to orchestrate the application's views and state.
import React, { useState, useEffect } from 'react';
import BottomNav from './components/Header'; // Renamed for clarity, it's now the bottom nav
import Dashboard from './components/Dashboard';
import Schedule from './components/Schedule';
import Expenses from './components/Expenses';
import Report from './components/Report';
import Settings from './components/Settings';
import Accounting from './components/Accounting';
import Login from './components/Login';
import usePilarisData from './hooks/usePilarisData';
import type { View, User } from './types';
import { getTodayDateString } from './utils/helpers';
import { AttendanceStatus } from './types';

type Theme = 'light' | 'dark';

function App() {
  const [currentView, setCurrentView] = useState<View>('dashboard');
  const [user, setUser] = useState<User | null>(() => {
    try {
      const savedUser = localStorage.getItem('pilaris_user');
      return savedUser ? JSON.parse(savedUser) : null;
    } catch (error) {
      console.error('Failed to parse user from localStorage', error);
      return null;
    }
  });
  const [theme, setTheme] = useState<Theme>(() => {
      try {
        const savedTheme = localStorage.getItem('pilaris_theme') as Theme;
        if (savedTheme) return savedTheme;
      } catch (e) {}
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

  const pilarisData = usePilarisData();

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    try {
      localStorage.setItem('pilaris_theme', theme);
    } catch (error) {
       console.error('Failed to save theme to localStorage', error);
    }
  }, [theme]);
  
  // Notification check effect
  useEffect(() => {
    const checkNotifications = () => {
      const { settings, schedule } = pilarisData;
      if (!settings.notificationsEnabled || Notification.permission !== 'granted') {
        return;
      }
      
      const todayStr = getTodayDateString();
      const now = new Date();
      
      schedule.forEach(slot => {
        const firstStudent = slot.students.find(s => s.name.trim() !== '' && s.status !== AttendanceStatus.Vago);
        if (!firstStudent) return;
        
        const [hours, minutes] = slot.time.split(':').map(Number);
        const appointmentTime = new Date(todayStr);
        appointmentTime.setHours(hours, minutes, 0, 0);

        const reminderTime = new Date(appointmentTime.getTime() - settings.notificationMinutes * 60000);

        const notificationKey = `pilaris_notified_${todayStr}_${slot.time}`;
        
        if (now >= reminderTime && now < appointmentTime && !localStorage.getItem(notificationKey)) {
          const serviceName = settings.services.find(s => s.id === slot.serviceId)?.name || 'Atendimento';
          const notificationTitle = 'Lembrete de Atendimento';
          const notificationBody = `${serviceName} às ${slot.time} com ${firstStudent.name} está prestes a começar.`;
          
          new Notification(notificationTitle, { body: notificationBody });
          
          try {
            localStorage.setItem(notificationKey, 'true');
          } catch(e) {
            console.error('Failed to set notification flag in localStorage', e);
          }
        }
      });
    };

    const intervalId = setInterval(checkNotifications, 60000); // Check every minute

    return () => clearInterval(intervalId);
  }, [pilarisData.schedule, pilarisData.settings]);

  const handleThemeChange = () => {
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
  };

  const handleLogin = (loggedInUser: User) => {
    try {
      localStorage.setItem('pilaris_user', JSON.stringify(loggedInUser));
      setUser(loggedInUser);
    } catch (error) {
       console.error('Failed to save user to localStorage', error);
    }
  };

  const handleLogout = () => {
    try {
      localStorage.removeItem('pilaris_user');
      setUser(null);
      setCurrentView('dashboard'); // Reset to default view on logout
    } catch (error) {
      console.error('Failed to remove user from localStorage', error);
    }
  };

  if (!user) {
    return <Login onLogin={handleLogin} />;
  }

  const renderContent = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard schedule={pilarisData.schedule} expenses={pilarisData.expenses} services={pilarisData.settings.services} />;
      case 'schedule':
        return <Schedule 
                  currentDate={pilarisData.currentDate}
                  schedule={pilarisData.schedule}
                  services={pilarisData.settings.services}
                  studentTags={pilarisData.settings.studentTags}
                  onDateChange={pilarisData.changeDate}
                  onUpdateStudent={pilarisData.updateStudent}
                  onAddStudentSlot={pilarisData.addStudentSlot}
                  onRemoveStudentSlot={pilarisData.removeStudentSlot}
                  onUpdateTimeSlot={pilarisData.updateTimeSlot}
                  theme={theme}
                />;
      case 'expenses':
        return <Expenses expenses={pilarisData.expenses} onAddExpense={pilarisData.addExpense} onRemoveExpense={pilarisData.removeExpense} />;
      case 'report':
        return <Report 
                  currentDate={pilarisData.currentDate}
                  schedule={pilarisData.schedule} 
                  expenses={pilarisData.expenses}
                  services={pilarisData.settings.services}
                />;
       case 'accounting':
        return <Accounting services={pilarisData.settings.services} getAnnualData={pilarisData.getAnnualData} />;
      case 'settings':
        return <Settings 
                  settings={pilarisData.settings} 
                  onUpdateSettings={pilarisData.updateSettings} 
                  onLogout={handleLogout}
                  theme={theme}
                  onThemeChange={handleThemeChange}
                />;
      default:
        return <Dashboard schedule={pilarisData.schedule} expenses={pilarisData.expenses} services={pilarisData.settings.services} />;
    }
  };

  return (
    <div className="bg-secondary dark:bg-gray-900 min-h-screen font-sans">
       <header className="bg-brand-white dark:bg-gray-800 shadow-md dark:shadow-lg sticky top-0 z-40">
            <div className="container mx-auto px-4 sm:px-6 py-3 flex items-center space-x-2">
                <svg className="w-8 h-8 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
                </svg>
                <h1 className="text-xl font-bold text-brand-darkgray dark:text-gray-200">
                    Pilaris<span className="text-primary">Control</span>
                </h1>
            </div>
        </header>
      <main className="container mx-auto px-4 sm:px-6 py-6 pb-24">
        {renderContent()}
      </main>
      <BottomNav currentView={currentView} onNavigate={setCurrentView} />
    </div>
  );
}

export default App;