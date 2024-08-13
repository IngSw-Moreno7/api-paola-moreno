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
  const groupByDepartmentAndCity = data => {
    return data.reduce((acc, airport) => {
      const departmentId = airport.department.id;
      const cityName = airport.department.cityCapital || 'Sin Ciudad'; // Se usa 'Sin Ciudad' si la ciudad no está disponible

      if (!acc[departmentId]) {
        acc[departmentId] = {};
      }

      if (!acc[departmentId][cityName]) {
        acc[departmentId][cityName] = 0;
      }

      acc[departmentId][cityName] += 1;

      return acc;
    }, {});
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="table-container">
      <h1 className="title">Agrupados por Departamento y Ciudad</h1>
      <table className="data-table">
        <thead>
          <tr>
            <th>Departamento ID</th>
            <th>Ciudad</th>
            <th>Conteo</th>
          </tr>
        </thead>
        <tbody>
          {Object.keys(groupedAirports).map(departmentId =>
            Object.keys(groupedAirports[departmentId]).map(cityName => (
              <tr key={`${departmentId}-${cityName}`}>
                <td>{departmentId}</td>
                <td>{cityName}</td>
                <td>{groupedAirports[departmentId][cityName]}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Airports;
