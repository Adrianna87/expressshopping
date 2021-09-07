const express = require("express")
const router = express.Router()
const ExpressError = require("../expressError")
const items = require("../fakeDb")

// GET show all items

router.get("/", function (req, res, next) {
  res.json({ items })
})

//GET show individual item
router.get("/:name", function (req, res, next) {
  const foundItem = items.find(item => item.name === req.params.name)
  if (foundItem === undefined) {
    throw new ExpressError("Item not found", 404)
  }
  res.json({ item: foundItem })
})

//POST add item to list
router.post("/", function (req, res, next) {
  try {
    if (!req.body.name) throw new ExpressError("Name is required", 400);
    if (!req.body.price) throw new ExpressError("Price is required", 400);
    const newItem = { name: req.body.name, price: req.body.price }
    items.push(newItem)
    return res.status(201).json({ name: newItem })
  } catch (e) {
    return next(e)
  }
})

//PATCH modify single item name and/or price
router.patch("/:name", function (req, res, next) {
  const foundItem = items.find(item => item.name === req.params.name)
  if (foundItem === undefined) {
    throw new ExpressError("Item not found", 404)
  }
  foundItem.name = req.body.name
  res.json({ item: foundItem })
})

//DELETE remove item from 
router.delete("/:name", function (req, res, next) {
  const foundItem = items.findIndex(item => item.name === req.params.name)
  if (foundItem === -1) {
    throw new ExpressError("Item not found", 404)
  }
  items.splice(foundItem, 1)
  res.json({ message: "Deleted" })
})

module.exports = router;