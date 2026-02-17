import React, { useEffect, useState } from 'react';

export type FieldType = 'text' | 'number' | 'checkbox' | 'select' | 'textarea' | 'date';

export interface Field {
  name: string;
  label: string;
  type: FieldType;
  options?: string[];
  spanFull?: boolean;
}

export interface CrudFormProps {
  mode: 'add' | 'edit' | 'view';
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

  useEffect(() => {
    setFormValues(initialValues);
  }, [initialValues]);

  const handleChange = (name: string, value: any) => {
    setFormValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSubmit) {
      onSubmit(formValues);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      
      <div className="pt-6 pb-6 px-6 md:px-8 md:pb-8 h-full flex flex-col">
        
        {/* Form fields in 2-column grid with extra top margin */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6">
          {fields.map((field) => (
            <div 
              key={field.name} 
              className={field.spanFull || field.type === 'textarea' ? "md:col-span-2" : ""}
            >
              <label className="block mb-2.5 font-medium text-gray-700 text-sm md:text-base">
                {field.label}
              </label>
              
              {field.type === 'text' || field.type === 'number' || field.type === 'date' ? (
                <input
                  type={field.type === 'date' ? 'date' : field.type}
                  value={formValues[field.name] || ''}
                  onChange={(e) => handleChange(field.name, e.target.value)}
                  disabled={mode === 'view'}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--bs-primary)] focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                />
              ) : field.type === 'checkbox' ? (
                <div className="flex items-center h-12">
                  <input
                    type="checkbox"
                    checked={!!formValues[field.name]}
                    onChange={(e) => handleChange(field.name, e.target.checked)}
                    disabled={mode === 'view'}
                    className="h-5 w-5 text-[var(--bs-primary)] rounded focus:ring-[var(--bs-primary)] disabled:opacity-50"
                  />
                  {mode === 'view' && (
                    <span className="ml-3 text-gray-600">
                      {formValues[field.name] ? 'Yes' : 'No'}
                    </span>
                  )}
                </div>
              ) : field.type === 'select' ? (
                <div className="relative">
                  <select
                    value={formValues[field.name] || ''}
                    onChange={(e) => handleChange(field.name, e.target.value)}
                    disabled={mode === 'view'}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--bs-primary)] focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed appearance-none bg-white"
                  >
                    <option value="">Select {field.label}</option>
                    {field.options?.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-700">
                    <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                      <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                    </svg>
                  </div>
                </div>
              ) : field.type === 'textarea' ? (
                <textarea
                  value={formValues[field.name] || ''}
                  onChange={(e) => handleChange(field.name, e.target.value)}
                  disabled={mode === 'view'}
                  rows={field.spanFull ? 5 : 3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--bs-primary)] focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed resize-none"
                />
              ) : null}
            </div>
          ))}
        </div>

        {/* Action buttons */}
        {mode !== 'view' && (
          <div className="flex justify-center gap-4 mt-8 pt-8 border-t border-gray-200">
            <button
              type="submit"
              className="px-8 py-3 bg-[var(--bs-primary)] text-white rounded-lg hover:bg-[#162b4a] transition-colors font-medium min-w-[120px]"
            >
              {mode === 'add' ? 'Save' : 'Update'}
            </button>
            {onCancel && (
              <button
                type="button"
                onClick={onCancel}
                className="px-8 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium min-w-[120px]"
              >
                Cancel
              </button>
            )}
          </div>
        )}
        
        {mode === 'view' && onCancel && (
          <div className="flex justify-center mt-8 pt-8 border-t border-gray-200">
            <button
              type="button"
              onClick={onCancel}
              className="px-8 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium min-w-[120px]"
            >
              Close
            </button>
          </div>
        )}
      </div>
    </form>
  );
};

export default CrudForm;