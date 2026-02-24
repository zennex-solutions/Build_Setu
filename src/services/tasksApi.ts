const API_URL = 'http://localhost:5000/api';

class TasksApiService {
  private getToken(): string | null {
    return localStorage.getItem('token');
  }

  private async request(endpoint: string, options: RequestInit = {}) {
    const token = this.getToken();
    
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` }),
      ...options.headers,
    };

    try {
      console.log(`🌐 Making request to: ${API_URL}${endpoint}`);
      
      const response = await fetch(`${API_URL}${endpoint}`, {
        ...options,
        headers,
      });

      const data = await response.json();
      console.log(`📦 Response from ${endpoint}:`, data);

      if (!response.ok) {
        if (response.status === 401) {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          window.location.href = '/';
        }
        throw new Error(data.message || 'Request failed');
      }

      return data;
    } catch (error) {
      console.error('❌ API request failed:', error);
      throw error;
    }
  }

  // Get all tasks with project details
  async getTasks() {
    const data = await this.request('/tasks');
    return data.tasks || [];
  }

  // Get single task
  async getTask(id: number) {
    const data = await this.request(`/tasks/${id}`);
    return data.task;
  }

  // Create task
  async createTask(taskData: any) {
    const data = await this.request('/tasks', {
      method: 'POST',
      body: JSON.stringify(taskData),
    });
    return data.task || data;
  }

  // Update task
  async updateTask(id: number, taskData: any) {
    const data = await this.request(`/tasks/${id}`, {
      method: 'PUT',
      body: JSON.stringify(taskData),
    });
    return data.task || data;
  }

  // Delete task
  async deleteTask(id: number) {
    const data = await this.request(`/tasks/${id}`, {
      method: 'DELETE',
    });
    return data;
  }

  // Get task stats
  async getTaskStats() {
    const data = await this.request('/tasks/stats/summary');
    return data.stats;
  }

  // Get tasks by project ID
  async getTasksByProject(projectId: number) {
    const data = await this.request(`/tasks/project/${projectId}`);
    return data.tasks || [];
  }

  // Get tasks by assignee
  async getTasksByAssignee(assignee: string) {
    const data = await this.request(`/tasks/assigned/${encodeURIComponent(assignee)}`);
    return data.tasks || [];
  }

  // Bulk update task status
  async bulkUpdateStatus(taskIds: number[], status: string) {
    const data = await this.request('/tasks/bulk/status', {
      method: 'PATCH',
      body: JSON.stringify({ taskIds, status }),
    });
    return data;
  }
}

export default new TasksApiService();