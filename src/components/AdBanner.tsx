import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { useNavigate } from 'react-router-dom';

interface Ad {
  id: number;
  company_name: string;
  ad_title: string;
  ad_description: string;
  ad_url?: string;
  image_url?: string;
}

export const AdBanner = () => {
  const navigate = useNavigate();
  const [ad, setAd] = useState<Ad | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAd = async () => {
      try {
        const response = await fetch('https://functions.poehali.dev/feb7b03f-b27c-4e33-8df2-7e8ca7886607');
        const data = await response.json();
        
        if (data.id) {
          setAd(data);
        }
      } catch (error) {
        console.error('Error fetching ad:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAd();
  }, []);

  const handleAdClick = () => {
    if (ad?.ad_url) {
      window.open(ad.ad_url, '_blank');
    }
  };

  if (loading || !ad) {
    return (
      <Card className="bg-gradient-to-r from-white/5 to-white/10 backdrop-blur-lg border-white/10 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-[#F97316] to-[#FB923C] rounded-lg">
              <Icon name="Megaphone" className="text-white" size={20} />
            </div>
            <div>
              <p className="text-white font-semibold">Рекламное место свободно</p>
              <p className="text-sm text-gray-400">Разместите здесь своё объявление</p>
            </div>
          </div>
          <Button
            onClick={() => navigate('/advertise')}
            className="bg-gradient-to-r from-[#F97316] to-[#FB923C] hover:from-[#EA6A0F] hover:to-[#F08328] text-white"
          >
            Разместить рекламу
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <Card className="bg-gradient-to-r from-white/5 to-white/10 backdrop-blur-lg border-white/10 p-4 hover:scale-[1.02] transition-all duration-300 cursor-pointer" onClick={handleAdClick}>
      <div className="flex items-start gap-3">
        <div className="p-2 bg-gradient-to-br from-[#F97316] to-[#FB923C] rounded-lg flex-shrink-0">
          <Icon name="Megaphone" className="text-white" size={20} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <p className="text-xs text-gray-400 uppercase tracking-wider">Реклама</p>
            <span className="text-gray-500">•</span>
            <p className="text-xs text-gray-400">{ad.company_name}</p>
          </div>
          <h4 className="text-white font-semibold mb-1 truncate">{ad.ad_title}</h4>
          <p className="text-sm text-gray-300 line-clamp-2">{ad.ad_description}</p>
          {ad.ad_url && (
            <div className="flex items-center gap-1 mt-2 text-xs text-[#8B5CF6]">
              <span>Подробнее</span>
              <Icon name="ExternalLink" size={12} />
            </div>
          )}
        </div>
        {ad.image_url && (
          <img 
            src={ad.image_url} 
            alt={ad.ad_title} 
            className="w-16 h-16 object-cover rounded-lg flex-shrink-0"
          />
        )}
      </div>
    </Card>
  );
};