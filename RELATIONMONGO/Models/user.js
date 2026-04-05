const mongose = require("mongoose");
const { Schema } = mongose;
main()
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.log(err));
async function main() {
  await mongose.connect("mongodb://localhost:27017/relationDemo");
}
// Creating a schema of user to address where one user can have many(but few addreses.. like 4,5 only not 1,000) addresses
const userSchema = new Schema({
  name: String,
  addresses: [
    {
      location: String,
      city: String,
      _id: false, // to prevent creating a new _id for each address
    },
  ],
});
const User = mongose.model("User", userSchema);

//adding users with addresses
const addUsers = async () => {
  let user1 = new User({
    name: "John Doe",
    addresses: [
      { location: "123 Main St", city: "New York" },
      { location: "456 Elm St", city: "Los Angeles" },
    ],
  });
  let result = await user1.save();
  console.log(result);
};
addUsers();
//here adress is the child theme and user is the parent theme. we are embedding the address in the user document.
//  this is called embedding or denormalization.
// it is useful when we have a one-to-few relationship and we want to retrieve the data in a single query.
