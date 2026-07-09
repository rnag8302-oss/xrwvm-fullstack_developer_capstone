const express = require('express');
const mongoose = require('mongoose');
const fs = require('fs');
const  cors = require('cors')
const app = express()
const port = 3030;

app.use(cors())
app.use(require('body-parser').urlencoded({ extended: false }));

const reviews_data = JSON.parse(fs.readFileSync("reviews.json", 'utf8'));
const dealerships_data = JSON.parse(fs.readFileSync("dealerships.json", 'utf8'));
// Add this logic to ensure data is saved when the server starts
const Dealer = require('./dealership');
const Review = require('./review');

const seedDatabase = async () => {
    try {
        await Dealer.deleteMany({});
        await Dealer.insertMany(dealerships_data.dealerships);
        await Review.deleteMany({});
        await Review.insertMany(reviews_data.reviews);
        console.log("Database seeded successfully!");
    } catch (error) {
        console.error("Error seeding database:", error);
    }
};

// Replace lines 28-32 with this:
mongoose.connect("mongodb://db_container:27017/dealershipsDB")
  .then(async () => {
    console.log("--- STARTING APP.JS ---");
const express = require('express');
const mongoose = require('mongoose');
console.log("--- LOADED EXPRESS AND MONGOOSE ---");
// ... rest of your code
    await seedDatabase();
  })
  .catch((err) => console.error("Could not connect to MongoDB", err));

const Reviews = require('./review');

const Dealerships = require('./dealership');

// Express route to home
app.get('/', async (req, res) => {
    res.send("Welcome to the Mongoose API")
});

// Express route to fetch all reviews
app.get('/fetchReviews', async (req, res) => {
  try {
    const documents = await Reviews.find();
    res.json(documents);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching documents' });
  }
});

// Express route to fetch reviews by a particular dealer
app.get('/fetchReviews/dealer/:id', async (req, res) => {
  try {
    const documents = await Reviews.find({dealership: req.params.id});
    res.json(documents);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching documents' });
  }
});

// Express route to fetch all dealerships
app.get('/fetchDealers', async (req, res) => {
    try {
      const documents = await Dealerships.find();
      console.log("Documents found:", documents.length); // ADD THIS LINE TO DEBUG
      res.json(documents);
    } catch (error) {
      res.status(500).json({ error: 'Error fetching dealerships' });
    }
  });
  
  // Express route to fetch Dealers by a particular state
  app.get('/fetchDealers/:state', async (req, res) => {
    try {
      const documents = await Dealerships.find({ state: req.params.state });
      res.json(documents);
    } catch (error) {
      res.status(500).json({ error: 'Error fetching dealerships by state' });
    }
  });
  
  // Express route to fetch dealer by a particular id
  app.get('/fetchDealer/:id', async (req, res) => {
    try {
      // Assuming 'id' in your database is a number, if it's a string, just use req.params.id
      const document = await Dealerships.findOne({ id: parseInt(req.params.id) });
      if (!document) {
        return res.status(404).json({ error: 'Dealer not found' });
      }
      res.json(document);
    } catch (error) {
      res.status(500).json({ error: 'Error fetching dealer by ID' });
    }
  });

//Express route to insert review
app.post('/insert_review', express.raw({ type: '*/*' }), async (req, res) => {
  data = JSON.parse(req.body);
  const documents = await Reviews.find().sort( { id: -1 } )
  let new_id = documents[0]['id']+1

  const review = new Reviews({
		"id": new_id,
		"name": data['name'],
		"dealership": data['dealership'],
		"review": data['review'],
		"purchase": data['purchase'],
		"purchase_date": data['purchase_date'],
		"car_make": data['car_make'],
		"car_model": data['car_model'],
		"car_year": data['car_year'],
	});

  try {
    const savedReview = await review.save();
    res.json(savedReview);
  } catch (error) {
		console.log(error);
    res.status(500).json({ error: 'Error inserting review' });
  }
});

// Start the Express server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
