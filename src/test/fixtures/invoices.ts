import { Invoice } from 'types'

export const customerAlice = {
  id: 1,
  first_name: 'Alice',
  last_name: 'Smith',
  address: '',
  zip_code: '',
  city: 'London',
  country: '',
  country_code: '',
}

export const customerBob = {
  id: 2,
  first_name: 'Bob',
  last_name: 'Brown',
  address: '',
  zip_code: '',
  city: 'Paris',
  country: '',
  country_code: '',
}

export const customerPenny = {
  id: 3,
  first_name: 'Penny',
  last_name: 'Lane',
  address: '',
  zip_code: '',
  city: 'London',
  country: '',
  country_code: '',
}

export const productAudiS5 = {
  id: 5,
  label: 'Audi S5',
  vat_rate: '20',
  unit: 'piece',
  unit_price: '25000.00',
  unit_price_without_tax: '20833.33',
  unit_tax: '4166.67',
} as any

export const productBuickLaCrosse = {
  id: 10,
  unit_price: '20000.00',
  vat_rate: '10',
  label: 'Buick LaCrosse',
  unit: 'piece',
  unit_price_without_tax: '18181.82',
  unit_tax: '1818.18',
}

export const productChevySilverado = {
  id: 11,
  unit_price: '42000.00',
  vat_rate: '20',
  label: 'Chevy Silverado',
  unit: 'piece',
  unit_price_without_tax: '35000.00',
  unit_tax: '7000.00',
}

export const productFordFiesta = {
  id: 12,
  unit_price: '11000.00',
  vat_rate: '20',
  label: 'Ford Fiesta',
  unit: 'piece',
  unit_price_without_tax: '9166.67',
  unit_tax: '1833.33',
}

export const productAudiA7 = {
  id: 13,
  unit_price: '65000.00',
  vat_rate: '0',
  label: 'Audi A7',
  unit: 'piece',
  unit_price_without_tax: '65000.00',
  unit_tax: '0.00',
}

export function buildLine({
  id,
  invoice_id,
  product,
  quantity,
}: {
  id: number
  invoice_id: number
  product:
    | typeof productAudiS5
    | typeof productBuickLaCrosse
    | typeof productChevySilverado
    | typeof productFordFiesta
    | typeof productAudiA7
  quantity: number
}) {
  const q = quantity
  const gross = parseFloat(product.unit_price) * q
  const tax = parseFloat(product.unit_tax) * q
  return {
    id,
    invoice_id,
    product_id: product.id,
    label: product.label,
    quantity: q,
    unit: product.unit,
    vat_rate: product.vat_rate,
    price: gross.toFixed(2),
    tax: tax.toFixed(2),
    product,
  }
}

export const invoiceEditFixture: Invoice = {
  id: 321,
  customer_id: 22,
  finalized: false,
  paid: false,
  date: '2024-04-01',
  deadline: '2024-04-15',
  total: null,
  tax: null,
  invoice_lines: [
    buildLine({ id: 90, invoice_id: 321, product: productAudiS5, quantity: 3 }),
  ],
  customer: {
    id: 22,
    first_name: 'Eva',
    last_name: 'Stone',
    address: '',
    zip_code: '',
    city: '',
    country: '',
    country_code: '',
  },
}

export const invoiceShowFixture: Invoice = {
  id: 999,
  finalized: true,
  paid: false,
  date: '2024-03-01',
  deadline: '2024-03-15',
  customer: {
    id: 1,
    first_name: 'Jane',
    last_name: 'Doe',
    address: '1 Main St',
    city: 'Berlin',
    zip_code: '10000',
    country: 'DE',
    country_code: 'DE',
  },
  invoice_lines: [
    buildLine({ id: 10, invoice_id: 999, product: productAudiS5, quantity: 2 }),
  ],
  total: (25000 * 2).toFixed(2),
  tax: (parseFloat(productAudiS5.unit_tax) * 2).toFixed(2),
  customer_id: 1,
}

export const invoiceTableInvoices: Invoice[] = [
  {
    id: 54321,
    customer_id: 1,
    finalized: true,
    paid: true,
    date: '2024-01-01',
    deadline: '2024-01-15',
    invoice_lines: [
      buildLine({
        id: 1,
        invoice_id: 54321,
        product: productFordFiesta,
        quantity: 1,
      }),
    ],
    total: productFordFiesta.unit_price,
    tax: productFordFiesta.unit_tax,
    customer: customerAlice,
  },
  {
    id: 54322,
    customer_id: 2,
    finalized: false,
    paid: false,
    date: '2024-02-01',
    deadline: '2024-02-20',
    total: null,
    tax: null,
    invoice_lines: [
      buildLine({
        id: 1,
        invoice_id: 54322,
        product: productBuickLaCrosse,
        quantity: 1,
      }),
      buildLine({
        id: 2,
        invoice_id: 54322,
        product: productChevySilverado,
        quantity: 1,
      }),
    ],
    customer: customerBob,
  },
  {
    id: 54324,
    customer_id: 3,
    finalized: true,
    paid: false,
    date: '2024-01-04',
    deadline: '2024-01-25',
    invoice_lines: [
      buildLine({
        id: 1,
        invoice_id: 54324,
        product: productAudiA7,
        quantity: 1,
      }),
      buildLine({
        id: 2,
        invoice_id: 54324,
        product: productChevySilverado,
        quantity: 1,
      }),
    ],
    total: (65000 + 42000).toFixed(2),
    tax: (
      parseFloat(productAudiA7.unit_tax) +
      parseFloat(productChevySilverado.unit_tax)
    ).toFixed(2),
    customer: customerPenny,
  },
]

export const invoiceTotalsTwoLines: Invoice = {
  id: 1,
  customer_id: 1,
  finalized: false,
  paid: false,
  date: '2025-01-01',
  deadline: '2025-01-15',
  total: null,
  tax: null,
  customer: customerAlice,
  invoice_lines: [
    buildLine({
      id: 1,
      invoice_id: 1,
      product: productFordFiesta,
      quantity: 2,
    }),
    buildLine({ id: 2, invoice_id: 1, product: productAudiA7, quantity: 1 }),
  ],
}

export const invoiceTotalsTopLevel: Invoice = {
  id: 2,
  customer_id: 1,
  finalized: false,
  paid: false,
  date: '2025-01-01',
  deadline: '2025-01-15',
  total: (
    parseFloat(productAudiS5.unit_price) +
    parseFloat(productBuickLaCrosse.unit_price)
  ).toFixed(2),
  tax: (
    parseFloat(productAudiS5.unit_tax) +
    parseFloat(productBuickLaCrosse.unit_tax)
  ).toFixed(2),
  customer: customerAlice,
  invoice_lines: [
    buildLine({ id: 1, invoice_id: 2, product: productAudiS5, quantity: 1 }),
    buildLine({
      id: 2,
      invoice_id: 2,
      product: productBuickLaCrosse,
      quantity: 1,
    }),
  ],
}

export const invoiceTotalsInvalid: Invoice = {
  id: 3,
  customer_id: 1,
  finalized: false,
  paid: false,
  date: '2025-01-01',
  deadline: '2025-01-15',
  total: null,
  tax: null,
  customer: customerAlice,
  invoice_lines: [
    {
      ...buildLine({
        id: 1,
        invoice_id: 3,
        product: productAudiS5,
        quantity: 1,
      }),
      price: 'abc',
      tax: 'xyz',
    },
  ],
}

export const invoiceTotalsEmpty: Invoice = {
  id: 4,
  customer_id: 1,
  finalized: false,
  paid: false,
  date: '2025-01-01',
  deadline: '2025-01-15',
  total: null,
  tax: null,
  customer: customerAlice,
  invoice_lines: [],
}
