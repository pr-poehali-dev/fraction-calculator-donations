import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

const Advertise = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    company_name: '',
    contact_email: '',
    contact_phone: '',
    ad_title: '',
    ad_description: '',
    ad_url: '',
    image_url: '',
    price_per_day: '500',
    start_date: '',
    end_date: ''
  });
  const [submitting, setSubmitting] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const calculateCost = () => {
    if (formData.start_date && formData.end_date) {
      const start = new Date(formData.start_date);
      const end = new Date(formData.end_date);
      const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
      return days > 0 ? days * parseFloat(formData.price_per_day) : 0;
    }
    return 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const response = await fetch('https://functions.poehali.dev/feb7b03f-b27c-4e33-8df2-7e8ca7886607', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();
      
      if (response.ok) {
        toast.success(`Заявка отправлена! К оплате: ${data.total_cost} ₽`);
        toast.info(`Переведите ${data.total_cost} ₽ на номер ${data.payment_phone} через СБП`);
        setFormData({
          company_name: '',
          contact_email: '',
          contact_phone: '',
          ad_title: '',
          ad_description: '',
          ad_url: '',
          image_url: '',
          price_per_day: '500',
          start_date: '',
          end_date: ''
        });
      }
    } catch (error) {
      toast.error('Ошибка отправки заявки');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a1625] via-[#221a2e] to-[#1a1625] p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <Button
          onClick={() => navigate('/')}
          variant="ghost"
          className="mb-6 text-white hover:bg-white/10"
        >
          <Icon name="ArrowLeft" className="mr-2" size={18} />
          Назад к калькулятору
        </Button>

        <div className="text-center mb-8 animate-fade-in">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-[#F97316] via-[#FB923C] to-[#F59E0B] bg-clip-text text-transparent">
            Разместите рекламу
          </h1>
          <p className="text-gray-400 text-lg">Ваше объявление увидят тысячи пользователей калькулятора</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-6">
          <Card className="bg-white/5 backdrop-blur-lg border-white/10 p-6">
            <div className="flex items-start gap-3 mb-4">
              <div className="p-3 bg-gradient-to-br from-[#8B5CF6] to-[#D946EF] rounded-xl">
                <Icon name="Users" className="text-white" size={24} />
              </div>
              <div>
                <h3 className="text-white font-semibold text-lg">Широкий охват</h3>
                <p className="text-gray-400 text-sm">Тысячи активных пользователей ежедневно</p>
              </div>
            </div>
          </Card>

          <Card className="bg-white/5 backdrop-blur-lg border-white/10 p-6">
            <div className="flex items-start gap-3 mb-4">
              <div className="p-3 bg-gradient-to-br from-[#0EA5E9] to-[#06b6d4] rounded-xl">
                <Icon name="Target" className="text-white" size={24} />
              </div>
              <div>
                <h3 className="text-white font-semibold text-lg">Целевая аудитория</h3>
                <p className="text-gray-400 text-sm">Люди, интересующиеся математикой и расчетами</p>
              </div>
            </div>
          </Card>
        </div>

        <Card className="bg-white/5 backdrop-blur-lg border-white/10 p-6 md:p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="text-white font-semibold mb-2 block">
                  Название компании *
                </label>
                <input
                  type="text"
                  name="company_name"
                  value={formData.company_name}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-[#8B5CF6]"
                  placeholder="ООО Ромашка"
                />
              </div>

              <div>
                <label className="text-white font-semibold mb-2 block">
                  Email для связи *
                </label>
                <input
                  type="email"
                  name="contact_email"
                  value={formData.contact_email}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-[#8B5CF6]"
                  placeholder="info@example.com"
                />
              </div>
            </div>

            <div>
              <label className="text-white font-semibold mb-2 block">
                Телефон для связи
              </label>
              <input
                type="tel"
                name="contact_phone"
                value={formData.contact_phone}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-[#8B5CF6]"
                placeholder="+7 900 123 45 67"
              />
            </div>

            <div>
              <label className="text-white font-semibold mb-2 block">
                Заголовок объявления *
              </label>
              <input
                type="text"
                name="ad_title"
                value={formData.ad_title}
                onChange={handleInputChange}
                required
                maxLength={100}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-[#8B5CF6]"
                placeholder="Скидка 50% на все товары!"
              />
            </div>

            <div>
              <label className="text-white font-semibold mb-2 block">
                Описание *
              </label>
              <textarea
                name="ad_description"
                value={formData.ad_description}
                onChange={handleInputChange}
                required
                maxLength={250}
                rows={3}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-[#8B5CF6] resize-none"
                placeholder="Краткое описание вашего предложения..."
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="text-white font-semibold mb-2 block">
                  Ссылка на сайт
                </label>
                <input
                  type="url"
                  name="ad_url"
                  value={formData.ad_url}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-[#8B5CF6]"
                  placeholder="https://example.com"
                />
              </div>

              <div>
                <label className="text-white font-semibold mb-2 block">
                  Ссылка на изображение
                </label>
                <input
                  type="url"
                  name="image_url"
                  value={formData.image_url}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-[#8B5CF6]"
                  placeholder="https://example.com/image.jpg"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <label className="text-white font-semibold mb-2 block">
                  Дата начала *
                </label>
                <input
                  type="date"
                  name="start_date"
                  value={formData.start_date}
                  onChange={handleInputChange}
                  required
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-[#8B5CF6]"
                />
              </div>

              <div>
                <label className="text-white font-semibold mb-2 block">
                  Дата окончания *
                </label>
                <input
                  type="date"
                  name="end_date"
                  value={formData.end_date}
                  onChange={handleInputChange}
                  required
                  min={formData.start_date || new Date().toISOString().split('T')[0]}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-[#8B5CF6]"
                />
              </div>

              <div>
                <label className="text-white font-semibold mb-2 block">
                  Цена за день (₽)
                </label>
                <input
                  type="number"
                  name="price_per_day"
                  value={formData.price_per_day}
                  onChange={handleInputChange}
                  required
                  min="100"
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-[#8B5CF6]"
                />
              </div>
            </div>

            {formData.start_date && formData.end_date && (
              <Card className="bg-gradient-to-r from-[#8B5CF6]/20 to-[#D946EF]/20 border-[#8B5CF6]/30 p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Icon name="Calculator" className="text-[#8B5CF6]" size={20} />
                    <span className="text-white font-semibold">Итоговая стоимость:</span>
                  </div>
                  <span className="text-2xl font-bold text-white">
                    {calculateCost().toLocaleString('ru-RU')} ₽
                  </span>
                </div>
              </Card>
            )}

            <Card className="bg-gradient-to-r from-[#F97316]/20 to-[#FB923C]/20 border-[#F97316]/30 p-4">
              <div className="flex items-start gap-3">
                <Icon name="Info" className="text-[#F97316] flex-shrink-0 mt-1" size={20} />
                <div className="text-sm text-gray-300">
                  <p className="font-semibold text-white mb-1">Оплата через СБП</p>
                  <p>После отправки заявки переведите указанную сумму на номер <span className="font-semibold text-white">+7 904 524 22 83</span> через Систему Быстрых Платежей. Реклама будет активирована после подтверждения оплаты.</p>
                </div>
              </div>
            </Card>

            <Button
              type="submit"
              disabled={submitting}
              className="w-full h-14 bg-gradient-to-r from-[#F97316] to-[#FB923C] hover:from-[#EA6A0F] hover:to-[#F08328] text-white text-lg font-semibold transition-all duration-200 hover:scale-105"
            >
              {submitting ? (
                <>
                  <Icon name="Loader2" className="mr-2 animate-spin" size={20} />
                  Отправка...
                </>
              ) : (
                <>
                  <Icon name="Send" className="mr-2" size={20} />
                  Отправить заявку
                </>
              )}
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default Advertise;
