import "./SearchBar.css";

import { Search, MapPin } from "lucide-react";
import { useState } from "react";

import destinations from "../../data/destinations";

function SearchBar() {
  const [query, setQuery] = useState("");

  const filtered = destinations.filter((place) =>
    place.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="search-wrapper">

      <div className="search-box">

        <Search size={20} />

        <input
          type="text"
          placeholder="Search destinations..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />

      </div>

      {query && (

        <div className="search-dropdown">

          {filtered.length > 0 ? (

            filtered.map((place, index) => (

              <div
                className="search-item"
                key={index}
              >

                <MapPin size={16} />

                {place}

              </div>

            ))

          ) : (

            <div className="no-result">

              No destination found

            </div>

          )}

        </div>

      )}

    </div>
  );
}

export default SearchBar;