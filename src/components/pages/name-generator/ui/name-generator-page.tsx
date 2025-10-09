'use client';

import React, { useState } from 'react';
import {
  Sparkles,
  User,
  Calendar,
  Phone,
  Mail,
  MapPin,
  Send,
  CheckCircle
} from 'lucide-react';

import { AppLayout } from 'widgets/app-layout';
import { Button } from 'shared/ui/button';
import { Card } from 'shared/ui/card';
import { Input } from 'shared/ui/input';

type Gender = 'male' | 'female';
type CalendarType = 'solar' | 'lunar';
type SiblingPosition = 'none' | 'middle' | 'end';

interface NameApplicationData {
  // 출생일시
  calendarType: CalendarType;
  birthYear: string;
  birthMonth: string;
  birthDay: string;
  birthHour: string;
  birthMinute: string;

  // 기본 정보
  gender: Gender;
  surnameKorean: string;
  surnameHanja: string;
  surnameOrigin: string;

  // 돌림자
  useSiblingName: boolean;
  siblingPosition: SiblingPosition;
  siblingNameKorean: string;
  siblingNameHanja: string;

  // 가족 정보
  fatherName: string;
  motherName: string;
  birthOrder: string; // 예: 1남 1녀중 첫째
  siblings: string; // 형제자매 이름들

  // 기타 요구사항
  restrictions: string; // 중복되지 말아야 할 이름
  preferences: string; // 희망 이름
  specialRequests: string; // 기타 부탁사항

  // 신청인 정보
  applicantName: string;
  relationship: string;
  phone: string;
  mobile: string;
  email: string;
  postalCode: string;
  address: string;
  detailAddress: string;
  referralSource: string;
}

export const NameGeneratorPage: React.FC = () => {
  const [formData, setFormData] = useState<NameApplicationData>({
    calendarType: 'solar',
    birthYear: '',
    birthMonth: '',
    birthDay: '',
    birthHour: '',
    birthMinute: '',
    gender: 'male',
    surnameKorean: '',
    surnameHanja: '',
    surnameOrigin: '',
    useSiblingName: false,
    siblingPosition: 'none',
    siblingNameKorean: '',
    siblingNameHanja: '',
    fatherName: '',
    motherName: '',
    birthOrder: '',
    siblings: '',
    restrictions: '',
    preferences: '',
    specialRequests: '',
    applicantName: '',
    relationship: '',
    phone: '',
    mobile: '',
    email: '',
    postalCode: '',
    address: '',
    detailAddress: '',
    referralSource: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [errors, setErrors] = useState<Partial<NameApplicationData>>({});

  const updateFormData = (field: keyof NameApplicationData, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // 에러 초기화
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<NameApplicationData> = {};

    // 필수 필드 검증
    if (!formData.birthYear || !formData.birthMonth || !formData.birthDay) {
      newErrors.birthYear = '출생일시는 필수 입력사항입니다.';
    }
    if (!formData.surnameKorean || !formData.surnameHanja) {
      newErrors.surnameKorean = '성씨는 필수 입력사항입니다.';
    }
    if (!formData.applicantName) {
      newErrors.applicantName = '신청인 성명은 필수 입력사항입니다.';
    }
    if (!formData.mobile) {
      newErrors.mobile = '휴대폰번호는 필수 입력사항입니다.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // 백엔드 API 호출 (개발 중이므로 일단 시뮬레이션)
      console.log('작명 신청서 데이터:', formData);

      // 실제 백엔드 연동 시 아래 코드 활성화
      /*
      const response = await fetch('/api/name-application', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log('작명 신청서 제출 성공:', result);
      */

      // 시뮬레이션: 2초 후 성공
      await new Promise(resolve => setTimeout(resolve, 2000));

      setSubmitSuccess(true);

      // 성공 후 폼 초기화 (선택사항)
      // setFormData({...});

    } catch (error) {
      console.error('신청서 제출 실패:', error);
      alert('신청서 제출에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // 성공 화면
  if (submitSuccess) {
    return (
      <AppLayout>
        <div className="max-w-4xl mx-auto p-6">
          <Card className="p-12 text-center">
            <div className="space-y-6">
              <div className="p-4 bg-green-100 dark:bg-green-900/20 rounded-full w-fit mx-auto">
                <CheckCircle className="w-16 h-16 text-green-600" />
              </div>
              <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">
                작명 신청이 완료되었습니다!
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-400">
                신청하신 내용이 성공적으로 접수되었습니다.
                <br />
                2-3일 이내에 전문 작명사가 검토하여 연락드리겠습니다.
              </p>
              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                <p className="text-sm text-blue-800 dark:text-blue-200">
                  📞 문의전화: 02-538-3200
                  <br />
                  📱 문자문의: 010-8077-8158
                </p>
              </div>
              <Button
                onClick={() => setSubmitSuccess(false)}
                className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700"
              >
                새로운 신청서 작성하기
              </Button>
            </div>
          </Card>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto p-6 space-y-8">
        {/* 헤더 */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-3">
            <div className="p-3 bg-gradient-to-br from-pink-500 to-purple-600 rounded-full">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">
              좋은 이름 작명 신청서
            </h1>
          </div>
          <div className="bg-amber-50 dark:bg-amber-900/20 p-4 rounded-lg border border-amber-200 dark:border-amber-800">
            <p className="text-sm text-amber-800 dark:text-amber-200">
              ai가 정성스럽게 이름을 지어드립니다.    
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">


          {/* 출생일시 */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-blue-500" />
              출생일시
            </h3>

            <div className="space-y-4">
              {/* 양력/음력 선택 */}
              <div>
                <div className="flex gap-4 mb-4">
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="calendarType"
                      value="solar"
                      checked={formData.calendarType === 'solar'}
                      onChange={(e) => updateFormData('calendarType', e.target.value)}
                    />
                    양력
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="calendarType"
                      value="lunar"
                      checked={formData.calendarType === 'lunar'}
                      onChange={(e) => updateFormData('calendarType', e.target.value)}
                    />
                    음력
                  </label>
                </div>
              </div>

              {/* 날짜/시간 선택 */}
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">년</label>
                  <select
                    value={formData.birthYear}
                    onChange={(e) => updateFormData('birthYear', e.target.value)}
                    className="w-full p-2 border rounded-lg dark:bg-gray-800 dark:border-gray-600"
                    required
                  >
                    <option value="">선택</option>
                    {Array.from({length: 50}, (_, i) => new Date().getFullYear() - i).map(year => (
                      <option key={year} value={year}>{year}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">월</label>
                  <select
                    value={formData.birthMonth}
                    onChange={(e) => updateFormData('birthMonth', e.target.value)}
                    className="w-full p-2 border rounded-lg dark:bg-gray-800 dark:border-gray-600"
                    required
                  >
                    <option value="">선택</option>
                    {Array.from({length: 12}, (_, i) => i + 1).map(month => (
                      <option key={month} value={month}>{month}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">일</label>
                  <select
                    value={formData.birthDay}
                    onChange={(e) => updateFormData('birthDay', e.target.value)}
                    className="w-full p-2 border rounded-lg dark:bg-gray-800 dark:border-gray-600"
                    required
                  >
                    <option value="">선택</option>
                    {Array.from({length: 31}, (_, i) => i + 1).map(day => (
                      <option key={day} value={day}>{day}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">시</label>
                  <select
                    value={formData.birthHour}
                    onChange={(e) => updateFormData('birthHour', e.target.value)}
                    className="w-full p-2 border rounded-lg dark:bg-gray-800 dark:border-gray-600"
                  >
                    <option value="">선택</option>
                    {Array.from({length: 24}, (_, i) => i).map(hour => (
                      <option key={hour} value={hour}>{hour.toString().padStart(2, '0')}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">분</label>
                  <select
                    value={formData.birthMinute}
                    onChange={(e) => updateFormData('birthMinute', e.target.value)}
                    className="w-full p-2 border rounded-lg dark:bg-gray-800 dark:border-gray-600"
                  >
                    <option value="">선택</option>
                    {Array.from({length: 60}, (_, i) => i).map(minute => (
                      <option key={minute} value={minute}>{minute.toString().padStart(2, '0')}</option>
                    ))}
                  </select>
                </div>
              </div>

              {errors.birthYear && (
                <p className="text-red-500 text-sm">{errors.birthYear}</p>
              )}
            </div>
          </Card>

          {/* 성별 및 성씨 */}
          <Card className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* 성별 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">성별</label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="gender"
                      value="male"
                      checked={formData.gender === 'male'}
                      onChange={(e) => updateFormData('gender', e.target.value)}
                    />
                    남
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="gender"
                      value="female"
                      checked={formData.gender === 'female'}
                      onChange={(e) => updateFormData('gender', e.target.value)}
                    />
                    여
                  </label>
                </div>
              </div>

              {/* 성씨 */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    성씨(한글) <span className="text-red-500">*</span>
                  </label>
                  <Input
                    type="text"
                    placeholder="예) 김"
                    value={formData.surnameKorean}
                    onChange={(e) => updateFormData('surnameKorean', e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    성씨(한자) <span className="text-red-500">*</span>
                  </label>
                  <Input
                    type="text"
                    placeholder="예) 金"
                    value={formData.surnameHanja}
                    onChange={(e) => updateFormData('surnameHanja', e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    본관
                  </label>
                  <Input
                    type="text"
                    placeholder="예) 경주 김씨"
                    value={formData.surnameOrigin}
                    onChange={(e) => updateFormData('surnameOrigin', e.target.value)}
                  />
                </div>
                {errors.surnameKorean && (
                  <p className="text-red-500 text-sm">{errors.surnameKorean}</p>
                )}
              </div>
            </div>
          </Card>

          {/* 돌림자 */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">돌림자</h3>

            <div className="space-y-4">
              <div>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.useSiblingName}
                    onChange={(e) => updateFormData('useSiblingName', e.target.checked)}
                  />
                  돌림자를 사용하시는 분만 입력해주세요.
                </label>
              </div>

              {formData.useSiblingName && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">돌림자 위치</label>
                    <select
                      value={formData.siblingPosition}
                      onChange={(e) => updateFormData('siblingPosition', e.target.value)}
                      className="w-full p-2 border rounded-lg dark:bg-gray-800 dark:border-gray-600"
                    >
                      <option value="none">사용안함</option>
                      <option value="middle">가운데</option>
                      <option value="end">끝자</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">돌림자(한글)</label>
                    <Input
                      type="text"
                      placeholder="돌림자 한글"
                      value={formData.siblingNameKorean}
                      onChange={(e) => updateFormData('siblingNameKorean', e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">돌림자(한자)</label>
                    <Input
                      type="text"
                      placeholder="돌림자 한자"
                      value={formData.siblingNameHanja}
                      onChange={(e) => updateFormData('siblingNameHanja', e.target.value)}
                    />
                  </div>
                </div>
              )}
            </div>
          </Card>

          {/* 가족 정보 */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4 flex items-center gap-2">
              <User className="w-5 h-5 text-green-500" />
              가족 정보
            </h3>

            <div className="space-y-4">
              {/* 부모 성명 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">아빠(한글)</label>
                  <Input
                    type="text"
                    placeholder="아버지 성함"
                    value={formData.fatherName}
                    onChange={(e) => updateFormData('fatherName', e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">엄마(한글)</label>
                  <Input
                    type="text"
                    placeholder="어머니 성함"
                    value={formData.motherName}
                    onChange={(e) => updateFormData('motherName', e.target.value)}
                  />
                </div>
              </div>

              <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
                <p className="text-sm text-blue-800 dark:text-blue-200">
                  💡 본인사주로 父母, 兄弟, 妻(夫), 子를 알 수 있으므로 부모님의 출생일시는 불필요 합니다.
                </p>
              </div>

              {/* 신생아 서열 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  신생아 서열
                </label>
                <Input
                  type="text"
                  placeholder="예: 1남 1녀중 첫째"
                  value={formData.birthOrder}
                  onChange={(e) => updateFormData('birthOrder', e.target.value)}
                />
              </div>

              {/* 형제자매 성명 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  신생아 형제자매 성명
                </label>
                <textarea
                  placeholder="한글로 입력해주세요."
                  value={formData.siblings}
                  onChange={(e) => updateFormData('siblings', e.target.value)}
                  className="w-full p-2 border rounded-lg dark:bg-gray-800 dark:border-gray-600 min-h-[80px]"
                />
              </div>
            </div>
          </Card>

          {/* 기타 요구사항 */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">기타</h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  중복되면 안되는 친척이름과 희망이름, 기타 작명시 부탁하실 내용
                </label>
                <textarea
                  placeholder="중복되지 말아야 할 친척 이름, 희망하는 이름 스타일, 특이사항 등을 적어주세요."
                  value={formData.restrictions}
                  onChange={(e) => updateFormData('restrictions', e.target.value)}
                  className="w-full p-2 border rounded-lg dark:bg-gray-800 dark:border-gray-600 min-h-[100px]"
                />
              </div>

              <div className="bg-amber-50 dark:bg-amber-900/20 p-4 rounded-lg border border-amber-200 dark:border-amber-800">
                <p className="text-sm text-amber-800 dark:text-amber-200">
                  ⭐ 작명 신청시, 직계가족에 한해 이름감명을 해드리고 있습니다. 원하시면 감명하실분의 한자이름, 생년월일, 태어난 시를 함께 적어주세요. 전화드려 설명해드립니다. 감사합니다.
                </p>
              </div>
            </div>
          </Card>

          {/* 신청인 정보 */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4 flex items-center gap-2">
              <User className="w-5 h-5 text-purple-500" />
              신청인 정보
            </h3>

            <div className="space-y-6">
              {/* 신청인 기본 정보 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    신청인 성명(한글) <span className="text-red-500">*</span>
                  </label>
                  <Input
                    type="text"
                    placeholder="신청인 성명"
                    value={formData.applicantName}
                    onChange={(e) => updateFormData('applicantName', e.target.value)}
                    required
                  />
                  {errors.applicantName && (
                    <p className="text-red-500 text-sm mt-1">{errors.applicantName}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    신생아와의 관계
                  </label>
                  <Input
                    type="text"
                    placeholder="예: 아버지, 어머니"
                    value={formData.relationship}
                    onChange={(e) => updateFormData('relationship', e.target.value)}
                  />
                </div>
              </div>

              {/* 연락처 정보 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 flex items-center gap-2">
                    <Phone className="w-4 h-4" />
                    전화번호
                  </label>
                  <Input
                    type="tel"
                    placeholder="02-1234-5678"
                    value={formData.phone}
                    onChange={(e) => updateFormData('phone', e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 flex items-center gap-2">
                    <Phone className="w-4 h-4" />
                    휴대폰번호 <span className="text-red-500">*</span>
                  </label>
                  <Input
                    type="tel"
                    placeholder="010-1234-5678"
                    value={formData.mobile}
                    onChange={(e) => updateFormData('mobile', e.target.value)}
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">문자 MMS로 이름을 보내드리니 정확히 기재해 주세요.</p>
                  {errors.mobile && (
                    <p className="text-red-500 text-sm mt-1">{errors.mobile}</p>
                  )}
                </div>
              </div>

              {/* 이메일 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  E-MAIL 주소
                </label>
                <Input
                  type="email"
                  placeholder="example@email.com"
                  value={formData.email}
                  onChange={(e) => updateFormData('email', e.target.value)}
                />
              </div>

              {/* 주소 */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    우편주소
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-6 gap-2 mb-2">
                    <div className="md:col-span-2">
                      <Input
                        type="text"
                        placeholder="우편번호"
                        value={formData.postalCode}
                        onChange={(e) => updateFormData('postalCode', e.target.value)}
                      />
                    </div>
                    <div className="md:col-span-4">
                      <Input
                        type="text"
                        placeholder="주소 검색 또는 입력"
                        value={formData.address}
                        onChange={(e) => updateFormData('address', e.target.value)}
                      />
                    </div>
                  </div>
                  <Input
                    type="text"
                    placeholder="세부주소 (아파트 동호수 등)"
                    value={formData.detailAddress}
                    onChange={(e) => updateFormData('detailAddress', e.target.value)}
                  />
                </div>
              </div>

              {/* 방문 경로 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  백운산작명원 방문경로
                </label>
                <select
                  value={formData.referralSource}
                  onChange={(e) => updateFormData('referralSource', e.target.value)}
                  className="w-full p-2 border rounded-lg dark:bg-gray-800 dark:border-gray-600"
                >
                  <option value="">선택해주세요</option>
                  <option value="naver">네이버</option>
                  <option value="daum">다음</option>
                  <option value="google">구글</option>
                  <option value="referral">지인소개</option>
                  <option value="other">기타광고</option>
                </select>
              </div>
            </div>
          </Card>

          {/* 제출 버튼 */}
          <div className="text-center">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="px-8 py-3 text-lg bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  신청서 제출 중...
                </>
              ) : (
                <>
                  <Send className="w-5 h-5 mr-2" />
                  작명 신청하기
                </>
              )}
            </Button>

            <p className="text-sm text-gray-500 mt-4">
              신청서 제출 후 2-3일 이내에 전문 작명사가 검토하여 연락드리겠습니다.
            </p>
          </div>
        </form>
      </div>
    </AppLayout>
  );
};
