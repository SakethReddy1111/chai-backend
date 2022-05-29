const express = require("express");
const app = express();
// This is your test secret API key.
const stripe = require("stripe")(
  "sk_test_51L4I6cSBh3a1AaNFvSyHdb9ByRzo78KFRm6S1VLdiuGanpV6s37l1NUOTVFhHlvi7278owMtjMqdKtw7WfAIKrnM00mVkbcbjL"
);
const user = require("./model/user");
var bodyParser = require("body-parser");
const port = process.env.PORT || 4242;

app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(bodyParser.json());
const cors = require("cors");
app.use(cors());
app.use(express.static("public"));
app.use(express.json());

const connect = require("./connect/db");

const calculateOrderAmount = (items) => {
  let sum = 50;

  // Replace this constant with a calculation of the order's amount
  // Calculate the order total on the server to prevent
  // people from directly manipulating the amount on the client
  return sum;
};

app.post("/api/v1/create-intent", async (req, res) => {
  const { items } = req.body;

  // Create a PaymentIntent with the order amount and currency
  const paymentIntent = await stripe.paymentIntents.create({
    amount: calculateOrderAmount(items),
    currency: "inr",
    automatic_payment_methods: {
      enabled: true,
    },
  });

  await user.create(paymentIntent);

  res.send({
    clientSecret: paymentIntent.client_secret,
  });
});

app.get("/api/v1/get_intents", async (req, res) => {
  try {
    const items = await user.find().lean().exec();

    return res.status(200).send(items);
  } catch (er) {
    return res.status(400).send(er);
  }
});

app.listen(port, async () => {
  try {
    await connect();
    console.log("Node server listening on port 4242!");
  } catch (er) {
    console.log(er);
  }
});
