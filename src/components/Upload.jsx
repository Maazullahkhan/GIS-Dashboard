import React from 'react';
import shp from 'shpjs';

const Upload = ({ onGeoJsonLoaded }) => {
  const handleFileChange = async (event) => {
    const files = event.target.files;
    if (!files.length) return;

    try {
      // Dynamically import JSZip
      const JSZip = (await import('jszip')).default;
      const zip = new JSZip();

      for (const file of files) {
        const content = await file.arrayBuffer();
        zip.file(file.name, content);
      }

      const zipBlob = await zip.generateAsync({ type: 'blob' });
      const geojson = await shp.parseZip(zipBlob);
      onGeoJsonLoaded(geojson);

    } catch (error) {
      alert('Failed to parse shapefile: ' + error.message);
      console.error(error);
    }
  };

  return (
    <div className="mb-4 w-full">
      <label htmlFor="shapefile-upload" className="block mb-2 font-semibold">
        Upload Shapefiles (shp, shx, dbf):
      </label>
      <input
        id="shapefile-upload"
        type="file"
        multiple
        accept=".shp,.shx,.dbf"
        onChange={handleFileChange}
        className="border rounded p-2 w-full"
      />
    </div>
  );
};

export default Upload;
