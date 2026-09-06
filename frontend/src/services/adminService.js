import api from './api';

export const createEvent = async (eventData) => {
  const response = await api.post('/events', eventData);
  return response.data;
};

export const updateEvent = async (id, eventData) => {
  const response = await api.put(`/events/${id}`, eventData);
  return response.data;
};

export const deleteEvent = async (id) => {
  const response = await api.delete(`/events/${id}`);
  return response.data;
};

export const getEventRegistrants = async (eventId) => {
  const response = await api.get(`/registrations/event/${eventId}`);
  return response.data;
};

export const markAttendance = async (registrationId, attended) => {
  const response = await api.put(`/registrations/${registrationId}/attendance`, {
    attended,
  });
  return response.data;
};

export default {
  createEvent,
  updateEvent,
  deleteEvent,
  getEventRegistrants,
  markAttendance,
};
