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
import RentalsTable from '../components/rentalsTable';

class Rentals extends Component {
  state = {
    rentals: [],
    customers: [],
    selectedUserRentals: [],
    currentPage: 1,
    pageSize: 4,
    searchQuery: "",
    selectedUser: null,
    sortColumn: { path: "title", order: "asc" }
  };

  async componentDidMount() {
    const rentals = await getRentals();
    const { data } = await getRentals();
    this.setState({rentals});
    //console.log(this.state.rentals);

    const cust = [...data.map(rental => rental.customer)];
    const customers = [{ isGold: false, _id: "", name: "All Users" }, ...cust];
    //console.log(customers);
  }

  handleDelete = rental => {

  }

  handlePageChange = page => {
    this.setState({ currentPage: page });
  };

  handleUserSelect = user => {
    this.setState({ selectedUser: user, searchQuery: "", currentPage: 1 });
    const selectedUserRentals = this.state.rentals.filter(m => m.customer._id === user._id);
    this.setState({ selectedUserRentals });
  };

  handleSearch = query => {
    this.setState({ searchQuery: query, selectedUser: null, currentPage: 1 });
  };

  handleSort = sortColumn => {
    this.setState({ sortColumn });
  };

  getPagedData = () => {
    const {
      pageSize,
      currentPage,
      sortColumn,
      selectedUser,
      searchQuery,
      rentals: allRentals
    } = this.state;

    //console.log(allRentals);
    let filtered = allRentals;
    if (searchQuery)
      filtered = allRentals.filter(m =>
        m.book.title.toLowerCase().startsWith(searchQuery.toLowerCase())
      );
    else if (selectedUser && selectedUser._id && !selectedUser.isGold)
      filtered = allRentals.filter(m => m.customer._id === selectedUser._id);

      //console.log(filtered);
    const sorted = _.orderBy(filtered, [sortColumn.path], [sortColumn.order]);

    //console.log(sorted);
    const rentals = paginate(sorted, currentPage, pageSize);

    //console.log(rentals[0].length);
    return { totalCount: rentals[0].length, data: rentals[0] };
      };

  render() {
    const { length: count } = this.state.rentals;
    const { pageSize, currentPage, sortColumn, searchQuery } = this.state;

    if (count === 0) return <p>There are no rentals in the database.</p>;

    const { totalCount, data: rentals } = this.getPagedData();
    console.log(rentals);

    return (
      <div className="row">
        <div className="col-3">
          <ListGroup
            items={this.state.customers}
            selectedItem={this.state.selectedUser}
            onItemSelect={this.handleUserSelect}
          />
        </div>
        <div className="col">
          <p>Showing {totalCount} rentals in the database.</p>
          <SearchBox value={searchQuery} onChange={this.handleSearch} />
          <RentalsTable
            rentals={rentals}
            sortColumn={sortColumn}
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

export default Rentals;