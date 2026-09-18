import { useState } from 'react';
import { CustomizerPanel } from './components/CustomizerPanel';
import { InvoicePreview } from './components/InvoicePreview';
import { defaultInvoiceData, defaultSettings, type InvoiceData, type TemplateSettings } from './types';
import './index.css';

export function App() {
  const [settings, setSettings] = useState<TemplateSettings>(defaultSettings);
  const [invoice, setInvoice] = useState<InvoiceData>(defaultInvoiceData);
  const [focusTarget, setFocusTarget] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const updateSettings = (patch: Partial<TemplateSettings>) => { setSettings((current) => ({ ...current, ...patch })); setSaved(false); };
  const saveTemplate = () => { setSaved(true); window.setTimeout(() => setSaved(false), 2600); };
  const updateInvoice = (patch: Partial<InvoiceData>) => setInvoice((current) => ({ ...current, ...patch }));
  const editPreviewSection = (target: string) => {
    const activeSection = target === 'items' ? 'Content' : target === 'payment' ? 'Payment' : 'Content';
    setSettings((current) => ({ ...current, activeSection }));
    setFocusTarget(target);
  };

  return <main className="app-shell">
    <aside className="app-rail"><div className="brand-mark"><RailIcon name="spark" /></div><div className="rail-stack"><button className="rail-button active" aria-label="Szablony faktur" type="button"><RailIcon name="document" /></button><button className="rail-button" aria-label="Analityka" type="button"><RailIcon name="chart" /></button><button className="rail-button" aria-label="Kontakty" type="button"><RailIcon name="contacts" /></button></div><button className="rail-button rail-bottom" aria-label="Ustawienia" type="button"><RailIcon name="settings" /></button></aside>
    <div className="workspace"><header className="topbar"><div className="breadcrumb"><span className="breadcrumb-home">Lumen Union</span><span>/</span><strong>Szablony faktur</strong></div><div className="topbar-right"><span className="autosave"><i /> Zapisano przed chwilą</span><button className="avatar" type="button" aria-label="Otwórz profil">AR</button></div></header><div className="content-grid"><CustomizerPanel settings={settings} invoice={invoice} focusTarget={focusTarget} onChange={updateSettings} onInvoiceChange={updateInvoice} onSave={saveTemplate} /><InvoicePreview settings={settings} invoice={invoice} onEdit={editPreviewSection} /></div></div>
    {saved && <div className="save-toast" role="status"><span>✓</span> Zmiany zapisane</div>}
  </main>;
}

function RailIcon({ name }: { name: 'spark' | 'document' | 'chart' | 'contacts' | 'settings' }) {
  const paths = {
    spark: 'M12 2l1.8 6.2L20 10l-6.2 1.8L12 18l-1.8-6.2L4 10l6.2-1.8L12 2z',
    document: 'M6 3.5h8l4 4V20H6z M14 3.5V8h4 M9 12h6 M9 15.5h6',
    chart: 'M5 19V9 M12 19V5 M19 19v-7',
    contacts: 'M7 18c0-2.2 2.2-4 5-4s5 1.8 5 4 M12 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6z',
    settings: 'M12 8.5a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7z M19 12a7 7 0 0 0-.1-1.2l2-1.5-2-3.4-2.3.9a7.2 7.2 0 0 0-2-1.2L14.3 3h-4.6l-.4 2.6a7.2 7.2 0 0 0-2 1.2L5 5.9l-2 3.4 2 1.5A7 7 0 0 0 5 12c0 .4 0 .8.1 1.2l-2 1.5 2 3.4 2.3-.9a7.2 7.2 0 0 0 2 1.2l.4 2.6h4.6l.4-2.6a7.2 7.2 0 0 0 2-1.2l2.3.9 2-3.4-2-1.5c.1-.4.1-.8.1-1.2z',
  };
  return <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d={paths[name]} /></svg>;
}
