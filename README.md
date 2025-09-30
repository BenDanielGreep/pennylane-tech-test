# Ben Daniel-Greep - Accounting App Prototype

## Update after interview

# New feaures

- Pagination: Users can now paginate and can see 10 results per page.
- Edit invoice: Users can now edit an invoice (if not paid or finalised). The UI is similar to the create invoice flow (In future these pages could be refactored to derive from a single source).
- Filters: By customer or by date range. This uses the API filters so that pagination still works. (NB filtering by totals wasn't possible because the totals don't exist on all invoices)
- Sort By: Users can sort by ID, Date, Deadline or Total, both ascending and desceding. This uses the API so that pagination still functions (NB sorting by total is not great because the totals don't exist on all invoices).
- ErrorBoundary: used to create safer error handling when api or page errors occur.

# Fixes

- Paid invoices would error when attempting deletion. The API does not allow deletion of paid invoices. Therefore the delete button has been disabled for paid invoices.
- Homepage: after deleting an invoice, the app would reset to the incorect url. This has been fixed.

# Improvements
- More test coverage including invoiceTable, invoiceShow, invoiceList, invoiceCreate and all new components.
- Invoices now have a Finalized tag as well as a Paid tag on the table view. 


## Features

This app came with a simple table display so I had to add a **Create page** and a **View page**. The invoices can be marked 'finalised' or 'paid' and deleted on the View page. I used the prebuilt components on the Create page to create invoices and send them to the API.

- **Pagination**: Added server-side pagination using the API's pagination, keeping the UI minimal.



### Architecture & Components

- **PageHeader Component**: Added a reusable PageHeader component (with tests) that can be used across the app, fitting with React's component-based architecture
- **Tabs Component**: Created a Tabs component that allows users to filter on certain types of invoices
- **Component Structure**: Structured the app into a Components directory with folders for each component
- **Code Organization**: Moved the CustomerAutocomplete and ProductAutocomplete files into the InvoiceCreate directory as they are only used there (for now)

### Clean Architecture

- **Logic Extraction**: Extracted logic from InvoiceShow, InvoiceCreate and InvoicesList into custom hooks, keeping business logic separated from rendering logic
- **Component Separation**: Extracted the table component into its own directory in line with React principles

### Added tech

I had to install axios directly in order to get the app running - the API client wouldn't instantiate with the existing OpenAPIClient setup. 
I installed 'axe' for accessibility testing.
I installed gh-pages for quick deployment to GitHub pages

## Potential Improvements

### Features

- **Edit Invoice** before finalisation
- **Custom modal dialogs** for notifications, warnings and errors
- **Sidebar menu** with navigation options
- **Advanced Filtering** by various facets (customer, orderId, product, date, etc.)
- **Export invoice as PDF** functionality
- **Enhanced Create Invoice** features including custom tax, layout options, email integration
- **Loading skeleton** for better FirstContentfulPaint
- **Edit Invoice** before finalisation
- **Custom modal dialogs** for notifications, warnings and errors
- **Sidebar menu** with navigation options
- **Advanced Filtering** by various facets (customer, orderId, product, date, etc.)
- **Export invoice as PDF** functionality
- **Enhanced Create Invoice** features including custom tax, layout options, email integration
- **Loading skeleton** for better FirstContentfulPaint

### Tech Improvements

- **Error Boundary** to catch API/rendering errors
- **Unit tests** for all components
- **Integration tests** for larger components
- **E2E tests** with Nightwatch or Playwright
- **Server-side filtering** implementation using API filter parameters
- **State management** optimization with React Query or SWR
- **Performance optimization** with React.memo and useMemo where appropriate
- **Styles improvement** by removing bootsrap in favour of a more reuasble system like Tailwind, or css modules