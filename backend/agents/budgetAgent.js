const budgetAgent = async (trip) => {

  const total = Number(trip.budget);

  return {

    hotel: Math.round(total * 0.40),

    food: Math.round(total * 0.20),

    transport: Math.round(total * 0.15),

    sightseeing: Math.round(total * 0.15),

    shopping: Math.round(total * 0.10),

  };

};

export default budgetAgent;