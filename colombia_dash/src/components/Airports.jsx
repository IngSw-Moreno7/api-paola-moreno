import React, { useState, useEffect } from 'react';

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
          const grouped = groupByDepartmentAndCity(data);
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

  // Función para agrupar por departamento y ciudad
  const groupByDepartmentAndCity = (data) => {
    return data.reduce((acc, airport) => {
      const department = airport.department.name;
      const city = airport.city.name;

      if (!acc[department]) {
        acc[department] = {};
      }

      if (!acc[department][city]) {
        acc[department][city] = { count: 0, airports: [] };
      }

      acc[department][city].count += 1;
      acc[department][city].airports.push(airport);

      return acc;
    }, {});
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h1>Aeropuertos</h1>
      {Object.keys(groupedAirports).map(department => (
        <div key={department}>
          <h2>Departamento: {department}</h2>
          {Object.keys(groupedAirports[department]).map(city => (
            <div key={city}>
              <h3>Ciudad: {city} (Conteo: {groupedAirports[department][city].count})</h3>
              <ul>
                {groupedAirports[department][city].airports.map(airport => (
                  <li key={airport.id}>
                    <h4>Nombre: {airport.name}</h4>
                    <p>Tipo: {airport.type}</p>
                    <p>Región: {airport.department.regionId}</p>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default Airports;
