import React, { Component } from "react";
import auth from "../services/authService";
import { Link } from "react-router-dom";
import Table from "./common/table";
import Like from "./common/like";

class BooksTable extends Component {
  state = {
    pathElement: ""
  }
  columns = [
    {
      path: "title",
      label: "Title",
      content: book => <Link to={`/books/${book._id}`}>{book.title}</Link>
    },
    { path: "author", label: "Author"},
    { path: "genre.name", label: "Genre" },
    { path: "numberInStock", label: "Stock" },
    { path: "dailyRentalRate", label: "Rate" },
    {
      key: "like",
      content: book => (
        <Like liked={book.liked} onClick={() => this.props.onLike(book)} />
      )
    }
  ];

  deleteColumn = {
    key: "delete",
    content: book => (
      <button
        onClick={() => this.props.onDelete(book)}
        className="btn btn-danger btn-sm"
      >
        Delete
      </button>
    )
  };

  titleColumnIfAdmin = {
    key: "titleIfAdmin",
    content: book => (
      <Link to={`/books/${this.state.pathElement}/${book._id}`}>{book.title}</Link>
    )
  }

  constructor() {
    super();
    const user = auth.getCurrentUser();
    if (user && user.isAdmin) this.columns.push(this.deleteColumn);
    }

  render() {
    const { books, onSort, sortColumn } = this.props;

    return (
      <Table
        columns={this.columns}
        data={books}
        sortColumn={sortColumn}
        onSort={onSort}
      />
    );
  }
}

export default BooksTable;
