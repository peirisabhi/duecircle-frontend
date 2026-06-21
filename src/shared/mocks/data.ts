/** Shared mock data used across all feature pages until backend is live. */

export const mockCustomers = [
  { id: 'c1', name: 'Acme Corporation', email: 'accounts@acme.com', phone: '+1 555-0101', balance: 4200, status: 'ACTIVE', city: 'New York', country: 'US', createdAt: '2026-01-15' },
  { id: 'c2', name: 'Blue Sky Ltd', email: 'finance@bluesky.com', phone: '+44 20 7123 4567', balance: 8750, status: 'ACTIVE', city: 'London', country: 'GB', createdAt: '2026-02-01' },
  { id: 'c3', name: 'Vertex Inc', email: 'billing@vertex.io', phone: '+1 555-0202', balance: 0, status: 'ACTIVE', city: 'San Francisco', country: 'US', createdAt: '2026-02-14' },
  { id: 'c4', name: 'Summit Group', email: 'ap@summitgroup.co', phone: '+61 2 9000 0001', balance: 3400, status: 'ACTIVE', city: 'Sydney', country: 'AU', createdAt: '2026-03-01' },
  { id: 'c5', name: 'River Co', email: 'hello@riverco.net', phone: '+1 555-0303', balance: 660, status: 'ACTIVE', city: 'Chicago', country: 'US', createdAt: '2026-03-15' },
  { id: 'c6', name: 'Peak Solutions', email: 'info@peak.dev', phone: '+94 11 234 5678', balance: 0, status: 'INACTIVE', city: 'Colombo', country: 'LK', createdAt: '2026-04-01' },
  { id: 'c7', name: 'Zenith Analytics', email: 'pay@zenith.ai', phone: '+1 555-0404', balance: 12000, status: 'ACTIVE', city: 'Austin', country: 'US', createdAt: '2026-04-10' },
  { id: 'c8', name: 'Horizon Media', email: 'accounts@horizon.media', phone: '+65 6000 0001', balance: 2200, status: 'ACTIVE', city: 'Singapore', country: 'SG', createdAt: '2026-05-01' },
]

export const mockProducts = [
  { id: 'p1', sku: 'SVC-WD-001', name: 'Web Design Services', category: 'Services', unitPrice: 1200, taxRate: 0, unit: 'project', stockTracking: false, stock: null, status: 'ACTIVE' },
  { id: 'p2', sku: 'SVC-SEO-001', name: 'SEO Package', category: 'Services', unitPrice: 800, taxRate: 0, unit: 'month', stockTracking: false, stock: null, status: 'ACTIVE' },
  { id: 'p3', sku: 'HST-ANN-001', name: 'Annual Hosting', category: 'Hosting', unitPrice: 240, taxRate: 18, unit: 'year', stockTracking: false, stock: null, status: 'ACTIVE' },
  { id: 'p4', sku: 'PRD-LPT-001', name: 'Laptop Stand', category: 'Hardware', unitPrice: 45, taxRate: 10, unit: 'pcs', stockTracking: true, stock: 32, status: 'ACTIVE' },
  { id: 'p5', sku: 'PRD-KBD-001', name: 'Mechanical Keyboard', category: 'Hardware', unitPrice: 120, taxRate: 10, unit: 'pcs', stockTracking: true, stock: 8, status: 'ACTIVE' },
  { id: 'p6', sku: 'SVC-APP-001', name: 'Mobile App Development', category: 'Services', unitPrice: 5000, taxRate: 0, unit: 'project', stockTracking: false, stock: null, status: 'ACTIVE' },
  { id: 'p7', sku: 'PRD-MON-001', name: '27" Monitor', category: 'Hardware', unitPrice: 380, taxRate: 10, unit: 'pcs', stockTracking: true, stock: 3, status: 'ACTIVE' },
  { id: 'p8', sku: 'SVC-MKT-001', name: 'Social Media Management', category: 'Marketing', unitPrice: 350, taxRate: 18, unit: 'month', stockTracking: false, stock: null, status: 'INACTIVE' },
]

export const mockUnits = [
  { id: 'u1', name: 'Piece', abbreviation: 'pcs', type: 'quantity' },
  { id: 'u2', name: 'Kilogram', abbreviation: 'kg', type: 'weight' },
  { id: 'u3', name: 'Hour', abbreviation: 'hr', type: 'time' },
  { id: 'u4', name: 'Day', abbreviation: 'day', type: 'time' },
  { id: 'u5', name: 'Month', abbreviation: 'month', type: 'time' },
  { id: 'u6', name: 'Year', abbreviation: 'year', type: 'time' },
  { id: 'u7', name: 'Box', abbreviation: 'box', type: 'quantity' },
  { id: 'u8', name: 'Project', abbreviation: 'project', type: 'other' },
  { id: 'u9', name: 'License', abbreviation: 'lic', type: 'other' },
]

export const mockWarehouses = [
  { id: 'w1', name: 'Main Warehouse', location: '123 Industrial Ave, New York, NY', isDefault: true, itemCount: 5 },
  { id: 'w2', name: 'West Coast Hub', location: '456 Storage Blvd, Los Angeles, CA', isDefault: false, itemCount: 3 },
  { id: 'w3', name: 'Returns Center', location: '789 Logistics Dr, Chicago, IL', isDefault: false, itemCount: 1 },
]

export const mockInvoices = [
  { id: 'i1', invoiceNumber: 'INV-00042', customerId: 'c1', customerName: 'Acme Corporation', total: 4200, paid: 0, status: 'OVERDUE', issueDate: '2026-05-01', dueDate: '2026-05-15', items: [] },
  { id: 'i2', invoiceNumber: 'INV-00041', customerId: 'c2', customerName: 'Blue Sky Ltd', total: 8750, paid: 0, status: 'SENT', issueDate: '2026-06-01', dueDate: '2026-06-30', items: [] },
  { id: 'i3', invoiceNumber: 'INV-00040', customerId: 'c3', customerName: 'Vertex Inc', total: 1200, paid: 1200, status: 'PAID', issueDate: '2026-05-28', dueDate: '2026-06-15', items: [] },
  { id: 'i4', invoiceNumber: 'INV-00039', customerId: 'c4', customerName: 'Summit Group', total: 3400, paid: 1700, status: 'PARTIAL', issueDate: '2026-05-25', dueDate: '2026-06-20', items: [] },
  { id: 'i5', invoiceNumber: 'INV-00038', customerId: 'c5', customerName: 'River Co', total: 660, paid: 0, status: 'DRAFT', issueDate: '2026-06-18', dueDate: '2026-07-01', items: [] },
  { id: 'i6', invoiceNumber: 'INV-00037', customerId: 'c7', customerName: 'Zenith Analytics', total: 12000, paid: 0, status: 'SENT', issueDate: '2026-06-10', dueDate: '2026-07-10', items: [] },
  { id: 'i7', invoiceNumber: 'INV-00036', customerId: 'c8', customerName: 'Horizon Media', total: 2200, paid: 2200, status: 'PAID', issueDate: '2026-06-01', dueDate: '2026-06-15', items: [] },
]

export const mockQuotations = [
  { id: 'q1', quotationNumber: 'QT-00015', customerId: 'c1', customerName: 'Acme Corporation', total: 6500, status: 'SENT', issueDate: '2026-06-01', expiryDate: '2026-06-30' },
  { id: 'q2', quotationNumber: 'QT-00014', customerId: 'c2', customerName: 'Blue Sky Ltd', total: 1800, status: 'ACCEPTED', issueDate: '2026-05-15', expiryDate: '2026-06-15' },
  { id: 'q3', quotationNumber: 'QT-00013', customerId: 'c7', customerName: 'Zenith Analytics', total: 9200, status: 'DRAFT', issueDate: '2026-06-18', expiryDate: '2026-07-18' },
  { id: 'q4', quotationNumber: 'QT-00012', customerId: 'c3', customerName: 'Vertex Inc', total: 3400, status: 'REJECTED', issueDate: '2026-05-01', expiryDate: '2026-05-31' },
  { id: 'q5', quotationNumber: 'QT-00011', customerId: 'c4', customerName: 'Summit Group', total: 5000, status: 'CONVERTED', issueDate: '2026-04-15', expiryDate: '2026-05-15' },
]

export const mockPayments = [
  { id: 'py1', reference: 'PAY-00021', customerId: 'c3', customerName: 'Vertex Inc', amount: 1200, method: 'BANK_TRANSFER', date: '2026-06-15', allocatedTo: ['INV-00040'], status: 'DELIVERED' },
  { id: 'py2', reference: 'PAY-00020', customerId: 'c4', customerName: 'Summit Group', amount: 1700, method: 'CHEQUE', date: '2026-06-10', allocatedTo: ['INV-00039'], status: 'DELIVERED' },
  { id: 'py3', reference: 'PAY-00019', customerId: 'c8', customerName: 'Horizon Media', amount: 2200, method: 'CASH', date: '2026-06-08', allocatedTo: ['INV-00036'], status: 'DELIVERED' },
  { id: 'py4', reference: 'PAY-00018', customerId: 'c5', customerName: 'River Co', amount: 500, method: 'CARD', date: '2026-06-01', allocatedTo: [], status: 'PENDING' },
]

export const mockStockMovements = [
  { id: 'sm1', type: 'IN', productId: 'p4', productName: 'Laptop Stand', warehouseId: 'w1', warehouseName: 'Main Warehouse', quantity: 20, unitCost: 22, totalCost: 440, reference: 'PO-001', date: '2026-06-01', createdBy: 'Dev Admin' },
  { id: 'sm2', type: 'OUT', productId: 'p4', productName: 'Laptop Stand', warehouseId: 'w1', warehouseName: 'Main Warehouse', quantity: 3, unitCost: 22, totalCost: 66, reference: 'INV-00040', date: '2026-06-05', createdBy: 'Dev Admin' },
  { id: 'sm3', type: 'IN', productId: 'p5', productName: 'Mechanical Keyboard', warehouseId: 'w1', warehouseName: 'Main Warehouse', quantity: 10, unitCost: 60, totalCost: 600, reference: 'PO-002', date: '2026-06-08', createdBy: 'Dev Admin' },
  { id: 'sm4', type: 'OUT', productId: 'p5', productName: 'Mechanical Keyboard', warehouseId: 'w1', warehouseName: 'Main Warehouse', quantity: 2, unitCost: 60, totalCost: 120, reference: 'INV-00041', date: '2026-06-12', createdBy: 'Dev Admin' },
  { id: 'sm5', type: 'TRANSFER', productId: 'p7', productName: '27" Monitor', warehouseId: 'w1', warehouseName: 'Main Warehouse → West Coast Hub', quantity: 1, unitCost: 190, totalCost: 190, reference: 'TRF-001', date: '2026-06-15', createdBy: 'Dev Admin' },
]

export const mockCashAccounts = [
  { id: 'ca1', name: 'Main Cash Register', type: 'CASH', balance: 4850, currency: 'USD' },
  { id: 'ca2', name: 'Business Checking — Chase', type: 'BANK', balance: 38420, currency: 'USD' },
  { id: 'ca3', name: 'Savings Account', type: 'BANK', balance: 15000, currency: 'USD' },
  { id: 'ca4', name: 'Petty Cash', type: 'CASH', balance: 200, currency: 'USD' },
]

export const mockCashTransactions = [
  { id: 'ct1', accountId: 'ca2', type: 'DEPOSIT', description: 'Payment from Vertex Inc', amount: 1200, date: '2026-06-15', reference: 'PAY-00021' },
  { id: 'ct2', accountId: 'ca2', type: 'DEPOSIT', description: 'Payment from Summit Group', amount: 1700, date: '2026-06-10', reference: 'PAY-00020' },
  { id: 'ct3', accountId: 'ca1', type: 'WITHDRAWAL', description: 'Office supplies', amount: 150, date: '2026-06-09', reference: 'EXP-001' },
  { id: 'ct4', accountId: 'ca2', type: 'TRANSFER', description: 'Transfer to Savings', amount: 5000, date: '2026-06-05', reference: 'TRF-001' },
  { id: 'ct5', accountId: 'ca2', type: 'DEPOSIT', description: 'Payment from Horizon Media', amount: 2200, date: '2026-06-08', reference: 'PAY-00019' },
]

export const mockCreditNotes = [
  { id: 'cn1', noteNumber: 'CN-00005', customerId: 'c3', customerName: 'Vertex Inc', invoiceId: 'i3', invoiceNumber: 'INV-00040', amount: 120, reason: 'Returned items', status: 'ISSUED', date: '2026-06-16' },
  { id: 'cn2', noteNumber: 'CN-00004', customerId: 'c4', customerName: 'Summit Group', invoiceId: 'i4', invoiceNumber: 'INV-00039', amount: 340, reason: 'Billing error', status: 'APPLIED', date: '2026-06-11' },
]

export const mockSalesData = [
  { month: 'Jan', sales: 18200, collected: 14000, invoices: 8 },
  { month: 'Feb', sales: 22400, collected: 20000, invoices: 11 },
  { month: 'Mar', sales: 19800, collected: 17500, invoices: 9 },
  { month: 'Apr', sales: 26000, collected: 23000, invoices: 14 },
  { month: 'May', sales: 28100, collected: 25000, invoices: 13 },
  { month: 'Jun', sales: 32400, collected: 28000, invoices: 16 },
]

export const mockNotifications = [
  { id: 'n1', title: 'Invoice Overdue', body: 'INV-00042 from Acme Corporation is 36 days overdue.', type: 'OVERDUE', isRead: false, resourceType: 'INVOICE', resourceId: 'i1', createdAt: '2026-06-20T09:00:00Z' },
  { id: 'n2', title: 'Payment Received', body: 'Received $1,200 from Vertex Inc for INV-00040.', type: 'PAYMENT', isRead: false, resourceType: 'PAYMENT', resourceId: 'py1', createdAt: '2026-06-15T14:30:00Z' },
  { id: 'n3', title: 'Quotation Accepted', body: 'QT-00014 was accepted by Blue Sky Ltd.', type: 'QUOTATION', isRead: true, resourceType: 'QUOTATION', resourceId: 'q2', createdAt: '2026-06-10T10:00:00Z' },
  { id: 'n4', title: 'Low Stock Alert', body: '27" Monitor is below minimum stock level (3 remaining).', type: 'STOCK', isRead: false, resourceType: 'PRODUCT', resourceId: 'p7', createdAt: '2026-06-18T08:00:00Z' },
  { id: 'n5', title: 'Invoice Due Soon', body: 'INV-00041 from Blue Sky Ltd is due in 9 days.', type: 'DUE_SOON', isRead: true, resourceType: 'INVOICE', resourceId: 'i2', createdAt: '2026-06-20T07:00:00Z' },
]
