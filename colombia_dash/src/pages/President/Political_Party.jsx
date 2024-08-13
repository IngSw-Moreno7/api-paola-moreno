import React, { useState, useEffect } from 'react';
import '../../App.css';

const Presidents = () => {
  const [presidents, setPresidents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [groupedByParty, setGroupedByParty] = useState({});

  useEffect(() => {
    // Función para obtener los datos de la API
    const fetchPresidents = async () => {
      try {
        const response = await fetch(
          'https://api-colombia.com/api/v1/President'
        );
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();

        // Verificar que data sea un array
        if (Array.isArray(data)) {
          setPresidents(data);

          // Agrupamiento y conteo por partido político
          const partyCount = data.reduce((acc, president) => {
            const party = president.politicalParty || 'Unknown';
            if (acc[party]) {
              acc[party]++;
            } else {
              acc[party] = 1;
            }
            return acc;
          }, {});

          // Convertir el objeto en un array y ordenar por conteo descendente
          const sortedParties = Object.entries(partyCount)
            .map(([party, count]) => ({ party, count }))
            .sort((a, b) => b.count - a.count);

          // Agrupación de los datos para la visualización en tabla
          const groupedData = sortedParties.reduce((acc, { party, count }) => {
            if (!acc[party]) {
              acc[party] = count;
            }
            return acc;
          }, {});

          setGroupedByParty(groupedData);
        } else {
          throw new Error('Data is not an array');
        }
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPresidents();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="table-container">
      <h1 className="title">Agrupados por Partido Político</h1>
      <table className="data-table">
        <thead>
          <tr>
            <th>Partido Político</th>
            <th>Conteo</th>
          </tr>
        </thead>
        <tbody>
          {Object.keys(groupedByParty).map(party => (
            <tr key={party}>
              <td>{party}</td>
              <td>{groupedByParty[party]}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Presidents;
