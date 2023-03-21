const Joi = require("joi");
const validate = require("../middleware/validate");
const { Rental } = require("../models/rental");
const { Book } = require("../models/book");
const auth = require("../middleware/auth");
const express = require("express");
const router = express.Router();

router.post("/", [auth, validate(validateReturn)], async (req, res) => {
  const rental = await Rental.lookup(req.body.customerId, req.body.bookId);

  if (!rental) return res.status(404).send("Rental not found.");

  if (rental.dateReturned)
    return res.status(400).send("Return already processed.");

  rental.return();
  await rental.save();

  await Book.update(
    { _id: rental.book._id },
    {
      $inc: { numberInStock: 1 }
    }
  );

  return res.send(rental);
});

function validateReturn(req) {
  const schema = {
    customerId: Joi.objectId().required(),
    bookId: Joi.objectId().required()
  };

  return Joi.validate(req, schema);
}

module.exports = router;
