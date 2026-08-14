import jsPDF from "jspdf";

// ============================================================
// AI TRAVEL PLANNER — PDF GENERATOR
// ============================================================

const generateTripPDF = (trip) => {
  if (!trip) {
    console.error("No trip data available for PDF.");
    return;
  }

  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  const pageWidth = 210;
  const pageHeight = 297;

  const margin = 18;
  const contentWidth = pageWidth - margin * 2;

  let y = 18;

  // ==========================================================
  // COLORS
  // ==========================================================

  const colors = {
    primary: [37, 99, 235],
    secondary: [79, 70, 229],
    dark: [15, 23, 42],
    text: [51, 65, 85],
    muted: [100, 116, 139],
    light: [241, 245, 249],
    border: [226, 232, 240],
    white: [255, 255, 255],
    green: [22, 163, 74],
  };

  // ==========================================================
  // DATA NORMALIZATION
  // ==========================================================

  const destination =
    trip.destination || "Unknown Destination";

  const startDate =
    trip.startDate ||
    trip.start_date ||
    "--";

  const endDate =
    trip.endDate ||
    trip.end_date ||
    "--";

  const travelers =
    trip.travelers || 1;

  const days =
    trip.days ||
    calculateDays(
      startDate,
      endDate
    );

  const budget =
    Number(trip.budget || 0);

  const weather =
    trip.weather || {};

  const interests =
    Array.isArray(trip.interests)
      ? trip.interests
      : [];

  const aiScore =
    trip.aiScore ??
    trip.ai_score ??
    trip.itinerary?.aiScore ??
    0;

  const itinerary =
    trip.itinerary || {};

  const dailyPlan =
    Array.isArray(itinerary.dailyPlan)
      ? itinerary.dailyPlan
      : [];

  const travelTips =
    Array.isArray(itinerary.travelTips)
      ? itinerary.travelTips
      : [];

  const hotels =
    Array.isArray(trip.hotels)
      ? trip.hotels
      : [];

  const restaurants =
    Array.isArray(trip.restaurants)
      ? trip.restaurants
      : [];

  const places =
    Array.isArray(trip.places)
      ? trip.places
      : [];

  const packing =
    Array.isArray(trip.packing)
      ? trip.packing
      : [];

  // ==========================================================
  // HELPERS
  // ==========================================================

  const addPageIfNeeded = (requiredHeight = 20) => {
    if (y + requiredHeight > pageHeight - 18) {
      doc.addPage();
      y = 18;

      addPageHeader();
    }
  };

  const addPageHeader = () => {
    doc.setFillColor(
      ...colors.primary
    );

    doc.rect(
      0,
      0,
      pageWidth,
      5,
      "F"
    );
  };

  const addFooter = () => {
    const pageCount =
      doc.getNumberOfPages();

    for (
      let page = 1;
      page <= pageCount;
      page++
    ) {
      doc.setPage(page);

      doc.setDrawColor(
        ...colors.border
      );

      doc.line(
        margin,
        pageHeight - 14,
        pageWidth - margin,
        pageHeight - 14
      );

      doc.setFont(
        "helvetica",
        "normal"
      );

      doc.setFontSize(8);

      doc.setTextColor(
        ...colors.muted
      );

      doc.text(
        "AI Travel Planner • AI Generated Trip Report",
        margin,
        pageHeight - 8
      );

      doc.text(
        `Page ${page} of ${pageCount}`,
        pageWidth - margin,
        pageHeight - 8,
        {
          align: "right",
        }
      );
    }
  };

  const addSectionTitle = (
    title,
    subtitle = ""
  ) => {
    addPageIfNeeded(25);

    doc.setFont(
      "helvetica",
      "bold"
    );

    doc.setFontSize(17);

    doc.setTextColor(
      ...colors.dark
    );

    doc.text(
      title,
      margin,
      y
    );

    y += 7;

    if (subtitle) {
      doc.setFont(
        "helvetica",
        "normal"
      );

      doc.setFontSize(9);

      doc.setTextColor(
        ...colors.muted
      );

      doc.text(
        subtitle,
        margin,
        y
      );

      y += 6;
    }

    doc.setDrawColor(
      ...colors.border
    );

    doc.line(
      margin,
      y,
      pageWidth - margin,
      y
    );

    y += 8;
  };

  const addWrappedText = (
    text,
    x,
    width,
    fontSize = 10,
    color = colors.text,
    lineHeight = 5
  ) => {
    if (!text) return;

    doc.setFont(
      "helvetica",
      "normal"
    );

    doc.setFontSize(
      fontSize
    );

    doc.setTextColor(
      ...color
    );

    const lines =
      doc.splitTextToSize(
        String(text),
        width
      );

    addPageIfNeeded(
      lines.length * lineHeight + 4
    );

    doc.text(
      lines,
      x,
      y
    );

    y +=
      lines.length *
        lineHeight +
      4;
  };

  const addLabelValue = (
    label,
    value,
    x,
    valueX
  ) => {
    doc.setFont(
      "helvetica",
      "bold"
    );

    doc.setFontSize(9);

    doc.setTextColor(
      ...colors.muted
    );

    doc.text(
      label,
      x,
      y
    );

    doc.setFont(
      "helvetica",
      "normal"
    );

    doc.setTextColor(
      ...colors.dark
    );

    doc.text(
      String(value ?? "--"),
      valueX,
      y
    );
  };

  const addBullet = (
    text,
    indent = 5
  ) => {
    if (!text) return;

    const bulletX =
      margin + indent;

    const textX =
      bulletX + 5;

    doc.setFillColor(
      ...colors.primary
    );

    doc.circle(
      bulletX,
      y - 1.2,
      1,
      "F"
    );

    const lines =
      doc.splitTextToSize(
        String(text),
        contentWidth -
          indent -
          5
      );

    addPageIfNeeded(
      lines.length * 5 + 3
    );

    doc.setFont(
      "helvetica",
      "normal"
    );

    doc.setFontSize(9.5);

    doc.setTextColor(
      ...colors.text
    );

    doc.text(
      lines,
      textX,
      y
    );

    y +=
      lines.length * 5 +
      3;
  };

  const getItemText = (
    item
  ) => {
    if (
      typeof item ===
      "string"
    ) {
      return item;
    }

    if (
      item &&
      typeof item ===
        "object"
    ) {
      return (
        item.name ||
        item.title ||
        item.description ||
        item.text ||
        item.tip ||
        item.insight ||
        JSON.stringify(item)
      );
    }

    return "";
  };

  // ==========================================================
  // PAGE HEADER
  // ==========================================================

  addPageHeader();

  // ==========================================================
  // COVER / TRIP HEADER
  // ==========================================================

  doc.setFillColor(
    ...colors.primary
  );

  doc.roundedRect(
    margin,
    y,
    contentWidth,
    48,
    5,
    5,
    "F"
  );

  doc.setTextColor(
    ...colors.white
  );

  doc.setFont(
    "helvetica",
    "bold"
  );

  doc.setFontSize(25);

  doc.text(
    "AI Travel Planner",
    margin + 8,
    y + 13
  );

  doc.setFontSize(18);

  doc.text(
    destination,
    margin + 8,
    y + 27
  );

  doc.setFont(
    "helvetica",
    "normal"
  );

  doc.setFontSize(9);

  doc.text(
    "Personalized AI Travel Report",
    margin + 8,
    y + 37
  );

  // AI SCORE CIRCLE

  doc.setFillColor(
    ...colors.white
  );

  doc.circle(
    pageWidth - margin - 25,
    y + 24,
    15,
    "F"
  );

  doc.setTextColor(
    ...colors.primary
  );

  doc.setFont(
    "helvetica",
    "bold"
  );

  doc.setFontSize(15);

  doc.text(
    `${aiScore}%`,
    pageWidth - margin - 25,
    y + 26,
    {
      align: "center",
    }
  );

  y += 58;

  // ==========================================================
  // TRIP OVERVIEW
  // ==========================================================

  addSectionTitle(
    "Trip Overview",
    "Your personalized journey details"
  );

  doc.setFillColor(
    ...colors.light
  );

  doc.roundedRect(
    margin,
    y,
    contentWidth,
    37,
    4,
    4,
    "F"
  );

  const col1 =
    margin + 6;

  const col2 =
    margin + 72;

  const col3 =
    margin + 135;

  let infoY =
    y + 10;

  doc.setFont(
    "helvetica",
    "bold"
  );

  doc.setFontSize(8);

  doc.setTextColor(
    ...colors.muted
  );

  doc.text(
    "DATES",
    col1,
    infoY
  );

  doc.text(
    "TRAVELERS",
    col2,
    infoY
  );

  doc.text(
    "DURATION",
    col3,
    infoY
  );

  infoY += 7;

  doc.setFont(
    "helvetica",
    "normal"
  );

  doc.setFontSize(10);

  doc.setTextColor(
    ...colors.dark
  );

  doc.text(
    `${startDate} - ${endDate}`,
    col1,
    infoY
  );

  doc.text(
    `${travelers} Travelers`,
    col2,
    infoY
  );

  doc.text(
    `${days} Days`,
    col3,
    infoY
  );

  y += 48;

  // ==========================================================
  // SUMMARY
  // ==========================================================

  if (itinerary.summary) {
    addSectionTitle(
      "AI Trip Summary"
    );

    addWrappedText(
      itinerary.summary,
      margin,
      contentWidth,
      10,
      colors.text,
      5.5
    );
  }

  // ==========================================================
  // BUDGET + WEATHER
  // ==========================================================

  addSectionTitle(
    "Trip Snapshot"
  );

  const boxWidth =
    (contentWidth - 8) / 2;

  const snapshotY = y;

  // Budget box

  doc.setFillColor(
    239,
    246,
    255
  );

  doc.roundedRect(
    margin,
    snapshotY,
    boxWidth,
    38,
    4,
    4,
    "F"
  );

  doc.setFont(
    "helvetica",
    "bold"
  );

  doc.setFontSize(9);

  doc.setTextColor(
    ...colors.primary
  );

  doc.text(
    "TOTAL BUDGET",
    margin + 7,
    snapshotY + 10
  );

  doc.setFontSize(18);

  doc.setTextColor(
    ...colors.dark
  );

  doc.text(
    `Rs. ${budget.toLocaleString(
      "en-IN"
    )}`,
    margin + 7,
    snapshotY + 23
  );

  // Weather box

  const weatherX =
    margin +
    boxWidth +
    8;

  doc.setFillColor(
    255,
    247,
    237
  );

  doc.roundedRect(
    weatherX,
    snapshotY,
    boxWidth,
    38,
    4,
    4,
    "F"
  );

  doc.setFontSize(9);

  doc.setTextColor(
    217,
    119,
    6
  );

  doc.text(
    "WEATHER",
    weatherX + 7,
    snapshotY + 10
  );

  doc.setFontSize(18);

  doc.setTextColor(
    ...colors.dark
  );

  const temperature =
    weather.temp ??
    weather.temperature ??
    "--";

  doc.text(
    `${temperature}°C`,
    weatherX + 7,
    snapshotY + 23
  );

  doc.setFontSize(9);

  doc.setTextColor(
    ...colors.muted
  );

  doc.text(
    weather.condition ||
      weather.description ||
      "Unavailable",
    weatherX + 7,
    snapshotY + 32
  );

  y += 48;

  // ==========================================================
  // INTERESTS
  // ==========================================================

  if (interests.length > 0) {
    addSectionTitle(
      "Travel Interests"
    );

    const interestText =
      interests.join(
        " • "
      );

    addWrappedText(
      interestText,
      margin,
      contentWidth,
      10,
      colors.text
    );
  }

  // ==========================================================
  // ITINERARY
  // ==========================================================

  if (dailyPlan.length > 0) {
    addSectionTitle(
      "AI Generated Itinerary",
      "Your personalized day-by-day travel plan"
    );

    dailyPlan.forEach(
      (day, index) => {
        addPageIfNeeded(35);

        const dayTitle =
          day?.day ||
          day?.title ||
          `Day ${index + 1}`;

        doc.setFillColor(
          ...colors.primary
        );

        doc.roundedRect(
          margin,
          y,
          contentWidth,
          10,
          3,
          3,
          "F"
        );

        doc.setFont(
          "helvetica",
          "bold"
        );

        doc.setFontSize(10);

        doc.setTextColor(
          ...colors.white
        );

        doc.text(
          String(dayTitle),
          margin + 5,
          y + 6.7
        );

        y += 17;

        const activities =
          day?.activities ||
          day?.places ||
          day?.schedule ||
          day?.items ||
          [];

        if (
          Array.isArray(
            activities
          ) &&
          activities.length > 0
        ) {
          activities.forEach(
            (activity) => {
              const text =
                getItemText(
                  activity
                );

              if (text) {
                addBullet(text);
              }
            }
          );
        } else {
          const text =
            getItemText(day);

          if (text) {
            addBullet(text);
          }
        }

        y += 4;
      }
    );
  }

  // ==========================================================
  // HOTELS
  // ==========================================================

  if (hotels.length > 0) {
    addSectionTitle(
      "Hotel Recommendations"
    );

    hotels.forEach(
      (hotel, index) => {
        addPageIfNeeded(28);

        const name =
          hotel?.name ||
          `Hotel ${index + 1}`;

        doc.setFont(
          "helvetica",
          "bold"
        );

        doc.setFontSize(11);

        doc.setTextColor(
          ...colors.dark
        );

        doc.text(
          name,
          margin,
          y
        );

        y += 6;

        const details = [];

        if (hotel?.address) {
          details.push(
            `Address: ${hotel.address}`
          );
        }

        if (hotel?.rating) {
          details.push(
            `Rating: ${hotel.rating}`
          );
        }

        if (
          hotel?.price ||
          hotel?.pricePerNight
        ) {
          details.push(
            `Price: ${hotel.price || hotel.pricePerNight}`
          );
        }

        if (
          hotel?.description
        ) {
          details.push(
            hotel.description
          );
        }

        details.forEach(
          (detail) => {
            addBullet(detail);
          }
        );

        y += 3;
      }
    );
  }

  // ==========================================================
  // RESTAURANTS
  // ==========================================================

  if (restaurants.length > 0) {
    addSectionTitle(
      "Restaurant Recommendations"
    );

    restaurants.forEach(
      (restaurant, index) => {
        addPageIfNeeded(28);

        const name =
          restaurant?.name ||
          `Restaurant ${index + 1}`;

        doc.setFont(
          "helvetica",
          "bold"
        );

        doc.setFontSize(11);

        doc.setTextColor(
          ...colors.dark
        );

        doc.text(
          name,
          margin,
          y
        );

        y += 6;

        const details = [];

        if (
          restaurant?.cuisine
        ) {
          details.push(
            `Cuisine: ${restaurant.cuisine}`
          );
        }

        if (
          restaurant?.rating
        ) {
          details.push(
            `Rating: ${restaurant.rating}`
          );
        }

        if (
          restaurant?.address
        ) {
          details.push(
            `Address: ${restaurant.address}`
          );
        }

        if (
          restaurant?.description
        ) {
          details.push(
            restaurant.description
          );
        }

        details.forEach(
          (detail) => {
            addBullet(detail);
          }
        );

        y += 3;
      }
    );
  }

  // ==========================================================
  // PLACES
  // ==========================================================

  if (places.length > 0) {
    addSectionTitle(
      "Places to Explore",
      "Real places discovered through the travel planner"
    );

    places.forEach(
      (place, index) => {
        addPageIfNeeded(30);

        const name =
          place?.name ||
          `Place ${index + 1}`;

        doc.setFont(
          "helvetica",
          "bold"
        );

        doc.setFontSize(11);

        doc.setTextColor(
          ...colors.dark
        );

        doc.text(
          name,
          margin,
          y
        );

        y += 6;

        const details = [];

        if (
          place?.category
        ) {
          details.push(
            `Category: ${place.category}`
          );
        }

        if (
          place?.address
        ) {
          details.push(
            `Address: ${place.address}`
          );
        }

        if (
          place?.bestTime
        ) {
          details.push(
            `Best time: ${place.bestTime}`
          );
        }

        if (
          place?.description
        ) {
          details.push(
            place.description
          );
        }

        details.forEach(
          (detail) => {
            addBullet(detail);
          }
        );

        y += 3;
      }
    );
  }

  // ==========================================================
  // PACKING
  // ==========================================================

  if (packing.length > 0) {
    addSectionTitle(
      "Packing Checklist"
    );

    packing.forEach(
      (group) => {
        if (
          typeof group ===
          "string"
        ) {
          addBullet(group);
          return;
        }

        if (
          group &&
          Array.isArray(
            group.items
          )
        ) {
          if (group.category) {
            doc.setFont(
              "helvetica",
              "bold"
            );

            doc.setFontSize(10);

            doc.setTextColor(
              ...colors.dark
            );

            addPageIfNeeded(15);

            doc.text(
              group.category,
              margin,
              y
            );

            y += 7;
          }

          group.items.forEach(
            (item) => {
              addBullet(
                getItemText(item)
              );
            }
          );
        }
      }
    );
  }

  // ==========================================================
  // TRAVEL TIPS
  // ==========================================================

  if (travelTips.length > 0) {
    addSectionTitle(
      "AI Travel Tips"
    );

    travelTips.forEach(
      (tip) => {
        addBullet(
          getItemText(tip)
        );
      }
    );
  }

  // ==========================================================
  // FINAL MESSAGE
  // ==========================================================

  addPageIfNeeded(40);

  doc.setFillColor(
    ...colors.primary
  );

  doc.roundedRect(
    margin,
    y,
    contentWidth,
    30,
    5,
    5,
    "F"
  );

  doc.setFont(
    "helvetica",
    "bold"
  );

  doc.setFontSize(12);

  doc.setTextColor(
    ...colors.white
  );

  doc.text(
    "Your trip, enhanced by AI ✨",
    margin + 8,
    y + 11
  );

  doc.setFont(
    "helvetica",
    "normal"
  );

  doc.setFontSize(8.5);

  doc.text(
    "Generated using your destination, interests, budget and travel preferences.",
    margin + 8,
    y + 20
  );

  // ==========================================================
  // FOOTERS
  // ==========================================================

  addFooter();

  // ==========================================================
  // SAVE
  // ==========================================================

  const safeDestination =
    destination
      .replace(
        /[^a-z0-9]/gi,
        "-"
      )
      .replace(
        /-+/g,
        "-"
      )
      .toLowerCase();

  doc.save(
    `AI-Travel-Planner-${safeDestination}.pdf`
  );
};

// ============================================================
// CALCULATE DAYS
// ============================================================

function calculateDays(
  startDate,
  endDate
) {
  if (
    !startDate ||
    !endDate
  ) {
    return "--";
  }

  const start =
    new Date(startDate);

  const end =
    new Date(endDate);

  const difference =
    Math.ceil(
      (end - start) /
        (1000 *
          60 *
          60 *
          24)
    );

  return difference > 0
    ? difference
    : "--";
}

export default generateTripPDF;