import api from "../api/axios";
import { ENDPOINTS } from "../api/endpoints";

// export const getAllCarCustomizeOptions = async(token) => api.get(ENDPOINTS.CAR_CUSTOMIZE_OPTIONS, {
//   headers: {
//     Authorization: token ? `Bearer ${token}` : "",
//   },
// });

export const getAllCarCustomizeOptions = async() => api.get(ENDPOINTS.CAR_CUSTOMIZE_OPTIONS);