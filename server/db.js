// db.js
const sqlite3 = require('sqlite3').verbose();

// Connect to SQLite database
const db = new sqlite3.Database('./users.db', (err) => {
  if (err) console.error('Database connection error:', err);
  else console.log('Connected to SQLite database.');
});

// Create users table if it doesn't exist
db.run(
  `CREATE TABLE IF NOT EXISTS users (
     id INTEGER PRIMARY KEY AUTOINCREMENT,
     name TEXT NOT NULL,
     email TEXT UNIQUE NOT NULL,
     password TEXT NOT NULL,
     created_at DATETIME DEFAULT CURRENT_TIMESTAMP
   )`
);

// Update analysis_results table for the new structure
db.run(`DROP TABLE IF EXISTS analysis_results`); // Be careful with this in production!

db.run(`
  CREATE TABLE IF NOT EXISTS analysis_results (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    filename TEXT,
    analysis_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    daily_sales TEXT,
    weekly_sales TEXT,
    monthly_sales TEXT,
    best_selling_pizzas TEXT,
    best_selling_categories TEXT,
    sales_by_pizza_size TEXT,
    sales_by_ingredient_count TEXT,
    employee_performance TEXT,
    sales_by_location TEXT,
    profit_analysis TEXT,
    review_trends TEXT,
    vendor_performance TEXT,
    outliers TEXT,
    market_basket_analysis TEXT,
    customer_segments TEXT,
    FOREIGN KEY(user_id) REFERENCES users(id)
  )
`);

module.exports = db;
