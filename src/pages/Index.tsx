import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import Icon from '@/components/ui/icon';

const categories = [
  { id: 1, name: 'Бани', icon: 'Droplets', color: 'bg-blue-500', emoji: '🛁' },
  { id: 2, name: 'Рестораны', icon: 'UtensilsCrossed', color: 'bg-orange-500', emoji: '🍽️' },
  { id: 3, name: 'Музеи', icon: 'Building2', color: 'bg-purple-500', emoji: '🏛️' },
  { id: 4, name: 'Концерты', icon: 'Music', color: 'bg-pink-500', emoji: '🎵' },
  { id: 5, name: 'Коворкинги', icon: 'Laptop', color: 'bg-green-500', emoji: '💼' },
  { id: 6, name: 'Кофейни', icon: 'Coffee', color: 'bg-amber-500', emoji: '☕' },
];

const allPlaces = [
  {
    id: 1,
    name: 'Сандуны',
    category: 'Бани',
    rating: 4.8,
    price: '₽₽₽',
    distance: '1.2 км',
    image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=400',
    tags: ['Панорамный вид', 'Премиум'],
    keywords: ['баня', 'баню', 'сауна', 'сандуны', 'вид', 'панорама'],
  },
  {
    id: 2,
    name: 'White Rabbit',
    category: 'Рестораны',
    rating: 4.9,
    price: '₽₽₽₽',
    distance: '2.5 км',
    image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400',
    tags: ['Вид на город', 'Мишлен'],
    keywords: ['ресторан', 'поесть', 'еда', 'кухня', 'вид', 'панорама', 'дорого', 'премиум'],
  },
  {
    id: 3,
    name: 'Третьяковская галерея',
    category: 'Музеи',
    rating: 4.7,
    price: '₽',
    distance: '3.1 км',
    image: 'https://images.unsplash.com/photo-1566127444979-b3d2b654e3d7?w=400',
    tags: ['Русское искусство', 'Классика'],
    keywords: ['музей', 'галерея', 'искусство', 'культура', 'третьяковка', 'картины'],
  },
  {
    id: 4,
    name: 'Кофемания',
    category: 'Кофейни',
    rating: 4.6,
    price: '₽₽',
    distance: '0.8 км',
    image: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=400',
    tags: ['Завтраки', 'Wi-Fi'],
    keywords: ['кофе', 'кофейня', 'завтрак', 'поработать', 'wifi', 'близко', 'рядом'],
  },
  {
    id: 5,
    name: 'Стрелка',
    category: 'Коворкинги',
    rating: 4.8,
    price: '₽₽₽',
    distance: '2.3 км',
    image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=400',
    tags: ['Коворкинг', 'Терраса'],
    keywords: ['коворкинг', 'работать', 'офис', 'место для работы', 'wi-fi', 'терраса'],
  },
  {
    id: 6,
    name: 'Дом Культуры',
    category: 'Концерты',
    rating: 4.7,
    price: '₽₽',
    distance: '1.9 км',
    image: 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=400',
    tags: ['Живая музыка', 'Бар'],
    keywords: ['концерт', 'музыка', 'живая музыка', 'выступление', 'бар', 'вечер'],
  },
];

export default function Index() {
  const navigate = useNavigate();
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [finalTranscript, setFinalTranscript] = useState('');
  const [isSupported, setIsSupported] = useState(true);
  const [userLevel] = useState(12);
  const [userXP] = useState(65);
  const [achievements] = useState(8);
  const [filteredPlaces, setFilteredPlaces] = useState(allPlaces.slice(0, 3));
  const [searchApplied, setSearchApplied] = useState(false);
  const recognitionRef = useRef<any>(null);

  const analyzeQuery = (query: string) => {
    const lowerQuery = query.toLowerCase();
    
    const matches = allPlaces.filter(place => {
      const categoryMatch = place.category.toLowerCase().includes(lowerQuery) || 
                           lowerQuery.includes(place.category.toLowerCase());
      const keywordMatch = place.keywords.some(keyword => 
        lowerQuery.includes(keyword) || keyword.includes(lowerQuery)
      );
      const nameMatch = place.name.toLowerCase().includes(lowerQuery);
      
      return categoryMatch || keywordMatch || nameMatch;
    });

    if (matches.length > 0) {
      setFilteredPlaces(matches);
      setSearchApplied(true);
    } else {
      setFilteredPlaces(allPlaces.slice(0, 3));
      setSearchApplied(false);
    }
  };

  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      setIsSupported(false);
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'ru-RU';

    recognition.onresult = (event: any) => {
      let interimTranscript = '';
      let finalText = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcriptPiece = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalText += transcriptPiece + ' ';
        } else {
          interimTranscript += transcriptPiece;
        }
      }

      setTranscript(interimTranscript);
      if (finalText) {
        setFinalTranscript(prev => prev + finalText);
      }
    };

    recognition.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error);
      if (event.error === 'not-allowed') {
        setIsSupported(false);
      }
      setIsRecording(false);
    };

    recognition.onend = () => {
      setIsRecording(false);
    };

    recognitionRef.current = recognition;

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  useEffect(() => {
    if (!isRecording && finalTranscript) {
      analyzeQuery(finalTranscript);
    }
  }, [isRecording, finalTranscript]);

  const handleVoiceClick = () => {
    if (!isSupported) {
      alert('Ваш браузер не поддерживает распознавание речи. Попробуйте Chrome или Edge.');
      return;
    }

    if (isRecording) {
      recognitionRef.current?.stop();
      setIsRecording(false);
    } else {
      setTranscript('');
      setFinalTranscript('');
      setSearchApplied(false);
      recognitionRef.current?.start();
      setIsRecording(true);
    }
  };

  const handleQuickSearch = (query: string) => {
    setFinalTranscript(query);
    analyzeQuery(query);
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="container max-w-6xl mx-auto px-4 py-6 space-y-8">
        
        <div className="glass rounded-3xl p-6 animate-fade-in">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold gradient-primary bg-clip-text text-transparent">
                UrbanVoice Guide
              </h1>
              <p className="text-muted-foreground mt-1">Ваш личный городской гид</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-2xl font-bold text-primary">{userLevel}</span>
                  <Badge variant="secondary" className="gradient-primary">
                    Исследователь
                  </Badge>
                </div>
                <Progress value={userXP} className="w-32 h-2" />
              </div>
              <div className="relative">
                <div className="w-14 h-14 rounded-full gradient-primary flex items-center justify-center text-2xl font-bold animate-pulse-glow">
                  {achievements}
                </div>
                <Icon name="Trophy" className="absolute -top-1 -right-1 text-yellow-400" size={20} />
              </div>
            </div>
          </div>
        </div>

        <div className="relative">
          <div className="glass rounded-3xl p-12 text-center animate-scale-in">
            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-3">Расскажите, что ищете?</h2>
              <p className="text-muted-foreground">
                Нажмите на микрофон и опишите ваши планы
              </p>
            </div>

            <button
              onClick={handleVoiceClick}
              className={`relative w-32 h-32 rounded-full gradient-primary transition-all duration-300 hover:scale-110 ${
                isRecording ? 'animate-pulse-glow scale-110' : ''
              }`}
            >
              {isRecording && (
                <span className="absolute inset-0 rounded-full bg-secondary animate-ping opacity-75" />
              )}
              <Icon
                name={isRecording ? 'MicOff' : 'Mic'}
                size={48}
                className="absolute inset-0 m-auto text-white"
              />
            </button>

            {isRecording && (
              <div className="mt-6 animate-fade-in">
                <p className="text-primary font-semibold text-lg mb-2">🎤 Слушаю...</p>
                <div className="flex justify-center gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <div
                      key={i}
                      className="w-1 bg-primary rounded-full animate-pulse"
                      style={{
                        height: `${Math.random() * 30 + 10}px`,
                        animationDelay: `${i * 0.1}s`,
                      }}
                    />
                  ))}
                </div>
                {(transcript || finalTranscript) && (
                  <div className="glass rounded-2xl p-4 max-w-lg mx-auto text-left">
                    <p className="text-foreground">
                      {finalTranscript}
                      <span className="text-muted-foreground">{transcript}</span>
                      <span className="inline-block w-0.5 h-5 bg-primary animate-pulse ml-1" />
                    </p>
                  </div>
                )}
              </div>
            )}

            {!isRecording && finalTranscript && (
              <div className="mt-6 animate-fade-in">
                <div className="glass rounded-2xl p-4 max-w-lg mx-auto">
                  <div className="flex items-start gap-3">
                    <Icon name="MessageSquare" size={20} className="text-primary mt-1" />
                    <div className="flex-1">
                      <p className="text-sm text-muted-foreground mb-1">Ваш запрос:</p>
                      <p className="text-foreground">{finalTranscript}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="mt-8 flex flex-wrap justify-center gap-2">
              <Badge 
                variant="outline" 
                className="cursor-pointer hover:bg-primary/20 transition-colors"
                onClick={() => handleQuickSearch('Найти баню с видом')}
              >
                Найти баню с видом
              </Badge>
              <Badge 
                variant="outline" 
                className="cursor-pointer hover:bg-primary/20 transition-colors"
                onClick={() => handleQuickSearch('Ресторан рядом')}
              >
                Ресторан рядом
              </Badge>
              <Badge 
                variant="outline" 
                className="cursor-pointer hover:bg-primary/20 transition-colors"
                onClick={() => handleQuickSearch('кофейня')}
              >
                Кофейня поблизости
              </Badge>
            </div>
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold">Категории</h3>
            <button className="text-primary hover:text-primary/80 transition-colors flex items-center gap-1">
              Все <Icon name="ChevronRight" size={20} />
            </button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((cat, index) => (
              <Card
                key={cat.id}
                className="glass cursor-pointer hover:scale-105 transition-all duration-300 p-6 text-center animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className={`w-12 h-12 ${cat.color} rounded-2xl flex items-center justify-center mx-auto mb-3 text-2xl`}>
                  {cat.emoji}
                </div>
                <p className="font-semibold text-sm">{cat.name}</p>
              </Card>
            ))}
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold">
              {searchApplied ? `Найдено мест: ${filteredPlaces.length}` : 'Популярные места'}
            </h3>
            <button className="text-primary hover:text-primary/80 transition-colors flex items-center gap-1">
              Показать на карте <Icon name="Map" size={20} />
            </button>
          </div>
          {searchApplied && finalTranscript && (
            <div className="mb-6 glass rounded-2xl p-4 animate-fade-in">
              <div className="flex items-center gap-3">
                <Icon name="Search" size={20} className="text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Результаты по запросу:</p>
                  <p className="font-semibold">{finalTranscript}</p>
                </div>
              </div>
            </div>
          )}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPlaces.map((place, index) => (
              <Card
                key={place.id}
                className="glass overflow-hidden cursor-pointer hover:scale-105 transition-all duration-300 animate-fade-in"
                style={{ animationDelay: `${index * 0.15}s` }}
                onClick={() => navigate(`/place?id=${place.id}`)}
              >
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={place.image}
                    alt={place.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-3 right-3 glass rounded-full px-3 py-1 flex items-center gap-1">
                    <Icon name="Star" size={16} className="text-yellow-400 fill-yellow-400" />
                    <span className="font-bold text-sm">{place.rating}</span>
                  </div>
                </div>
                <div className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-bold text-lg">{place.name}</h4>
                    <span className="text-muted-foreground text-sm">{place.price}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                    <Badge variant="secondary" className="text-xs">
                      {place.category}
                    </Badge>
                    <span className="flex items-center gap-1">
                      <Icon name="MapPin" size={14} />
                      {place.distance}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {place.tags.map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  <div className="mt-4 flex gap-2">
                    <button className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground py-2 rounded-xl font-semibold transition-colors flex items-center justify-center gap-2">
                      <Icon name="Navigation" size={16} />
                      Маршрут
                    </button>
                    <button className="glass p-2 rounded-xl hover:bg-primary/20 transition-colors">
                      <Icon name="Heart" size={20} />
                    </button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        <div className="glass rounded-3xl p-8 animate-fade-in">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold mb-2">Достижения недели</h3>
              <p className="text-muted-foreground">Посетите 3 новых места и получите бонус!</p>
            </div>
            <div className="flex gap-3">
              <div className="text-center animate-float">
                <div className="w-16 h-16 rounded-2xl gradient-primary flex items-center justify-center text-3xl mb-2">
                  🏆
                </div>
                <p className="text-xs text-muted-foreground">Первопроходец</p>
              </div>
              <div className="text-center animate-float" style={{ animationDelay: '0.2s' }}>
                <div className="w-16 h-16 rounded-2xl gradient-accent flex items-center justify-center text-3xl mb-2">
                  🎯
                </div>
                <p className="text-xs text-muted-foreground">Меткий</p>
              </div>
              <div className="text-center animate-float" style={{ animationDelay: '0.4s' }}>
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-yellow-500 to-orange-500 flex items-center justify-center text-3xl mb-2 opacity-40">
                  🌟
                </div>
                <p className="text-xs text-muted-foreground">Скоро...</p>
              </div>
            </div>
          </div>
        </div>

        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 glass rounded-full p-4 flex items-center gap-6 animate-scale-in">
          <button className="hover:scale-110 transition-transform">
            <Icon name="Home" size={24} className="text-primary" />
          </button>
          <button className="hover:scale-110 transition-transform">
            <Icon name="Search" size={24} className="text-muted-foreground" />
          </button>
          <button className="hover:scale-110 transition-transform">
            <Icon name="History" size={24} className="text-muted-foreground" />
          </button>
          <button className="hover:scale-110 transition-transform">
            <Icon name="User" size={24} className="text-muted-foreground" />
          </button>
        </div>
      </div>
    </div>
  );
}