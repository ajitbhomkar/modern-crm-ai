import { create } from 'zustand';

export interface Customer {
  id: string;
  name: string;
  email: string;
  company: string;
  phone: string;
  status: 'active' | 'inactive' | 'lead';
  value: number;
  lastContact: Date;
  leadScore?: number;
  industry?: string;
  interactions: number;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  dueDate: Date;
  priority: 'low' | 'medium' | 'high';
  status: 'pending' | 'in-progress' | 'completed';
  assignedTo: string;
  customerId?: string;
}

export interface DashboardStats {
  totalCustomers: number;
  activeLeads: number;
  totalRevenue: number;
  tasksCompleted: number;
}

interface CRMStore {
  customers: Customer[];
  tasks: Task[];
  addCustomer: (customer: Customer) => void;
  updateCustomer: (id: string, customer: Partial<Customer>) => void;
  deleteCustomer: (id: string) => void;
  addTask: (task: Task) => void;
  updateTask: (id: string, task: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  getDashboardStats: () => DashboardStats;
}

// Mock data
const mockCustomers: Customer[] = [
  {
    id: '1',
    name: 'John Smith',
    email: 'john.smith@acme.com',
    company: 'Acme Corp',
    phone: '+1 (555) 123-4567',
    status: 'active',
    value: 125000,
    lastContact: new Date('2024-12-28'),
    leadScore: 85,
    industry: 'Technology',
    interactions: 24,
  },
  {
    id: '2',
    name: 'Sarah Johnson',
    email: 'sarah.j@techstart.io',
    company: 'TechStart',
    phone: '+1 (555) 234-5678',
    status: 'lead',
    value: 75000,
    lastContact: new Date('2024-12-30'),
    leadScore: 72,
    industry: 'SaaS',
    interactions: 12,
  },
  {
    id: '3',
    name: 'Michael Chen',
    email: 'm.chen@globalinc.com',
    company: 'Global Inc',
    phone: '+1 (555) 345-6789',
    status: 'active',
    value: 200000,
    lastContact: new Date('2024-12-29'),
    leadScore: 92,
    industry: 'Finance',
    interactions: 38,
  },
  {
    id: '4',
    name: 'Emily Rodriguez',
    email: 'emily.r@innovate.com',
    company: 'Innovate Labs',
    phone: '+1 (555) 456-7890',
    status: 'lead',
    value: 50000,
    lastContact: new Date('2024-12-27'),
    leadScore: 65,
    industry: 'Healthcare',
    interactions: 8,
  },
];

const mockTasks: Task[] = [
  {
    id: '1',
    title: 'Follow up with John Smith',
    description: 'Discuss Q1 renewal and upsell opportunities',
    dueDate: new Date('2025-01-02'),
    priority: 'high',
    status: 'pending',
    assignedTo: 'You',
    customerId: '1',
  },
  {
    id: '2',
    title: 'Prepare proposal for TechStart',
    description: 'Create customized proposal for enterprise plan',
    dueDate: new Date('2025-01-05'),
    priority: 'high',
    status: 'in-progress',
    assignedTo: 'You',
    customerId: '2',
  },
  {
    id: '3',
    title: 'Schedule demo with Emily',
    description: 'Product demo for healthcare compliance features',
    dueDate: new Date('2025-01-03'),
    priority: 'medium',
    status: 'pending',
    assignedTo: 'You',
    customerId: '4',
  },
];

export const useCRMStore = create<CRMStore>((set, get) => ({
  customers: mockCustomers,
  tasks: mockTasks,

  addCustomer: (customer) =>
    set((state) => ({
      customers: [...state.customers, customer],
    })),

  updateCustomer: (id, updatedCustomer) =>
    set((state) => ({
      customers: state.customers.map((c) =>
        c.id === id ? { ...c, ...updatedCustomer } : c
      ),
    })),

  deleteCustomer: (id) =>
    set((state) => ({
      customers: state.customers.filter((c) => c.id !== id),
    })),

  addTask: (task) =>
    set((state) => ({
      tasks: [...state.tasks, task],
    })),

  updateTask: (id, updatedTask) =>
    set((state) => ({
      tasks: state.tasks.map((t) =>
        t.id === id ? { ...t, ...updatedTask } : t
      ),
    })),

  deleteTask: (id) =>
    set((state) => ({
      tasks: state.tasks.filter((t) => t.id !== id),
    })),

  getDashboardStats: () => {
    const { customers, tasks } = get();
    return {
      totalCustomers: customers.length,
      activeLeads: customers.filter((c) => c.status === 'lead').length,
      totalRevenue: customers.reduce((sum, c) => sum + c.value, 0),
      tasksCompleted: tasks.filter((t) => t.status === 'completed').length,
    };
  },
}));
