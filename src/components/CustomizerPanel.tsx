import { useEffect, useRef, useState, type ChangeEvent, type ReactNode } from 'react';
import type { ActiveSection, InvoiceData, InvoiceItem, TemplateSettings } from '../types';

type Props = {
  settings: TemplateSettings;
  invoice: InvoiceData;
  focusTarget: string | null;
  onChange: (patch: Partial<TemplateSettings>) => void;
  onInvoiceChange: (patch: Partial<InvoiceData>) => void;
  onSave: () => void;
};

const sections: ActiveSection[] = ['Branding', 'Content', 'Payment'];
const sectionLabels: Record<ActiveSection, string> = { Branding: 'Marka', Content: 'Treść', Payment: 'Płatności' };

export function CustomizerPanel({ settings, invoice, focusTarget, onChange, onInvoiceChange, onSave }: Props) {
  const fieldRefs = useRef<Record<string, HTMLInputElement | HTMLTextAreaElement | null>>({});
  const [openGroup, setOpenGroup] = useState('document');
  useEffect(() => {
    if (!focusTarget) return;
    const targetGroup = focusTarget === 'items' ? 'items' : focusTarget === 'sellerName' ? 'seller' : focusTarget === 'buyerName' ? 'buyer' : 'document';
    setOpenGroup(targetGroup);
    const field = fieldRefs.current[focusTarget];
    field?.scrollIntoView?.({ behavior: 'smooth', block: 'center' });
    field?.focus();
  }, [focusTarget, settings.activeSection]);

  const setField = (key: keyof InvoiceData, value: string) => onInvoiceChange({ [key]: value } as Partial<InvoiceData>);
  const updateItem = (id: number, patch: Partial<InvoiceItem>) => onInvoiceChange({ items: invoice.items.map((item) => item.id === id ? { ...item, ...patch } : item) });
  const addItem = () => onInvoiceChange({ items: [...invoice.items, { id: Date.now(), name: 'Nowa pozycja', description: 'Dodaj opis', quantity: 1, amount: 0 }] });
  const removeItem = (id: number) => onInvoiceChange({ items: invoice.items.filter((item) => item.id !== id) });
  const handleLogoUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    onChange({ logoUrl: URL.createObjectURL(file) });
  };

  return (
    <aside className="customizer-panel">
      <div className="panel-heading">
        <div>
          <span className="eyebrow">Ustawienia szablonu</span>
          <h1>Tożsamość marki</h1>
        </div>
      </div>

      <nav className="editor-tabs" aria-label="Customization sections">
        {sections.map((section) => (
          <button
            className={settings.activeSection === section ? 'active' : ''}
            key={section}
            type="button"
            onClick={() => onChange({ activeSection: section })}
          >
            {sectionLabels[section]}
          </button>
        ))}
      </nav>

      <div className="editor-scroll">
        {settings.activeSection === 'Branding' && (
          <section className="setting-section" aria-labelledby="branding-title">
            <label className="field-label" htmlFor="template-name">Nazwa szablonu</label>
            <input
              className="text-input"
              id="template-name"
              value={settings.templateName}
              onChange={(event) => onChange({ templateName: event.target.value })}
              placeholder="e.g. Lumen Standard"
            />

            <div className="field-grid">
              <ColorField label="Kolor główny" value={settings.primaryColor} disabled={Boolean(settings.logoUrl)} onChange={(value) => onChange({ primaryColor: value })} />
              <ColorField label="Kolor dodatkowy" value={settings.secondaryColor} disabled={Boolean(settings.logoUrl)} onChange={(value) => onChange({ secondaryColor: value })} />
            </div>

            <div className="logo-header">
              <div>
                <span className="field-label">Logo firmy</span>
                <span className="field-help">Wyświetlane w nagłówku faktury</span>
              </div>
              <label className="switch-control">
                <span className="sr-only">Wyświetl logo</span>
                <input
                  aria-label="Wyświetl logo"
                  role="switch"
                  type="checkbox"
                  checked={settings.showLogo}
                  onChange={(event) => onChange({ showLogo: event.target.checked })}
                />
                <span className="switch-track" />
              </label>
            </div>

            <div className="logo-upload-group">
              <label className="logo-dropzone" htmlFor="logo-upload">
                <div className="logo-preview" style={{ backgroundColor: settings.primaryColor }}>
                  {settings.logoUrl ? <img src={settings.logoUrl} alt="Przesłane logo firmy" /> : <span>LU</span>}
                </div>
                <div className="dropzone-copy">
                <strong>{settings.logoUrl ? 'Własne logo aktywne' : 'Prześlij logo'}</strong>
                <span>{settings.logoUrl ? 'Obraz wybrany · kliknij ×, aby usunąć' : 'Kliknij, aby wybrać plik lub przeciągnij go tutaj'}</span>
                </div>
                {!settings.logoUrl && <span className="upload-arrow">＋</span>}
                {settings.logoUrl && <button className="remove-logo-button" type="button" aria-label="Usuń logo" title="Usuń logo" onClick={(event) => { event.preventDefault(); event.stopPropagation(); onChange({ logoUrl: '' }); }}>×</button>}
                <input id="logo-upload" aria-label="Prześlij logo" type="file" accept="image/png,image/jpeg" onChange={handleLogoUpload} />
              </label>
            </div>

            <div className="mini-card payment-card">
              <div className="mini-icon">▣</div>
              <div><strong>Metody płatności</strong><span>Karta · przelew bankowy</span></div>
              <button type="button">Zarządzaj <span>→</span></button>
            </div>
          </section>
        )}

        {settings.activeSection === 'Content' && (
          <section className="setting-section placeholder-section">
            <div className="editor-section-title"><span>Treść faktury</span><small>Otwórz jedną sekcję, aby skupić się na edycji.</small></div>
            <EditorGroup title="Dane dokumentu" open={openGroup === 'document'} onToggle={() => setOpenGroup((current) => current === 'document' ? '' : 'document')}>
              <div className="form-stack"><TextField label="Numer faktury" value={invoice.invoiceNumber} inputRef={(node) => { fieldRefs.current.invoiceNumber = node; }} onChange={(value) => setField('invoiceNumber', value)} /><div className="two-fields"><TextField label="Data wystawienia" value={invoice.issueDate} inputRef={(node) => { fieldRefs.current.issueDate = node; }} onChange={(value) => setField('issueDate', value)} /><TextField label="Termin płatności" value={invoice.dueDate} inputRef={(node) => { fieldRefs.current.dueDate = node; }} onChange={(value) => setField('dueDate', value)} /></div></div>
            </EditorGroup>
            <EditorGroup title="Sprzedawca" open={openGroup === 'seller'} onToggle={() => setOpenGroup((current) => current === 'seller' ? '' : 'seller')}>
              <div className="form-stack"><TextField label="Nazwa sprzedawcy" value={invoice.sellerName} inputRef={(node) => { fieldRefs.current.sellerName = node; }} onChange={(value) => setField('sellerName', value)} /><TextAreaField label="Adres sprzedawcy" value={invoice.sellerAddress} onChange={(value) => setField('sellerAddress', value)} /></div>
            </EditorGroup>
            <EditorGroup title="Nabywca" open={openGroup === 'buyer'} onToggle={() => setOpenGroup((current) => current === 'buyer' ? '' : 'buyer')}>
              <div className="form-stack"><TextField label="Nazwa nabywcy" value={invoice.buyerName} inputRef={(node) => { fieldRefs.current.buyerName = node; }} onChange={(value) => setField('buyerName', value)} /><TextAreaField label="Adres nabywcy" value={invoice.buyerAddress} onChange={(value) => setField('buyerAddress', value)} /></div>
            </EditorGroup>
            <EditorGroup title="Pozycje" open={openGroup === 'items'} onToggle={() => setOpenGroup((current) => current === 'items' ? '' : 'items')}>
              <button className="add-item-button" type="button" onClick={addItem}>+ Dodaj pozycję</button><div className="item-editor-list">{invoice.items.map((item) => <div className="item-editor" key={item.id}><div className="item-editor-top"><input aria-label="Nazwa pozycji" value={item.name} onChange={(event) => updateItem(item.id, { name: event.target.value })} /><button type="button" aria-label={`Usuń ${item.name}`} onClick={() => removeItem(item.id)}>×</button></div><input aria-label="Opis pozycji" value={item.description} onChange={(event) => updateItem(item.id, { description: event.target.value })} /><div className="item-editor-bottom"><label>Ilość<input aria-label="Ilość pozycji" type="number" min="1" value={item.quantity} onChange={(event) => updateItem(item.id, { quantity: Number(event.target.value) })} /></label><label>Kwota<input aria-label="Kwota pozycji" type="number" min="0" value={item.amount} onChange={(event) => updateItem(item.id, { amount: Number(event.target.value) })} /></label></div></div>)}</div>
            </EditorGroup>
            <EditorGroup title="Uwagi" open={openGroup === 'note'} onToggle={() => setOpenGroup((current) => current === 'note' ? '' : 'note')}><TextAreaField label="Uwagi" value={invoice.note} onChange={(value) => setField('note', value)} /></EditorGroup>
          </section>
        )}

        {settings.activeSection === 'Payment' && (
          <section className="setting-section placeholder-section">
            <div className="section-intro"><span className="section-icon">⌁</span><div><h2>Płatności</h2><p>Ułatw klientom opłacenie faktury.</p></div></div>
            <div className="mini-card payment-card large-card"><div className="mini-icon">▣</div><div><strong>Karty</strong><span>Visa, Mastercard, Amex</span></div><span className="status-on">Aktywne</span></div>
            <div className="mini-card payment-card large-card"><div className="mini-icon teal">↗</div><div><strong>Przelew bankowy</strong><span>Rachunek kończący się na 2048</span></div><span className="status-on">Aktywne</span></div>
          </section>
        )}
      </div>

      <div className="panel-actions">
        <button className="button primary" type="button" onClick={onSave}>Zapisz zmiany</button>
      </div>
    </aside>
  );
}

function ColorField({ label, value, disabled, onChange }: { label: string; value: string; disabled?: boolean; onChange: (value: string) => void }) {
  return <label className={`color-field ${disabled ? 'disabled' : ''}`}><span>{label}</span><div className="color-input-wrap"><input aria-label={label} disabled={disabled} type="color" value={value} onChange={(event) => onChange(event.target.value)} /><code>{value.toUpperCase()}</code></div></label>;
}

function TextField({ label, value, inputRef, onChange }: { label: string; value: string; inputRef?: (node: HTMLInputElement | null) => void; onChange: (value: string) => void }) {
  return <label className="form-field"><span>{label}</span><input aria-label={label} ref={inputRef} value={value} onChange={(event) => onChange(event.target.value)} /></label>;
}

function TextAreaField({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return <label className="form-field"><span>{label}</span><textarea aria-label={label} rows={2} value={value} onChange={(event) => onChange(event.target.value)} /></label>;
}

function EditorGroup({ title, open, onToggle, children }: { title: string; open: boolean; onToggle: () => void; children: ReactNode }) {
  return <section className={`editor-group ${open ? 'open' : ''}`}><div className="editor-group-header"><button type="button" aria-expanded={open} onClick={onToggle}><span>{title}</span><b className={`group-toggle-icon ${open ? 'open' : ''}`} aria-hidden="true">{open ? '×' : '+'}</b></button></div>{open && <div className="editor-group-content">{children}</div>}</section>;
}
