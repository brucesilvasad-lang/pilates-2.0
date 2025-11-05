// FIX: Implemented the Expenses view for managing daily expenses.
import React, { useState } from 'react';
import type { Expense } from '../types';
import { formatCurrency } from '../utils/helpers';
import { PlusCircleIcon, TrashIcon } from './Icons';

interface ExpensesProps {
  expenses: Expense[];
  onAddExpense: (expense: Omit<Expense, 'id'|'date'>) => void;
  onRemoveExpense: (id: string) => void;
}

const Expenses: React.FC<ExpensesProps> = ({ expenses, onAddExpense, onRemoveExpense }) => {
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState<number | ''>('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // FIX: Operator '>' cannot be applied to types 'string | number' and 'number'. Cast amount to Number before comparison.
    if (description && Number(amount) > 0) {
      onAddExpense({ description, amount: Number(amount) });
      setDescription('');
      setAmount('');
    }
  };

  const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0);

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-brand-darkgray dark:text-gray-200">Controle de Despesas</h2>
        <p className="text-brand-gray dark:text-gray-400">Adicione e gerencie as despesas do dia.</p>
      </div>

      <div className="bg-brand-white dark:bg-gray-800 p-8 rounded-xl shadow-lg space-y-8">
        {/* Add Expense Form */}
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-6 gap-4 items-end">
          <div className="md:col-span-3">
            <label htmlFor="expense-description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Descrição</label>
            <input
              id="expense-description"
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-dark focus:border-transparent transition bg-white dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600"
              placeholder="Ex: Aluguel"
              required
            />
          </div>
          <div className="md:col-span-2">
            <label htmlFor="expense-amount" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Valor (R$)</label>
            <input
              id="expense-amount"
              type="number"
              value={amount}
              onChange={(e) => setAmount(parseFloat(e.target.value) || '')}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-dark focus:border-transparent transition bg-white dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600"
              placeholder="0.00"
              step="0.01"
              min="0.01"
              required
            />
          </div>
          <div className="md:col-span-1">
            <button type="submit" className="w-full flex items-center justify-center space-x-2 text-sm text-primary-dark bg-primary-light hover:bg-blue-200 dark:text-blue-300 dark:bg-blue-900/50 dark:hover:bg-blue-900 font-medium py-2 px-4 rounded-lg transition-colors">
              <PlusCircleIcon />
              <span>Adicionar</span>
            </button>
          </div>
        </form>

        {/* Expenses List */}
        <div className="space-y-4 pt-8 border-t border-gray-200 dark:border-gray-700">
          <h3 className="text-xl font-semibold text-brand-darkgray dark:text-gray-200">Despesas Registradas</h3>
          {expenses.length > 0 ? (
            <ul className="divide-y divide-gray-200 dark:divide-gray-700">
              {expenses.map(expense => (
                <li key={expense.id} className="py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                  <div className="flex-grow">
                    <p className="font-medium text-brand-darkgray dark:text-gray-200">{expense.description}</p>
                    <p className="text-sm text-brand-gray dark:text-gray-400">{new Date(expense.date + 'T00:00:00').toLocaleDateString('pt-BR')}</p>
                  </div>
                  <div className="flex items-center space-x-4 self-end sm:self-center">
                    <span className="font-semibold text-red-600 dark:text-red-400">{formatCurrency(expense.amount)}</span>
                    <button onClick={() => onRemoveExpense(expense.id)} className="p-1 text-gray-500 hover:text-red-600 hover:bg-red-100 dark:text-gray-400 dark:hover:text-red-400 dark:hover:bg-red-900/50 rounded-full transition-colors" title="Remover Despesa">
                        <TrashIcon />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-brand-gray dark:text-gray-400 text-center py-4">Nenhuma despesa registrada para hoje.</p>
          )}
          {/* Total */}
          {expenses.length > 0 && (
            <div className="pt-4 border-t border-gray-300 dark:border-gray-600 flex justify-end items-center font-bold text-lg">
                <span className="text-brand-darkgray dark:text-gray-300 mr-2">Total:</span>
                <span className="text-red-600 dark:text-red-400">{formatCurrency(totalExpenses)}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Expenses;