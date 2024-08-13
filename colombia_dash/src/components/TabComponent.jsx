import React, { useState } from 'react';
import { Tabs, Tab, Menu, MenuItem } from '@mui/material';
import Presidents from '../pages/President/Political_Party';
import RegionDepartmentCityAndType from '../pages/Airport/Department_and_city';
import DepartmentAndCity from '../pages/Airport/Region_Department_City_and_Type';
import TouristicAttractions from '../pages/TouristicAttractions/Department_and_city';

const TabComponent = () => {
  const [value, setValue] = useState(0);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedAirportComponent, setSelectedAirportComponent] = useState(null);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleMenuItemClick = (Component) => {
    setSelectedAirportComponent(<Component />);
    setAnchorEl(null);
  };

  return (
    <div>
      <Tabs value={value} onChange={handleChange} aria-label="entity tabs">
        <Tab label="Presidentes" />
        <Tab label="Aeropuertos" onClick={handleMenuClick} />
        <Tab label="Atracciones Turísticas" />
      </Tabs>
      {value === 0 && <Presidents />}
      {value === 1 && selectedAirportComponent}
      {value === 2 && <TouristicAttractions />}

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={() => handleMenuItemClick(RegionDepartmentCityAndType)}>
          Departamento y Ciudad
        </MenuItem>
        <MenuItem onClick={() => handleMenuItemClick(DepartmentAndCity)}>
          Región, Departamento, Ciudad y Tipo
        </MenuItem>
      </Menu>
    </div>
  );
};

export default TabComponent;
