import { Capacitor } from '@capacitor/core';
import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';
import { Share } from '@capacitor/share';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { getCurrencySymbol } from './currency';

export const formatReceiptText = (session, currency = 'MXN') => {
  if (!session) return '';
  const sym = getCurrencySymbol(currency);
  let text = `${session.title || 'Lista'}\n`;
  text += `Fecha: ${new Date(session.createdAt).toLocaleString()}\n\n`;
  session.items?.forEach(item => {
    const op = item.operator !== 'start' ? item.operator + ' ' : '';
    text += `${op}${sym}${item.amount.toLocaleString(undefined, {minimumFractionDigits: 2})} - ${item.label}\n`;
  });
  text += `\nTotal: ${sym}${session.total?.toLocaleString(undefined, {minimumFractionDigits: 2})}\n`;
  text += `\nGenerado con Sumly`;
  return text;
};

export const handleShare = async (session, currency) => {
  if (!session) return;
  const text = formatReceiptText(session, currency);
  
  if (Capacitor.isNativePlatform()) {
    try {
      await Share.share({
        title: session.title || 'Mi lista en Sumly',
        text: text,
        dialogTitle: 'Compartir resumen'
      });
      return;
    } catch (e) {
      console.error('Error sharing natively', e);
    }
  }
  
  if (navigator.share && window.isSecureContext) {
    try {
      await navigator.share({
        title: session.title || 'Mi lista en Sumly',
        text: text,
      });
    } catch (e) {
      console.error('Error sharing', e);
    }
  } else {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
        alert('Recibo copiado al portapapeles');
      } else {
        const textArea = document.createElement("textarea");
        textArea.value = text;
        textArea.style.position = "fixed";
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        const successful = document.execCommand('copy');
        document.body.removeChild(textArea);
        if (successful) alert('Recibo copiado al portapapeles');
      }
    } catch (err) {
      console.error('Error al intentar copiar:', err);
    }
  }
};

const shareFileNatively = async (filename, data, isBase64 = false) => {
  try {
    const writeOptions = {
      path: filename,
      data: data,
      directory: Directory.Cache, // Se guarda en caché para compartir rápido
      recursive: true
    };
    
    // Mantenemos la corrección vital de codificación para TXT y CSV
    if (!isBase64) {
      writeOptions.encoding = Encoding.UTF8;
    }

    const result = await Filesystem.writeFile(writeOptions);
    
    await Share.share({
      title: filename,
      url: result.uri,
      dialogTitle: 'Guardar o Compartir archivo'
    });
    return true;
  } catch (e) {
    console.error('Error sharing file natively', e);
    alert('Error al procesar el archivo. Revisa los permisos de la aplicación.');
    return false;
  }
};

export const handleDownload = async (session, currency) => {
  if (!session) return;
  const text = formatReceiptText(session, currency);
  
  const rawTitle = session.title || 'Lista';
  const cleanTitle = rawTitle.replace(/[^a-zA-Z0-9]/g, '_');
  const filename = `Sumly_${cleanTitle}.txt`;

  if (Capacitor.isNativePlatform()) {
    await shareFileNatively(filename, text, false);
    return;
  }
  
  const file = new File([text], filename, { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(file);
  const a = document.createElement('a');
  a.style.display = 'none';
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  setTimeout(() => { document.body.removeChild(a); URL.revokeObjectURL(url); }, 2000);
};

export const handleExportToPDF = async (session, currency) => {
  if (!session) return;
  const doc = new jsPDF();
  const sym = getCurrencySymbol(currency);
  
  doc.setFontSize(20);
  doc.text(session.title || 'Lista Sumly', 14, 22);
  doc.setFontSize(11);
  doc.setTextColor(100);
  doc.text(`Fecha: ${new Date(session.createdAt).toLocaleString()}`, 14, 30);
  
  const tableData = session.items?.map(item => [
    item.operator !== 'start' ? item.operator : '',
    `${sym}${item.amount.toLocaleString(undefined, {minimumFractionDigits: 2})}`,
    item.label
  ]) || [];
  
  tableData.push(['', `TOTAL: ${sym}${session.total?.toLocaleString(undefined, {minimumFractionDigits: 2})}`, '']);
  
  autoTable(doc, {
    startY: 35,
    head: [['Op', 'Monto', 'Etiqueta']],
    body: tableData,
    theme: 'grid',
    headStyles: { fillColor: [59, 130, 246] },
    footStyles: { fillColor: [240, 240, 240], textColor: [0,0,0], fontStyle: 'bold' }
  });
  
  const rawTitle = session.title || 'Lista';
  const cleanTitle = rawTitle.replace(/[^a-zA-Z0-9]/g, '_');
  const filename = `Sumly_${cleanTitle}.pdf`;

  if (Capacitor.isNativePlatform()) {
    const base64Out = doc.output('datauristring').split(',')[1];
    await shareFileNatively(filename, base64Out, true);
  } else {
    doc.save(filename);
  }
};

export const handleExportToSheets = async (session, currency) => {
  if (!session) return;
  const sym = getCurrencySymbol(currency);
  let csv = '\uFEFFOperador,Monto,Etiqueta\n';
  session.items?.forEach(item => {
    const op = item.operator !== 'start' ? item.operator : '';
    csv += `"${op}","${sym}${item.amount}","${(item.label || '').replace(/"/g, '""')}"\n`;
  });
  csv += `,"${sym}${session.total}","TOTAL"\n`;
  
  const rawTitle = session.title || 'Lista';
  const cleanTitle = rawTitle.replace(/[^a-zA-Z0-9]/g, '_');
  const filename = `Sumly_${cleanTitle}_Sheets.csv`;

  if (Capacitor.isNativePlatform()) {
    await shareFileNatively(filename, csv, false);
    return;
  }
  
  const file = new File([csv], filename, { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(file);
  const a = document.createElement('a');
  a.style.display = 'none';
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  setTimeout(() => { document.body.removeChild(a); URL.revokeObjectURL(url); }, 2000);
};
