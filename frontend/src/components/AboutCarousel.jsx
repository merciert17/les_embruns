import React from "react";
import ImageCarousel from "./ImageCarousel";

// imports locaux (placez vos images dans src/assets/images/)
import img1 from "../assets/images/20170608-140100-largejpg.jpg";
import img2 from "../assets/images/20171112-133706-largejpg.jpg";
import img3 from "../assets/images/20191025-194445-largejpg.jpg";
import img4 from "../assets/images/caption.jpg";
import img5 from "../assets/images/caption1.jpg";
import img6 from "../assets/images/caption2.jpg";
import img7 from "../assets/images/caption3.jpg";
import img8 from "../assets/images/les-embruns.jpg";
import img9 from "../assets/images/nom-d-un-village-sur.jpg";
import img10 from "../assets/images/photo2jpg.jpg";
import img11 from "../assets/images/photo6jpg.jpg";
import img12 from "../assets/images/tarte-tatin-figues-sucree.jpg";
import img13 from "../assets/images/tarte.jpg";

const AboutCarousel = () => {
  const carouselImages = [
    { src: img8, alt: "Les Embruns" },
    { src: img1, alt: "Salle élégante" },
    { src: img2, alt: "Chef préparant un plat" },
    { src: img3, alt: "Terrasse avec vue" },
    { src: img10, alt: "Présentation des plats" },
    { src: img11, alt: "Tables face à l'océan" },
    { src: img4, alt: "Caption" },
    { src: img5, alt: "Caption 1" },
    { src: img6, alt: "Caption 2" },
    { src: img7, alt: "Caption 3" },
    { src: img9, alt: "Nom d'un village" },
    { src: img12, alt: "Tarte Tatin aux figues" },
    { src: img13, alt: "Tarte" },
  ];

  return (
    <div className="max-w-8xl mx-auto">
      <ImageCarousel 
        images={carouselImages} 
        speed={0.2}
        autoScroll={true}
      />
    </div>
  );
};

export default AboutCarousel;