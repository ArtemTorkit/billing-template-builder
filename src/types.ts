export type ActiveSection = 'Branding' | 'Content' | 'Payment';

export type TemplateSettings = {
  templateName: string;
  primaryColor: string;
  secondaryColor: string;
  showLogo: boolean;
  logoUrl: string;
  activeSection: ActiveSection;
};

export type InvoiceItem = {
  id: number;
  name: string;
  description: string;
  quantity: number;
  amount: number;
};

export type InvoiceData = {
  invoiceNumber: string;
  issueDate: string;
  dueDate: string;
  sellerName: string;
  sellerAddress: string;
  buyerName: string;
  buyerAddress: string;
  note: string;
  items: InvoiceItem[];
};

export const defaultInvoiceData: InvoiceData = {
  invoiceNumber: 'INV-2024-0098',
  issueDate: '30 Sep 2024',
  dueDate: '14 Oct 2024',
  sellerName: 'Lumen Union Sp. z o.o.',
  sellerAddress: 'ul. Długa 47\n00-241 Warszawa',
  buyerName: 'Northstar Studio Sp. z o.o.',
  buyerAddress: 'ul. Marszałkowska 58\n00-545 Warszawa',
  note: 'Dziękujemy za współpracę. Prosimy o płatność w terminie.',
  items: [
    { id: 1, name: 'Projektowanie produktu', description: 'Kierunek interfejsu i system wizualny', quantity: 1, amount: 2400 },
    { id: 2, name: 'Implementacja', description: 'Implementacja frontendu i testy QA', quantity: 1, amount: 1800 },
  ],
};

export const defaultSettings: TemplateSettings = {
  templateName: 'Lumen Standard',
  primaryColor: '#1e3a5f',
  secondaryColor: '#16847d',
  showLogo: true,
  logoUrl: '',
  activeSection: 'Branding',
};
