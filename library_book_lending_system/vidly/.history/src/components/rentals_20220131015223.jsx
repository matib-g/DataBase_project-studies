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
import { saveBook } from '../services/bookService';
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
    const rentals = await getRentals();
    this.setState({rentals});
    console.log(this.state.rentals);
  }



  handlePageChange = page => {
    this.setState({ currentPage: page });
  };

  handleGenreSelect = genre => {
    this.setState({ selectedGenre: genre, searchQuery: "", currentPage: 1 });
  };

  handleSearch = query => {
    this.setState({ searchQuery: query, selectedGenre: null, currentPage: 1 });
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
    return (
      <h1>Rentals</h1>
    );
  }
}

export default Rentals;