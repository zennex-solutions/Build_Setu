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
  
  console.log('Mapping DB record to form:', dbRecord); // Add this for debugging
  
  return {
    id: dbRecord.id,
    code: dbRecord.code || dbRecord.material_code || '', // Try multiple possible field names
    name: dbRecord.name || dbRecord.material_name || '',
    category: dbRecord.category || '',
    unit: dbRecord.unit || '',
    unitPrice: dbRecord.unit_price !== undefined ? Number(dbRecord.unit_price) : 
               dbRecord.unitPrice !== undefined ? Number(dbRecord.unitPrice) : 0,
    quantity: dbRecord.quantity !== undefined ? Number(dbRecord.quantity) : 
              dbRecord.stock !== undefined ? Number(dbRecord.stock) : 0,
    minQuantity: dbRecord.min_quantity !== undefined ? Number(dbRecord.min_quantity) : 
                 dbRecord.minQuantity !== undefined ? Number(dbRecord.minQuantity) : 0,
    maxQuantity: dbRecord.max_quantity !== undefined ? Number(dbRecord.max_quantity) : 
                 dbRecord.maxQuantity !== undefined ? Number(dbRecord.maxQuantity) : 0,
    supplier: dbRecord.supplier || '',
    supplierContact: dbRecord.supplier_contact || dbRecord.supplierContact || '',
    location: dbRecord.location || '',
    description: dbRecord.description || '',
    isActive: dbRecord.is_active === 1 || dbRecord.isActive === true,
  };
};

export const mapFormToDb = (formValues: any) => {
  return {
    code: formValues.code,
    name: formValues.name,
    category: formValues.category,
    unit: formValues.unit,
    unitPrice: formValues.unitPrice ? parseFloat(formValues.unitPrice) : 0,
    quantity: formValues.quantity ? parseFloat(formValues.quantity) : 0,
    minQuantity: formValues.minQuantity ? parseFloat(formValues.minQuantity) : 0,
    maxQuantity: formValues.maxQuantity ? parseFloat(formValues.maxQuantity) : 0,
    supplier: formValues.supplier,
    supplierContact: formValues.supplierContact,
    location: formValues.location,
    description: formValues.description,
    isActive: formValues.isActive,
  };
};

// API functions
export const fetchMaterials = async (): Promise<any[]> => {
  try {
    console.log('Fetching from:', `${API_BASE}/materials`);
    
    const response = await fetch(`${API_BASE}/materials`, {
      headers: getAuthHeaders(),
    });
    
    console.log('Response status:', response.status);
    
    if (!response.ok) {
      throw new Error('Failed to fetch materials');
    }
    
    const data = await response.json();
    console.log('Raw API response:', data);
    
    // Log the first material to see its structure
    if (data.materials && data.materials.length > 0) {
      console.log('First material raw:', data.materials[0]);
      
      // Map each record and log the result
      const mapped = data.materials.map((item: any) => {
        const mapped = mapDbToForm(item);
        console.log('Mapped material:', mapped);
        return mapped;
      });
      
      return mapped;
    }
    
    return [];
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
  const dbData = mapFormToDb(values);
  const response = await fetch(`${API_BASE}/materials/${id}`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(dbData),
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to update material');
  }
  
  return await response.json();
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

export const getLowStockMaterials = async () => {
  const response = await fetch(`${API_BASE}/materials/low-stock`, {
    headers: getAuthHeaders(),
  });
  
  if (!response.ok) {
    throw new Error('Failed to fetch low stock materials');
  }
  
  const data = await response.json();
  return data.materials;
};

export const searchMaterials = async (query: string) => {
  const response = await fetch(`${API_BASE}/materials/search/${encodeURIComponent(query)}`, {
    headers: getAuthHeaders(),
  });
  
  if (!response.ok) {
    throw new Error('Failed to search materials');
  }
  
  const data = await response.json();
  return data.materials;
};