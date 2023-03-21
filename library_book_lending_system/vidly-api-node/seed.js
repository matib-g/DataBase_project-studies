const { Genre } = require("./models/genre");
const { Book } = require("./models/book");
const mongoose = require("mongoose");
const config = require("config");

const data = [
  {
    name: "Comedy",
    books: [
      { title: "Scoop", author: "Evelyn Waugh", numberInStock: 5, dailyRentalRate: 2 },
      { title: "My Life", author: "Paddy McGuinness", numberInStock: 10, dailyRentalRate: 2 },
      { title: "That Moment When", author: "Mo Gilligan", numberInStock: 15, dailyRentalRate: 2 }
    ]
  },
  {
    name: "Action",
    books: [
      { title: "Deep Sleep", author: "Steven Konkoly", numberInStock: 5, dailyRentalRate: 2 },
      { title: "The Broken One", author: "Brittney Sahin", numberInStock: 10, dailyRentalRate: 2 },
      { title: "The Alchemist", author: "Paulo Coelho", numberInStock: 15, dailyRentalRate: 2 }
    ]
  },
  {
    name: "Romance",
    books: [
      { title: "Pride and Prejudice", author: "Jane Austen", numberInStock: 5, dailyRentalRate: 2 },
      { title: "Beautiful Disaster", author: "Jamie McGuire", numberInStock: 10, dailyRentalRate: 2 },
      { title: "Twilight", author: "Stephenie Meyer", numberInStock: 15, dailyRentalRate: 2 }
    ]
  },
  {
    name: "Thriller",
    books: [
      { title: "The Push", author: "Ashley Audrain", numberInStock: 5, dailyRentalRate: 2 },
      { title: "Not a Happy Family", author: "Shari Lapena", numberInStock: 10, dailyRentalRate: 2 },
      { title: "We Begin at the End", author: "Chris Whitaker", numberInStock: 15, dailyRentalRate: 2 }
    ]
  }
];

async function seed() {
  await mongoose.connect(config.get("db"));

  await Book.deleteMany({});
  await Genre.deleteMany({});

  for (let genre of data) {
    const { _id: genreId } = await new Genre({ name: genre.name }).save();
    const books = genre.books.map(book => ({
      ...book,
      genre: { _id: genreId, name: genre.name }
    }));
    await Book.insertMany(books);
  }

  mongoose.disconnect();

  console.info("Done!");
}

seed();
