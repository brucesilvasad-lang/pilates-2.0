// FIX: Implemented the Schedule view to manage daily appointments.
import React, { useState, useMemo } from 'react';
import type { DailySchedule, Student, Service, TimeSlot } from '../types';
import TimeSlotCard from './TimeSlotCard';
import DayNavigator from './Calendar';
import { SearchIcon, DownloadIcon } from './Icons';
import { downloadElementAsImage } from '../utils/helpers';

interface ScheduleProps {
  currentDate: string;
  schedule: DailySchedule;
  services: Service[];
  studentTags: string[];
  onDateChange: (date: string) => void;
  onUpdateStudent: (time: string, studentId: string, updatedStudent: Partial<Student>) => void;
  onAddStudentSlot: (time: string) => void;
  onRemoveStudentSlot: (time: string, studentId: string) => void;
  onUpdateTimeSlot: (time: string, updatedTimeSlot: Partial<TimeSlot>) => void;
  theme: 'light' | 'dark';
}

const Schedule: React.FC<ScheduleProps> = ({
  currentDate,
  schedule,
  services,
  studentTags,
  onDateChange,
  onUpdateStudent,
  onAddStudentSlot,
  onRemoveStudentSlot,
  onUpdateTimeSlot,
  theme,
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredSchedule = useMemo(() => {
    if (!searchQuery) {
      return schedule;
    }
    return schedule.filter(slot =>
      slot.students.some(student =>
        student.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    );
  }, [searchQuery, schedule]);

  const formatDateHeader = (dateString: string) => {
    return new Date(dateString + 'T00:00:00').toLocaleDateString('pt-BR', {
        weekday: 'long',
        day: '2-digit',
        month: 'long',
        year: 'numeric'
    });
  };

  const handleDownload = () => {
    downloadElementAsImage('schedule-content', `agenda-${currentDate}.png`);
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
            <h2 className="text-3xl font-bold text-brand-darkgray dark:text-gray-200">Agenda</h2>
            <p className="text-brand-gray dark:text-gray-400">Gerencie os horários e alunos para o dia.</p>
        </div>
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto">
          <div className="relative w-full sm:w-auto">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <SearchIcon className="w-5 h-5 text-gray-400" />
              </div>
              <input
                  type="text"
                  placeholder="Buscar aluno..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full sm:w-64 p-2 pl-10 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-primary-dark focus:border-transparent transition bg-white dark:bg-gray-700 dark:text-gray-200"
                  aria-label="Buscar aluno por nome"
              />
          </div>
          <DayNavigator
            currentDate={currentDate}
            onDateChange={onDateChange}
            theme={theme}
          />
           <button
            onClick={handleDownload}
            className="flex items-center justify-center space-x-2 w-full sm:w-auto text-sm text-primary-dark bg-primary-light hover:bg-blue-200 dark:text-blue-300 dark:bg-blue-900/50 dark:hover:bg-blue-900 font-medium py-2 px-4 rounded-lg transition-colors"
            title="Baixar imagem da agenda"
          >
            <DownloadIcon />
            <span>Baixar</span>
          </button>
        </div>
      </div>
      
      <div id="schedule-content">
        {schedule && schedule.length > 0 ? (
          <div>
            <h3 className="text-2xl font-bold text-brand-darkgray dark:text-gray-200 mb-4 pb-2 border-b-2 border-primary">{formatDateHeader(currentDate)}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredSchedule.length > 0 ? (
                filteredSchedule.map(timeSlot => (
                  <TimeSlotCard
                    key={timeSlot.time}
                    timeSlot={timeSlot}
                    services={services}
                    studentTags={studentTags}
                    onUpdateStudent={onUpdateStudent}
                    onAddStudentSlot={onAddStudentSlot}
                    onRemoveStudentSlot={onRemoveStudentSlot}
                    onUpdateTimeSlot={onUpdateTimeSlot}
                  />
                ))
              ) : (
                <div className="col-span-1 md:col-span-2 lg:col-span-3">
                  <div className="text-center py-16 bg-brand-white dark:bg-gray-800 rounded-xl shadow-lg">
                    <p className="text-brand-gray dark:text-gray-400 text-lg">
                      Nenhum aluno encontrado com o nome "{searchQuery}".
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="text-center py-16 bg-brand-white dark:bg-gray-800 rounded-xl shadow-lg">
            <p className="text-brand-gray dark:text-gray-400 text-lg">
              Nenhum horário encontrado para este dia.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Schedule;