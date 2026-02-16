# Database Setup

This project uses SQLite with `better-sqlite3` for data persistence.

## Installation

After cloning the repository, install dependencies:

```bash
npm install
# or
pnpm install
# or
yarn install
```

The database will be automatically created in the `data/` directory on first run.

## Database Structure

The database contains a single `expenses` table with the following schema:

```sql
CREATE TABLE expenses (
  id TEXT PRIMARY KEY,
  description TEXT NOT NULL,
  amount REAL NOT NULL,
  currency TEXT NOT NULL CHECK(currency IN ('TWD', 'WON', 'YEN')),
  paidBy TEXT NOT NULL CHECK(paidBy IN ('Rong', 'Jinu')),
  category TEXT NOT NULL CHECK(category IN ('food', 'utilities', 'rent', 'transport', 'entertainment', 'other')),
  date TEXT NOT NULL,
  isPaid INTEGER NOT NULL DEFAULT 0 CHECK(isPaid IN (0, 1)),
  createdAt TEXT NOT NULL DEFAULT (datetime('now')),
  updatedAt TEXT NOT NULL DEFAULT (datetime('now'))
)
```

## API Routes

The following API routes are available:

- `GET /api/expenses` - Get all expenses
- `POST /api/expenses` - Create a new expense
- `PUT /api/expenses` - Update an expense
- `DELETE /api/expenses?id={id}` - Delete an expense
- `GET /api/expenses/[id]` - Get a specific expense
- `PUT /api/expenses/[id]` - Update a specific expense
- `DELETE /api/expenses/[id]` - Delete a specific expense
- `POST /api/expenses/[id]/toggle` - Toggle the paid status of an expense

## Database Location

The SQLite database file is stored in:
- `data/expenses.db`

This directory is automatically created if it doesn't exist.

## Notes

- The database file (`data/expenses.db`) is excluded from git (see `.gitignore`)
- Data persists across server restarts
- The database is initialized automatically when the server starts
- Sample data is loaded if the database is empty (fallback)
