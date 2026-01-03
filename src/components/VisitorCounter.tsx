import { useEffect, useState } from 'react';
import Icon from '@/components/ui/icon';

export const VisitorCounter = () => {
  const [visitorData, setVisitorData] = useState<{ total: number; today: number } | null>(null);

  useEffect(() => {
    const incrementAndFetch = async () => {
      try {
        await fetch('https://functions.poehali.dev/d22d8456-3666-4f85-9b9b-1df366fbc732', {
          method: 'POST',
        });

        const response = await fetch('https://functions.poehali.dev/d22d8456-3666-4f85-9b9b-1df366fbc732');
        const data = await response.json();
        setVisitorData(data);
      } catch (error) {
        console.error('Error tracking visitor:', error);
      }
    };

    incrementAndFetch();
  }, []);

  if (!visitorData) return null;

  return (
    <div className="fixed bottom-4 right-4 bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-4 shadow-lg">
      <div className="flex items-center gap-3 text-white">
        <Icon name="Users" size={24} className="text-[#8B5CF6]" />
        <div>
          <div className="text-xs text-gray-400">Посетителей</div>
          <div className="flex gap-4 text-sm">
            <div>
              <span className="font-semibold">{visitorData.today}</span>
              <span className="text-gray-400 ml-1">сегодня</span>
            </div>
            <div className="border-l border-white/20 pl-4">
              <span className="font-semibold">{visitorData.total}</span>
              <span className="text-gray-400 ml-1">всего</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
