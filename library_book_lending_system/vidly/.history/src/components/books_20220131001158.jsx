import React, { Component } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import BooksTable from "./booksTable";
import ListGroup from "./common/listGroup";
import Pagination from "./common/pagination";
import { getBooks, deleteBook } from "../services/bookService";
import { getGenres } from "../services/genreService";
import { getUsers } from "../services/userService";
import { paginate } from "../utils/paginate";
import _ from "lodash";
import SearchBox from "./searchBox";
import { saveRental } from '../services/rentalService';
import auth from "../services/authService";


class Books extends Component {
  state = {
    books: [],
    genres: [],
    //users: [],
    currentPage: 1,
    pageSize: 4,
    searchQuery: "",
    selectedGenre: null,
    selectedUser: null,
    sortColumn: { path: "title", order: "asc" }
  };

  async componentDidMount() {
    const { data } = await getGenres();
    const genres = [{ _id: "", name: "All Genres" }, ...data];

    const { data: books } = await getBooks();
    //const { data: users } = await getUsers();

    this.setState({ books, genres, /*users*/ });
  }

  handleDelete = async book => {
    const originalBooks = this.state.books;
    const books = originalBooks.filter(m => m._id !== book._id);
    this.setState({ books });

    try {
      await deleteBook(book._id);
    } catch (ex) {
      if (ex.response && ex.response.status === 404)
        toast.error("This movie has already been deleted.");

      this.setState({ books: originalBooks });
    }
  };

  handleLike = book => {
    const books = [...this.state.books];
    const index = books.indexOf(book);
    books[index] = { ...books[index] };
    books[index].liked = !books[index].liked;
    this.setState({ books });
  };

  handleBorrow = async book => {
    const userId = auth.getCurrentUser()._id;
    const schema = {customerId: userId, bookId: book._id};

    try {
      await saveRental(schema);
    } catch (ex) {
      if (ex.response && ex.response.status === 404)
        toast.error("error");

      this.setState({ books: originalBooks });
    }
  }

  handlePageChange = page => {
    this.setState({ currentPage: page });
  };

  handleGenreSelect = genre => {
    this.setState({ selectedGenre: genre, searchQuery: "", selectedUser: null, currentPage: 1 });
  };

  handleUserSelect = user => {
    this.setState({ selectedUser: user, selectedGenre: null, searchQuery: "", currentPage: 1 })
  }

  handleSearch = query => {
    this.setState({ searchQuery: query, selectedGenre: null, selectedUser: null, currentPage: 1 });
  };

  handleSort = sortColumn => {
    this.setState({ sortColumn });
  };

  getPagedData = () => {
    const {
      pageSize,
      currentPage,
      sortColumn,
      selectedGenre,
      searchQuery,
      books: allBooks
    } = this.state;

    let filtered = allBooks;
    if (searchQuery)
      filtered = allBooks.filter(m =>
        m.title.toLowerCase().startsWith(searchQuery.toLowerCase())
      );
    else if (selectedGenre && selectedGenre._id)
      filtered = allBooks.filter(m => m.genre._id === selectedGenre._id);

    const sorted = _.orderBy(filtered, [sortColumn.path], [sortColumn.order]);

    const books = paginate(sorted, currentPage, pageSize);

    return { totalCount: filtered.length, data: books };
  };

  render() {
    const { length: count } = this.state.books;
    const { pageSize, currentPage, sortColumn, searchQuery } = this.state;
    const { user } = this.props;

    if (count === 0) return <p>There are no books in the database.</p>;

    const { totalCount, data: books } = this.getPagedData();

    return (
      <div className="row">
        <div className="col-3">
          <ListGroup
            items={this.state.genres}
            selectedItem={this.state.selectedGenre}
            onItemSelect={this.handleGenreSelect}
          />
        </div>
        <div className="col">
          {user && (user.isAdmin || user.isBoss) && (
            <Link
              to="/books/bookForm/saveBook/new"
              className="btn btn-primary"
              style={{ marginBottom: 20 }}
            >
              New Book
            </Link>
          )}
          <p>Showing {totalCount} books in the database.</p>
          <SearchBox value={searchQuery} onChange={this.handleSearch} />
          <BooksTable
            books={books}
            sortColumn={sortColumn}
            onLike={this.handleLike}
            onDelete={this.handleDelete}
            onSort={this.handleSort}
          />
          <Pagination
            itemsCount={totalCount}
            pageSize={pageSize}
            currentPage={currentPage}
            onPageChange={this.handlePageChange}
          />
        </div>
      </div>
    );
  }
}

export default Books;
