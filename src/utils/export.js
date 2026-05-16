export const formatReceiptText = (session) => {
  if (!session) return '';
  let text = `${session.title || 'Lista'}\n`;
  text += `Fecha: ${new Date(session.createdAt).toLocaleString()}\n\n`;
  session.items?.forEach(item => {
    const op = item.operator !== 'start' ? item.operator + ' ' : '';
    text += `${op}$${item.amount.toLocaleString(undefined, {minimumFractionDigits: 2})} - ${item.label}\n`;
  });
  text += `\nTotal: $${session.total?.toLocaleString(undefined, {minimumFractionDigits: 2})}\n`;
  text += `\nGenerado con Sumly`;
  return text;
};

export const handleShare = async (session) => {
  if (!session) return;
  const text = formatReceiptText(session);
  
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
        // Fallback robusto para redes locales (HTTP) sin HTTPS
        const textArea = document.createElement("textarea");
        textArea.value = text;
        textArea.style.position = "fixed";
        textArea.style.left = "-999999px";
        textArea.style.top = "-999999px";
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        
        const successful = document.execCommand('copy');
        document.body.removeChild(textArea);
        
        if (successful) {
          alert('Recibo copiado al portapapeles');
        } else {
          alert('No se pudo copiar automáticamente.');
        }
      }
    } catch (err) {
      console.error('Error al intentar copiar:', err);
    }
  }
};

export const handleDownload = (session) => {
  if (!session) return;
  const text = formatReceiptText(session);
  
  // Use base64 Data URI to prevent PWA Service Worker from intercepting or corrupting the blob
  const base64Data = btoa(unescape(encodeURIComponent(text)));
  const dataUri = `data:text/plain;base64,${base64Data}`;
  
  const rawTitle = session.title || 'Lista';
  const cleanTitle = rawTitle.replace(/[^a-zA-Z0-9]/g, '_');
  const filename = `Sumly_${cleanTitle}.txt`;
  
  const a = document.createElement('a');
  a.style.display = 'none';
  a.href = dataUri;
  a.download = filename;
  
  document.body.appendChild(a);
  a.click();
  
  setTimeout(() => {
    document.body.removeChild(a);
  }, 100);
};

export const handleExportToSheets = (session) => {
  if (!session) return;
  let csv = '\uFEFFOperador,Monto,Etiqueta\n';
  session.items?.forEach(item => {
    const op = item.operator !== 'start' ? item.operator : '';
    csv += `"${op}","${item.amount}","${(item.label || '').replace(/"/g, '""')}"\n`;
  });
  csv += `,"${session.total}","TOTAL"\n`;
  
  const base64Data = btoa(unescape(encodeURIComponent(csv)));
  const dataUri = `data:text/csv;base64,${base64Data}`;
  
  const rawTitle = session.title || 'Lista';
  const cleanTitle = rawTitle.replace(/[^a-zA-Z0-9]/g, '_');
  const filename = `Sumly_${cleanTitle}_Sheets.csv`;
  
  const a = document.createElement('a');
  a.style.display = 'none';
  a.href = dataUri;
  a.download = filename;
  
  document.body.appendChild(a);
  a.click();
  
  setTimeout(() => {
    document.body.removeChild(a);
  }, 100);
};
