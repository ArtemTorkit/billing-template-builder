import type { CSSProperties } from 'react';
import type { InvoiceData, TemplateSettings } from '../types';

export function InvoicePreview({ settings, invoice, onEdit }: { settings: TemplateSettings; invoice: InvoiceData; onEdit: (target: string) => void }) {
  const subtotal = invoice.items.reduce((sum, item) => sum + item.quantity * item.amount, 0);
  const vat = subtotal * 0.23;
  const total = subtotal + vat;
  const formatCurrency = (value: number) => value.toLocaleString('pl-PL', { style: 'currency', currency: 'PLN' });

  return (
    <section className="preview-area" style={{ '--primary': settings.primaryColor, '--secondary': settings.secondaryColor } as CSSProperties}>
      <div className="preview-toolbar"><span className="eyebrow">Podgląd faktury</span></div>
      <div className="paper-wrap">
        <article className="invoice-paper">
          <div className="invoice-topline" />
          <header className="invoice-header">
            <div><h2>{settings.templateName || 'Bez nazwy'}</h2><p className="invoice-number">{invoice.invoiceNumber} <span>·</span> Termin {invoice.dueDate}</p></div>
            {settings.showLogo && <div className="invoice-logo" data-testid="invoice-logo" style={{ backgroundColor: settings.primaryColor }}>{settings.logoUrl ? <img src={settings.logoUrl} alt="Logo firmy" /> : <span>LU</span>}</div>}
          </header>
          <div className="invoice-meta"><div><span className="meta-label">Sprzedawca</span><strong>{invoice.sellerName}</strong><span>{invoice.sellerAddress.split('\n').map((line) => <span key={line}>{line}<br /></span>)}</span><button className="preview-edit-button meta-edit" type="button" aria-label="Edytuj sprzedawcę" onClick={() => onEdit('sellerName')}>Edytuj</button></div><div><span className="meta-label">Nabywca</span><strong>{invoice.buyerName}</strong><span>{invoice.buyerAddress.split('\n').map((line) => <span key={line}>{line}<br /></span>)}</span><button className="preview-edit-button meta-edit" type="button" aria-label="Edytuj nabywcę" onClick={() => onEdit('buyerName')}>Edytuj</button></div><div><span className="meta-label">Termin płatności</span><strong>{invoice.dueDate}</strong><span>Wystawiono {invoice.issueDate}</span><button className="preview-edit-button meta-edit" type="button" aria-label="Edytuj dane dokumentu" onClick={() => onEdit('issueDate')}>Edytuj</button></div></div>
          <div className="invoice-table"><div className="table-head"><span>Pozycja</span><span>Opis</span><span>Ilość</span><span>Kwota</span></div>{invoice.items.map((item) => <div className="table-row" key={item.id}><strong>{item.name}</strong><span>{item.description}</span><span>{item.quantity}</span><strong>{item.amount.toLocaleString('pl-PL', { style: 'currency', currency: 'PLN' })}</strong></div>)}<button className="preview-edit-button items-edit" type="button" aria-label="Edytuj pozycje" onClick={() => onEdit('items')}>Edytuj pozycje</button></div>
          <div className="invoice-bottom"><div className="note-block"><span className="meta-label">Informacja</span><p>{invoice.note}</p><div className="accent-line" /></div><div className="totals"><div><span>Netto</span><strong>{formatCurrency(subtotal)}</strong></div><div><span>VAT <em>(23%)</em></span><strong>{formatCurrency(vat)}</strong></div><div className="total-row" style={{ color: settings.secondaryColor }}><span>Razem</span><strong>{formatCurrency(total)}</strong></div></div></div>
          <footer className="invoice-footer"><span>Kontakt: hello@lumenunion.co</span><span>Dokument wygenerowany przez Lumen</span></footer>
        </article>
      </div>
    </section>
  );
}
