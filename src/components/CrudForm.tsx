import React, { useState } from 'react';

export type FieldType = 'text' | 'number' | 'checkbox' | 'select' | 'textarea';

export interface Field {
  name: string;
  label: string;
  type: FieldType;
  options?: string[]; // For select dropdown
}

export interface CrudFormProps {
  mode: 'add' | 'edit' | 'view'; // view mode is read-only
  fields: Field[];
  initialValues?: Record<string, any>;
  onSubmit?: (values: Record<string, any>) => void;
  onCancel?: () => void;
}

const CrudForm: React.FC<CrudFormProps> = ({
  mode,
  fields,
  initialValues = {},
  onSubmit,
  onCancel,
}) => {
  const [formValues, setFormValues] = useState<Record<string, any>>(initialValues);

  const handleChange = (name: string, value: any) => {
    setFormValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit?.(formValues);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 border rounded">
      {fields.map((field) => (
        <div key={field.name} className="flex flex-col">
          <label className="mb-1 font-semibold">{field.label}</label>
          {field.type === 'text' || field.type === 'number' ? (
            <input
              type={field.type}
              value={formValues[field.name] || ''}
              onChange={(e) => handleChange(field.name, e.target.value)}
              disabled={mode === 'view'}
              className="border px-2 py-1 rounded"
            />
          ) : field.type === 'checkbox' ? (
            <input
              type="checkbox"
              checked={!!formValues[field.name]}
              onChange={(e) => handleChange(field.name, e.target.checked)}
              disabled={mode === 'view'}
            />
          ) : field.type === 'select' ? (
            <select
              value={formValues[field.name] || ''}
              onChange={(e) => handleChange(field.name, e.target.value)}
              disabled={mode === 'view'}
              className="border px-2 py-1 rounded"
            >
              <option value="">Select</option>
              {field.options?.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          ) : field.type === 'textarea' ? (
            <textarea
              value={formValues[field.name] || ''}
              onChange={(e) => handleChange(field.name, e.target.value)}
              disabled={mode === 'view'}
              className="border px-2 py-1 rounded"
            />
          ) : null}
        </div>
      ))}

      {mode !== 'view' && (
        <div className="flex space-x-2 mt-4">
          <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
            {mode === 'add' ? 'Add' : 'Update'}
          </button>
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="bg-gray-300 text-black px-4 py-2 rounded"
            >
              Cancel
            </button>
          )}
        </div>
      )}
    </form>
  );
};

export default CrudForm;
