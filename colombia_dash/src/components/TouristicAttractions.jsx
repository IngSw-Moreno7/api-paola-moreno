import React, { useState, useEffect } from 'react';
import '../App.css';

const TouristicAttractions = () => {
  const [groupedAttractions, setGroupedAttractions] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Función para obtener los datos de la API
    const fetchAttractions = async () => {
      try {
        const response = await fetch('https://api-colombia.com/api/v1/TouristicAttraction');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();

        // Verificar que data sea un array
        if (Array.isArray(data)) {
          // Procesar y agrupar los datos
          const groupedData = data.reduce((acc, attraction) => {
            const departmentId = attraction.city.departmentId;
            const cityId = attraction.city.id;

            if (!acc[departmentId]) {
              acc[departmentId] = {};
            }

            if (!acc[departmentId][cityId]) {
              acc[departmentId][cityId] = {
                cityName: attraction.city.name,
                attractions: [],
                count: 0,
              };
            }

            acc[departmentId][cityId].attractions.push(attraction);
            acc[departmentId][cityId].count += 1;

            return acc;
          }, {});

          setGroupedAttractions(groupedData);
        } else {
          throw new Error('Data is not an array');
        }
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAttractions();
  }, []); // El arreglo vacío asegura que solo se ejecute una vez al montar el componente

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h1>Atracciones Turísticas</h1>
      {Object.keys(groupedAttractions).map(departmentId => (
        <div key={departmentId}>
          <h2>Departamento: {departmentId}</h2>
          {Object.keys(groupedAttractions[departmentId]).map(cityId => (
            <div key={cityId}>
              <h3>Ciudad: {groupedAttractions[departmentId][cityId].cityName}</h3>
              <p>Cantidad de atracciones: {groupedAttractions[departmentId][cityId].count}</p>
              <ul>
                {groupedAttractions[departmentId][cityId].attractions.map(attraction => (
                  <li key={attraction.id}>{attraction.name}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default TouristicAttractions;
