"use client";
import { useEffect, useState } from "react";

type Explore = {
  id: number;
  title: { rendered: string };
  acf: { short_desc: string };
  _embedded?: { "wp:featuredmedia"?: { source_url: string }[] };
};

export default function ExploreSection() {
  const [explores, setExplores] = useState<Explore[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        console.log('Fetching explore data...');
        const apiUrl = '/api/explore';
        console.log('API URL:', apiUrl);
        
        const response = await fetch(apiUrl);
        let data;
        
        try {
          data = await response.json();
          console.log('API Response:', data);
        } catch (jsonError) {
          console.error('Failed to parse JSON response:', jsonError);
          const textResponse = await response.text();
          console.error('Raw response:', textResponse);
          throw new Error(`Invalid JSON response from server: ${textResponse.substring(0, 200)}`);
        }
        
        if (!response.ok) {
          console.error('API Error Response:', {
            status: response.status,
            statusText: response.statusText,
            data
          });
          throw new Error(data?.error || `HTTP error! status: ${response.status} - ${response.statusText}`);
        }
        
        // Check if the response is an array
        if (!Array.isArray(data)) {
          if (data && data.error) {
            throw new Error(`API Error: ${data.error}${data.details ? ` - ${data.details}` : ''}`);
          }
          throw new Error('Expected an array of explore items but received a different data type');
        }
        
        setExplores(data);
      } catch (error) {
        const errorMsg = error instanceof Error ? error.message : 'An unknown error occurred';
        console.error('Error fetching explore data:', error);
        setError(`Failed to load explore data: ${errorMsg}`);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <section id="explore" className="py-16 bg-gray-100">
      <h2 className="text-3xl font-bold mb-8 text-center">Explore Rabaul</h2>
      <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto px-6">
        {isLoading && <div className="col-span-3 text-center py-8">Loading explore data...</div>}
        {error && (
          <div className="col-span-3 text-center py-8 text-red-600">
            Error loading explore data: {error}
          </div>
        )}
        {!isLoading && !error && explores.length === 0 && (
          <div className="col-span-3 text-center py-8">No explore data available</div>
        )}
        {!isLoading && !error && explores.map((item) => {
          const img = item._embedded?.["wp:featuredmedia"]?.[0]?.source_url;
          return (
            <div key={item.id} className="bg-white rounded-lg shadow p-4">
              {img && (
                <img
                  src={img}
                  alt={item.title.rendered}
                  className="rounded mb-3 w-full h-40 object-cover"
                />
              )}
              <h3 className="text-xl font-semibold">{item.title.rendered}</h3>
              <p className="text-gray-600">{item.acf?.short_desc}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
