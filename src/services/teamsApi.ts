const API_URL = 'http://localhost:5000/api';

class TeamsApiService {
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

  // Get all teams with project details
  async getTeams() {
    const data = await this.request('/teams');
    return data.teams || [];
  }

  // Get single team
  async getTeam(id: number) {
    const data = await this.request(`/teams/${id}`);
    return data.team;
  }

  // Create team
  async createTeam(teamData: any) {
    const data = await this.request('/teams', {
      method: 'POST',
      body: JSON.stringify(teamData),
    });
    return data.team || data;
  }

  // Update team
  async updateTeam(id: number, teamData: any) {
    const data = await this.request(`/teams/${id}`, {
      method: 'PUT',
      body: JSON.stringify(teamData),
    });
    return data.team || data;
  }

  // Delete team
  async deleteTeam(id: number) {
    const data = await this.request(`/teams/${id}`, {
      method: 'DELETE',
    });
    return data;
  }

  // Get team stats
  async getTeamStats() {
    const data = await this.request('/teams/stats/summary');
    return data.stats;
  }

  // Get teams by project ID
  async getTeamsByProject(projectId: number) {
    const data = await this.request(`/teams/project/${projectId}`);
    return data.teams || [];
  }

  // Get teams by status
  async getTeamsByStatus(status: string) {
    const data = await this.request(`/teams/status/${status}`);
    return data.teams || [];
  }

  // Get teams by trade
  async getTeamsByTrade(trade: string) {
    const data = await this.request(`/teams/trade/${trade}`);
    return data.teams || [];
  }
}

export default new TeamsApiService();