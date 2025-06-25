// Import the 'pg' module and 'dotenv' for environment variables
import pkg from 'pg';
import dotenv from 'dotenv';

// Load environment variables from .env file into process.env
dotenv.config();

// Destructure Pool constructor from the pg package
const { Pool } = pkg;

// Create a connection pool to the PostgreSQL database
const pool = new Pool({
  user: process.env.DB_USER,       // e.g., 'postgres'
  host: process.env.DB_HOST,       // e.g., 'localhost' or your cloud DB address
  database: process.env.DB_DATABASE, // e.g., 'moviebooking'
  password: process.env.DB_PASSWORD, // Secure DB password stored in .env
  port: process.env.DB_PORT,       // Default PostgreSQL port is 5432
});

// Export the pool instance to reuse across the backend (routes, services, etc.)
export default pool;
