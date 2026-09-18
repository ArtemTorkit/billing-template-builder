# Invoice Template Customizer

Responsive frontend demo for customizing a Polish invoice template while seeing the result in real time.

## Run locally

```bash
npm install
npm run dev
```

## Available commands

```bash
npm test -- --run
npm run build
```

## Included interactions

- Edit template name, invoice details, seller, buyer, notes, and line items.
- Add and remove line items with live recalculation of subtotal, VAT, and total.
- Upload or remove a custom logo; color controls are disabled while a custom logo is active.
- Jump from preview edit actions directly to the relevant editor section.
- Responsive desktop split view and mobile stacked layout.
- Polish-language accounting content and PLN currency formatting.

This is a frontend-only prototype; saving is represented by a confirmation toast rather than a backend request.
# billing-template-builder

## Implementation

- Built with React, TypeScript, and Vite.
- Form state is managed in React and shared with the live invoice preview.
- Line-item totals and VAT are recalculated from the current form values.
- Responsive styles support desktop split view and mobile stacked layout.
- Includes focused component tests with Vitest and Testing Library.
