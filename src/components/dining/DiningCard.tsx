import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';

const DiningCard = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
    >
      <div className="relative h-64 w-full">
        <Image
          src="/images/amenities/phoenix.jpeg"
          alt="The Phoenix Restaurant"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-0 left-0 p-6 text-white">
          <h3 className="text-2xl font-bold mb-1">The Phoenix Restaurant</h3>
          <p className="text-gray-200">International Cuisine</p>
        </div>
      </div>
      <div className="p-6">
        <p className="text-gray-600 mb-4 line-clamp-3">
          Boasting one of the best International Menus in Papua New Guinea, The Phoenix Restaurant offers a unique dining experience with a rich history and cultural significance.
        </p>
        <Link 
          href="/dining" 
          className="inline-flex items-center text-amber-600 hover:text-amber-700 font-medium transition-colors"
        >
          Discover More
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </Link>
      </div>
    </motion.div>
  );
};

export default DiningCard;
