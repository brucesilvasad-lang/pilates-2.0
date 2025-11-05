import React, { useState } from 'react';
import type { Student } from '../types';
import { AttendanceStatus } from '../types';
import { NoteIcon, TrashIcon } from './Icons';

interface StudentRowProps {
  student: Student;
  time: string;
  studentTags: string[];
  onUpdate: (updatedStudent: Partial<Student>) => void;
  onRemove: () => void;
  canRemove: boolean;
}

const StudentRow: React.FC<StudentRowProps> = ({ student, studentTags, onUpdate, onRemove, canRemove }) => {
  const [showNotes, setShowNotes] = useState(false);

  const getStatusColor = (status: AttendanceStatus) => {
    switch (status) {
      case AttendanceStatus.Presente:
        return 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/50 dark:text-green-300 dark:border-green-800';
      case AttendanceStatus.Faltou:
        return 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900/50 dark:text-red-300 dark:border-red-800';
      case AttendanceStatus.Vago:
        return 'bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/50 dark:text-yellow-300 dark:border-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap items-center gap-2">
        <input
          type="text"
          value={student.name}
          placeholder="Nome do aluno"
          onChange={(e) => onUpdate({ name: e.target.value })}
          className="flex-grow p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-dark focus:border-transparent transition min-w-[120px] bg-white dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600"
          disabled={student.status === AttendanceStatus.Vago && student.name === ""}
        />
        <select
          value={student.tag || ''}
          onChange={(e) => onUpdate({ tag: e.target.value })}
          className="p-2 border border-gray-300 rounded-md text-sm text-gray-600 focus:ring-2 focus:ring-primary-dark focus:border-transparent transition bg-white dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600"
        >
          <option value="" className="bg-white text-black dark:bg-gray-600 dark:text-white">Legenda</option>
          {studentTags.map(tag => (
            <option key={tag} value={tag} className="bg-white text-black dark:bg-gray-600 dark:text-white">{tag}</option>
          ))}
        </select>
        <select
          value={student.status}
          onChange={(e) => onUpdate({ status: e.target.value as AttendanceStatus })}
          className={`appearance-none p-2 border rounded-md font-semibold text-sm focus:ring-2 focus:ring-primary-dark focus:border-transparent transition ${getStatusColor(student.status)}`}
        >
          {Object.values(AttendanceStatus).map((status) => (
            <option key={status} value={status} className="bg-white text-black dark:bg-gray-800 dark:text-white">
              {status}
            </option>
          ))}
        </select>
        <button
          onClick={() => setShowNotes(!showNotes)}
          className="p-2 text-gray-500 hover:text-primary-dark hover:bg-primary-light rounded-full transition-colors dark:text-gray-400 dark:hover:bg-blue-900/50 dark:hover:text-blue-300"
          title="Anotações"
        >
          <NoteIcon />
        </button>
        {canRemove && (
            <button
                onClick={onRemove}
                className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-100 rounded-full transition-colors dark:text-gray-400 dark:hover:text-red-400 dark:hover:bg-red-900/50"
                title="Remover Aluno"
            >
                <TrashIcon />
            </button>
        )}
      </div>
      {showNotes && (
        <textarea
          value={student.notes}
          onChange={(e) => onUpdate({ notes: e.target.value })}
          placeholder="Anotações rápidas..."
          className="w-full p-2 border border-gray-200 rounded-md text-sm focus:ring-2 focus:ring-primary-dark focus:border-transparent transition bg-white dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600"
          rows={2}
        />
      )}
    </div>
  );
};

export default StudentRow;