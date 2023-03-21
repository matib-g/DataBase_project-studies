import React, { Component } from "react";
import auth from "../services/authService";
import { Link } from "react-router-dom";
import Table from "./common/table";
import Like from "./common/like";

class BooksTable extends Component {
  state = {
    pathElement: ""
  }
  columns = [];

  titleColumnIfAdmin = {
    key: "titleIfAdmin",
    path: "title",
    label: "Title",
    content: book => <Link to={`/books/saveBook/${book._id}`}>{book.title}</Link>
  }

  titleColumnIfUser = {
    key: "titleIfUser",
    path: "title",
    label: "Title",
    content: book => <Link to={`/books/borrowBook/${book._id}`}>{book.title}</Link>
  }

  titleColumnToLogin = {
    key: "titleToLogin",
    path: "title",
    label: "Title",
    content: book => <Link to={`/login`}>{book.title}</Link>
  }

  authorColumn = {
    path: "author", label: "Author"
  }

  genreColumn = {
    path: "genre.name", label: "Genre"
  }

  stockColumn = {
    path: "numberInStock", label: "Stock"
  }

  rateColumn = {
    path: "dailyRentalRate", label: "Rate"
  }

  likeColumn = {
    key: "like",
      content: book => (<Like liked={book.liked} onClick={() => this.props.onLike(book)} />)
  }

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

  constructor() {
    super();
    const user = auth.getCurrentUser();
    if (user && (user.isAdmin || user.isBoss)) this.columns.push(this.titleColumnIfAdmin);
    if (user && !user.isAdmin && !user.isBoss) this.columns.push(this.titleColumnIfUser);
    if (!user) this.columns.push(this.titleColumnToLogin);
    this.columns.push(this.authorColumn);
    this.columns.push(this.genreColumn);
    this.columns.push(this.stockColumn);
    this.columns.push(this.rateColumn);
    this.columns.push(this.likeColumn);
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
