import React from 'react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

const ExportControls = () => {
  const handleExport = () => {
    const mapElement = document.querySelector('.leaflet-container');
    if (!mapElement) {
      alert('Map not found for export');
      return;
    }

    html2canvas(mapElement).then(canvas => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'px',
        format: [canvas.width, canvas.height],
      });
      pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
      pdf.save('map_export.pdf');
    }).catch(error => {
      alert('PDF export failed: ' + error.message);
      console.error(error);
    });
  };

  return (
    <div className="mb-4">
      <button
        onClick={handleExport}
        className="bg-blue-600 hover:bg-blue-800 text-white font-bold py-2 px-4 rounded"
      >
        Export Map as PDF
      </button>
    </div>
  );
};

export default ExportControls;
