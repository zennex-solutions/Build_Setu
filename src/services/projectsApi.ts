const API_URL = 'http://localhost:5000/api';

class ProjectsApiService {
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
      console.log(`Making request to: ${API_URL}${endpoint}`);
      
      const response = await fetch(`${API_URL}${endpoint}`, {
        ...options,
        headers,
      });

      // Check if response is OK
      if (!response.ok) {
        if (response.status === 401) {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          window.location.href = '/';
          throw new Error('Session expired. Please login again.');
        }
        
        // Try to get error message from response
        const text = await response.text();
        try {
          const errorData = JSON.parse(text);
          throw new Error(errorData.message || `Request failed with status ${response.status}`);
        } catch (e) {
          throw new Error(`Request failed with status ${response.status}: ${text.substring(0, 100)}`);
        }
      }

      // Parse JSON response
      const text = await response.text();
      try {
        const data = JSON.parse(text);
        return data;
      } catch (e) {
        console.error('Invalid JSON response:', text.substring(0, 200));
        throw new Error('Server returned invalid JSON. Please check if the endpoint exists.');
      }
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Get all projects
  async getProjects() {
    try {
      const data = await this.request('/projects');
      return data.projects || [];
    } catch (error) {
      console.error('Error fetching projects:', error);
      throw error;
    }
  }

  // Get single project
  async getProject(id: number) {
    const data = await this.request(`/projects/${id}`);
    return data.project;
  }

  // Create project
  async createProject(projectData: any) {
    const data = await this.request('/projects', {
      method: 'POST',
      body: JSON.stringify(projectData),
    });
    return data;
  }

  // Update project
  async updateProject(id: number, projectData: any) {
    const data = await this.request(`/projects/${id}`, {
      method: 'PUT',
      body: JSON.stringify(projectData),
    });
    return data;
  }

  // Delete project
  async deleteProject(id: number) {
    const data = await this.request(`/projects/${id}`, {
      method: 'DELETE',
    });
    return data;
  }

  // Get project stats
  async getProjectStats() {
    const data = await this.request('/projects/stats/summary');
    return data.stats;
  }
}

export default new ProjectsApiService();