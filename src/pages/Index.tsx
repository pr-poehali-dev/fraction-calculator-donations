import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Icon from '@/components/ui/icon';
import { toast } from 'sonner';
import { VisitorCounter } from '@/components/VisitorCounter';
import { AdBanner } from '@/components/AdBanner';

interface Fraction {
  numerator: number;
  denominator: number;
}

interface HistoryItem {
  id: number;
  expression: string;
  result: string;
  timestamp: Date;
}

const Index = () => {
  const [display, setDisplay] = useState('0');
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [isFractionMode, setIsFractionMode] = useState(false);
  const [currentFraction, setCurrentFraction] = useState<Partial<Fraction>>({});

  const gcd = (a: number, b: number): number => {
    return b === 0 ? Math.abs(a) : gcd(b, a % b);
  };

  const simplifyFraction = (num: number, den: number): Fraction => {
    const divisor = gcd(num, den);
    return {
      numerator: num / divisor,
      denominator: den / divisor
    };
  };

  const addToHistory = (expr: string, res: string) => {
    const newItem: HistoryItem = {
      id: Date.now(),
      expression: expr,
      result: res,
      timestamp: new Date()
    };
    setHistory(prev => [newItem, ...prev].slice(0, 10));
  };

  const handleNumberClick = (num: string) => {
    if (display === '0') {
      setDisplay(num);
    } else {
      setDisplay(display + num);
    }
  };

  const handleOperatorClick = (operator: string) => {
    setDisplay(display + ' ' + operator + ' ');
  };

  const calculateResult = () => {
    try {
      const result = eval(display);
      const resultStr = result.toString();
      addToHistory(display, resultStr);
      setDisplay(resultStr);
      toast.success('Вычислено успешно!');
    } catch (error) {
      toast.error('Ошибка вычисления');
    }
  };

  const clearDisplay = () => {
    setDisplay('0');
    setCurrentFraction({});
  };

  const handleFractionInput = (type: 'numerator' | 'denominator', value: string) => {
    setCurrentFraction(prev => ({
      ...prev,
      [type]: parseInt(value) || 0
    }));
  };

  const calculateFraction = (operation: 'add' | 'subtract' | 'multiply' | 'divide') => {
    const { numerator, denominator } = currentFraction;
    if (!numerator || !denominator) {
      toast.error('Введите числитель и знаменатель');
      return;
    }

    const simplified = simplifyFraction(numerator, denominator);
    const result = `${simplified.numerator}/${simplified.denominator}`;
    addToHistory(`${numerator}/${denominator}`, result);
    toast.success('Дробь упрощена!');
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Скопировано в буфер обмена');
  };

  const handleSBPDonation = () => {
    const phone = '+79045242283';
    const sbpUrl = `https://qr.nspk.ru/AS10003KKSOR2VMOQOLNPJC0NU8NBGQ2?type=02&bank=100000000111&sum=100&cur=RUB&crc=1234`;
    
    toast.success('Переход к оплате через СБП');
    window.open(sbpUrl, '_blank');
  };

  const buttons = [
    '7', '8', '9', '/',
    '4', '5', '6', '*',
    '1', '2', '3', '-',
    '0', '.', '=', '+'
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a1625] via-[#221a2e] to-[#1a1625] p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8 animate-fade-in">
          <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-[#8B5CF6] via-[#D946EF] to-[#F97316] bg-clip-text text-transparent">
            Калькулятор Pro
          </h1>
          <p className="text-gray-400 text-lg">Вычисления дробей и чисел с историей</p>
        </div>

        <div className="mb-6">
          <AdBanner />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Tabs defaultValue="calculator" className="w-full">
              <TabsList className="grid w-full grid-cols-3 mb-6 bg-white/5 backdrop-blur-lg border border-white/10">
                <TabsTrigger value="calculator" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#8B5CF6] data-[state=active]:to-[#D946EF]">
                  <Icon name="Calculator" className="mr-2" size={18} />
                  Калькулятор
                </TabsTrigger>
                <TabsTrigger value="fractions" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#8B5CF6] data-[state=active]:to-[#D946EF]">
                  <Icon name="Divide" className="mr-2" size={18} />
                  Дроби
                </TabsTrigger>
                <TabsTrigger value="donate" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#0EA5E9] data-[state=active]:to-[#F97316]">
                  <Icon name="Heart" className="mr-2" size={18} />
                  Донат
                </TabsTrigger>
              </TabsList>

              <TabsContent value="calculator" className="animate-scale-in">
                <Card className="bg-white/5 backdrop-blur-lg border-white/10 p-6">
                  <div className="mb-6 bg-black/30 rounded-2xl p-6 border border-white/10">
                    <div className="text-right text-4xl md:text-5xl font-bold text-white min-h-[60px] break-all">
                      {display}
                    </div>
                  </div>

                  <div className="grid grid-cols-4 gap-3">
                    {buttons.map((btn) => (
                      <Button
                        key={btn}
                        onClick={() => {
                          if (btn === '=') calculateResult();
                          else if (['+', '-', '*', '/'].includes(btn)) handleOperatorClick(btn);
                          else handleNumberClick(btn);
                        }}
                        className={`h-16 text-2xl font-semibold transition-all duration-200 hover:scale-105 ${
                          btn === '='
                            ? 'bg-gradient-to-r from-[#8B5CF6] to-[#D946EF] hover:from-[#7C4FE5] hover:to-[#C835DE] text-white'
                            : ['+', '-', '*', '/'].includes(btn)
                            ? 'bg-gradient-to-r from-[#0EA5E9] to-[#06b6d4] hover:from-[#0c94d1] hover:to-[#05a5bc] text-white'
                            : 'bg-white/10 hover:bg-white/20 text-white backdrop-blur-sm border border-white/10'
                        }`}
                      >
                        {btn}
                      </Button>
                    ))}
                  </div>

                  <Button
                    onClick={clearDisplay}
                    className="w-full mt-4 h-14 bg-gradient-to-r from-[#F97316] to-[#FB923C] hover:from-[#EA6A0F] hover:to-[#F08328] text-white text-lg font-semibold transition-all duration-200 hover:scale-105"
                  >
                    <Icon name="Trash2" className="mr-2" size={20} />
                    Очистить
                  </Button>
                </Card>
              </TabsContent>

              <TabsContent value="fractions" className="animate-scale-in">
                <Card className="bg-white/5 backdrop-blur-lg border-white/10 p-6">
                  <h2 className="text-2xl font-bold mb-6 text-white">Работа с дробями</h2>
                  
                  <div className="space-y-6">
                    <div className="bg-black/30 rounded-2xl p-6 border border-white/10">
                      <div className="flex items-center justify-center gap-4">
                        <div className="flex flex-col items-center">
                          <input
                            type="number"
                            placeholder="Числитель"
                            onChange={(e) => handleFractionInput('numerator', e.target.value)}
                            className="w-32 h-16 text-center text-3xl font-bold bg-white/10 border border-white/20 rounded-xl text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-[#8B5CF6]"
                          />
                          <div className="h-1 w-full bg-gradient-to-r from-[#8B5CF6] to-[#D946EF] my-2 rounded-full"></div>
                          <input
                            type="number"
                            placeholder="Знаменатель"
                            onChange={(e) => handleFractionInput('denominator', e.target.value)}
                            className="w-32 h-16 text-center text-3xl font-bold bg-white/10 border border-white/20 rounded-xl text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-[#8B5CF6]"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <Button
                        onClick={() => calculateFraction('add')}
                        className="h-14 bg-gradient-to-r from-[#8B5CF6] to-[#D946EF] hover:from-[#7C4FE5] hover:to-[#C835DE] text-white font-semibold transition-all duration-200 hover:scale-105"
                      >
                        Упростить дробь
                      </Button>
                      <Button
                        onClick={clearDisplay}
                        className="h-14 bg-white/10 hover:bg-white/20 text-white font-semibold backdrop-blur-sm border border-white/10 transition-all duration-200 hover:scale-105"
                      >
                        Очистить
                      </Button>
                    </div>

                    <div className="bg-gradient-to-r from-[#0EA5E9]/20 to-[#F97316]/20 rounded-2xl p-4 border border-white/10">
                      <p className="text-gray-300 text-sm">
                        💡 Введите числитель и знаменатель, чтобы упростить дробь до несократимого вида
                      </p>
                    </div>
                  </div>
                </Card>
              </TabsContent>

              <TabsContent value="donate" className="animate-scale-in">
                <Card className="bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-lg border-white/10 p-8">
                  <div className="text-center space-y-6">
                    <div className="inline-block p-6 bg-gradient-to-br from-[#0EA5E9] to-[#F97316] rounded-3xl">
                      <Icon name="Heart" className="text-white" size={64} />
                    </div>
                    
                    <h2 className="text-3xl font-bold text-white">Поддержать проект</h2>
                    
                    <p className="text-gray-300 text-lg">
                      Если вам нравится наш калькулятор, вы можете отправить донат через СБП
                    </p>

                    <div className="bg-black/30 rounded-2xl p-6 border border-white/10">
                      <p className="text-gray-400 text-sm mb-2">Номер телефона для СБП:</p>
                      <div className="flex items-center justify-center gap-3">
                        <p className="text-3xl font-bold text-white">+7 904 524 22 83</p>
                        <Button
                          onClick={() => copyToClipboard('+79045242283')}
                          variant="ghost"
                          size="icon"
                          className="text-[#8B5CF6] hover:text-[#D946EF] hover:bg-white/10"
                        >
                          <Icon name="Copy" size={20} />
                        </Button>
                      </div>
                    </div>

                    <Button
                      onClick={handleSBPDonation}
                      className="w-full h-16 bg-gradient-to-r from-[#0EA5E9] to-[#F97316] hover:from-[#0c94d1] hover:to-[#EA6A0F] text-white text-xl font-bold transition-all duration-200 hover:scale-105"
                    >
                      <Icon name="Smartphone" className="mr-3" size={24} />
                      Открыть СБП
                    </Button>

                    <p className="text-gray-400 text-sm">
                      Спасибо за вашу поддержку! ❤️
                    </p>
                  </div>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          <div className="lg:col-span-1">
            <Card className="bg-white/5 backdrop-blur-lg border-white/10 p-6 sticky top-8">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-white">История</h3>
                <Button
                  onClick={() => setHistory([])}
                  variant="ghost"
                  size="icon"
                  className="text-gray-400 hover:text-white hover:bg-white/10"
                >
                  <Icon name="Trash2" size={18} />
                </Button>
              </div>

              <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                {history.length === 0 ? (
                  <div className="text-center py-12 text-gray-500">
                    <Icon name="History" className="mx-auto mb-3 opacity-50" size={48} />
                    <p>История пуста</p>
                  </div>
                ) : (
                  history.map((item, index) => (
                    <div
                      key={item.id}
                      onClick={() => setDisplay(item.result)}
                      className="bg-white/5 hover:bg-white/10 rounded-xl p-4 cursor-pointer transition-all duration-200 hover:scale-105 border border-white/10 animate-fade-in"
                      style={{ animationDelay: `${index * 0.05}s` }}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <p className="text-gray-400 text-sm break-all">{item.expression}</p>
                        <Button
                          onClick={(e) => {
                            e.stopPropagation();
                            copyToClipboard(item.result);
                          }}
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 text-gray-500 hover:text-[#8B5CF6]"
                        >
                          <Icon name="Copy" size={14} />
                        </Button>
                      </div>
                      <p className="text-2xl font-bold bg-gradient-to-r from-[#8B5CF6] to-[#D946EF] bg-clip-text text-transparent break-all">
                        = {item.result}
                      </p>
                      <p className="text-xs text-gray-600 mt-2">
                        {item.timestamp.toLocaleTimeString('ru-RU')}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </Card>
          </div>
        </div>

        <Card className="bg-gradient-to-r from-white/5 to-white/10 backdrop-blur-lg border-white/10 p-6 mt-6">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-gradient-to-br from-[#8B5CF6] to-[#D946EF] rounded-xl">
              <Icon name="Info" className="text-white" size={24} />
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-bold text-white mb-3">Справка по использованию</h3>
              <div className="grid md:grid-cols-3 gap-4 text-gray-300 text-sm">
                <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                  <p className="font-semibold mb-2 text-[#8B5CF6]">📱 Калькулятор</p>
                  <p>Выполняйте математические операции с обычными числами. Поддержка операций +, -, *, /</p>
                </div>
                <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                  <p className="font-semibold mb-2 text-[#D946EF]">🔢 Дроби</p>
                  <p>Упрощайте дроби до несократимого вида. Введите числитель и знаменатель</p>
                </div>
                <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                  <p className="font-semibold mb-2 text-[#0EA5E9]">📜 История</p>
                  <p>Все вычисления сохраняются. Кликните на результат, чтобы использовать его снова</p>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: linear-gradient(to bottom, #8B5CF6, #D946EF);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(to bottom, #7C4FE5, #C835DE);
        }
      `}</style>
      <VisitorCounter />
    </div>
  );
};

export default Index;