const API_URL = 'http://localhost:5000/api';

class SuppliersApiService {
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

  // Get all suppliers
  async getSuppliers() {
    const data = await this.request('/suppliers');
    return data.suppliers || [];
  }

  // Get single supplier
  async getSupplier(id: number) {
    const data = await this.request(`/suppliers/${id}`);
    return data.supplier;
  }

  // Create supplier
  async createSupplier(supplierData: any) {
    const data = await this.request('/suppliers', {
      method: 'POST',
      body: JSON.stringify(supplierData),
    });
    return data.supplier || data;
  }

  // Update supplier
  async updateSupplier(id: number, supplierData: any) {
    const data = await this.request(`/suppliers/${id}`, {
      method: 'PUT',
      body: JSON.stringify(supplierData),
    });
    return data.supplier || data;
  }

  // Delete supplier
  async deleteSupplier(id: number) {
    const data = await this.request(`/suppliers/${id}`, {
      method: 'DELETE',
    });
    return data;
  }

  // Get supplier stats
  async getSupplierStats() {
    const data = await this.request('/suppliers/stats/summary');
    return data.stats;
  }
}

export default new SuppliersApiService();