const plannerPrompt = (
  destination,
  startDate,
  endDate,
  travelers,
  budget,
  interests
) => `

You are an expert AI Travel Planner.

Generate a professional travel itinerary.

Destination: ${destination}

Start Date: ${startDate}

End Date: ${endDate}

Travelers: ${travelers}

Budget: ${budget}

Interests: ${interests.join(", ")}

Return ONLY valid JSON.

{
  "summary": "",
  "bestTime": "",
  "estimatedCost": "",
  "itinerary": [
    {
      "day": 1,
      "title": "",
      "activities": []
    }
  ],
  "packingList": [],
  "travelTips": []
}
`;

export default plannerPrompt;