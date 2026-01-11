import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

interface QuoteData {
  clientName: string;
  eventDate: string;
  numberOfGuests: number;
  template: {
    name: string;
    eventType: string;
    includedServices: string[];
    additionalServices: string[];
    menuSections: Array<{
      name: string;
      items: Array<{
        category: string;
        dishes: string[];
      }>;
    }>;
    pricePerPerson: number;
    minimumGuests: number;
    currency: string;
    terms: string;
    signatureName: string;
    signatureTitle: string;
    signatureLocation: string;
  };
}

export async function exportQuoteToPDF(quoteData: QuoteData) {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  let yPosition = 20;

  // Cargar y agregar logo
  try {
    const logoImg = await loadImage('/Logo.rukalefun.jpg');
    const logoWidth = 40;
    const logoHeight = 20;
    const logoX = (pageWidth - logoWidth) / 2;
    doc.addImage(logoImg, 'JPEG', logoX, yPosition, logoWidth, logoHeight);
    yPosition += logoHeight + 10;
  } catch (error) {
    console.error('Error loading logo:', error);
  }

  // Header - Título
  doc.setFontSize(22);
  doc.setFont('helvetica', 'bold');
  doc.text('Ruka Lefún', pageWidth / 2, yPosition, { align: 'center' });
  yPosition += 8;

  doc.setFontSize(14);
  doc.setFont('helvetica', 'normal');
  doc.text(`Cotización ${quoteData.template.name}`, pageWidth / 2, yPosition, { align: 'center' });
  yPosition += 6;

  doc.setFontSize(11);
  doc.setTextColor(100);
  doc.text(quoteData.eventDate, pageWidth / 2, yPosition, { align: 'center' });
  yPosition += 10;

  // Número de personas
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(0);
  doc.text(`${quoteData.numberOfGuests} personas`, pageWidth / 2, yPosition, { align: 'center' });
  yPosition += 12;

  // Servicios Incluidos
  if (quoteData.template.includedServices.length > 0) {
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('Servicios Incluidos', 20, yPosition);
    yPosition += 6;

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    quoteData.template.includedServices.forEach((service) => {
      if (yPosition > pageHeight - 30) {
        doc.addPage();
        yPosition = 20;
      }
      doc.text(`• ${service}`, 25, yPosition);
      yPosition += 5;
    });
    yPosition += 5;
  }

  // Servicios Adicionales
  if (quoteData.template.additionalServices.length > 0) {
    if (yPosition > pageHeight - 40) {
      doc.addPage();
      yPosition = 20;
    }

    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('Servicios Adicionales Incluidos', 20, yPosition);
    yPosition += 6;

    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    quoteData.template.additionalServices.forEach((service) => {
      if (yPosition > pageHeight - 30) {
        doc.addPage();
        yPosition = 20;
      }
      doc.text(`• ${service}`, 25, yPosition);
      yPosition += 5;
    });
    doc.setFont('helvetica', 'normal');
    yPosition += 5;
  }

  // Menú Sugerido
  if (quoteData.template.menuSections.length > 0) {
    if (yPosition > pageHeight - 40) {
      doc.addPage();
      yPosition = 20;
    }

    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('Menú Sugerido', pageWidth / 2, yPosition, { align: 'center' });
    yPosition += 8;

    quoteData.template.menuSections.forEach((section) => {
      if (yPosition > pageHeight - 40) {
        doc.addPage();
        yPosition = 20;
      }

      // Nombre de la sección
      doc.setFontSize(11);
      doc.setTextColor(184, 134, 11); // Color dorado
      doc.setFont('helvetica', 'bold');
      doc.text(section.name, pageWidth / 2, yPosition, { align: 'center' });
      yPosition += 6;
      doc.setTextColor(0);

      section.items.forEach((item) => {
        if (yPosition > pageHeight - 40) {
          doc.addPage();
          yPosition = 20;
        }

        // Categoría
        doc.setFontSize(10);
        doc.setFont('helvetica', 'bold');
        doc.text(item.category, pageWidth / 2, yPosition, { align: 'center' });
        yPosition += 5;

        // Platos
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(9);
        item.dishes.forEach((dish) => {
          if (yPosition > pageHeight - 30) {
            doc.addPage();
            yPosition = 20;
          }
          doc.text(dish, pageWidth / 2, yPosition, { align: 'center' });
          yPosition += 4;
        });
        yPosition += 3;
      });
      yPosition += 3;
    });
  }

  // Precio
  if (yPosition > pageHeight - 40) {
    doc.addPage();
    yPosition = 20;
  }

  doc.setDrawColor(200);
  doc.line(20, yPosition, pageWidth - 20, yPosition);
  yPosition += 8;

  doc.setFontSize(12);
  doc.setTextColor(220, 38, 38); // Color rojo
  doc.setFont('helvetica', 'bold');
  const priceText = `Valor neto por persona $${quoteData.template.pricePerPerson.toLocaleString()}`;
  doc.text(priceText, pageWidth / 2, yPosition, { align: 'center' });

  if (quoteData.template.minimumGuests > 0) {
    yPosition += 5;
    doc.setFontSize(9);
    doc.setTextColor(100);
    doc.setFont('helvetica', 'normal');
    doc.text(`(desde ${quoteData.template.minimumGuests} pers.)`, pageWidth / 2, yPosition, { align: 'center' });
  }
  yPosition += 10;
  doc.setTextColor(0);

  // Términos y Condiciones
  if (quoteData.template.terms) {
    if (yPosition > pageHeight - 60) {
      doc.addPage();
      yPosition = 20;
    }

    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    const termsLines = doc.splitTextToSize(quoteData.template.terms, pageWidth - 40);

    termsLines.forEach((line: string) => {
      if (yPosition > pageHeight - 30) {
        doc.addPage();
        yPosition = 20;
      }
      doc.text(line, 20, yPosition);
      yPosition += 4;
    });
    yPosition += 8;
  }

  // Firma
  if (yPosition > pageHeight - 40) {
    doc.addPage();
    yPosition = 20;
  }

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.text('Gracias por solicitarnos esta cotización, esperamos sea de su agrado.', 20, yPosition);
  yPosition += 5;

  doc.setFont('helvetica', 'bold');
  doc.text(quoteData.template.signatureName, 20, yPosition);
  yPosition += 4;
  doc.text(quoteData.template.signatureTitle, 20, yPosition);
  yPosition += 4;
  doc.setFont('helvetica', 'normal');
  doc.text(quoteData.template.signatureLocation, 20, yPosition);

  // Guardar PDF
  const fileName = `Cotizacion_${quoteData.clientName.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`;
  doc.save(fileName);
}

// Función auxiliar para cargar imágenes
function loadImage(url: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'Anonymous';
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(img, 0, 0);
        resolve(canvas.toDataURL('image/jpeg'));
      } else {
        reject(new Error('Could not get canvas context'));
      }
    };
    img.onerror = reject;
    img.src = url;
  });
}
