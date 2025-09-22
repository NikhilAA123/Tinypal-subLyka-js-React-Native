import axios from "axios";
import { API_BASE_URL } from "../utils/constants";

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

export const getDidYouKnowData = () => apiClient.get("/did_you_know");
export const getFlashcardData = () => apiClient.get("/flashcard");
