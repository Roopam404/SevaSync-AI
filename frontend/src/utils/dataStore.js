export const getComplaints = () => {
  const data = localStorage.getItem('janaseva_complaints');
  if (!data) {
    const initialData = [
      { id: 'CMP1001', userId: 'user1', userName: 'John Doe', title: 'Pothole on Main St', type: 'Infrastructure', status: 'Pending', date: '2026-04-18', location: 'Main St near 5th Ave', description: 'Large pothole causing traffic issues.' },
      { id: 'CMP1002', userId: 'user1', userName: 'John Doe', title: 'Streetlight broken', type: 'Electricity', status: 'Resolved', date: '2026-04-15', location: 'Oakwood Dr', description: 'Streetlight is completely dark.' },
      { id: 'CMP1003', userId: 'admin1', userName: 'Admin', title: 'Garbage not collected', type: 'Sanitation', status: 'In Progress', date: '2026-04-19', location: 'Sector 4', description: 'Garbage bins overflowing.' }
    ];
    localStorage.setItem('janaseva_complaints', JSON.stringify(initialData));
    return initialData;
  }
  return JSON.parse(data);
};

export const saveComplaint = (complaint) => {
  const complaints = getComplaints();
  complaints.push(complaint);
  localStorage.setItem('janaseva_complaints', JSON.stringify(complaints));
};

export const updateComplaintStatus = (id, newStatus) => {
  const complaints = getComplaints();
  const updated = complaints.map(c => c.id === id ? { ...c, status: newStatus } : c);
  localStorage.setItem('janaseva_complaints', JSON.stringify(updated));
  return updated;
};
