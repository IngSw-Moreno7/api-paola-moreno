import axios from 'axios';

const BASE_URL = 'https://api-colombia.com/api/v1';

export const fetchPresidents = async () => {
  const response = await axios.get(`${BASE_URL}/President`);
  return response.data;
};

export const fetchAirports = async () => {
  const response = await axios.get(`${BASE_URL}/Airport`);
  return response.data;
};

export const fetchTouristicAttractions = async () => {
  const response = await axios.get(`${BASE_URL}/TouristicAttraction`);
  return response.data;
};

