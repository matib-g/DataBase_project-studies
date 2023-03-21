import React from "react";
import Joi from "joi-browser";
import Form from "./common/form";
import { getBook, saveBook } from "../services/bookService";
import { getGenres } from "../services/genreService";
import { getRentals, saveRental } from '../services/rentalService';
import auth from "../services/authService";

class BorrowBook extends Form {
    state = {
        data: {
            customer: {
                customerId: "",
                name: ""
            },
            book: {
                title: "",
                author: "",
                dailyRentalRate: ""
            }
        },
    errors: {},
    currentUser: {}
  };

  schema = {
    //_id: Joi.string(),
    customer: {
        customerId: Joi.string()
            .required(),
        name: Joi.string()
            .required()
            .label("CustomerName"),
    },
    book: {
        title: Joi.string()
            .required()
            .trim()
            .label("Title"),
        author: Joi.string()
            .required()
            .trim()
            .label("Author"),
        dailyRentalRate: Joi.number()
            .required()
            .label("DailyRentalRate:")
    }
  };

  async populateBookAndUser() {
    const currentUser = auth.getCurrentUser();
    this.setState({ currentUser });
    try {
      const bookId = this.props.match.params.id;
      if (bookId === "new") return;

      const { data: book } = await getBook(bookId);
      this.setState({ data: this.mapToViewModel(book, currentUser) });
      console.log(this.state.data);
      console.log(this.state.data.book.author);
    } catch (ex) {
        console.log("wyrzucam");
        console.log(ex);
      if (ex.response && ex.response.status === 404)
        this.props.history.replace("/not-found");
    }
  }

  async componentDidMount() {
    await this.populateBookAndUser();
    console.log(this.state.data.customer.name);
  }

  mapToViewModel(book, user) {
    return {
        data: {
            customer: {
                customerId: user._id,
                name: user.name
            },
            book: {
                title: book.title,
                author: book.author,
                dailyRentalRate: book.dailyRentalRate
            }
        }
    };
  }

  doSubmit = async () => {
    await saveRental(this.state.data);

    this.props.history.push("/books");
  };

  render() {
    return (
      <div>
        <h1>Borrow Book</h1>
        <form onSubmit={this.handleSubmit}>
          {this.renderHeadder("title", "Title", "book")}
          {this.renderHeadder("author", "Author", "book")}
          {this.renderHeadder("dailyRentalRate", "Daily Rental Rate", "book")}
          {this.renderButtonNoValid("Borrow")}
        </form>
      </div>
    );
  }
}

export default BorrowBook;
