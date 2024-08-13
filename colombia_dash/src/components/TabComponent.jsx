// src/components/TabComponent.js
import React, { useState } from 'react';
import { Tabs, Tab } from '@mui/material';
import Presidents from './Presidents';
import Airports from './Airports';
import TouristicAttractions from './TouristicAttractions';

const TabComponent = () => {
  const [value, setValue] = useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <div>
      <Tabs value={value} onChange={handleChange} aria-label="entity tabs">
        <Tab label="Presidentes" />
        <Tab label="Aeropuertos" />
        <Tab label="Atracciones Turísticas" />
      </Tabs>
      {value === 0 && <Presidents />}
      {value === 1 && <Airports />}
      {value === 2 && <TouristicAttractions />}
    </div>
  );
};

export default TabComponent;
