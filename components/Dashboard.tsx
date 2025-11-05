// FIX: Implemented the Dashboard component to display key metrics.
import React from 'react';
import type { DailySchedule, Expense, Service } from '../types';
import {
  calculateTotalRevenue,
  calculateTotalExpenses,
  calculateNetProfit,
  calculateAttendanceStats,
} from '../utils/calculations';
import { formatCurrency } from '../utils/helpers';
import { RevenueIcon, ExpensesIcon, ProfitIcon } from './Icons';

interface DashboardProps {
  schedule: DailySchedule;
  expenses: Expense[];
  services: Service[];
}

const StatCard: React.FC<{ title: string; value: string; color: string; icon: React.ReactNode }> = ({ title, value, color, icon }) => (
    <div className={`bg-brand-white dark:bg-gray-800 p-6 rounded-xl shadow-lg flex items-center space-x-4 border-l-4 ${color}`}>
        <div className="text-3xl">{icon}</div>
        <div>
            <p className="text-sm font-medium text-brand-gray dark:text-gray-400">{title}</p>
            <p className="text-xl sm:text-2xl font-bold text-brand-darkgray dark:text-gray-200">{value}</p>
        </div>
    </div>
);

const Dashboard: React.FC<DashboardProps> = ({ schedule, expenses, services }) => {
  const totalRevenue = calculateTotalRevenue(schedule, services);
  const totalExpenses = calculateTotalExpenses(expenses);
  const netProfit = calculateNetProfit(totalRevenue, totalExpenses);
  const { present, absent, vacant, totalSlots } = calculateAttendanceStats(schedule);

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-brand-darkgray dark:text-gray-200">Dashboard</h2>
        <p className="text-brand-gray dark:text-gray-400">Resumo financeiro e de atendimentos do dia.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
        <StatCard 
            title="Receita Bruta" 
            value={formatCurrency(totalRevenue)} 
            color="border-green-500" 
            icon={<RevenueIcon className="w-8 h-8 text-green-500" />} 
        />
        <StatCard 
            title="Despesas" 
            value={formatCurrency(totalExpenses)} 
            color="border-red-500" 
            icon={<ExpensesIcon className="w-8 h-8 text-red-500" />} 
        />
        <StatCard 
            title="Lucro Líquido" 
            value={formatCurrency(netProfit)} 
            color="border-blue-500" 
            icon={<ProfitIcon className="w-8 h-8 text-blue-500" />} 
        />
      </div>

      <div>
        <h3 className="text-2xl font-bold text-brand-darkgray dark:text-gray-200 mb-4">Estatísticas de Atendimento</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            <div className="bg-brand-white dark:bg-gray-800 p-6 rounded-xl shadow-lg text-center">
                <p className="text-3xl sm:text-4xl font-bold text-green-600">{present}</p>
                <p className="font-semibold text-brand-gray dark:text-gray-400">Presentes</p>
            </div>
            <div className="bg-brand-white dark:bg-gray-800 p-6 rounded-xl shadow-lg text-center">
                <p className="text-3xl sm:text-4xl font-bold text-red-600">{absent}</p>
                <p className="font-semibold text-brand-gray dark:text-gray-400">Faltas</p>
            </div>
            <div className="bg-brand-white dark:bg-gray-800 p-6 rounded-xl shadow-lg text-center">
                <p className="text-3xl sm:text-4xl font-bold text-yellow-600">{vacant}</p>
                <p className="font-semibold text-brand-gray dark:text-gray-400">Vagos</p>
            </div>
            <div className="bg-brand-white dark:bg-gray-800 p-6 rounded-xl shadow-lg text-center">
                <p className="text-3xl sm:text-4xl font-bold text-brand-blue">{totalSlots}</p>
                <p className="font-semibold text-brand-gray dark:text-gray-400">Total de Vagas</p>
            </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;