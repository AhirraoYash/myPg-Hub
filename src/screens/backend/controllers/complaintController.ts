import { Complaint } from '../models/Complaint';

export interface CreateComplaintData {
  title: string;
  description: string;
  category: 'Plumbing' | 'Electrical' | 'Cleaning' | 'WiFi' | 'Other';
  urgency: 'Low' | 'Medium' | 'High';
}

export const createComplaint = async (data: CreateComplaintData, tenant_id: string, property_id: string) => {
  const complaint = new Complaint({
    ...data,
    tenant_id,
    property_id,
    status: 'Open',
    resolution_cost: 0
  });
  
  await complaint.save();
  return complaint;
};

export const getComplaints = async (property_id: string, role: string, user_id: string) => {
  const query: any = { property_id };
  
  // If the user is a Tenant, restrict the query to only their complaints
  if (role === 'Tenant') {
    query.tenant_id = user_id;
  }

  // Fetch complaints sorted by newest first, populating basic user details
  return await Complaint.find(query)
    .sort({ createdAt: -1 })
    .populate('tenant_id', 'first_name last_name email')
    .populate('resolved_by', 'first_name last_name');
};

export const updateComplaintStatus = async (
  complaint_id: string,
  status: 'Open' | 'In_Progress' | 'Resolved',
  resolution_cost: number = 0,
  manager_id: string,
  property_id: string
) => {
  const complaint = await Complaint.findById(complaint_id);
  
  if (!complaint) {
    throw new Error('Complaint not found');
  }
  
  if (complaint.property_id.toString() !== property_id.toString()) {
    throw new Error('Complaint does not belong to this property');
  }

  complaint.status = status;

  // If the complaint is being marked as resolved, log the cost and the manager who resolved it
  if (status === 'Resolved') {
    complaint.resolution_cost = resolution_cost;
    complaint.resolved_by = manager_id as any;
  }

  await complaint.save();
  return complaint;
};
