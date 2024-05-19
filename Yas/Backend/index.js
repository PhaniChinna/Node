const express = require("express");
const sqlite3 = require("sqlite3");
const { open } = require("sqlite");

const app = express();
const port = 3000;

// Middleware to parse JSON bodies
app.use(express.json());

// Open the SQLite database
let database;

(async () => {
  database = await open({
    filename: "database.db",
    driver: sqlite3.Database,
  });

  // Create the Persons table if it doesn't exist
  await database.exec(`
    CREATE TABLE IF NOT EXISTS Persons (
      PersonID INTEGER PRIMARY KEY,
      LastName TEXT,
      FirstName TEXT,
      Address TEXT,
      City TEXT
    )
  `);

  // Sample data insertion
  await database.exec(`
    INSERT INTO Persons (PersonID, LastName, FirstName, Address, City)
    VALUES
      (13, 'Reddy', 'Ravi', 'New', 'HYD'),
      (14, 'R', 'RVGi', 'Nw', 'HYkD'),
      (15, 'Red', 'RYi', 'ew', 'HYHD'),
      (16, 'Redd', 'RCi', 'w', 'HTYD'),
      (17, 'y', 'Rbi', 'N', 'HYUD'),
      (18, 'dy', 'vi', 'E', 'Y'),
      (19, 'ddy', 'Ri', 'NBU', 'H'),
      (20, 'eddy', 'Rvi', 'NJw', 'D'),
      (21, 'Buy', 'Rai', 'Nnw', 'HD'),
      (22, 'RBuy', 'Ra', 'Nnw', 'USA')
  `);

  // Define the routes after the database is set up
  defineRoutes();
})();

const defineRoutes = () => {
  // Route to get all persons
  app.get("/data", async (request, response) => {
    try {
      const getPersonQuery = `SELECT * FROM Persons`;
      const getData = await database.all(getPersonQuery);
      response.send(getData);
    } catch (error) {
      response.status(500).send({ error: error.message });
    }
  });

  // Route to get persons with a specific last name pattern
  app.get("/data/lastname/:pattern", async (request, response) => {
    try {
      const pattern = request.params.pattern;
      const getPersonQuery = `SELECT * FROM Persons WHERE LastName LIKE ?`;
      const getData = await database.all(getPersonQuery, [`%${pattern}%`]);
      response.send(getData);
    } catch (error) {
      response.status(500).send({ error: error.message });
    }
  });

  // Route to get persons from a specific city
  app.get("/data/city/:city", async (request, response) => {
    try {
      const city = request.params.city;
      const getPersonQuery = `SELECT * FROM Persons WHERE City = ?`;
      const getData = await database.all(getPersonQuery, [city]);
      response.send(getData);
    } catch (error) {
      response.status(500).send({ error: error.message });
    }
  });

  // Route to get persons with a specific first name pattern
  app.get("/data/firstname/:pattern", async (request, response) => {
    try {
      const pattern = request.params.pattern;
      const getPersonQuery = `SELECT * FROM Persons WHERE FirstName LIKE ?`;
      const getData = await database.all(getPersonQuery, [`%${pattern}%`]);
      response.send(getData);
    } catch (error) {
      response.status(500).send({ error: error.message });
    }
  });

  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
};
