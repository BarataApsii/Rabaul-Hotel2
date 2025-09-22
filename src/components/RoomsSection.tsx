"use client";
import { useEffect, useState } from "react";

type Room = {
  id: number;
  title: { rendered: string };
  acf: { price: number; max_guests: number; tagline: string };
  _embedded?: { "wp:featuredmedia"?: { source_url: string }[] };
};

export default function RoomsSection() {
  const [rooms, setRooms] = useState<Room[]>([]);

  useEffect(() => {
    fetch("/api/rooms").then(res => res.json()).then(setRooms);
  }, []);

  return (
    <section id="rooms" className="py-16 bg-gray-50">
      <h2 className="text-3xl font-bold mb-8 text-center">Rooms & Suites</h2>
      <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto px-6">
        {rooms.map((room) => {
          const img = room._embedded?.["wp:featuredmedia"]?.[0]?.source_url;
          return (
            <div key={room.id} className="bg-white rounded-lg shadow p-4">
              {img && <img src={img} alt={room.title.rendered} className="rounded mb-3"/>}
              <h3 className="text-xl font-semibold">{room.title.rendered}</h3>
              <p className="text-gray-600">{room.acf?.tagline}</p>
              <p className="mt-2 text-[#1a5d57] font-bold">${room.acf?.price} / night</p>
              <p className="text-sm text-gray-500">Max {room.acf?.max_guests} guests</p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
