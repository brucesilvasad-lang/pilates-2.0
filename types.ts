// FIX: Defined all application-wide TypeScript types and enums to resolve module and type errors.

declare global {
  interface Window {
    html2canvas: (element: HTMLElement, options?: any) => Promise<HTMLCanvasElement>;
  }
}

export enum AttendanceStatus {
  Presente = 'Presente',
  Faltou = 'Faltou',
  Vago = 'Vago',
}

export interface Student {
  id: string;
  name: string;
  status: AttendanceStatus;
  tag: string;
  notes: string;
}

export interface TimeSlot {
  time: string;
  serviceId: string;
  students: Student[];
}

export type DailySchedule = TimeSlot[];

export interface Service {
  id: string;
  name: string;
  price: number;
}

export interface Expense {
  id: string;
  description: string;
  amount: number;
  date: string; // YYYY-MM-DD
}

export interface AppSettings {
  services: Service[];
  studentTags: string[];
  notificationsEnabled: boolean;
  notificationMinutes: number;
}

export type View = 'dashboard' | 'schedule' | 'expenses' | 'settings' | 'report' | 'accounting';

export interface YearlySummary {
  totalRevenue: number;
  totalExpenses: number;
  netProfit: number;
  estimatedTax: number;
}

export interface User {
  email: string;
  name?: string;
}