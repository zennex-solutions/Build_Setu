// import { useState, useEffect } from "react";
// import CrudForm, { type Field } from "../components/CrudForm";
// import {
//   GridComponent,
//   ColumnsDirective,
//   ColumnDirective,
//   Page,
//   Sort,
//   Filter,
//   Inject,
//   Toolbar,
// } from "@syncfusion/ej2-react-grids";
// import { DialogComponent } from "@syncfusion/ej2-react-popups";

// // Labour fields definition
// const labourFields: Field[] = [
//   { name: "labourId", label: "Labour ID", type: "text"},
//   { name: "name", label: "Full Name", type: "text" },
//   { name: "contactNumber", label: "Contact Number", type: "text" },
//   { name: "email", label: "Email", type: "text" },
//   { name: "category", label: "Labour Category", type: "select", 
//     options: ["Skilled", "Semi-skilled", "Unskilled", "Foreman", "Supervisor"] },
//   { name: "trade", label: "Trade/Skill", type: "select", 
//     options: ["Carpenter", "Mason", "Electrician", "Plumber", "Painter", 
//               "Welder", "Helper", "Operator", "Steel Fixer"] },
//   { name: "hourlyRate", label: "Hourly Rate ($)", type: "number"},
//   { name: "dailyRate", label: "Daily Rate ($)", type: "number" },
//   { name: "weeklyRate", label: "Weekly Rate ($)", type: "number" },
//   { name: "contractType", label: "Contract Type", type: "select", 
//     options: ["Daily", "Weekly", "Monthly", "Project-based"] },
//   { name: "aadharNumber", label: "Aadhar Number", type: "text" },
//   { name: "panNumber", label: "PAN Number", type: "text" },
//   { name: "address", label: "Address", type: "textarea" },
//   { name: "emergencyContact", label: "Emergency Contact", type: "text" },
//   { name: "emergencyContactNumber", label: "Emergency Contact Number", type: "text" },
//   { name: "dateOfJoining", label: "Date of Joining", type: "text" },
//   { name: "experience", label: "Experience (Years)", type: "number" },
//   { name: "assignedProject", label: "Assigned Project", type: "text" },
//   { name: "status", label: "Employment Status", type: "select", 
//     options: ["Active", "On Leave", "Terminated", "Inactive"] },
//   { name: "attendanceId", label: "Attendance ID", type: "text" },
//   { name: "bankAccountNumber", label: "Bank Account", type: "text" },
//   { name: "bankName", label: "Bank Name", type: "text" },
//   { name: "ifscCode", label: "IFSC Code", type: "text" },
//   { name: "medicalStatus", label: "Medical Status", type: "select", 
//     options: ["Fit", "Unfit", "Pending"] },
//   { name: "safetyTraining", label: "Safety Training", type: "checkbox" },
//   { name: "insuranceCoverage", label: "Insurance Coverage", type: "checkbox" },
//   { name: "notes", label: "Notes", type: "textarea" },
// ];

// // Sample initial data
// const initialLabour = [
//   { 
//     id: 1, 
//     labourId: "LAB-001", 
//     name: "Rajesh Kumar", 
//     contactNumber: "9876543210",
//     email: "rajesh@example.com",
//     category: "Skilled",
//     trade: "Mason",
//     hourlyRate: 250,
//     dailyRate: 2000,
//     weeklyRate: 12000,
//     contractType: "Daily",
//     aadharNumber: "1234-5678-9012",
//     panNumber: "ABCDE1234F",
//     address: "123 Street, Mumbai",
//     emergencyContact: "Priya Kumar",
//     emergencyContactNumber: "9876543211",
//     dateOfJoining: "2023-01-15",
//     experience: 8,
//     assignedProject: "Residential Tower A",
//     status: "Active",
//     attendanceId: "ATT-001",
//     bankAccountNumber: "123456789012",
//     bankName: "State Bank of India",
//     ifscCode: "SBIN0001234",
//     medicalStatus: "Fit",
//     safetyTraining: true,
//     insuranceCoverage: true,
//     notes: "Expert in brickwork and plastering"
//   },
//   { 
//     id: 2, 
//     labourId: "LAB-002", 
//     name: "Amit Sharma", 
//     contactNumber: "9876543212",
//     email: "amit@example.com",
//     category: "Skilled",
//     trade: "Electrician",
//     hourlyRate: 300,
//     dailyRate: 2400,
//     weeklyRate: 14400,
//     contractType: "Monthly",
//     aadharNumber: "2345-6789-0123",
//     panNumber: "BCDEF2345G",
//     address: "456 Lane, Delhi",
//     emergencyContact: "Rita Sharma",
//     emergencyContactNumber: "9876543213",
//     dateOfJoining: "2023-02-20",
//     experience: 10,
//     assignedProject: "Commercial Complex",
//     status: "Active",
//     attendanceId: "ATT-002",
//     bankAccountNumber: "234567890123",
//     bankName: "HDFC Bank",
//     ifscCode: "HDFC0001234",
//     medicalStatus: "Fit",
//     safetyTraining: true,
//     insuranceCoverage: true,
//     notes: "Specialized in industrial wiring"
//   },
//   { 
//     id: 3, 
//     labourId: "LAB-003", 
//     name: "Vijay Singh", 
//     contactNumber: "9876543214",
//     email: "vijay@example.com",
//     category: "Semi-skilled",
//     trade: "Helper",
//     hourlyRate: 150,
//     dailyRate: 1200,
//     weeklyRate: 7200,
//     contractType: "Daily",
//     aadharNumber: "3456-7890-1234",
//     panNumber: "CDEFG3456H",
//     address: "789 Road, Pune",
//     emergencyContact: "Sunita Singh",
//     emergencyContactNumber: "9876543215",
//     dateOfJoining: "2023-03-10",
//     experience: 3,
//     assignedProject: "Hospital Project",
//     status: "On Leave",
//     attendanceId: "ATT-003",
//     bankAccountNumber: "345678901234",
//     bankName: "ICICI Bank",
//     ifscCode: "ICIC0001234",
//     medicalStatus: "Fit",
//     safetyTraining: true,
//     insuranceCoverage: false,
//     notes: "General helper for material handling"
//   },
//   { 
//     id: 4, 
//     labourId: "LAB-004", 
//     name: "Suresh Patel", 
//     contactNumber: "9876543216",
//     email: "suresh@example.com",
//     category: "Skilled",
//     trade: "Carpenter",
//     hourlyRate: 280,
//     dailyRate: 2240,
//     weeklyRate: 13440,
//     contractType: "Project-based",
//     aadharNumber: "4567-8901-2345",
//     panNumber: "DEFGH4567I",
//     address: "101 Avenue, Bangalore",
//     emergencyContact: "Meena Patel",
//     emergencyContactNumber: "9876543217",
//     dateOfJoining: "2023-04-05",
//     experience: 12,
//     assignedProject: "Residential Tower A",
//     status: "Active",
//     attendanceId: "ATT-004",
//     bankAccountNumber: "456789012345",
//     bankName: "Axis Bank",
//     ifscCode: "UTIB0001234",
//     medicalStatus: "Fit",
//     safetyTraining: true,
//     insuranceCoverage: true,
//     notes: "Expert in formwork and shuttering"
//   },
//   { 
//     id: 5, 
//     labourId: "LAB-005", 
//     name: "Deepak Verma", 
//     contactNumber: "9876543218",
//     email: "deepak@example.com",
//     category: "Skilled",
//     trade: "Welder",
//     hourlyRate: 320,
//     dailyRate: 2560,
//     weeklyRate: 15360,
//     contractType: "Weekly",
//     aadharNumber: "5678-9012-3456",
//     panNumber: "EFGHI5678J",
//     address: "202 Boulevard, Chennai",
//     emergencyContact: "Anita Verma",
//     emergencyContactNumber: "9876543219",
//     dateOfJoining: "2023-05-15",
//     experience: 7,
//     assignedProject: "Steel Plant",
//     status: "Active",
//     attendanceId: "ATT-005",
//     bankAccountNumber: "567890123456",
//     bankName: "Kotak Mahindra",
//     ifscCode: "KKBK0001234",
//     medicalStatus: "Fit",
//     safetyTraining: true,
//     insuranceCoverage: true,
//     notes: "Certified structural welder"
//   },
// ];

// const LabourPage = () => {
//   const [labour, setLabour] = useState(initialLabour);
//   const [selectedItem, setSelectedItem] = useState<any>(null);
//   const [mode, setMode] = useState<'add' | 'edit' | 'view'>('add');
//   const [isDialogOpen, setIsDialogOpen] = useState(false);
//   const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
//   const [selectedForDelete, setSelectedForDelete] = useState<any>(null);
//   const [windowWidth, setWindowWidth] = useState(window.innerWidth);
//   const [filter, setFilter] = useState('all'); // 'all', 'active', 'onLeave', 'terminated'

//   // Track window width for responsive design
//   useEffect(() => {
//     const handleResize = () => {
//       setWindowWidth(window.innerWidth);
//     };
//     window.addEventListener('resize', handleResize);
//     return () => window.removeEventListener('resize', handleResize);
//   }, []);

//   const getDialogWidth = () => {
//     if (windowWidth < 768) return "95vw";
//     if (windowWidth < 1024) return "90vw";
//     return "1000px";
//   };

//   // Filter labour based on status
//   const filteredLabour = filter === 'all' 
//     ? labour 
//     : labour.filter(l => l.status.toLowerCase() === filter.toLowerCase());

//   // Calculate statistics
//   const activeLabour = labour.filter(l => l.status === "Active").length;
//   const onLeaveLabour = labour.filter(l => l.status === "On Leave").length;
//   const skilledLabour = labour.filter(l => l.category === "Skilled").length;
//   const totalMonthlyCost = labour.reduce((sum, l) => {
//     const dailyCost = l.dailyRate || l.hourlyRate * 8;
//     const monthlyCost = dailyCost * 26; // Approx working days
//     return sum + (l.status === "Active" ? monthlyCost : 0);
//   }, 0);

//   const openAdd = () => {
//     setMode('add');
//     setSelectedItem(null);
//     setIsDialogOpen(true);
//   };

//   const openEdit = (labourItem: any) => {
//     setMode('edit');
//     setSelectedItem(labourItem);
//     setIsDialogOpen(true);
//   };

//   const openView = (labourItem: any) => {
//     setMode('view');
//     setSelectedItem(labourItem);
//     setIsDialogOpen(true);
//   };

//   const openDelete = (labourItem: any) => {
//     setSelectedForDelete(labourItem);
//     setDeleteDialogOpen(true);
//   };

//   const handleSubmit = (values: any) => {
//     if (mode === 'add') {
//       const newLabour = {
//         ...values,
//         id: Date.now(),
//         safetyTraining: values.safetyTraining || false,
//         insuranceCoverage: values.insuranceCoverage || false
//       };
//       setLabour([...labour, newLabour]);
//     } else if (mode === 'edit' && selectedItem) {
//       setLabour(labour.map(l => 
//         l.id === selectedItem.id ? { ...l, ...values } : l
//       ));
//     }
//     setIsDialogOpen(false);
//   };

//   const confirmDelete = () => {
//     if (selectedForDelete) {
//       setLabour(labour.filter(l => l.id !== selectedForDelete.id));
//       setDeleteDialogOpen(false);
//       setSelectedForDelete(null);
//     }
//   };

//   // Get status color
//   const getStatusColor = (status: string) => {
//     switch(status) {
//       case 'Active': return 'bg-green-100 text-green-800';
//       case 'On Leave': return 'bg-yellow-100 text-yellow-800';
//       case 'Terminated': return 'bg-red-100 text-red-800';
//       case 'Inactive': return 'bg-gray-100 text-gray-800';
//       default: return 'bg-blue-100 text-blue-800';
//     }
//   };

//   // Get trade color
//   const getTradeColor = (trade: string) => {
//     const tradeColors: Record<string, string> = {
//       'Mason': 'bg-orange-100 text-orange-800',
//       'Electrician': 'bg-blue-100 text-blue-800',
//       'Carpenter': 'bg-amber-100 text-amber-800',
//       'Plumber': 'bg-cyan-100 text-cyan-800',
//       'Painter': 'bg-purple-100 text-purple-800',
//       'Welder': 'bg-red-100 text-red-800',
//       'Helper': 'bg-gray-100 text-gray-800',
//       'Operator': 'bg-lime-100 text-lime-800',
//       'Steel Fixer': 'bg-indigo-100 text-indigo-800',
//     };
//     return tradeColors[trade] || 'bg-gray-100 text-gray-800';
//   };

//   // Grid templates
//   const statusTemplate = (props: any) => {
//     return (
//       <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(props.status)}`}>
//         {props.status}
//       </span>
//     );
//   };

//   const tradeTemplate = (props: any) => {
//     return (
//       <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTradeColor(props.trade)}`}>
//         {props.trade}
//       </span>
//     );
//   };

//   const rateTemplate = (props: any) => {
//     return (
//       <div className="text-right">
//         <div className="font-medium">₹{props.hourlyRate}/hr</div>
//         <div className="text-xs text-gray-500">₹{props.dailyRate}/day</div>
//       </div>
//     );
//   };

//   const safetyTemplate = (props: any) => {
//     return (
//       <div className="flex gap-1">
//         {props.safetyTraining && (
//           <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded">Safety</span>
//         )}
//         {props.insuranceCoverage && (
//           <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">Insured</span>
//         )}
//       </div>
//     );
//   };

//   const actionTemplate = (props: any) => {
//     const labourItem = props;
//     return (
//       <div className="flex flex-col sm:flex-row gap-1 sm:gap-2">
//         <button 
//           className="text-[var(--bs-primary)] hover:underline text-sm"
//           onClick={() => openView(labourItem)}
//         >
//           View
//         </button>
//         <button 
//           className="text-green-600 hover:underline text-sm"
//           onClick={() => openEdit(labourItem)}
//         >
//           Edit
//         </button>
//         <button 
//           className="text-red-600 hover:underline text-sm"
//           onClick={() => openDelete(labourItem)}
//         >
//           Delete
//         </button>
//       </div>
//     );
//   };

//   // Toolbar options
//   const toolbarOptions = [
//     { text: 'Add Labour', tooltipText: 'Add Labour', prefixIcon: 'e-add', id: 'add' },
//     'Print',
//     'ExcelExport',
//     'PdfExport',
//     'Search'
//   ];

//   const toolbarClick = (args: any) => {
//     if (args.item.id === 'add') {
//       openAdd();
//     }
//   };

//   return (
//     <div className="p-4 space-y-6 bg-gray-50 min-h-screen">
//       {/* Header with Stats */}
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
//         <div className="bg-white p-4 rounded-lg shadow">
//           <h3 className="text-gray-500 text-sm">Total Labour</h3>
//           <p className="text-2xl font-bold text-gray-800">{labour.length}</p>
//           <div className="text-sm text-gray-600 mt-1">
//             {skilledLabour} skilled • {labour.length - skilledLabour} others
//           </div>
//         </div>
//         <div className="bg-white p-4 rounded-lg shadow">
//           <h3 className="text-gray-500 text-sm">Active Labour</h3>
//           <p className="text-2xl font-bold text-green-600">{activeLabour}</p>
//           <div className="text-sm text-gray-600 mt-1">
//             {onLeaveLabour} on leave
//           </div>
//         </div>
//         <div className="bg-white p-4 rounded-lg shadow">
//           <h3 className="text-gray-500 text-sm">Trades</h3>
//           <p className="text-2xl font-bold text-gray-800">
//             {[...new Set(labour.map(l => l.trade))].length}
//           </p>
//           <div className="text-sm text-gray-600 mt-1">
//             Unique skills
//           </div>
//         </div>
//         <div className="bg-white p-4 rounded-lg shadow">
//           <h3 className="text-gray-500 text-sm">Monthly Cost</h3>
//           <p className="text-2xl font-bold text-purple-600">
//             ₹{totalMonthlyCost.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
//           </p>
//           <div className="text-sm text-gray-600 mt-1">
//             Approx. labour cost
//           </div>
//         </div>
//       </div>

//       {/* Filter Tabs */}
//       <div className="bg-white rounded-lg shadow p-4">
//         <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
//           <div>
//             <h1 className="text-2xl font-bold text-[var(--bs-text)]">Labour Management</h1>
//             <p className="text-gray-600">Manage workforce, attendance, and payroll</p>
//           </div>
//           <div className="flex flex-col sm:flex-row gap-2">
//             <button
//               onClick={openAdd}
//               className="bg-[var(--bs-primary)] hover:bg-[#162b4a] text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
//             >
//               <span>+</span>
//               <span>Add Labour</span>
//             </button>
//             <button className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-lg transition-colors">
//               Import/Export
//             </button>
//           </div>
//         </div>

//         {/* Filter Buttons */}
//         <div className="flex flex-wrap gap-2 mb-4">
//           <button
//             onClick={() => setFilter('all')}
//             className={`px-3 py-1 rounded-full ${filter === 'all' ? 'bg-[var(--bs-primary)] text-white' : 'bg-gray-200 text-gray-700'}`}
//           >
//             All ({labour.length})
//           </button>
//           <button
//             onClick={() => setFilter('active')}
//             className={`px-3 py-1 rounded-full ${filter === 'active' ? 'bg-green-600 text-white' : 'bg-green-100 text-green-700'}`}
//           >
//             Active ({activeLabour})
//           </button>
//           <button
//             onClick={() => setFilter('onLeave')}
//             className={`px-3 py-1 rounded-full ${filter === 'onLeave' ? 'bg-yellow-600 text-white' : 'bg-yellow-100 text-yellow-700'}`}
//           >
//             On Leave ({onLeaveLabour})
//           </button>
//           <button
//             onClick={() => setFilter('terminated')}
//             className={`px-3 py-1 rounded-full ${filter === 'terminated' ? 'bg-red-600 text-white' : 'bg-red-100 text-red-700'}`}
//           >
//             Terminated ({labour.filter(l => l.status === "Terminated").length})
//           </button>
//         </div>

//         {/* Data Grid */}
//         <div className="mt-4">
//           <GridComponent
//             dataSource={filteredLabour}
//             allowPaging={true}
//             pageSettings={{ pageSize: 10 }}
//             allowSorting={true}
//             allowFiltering={true}
//             toolbar={toolbarOptions}
//             toolbarClick={toolbarClick}
//             height="auto"
//           >
//             <ColumnsDirective>
//               <ColumnDirective field="labourId" headerText="Labour ID" width={100} />
//               <ColumnDirective field="name" headerText="Name" width={150} />
//               <ColumnDirective field="contactNumber" headerText="Contact" width={120} />
//               <ColumnDirective field="trade" headerText="Trade" width={120} template={tradeTemplate} />
//               <ColumnDirective field="category" headerText="Category" width={120} />
//               <ColumnDirective 
//                 field="hourlyRate" 
//                 headerText="Rate" 
//                 width={120} 
//                 template={rateTemplate}
//               />
//               <ColumnDirective field="status" headerText="Status" width={100} template={statusTemplate} />
//               <ColumnDirective field="assignedProject" headerText="Project" width={150} />
//               <ColumnDirective 
//                 field="safetyTraining" 
//                 headerText="Certifications" 
//                 width={130} 
//                 template={safetyTemplate}
//               />
//               <ColumnDirective
//                 headerText="Actions"
//                 width={150}
//                 template={actionTemplate}
//               />
//             </ColumnsDirective>
//             <Inject services={[Page, Sort, Filter, Toolbar]} />
//           </GridComponent>
//         </div>
//       </div>

//       {/* Quick Actions Panel */}
//       <div className="bg-white rounded-lg shadow p-4">
//         <h2 className="text-lg font-semibold mb-4 text-[var(--bs-text)]">Quick Actions</h2>
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
//           <button className="p-3 bg-blue-50 hover:bg-blue-100 rounded-lg text-blue-700 transition-colors text-left">
//             <div className="font-medium">Mark Attendance</div>
//             <div className="text-sm text-blue-600">Daily attendance entry</div>
//           </button>
//           <button className="p-3 bg-green-50 hover:bg-green-100 rounded-lg text-green-700 transition-colors text-left">
//             <div className="font-medium">Generate Payslips</div>
//             <div className="text-sm text-green-600">Monthly salary processing</div>
//           </button>
//           <button className="p-3 bg-yellow-50 hover:bg-yellow-100 rounded-lg text-yellow-700 transition-colors text-left">
//             <div className="font-medium">Skill Matrix</div>
//             <div className="text-sm text-yellow-600">View skill distribution</div>
//           </button>
//           <button className="p-3 bg-purple-50 hover:bg-purple-100 rounded-lg text-purple-700 transition-colors text-left">
//             <div className="font-medium">Safety Training</div>
//             <div className="text-sm text-purple-600">Schedule training sessions</div>
//           </button>
//         </div>
//       </div>

//       {/* Skill Distribution */}
//       <div className="bg-white rounded-lg shadow p-4">
//         <h2 className="text-lg font-semibold mb-4 text-[var(--bs-text)]">Skill Distribution</h2>
//         <div className="space-y-3">
//           {Object.entries(
//             labour.reduce((acc: Record<string, number>, l) => {
//               acc[l.trade] = (acc[l.trade] || 0) + 1;
//               return acc;
//             }, {})
//           ).map(([trade, count]) => (
//             <div key={trade} className="flex items-center justify-between">
//               <div className="flex items-center gap-3">
//                 <div className="w-3 h-3 rounded-full" style={{ 
//                   backgroundColor: getTradeColor(trade).split(' ')[0].replace('bg-', '')
//                 }}></div>
//                 <span className="font-medium">{trade}</span>
//               </div>
//               <div className="flex items-center gap-4">
//                 <span className="text-gray-600">{count} workers</span>
//                 <div className="w-32 bg-gray-200 rounded-full h-2">
//                   <div 
//                     className="h-2 rounded-full"
//                     style={{ 
//                       width: `${(count / labour.length) * 100}%`,
//                       backgroundColor: getTradeColor(trade).split(' ')[0].replace('bg-', '')
//                     }}
//                   ></div>
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>

//       {/* Add/Edit/View Dialog */}
//       <DialogComponent
//         visible={isDialogOpen}
//         width={getDialogWidth()}
//         header={`${mode === "add" ? "Add" : mode === "edit" ? "Edit" : "View"} Labour`}
//         showCloseIcon={true}
//         isModal={true}
//         close={() => setIsDialogOpen(false)}
//       >
//         <div className="p-4 max-h-[70vh] overflow-y-auto">
//           <CrudForm
//             mode={mode}
//             fields={labourFields}
//             initialValues={selectedItem || {}}
//             onSubmit={handleSubmit}
//             onCancel={() => setIsDialogOpen(false)}
//           />
//         </div>
//       </DialogComponent>

//       {/* Delete Confirmation Dialog */}
//       <DialogComponent
//         visible={deleteDialogOpen}
//         width="400px"
//         header="Delete Labour"
//         isModal={true}
//         showCloseIcon={true}
//         close={() => setDeleteDialogOpen(false)}
//       >
//         <div className="p-4">
//           <p className="text-gray-700 mb-4">
//             Are you sure you want to delete labour <strong>{selectedForDelete?.name}</strong>?
//             <br />
//             <span className="text-red-600 text-sm">
//               This action cannot be undone.
//             </span>
//           </p>
//           <div className="flex flex-col sm:flex-row justify-end gap-2 sm:gap-3">
//             <button
//               className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50 transition-colors w-full sm:w-auto"
//               onClick={() => setDeleteDialogOpen(false)}
//             >
//               Cancel
//             </button>
//             <button
//               className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors w-full sm:w-auto"
//               onClick={confirmDelete}
//             >
//               Delete
//             </button>
//           </div>
//         </div>
//       </DialogComponent>
//     </div>
//   );
// };

// export default LabourPage;











import type { Field } from "@/components/CrudForm";
import BaseCrudPage from "../components/BaseCrudPage";
import MainLayout from "../components/MainLayout";

// =====================
// Labour Fields (Full Form)
// =====================
const labourFields: Field[] = [
  { name: "labourId", label: "Labour ID", type: "text" },
  { name: "name", label: "Full Name", type: "text" },
  { name: "contactNumber", label: "Contact Number", type: "text" },
  { name: "email", label: "Email", type: "text" },

  {
    name: "category",
    label: "Category",
    type: "select",
    options: ["Skilled", "Semi-skilled", "Unskilled", "Foreman", "Supervisor"],
  },

  {
    name: "trade",
    label: "Trade",
    type: "select",
    options: [
      "Carpenter",
      "Mason",
      "Electrician",
      "Plumber",
      "Painter",
      "Welder",
      "Helper",
      "Operator",
      "Steel Fixer",
    ],
  },

  { name: "hourlyRate", label: "Hourly Rate (₹)", type: "number" },
  { name: "dailyRate", label: "Daily Rate (₹)", type: "number" },

  {
    name: "contractType",
    label: "Contract Type",
    type: "select",
    options: ["Daily", "Weekly", "Monthly", "Project-based"],
  },

  {
    name: "status",
    label: "Employment Status",
    type: "select",
    options: ["Active", "On Leave", "Terminated", "Inactive"],
  },

  { name: "assignedProject", label: "Assigned Project", type: "text" },
  { name: "experience", label: "Experience (Years)", type: "number" },
  { name: "address", label: "Address", type: "textarea" },
  { name: "notes", label: "Notes", type: "textarea" },
];


// =====================
// Sample Data
// =====================
const initialLabour = [
  { 
    id: 1, 
    labourId: "LAB-001", 
    name: "Rajesh Kumar", 
    contactNumber: "9876543210",
    email: "rajesh@example.com",
    category: "Skilled",
    trade: "Mason",
    hourlyRate: 250,
    dailyRate: 2000,
    weeklyRate: 12000,
    contractType: "Daily",
    aadharNumber: "1234-5678-9012",
    panNumber: "ABCDE1234F",
    address: "123 Street, Mumbai",
    emergencyContact: "Priya Kumar",
    emergencyContactNumber: "9876543211",
    dateOfJoining: "2023-01-15",
    experience: 8,
    assignedProject: "Residential Tower A",
    status: "Active",
    attendanceId: "ATT-001",
    bankAccountNumber: "123456789012",
    bankName: "State Bank of India",
    ifscCode: "SBIN0001234",
    medicalStatus: "Fit",
    safetyTraining: true,
    insuranceCoverage: true,
    notes: "Expert in brickwork and plastering"
  },
  { 
    id: 2, 
    labourId: "LAB-002", 
    name: "Amit Sharma", 
    contactNumber: "9876543212",
    email: "amit@example.com",
    category: "Skilled",
    trade: "Electrician",
    hourlyRate: 300,
    dailyRate: 2400,
    weeklyRate: 14400,
    contractType: "Monthly",
    aadharNumber: "2345-6789-0123",
    panNumber: "BCDEF2345G",
    address: "456 Lane, Delhi",
    emergencyContact: "Rita Sharma",
    emergencyContactNumber: "9876543213",
    dateOfJoining: "2023-02-20",
    experience: 10,
    assignedProject: "Commercial Complex",
    status: "Active",
    attendanceId: "ATT-002",
    bankAccountNumber: "234567890123",
    bankName: "HDFC Bank",
    ifscCode: "HDFC0001234",
    medicalStatus: "Fit",
    safetyTraining: true,
    insuranceCoverage: true,
    notes: "Specialized in industrial wiring"
  },
  { 
    id: 3, 
    labourId: "LAB-003", 
    name: "Vijay Singh", 
    contactNumber: "9876543214",
    email: "vijay@example.com",
    category: "Semi-skilled",
    trade: "Helper",
    hourlyRate: 150,
    dailyRate: 1200,
    weeklyRate: 7200,
    contractType: "Daily",
    aadharNumber: "3456-7890-1234",
    panNumber: "CDEFG3456H",
    address: "789 Road, Pune",
    emergencyContact: "Sunita Singh",
    emergencyContactNumber: "9876543215",
    dateOfJoining: "2023-03-10",
    experience: 3,
    assignedProject: "Hospital Project",
    status: "On Leave",
    attendanceId: "ATT-003",
    bankAccountNumber: "345678901234",
    bankName: "ICICI Bank",
    ifscCode: "ICIC0001234",
    medicalStatus: "Fit",
    safetyTraining: true,
    insuranceCoverage: false,
    notes: "General helper for material handling"
  },
  { 
    id: 4, 
    labourId: "LAB-004", 
    name: "Suresh Patel", 
    contactNumber: "9876543216",
    email: "suresh@example.com",
    category: "Skilled",
    trade: "Carpenter",
    hourlyRate: 280,
    dailyRate: 2240,
    weeklyRate: 13440,
    contractType: "Project-based",
    aadharNumber: "4567-8901-2345",
    panNumber: "DEFGH4567I",
    address: "101 Avenue, Bangalore",
    emergencyContact: "Meena Patel",
    emergencyContactNumber: "9876543217",
    dateOfJoining: "2023-04-05",
    experience: 12,
    assignedProject: "Residential Tower A",
    status: "Active",
    attendanceId: "ATT-004",
    bankAccountNumber: "456789012345",
    bankName: "Axis Bank",
    ifscCode: "UTIB0001234",
    medicalStatus: "Fit",
    safetyTraining: true,
    insuranceCoverage: true,
    notes: "Expert in formwork and shuttering"
  },
  { 
    id: 5, 
    labourId: "LAB-005", 
    name: "Deepak Verma", 
    contactNumber: "9876543218",
    email: "deepak@example.com",
    category: "Skilled",
    trade: "Welder",
    hourlyRate: 320,
    dailyRate: 2560,
    weeklyRate: 15360,
    contractType: "Weekly",
    aadharNumber: "5678-9012-3456",
    panNumber: "EFGHI5678J",
    address: "202 Boulevard, Chennai",
    emergencyContact: "Anita Verma",
    emergencyContactNumber: "9876543219",
    dateOfJoining: "2023-05-15",
    experience: 7,
    assignedProject: "Steel Plant",
    status: "Active",
    attendanceId: "ATT-005",
    bankAccountNumber: "567890123456",
    bankName: "Kotak Mahindra",
    ifscCode: "KKBK0001234",
    medicalStatus: "Fit",
    safetyTraining: true,
    insuranceCoverage: true,
    notes: "Certified structural welder"
  },
];


// =====================
// Status Badge Template
// =====================
const statusTemplate = (props: any) => {
  const colors: Record<string, string> = {
    Active: "bg-green-100 text-green-800",
    "On Leave": "bg-yellow-100 text-yellow-800",
    Terminated: "bg-red-100 text-red-800",
    Inactive: "bg-gray-100 text-gray-800",
  };

  return (
    <span className={`px-2 py-1 rounded-full text-xs ${colors[props.status] || "bg-gray-100"}`}>
      {props.status}
    </span>
  );
};


// =====================
// Important Grid Columns ONLY
// =====================
const labourGridColumns = [
  { field: "labourId", headerText: "Labour ID", width: 100 },
  { field: "name", headerText: "Name" },
  { field: "trade", headerText: "Trade" },
  { field: "category", headerText: "Category" },
  { field: "dailyRate", headerText: "Daily Rate (₹)" },
  { field: "status", headerText: "Status", template: statusTemplate },
  { field: "assignedProject", headerText: "Project" },
];


// =====================
// Summary Cards
// =====================
const LabourSummaryCards = ({ labour }: { labour: any[] }) => (
  <>
    <div className="bg-white p-4 rounded shadow">
      <h3 className="text-sm text-gray-500">Total Labour</h3>
      <p className="text-2xl font-bold">{labour.length}</p>
    </div>

    <div className="bg-white p-4 rounded shadow">
      <h3 className="text-sm text-gray-500">Active</h3>
      <p className="text-2xl font-bold text-green-600">
        {labour.filter(l => l.status === "Active").length}
      </p>
    </div>

    <div className="bg-white p-4 rounded shadow">
      <h3 className="text-sm text-gray-500">On Leave</h3>
      <p className="text-2xl font-bold text-yellow-600">
        {labour.filter(l => l.status === "On Leave").length}
      </p>
    </div>

    <div className="bg-white p-4 rounded shadow">
      <h3 className="text-sm text-gray-500">Monthly Cost</h3>
      <p className="text-2xl font-bold text-purple-600">
        ₹
        {labour
          .filter(l => l.status === "Active")
          .reduce((sum, l) => sum + (l.dailyRate || 0) * 26, 0)
          .toLocaleString()}
      </p>
    </div>
  </>
);


// =====================
// Labour Page
// =====================
const LabourPage = () => {
  return (
    <MainLayout
      role="SUPER_ADMIN"
      pageTitle="Labour Management"
      showLogout={true}
    >
      <BaseCrudPage
        title="Labour Management"
        description="Manage workforce, attendance and payroll"
        fields={labourFields}
        initialData={initialLabour}
        gridColumns={labourGridColumns}   // ✅ Only important fields shown
        summaryCards={<LabourSummaryCards labour={initialLabour} />}
      />

            {/* Quick Actions Panel */}
      {/* <div className="bg-white rounded-lg shadow p-4">
        <h2 className="text-lg font-semibold mb-4 text-[var(--bs-text)]">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <button className="p-3 bg-blue-50 hover:bg-blue-100 rounded-lg text-blue-700 transition-colors text-left">
            <div className="font-medium">Mark Attendance</div>
            <div className="text-sm text-blue-600">Daily attendance entry</div>
          </button>
          <button className="p-3 bg-green-50 hover:bg-green-100 rounded-lg text-green-700 transition-colors text-left">
            <div className="font-medium">Generate Payslips</div>
            <div className="text-sm text-green-600">Monthly salary processing</div>
          </button>
          <button className="p-3 bg-yellow-50 hover:bg-yellow-100 rounded-lg text-yellow-700 transition-colors text-left">
            <div className="font-medium">Skill Matrix</div>
            <div className="text-sm text-yellow-600">View skill distribution</div>
          </button>
          <button className="p-3 bg-purple-50 hover:bg-purple-100 rounded-lg text-purple-700 transition-colors text-left">
            <div className="font-medium">Safety Training</div>
            <div className="text-sm text-purple-600">Schedule training sessions</div>
          </button>
        </div>
      </div> */}
    </MainLayout>
  );
};

export default LabourPage;
