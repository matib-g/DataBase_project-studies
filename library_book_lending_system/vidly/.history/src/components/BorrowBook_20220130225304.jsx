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
    try {
      const bookId = this.props.match.params.id;
      if (bookId === "new") return;

      const currentUser = auth.getCurrentUser();
      this.setState({ currentUser });

      const { data: book } = await getBook(bookId);
      this.setState({ data: this.mapToViewModel(book, currentUser) });
      this.setState({customer: this.mapToViewModelCustomer(currentUser)});
      this.setState({book: this.mapToViewModelBook(book)});
    } catch (ex) {
        console.log("wyrzucam");
        console.log(ex);
      if (ex.response && ex.response.status === 404)
        this.props.history.replace("/not-found");
    }
  }

  async componentDidMount() {
    await this.populateBookAndUser();
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

  mapToViewModelBook(book) {
      return {
        book: {
            title: book.title,
            author: book.author,
            dailyRentalRate: book.dailyRentalRate
        }
      }
  }

  mapToViewModelCustomer(user) {
    return {
        customer: {
            customerId: user._id,
            name: user.name
        }
    }
}

  doSubmit = async () => {
    await saveRental(this.state.data);

    this.props.history.push("/books");
  };

  render() {
      console.log(this.state);

    return (
      <div>
        <h1>Borrow Book</h1>
        <form onSubmit={this.handleSubmit}>
          {this.renderHeadder("Title", this.state.book.title)}
          {this.renderHeadder("Author", this.state.book.author)}
          {this.renderHeadder("Daily Rental Rate", this.state.book.dailyRentalRate)}
          {this.renderButtonNoValid("Borrow")}
        </form>
      </div>
    );
  }
}

export default BorrowBook;
