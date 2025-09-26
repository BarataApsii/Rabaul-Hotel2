import Image from 'next/image';

const LotsToDoSection = () => {
  return (
    <section className="py-12 md:py-16 bg-green-800 text-white">
      <div className="container mx-auto px-4 max-w-7xl">
        <h2 className="text-3xl md:text-4xl font-bold mb-2 text-center">Lots to do & see!</h2>
        <div className="w-20 h-1 bg-yellow-400 mx-auto mb-8"></div>
        <p className="text-xl text-center mb-12 max-w-3xl mx-auto">
          Surrounded by historic and natural attractions. Scuba Dive, Trek, Discover, Eat, Play and all within walking distance!
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {/* At the volcano card */}
          <div className="relative h-48 rounded-xl overflow-hidden group">
            <div 
              className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
              style={{ backgroundImage: 'url(/images/at-the-crater.jpg)' }}
            >
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>
            </div>
            <div className="relative h-full flex flex-col justify-end p-6">
              <h3 className="text-xl font-bold text-yellow-400 mb-2">At the Volcano</h3>
              <p className="text-white/90 text-sm">Witness the raw power of nature with stunning volcanic views</p>
            </div>
          </div>
          
          {/* Japanese Bunker card */}
          <div className="relative h-48 rounded-xl overflow-hidden group">
            <div 
              className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
              style={{ backgroundImage: 'url(/images/Hotel-Japanese-Bunker.jpg)' }}
            >
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>
            </div>
            <div className="relative h-full flex flex-col justify-end p-6">
              <h3 className="text-xl font-bold text-yellow-400 mb-2">Japanese Bunker</h3>
              <p className="text-white/90 text-sm">Explore historic World War II relics around Rabaul</p>
            </div>
          </div>
        </div>
        
        <div className="mt-12 text-center">
          <p className="text-lg mb-6 max-w-3xl mx-auto">
            Experience the rich history and breathtaking natural beauty of Rabaul right at your doorstep.
          </p>
          <button className="px-6 py-3 bg-yellow-500 hover:bg-yellow-400 text-green-900 font-medium rounded-lg transition-colors duration-200">
            Explore More Attractions
          </button>
        </div>
      </div>
    </section>
  );
};

export default LotsToDoSection;
