const API_BASE = 'http://localhost:5000/api';

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    'Authorization': token ? `Bearer ${token}` : '',
  };
};

// Data transformers
export const mapDbToForm = (dbRecord: any) => {
  if (!dbRecord) return {};
  
  console.log('Mapping supplier DB record:', dbRecord);
  
  return {
    id: dbRecord.id,
    code: dbRecord.code || '',
    name: dbRecord.name || '',
    contactPerson: dbRecord.contact_person || '',
    email: dbRecord.email || '',
    phone: dbRecord.phone || '',
    address: dbRecord.address || '',
    category: dbRecord.category || 'Material',
    rating: dbRecord.rating !== undefined ? Number(dbRecord.rating) : 0,
    isActive: dbRecord.is_active === 1,
    notes: dbRecord.notes || '',
    
    // Keep snake_case versions for direct access if needed
    contact_person: dbRecord.contact_person,
    is_active: dbRecord.is_active,
  };
};

export const mapFormToDb = (formValues: any) => {
  return {
    code: formValues.code,
    name: formValues.name,
    contactPerson: formValues.contactPerson,
    email: formValues.email,
    phone: formValues.phone,
    address: formValues.address,
    category: formValues.category,
    rating: formValues.rating ? parseInt(formValues.rating) : 0,
    isActive: formValues.isActive,
    notes: formValues.notes,
  };
};

// API functions
export const fetchSuppliers = async (): Promise<any[]> => {
  try {
    console.log('Fetching suppliers from:', `${API_BASE}/suppliers`);
    
    const response = await fetch(`${API_BASE}/suppliers`, {
      headers: getAuthHeaders(),
    });
    
    console.log('Response status:', response.status);
    
    if (!response.ok) {
      throw new Error('Failed to fetch suppliers');
    }
    
    const data = await response.json();
    console.log('Suppliers data received:', data);
    
    if (data.suppliers && data.suppliers.length > 0) {
      // Map each record
      return data.suppliers.map(mapDbToForm);
    }
    
    return [];
  } catch (error) {
    console.error('Fetch suppliers error:', error);
    throw error;
  }
};

export const addSupplier = async (values: any) => {
  try {
    const dbData = mapFormToDb(values);
    console.log('Adding supplier:', dbData);
    
    const response = await fetch(`${API_BASE}/suppliers`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(dbData),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to add supplier');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Add supplier error:', error);
    throw error;
  }
};

export const updateSupplier = async (id: number, values: any) => {
  try {
    const dbData = mapFormToDb(values);
    console.log('Updating supplier:', id, dbData);
    
    const response = await fetch(`${API_BASE}/suppliers/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(dbData),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to update supplier');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Update supplier error:', error);
    throw error;
  }
};

export const deleteSupplier = async (id: number) => {
  try {
    console.log('Deleting supplier:', id);
    
    const response = await fetch(`${API_BASE}/suppliers/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    
    if (!response.ok) {
      throw new Error('Failed to delete supplier');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Delete supplier error:', error);
    throw error;
  }
};

export const getSupplierStats = async () => {
  try {
    const response = await fetch(`${API_BASE}/suppliers/stats/summary`, {
      headers: getAuthHeaders(),
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch supplier stats');
    }
    
    const data = await response.json();
    return data.stats || {};
  } catch (error) {
    console.error('Get stats error:', error);
    return {
      total_suppliers: 0,
      active_suppliers: 0,
      total_categories: 0,
      top_rated_suppliers: 0,
      average_rating: 0
    };
  }
};

export const getSuppliersByCategory = async (category: string) => {
  const response = await fetch(`${API_BASE}/suppliers/category/${encodeURIComponent(category)}`, {
    headers: getAuthHeaders(),
  });
  
  if (!response.ok) {
    throw new Error('Failed to fetch suppliers by category');
  }
  
  const data = await response.json();
  return data.suppliers || [];
};

export const getActiveSuppliers = async () => {
  const response = await fetch(`${API_BASE}/suppliers/active`, {
    headers: getAuthHeaders(),
  });
  
  if (!response.ok) {
    throw new Error('Failed to fetch active suppliers');
  }
  
  const data = await response.json();
  return data.suppliers || [];
};

export const searchSuppliers = async (query: string) => {
  const response = await fetch(`${API_BASE}/suppliers/search/${encodeURIComponent(query)}`, {
    headers: getAuthHeaders(),
  });
  
  if (!response.ok) {
    throw new Error('Failed to search suppliers');
  }
  
  const data = await response.json();
  return data.suppliers || [];
};