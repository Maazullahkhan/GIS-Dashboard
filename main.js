// Initialize the Leaflet map centered on Pakistan
const map = L.map('map').setView([30.3753, 69.3451], 6);

// Add OpenStreetMap tiles
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 19,
  attribution: '© Maazullah Khan GIS Specilist',
}).addTo(map);

let geoJsonLayer = null;

document.getElementById('shapefile-upload').addEventListener('change', async (event) => {
  const files = event.target.files;
  if (files.length === 0) {
    return;
  }

  // Upload the shapefile parts to backend first
  const formData = new FormData();
  for (const file of files) {
    formData.append('files[]', file);
  }

  try {
    const response = await fetch('upload.php', {
      method: 'POST',
      body: formData
    });

    const result = await response.json();

    if (!result.success) {
      alert('Upload failed: ' + result.message);
      return;
    }

    // After successful upload, parse shapefile client-side and display
    const filesArray = Array.from(files);
    const zip = new JSZip();
    for (const file of filesArray) {
      const content = await file.arrayBuffer();
      zip.file(file.name, content);
    }
    const zipBlob = await zip.generateAsync({ type: "blob" });

    const geojson = await shp.parseZip(zipBlob);

    if (geoJsonLayer) {
      map.removeLayer(geoJsonLayer);
    }

    geoJsonLayer = L.geoJSON(geojson).addTo(map);
    map.fitBounds(geoJsonLayer.getBounds());
  } catch (err) {
    alert('Failed during upload or parsing: ' + err.message);
    console.error(err);
  }
});

// PDF export functionality using html2canvas and jsPDF
document.getElementById('export-pdf').addEventListener('click', () => {
  const mapElement = document.getElementById('map');

  // Use html2canvas to capture map div
  html2canvas(mapElement).then(canvas => {
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jspdf.jsPDF({
      orientation: 'landscape',
      unit: 'px',
      format: [canvas.width, canvas.height]
    });
    pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
    pdf.save('map_export.pdf');
  }).catch(error => {
    alert('PDF export failed: ' + error.message);
    console.error(error);
  });
});
