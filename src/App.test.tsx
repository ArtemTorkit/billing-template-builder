import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { App } from './App';

describe('invoice template customizer', () => {
  it('renders the customizer with the default template name and live invoice title', () => {
    render(<App />);
    expect(screen.getByLabelText(/nazwa szablonu/i)).toHaveValue('Lumen Standard');
    expect(screen.getByRole('heading', { name: /lumen standard/i })).toBeInTheDocument();
  });

  it('updates the invoice heading when the template name changes', async () => {
    const user = userEvent.setup();
    render(<App />);
    const input = screen.getByLabelText(/nazwa szablonu/i);
    await user.clear(input);
    await user.type(input, 'Northstar Pro');
    expect(screen.getByRole('heading', { name: /northstar pro/i })).toBeInTheDocument();
  });

  it('toggles the logo preview off', async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.click(screen.getByRole('switch', { name: /wyświetl logo/i }));
    expect(screen.queryByTestId('invoice-logo')).not.toBeInTheDocument();
  });

  it('shows a saved status after saving', async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.click(screen.getByRole('button', { name: /zapisz zmiany/i }));
    expect(screen.getByText(/zmiany zapisane/i)).toBeInTheDocument();
  });

  it('uses professional accounting language in the invoice preview', () => {
    render(<App />);
    expect(screen.getByText('Sprzedawca')).toBeInTheDocument();
    expect(screen.getByText('Nabywca')).toBeInTheDocument();
    expect(screen.getByText('Razem')).toBeInTheDocument();
  });

  it('recalculates invoice totals when an item amount changes', async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.click(screen.getByRole('button', { name: /edytuj pozycje/i }));
    const amountInputs = screen.getAllByLabelText(/kwota pozycji/i);
    await user.clear(amountInputs[0]);
    await user.type(amountInputs[0], '3000');
    expect(screen.getByText((_, element) => element?.textContent?.replace(/\s/g, '') === '4800,00zł')).toBeInTheDocument();
    expect(screen.getByText((_, element) => element?.textContent?.replace(/\s/g, '') === '5904,00zł')).toBeInTheDocument();
  });

  it('makes the logo choice explicit and locks colors after a custom logo is uploaded', () => {
    render(<App />);
    expect(screen.getByLabelText(/prześlij logo/i)).toBeInTheDocument();
    const file = new File(['logo'], 'company-logo.png', { type: 'image/png' });
    fireEvent.change(screen.getByLabelText(/prześlij logo/i), { target: { files: [file] } });
    expect(screen.getByText(/własne logo aktywne/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/kolor główny/i)).toBeDisabled();
    expect(screen.getByRole('button', { name: /usuń logo/i })).toBeInTheDocument();
  });


  it('lets the user remove an uploaded logo and returns to the color mark state', () => {
    render(<App />);
    const file = new File(['logo'], 'company-logo.png', { type: 'image/png' });
    fireEvent.change(screen.getByLabelText(/prześlij logo/i), { target: { files: [file] } });
    fireEvent.click(screen.getByRole('button', { name: /usuń logo/i }));
    expect(screen.getByText(/prześlij logo/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/kolor główny/i)).not.toBeDisabled();
    expect(screen.queryByRole('button', { name: /usuń logo/i })).not.toBeInTheDocument();
  });

  it('opens the invoice details editor when editing the preview details section', async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.click(screen.getByRole('button', { name: /edytuj dane dokumentu/i }));
    expect(screen.getByLabelText(/data wystawienia/i)).toBeInTheDocument();
  });

  it('adds a line item from the items editor and updates the preview', async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.click(screen.getByRole('button', { name: /edytuj pozycje/i }));
    await user.click(screen.getByRole('button', { name: /dodaj pozycję/i }));
    const itemInputs = screen.getAllByLabelText(/nazwa pozycji/i);
    await user.clear(itemInputs[itemInputs.length - 1]);
    await user.type(itemInputs[itemInputs.length - 1], 'Monthly bookkeeping');
    expect(screen.getByText('Monthly bookkeeping')).toBeInTheDocument();
  });

  it('closes the line items group when its close icon is clicked', async () => {
    const user = userEvent.setup();
  render(<App />);
  await user.click(screen.getByRole('button', { name: /edytuj pozycje/i }));
  expect(screen.getAllByLabelText(/nazwa pozycji/i).length).toBeGreaterThan(0);
  await user.click(screen.getByRole('button', { name: /^pozycje$/i }));
  expect(screen.queryAllByLabelText(/nazwa pozycji/i)).toHaveLength(0);
});
});
