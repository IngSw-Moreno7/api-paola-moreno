import React, { useState, useEffect } from 'react';
import '../../App.css';

const TouristicAttractions = () => {
  const [groupedAttractions, setGroupedAttractions] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Función para obtener los datos de la API y agruparlos
    const fetchAndGroupAttractions = async () => {
      try {
        const response = await fetch(
          'https://api-colombia.com/api/v1/TouristicAttraction'
        );
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();

        if (Array.isArray(data)) {
          // Agrupamos las atracciones por departamento y ciudad
          const grouped = data.reduce((acc, attraction) => {
            const departmentId = attraction.city.departmentId;
            const cityName = attraction.city.name;

            if (!acc[departmentId]) {
              acc[departmentId] = {};
            }

            if (!acc[departmentId][cityName]) {
              acc[departmentId][cityName] = 0;
            }

            acc[departmentId][cityName] += 1;
            return acc;
          }, {});

          setGroupedAttractions(grouped);
        } else {
          throw new Error('Data is not an array');
        }
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAndGroupAttractions();
  }, []); // El arreglo vacío asegura que solo se ejecute una vez al montar el componente

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="table-container">
      <h1 className="title">Agrupadas por Departamento y Ciudad</h1>
      <table className="data-table">
        <thead>
          <tr>
            <th>Departamento ID</th>
            <th>Ciudad</th>
            <th>Conteo</th>
          </tr>
        </thead>
        <tbody>
          {Object.keys(groupedAttractions).map(departmentId =>
            Object.keys(groupedAttractions[departmentId]).map(cityName => (
              <tr key={`${departmentId}-${cityName}`}>
                <td>{departmentId}</td>
                <td>{cityName}</td>
                <td>{groupedAttractions[departmentId][cityName]}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default TouristicAttractions;
