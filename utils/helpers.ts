// FIX: Implemented utility functions required by various components.
export const generateUniqueId = (): string => {
  return `id_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
};

export const getTodayDateString = (): string => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};

export const downloadElementAsImage = (elementId: string, filename: string) => {
  const element = document.getElementById(elementId);
  
  if (!element) {
    console.error(`Element with id "${elementId}" not found.`);
    alert('Erro: Não foi possível encontrar o conteúdo para baixar.');
    return;
  }
  
  if (typeof window.html2canvas === 'undefined') {
      console.error('html2canvas library is not loaded.');
      alert('Erro: A biblioteca de captura de tela não foi carregada.');
      return;
  }

  const bodyBackgroundColor = window.getComputedStyle(document.body).backgroundColor;

  window.html2canvas(element, {
      useCORS: true,
      scale: 2,
      backgroundColor: bodyBackgroundColor,
  }).then(canvas => {
    const image = canvas.toDataURL('image/png', 1.0);
    const link = document.createElement('a');
    link.href = image;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }).catch(err => {
      console.error('html2canvas failed:', err);
      alert('Ocorreu um erro ao gerar a imagem.');
  });
};