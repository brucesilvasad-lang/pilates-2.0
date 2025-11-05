// FIX: Implemented the central state management hook for the application.
import { useState, useEffect, useCallback } from 'react';
import type { DailySchedule, Student, AppSettings, Expense, TimeSlot } from '../types';
import { AttendanceStatus } from '../types';
import { TIME_SLOTS, INITIAL_STUDENTS_PER_SLOT } from '../constants';
import { generateUniqueId, getTodayDateString } from '../utils/helpers';

const createInitialSchedule = (serviceId: string): DailySchedule => {
  return TIME_SLOTS.map(time => ({
    time,
    serviceId,
    students: Array.from({ length: INITIAL_STUDENTS_PER_SLOT }, () => ({
      id: generateUniqueId(),
      name: '',
      status: AttendanceStatus.Vago,
      tag: '',
      notes: '',
    })),
  }));
};

const usePilarisData = () => {
  const [currentDate, setCurrentDate] = useState<string>(getTodayDateString());

  const getLocalStorageKey = (date: string, key: string) => `pilaris_control_${date}_${key}`;

  const [settings, setSettings] = useState<AppSettings>(() => {
    try {
      const savedSettings = localStorage.getItem('pilaris_control_settings');
      if (savedSettings) return JSON.parse(savedSettings);
    } catch (error) {
      console.error('Error reading settings from localStorage', error);
    }
    return {
      services: [
        { id: generateUniqueId(), name: 'Pilates', price: 25 },
        { id: generateUniqueId(), name: 'Massoterapia', price: 50 },
        { id: generateUniqueId(), name: 'Drenagem Linfática', price: 60 },
        { id: generateUniqueId(), name: 'Liberação Miofascial', price: 70 },
      ],
      studentTags: ['Estúdio', 'Wellhub', 'Gympass'],
      notificationsEnabled: false,
      notificationMinutes: 15,
    };
  });

  const [schedule, setSchedule] = useState<DailySchedule>(() => {
    try {
      const savedSchedule = localStorage.getItem(getLocalStorageKey(currentDate, 'schedule'));
      if (savedSchedule) return JSON.parse(savedSchedule);
    } catch (error) {
      console.error('Error reading schedule from localStorage', error);
    }
    const defaultServiceId = settings.services[0].id;
    return createInitialSchedule(defaultServiceId);
  });

  const [expenses, setExpenses] = useState<Expense[]>(() => {
    try {
      const savedExpenses = localStorage.getItem(getLocalStorageKey(currentDate, 'expenses'));
      if (savedExpenses) return JSON.parse(savedExpenses);
    } catch (error) {
      console.error('Error reading expenses from localStorage', error);
    }
    return [];
  });
  
  useEffect(() => {
    try {
      localStorage.setItem('pilaris_control_settings', JSON.stringify(settings));
    } catch (error) {
      console.error('Error saving settings to localStorage', error);
    }
  }, [settings]);

  useEffect(() => {
    try {
      localStorage.setItem(getLocalStorageKey(currentDate, 'schedule'), JSON.stringify(schedule));
    } catch (error) {
      console.error('Error saving schedule to localStorage', error);
    }
  }, [schedule, currentDate]);

  useEffect(() => {
    try {
      localStorage.setItem(getLocalStorageKey(currentDate, 'expenses'), JSON.stringify(expenses));
    } catch (error) {
      console.error('Error saving expenses to localStorage', error);
    }
  }, [expenses, currentDate]);
  
  const changeDate = useCallback((date: string) => {
    setCurrentDate(date);
    try {
        const savedSchedule = localStorage.getItem(getLocalStorageKey(date, 'schedule'));
        setSchedule(savedSchedule ? JSON.parse(savedSchedule) : createInitialSchedule(settings.services[0].id));

        const savedExpenses = localStorage.getItem(getLocalStorageKey(date, 'expenses'));
        setExpenses(savedExpenses ? JSON.parse(savedExpenses) : []);
    } catch (error) {
        console.error('Error loading data for new date', error);
        setSchedule(createInitialSchedule(settings.services[0].id));
        setExpenses([]);
    }
  }, [settings.services]);

  const updateStudent = useCallback((time: string, studentId: string, updatedStudent: Partial<Student>) => {
    setSchedule(prevSchedule =>
      prevSchedule.map(slot =>
        slot.time === time
          ? {
              ...slot,
              students: slot.students.map(student =>
                student.id === studentId ? { ...student, ...updatedStudent } : student
              ),
            }
          : slot
      )
    );
  }, []);

  const addStudentSlot = useCallback((time: string) => {
    setSchedule(prevSchedule =>
      prevSchedule.map(slot =>
        slot.time === time
          ? {
              ...slot,
              students: [
                ...slot.students,
                {
                  id: generateUniqueId(),
                  name: '',
                  status: AttendanceStatus.Presente,
                  tag: '',
                  notes: '',
                },
              ],
            }
          : slot
      )
    );
  }, []);
  
  const removeStudentSlot = useCallback((time: string, studentId: string) => {
    setSchedule(prevSchedule =>
      prevSchedule.map(slot =>
        slot.time === time
          ? { ...slot, students: slot.students.filter(s => s.id !== studentId) }
          : slot
      )
    );
  }, []);

  const updateTimeSlot = useCallback((time: string, updatedTimeSlot: Partial<TimeSlot>) => {
      setSchedule(prevSchedule => prevSchedule.map(slot => slot.time === time ? { ...slot, ...updatedTimeSlot } : slot));
  }, []);

  const addExpense = useCallback((expense: Omit<Expense, 'id' | 'date'>) => {
      setExpenses(prev => [...prev, { ...expense, id: generateUniqueId(), date: currentDate }]);
  }, [currentDate]);

  const removeExpense = useCallback((id: string) => {
      setExpenses(prev => prev.filter(exp => exp.id !== id));
  }, []);

  const updateSettings = useCallback((newSettings: AppSettings) => {
      setSettings(newSettings);
  }, []);

  const getAnnualData = useCallback((year: number) => {
    const allSchedules: { [date: string]: DailySchedule } = {};
    const allExpenses: { [date: string]: Expense[] } = {};
    
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith(`pilaris_control_${year}-`)) {
            const parts = key.split('_');
            if (parts.length < 4) continue;
            
            const date = parts[2];
            const dataType = parts[3];
            
            try {
                const data = JSON.parse(localStorage.getItem(key) || '[]');
                if (dataType === 'schedule' && Array.isArray(data) && data.length > 0) {
                    allSchedules[date] = data;
                } else if (dataType === 'expenses' && Array.isArray(data) && data.length > 0) {
                    allExpenses[date] = data;
                }
            } catch (error) {
                console.error(`Error parsing data for key ${key}`, error);
            }
        }
    }
    return { allSchedules, allExpenses };
  }, []);


  return {
    currentDate,
    changeDate,
    schedule,
    expenses,
    settings,
    updateStudent,
    addStudentSlot,
    removeStudentSlot,
    updateTimeSlot,
    addExpense,
    removeExpense,
    updateSettings,
    getAnnualData,
  };
};

export default usePilarisData;