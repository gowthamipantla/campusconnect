import api from './api';

export const getAllEvents = async () => {
  const response = await api.get('/events');
  return response.data;
};

export const getEventById = async (id) => {
  const response = await api.get(`/events/${id}`);
  return response.data;
};

export const registerForEvent = async (eventId) => {
  const response = await api.post(`/registrations/${eventId}`);
  return response.data;
};

export const getMyRegistrations = async () => {
  const response = await api.get('/registrations/me');
  return response.data;
};

export const downloadCertificate = async (registrationId, eventTitle = 'Event') => {
  try {
    const response = await api.get(`/registrations/${registrationId}/certificate`, {
      responseType: 'blob',
    });

    const blob = new Blob([response.data], { type: 'application/pdf' });
    const blobUrl = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = blobUrl;
    const sanitizedTitle = (eventTitle || 'Event').replace(/\s+/g, '_');
    link.setAttribute('download', `Certificate_${sanitizedTitle}.pdf`);
    document.body.appendChild(link);
    link.click();

    document.body.removeChild(link);
    window.URL.revokeObjectURL(blobUrl);
  } catch (error) {
    console.error('Failed to download certificate:', error);
    throw error;
  }
};

export default {
  getAllEvents,
  getEventById,
  registerForEvent,
  getMyRegistrations,
  downloadCertificate,
};
