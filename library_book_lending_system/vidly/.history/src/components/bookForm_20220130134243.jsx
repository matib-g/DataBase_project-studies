import React, { Component } from 'react';
import auth from "../services/authService";
import { Link, Route, Switch } from "react-router-dom";
import ProtectedRoute from "./components/common/protectedRoute";
import Table from "./common/table";
import Like from "./common/like";
import Joi from "joi-browser";
import Form from "./common/form";
import { getBook, saveBook } from "../services/bookService";
import { getGenres } from "../services/genreService";
import SaveBook from './SaveBook';
import BorrowBook from './BorrowBook';

class BookForm extends Component {
  state = {  }

  componentDidMount() {
    const user = auth.getCurrentUser();
    this.setState({ user });
  }

  render() {
    const { user } = this.state;

    return (
      <React.Fragment>
        <Switch>
          <ProtectedRoute path={"/saveBook"} component={SaveBook} />
          <ProtectedRoute path={"/BorrowBook"} component={BorrowBook} />
        </Switch>
      </React.Fragment>
    );
  }
}

export default BookForm;