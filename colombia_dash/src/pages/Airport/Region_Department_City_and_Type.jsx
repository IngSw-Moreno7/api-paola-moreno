import React, { useState, useEffect } from 'react';
import '../../App.css';

const Airports = () => {
  const [airports, setAirports] = useState([]);
  const [groupedAirports, setGroupedAirports] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Función para obtener los datos de la API
    const fetchAirports = async () => {
      try {
        const response = await fetch('https://api-colombia.com/api/v1/Airport');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();

        if (Array.isArray(data)) {
          setAirports(data);
          const grouped = groupByRegionDepartmentCityAndType(data);
          setGroupedAirports(grouped);
        } else {
          throw new Error('Data is not an array');
        }
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAirports();
  }, []); // El arreglo vacío asegura que solo se ejecute una vez al montar el componente

  // Función para agrupar por región, departamento, ciudad y tipo
  const groupByRegionDepartmentCityAndType = (data) => {
    return data.reduce((acc, airport) => {
      const regionId = airport.department.regionId;
      const departmentId = airport.department.id;
      const cityName = airport.department.name; // Usamos el nombre del departamento como ciudad
      const type = airport.type;

      if (!acc[regionId]) {
        acc[regionId] = {};
      }
      if (!acc[regionId][departmentId]) {
        acc[regionId][departmentId] = {};
      }
      if (!acc[regionId][departmentId][cityName]) {
        acc[regionId][departmentId][cityName] = {};
      }
      if (!acc[regionId][departmentId][cityName][type]) {
        acc[regionId][departmentId][cityName][type] = 0;
      }

      acc[regionId][departmentId][cityName][type] += 1;

      return acc;
    }, {});
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="table-container">
      <h1 className="title">Agrupados por Región, Departamento, Ciudad y Tipo.</h1>
      <table className="data-table">
        <thead>
          <tr>
            <th>Región ID</th>
            <th>Departamento ID</th>
            <th>Ciudad</th>
            <th>Tipo</th>
            <th>Conteo</th>
          </tr>
        </thead>
        <tbody>
          {Object.keys(groupedAirports).map(regionId =>
            Object.keys(groupedAirports[regionId]).map(departmentId =>
              Object.keys(groupedAirports[regionId][departmentId]).map(cityName =>
                Object.keys(groupedAirports[regionId][departmentId][cityName]).map(type => (
                  <tr key={`${regionId}-${departmentId}-${cityName}-${type}`}>
                    <td>{regionId}</td>
                    <td>{departmentId}</td>
                    <td>{cityName}</td>
                    <td>{type}</td>
                    <td>{groupedAirports[regionId][departmentId][cityName][type]}</td>
                  </tr>
                ))
              )
            )
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Airports;
