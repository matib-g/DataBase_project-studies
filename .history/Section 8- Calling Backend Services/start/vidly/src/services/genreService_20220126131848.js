import http from './httpService';

export function getGenres() {
    http.get('http://localhost:3900/api/genres');
  }