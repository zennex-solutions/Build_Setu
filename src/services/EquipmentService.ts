const API_BASE = 'http://localhost:5000/api';

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    'Authorization': token ? `Bearer ${token}` : '',
  };
};

// Data transformers
export const mapDbToForm = (
  dbRecord: any, 
  supplierMap: Record<number, string>,
  projectMap: Record<number, string>
) => {
  if (!dbRecord) return {};
  
  console.log('Mapping equipment DB record:', {
    id: dbRecord.id,
    name: dbRecord.name,
    supplier_id: dbRecord.supplier_id,
    supplier_name: dbRecord.supplier_name,
    project_id: dbRecord.project_id,
    project_name: dbRecord.project_name
  });
  
  return {
    id: dbRecord.id,
    name: dbRecord.name || '',
    category: dbRecord.category || '',
    quantity: dbRecord.quantity || 1,
    ownershipType: dbRecord.ownership_type || 'Owned',
    rateType: dbRecord.rate_type || '',
    price: dbRecord.price || 0,
    status: dbRecord.status || 'Available',
    supplier_id: dbRecord.supplier_id,
    supplier_name: supplierMap[dbRecord.supplier_id] || dbRecord.supplier_name || 'No Supplier',
    project_id: dbRecord.project_id,
    project_name: projectMap[dbRecord.project_id] || dbRecord.project_name || 'No Project',
    description: dbRecord.description || '',
    
    // Keep original field names
    ownership_type: dbRecord.ownership_type,
    rate_type: dbRecord.rate_type,
    assigned_project: dbRecord.project_name,
  };
};

export const mapFormToDb = (formValues: any) => {
  return {
    name: formValues.name,
    category: formValues.category,
    quantity: parseInt(formValues.quantity) || 1,
    ownershipType: formValues.ownershipType,
    rateType: formValues.rateType,
    price: parseFloat(formValues.price) || 0,
    status: formValues.status,
    supplier_id: formValues.supplier_id,
    project_id: formValues.project_id,
    description: formValues.description,
  };
};

// API functions
export const fetchEquipment = async (): Promise<any[]> => {
  try {
    console.log('Fetching equipment from:', `${API_BASE}/equipment`);
    
    const response = await fetch(`${API_BASE}/equipment`, {
      headers: getAuthHeaders(),
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch equipment');
    }
    
    const data = await response.json();
    return data.equipment || [];
  } catch (error) {
    console.error('Fetch error:', error);
    throw error;
  }
};

export const addEquipment = async (values: any) => {
  const dbData = mapFormToDb(values);
  console.log('Adding equipment with data:', dbData);
  
  const response = await fetch(`${API_BASE}/equipment`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(dbData),
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to add equipment');
  }
  
  return await response.json();
};

export const updateEquipment = async (id: number, values: any) => {
  const dbData = mapFormToDb(values);
  console.log('Updating equipment:', id, dbData);
  
  const response = await fetch(`${API_BASE}/equipment/${id}`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(dbData),
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to update equipment');
  }
  
  return await response.json();
};

export const deleteEquipment = async (id: number) => {
  const response = await fetch(`${API_BASE}/equipment/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });
  
  if (!response.ok) {
    throw new Error('Failed to delete equipment');
  }
  
  return await response.json();
};

export const getEquipmentStats = async () => {
  const response = await fetch(`${API_BASE}/equipment/stats/summary`, {
    headers: getAuthHeaders(),
  });
  
  if (!response.ok) {
    throw new Error('Failed to fetch equipment stats');
  }
  
  const data = await response.json();
  return data.stats || {};
};

export const getEquipmentByProject = async (projectId: number) => {
  const response = await fetch(`${API_BASE}/equipment/project/${projectId}`, {
    headers: getAuthHeaders(),
  });
  
  if (!response.ok) {
    throw new Error('Failed to fetch equipment by project');
  }
  
  const data = await response.json();
  return data.equipment || [];
};

export const getEquipmentBySupplier = async (supplierId: number) => {
  const response = await fetch(`${API_BASE}/equipment/supplier/${supplierId}`, {
    headers: getAuthHeaders(),
  });
  
  if (!response.ok) {
    throw new Error('Failed to fetch equipment by supplier');
  }
  
  const data = await response.json();
  return data.equipment || [];
};