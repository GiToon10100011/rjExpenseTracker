# Rong & Jinu Expense Tracker

A modern, multi-currency shared expense tracking application built with Next.js, React, and TypeScript. Perfect for managing household expenses between two people with automatic balance calculations and multi-language support.

## Features

### 💰 Multi-Currency Support
- **Supported Currencies**: Japanese Yen (JPY), Taiwan Dollar (TWD), Korean Won (KRW)
- **Automatic Conversion**: Expenses are automatically converted to your preferred display currency
- **Exchange Rate Calculator**: Built-in currency converter with real-time rate calculations
- **Static Exchange Rates**: Pre-configured exchange rates (can be updated as needed)

### 🌍 Multi-Language Support
- **Languages**: Japanese (日本語), Korean (한국어), English
- **Full Localization**: All UI elements, labels, and messages are translated
- **Easy Language Switching**: Toggle between languages with a single click

### 📊 Expense Management
- **Add Expenses**: Track expenses with description, amount, currency, payer, category, and date
- **Expense Categories**: Food, Utilities, Rent, Transport, Entertainment, Other
- **Paid/Unpaid Status**: Mark expenses as settled or pending
- **Filtering**: View all expenses, only paid, or only unpaid expenses
- **Delete Expenses**: Remove expenses you no longer need

### 💵 Balance Calculation
- **Automatic Split**: Expenses are automatically split 50/50 between Rong and Jinu
- **Net Balance**: See who owes whom and by how much
- **Visual Summary**: Three summary cards showing:
  - Rong's total paid
  - Jinu's total paid
  - Net balance (who owes what)

### 🎨 Modern UI
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **Dark Mode Support**: Built-in theme support (ready for dark mode)
- **Clean Interface**: Modern, minimalist design using shadcn/ui components
- **Intuitive UX**: Easy-to-use interface with clear visual feedback

## Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) with Turbopack
- **Language**: TypeScript
- **UI Library**: React 19
- **Styling**: Tailwind CSS
- **Components**: Radix UI primitives via shadcn/ui
- **State Management**: React Context API
- **Form Handling**: React Hook Form with Zod validation
- **Icons**: Lucide React

## Getting Started

### Prerequisites

- Node.js 18+ (or higher)
- npm, yarn, or pnpm package manager

### Installation

1. **Clone or navigate to the project directory**:
   ```bash
   cd rjExpenseTracker
   ```

2. **Install dependencies**:
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Run the development server**:
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

4. **Open your browser**:
   Navigate to [http://localhost:3000](http://localhost:3000)

### Building for Production

```bash
npm run build
npm start
```

## Project Structure

```
rjExpenseTracker/
├── app/                    # Next.js app directory
│   ├── layout.tsx         # Root layout with metadata
│   └── page.tsx           # Main page component
├── components/            # React components
│   ├── ui/               # shadcn/ui components
│   ├── add-expense-dialog.tsx
│   ├── expense-header.tsx
│   ├── expense-list.tsx
│   ├── expense-summary.tsx
│   └── exchange-rate-panel.tsx
├── lib/                  # Core logic and utilities
│   ├── types.ts         # TypeScript types and currency utilities
│   ├── i18n.ts         # Internationalization translations
│   ├── expense-context.tsx  # React context for state management
│   └── utils.ts        # Utility functions
├── hooks/              # Custom React hooks
└── public/             # Static assets
```

## Key Components

### ExpenseProvider
The main context provider that manages:
- Expense list state
- Current locale (language)
- Display currency preference
- Filter state (all/paid/unpaid)
- CRUD operations for expenses

### ExpenseSummary
Displays three summary cards:
- Individual totals paid by each person
- Net balance showing who owes whom

### ExpenseList
Shows all expenses with:
- Category icons
- Payer badges
- Amount in original and converted currency
- Split breakdown per person
- Paid/unpaid toggle
- Delete functionality

### AddExpenseDialog
Modal dialog for adding new expenses with:
- Description input
- Amount and currency selection
- Payer selection (Rong/Jinu)
- Category selection
- Date picker

### ExchangeRatePanel
Sidebar panel showing:
- Current exchange rates
- Currency converter tool
- Quick reference conversions

## Currency Exchange Rates

The app uses static exchange rates (base: 1 JPY):
- **JPY → TWD**: 0.22
- **JPY → KRW**: 9.2
- **TWD → JPY**: 4.55
- **TWD → KRW**: 41.8
- **KRW → JPY**: 0.109
- **KRW → TWD**: 0.024

*Note: These are approximate rates. Update them in `lib/types.ts` if needed.*

## Usage

### Adding an Expense

1. Click the **"Add Expense"** button
2. Fill in the expense details:
   - Description (e.g., "Groceries", "Electric bill")
   - Amount
   - Currency (JPY, TWD, or KRW)
   - Paid by (Rong or Jinu)
   - Category
   - Date
3. Click **"Add"** to save

### Viewing Balance

The summary cards at the top show:
- **Rong's Total**: How much Rong has paid
- **Jinu's Total**: How much Jinu has paid
- **Net Balance**: Who owes whom and the amount

### Filtering Expenses

Use the filter tabs to view:
- **All**: All expenses
- **Unpaid**: Only unsettled expenses
- **Paid**: Only settled expenses

### Marking as Paid

Click the checkbox next to any expense to toggle its paid/unpaid status.

### Changing Language

Click the language selector in the header to switch between Japanese, Korean, and English.

### Changing Display Currency

Click the currency selector in the header to change how amounts are displayed (JPY, TWD, or KRW).

## Data Storage

Currently, expenses are stored in React state (in-memory). This means:
- ✅ Data persists during the session
- ❌ Data is lost on page refresh

**Future Enhancement**: Consider adding:
- LocalStorage persistence
- Backend API integration
- Database storage

## Development

### Available Scripts

- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

### Code Style

- TypeScript strict mode enabled
- ESLint configured for Next.js
- Prettier formatting (if configured)

## Customization

### Adding New Currencies

1. Update `Currency` type in `lib/types.ts`
2. Add currency symbol and label
3. Add exchange rates
4. Update UI components to include new currency option

### Adding New Languages

1. Add locale to `Locale` type in `lib/i18n.ts`
2. Add translations object for the new locale
3. Add locale name to `localeNames` object

### Modifying Exchange Rates

Update the `exchangeRates` object in `lib/types.ts` with current rates.

## License

This project is for personal use. Feel free to modify and use as needed.

## Contributing

This is a personal project, but suggestions and improvements are welcome!

---

**Built with ❤️ for Rong & Jinu**
