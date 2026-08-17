export interface DashboardStats {
  total_projects: number;
  total_tasks: number;
  in_progress_tasks: number;
  completed_tasks: number;
  overdue_tasks: number;
}

export interface DashboardTask {
  id: number;
  title: string;
  status: string;
  priority: string;
  project: number;
  project_name?: string;
  due_date?: string | null;
  created_at: string;
}

export interface DashboardProject {
  id: number;
  name: string;
  description: string;
  created_at: string;
  updated_at: string;
}

export interface DashboardNotification {
  id: number;
  notification_type: string;
  title: string;
  message: string;
  project?: number | null;
  task?: number | null;
  is_read: boolean;
  created_at: string;
}

export interface DashboardData {
  stats: DashboardStats;
  tasks: DashboardTask[];
  projects: DashboardProject[];
  notifications: DashboardNotification[];
}