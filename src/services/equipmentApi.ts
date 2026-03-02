const API_URL = 'http://localhost:5000/api';

class EquipmentApiService {
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

  // Get all equipment
  async getEquipment() {
    const data = await this.request('/equipment');
    return data.equipment || [];
  }

  // Get single equipment
  async getEquipmentItem(id: number) {
    const data = await this.request(`/equipment/${id}`);
    return data.equipment;
  }

  // Create equipment
  async createEquipment(equipmentData: any) {
    const data = await this.request('/equipment', {
      method: 'POST',
      body: JSON.stringify(equipmentData),
    });
    return data.equipment || data;
  }

  // Update equipment
  async updateEquipment(id: number, equipmentData: any) {
    const data = await this.request(`/equipment/${id}`, {
      method: 'PUT',
      body: JSON.stringify(equipmentData),
    });
    return data.equipment || data;
  }

  // Delete equipment
  async deleteEquipment(id: number) {
    const data = await this.request(`/equipment/${id}`, {
      method: 'DELETE',
    });
    return data;
  }

  // Get equipment stats
  async getEquipmentStats() {
    const data = await this.request('/equipment/stats/summary');
    return data.stats;
  }

  // Get equipment by supplier
  async getEquipmentBySupplier(supplierId: number) {
    const data = await this.request(`/equipment/supplier/${supplierId}`);
    return data.equipment || [];
  }

  // Get equipment by status
  async getEquipmentByStatus(status: string) {
    const data = await this.request(`/equipment/status/${status}`);
    return data.equipment || [];
  }
}

export default new EquipmentApiService();