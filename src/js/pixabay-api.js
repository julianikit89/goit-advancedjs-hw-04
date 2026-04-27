

import axios from "axios";

export async function getImagesByQuery(query, page) {
  const BASE_URL = "https://pixabay.com/api/";
  const API_KEY = "55618250-f9d832cddd8bc0b340f69275b";

  const params = {
    key: API_KEY,
    q: query,
    image_type: "photo",
    orientation: "horizontal",
    safesearch: true,
    page: page,
    per_page: 15,
  };

  const response = await axios.get(BASE_URL, { params });
  return response.data;
}