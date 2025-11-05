import React, { useState, useEffect } from 'react';
import type { Service, YearlySummary, DailySchedule, Expense } from '../types';
import { calculateYearlySummary, ESTIMATED_TAX_RATE } from '../utils/calculations';
import { formatCurrency, downloadElementAsImage } from '../utils/helpers';
import { AccountingIcon, ChevronLeftIcon, ChevronRightIcon, RevenueIcon, ProfitIcon, ExpensesIcon, DownloadIcon } from './Icons';

interface AccountingProps {
  services: Service[];
  getAnnualData: (year: number) => {
    allSchedules: { [date: string]: DailySchedule };
    allExpenses: { [date: string]: Expense[] };
  };
}

const Accounting: React.FC<AccountingProps> = ({ services, getAnnualData }) => {
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [summary, setSummary] = useState<YearlySummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    const { allSchedules, allExpenses } = getAnnualData(selectedYear);
    const calculatedSummary = calculateYearlySummary(allSchedules, allExpenses, services);
    setSummary(calculatedSummary);
    setIsLoading(false);
  }, [selectedYear, getAnnualData, services]);

  const handleDownload = () => {
    downloadElementAsImage('accounting-content', `resumo-anual-${selectedYear}.png`);
  };

  const StatCard: React.FC<{ title: string; value: string; description: string; icon: React.ReactNode }> = ({ title, value, description, icon }) => (
    <div className="bg-brand-white dark:bg-gray-800 p-6 rounded-xl shadow-lg flex flex-col justify-between h-full">
        <div>
            <div className="flex items-start space-x-4 mb-2">
                <div className="text-3xl text-primary pt-1">{icon}</div>
                <div>
                    <p className="text-base font-semibold text-brand-gray dark:text-gray-400">{title}</p>
                    <p className="text-2xl sm:text-3xl font-bold text-brand-darkgray dark:text-gray-200">{value}</p>
                </div>
            </div>
        </div>
        <p className="text-sm text-brand-gray dark:text-gray-400 mt-4">{description}</p>
    </div>
  );
  
  const handleYearChange = (increment: number) => {
    setSelectedYear(prev => prev + increment);
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-brand-darkgray dark:text-gray-200">Resumo Anual (Contabilidade)</h2>
          <p className="text-brand-gray dark:text-gray-400">Visão geral das finanças do ano selecionado.</p>
        </div>
        <div className="flex items-center gap-2">
            <div className="flex items-center space-x-2 bg-brand-white dark:bg-gray-800 p-2 rounded-lg shadow">
              <button onClick={() => handleYearChange(-1)} className="p-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 transition" aria-label="Ano anterior">
                <ChevronLeftIcon className="w-6 h-6 text-brand-darkgray dark:text-gray-300" />
              </button>
              <span className="font-bold text-xl text-primary-dark dark:text-primary-light w-24 text-center">{selectedYear}</span>
              <button onClick={() => handleYearChange(1)} className="p-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 transition" aria-label="Próximo ano">
                <ChevronRightIcon className="w-6 h-6 text-brand-darkgray dark:text-gray-300" />
              </button>
            </div>
             <button
              onClick={handleDownload}
              className="flex items-center justify-center space-x-2 h-full text-sm text-primary-dark bg-primary-light hover:bg-blue-200 dark:text-blue-300 dark:bg-blue-900/50 dark:hover:bg-blue-900 font-medium py-2 px-4 rounded-lg transition-colors"
              title="Baixar imagem do resumo"
            >
              <DownloadIcon />
              <span>Baixar</span>
            </button>
        </div>
      </div>
      
      <div id="accounting-content">
        {isLoading ? (
          <p className="text-center text-brand-gray dark:text-gray-400">Calculando resumo anual...</p>
        ) : summary ? (
           <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <StatCard 
                  title="Ganho Bruto Anual" 
                  value={formatCurrency(summary.totalRevenue)}
                  description="Soma de todos os valores recebidos de atendimentos durante o ano."
                  icon={<RevenueIcon />}
              />
               <StatCard 
                  title="Despesas Anuais" 
                  value={formatCurrency(summary.totalExpenses)}
                  description="Soma de todos os gastos e despesas registrados durante o ano."
                  icon={<ExpensesIcon className="w-6 h-6" />}
              />
               <StatCard 
                  title="Lucro Líquido Anual" 
                  value={formatCurrency(summary.netProfit)}
                  description="O resultado final após subtrair todas as despesas dos ganhos."
                  icon={<ProfitIcon />}
              />
               <StatCard 
                  title="Imposto Bruto Estimado" 
                  value={formatCurrency(summary.estimatedTax)}
                  description={`Cálculo simplificado baseado em ${ESTIMATED_TAX_RATE * 100}% sobre o Ganho Bruto. Consulte um contador.`}
                  icon={<AccountingIcon className="w-6 h-6" />}
              />
           </div>
        ) : (
          <p>Ocorreu um erro ao calcular os dados.</p>
        )}

        <div className="mt-8 p-4 bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-400 text-yellow-800 dark:text-yellow-300 rounded-r-lg">
          <h4 className="font-bold">Aviso Importante</h4>
          <p className="text-sm">Os valores apresentados, especialmente a estimativa de imposto, são baseados em um cálculo simplificado e servem apenas para referência. Este sistema não substitui a orientação de um profissional de contabilidade.</p>
        </div>
      </div>
    </div>
  );
};

export default Accounting;