import React, { Component } from "react";
import { getRentals } from '../services/rentalService';

class Rentals extends Component {
  state = {
    rentals: [],
    currentPage: 1,
    pageSize: 4,
    searchQuery: "",
    selectedGenre: null,
    sortColumn: { path: "title", order: "asc" }
  };

  async componentDidMount() {
    const { data } = await getRentals();
  }

  render() {
    return (
      <h1>Rentals</h1>
    );
  }
}

export default Rentals;