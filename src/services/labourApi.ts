const API_URL = 'http://localhost:5000/api';

class LabourApiService {
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
      console.log('Request options:', options);
      
      const response = await fetch(`${API_URL}${endpoint}`, {
        ...options,
        headers,
      });

      const responseText = await response.text();
      console.log('Response status:', response.status);
      console.log('Response text:', responseText.substring(0, 200));

      if (!response.ok) {
        if (response.status === 401) {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          window.location.href = '/';
          throw new Error('Session expired. Please login again.');
        }
        
        try {
          const errorData = JSON.parse(responseText);
          throw new Error(errorData.message || `Request failed with status ${response.status}`);
        } catch (e) {
          throw new Error(`Request failed with status ${response.status}: ${responseText.substring(0, 100)}`);
        }
      }

      try {
        const data = JSON.parse(responseText);
        return data;
      } catch (e) {
        console.error('Invalid JSON response:', responseText.substring(0, 200));
        throw new Error('Server returned invalid JSON');
      }
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Create labour
  async createLabour(labourData: any) {
    try {
      console.log('Create labour - raw input:', labourData);
      
      // Validate required fields
      if (!labourData.labourId) {
        throw new Error('Labour ID is required');
      }
      if (!labourData.name) {
        throw new Error('Name is required');
      }
      
      // Send data directly - server expects camelCase
      console.log('Sending to server:', labourData);
      
      const data = await this.request('/labour', {
        method: 'POST',
        body: JSON.stringify(labourData),
      });
      
      console.log('Create response:', data);
      return data;
    } catch (error) {
      console.error('Create labour error:', error);
      throw error;
    }
  }

  // Update labour
  async updateLabour(id: number, labourData: any) {
    try {
      console.log('Update labour - raw input:', { id, ...labourData });
      
      // Validate required fields
      if (!labourData.labourId) {
        throw new Error('Labour ID is required');
      }
      if (!labourData.name) {
        throw new Error('Name is required');
      }
      
      // Send data directly - server expects camelCase
      const dataToSend = { ...labourData, id };
      console.log('Sending to server:', dataToSend);
      
      const data = await this.request(`/labour/${id}`, {
        method: 'PUT',
        body: JSON.stringify(dataToSend),
      });
      
      console.log('Update response:', data);
      return data;
    } catch (error) {
      console.error('Update labour error:', error);
      throw error;
    }
  }

  // Get all labour
  async getLabour() {
    try {
      console.log('Fetching all labour...');
      const data = await this.request('/labour');
      console.log('API response:', data);
      
      // The server now returns camelCase fields directly
      return data.labour || [];
    } catch (error) {
      console.error('Error fetching labour:', error);
      throw error;
    }
  }

  // Get single labour
  async getLabourById(id: number) {
    const data = await this.request(`/labour/${id}`);
    return data.labour;
  }

  // Delete labour
  async deleteLabour(id: number) {
    const data = await this.request(`/labour/${id}`, {
      method: 'DELETE',
    });
    return data;
  }

  // Get labour stats
  async getLabourStats() {
    const data = await this.request('/labour/stats/summary');
    return data.stats;
  }

  // Get labour by status
  async getLabourByStatus(status: string) {
    const data = await this.request(`/labour/status/${encodeURIComponent(status)}`);
    return data.labour || [];
  }

  // Get labour by trade
  async getLabourByTrade(trade: string) {
    const data = await this.request(`/labour/trade/${encodeURIComponent(trade)}`);
    return data.labour || [];
  }

  // Get labour by project
  async getLabourByProject(project: string) {
    const data = await this.request(`/labour/project/${encodeURIComponent(project)}`);
    return data.labour || [];
  }

  // Bulk update labour status
  async bulkUpdateStatus(labourIds: number[], status: string) {
    const data = await this.request('/labour/bulk/status', {
      method: 'PATCH',
      body: JSON.stringify({ labourIds, status }),
    });
    return data;
  }
}

export default new LabourApiService();