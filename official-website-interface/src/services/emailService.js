// src/services/emailService.js
import apiClient from './api';

export const sendContactEmail = async (data) => {
  try {
    const response = await apiClient.post('/usEmail', data);
    return response;
  } catch (error) {
    throw error;
  }
};