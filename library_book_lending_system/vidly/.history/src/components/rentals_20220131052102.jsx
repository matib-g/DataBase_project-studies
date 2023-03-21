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
import Table from "./common/table";
import TableHeader from "./common/tableHeader";
import TableBody from "./common/tableBody";


class Rentals extends Component {
  state = {
    rentals: [],
    customers: [],
    selectedUserRentals: [],
    selectedUser: null,
  };

  columns = [
    {key: "user", path: "customer.name", label: "User"},
    {key: "title", path: "book.title", label: "Title"},
    {key: "author", path: "book.author", label: "Author"},
    {key: "rate", path: "book.dailyRentalRate", label: "Rate"},
    {key: "dateOut", path: "dateOut", label: "Day Out"}
  ]

  async componentDidMount() {
    //const rentals = await getRentals();
    const { data: rentals } = await getRentals();
    this.setState({rentals});
    console.log(this.state.rentals);

    const cust = [...rentals.map(rental => rental.customer)];
    const customers = [{ isGold: false, _id: "", name: "All Users" }, ...cust];
    console.log(customers);
    this.setState({customers});
  }

  handleDelete = rental => {

  }

  handlePageChange = page => {
    this.setState({ currentPage: page });
  };

  handleUserSelect = user => {
    this.setState({ selectedUser: user});
    const selectedUserRentals = this.state.rentals.filter(m => m.customer._id === user._id);
    this.setState({ selectedUserRentals });
  };

  userRentals() {
    const {rentals: allRentals, selectedUser} = this.state
    if (selectedUser && selectedUser._id && !selectedUser.isGold){
      const filtered = allRentals.filter(m => m.customer._id === selectedUser._id);
      console.log(filtered);
      return filtered;
    }
    else {
      return allRentals
    }
  }

  render() {
    const rentals = this.userRentals();
    return (
      <div className="row">
      <div className="col-3">
        <ul className="list-group">
          {this.state.customers.map(customer => (
            <li
            onClick={() => this.handleUserSelect(customer)}
            key={customer.name}
            className={
              customer === selectedUser ? "list-group-item active" : "list-group-item"
            }
          >
            {customer.name}
          </li>
          ))}
        </ul>
      </div>
      <div className="col">
      <thead>
        <tr>
          {this.columns.map(column => (
            <th
              className="clickable"
              key={column.path || column.key}
            >
              {column.label}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rentals.map(rental => (
          <tr key={rental._id}>
            <td>{rental.customer.name}</td>
            <td>{rental.book.title}</td>
            <td>{rental.book.author}</td>
            <td>{rental.book.dailyRentalRate}</td>
            <td>{rental.dateOut}</td>
          </tr>
        ))}
      </tbody>
      </div>
      </div>
    );
  }
}

export default Rentals;

/*

<tbody>
        {this.rentals.map(item => (
          <tr key={item._id}>
            {this.columns.map(column => (
              <td key={this.createKey(item, column)}>
                {this.renderCell(item, column)}
              </td>
            ))}
          </tr>
        ))}
      </tbody>

*/