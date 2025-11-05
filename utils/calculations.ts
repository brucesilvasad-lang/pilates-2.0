import type { DailySchedule, Expense, Service, YearlySummary } from '../types';
import { AttendanceStatus } from '../types';

export const ESTIMATED_TAX_RATE = 0.06; // Simples Nacional - Anexo III (6%)

export const calculateTotalRevenue = (schedule: DailySchedule, services: Service[]): number => {
  return schedule.reduce((total, slot) => {
    const service = services.find(s => s.id === slot.serviceId);
    const pricePerSession = service ? service.price : 0;
    const presentStudents = slot.students.filter(s => s.status === AttendanceStatus.Presente).length;
    return total + (presentStudents * pricePerSession);
  }, 0);
};

export const calculateTotalExpenses = (expenses: Expense[]): number => {
  return expenses.reduce((total, expense) => total + expense.amount, 0);
};

export const calculateNetProfit = (totalRevenue: number, totalExpenses: number): number => {
  return totalRevenue - totalExpenses;
};

export const calculateAttendanceStats = (schedule: DailySchedule) => {
  let present = 0;
  let absent = 0;
  let vacant = 0;
  let totalSlots = 0;

  schedule.forEach(slot => {
    slot.students.forEach(student => {
      totalSlots++;
      switch (student.status) {
        case AttendanceStatus.Presente:
          present++;
          break;
        case AttendanceStatus.Faltou:
          absent++;
          break;
        case AttendanceStatus.Vago:
          vacant++;
          break;
      }
    });
  });

  return { present, absent, vacant, totalSlots };
};

export const calculateYearlySummary = (
  allSchedules: { [date: string]: DailySchedule },
  allExpenses: { [date: string]: Expense[] },
  services: Service[]
): YearlySummary => {
  let totalRevenue = 0;
  let totalExpenses = 0;

  for (const date in allSchedules) {
    totalRevenue += calculateTotalRevenue(allSchedules[date], services);
  }

  for (const date in allExpenses) {
    totalExpenses += calculateTotalExpenses(allExpenses[date]);
  }

  const netProfit = totalRevenue - totalExpenses;
  const estimatedTax = totalRevenue * ESTIMATED_TAX_RATE; // Based on gross revenue

  return { totalRevenue, totalExpenses, netProfit, estimatedTax };
};
