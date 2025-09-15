import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';

interface AttractionCardProps {
  title: string;
  description: string;
  imageSrc: string;
}

export function AttractionCard({ title, description, imageSrc }: AttractionCardProps) {
  return (
    <Card className="overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1 h-full flex flex-col">
      <div className="relative h-48 w-full">
        <Image
          src={`/images/cards/${imageSrc}`}
          alt={title}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </div>
      <CardContent className="p-4 flex-1 flex flex-col">
        <h3 className="text-lg font-semibold mb-2">{title}</h3>
        <p className="text-sm text-gray-600 flex-1">{description}</p>
      </CardContent>
    </Card>
  );
}
