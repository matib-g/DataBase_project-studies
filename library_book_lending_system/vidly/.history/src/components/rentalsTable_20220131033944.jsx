import React, { Component } from "react";
import auth from "../services/authService";
import { Link } from "react-router-dom";
import Table from "./common/table";
import Like from "./common/like";

class RentalsTable extends Component {
  state = {
    pathElement: ""
  }
  columns = [];

  titleColumn = {
    key: "title", path: "book.title", label: "Title"
  }

  authorColumn = {
    key: "author", path: "book.author", label: "Author"
  }

  rateColumn = {
    key: "rate", path: "book.dailyRentalRate", label: "Rate"
  }

  dateOutColumn = {
      key: "dateOut", path: "dateOut", label: "Day Out"
  }

  deleteColumn = {
    key: "delete",
    content: rental => (
      <button
        onClick={() => this.props.onDelete(rental)}
        className="btn btn-danger btn-sm"
      >
        Delete
      </button>
    )
  };

  constructor() {
    super();
    this.columns.push(this.titleColumn);
    this.columns.push(this.authorColumn);
    this.columns.push(this.rateColumn);
    this.columns.push(this.dateOutColumn);
    this.columns.push(this.deleteColumn);
    console.log(rentals);
  }

  render() {
    const { rentals, onSort, sortColumn } = this.props;

    return (
      <Table
        columns={this.columns}
        data={rentals}
        sortColumn={sortColumn}
        onSort={onSort}
      />
    );
  }
}

export default RentalsTable;
