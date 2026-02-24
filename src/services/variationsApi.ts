const API_URL = 'http://localhost:5000/api';

class VariationsApiService {
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

  // Get all variations
  async getVariations() {
    try {
      const data = await this.request('/variations');
      console.log('📊 Variations data received:', data);
      return data.variations || [];
    } catch (error) {
      console.error('❌ Error in getVariations:', error);
      throw error;
    }
  }

  // Get single variation
  async getVariation(id: number) {
    const data = await this.request(`/variations/${id}`);
    return data.variation;
  }

  // Create variation
  async createVariation(variationData: any) {
    console.log('📝 Creating variation with data:', variationData);
    const data = await this.request('/variations', {
      method: 'POST',
      body: JSON.stringify(variationData),
    });
    return data.variation || data;
  }

  // Update variation
  async updateVariation(id: number, variationData: any) {
    console.log('✏️ Updating variation', id, 'with data:', variationData);
    const data = await this.request(`/variations/${id}`, {
      method: 'PUT',
      body: JSON.stringify(variationData),
    });
    return data.variation || data;
  }

  // Delete variation
  async deleteVariation(id: number) {
    const data = await this.request(`/variations/${id}`, {
      method: 'DELETE',
    });
    return data;
  }

  // Get variation stats
  async getVariationStats() {
    const data = await this.request('/variations/stats/summary');
    return data.stats;
  }

  // Get variations by project ID
  async getVariationsByProject(projectId: number) {
    const data = await this.request(`/variations/project/${projectId}`);
    return data.variations || [];
  }

  // Get variations by status
  async getVariationsByStatus(status: string) {
    const data = await this.request(`/variations/status/${status}`);
    return data.variations || [];
  }

  // Approve variation
  async approveVariation(id: number, approvedBy: string = 'Admin') {
    const data = await this.request(`/variations/${id}/approve`, {
      method: 'PATCH',
      body: JSON.stringify({ approvedBy }),
    });
    return data;
  }

  // Reject variation
  async rejectVariation(id: number, rejectedBy: string = 'Admin', reason: string = '') {
    const data = await this.request(`/variations/${id}/reject`, {
      method: 'PATCH',
      body: JSON.stringify({ rejectedBy, reason }),
    });
    return data;
  }
}

export default new VariationsApiService();