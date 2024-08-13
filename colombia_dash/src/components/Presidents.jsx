import React, { useState, useEffect } from 'react';

const Presidents = () => {
  const [presidents, setPresidents] = useState([]);
  const [groupedParties, setGroupedParties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Función para obtener los datos de la API
    const fetchPresidents = async () => {
      try {
        const response = await fetch('https://api-colombia.com/api/v1/President');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();

        // Verificar que data sea un array
        if (Array.isArray(data)) {
          setPresidents(data);
          const grouped = groupByPoliticalParty(data);
          setGroupedParties(grouped);
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
  }, []); // El arreglo vacío asegura que solo se ejecute una vez al montar el componente

  // Función para agrupar por partido político y ordenar por conteo de presidentes
  const groupByPoliticalParty = (data) => {
    const partyCount = data.reduce((acc, president) => {
      const party = president.politicalParty || "Sin partido";
      if (!acc[party]) {
        acc[party] = { count: 0, presidents: [] };
      }
      acc[party].count += 1;
      acc[party].presidents.push(president);
      return acc;
    }, {});

    // Convertir objeto en array y ordenar por conteo de presidentes
    return Object.keys(partyCount)
      .map(party => ({ party, ...partyCount[party] }))
      .sort((a, b) => b.count - a.count);
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h1>Presidentes por Partido Político</h1>
      {groupedParties.map(group => (
        <div key={group.party}>
          <h2>Partido: {group.party} (Conteo: {group.count})</h2>
          <ul>
            {group.presidents.map(president => (
              <li key={president.id}>
                <h3>{president.name}</h3>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default Presidents;
