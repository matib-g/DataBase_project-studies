import React, { Component } from "react";

class Rentals extends Component {
  state = {
    rentals = [],
    currentPage: 1,
    pageSize: 4,
    searchQuery: "",
    selectedGenre: null,
    sortColumn: { path: "title", order: "asc" }
   }
  render() {
    return (

    );
  }
}

export default Rentals;