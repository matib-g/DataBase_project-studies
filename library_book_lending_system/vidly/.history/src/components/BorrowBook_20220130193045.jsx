import React from "react";
import Joi from "joi-browser";
import Form from "./common/form";
import { getBook, saveBook } from "../services/bookService";
import { getGenres } from "../services/genreService";
import { getRentals } from '../services/rentalService';
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
                name: "",
                phone: ""
            },
            book: {
                title: "",
                author: "",
                dailyRentalRate: ""
            }
    },
    //genres: [],
    errors: {},
    currentUser: {}
  };

  schema = {
    _id: Joi.string(),
    customer: Joi.object({
        name: Joi.string()
            .required()
            .label("CustomerName"),
        phone: Joi.number()
            .required()
            .label("Phone")
    }).required(),
    book: Joi.object({
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
    }).required()
  };

  /*async populateGenres() {
    const { data: genres } = await getGenres();
    this.setState({ genres });
  }*/

  async populateBook() {
    try {
      const bookId = this.props.match.params.id;
      if (bookId === "new") return;

      const { data: book } = await getBook(bookId);
      this.setState({ data: this.mapToViewModel(book) });
    } catch (ex) {
      if (ex.response && ex.response.status === 404)
        this.props.history.replace("/not-found");
    }
  }

  async componentDidMount() {
    await this.populateGenres();
    await this.populateBook();
    const { currentUser } = await auth.getCurrentUser();
    this.setState({ currentUser });
    console.log(currentUser);
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
    await saveBook(this.state.data);

    this.props.history.push("/books");
  };

  render() {
    return (
      <div>
        <h1>Borrow Book</h1>
        <form onSubmit={this.handleSubmit}>
          {this.renderInput("title", "Title")}
          {this.renderInput("author", "Author")}
          {this.renderSelect("genreId", "Genre", this.state.genres)}
          {this.renderInput("numberInStock", "Number in Stock", "number")}
          {this.renderInput("dailyRentalRate", "Rate")}
          {this.renderButton("Borrow")}
        </form>
      </div>
    );
  }
}

export default BorrowBook;
