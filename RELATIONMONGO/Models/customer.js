const mongose = require("mongoose");
const { Schema } = mongose;
main()
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.log(err));
async function main() {
  await mongose.connect("mongodb://localhost:27017/relationDemo");
}

// Creating a schema of  orders
const orderSchema = new Schema({
  item: String,
  price: Number,
});

// Creating a schema of customer with orders  where one customer can have many(like 4,0000or 5,0000 only not very large) list of orgders
const customerSchema = new Schema({
  name: String,
  orders: [
    {
      type: Schema.Types.ObjectId,
      ref: "Order",
    },
  ],
});

// customerSchema.pre("remove", async function () {
//     console.log("Pre middleware called for customer deletion");
// });

customerSchema.post("findOneAndDelete", async function (customer) {
  if (customer) {
    console.log("Post middleware called for customer deletion");
    let res = await Order.deleteMany({ _id: { $in: customer.orders } });
    console.log(res);
  }
});

const Customer = mongose.model("Customer", customerSchema);
const Order = mongose.model("Order", orderSchema);

//adding customer
// const addCustomer = async () => {
//   let cust1 = new Customer({
//     name: "John Cina",
//   });
//   let order1 = await Order.findOne({ item: "Chips" });
//   let order2 = await Order.findOne({ item: "food" });
//   let order3 = await Order.findOne({ item: "Tablet" });
//   cust1.orders.push(order1);
//   cust1.orders.push(order2);
//   cust1.orders.push(order3);
//   let res = await cust1.save();
//   console.log(res);
// };
// addCustomer();

//adding orders
// const addOrders = async () => {
//   let res = await Order.insertMany([
//     { item: "Chips", price: 1000 },
//     { item: "food", price: 500 },
//     { item: "Tablet", price: 300 },
//   ]);

//   console.log(res);
// };
// addOrders();

//here adress is the child theme and user is the parent theme. we are embedding the address in the user document.
//  this is called embedding or denormalization.
// it is useful when we have a one-to-few relationship and we want to retrieve the data in a single query.

//Function
const addCustom = async () => {
  let newCust = new Customer({
    name: "John Snow",
  });
  let newOrder1 = new Order({
    item: "Chocolate",
    price: 1000,
  });
  newCust.orders.push(newOrder1._id);

  await newOrder1.save();
  await newCust.save();

  console.log("Customer with orders created");
};
const deleteCustomer = async () => {
  let data = await Customer.findOneAndDelete({ name: "John Snow" });
  console.log(data);
};
// addCustom();
deleteCustomer();
