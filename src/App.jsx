import React, { useState } from 'react';
import Map from './components/Map';
import Upload from './components/Upload';
import ExportControls from './components/ExportControls';

const App = () => {
  const [geojsonData, setGeojsonData] = useState(null);

  return (
    <div className="max-w-7xl mx-auto p-4">
      <header className="bg-blue-700 text-white p-4 rounded mb-4">
        <h1 className="text-xl font-semibold">Cadastral Land Records Dashboard</h1>
      </header>
      <Upload onGeoJsonLoaded={setGeojsonData} />
      <ExportControls />
      <Map geojsonData={geojsonData} />
    </div>
  );
};

export default App;
