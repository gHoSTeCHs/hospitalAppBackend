import axios from 'axios';

// Base URL for API endpoints
const API_URL = 'http://localhost:8080/';

// Configure axios defaults
axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
axios.defaults.withCredentials = true;

// Task priority types
export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent';

// Task status types
export type TaskStatus = 'pending' | 'in_progress' | 'completed' | 'cancelled';

// Task interface
export interface Task {
    id: number;
    title: string;
    description?: string;
    status: TaskStatus;
    priority: TaskPriority;
    due_date?: string;
    created_at: string;
    updated_at: string;
    assigned_to?: number;
    created_by: number;
}

// Task create/update payload
export interface TaskPayload {
    title: string;
    description?: string;
    status?: TaskStatus;
    priority?: TaskPriority;
    due_date?: string;
    assigned_to?: number;
}

// Task filter/sort/pagination parameters
export interface TaskQueryParams {
    page?: number;
    limit?: number;
    status?: TaskStatus | TaskStatus[];
    priority?: TaskPriority | TaskPriority[];
    assigned_to?: number;
    search?: string;
    sort_by?: string;
    sort_direction?: 'asc' | 'desc';
    from_date?: string;
    to_date?: string;
}

// Task statistics response
export interface TaskStats {
    total: number;
    completed: number;
    in_progress: number;
    pending: number;
    cancelled: number;
    overdue: number;
    by_priority: {
        low: number;
        medium: number;
        high: number;
        urgent: number;
    };
}

// Bulk update data interface
export interface BulkUpdateData {
    status?: TaskStatus;
    priority?: TaskPriority;
    assigned_to?: number;
    due_date?: string;
}

// Paginated response interface
export interface PaginatedResponse<T> {
    data: T[];
    total: number;
    page: number;
    limit: number;
    total_pages: number;
}

export const taskService = {
    // Get tasks with filtering, sorting and pagination
    getTasks: async (params?: TaskQueryParams): Promise<PaginatedResponse<Task>> => {
        try {
            const response = await axios.get(`${API_URL}/tasks`, { params });
            return response.data;
        } catch (error) {
            console.error('Error fetching tasks', error);
            throw error;
        }
    },

    // Get a single task
    getTask: async (taskId: number): Promise<Task> => {
        try {
            const response = await axios.get(`${API_URL}/tasks/${taskId}`);
            return response.data;
        } catch (error) {
            console.error(`Error fetching task ${taskId}`, error);
            throw error;
        }
    },

    // Create a new task
    createTask: async (taskData: TaskPayload): Promise<Task> => {
        try {
            const response = await axios.post(`${API_URL}/tasks`, taskData);
            return response.data;
        } catch (error) {
            console.error('Error creating task', error);
            throw error;
        }
    },

    // Update a task
    updateTask: async (taskId: number, taskData: TaskPayload): Promise<Task> => {
        try {
            const response = await axios.put(`${API_URL}/tasks/${taskId}`, taskData);
            return response.data;
        } catch (error) {
            console.error(`Error updating task ${taskId}`, error);
            throw error;
        }
    },

    // Update task status
    updateTaskStatus: async (taskId: number, status: TaskStatus): Promise<Task> => {
        try {
            const response = await axios.patch(`${API_URL}/tasks/${taskId}/status`, { status });
            return response.data;
        } catch (error) {
            console.error(`Error updating task ${taskId} status`, error);
            throw error;
        }
    },

    // Update task priority
    updateTaskPriority: async (taskId: number, priority: TaskPriority): Promise<Task> => {
        try {
            const response = await axios.patch(`${API_URL}/tasks/${taskId}/priority`, { priority });
            return response.data;
        } catch (error) {
            console.error(`Error updating task ${taskId} priority`, error);
            throw error;
        }
    },

    // Delete a task
    deleteTask: async (taskId: number): Promise<boolean> => {
        try {
            await axios.delete(`${API_URL}/tasks/${taskId}`);
            return true;
        } catch (error) {
            console.error(`Error deleting task ${taskId}`, error);
            throw error;
        }
    },

    // Bulk update tasks
    bulkUpdateTasks: async (taskIds: number[], updateData: BulkUpdateData): Promise<Task[]> => {
        try {
            const response = await axios.post(`${API_URL}/tasks/bulk-update`, {
                task_ids: taskIds,
                ...updateData
            });
            return response.data;
        } catch (error) {
            console.error('Error bulk updating tasks', error);
            throw error;
        }
    },

    // Get task statistics
    getTaskStats: async (): Promise<TaskStats> => {
        try {
            const response = await axios.get(`${API_URL}/tasks-stats`);
            return response.data;
        } catch (error) {
            console.error('Error fetching task statistics', error);
            throw error;
        }
    }
};

export default taskService;
