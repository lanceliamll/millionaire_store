const express = require("express");
const router = express.Router();
const authorized = require("../../middleware/authorized");
const Item = require("../../models/Item");

//@ROUTE          localhost:5000/api/items/
//@DESCRIPTION    get items
//@ACCESS         private
router.get("/", authorized, async (req, res) => {
  try {
    let items = await Item.find();

    res.json(items);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
});

//@ROUTE          localhost:5000/api/items/:id
//@DESCRIPTION    get item by id
//@ACCESS         private
router.get("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    let item = await Item.findById(id);

    if (!item) {
      return res.status(404).json({ message: "No item found!" });
    }

    res.json(item);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
});

//@ROUTE          localhost:5000/api/items/create
//@DESCRIPTION    createItem
//@ACCESS         private
router.post("/create", authorized, async (req, res) => {
  const { itemName, price } = req.body;
  const { id } = req.user;

  try {
    let item = await Item.findOne({ itemName });

    if (item) {
      return res.status(400).json({ message: "Item already exists" });
    }

    item = await new Item({
      user: id,
      itemName,
      price
    });

    await item.save();

    res.json(item);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
});

module.exports = router;
