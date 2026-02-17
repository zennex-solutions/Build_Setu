import React, { useState } from "react";
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

  onAdd?: (values: any) => any;
  onEdit?: (values: any) => any;
  onDelete?: (id: number) => void;
  onView?: (item: any) => void;
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
}) => {
  const [data, setData] = useState(initialData);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [mode, setMode] = useState<'add' | 'edit' | 'view'>('add');
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [selectedForDelete, setSelectedForDelete] = useState<any>(null);
  const [searchText, setSearchText] = useState('');

  const getFormTitle = () => {
    const action = mode === 'add' ? 'Add' : mode === 'edit' ? 'Edit' : 'View';
    return `${action} ${title}`;
  };

  const gridRef = useRef<any>(null);

  const defaultActionTemplate = (rowData: any) => (
    <div className="flex justify-center gap-2">
      <button
        onClick={() => { 
          setSelectedItem(rowData); 
          setMode("view"); 
          setDialogOpen(true); 
        }}
        className="text-blue-600 text-xs"
      >
        View
      </button>
      <button
        onClick={() => { 
          setSelectedItem(rowData); 
          setMode("edit"); 
          setDialogOpen(true); 
        }}
        className="text-green-600 text-xs"
      >
        Edit
      </button>
      <button
        onClick={() => { 
          setSelectedForDelete(rowData); 
          setDeleteDialogOpen(true); 
        }}
        className="text-red-600 text-xs"
      >
        Delete
      </button>
    </div>
  );

  const handleSubmit = (values: any) => {
    if (mode === 'add') {
      const newItem = { ...values, id: Date.now() };
      setData(prev => [...prev, newItem]);
      onAdd?.(newItem);
    } else if (mode === 'edit' && selectedItem) {
      const updatedItem = { ...selectedItem, ...values };
      setData(prev => prev.map(item => 
        item.id === selectedItem.id ? updatedItem : item
      ));
      onEdit?.(updatedItem);
    }
    setDialogOpen(false);
    setSelectedItem(null);
  };

  const handleCancel = () => {
    console.log("Cancel clicked - closing dialog");
    setDialogOpen(false);
    setSelectedItem(null);
  };

  const handleDelete = () => {
    if (selectedForDelete) {
      setData(prev => prev.filter(item => item.id !== selectedForDelete.id));
      onDelete?.(selectedForDelete.id);
      setDeleteDialogOpen(false);
      setSelectedForDelete(null);
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
                  setSelectedItem(null);
                  setMode('add');
                  setDialogOpen(true);
                }}
                className="bg-[var(--bs-primary)] hover:bg-[#162b4a] text-white px-4 py-2 rounded-lg"
              >
                + Add
              </button>

              <button
                onClick={() => gridRef?.current?.excelExport()}
                className="border px-4 py-2 rounded-lg hover:bg-gray-50"
              >
                Export
              </button>

              <button
                onClick={() => gridRef?.current?.print()}
                className="border px-4 py-2 rounded-lg hover:bg-gray-50"
              >
                Print
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
              className="border px-3 py-2 rounded-lg w-64"
            />
          </div>
        </div>

        {/* Data Grid */}
        <div className="p-3 md:p-4">
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

      {/* Simple Modal for CRUD Form */}
      {dialogOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={(e) => {
            // Close only if clicking the backdrop
            if (e.target === e.currentTarget) {
              handleCancel();
            }
          }}
        >
          <div className="bg-white rounded-lg w-3/4 max-w-4xl max-h-[90vh] overflow-auto">
            <div className="p-4 border-b flex justify-between items-center sticky top-0 bg-white">
              <h2 className="text-xl font-semibold">{getFormTitle()}</h2>
              <button 
                onClick={handleCancel}
                className="text-gray-500 hover:text-gray-700 text-2xl"
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

      {/* Simple Modal for Delete Confirmation */}
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
                className="px-4 py-2 border rounded hover:bg-gray-50"
                onClick={() => {
                  setDeleteDialogOpen(false);
                  setSelectedForDelete(null);
                }}
                type="button"
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
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