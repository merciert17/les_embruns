import React, { useState, useEffect } from "react";
import { restaurantApi } from "../services/api";
import { SectionLoader } from "./LoadingSpinner";

const AboutSection = () => {
  const [aboutData, setAboutData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAboutData = async () => {
      try {
        const data = await restaurantApi.getRestaurantInfo();
        setAboutData(data.about);
      } catch (err) {
        setError("Erreur lors du chargement des données");
      } finally {
        setLoading(false);
      }
    };

    fetchAboutData();
  }, []);

  if (loading) {
    return (
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <SectionLoader message="Chargement de notre histoire..." />
      </section>
    );
  }

  if (error || !aboutData) {
    return (
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Notre Histoire</h2>
          <p className="text-gray-600">Contenu temporairement indisponible</p>
        </div>
      </section>
    );
  }

  return (
    <section id="a-propos" className="py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto text-center mb-10">
        <h2 className="text-4xl md:text-6xl font-bold text-gray-900 mb-4">{aboutData.title}</h2>
        <p className="text-lg text-gray-700 leading-relaxed">{aboutData.description}</p>
      </div>
    </section>
  );
};

export default AboutSection;
