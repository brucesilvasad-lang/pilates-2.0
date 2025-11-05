import React from 'react';
import type { TimeSlot, Student, Service } from '../types';
import { AttendanceStatus } from '../types';
import StudentRow from './StudentRow';
import { formatCurrency } from '../utils/helpers';
import { MoneyIcon, PlusCircleIcon } from './Icons';

interface TimeSlotCardProps {
  timeSlot: TimeSlot;
  services: Service[];
  studentTags: string[];
  onUpdateStudent: (time: string, studentId: string, updatedStudent: Partial<Student>) => void;
  onAddStudentSlot: (time: string) => void;
  onRemoveStudentSlot: (time: string, studentId: string) => void;
  onUpdateTimeSlot: (time: string, updatedTimeSlot: Partial<TimeSlot>) => void;
}

const TimeSlotCard: React.FC<TimeSlotCardProps> = ({ timeSlot, services, studentTags, onUpdateStudent, onAddStudentSlot, onRemoveStudentSlot, onUpdateTimeSlot }) => {
  const currentService = services.find(s => s.id === timeSlot.serviceId);
  const pricePerSession = currentService ? currentService.price : 0;
  const slotEarnings = timeSlot.students.filter(s => s.status === AttendanceStatus.Presente).length * pricePerSession;

  const handleServiceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onUpdateTimeSlot(timeSlot.time, { serviceId: e.target.value });
  };

  return (
    <div className="bg-brand-white dark:bg-gray-800 rounded-xl shadow-lg p-4 sm:p-6 flex flex-col space-y-4 transition-shadow hover:shadow-2xl">
      <div className="flex justify-between items-center pb-3 border-b border-gray-200 dark:border-gray-700">
        <h3 className="text-2xl font-bold text-brand-blue">{timeSlot.time}</h3>
        <div className="flex items-center space-x-2 text-green-600">
          <MoneyIcon className="w-6 h-6"/>
          <span className="font-semibold text-lg">{formatCurrency(slotEarnings)}</span>
        </div>
      </div>

      <div>
        <label htmlFor={`service-select-${timeSlot.time}`} className="sr-only">Tipo de Atendimento</label>
        <select
          id={`service-select-${timeSlot.time}`}
          value={timeSlot.serviceId || ''}
          onChange={handleServiceChange}
          className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-brand-darkgray dark:text-gray-200 text-sm font-medium rounded-lg focus:ring-primary focus:border-primary block p-2"
        >
          {services.length === 0 && <option disabled className="bg-white text-black dark:bg-gray-600 dark:text-white">Crie um serviço nas Configurações</option>}
          {services.map(service => (
            <option key={service.id} value={service.id} className="bg-white text-black dark:bg-gray-600 dark:text-white">
              {service.name} - {formatCurrency(service.price)}
            </option>
          ))}
        </select>
      </div>
      
      <div className="flex-grow space-y-3">
        {timeSlot.students.map((student) => (
          <StudentRow
            key={student.id}
            student={student}
            time={timeSlot.time}
            studentTags={studentTags}
            onUpdate={(updatedStudent) => onUpdateStudent(timeSlot.time, student.id, updatedStudent)}
            onRemove={() => onRemoveStudentSlot(timeSlot.time, student.id)}
            canRemove={timeSlot.students.length > 1}
          />
        ))}
      </div>

      <div className="pt-3 border-t border-gray-200 dark:border-gray-700">
        <button
          onClick={() => onAddStudentSlot(timeSlot.time)}
          className="w-full flex items-center justify-center space-x-2 text-sm text-primary-dark hover:bg-primary-light dark:text-blue-300 dark:hover:bg-blue-900/50 font-medium py-2 px-4 rounded-lg transition-colors"
        >
          <PlusCircleIcon />
          <span>Adicionar Aluno</span>
        </button>
      </div>
    </div>
  );
};

export default TimeSlotCard;