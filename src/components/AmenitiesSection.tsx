"use client";
import { useEffect, useState } from "react";

type Amenity = {
  id: number;
  title: { rendered: string };
  acf: { short_desc: string };
  _embedded?: { "wp:featuredmedia"?: { source_url: string }[] };
};

export default function AmenitiesSection() {
  const [amenities, setAmenities] = useState<Amenity[]>([]);

  useEffect(() => {
    fetch("/api/amenities")
      .then((res) => res.json())
      .then(setAmenities);
  }, []);

  return (
    <section id="amenities" className="py-16 bg-white">
      <h2 className="text-3xl font-bold mb-8 text-center">Our Amenities</h2>
      <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto px-6">
        {amenities.map((amenity) => {
          const img = amenity._embedded?.["wp:featuredmedia"]?.[0]?.source_url;
          return (
            <div key={amenity.id} className="bg-gray-50 rounded-lg shadow p-4">
              {img && (
                <img
                  src={img}
                  alt={amenity.title.rendered}
                  className="rounded mb-3 w-full h-40 object-cover"
                />
              )}
              <h3 className="text-xl font-semibold">
                {amenity.title.rendered}
              </h3>
              <p className="text-gray-600">{amenity.acf?.short_desc}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
