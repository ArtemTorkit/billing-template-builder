# Invoice Template Customizer Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a responsive frontend demo where users customize an invoice template and see the invoice update live.

**Architecture:** A small React + TypeScript app keeps customization state in `App`, passes it into focused editor and preview components, and uses CSS Grid/Flexbox breakpoints to shift from a three-column desktop workspace to a mobile-first stacked layout. No backend or persistence is required; save/reset are demo interactions.

**Tech Stack:** Vite, React, TypeScript, Vitest, Testing Library, CSS.

**Spec:** Approved in conversation on 2026-09-18; visual reference is the supplied invoice customization screenshot, with an original warm-neutral/coral/teal visual system.

## Global Constraints

- Preserve the reference scenario: edit template identity/branding while viewing the invoice result.
- Do not copy the reference visual treatment; use a distinct visual system and layout.
- Keep the demo fully responsive from desktop to mobile.
- Use accessible labels and keyboard-operable controls.

### Task 1: Scaffold the React app and state model

**Files:**
- Create: `package.json`
- Create: `index.html`
- Create: `src/main.tsx`
- Create: `src/App.tsx`
- Create: `src/types.ts`
- Create: `src/index.css`
- Test: `src/App.test.tsx`

**Interfaces:**
- `TemplateSettings` contains `templateName`, `primaryColor`, `secondaryColor`, `showLogo`, `logoUrl`, and `activeSection`.
- `App` owns settings and renders the editor plus preview.

- [ ] **Step 1: Write a failing test**

```tsx
it('renders the customizer with the default template name and live invoice title', () => {
  render(<App />);
  expect(screen.getByLabelText(/template name/i)).toHaveValue('Lumen Standard');
  expect(screen.getByRole('heading', { name: /lumen standard/i })).toBeInTheDocument();
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npm test -- --run src/App.test.tsx`
Expected: FAIL because the app and test runner do not exist yet.

- [ ] **Step 3: Write the minimal scaffold and state model**

Create the Vite scripts, `TemplateSettings`, the default state, and an `App` shell with labeled template name input and a preview heading driven by that state.

- [ ] **Step 4: Run the test to verify it passes**

Run: `npm test -- --run src/App.test.tsx`
Expected: PASS.

### Task 2: Add editor controls and live preview behavior

**Files:**
- Modify: `src/App.tsx`
- Create: `src/components/CustomizerPanel.tsx`
- Create: `src/components/InvoicePreview.tsx`
- Modify: `src/App.test.tsx`

**Interfaces:**
- `CustomizerPanel` receives `settings` and `onChange(partial: Partial<TemplateSettings>)`.
- `InvoicePreview` receives `settings` and renders the invoice paper using CSS custom properties.

- [ ] **Step 1: Write failing behavior tests**

```tsx
it('updates the invoice heading when the template name changes', async () => {
  const user = userEvent.setup();
  render(<App />);
  const input = screen.getByLabelText(/template name/i);
  await user.clear(input);
  await user.type(input, 'Northstar Pro');
  expect(screen.getByRole('heading', { name: /northstar pro/i })).toBeInTheDocument();
});

it('toggles the logo preview off', async () => {
  const user = userEvent.setup();
  render(<App />);
  await user.click(screen.getByRole('switch', { name: /show logo/i }));
  expect(screen.queryByTestId('invoice-logo')).not.toBeInTheDocument();
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npm test -- --run src/App.test.tsx`
Expected: FAIL because controls and preview behavior are not implemented.

- [ ] **Step 3: Implement controls and preview**

Add text/color inputs, logo switch, section tabs, payment methods row, invoice line items, totals, and CSS-variable-driven accent styling. Keep the preview content static except for settings-driven values.

- [ ] **Step 4: Run tests to verify they pass**

Run: `npm test -- --run src/App.test.tsx`
Expected: PASS.

### Task 3: Finish responsive styling and demo interactions

**Files:**
- Modify: `src/index.css`
- Modify: `src/App.tsx`
- Modify: `src/components/CustomizerPanel.tsx`

**Interfaces:**
- Save button displays a temporary status message.
- Reset button restores the default `TemplateSettings`.

- [ ] **Step 1: Write failing interaction tests**

```tsx
it('resets edited settings to the default template', async () => {
  const user = userEvent.setup();
  render(<App />);
  await user.clear(screen.getByLabelText(/template name/i));
  await user.type(screen.getByLabelText(/template name/i), 'Temporary');
  await user.click(screen.getByRole('button', { name: /reset/i }));
  expect(screen.getByLabelText(/template name/i)).toHaveValue('Lumen Standard');
});

it('shows a saved status after saving', async () => {
  const user = userEvent.setup();
  render(<App />);
  await user.click(screen.getByRole('button', { name: /save template/i }));
  expect(screen.getByText(/template saved/i)).toBeInTheDocument();
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npm test -- --run src/App.test.tsx`
Expected: FAIL because reset/save are not implemented.

- [ ] **Step 3: Implement responsive CSS and interactions**

Use desktop grid columns for navigation/editor/preview, collapse to one column under `900px`, hide non-essential sidebar labels under `620px`, and implement reset/save status behavior.

- [ ] **Step 4: Run the complete verification suite**

Run: `npm test -- --run && npm run build`
Expected: all tests pass and Vite exits with code 0.
