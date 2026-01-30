import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';

const allPlaces = [
  {
    id: 1,
    name: 'Сандуны',
    category: 'Бани',
    rating: 4.8,
    price: '₽₽₽',
    distance: '1.2 км',
    image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=800',
    tags: ['Панорамный вид', 'Премиум'],
    description: 'Легендарные Сандуновские бани — исторический комплекс с роскошными интерьерами и панорамными видами. Идеальное место для релакса в центре Москвы.',
    address: 'Неглинная ул., 14, стр. 3-7',
    phone: '+7 (495) 925-46-31',
    hours: 'Пн-Вс: 08:00 - 22:00',
    reviews: 284,
    features: ['Бассейн', 'Массаж', 'Ресторан', 'VIP-залы', 'Парковка'],
  },
  {
    id: 2,
    name: 'White Rabbit',
    category: 'Рестораны',
    rating: 4.9,
    price: '₽₽₽₽',
    distance: '2.5 км',
    image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800',
    tags: ['Вид на город', 'Мишлен'],
    description: 'Ресторан высокой кухни на 16 этаже с панорамным видом на Москву. Авторская кухня от шеф-повара Владимира Мухина.',
    address: 'Смоленская пл., 3, 16 этаж',
    phone: '+7 (495) 510-58-08',
    hours: 'Пн-Вс: 12:00 - 00:00',
    reviews: 512,
    features: ['Панорамный вид', 'Винная карта', 'Дресс-код', 'Бронь столов', 'Банкеты'],
  },
  {
    id: 3,
    name: 'Третьяковская галерея',
    category: 'Музеи',
    rating: 4.7,
    price: '₽',
    distance: '3.1 км',
    image: 'https://images.unsplash.com/photo-1566127444979-b3d2b654e3d7?w=800',
    tags: ['Русское искусство', 'Классика'],
    description: 'Главный музей русского искусства с коллекцией от древнерусских икон до работ начала XX века. Более 180 000 экспонатов.',
    address: 'Лаврушинский пер., 10',
    phone: '+7 (495) 951-13-62',
    hours: 'Вт-Вс: 10:00 - 18:00, Пт: 10:00 - 21:00',
    reviews: 1847,
    features: ['Аудиогид', 'Кафе', 'Гардероб', 'Сувениры', 'Экскурсии'],
  },
  {
    id: 4,
    name: 'Кофемания',
    category: 'Кофейни',
    rating: 4.6,
    price: '₽₽',
    distance: '0.8 км',
    image: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=800',
    tags: ['Завтраки', 'Wi-Fi'],
    description: 'Уютная кофейня с собственной обжаркой кофе. Идеально для завтраков, встреч и работы за ноутбуком.',
    address: 'Тверская ул., 18',
    phone: '+7 (495) 775-14-41',
    hours: 'Пн-Вс: 08:00 - 23:00',
    reviews: 329,
    features: ['Wi-Fi', 'Розетки', 'Завтраки весь день', 'Веганские опции', 'Терраса'],
  },
  {
    id: 5,
    name: 'Стрелка',
    category: 'Коворкинги',
    rating: 4.8,
    price: '₽₽₽',
    distance: '2.3 км',
    image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800',
    tags: ['Коворкинг', 'Терраса'],
    description: 'Институт медиа, архитектуры и дизайна с коворкингом, кафе и открытой террасой на берегу Москвы-реки.',
    address: 'Берсеневская наб., 14, стр. 5А',
    phone: '+7 (495) 771-74-16',
    hours: 'Пн-Пт: 09:00 - 22:00, Сб-Вс: 10:00 - 20:00',
    reviews: 456,
    features: ['Высокоскоростной Wi-Fi', 'Переговорные', 'Кафе', 'Терраса', 'События'],
  },
  {
    id: 6,
    name: 'Дом Культуры',
    category: 'Концерты',
    rating: 4.7,
    price: '₽₽',
    distance: '1.9 км',
    image: 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=800',
    tags: ['Живая музыка', 'Бар'],
    description: 'Концертная площадка с живой музыкой, бар и танцпол. Регулярные выступления российских и зарубежных артистов.',
    address: 'ул. Льва Толстого, 16',
    phone: '+7 (495) 139-89-09',
    hours: 'Пн-Чт: 18:00 - 02:00, Пт-Вс: 18:00 - 06:00',
    reviews: 612,
    features: ['Живая музыка', 'Танцпол', 'Коктейльный бар', 'Гардероб', 'Face-контроль'],
  },
];

export default function PlaceDetail() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const placeId = searchParams.get('id');
  const [place, setPlace] = useState<typeof allPlaces[0] | null>(null);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    const foundPlace = allPlaces.find(p => p.id === Number(placeId));
    if (foundPlace) {
      setPlace(foundPlace);
    }
  }, [placeId]);

  if (!place) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Icon name="MapPinOff" size={64} className="text-muted-foreground mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Место не найдено</h2>
          <Button onClick={() => navigate('/')} className="mt-4">
            Вернуться на главную
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="relative h-[400px] overflow-hidden">
        <img
          src={place.image}
          alt={place.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
        
        <button
          onClick={() => navigate('/')}
          className="absolute top-6 left-6 glass rounded-full p-3 hover:bg-primary/20 transition-colors"
        >
          <Icon name="ArrowLeft" size={24} />
        </button>

        <button
          onClick={() => setIsFavorite(!isFavorite)}
          className="absolute top-6 right-6 glass rounded-full p-3 hover:bg-primary/20 transition-colors"
        >
          <Icon 
            name="Heart" 
            size={24} 
            className={isFavorite ? 'fill-red-500 text-red-500' : ''} 
          />
        </button>

        <div className="absolute bottom-0 left-0 right-0 p-8">
          <div className="container max-w-4xl mx-auto">
            <Badge variant="secondary" className="mb-3">
              {place.category}
            </Badge>
            <h1 className="text-4xl font-bold mb-3">{place.name}</h1>
            <div className="flex flex-wrap items-center gap-4 text-sm">
              <div className="flex items-center gap-2">
                <Icon name="Star" size={20} className="text-yellow-400 fill-yellow-400" />
                <span className="font-bold text-lg">{place.rating}</span>
                <span className="text-muted-foreground">({place.reviews} отзывов)</span>
              </div>
              <div className="flex items-center gap-2">
                <Icon name="MapPin" size={20} className="text-primary" />
                <span>{place.distance}</span>
              </div>
              <span className="text-muted-foreground">{place.price}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="container max-w-4xl mx-auto px-4 py-8 space-y-8">
        
        <div className="flex flex-wrap gap-2">
          {place.tags.map((tag) => (
            <Badge key={tag} variant="outline" className="text-sm px-4 py-1">
              {tag}
            </Badge>
          ))}
        </div>

        <Card className="glass p-6">
          <h3 className="text-xl font-bold mb-3 flex items-center gap-2">
            <Icon name="FileText" size={24} className="text-primary" />
            Описание
          </h3>
          <p className="text-muted-foreground leading-relaxed">{place.description}</p>
        </Card>

        <Card className="glass p-6">
          <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Icon name="Info" size={24} className="text-primary" />
            Информация
          </h3>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <Icon name="MapPin" size={20} className="text-primary mt-1" />
              <div>
                <p className="font-semibold mb-1">Адрес</p>
                <p className="text-muted-foreground">{place.address}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Icon name="Phone" size={20} className="text-primary mt-1" />
              <div>
                <p className="font-semibold mb-1">Телефон</p>
                <a href={`tel:${place.phone}`} className="text-primary hover:underline">
                  {place.phone}
                </a>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Icon name="Clock" size={20} className="text-primary mt-1" />
              <div>
                <p className="font-semibold mb-1">Часы работы</p>
                <p className="text-muted-foreground">{place.hours}</p>
              </div>
            </div>
          </div>
        </Card>

        <Card className="glass p-6">
          <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Icon name="Sparkles" size={24} className="text-primary" />
            Особенности
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {place.features.map((feature) => (
              <div
                key={feature}
                className="glass rounded-xl p-3 flex items-center gap-2 hover:bg-primary/10 transition-colors"
              >
                <Icon name="Check" size={16} className="text-primary" />
                <span className="text-sm">{feature}</span>
              </div>
            ))}
          </div>
        </Card>

        <div className="grid md:grid-cols-2 gap-4">
          <Button
            size="lg"
            className="w-full gradient-primary hover:opacity-90 transition-opacity"
            onClick={() => window.open(`https://yandex.ru/maps/?text=${place.address}`, '_blank')}
          >
            <Icon name="Navigation" size={20} className="mr-2" />
            Построить маршрут
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="w-full glass hover:bg-primary/20"
            onClick={() => window.open(`tel:${place.phone}`, '_self')}
          >
            <Icon name="Phone" size={20} className="mr-2" />
            Позвонить
          </Button>
        </div>

        <Card className="glass p-6 gradient-primary">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center text-3xl">
              🎁
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-bold mb-1">Бонус за визит!</h3>
              <p className="text-sm text-primary-foreground/80">
                Посетите это место и получите +50 XP к вашему уровню
              </p>
            </div>
            <Button variant="secondary" size="lg">
              Отметиться
            </Button>
          </div>
        </Card>

      </div>
    </div>
  );
}
