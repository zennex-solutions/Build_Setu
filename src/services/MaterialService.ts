const API_BASE = 'http://localhost:5000/api';

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    'Authorization': token ? `Bearer ${token}` : '',
  };
};

// Data transformers
export const mapDbToForm = (dbRecord: any, supplierMap: Record<number, string>) => {
  if (!dbRecord) return {};
  
  console.log('Mapping material DB record:', {
    id: dbRecord.id,
    name: dbRecord.name,
    supplier_id: dbRecord.supplier_id,
    supplier_name: dbRecord.supplier_name
  });
  
  return {
    id: dbRecord.id,
    code: dbRecord.code || '',
    name: dbRecord.name || '',
    category: dbRecord.category || '',
    unit: dbRecord.unit || '',
    unitPrice: dbRecord.unit_price !== undefined ? Number(dbRecord.unit_price) : 0,
    quantity: dbRecord.quantity !== undefined ? Number(dbRecord.quantity) : 0,
    minQuantity: dbRecord.min_quantity !== undefined ? Number(dbRecord.min_quantity) : 0,
    maxQuantity: dbRecord.max_quantity !== undefined ? Number(dbRecord.max_quantity) : 0,
    supplier_id: dbRecord.supplier_id,
    supplier_name: supplierMap[dbRecord.supplier_id] || dbRecord.supplier_name || 'No Supplier',
    supplierContact: dbRecord.supplier_contact || '',
    location: dbRecord.location || '',
    description: dbRecord.description || '',
    isActive: dbRecord.is_active === 1,
    
    // Keep snake_case for grid
    unit_price: dbRecord.unit_price,
    min_quantity: dbRecord.min_quantity,
    max_quantity: dbRecord.max_quantity,
    supplier_contact: dbRecord.supplier_contact,
    is_active: dbRecord.is_active,
  };
};

export const mapFormToDb = (formValues: any) => {
  console.log('Mapping form values to DB:', formValues);
  
  return {
    code: formValues.code,
    name: formValues.name,
    category: formValues.category,
    unit: formValues.unit,
    unitPrice: formValues.unitPrice ? parseFloat(formValues.unitPrice) : 0,
    quantity: formValues.quantity ? parseFloat(formValues.quantity) : 0,
    minQuantity: formValues.minQuantity ? parseFloat(formValues.minQuantity) : 0,
    maxQuantity: formValues.maxQuantity ? parseFloat(formValues.maxQuantity) : 0,
    supplier_id: formValues.supplier_id, // This should be a number (1,2,3,etc.)
    supplierContact: formValues.supplierContact || null,
    location: formValues.location || null,
    description: formValues.description || null,
    isActive: formValues.isActive === undefined ? true : formValues.isActive,
  };
};

// API functions
export const fetchMaterials = async (): Promise<any[]> => {
  try {
    console.log('Fetching from:', `${API_BASE}/materials`);
    
    const response = await fetch(`${API_BASE}/materials`, {
      headers: getAuthHeaders(),
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch materials');
    }
    
    const data = await response.json();
    return data.materials || [];
  } catch (error) {
    console.error('Fetch error:', error);
    throw error;
  }
};

export const addMaterial = async (values: any) => {
  const dbData = mapFormToDb(values);
  const response = await fetch(`${API_BASE}/materials`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(dbData),
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to add material');
  }
  
  return await response.json();
};

export const updateMaterial = async (id: number, values: any) => {
  try {
    const dbData = mapFormToDb(values);
    console.log('=== UPDATE MATERIAL DEBUG ===');
    console.log('Material ID:', id);
    console.log('Form values received:', values);
    console.log('Mapped DB data:', dbData);
    console.log('Request URL:', `${API_BASE}/materials/${id}`);
    console.log('Auth headers:', getAuthHeaders());
    
    const response = await fetch(`${API_BASE}/materials/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(dbData),
    });
    
    console.log('Response status:', response.status);
    console.log('Response ok:', response.ok);
    
    const responseData = await response.json();
    console.log('Server response:', responseData);
    
    if (!response.ok) {
      throw new Error(responseData.message || `Failed to update material (Status: ${response.status})`);
    }
    
    return responseData;
  } catch (error) {
    console.error('Update material error details:', error);
    throw error;
  }
};

export const deleteMaterial = async (id: number) => {
  const response = await fetch(`${API_BASE}/materials/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });
  
  if (!response.ok) {
    throw new Error('Failed to delete material');
  }
  
  return await response.json();
};

export const getMaterialStats = async () => {
  const response = await fetch(`${API_BASE}/materials/stats/summary`, {
    headers: getAuthHeaders(),
  });
  
  if (!response.ok) {
    throw new Error('Failed to fetch material stats');
  }
  
  const data = await response.json();
  return data.stats;
};