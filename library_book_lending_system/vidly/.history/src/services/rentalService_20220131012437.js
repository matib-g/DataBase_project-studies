import http from "./httpService";
import { apiUrl } from "../config.json";

const apiEndpoint = apiUrl + "/rentals";

function rentalUrl(id) {
    return `${apiEndpoint}/${id}`;
  }

  export function getRentals() {
    return http.get(apiEndpoint);
  }

  export function getRental(rentalId) {
    return http.get(rentalUrl(rentalId));
  }

  export function saveRental(rental) {
    return http.post(apiEndpoint, rental);
  }

  export function deleteRental(rentalId) {
    return http.delete(rentalUrl(rentalId));
  }