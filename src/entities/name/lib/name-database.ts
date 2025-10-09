import { NameData, Gender, Country } from '../model/types';

// 한국어 이름 데이터
const koreanNames: NameData[] = [
  { id: 'kr_1', name: '민준', gender: 'male', country: 'korea', meaning: '민중을 준수하다', popularity: 9, syllables: 2, origin: '한국' },
  { id: 'kr_2', name: '서연', gender: 'female', country: 'korea', meaning: '서쪽의 연꽃', popularity: 9, syllables: 2, origin: '한국' },
  { id: 'kr_3', name: '지우', gender: 'unisex', country: 'korea', meaning: '지혜롭고 우아하다', popularity: 8, syllables: 2, origin: '한국' },
  { id: 'kr_4', name: '서준', gender: 'male', country: 'korea', meaning: '서쪽의 준수함', popularity: 8, syllables: 2, origin: '한국' },
  { id: 'kr_5', name: '하윤', gender: 'female', country: 'korea', meaning: '하늘의 윤택함', popularity: 8, syllables: 2, origin: '한국' },
  { id: 'kr_6', name: '도윤', gender: 'male', country: 'korea', meaning: '도를 따르는 윤택함', popularity: 7, syllables: 2, origin: '한국' },
  { id: 'kr_7', name: '시아', gender: 'female', country: 'korea', meaning: '아름다운 시야', popularity: 7, syllables: 2, origin: '한국' },
  { id: 'kr_8', name: '주원', gender: 'male', country: 'korea', meaning: '주인의 근원', popularity: 7, syllables: 2, origin: '한국' },
  { id: 'kr_9', name: '하린', gender: 'female', country: 'korea', meaning: '하늘의 아름다움', popularity: 7, syllables: 2, origin: '한국' },
  { id: 'kr_10', name: '준혁', gender: 'male', country: 'korea', meaning: '준수한 혁신', popularity: 6, syllables: 2, origin: '한국' },
  { id: 'kr_11', name: '예린', gender: 'female', country: 'korea', meaning: '예쁜 아름다움', popularity: 6, syllables: 2, origin: '한국' },
  { id: 'kr_12', name: '민서', gender: 'unisex', country: 'korea', meaning: '민중을 서술하다', popularity: 6, syllables: 2, origin: '한국' },
  { id: 'kr_13', name: '준서', gender: 'male', country: 'korea', meaning: '준수한 서술', popularity: 6, syllables: 2, origin: '한국' },
  { id: 'kr_14', name: '수아', gender: 'female', country: 'korea', meaning: '맑은 아침', popularity: 6, syllables: 2, origin: '한국' },
  { id: 'kr_15', name: '현우', gender: 'male', country: 'korea', meaning: '현명한 우주', popularity: 5, syllables: 2, origin: '한국' },
];

// 영어 이름 데이터
const englishNames: NameData[] = [
  { id: 'en_1', name: 'James', gender: 'male', country: 'usa', meaning: 'supplanter', popularity: 9, syllables: 1, origin: 'English' },
  { id: 'en_2', name: 'Emma', gender: 'female', country: 'usa', meaning: 'universal', popularity: 9, syllables: 2, origin: 'Germanic' },
  { id: 'en_3', name: 'Oliver', gender: 'male', country: 'usa', meaning: 'olive tree', popularity: 8, syllables: 3, origin: 'Latin' },
  { id: 'en_4', name: 'Sophia', gender: 'female', country: 'usa', meaning: 'wisdom', popularity: 8, syllables: 3, origin: 'Greek' },
  { id: 'en_5', name: 'Noah', gender: 'male', country: 'usa', meaning: 'rest, comfort', popularity: 8, syllables: 2, origin: 'Hebrew' },
  { id: 'en_6', name: 'Ava', gender: 'female', country: 'usa', meaning: 'life, living one', popularity: 8, syllables: 2, origin: 'Latin' },
  { id: 'en_7', name: 'William', gender: 'male', country: 'usa', meaning: 'resolute protector', popularity: 7, syllables: 2, origin: 'Germanic' },
  { id: 'en_8', name: 'Isabella', gender: 'female', country: 'usa', meaning: 'pledged to God', popularity: 7, syllables: 4, origin: 'Hebrew' },
  { id: 'en_9', name: 'Benjamin', gender: 'male', country: 'usa', meaning: 'son of the right hand', popularity: 7, syllables: 3, origin: 'Hebrew' },
  { id: 'en_10', name: 'Mia', gender: 'female', country: 'usa', meaning: 'mine', popularity: 7, syllables: 2, origin: 'Hebrew' },
  { id: 'en_11', name: 'Lucas', gender: 'male', country: 'usa', meaning: 'from Lucania', popularity: 6, syllables: 2, origin: 'Latin' },
  { id: 'en_12', name: 'Charlotte', gender: 'female', country: 'usa', meaning: 'free man', popularity: 6, syllables: 3, origin: 'French' },
  { id: 'en_13', name: 'Henry', gender: 'male', country: 'usa', meaning: 'estate ruler', popularity: 6, syllables: 2, origin: 'Germanic' },
  { id: 'en_14', name: 'Amelia', gender: 'female', country: 'usa', meaning: 'work', popularity: 6, syllables: 3, origin: 'Germanic' },
  { id: 'en_15', name: 'Alexander', gender: 'male', country: 'usa', meaning: 'defender of men', popularity: 5, syllables: 4, origin: 'Greek' },
];

// 중국어 이름 데이터
const chineseNames: NameData[] = [
  { id: 'cn_1', name: 'Wei', gender: 'unisex', country: 'china', meaning: 'great, powerful', popularity: 8, syllables: 1, origin: 'Chinese' },
  { id: 'cn_2', name: 'Li', gender: 'unisex', country: 'china', meaning: 'beautiful, elegant', popularity: 8, syllables: 1, origin: 'Chinese' },
  { id: 'cn_3', name: 'Ming', gender: 'unisex', country: 'china', meaning: 'bright, clear', popularity: 7, syllables: 1, origin: 'Chinese' },
  { id: 'cn_4', name: 'Hua', gender: 'unisex', country: 'china', meaning: 'splendid, magnificent', popularity: 7, syllables: 1, origin: 'Chinese' },
  { id: 'cn_5', name: 'Jing', gender: 'unisex', country: 'china', meaning: 'quiet, still', popularity: 6, syllables: 1, origin: 'Chinese' },
  { id: 'cn_6', name: 'Feng', gender: 'unisex', country: 'china', meaning: 'wind, style', popularity: 6, syllables: 1, origin: 'Chinese' },
  { id: 'cn_7', name: 'Yu', gender: 'unisex', country: 'china', meaning: 'jade, rain', popularity: 6, syllables: 1, origin: 'Chinese' },
  { id: 'cn_8', name: 'Xin', gender: 'unisex', country: 'china', meaning: 'new, fresh', popularity: 5, syllables: 1, origin: 'Chinese' },
  { id: 'cn_9', name: 'Lin', gender: 'unisex', country: 'china', meaning: 'beautiful jade', popularity: 5, syllables: 1, origin: 'Chinese' },
  { id: 'cn_10', name: 'Qiang', gender: 'unisex', country: 'china', meaning: 'strong, powerful', popularity: 5, syllables: 1, origin: 'Chinese' },
];

export const nameDatabase: NameData[] = [
  ...koreanNames,
  ...englishNames,
  ...chineseNames,
];

export const getNamesByGender = (gender: Gender, country?: Country): NameData[] => {
  return nameDatabase.filter(name =>
    name.gender === gender || name.gender === 'unisex'
  ).filter(name =>
    !country || name.country === country
  );
};

export const getNamesByCountry = (country: Country): NameData[] => {
  return nameDatabase.filter(name => name.country === country);
};

export const getRandomNames = (count: number = 5): NameData[] => {
  const shuffled = [...nameDatabase].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};
