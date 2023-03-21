import React from "react";
import Joi from "joi-browser";
import Form from "./common/form";
import { getBook, saveBook } from "../services/bookService";
import { getGenres } from "../services/genreService";
import { getRentals, saveRental } from '../services/rentalService';
import auth from "../services/authService";

class BorrowBook extends Form {
    state = {
        book: {
        title: "",
        author: "",
        genreId: "",
        numberInStock: "",
        dailyRentalRate: ""
        },
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
    _id: Joi.string(),
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

  async populateBook() {
    try {
      const bookId = this.props.match.params.id;
      if (bookId === "new") return;

      const { data: book } = await getBook(bookId);
      this.setState({ book: this.mapToViewModel(book) });
    } catch (ex) {
      if (ex.response && ex.response.status === 404)
        this.props.history.replace("/not-found");
    }
  }

  async componentDidMount() {
    await this.populateBook();
    const currentUser = auth.getCurrentUser();
    this.setState({ currentUser });

    const data = {
        customer: {
            customerId: currentUser.id,
            name: currentUser.name
        },
        book: {
            title: this.state.book.title,
            author: this.state.book.author,
            dailyRentalRate: this.state.book.dailyRentalRate
        }
    }
    this.setState({ data });
  }

  mapToViewModel(book) {
    return {
      _id: book._id,
      title: book.title,
      author: book.author,
      genreId: book.genre._id,
      numberInStock: book.numberInStock,
      dailyRentalRate: book.dailyRentalRate
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
          {this.renderHeadder("Title", this.state.book.title)}
          {this.renderHeadder("Author", this.state.book.author)}
          {this.renderHeadder("Daily Rental Rate", this.state.book.dailyRentalRate)}
          {this.renderButton("Borrow")}
        </form>
      </div>
    );
  }
}

export default BorrowBook;
