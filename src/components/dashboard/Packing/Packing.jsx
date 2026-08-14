import { useEffect, useMemo, useState } from "react";
import "./Packing.css";

import {
  CheckCircle2,
  Circle,
  Briefcase,
  PackageCheck,
  RotateCcw,
} from "lucide-react";

function Packing({ packing = [] }) {

  // =====================================================
  // NORMALIZE AI PACKING DATA
  // =====================================================

  const normalizedPacking = useMemo(() => {

    if (!Array.isArray(packing)) {
      return [];
    }

    return packing.flatMap((item) => {

      // -----------------------------------------------
      // STRING
      // -----------------------------------------------

      if (typeof item === "string") {

        return [
          {
            category: "Essentials",
            items: [item],
          },
        ];
      }


      // -----------------------------------------------
      // OBJECT
      // -----------------------------------------------

      if (
        item &&
        typeof item === "object" &&
        Array.isArray(item.items)
      ) {

        return [
          {
            category:
              item.category ||
              "Essentials",

            items:
              item.items.filter(
                (value) =>
                  typeof value === "string" &&
                  value.trim() !== ""
              ),
          },
        ];
      }

      return [];
    });

  }, [packing]);


  // =====================================================
  // CREATE UNIQUE ITEM IDs
  // =====================================================

  const allItems = useMemo(() => {

    return normalizedPacking.flatMap(
      (group, groupIndex) => {

        return group.items.map(
          (item, itemIndex) => {

            return {
              id: `${groupIndex}-${itemIndex}`,
              text: item,
            };
          }
        );
      }
    );

  }, [normalizedPacking]);


  // =====================================================
  // CHECKED ITEMS
  // =====================================================

  const [checkedItems, setCheckedItems] =
    useState(() => new Set());


  // =====================================================
  // RESET WHEN NEW PACKING DATA ARRIVES
  // =====================================================

  useEffect(() => {

    setCheckedItems(new Set());

  }, [packing]);


  // =====================================================
  // TOGGLE ITEM
  // =====================================================

  const toggleItem = (id) => {

    setCheckedItems((previous) => {

      const updated =
        new Set(previous);

      if (updated.has(id)) {

        updated.delete(id);

      } else {

        updated.add(id);

      }

      return updated;

    });
  };


  // =====================================================
  // RESET CHECKLIST
  // =====================================================

  const resetChecklist = () => {

    setCheckedItems(
      new Set()
    );

  };


  // =====================================================
  // MARK ALL COMPLETE
  // =====================================================

  const markAllComplete = () => {

    setCheckedItems(
      new Set(
        allItems.map(
          (item) => item.id
        )
      )
    );

  };


  // =====================================================
  // PROGRESS
  // =====================================================

  const totalItems =
    allItems.length;

  const completedItems =
    checkedItems.size;

  const progress =
    totalItems > 0
      ? Math.round(
          (completedItems /
            totalItems) *
            100
        )
      : 0;


  // =====================================================
  // EMPTY STATE
  // =====================================================

  if (
    normalizedPacking.length === 0
  ) {

    return (

      <section className="packing-section">

        <div className="section-header">

          <div>

            <span className="section-tag">
              🎒 AI Packing Assistant
            </span>

            <h2>
              Packing Checklist
            </h2>

            <p>
              A smart checklist generated based
              on your destination and trip duration.
            </p>

          </div>

          <div className="briefcase-icon">

            <Briefcase size={30} />

          </div>

        </div>


        <div className="empty-recommendation">

          <div className="empty-packing-icon">
            🎒
          </div>

          <h3>
            No packing suggestions available
          </h3>

          <p>
            Generate your trip again to create
            your personalized packing checklist.
          </p>

        </div>

      </section>

    );
  }


  // =====================================================
  // MAIN UI
  // =====================================================

  return (

    <section className="packing-section">

      {/* =================================================
          HEADER
      ================================================= */}

      <div className="section-header">

        <div>

          <span className="section-tag">
            🎒 AI Packing Assistant
          </span>

          <h2>
            Packing Checklist
          </h2>

          <p>
            Your personalized packing list,
            generated around your destination,
            weather and trip activities.
          </p>

        </div>

        <div className="briefcase-icon">

          <Briefcase size={30} />

        </div>

      </div>


      {/* =================================================
          PROGRESS
      ================================================= */}

      <div className="packing-progress-card">

        <div className="packing-progress-top">

          <div>

            <div className="packing-progress-title">

              <PackageCheck
                size={20}
              />

              <strong>
                Packing Progress
              </strong>

            </div>

            <span>
              {completedItems} of {totalItems} items packed
            </span>

          </div>

          <strong className="packing-progress-percent">
            {progress}%
          </strong>

        </div>


        <div className="packing-progress-bar">

          <div
            className="packing-progress-fill"
            style={{
              width: `${progress}%`,
            }}
          />

        </div>


        <div className="packing-actions">

          <button
            type="button"
            className="packing-complete-btn"
            onClick={markAllComplete}
            disabled={
              completedItems === totalItems
            }
          >
            <CheckCircle2 size={16} />

            Mark All Packed
          </button>


          <button
            type="button"
            className="packing-reset-btn"
            onClick={resetChecklist}
            disabled={
              completedItems === 0
            }
          >
            <RotateCcw size={16} />

            Reset
          </button>

        </div>

      </div>


      {/* =================================================
          PACKING GRID
      ================================================= */}

      <div className="packing-grid">

        {normalizedPacking.map(
          (group, groupIndex) => (

            <div
              className="packing-card"
              key={
                `${group.category}-${groupIndex}`
              }
            >

              <div className="packing-card-header">

                <h3>
                  {group.category}
                </h3>

                <span>

                  {
                    group.items.filter(
                      (_, itemIndex) =>
                        checkedItems.has(
                          `${groupIndex}-${itemIndex}`
                        )
                    ).length
                  }

                  /
                  {group.items.length}

                </span>

              </div>


              <div className="packing-items">

                {group.items.map(
                  (item, itemIndex) => {

                    const itemId =
                      `${groupIndex}-${itemIndex}`;

                    const isChecked =
                      checkedItems.has(
                        itemId
                      );

                    return (

                      <button
                        type="button"
                        key={itemId}
                        className={`packing-item ${
                          isChecked
                            ? "checked"
                            : ""
                        }`}
                        onClick={() =>
                          toggleItem(itemId)
                        }
                      >

                        <span className="packing-check">

                          {isChecked ? (

                            <CheckCircle2
                              size={20}
                            />

                          ) : (

                            <Circle
                              size={20}
                            />

                          )}

                        </span>


                        <span className="packing-item-text">

                          {item}

                        </span>

                      </button>

                    );

                  }
                )}

              </div>

            </div>

          )
        )}

      </div>


      {/* =================================================
          COMPLETED MESSAGE
      ================================================= */}

      {progress === 100 && (

        <div className="packing-complete-message">

          <PackageCheck
            size={22}
          />

          <div>

            <strong>
              You're all packed! 🎉
            </strong>

            <span>
              Everything on your AI-generated
              checklist has been checked.
            </span>

          </div>

        </div>

      )}

    </section>

  );
}

export default Packing;