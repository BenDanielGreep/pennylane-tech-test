# Ben Daniel-Greep - Accounting App Prototype

## Features

This app came with a simple table display so I had to add a **Create page** and a **View page**. The invoices can be marked 'finalised' or 'paid' and deleted on the View page. I use the prebuilt components on the Create page to create invoices and send them to the API.

### Architecture & Components

- **PageHeader Component**: Added a reusable PageHeader component (with tests) that can be used across the app, fitting with React's component-based architecture
- **Tabs Component**: Created a Tabs component that allows users to filter on certain types of invoices
- **Component Structure**: Structured the app into a Components directory with folders for each component
- **Code Organization**: Moved the CustomerAutocomplete and ProductAutocomplete files into the InvoiceCreate directory as they are only used there (for now)

### Clean Architecture

- **Logic Extraction**: Extracted logic from InvoiceShow, InvoiceCreate and InvoicesList into custom hooks, keeping business logic separated from rendering logic
- **Component Separation**: Extracted the table component into its own directory in line with React principles

## Potential Improvements

### Features

- [ ] **Edit Invoice** before finalisation
- [ ] **Custom modal dialogs** for notifications, warnings and errors
- [ ] **Sidebar menu** with navigation options
- [ ] **Advanced Filtering** by various facets (customer, orderId, product, date, etc.)
- [ ] **Export invoice as PDF** functionality
- [ ] **Enhanced Create Invoice** features including custom tax, layout options, email integration
- [ ] **Loading skeleton** for better FirstContentfulPaint

### Tech Improvements

- [ ] **Error Boundary** to catch API/rendering errors
- [ ] **Unit tests** for all components
- [ ] **Integration tests** for larger components
- [ ] **E2E tests** with Nightwatch or Playwright
- [ ] **Server-side filtering** implementation using API filter parameters
- [ ] **State management** optimization with React Query or SWR
- [ ] **Performance optimization** with React.memo and useMemo where appropriate