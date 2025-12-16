import React, { useState, useEffect } from "react";
import axios from "axios";
import FlowingMenu from "./FlowingMenu";
import localCountries from "../../../collections/countries.json";

interface Achievement {
  _id: string;
  title: string;
  description: string;
}

interface Country {
  _id: string;
  name: string;
  era?: string;
  imageUrl?: string;
  description?: string;
  achievements: Achievement[];
}

export default function CountryExplorer() {
  const [countries, setCountries] = useState<Country[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);

  useEffect(() => {
    fetchCountries();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchCountries = async () => {
    try {
      const response = await axios.get<Country[]>(
        "http://localhost:5000/api/countries"
      );
      setCountries(response.data);
      setLoading(false);
      if ((response.data || []).length === 0) {
        // fallback to local bundled data when API returns empty
        setCountries((localCountries as unknown as Country[]) || []);
      }
    } catch (error) {
      // keep console.error for diagnostics
      // eslint-disable-next-line no-console
      console.error("Error fetching countries:", error);
      // fallback to local bundled data
      setCountries((localCountries as unknown as Country[]) || []);
      setLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;

  const menuItems = countries.map((country) => {
    // per-country vertical image offsets for fine tuning (adjust as needed)
    const offsets: Record<string, string> = {
      "Panama - Democratic Movements & Freedom": "30%",
      "Colombia - Republican Ideals & Anti-Slavery Leadership": "28%",
      "Venezuela - Pan-American Democracy & Anti-Racism": "28%",
      "Mexico - Indigenous Rights & Democratic Constitutionalism": "42%",
    };

    return {
      id: country._id,
      link: "#",
      text: country.name,
      image: country.imageUrl || "",
      imageOffset: offsets[country.name] ?? "8%",
    };
  });

  return (
    <div className="country-explorer">
      <h2>Explore Latin American Achievements</h2>
      <FlowingMenu
        items={menuItems}
        onItemClick={(id) => {
          const country = countries.find((c) => c._id === id) || null;
          setSelectedCountry(country);
        }}
      />
      {selectedCountry && (
        <div className="country-detail">
          <h3>{selectedCountry.name}</h3>
          <p>{selectedCountry.description}</p>
          <h4>Key Achievements:</h4>
          {selectedCountry.achievements.map((achievement) => (
            <div key={achievement._id}>
              <strong>{achievement.title}</strong>: {achievement.description}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
