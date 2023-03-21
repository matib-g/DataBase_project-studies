import React from "react";
import Joi from "joi-browser";
import Form from "./common/form";
import { getBook, saveBook } from "../services/bookService";
import { getGenres } from "../services/genreService";
import { getRentals, saveRental } from '../services/rentalService';
import auth from "../services/authService";

class BorrowBook extends Form {
    state = {
        data:{
            customerId: "",
            bookId: ""
        },
        customer: {
            customerId: "",
            name: ""
        },
        book: {
            title: "",
            author: "",
            dailyRentalRate: ""
        },
        errors: {},
        currentUser: {}
  };

  schema = {
    customerId: Joi.objectId().required(),
    bookId: Joi.objectId().required()
  };

  async componentDidMount () {
    await this.populateUser();
    await this.populateBook();
    const user = auth.getCurrentUser();
    console.log(user);
  }

  async populateUser() {
      return
  }

  async populateBook() {
      return
  }

  mapUser(user) {
    return {

    }
  }

  mapBook(book) {

  }

  render() {
    return (
      <div>
        <h1>Book Form</h1>
        <form onSubmit={this.handleSubmit}>
          {this.renderButton("Borrow")}
        </form>
      </div>
    );
  }
}

export default BorrowBook;
