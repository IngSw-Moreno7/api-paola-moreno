import React, { useState, useEffect } from 'react';

const TouristicAttractions = () => {
  const [attractions, setAttractions] = useState([]);
  const [groupedData, setGroupedData] = useState({});
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
          setAttractions(data);
          // Agrupar datos
          const grouped = groupByDepartmentAndCity(data);
          setGroupedData(grouped);
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

  // Función para agrupar por departamento y ciudad
  const groupByDepartmentAndCity = (data) => {
    return data.reduce((acc, attraction) => {
      const department = attraction.city.departmentId;
      const city = attraction.city.name;

      if (!acc[department]) {
        acc[department] = {};
      }

      if (!acc[department][city]) {
        acc[department][city] = { count: 0, attractions: [] };
      }

      acc[department][city].count += 1;
      acc[department][city].attractions.push(attraction);

      return acc;
    }, {});
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h1>Atracciones Turísticas</h1>
      {Object.keys(groupedData).map(department => (
        <div key={department}>
          <h2>Departamento: {department}</h2>
          {Object.keys(groupedData[department]).map(city => (
            <div key={city}>
              <h3>Ciudad: {city}</h3>
              <p>Conteo: {groupedData[department][city].count}</p>
              <ul>
                {groupedData[department][city].attractions.map(attraction => (
                  <li key={attraction.id}>
                    <h4>Nombre: {attraction.name}</h4>
                    <p>Descripción: {attraction.description}</p>
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

export default TouristicAttractions;
