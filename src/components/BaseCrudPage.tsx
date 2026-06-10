import React, { useState, useEffect } from "react";
import CrudForm, { type Field } from "./CrudForm";
import { GridComponent, ColumnsDirective, ColumnDirective, Page, Sort, Filter, Inject, ExcelExport, PdfExport, Group } from "@syncfusion/ej2-react-grids";
import { useRef } from "react";
import { Search } from "@syncfusion/ej2-react-grids";
import { Reorder, Resize } from "@syncfusion/ej2-react-grids";

export interface CrudPageProps {
  title: string;
  description?: string;
  fields: Field[];
  initialData: any[];
  summaryCards?: React.ReactNode;
  quickActions?: React.ReactNode;
  recentActivities?: React.ReactNode;
  gridColumns?: {
    field?: string;
    headerText: string;
    width?: number;
    template?: (props: any) => React.ReactNode;
  }[];
  customColumns?: React.ReactNode;
  statusTemplate?: (props: any) => React.ReactNode;
  actionTemplate?: (props: any) => React.ReactNode;
  onAdd?: (values: any) => Promise<any> | any;
  onEdit?: (values: any) => Promise<any> | any;
  onDelete?: (id: number) => Promise<any> | any;
  onView?: (item: any) => any;
  // Add this prop to refresh data from parent
  onDataChange?: () => Promise<any[]>; // Add this line
}


const BaseCrudPage: React.FC<CrudPageProps> = ({
  title,
  fields,
  initialData,
  summaryCards,
  quickActions,
  recentActivities,
  gridColumns,
  actionTemplate,
  onAdd,
  onEdit,
  onDelete,
  onView,
  onDataChange,
}) => {
  const [data, setData] = useState(initialData);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [mode, setMode] = useState<'add' | 'edit' | 'view'>('add');
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [selectedForDelete, setSelectedForDelete] = useState<any>(null);
  const [searchText, setSearchText] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const gridRef = useRef<any>(null);

  // Sync with parent data when it changes
  useEffect(() => {
    setData(initialData);
  }, [initialData]);

  const getFormTitle = () => {
    const action = mode === 'add' ? 'Add' : mode === 'edit' ? 'Edit' : 'View';
    return `${action} ${title}`;
  };

  const refreshData = async () => {
    if (onDataChange) {
      setIsLoading(true);
      try {
        const newData = await onDataChange();
        setData(newData);
      } catch (error) {
        console.error('Error refreshing data:', error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const defaultActionTemplate = (rowData: any) => (
    <div className="flex justify-center gap-2">
      <button
        onClick={() => { 
          let itemToView = rowData;
          if (onView) {
            itemToView = onView(rowData);
          }
          setSelectedItem(itemToView); 
          setMode("view"); 
          setDialogOpen(true); 
        }}
        className="text-blue-600 hover:text-blue-800 text-xs font-medium"
      >
        View
      </button>
      <button
        onClick={() => { 
          let itemToEdit = rowData;
          if (onView) {
            itemToEdit = onView(rowData);
          }
          setSelectedItem(itemToEdit); 
          setMode("edit"); 
          setDialogOpen(true); 
        }}
        className="text-green-600 hover:text-green-800 text-xs font-medium"
      >
        Edit
      </button>
      <button
        onClick={() => { 
          console.log('Delete clicked for:', rowData);
          setSelectedForDelete(rowData); 
          setDeleteDialogOpen(true); 
        }}
        className="text-red-600 hover:text-red-800 text-xs font-medium"
      >
        Delete
      </button>
    </div>
  );

  const handleSubmit = async (values: any) => {
    console.log('Form submitted with values:', values);
    console.log('Mode:', mode);
    
    try {
      let result;
      
      if (mode === 'add') {
        result = await onAdd?.(values);
        console.log('onAdd result:', result);
      } else if (mode === 'edit' && selectedItem) {
        // Ensure we're passing the ID correctly
        const valuesWithId = { ...values, id: selectedItem.id };
        result = await onEdit?.(valuesWithId);
      }
      
      // Refresh data from server after successful operation
      if (result?.success !== false) {
        await refreshData();
        setDialogOpen(false);
        setSelectedItem(null);
      } else {
        console.log('Operation failed, keeping dialog open');
      }
    } catch (error) {
      console.error('Error in form submission:', error);
    }
  };

  const handleCancel = () => {
    setDialogOpen(false);
    setSelectedItem(null);
  };

  const handleDelete = async () => {
    if (selectedForDelete) {
      console.log('Deleting item:', selectedForDelete);
      try {
        await onDelete?.(selectedForDelete.id);
        await refreshData();
        setDeleteDialogOpen(false);
        setSelectedForDelete(null);
      } catch (error) {
        console.error('Error deleting item:', error);
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      {summaryCards && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {summaryCards}
        </div>
      )}

      {/* Main Content Card */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-4 border-b">
          <div className="flex justify-between items-center flex-wrap gap-3">
            <div className="flex gap-3">
              <button
                onClick={() => {
                  console.log('Add button clicked');
                  setSelectedItem(null);
                  setMode('add');
                  setDialogOpen(true);
                }}
                className="bg-[var(--bs-primary)] hover:bg-[#162b4a] text-white px-4 py-2 rounded-lg transition-colors"
              >
                + Add {title}
              </button>

              <button
                onClick={() => gridRef?.current?.excelExport()}
                className="border px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Export
              </button>

              <button
                onClick={() => gridRef?.current?.print()}
                className="border px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Print
              </button>

              {/* Add refresh button */}
              <button
                onClick={refreshData}
                className="border px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors"
                disabled={isLoading}
              >
                {isLoading ? 'Refreshing...' : 'Refresh'}
              </button>
            </div>

            <input
              type="text"
              placeholder="Search..."
              value={searchText}
              onChange={(e) => {
                setSearchText(e.target.value);
                gridRef.current?.search(e.target.value);
              }}
              className="border px-3 py-2 rounded-lg w-64 focus:outline-none focus:ring-2 focus:ring-[var(--bs-primary)] focus:border-transparent"
            />
          </div>
        </div>

        {/* Data Grid */}
        <div className="p-3 md:p-4">
          {isLoading ? (
            <div className="text-center py-8">Loading...</div>
          ) : (
            <GridComponent
              ref={gridRef}
              dataSource={data}
              allowPaging
              allowSorting
              allowReordering={true} 
              allowResizing
              allowGrouping={true}
              allowFiltering={true}
              filterSettings={{ type: "Excel" }}
              gridLines="Both"
              pageSettings={{ pageSize: 10 }}
              height="auto"
              // Add key to force re-render when data changes
              key={data.length}
            >
              <ColumnsDirective>
                {gridColumns?.map((col) => (
                  <ColumnDirective
                    key={col.field || col.headerText}
                    field={col.field}
                    headerText={col.headerText}
                    width={col.width || 120}
                    template={
                      col.template
                        ? (props: any) => col.template!(props)
                        : undefined
                    }
                  />
                ))}

                <ColumnDirective
                  headerText="Actions"
                  width={160}
                  textAlign="Center"
                  template={(props: any) =>
                    (actionTemplate || defaultActionTemplate)(
                      props.rowData || props
                    )
                  }
                />
              </ColumnsDirective>

              <Inject services={[
                Page,
                Sort,
                Filter,
                ExcelExport,
                PdfExport,
                Search,
                Reorder,
                Resize,
                Group
              ]} />
            </GridComponent>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      {quickActions && (
        <div className="bg-white rounded-lg shadow p-4">
          <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
          {quickActions}
        </div>
      )}

      {/* Recent Activities */}
      {recentActivities && (
        <div className="bg-white rounded-lg shadow p-4">
          <h2 className="text-lg font-semibold mb-4">Recent Activities</h2>
          {recentActivities}
        </div>
      )}

      {/* Modal for CRUD Form */}
      {dialogOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              handleCancel();
            }
          }}
        >
          <div className="bg-white rounded-lg w-3/4 max-w-4xl max-h-[90vh] overflow-auto">
            <div className="relative p-4 border-b bg-[var(--bs-primary)] text-white sticky top-0 flex items-center">
              <div className="flex-1 text-center">
                <h2 className="text-xl font-semibold text-white">{getFormTitle()}</h2>
              </div>
              <button
                onClick={handleCancel}
                className="text-white text-2xl px-2 focus:outline-none"
              >
                ×
              </button>
            </div>

            <div className="p-4">
              <CrudForm
                mode={mode}
                fields={fields}
                initialValues={selectedItem || {}}
                onSubmit={handleSubmit}
                onCancel={handleCancel}
              />
            </div>
          </div>
        </div>
      )}

      {/* Modal for Delete Confirmation */}
      {deleteDialogOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setDeleteDialogOpen(false);
              setSelectedForDelete(null);
            }
          }}
        >
          <div className="bg-white rounded-lg w-96 p-6">
            <h3 className="text-lg font-semibold mb-4">Delete {title}</h3>
            <p className="mb-4">
              Are you sure you want to delete <strong>{selectedForDelete?.name || selectedForDelete?.title || 'this item'}</strong>?
            </p>
            <div className="flex justify-end gap-3">
              <button
                className="px-4 py-2 border rounded hover:bg-gray-50 transition-colors"
                onClick={() => {
                  setDeleteDialogOpen(false);
                  setSelectedForDelete(null);
                }}
                type="button"
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                onClick={handleDelete}
                type="button"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BaseCrudPage;