"use client";

import React, { useState } from "react";
import {
  User,
  Calendar,
  Phone,
  Mail,
  MapPin,
  Send,
  CheckCircle,
} from "lucide-react";

import { AppLayout } from "widgets/app-layout";
import { ToolHeader } from "widgets/tool-header";
import { Button } from "shared/ui/button";
import { Card } from "shared/ui/card";
import { Input } from "shared/ui/input";
import {
  generateNameCombinations,
  type NameGenerationOptions,
} from "entities/name";

type Gender = "male" | "female";
type CalendarType = "solar" | "lunar";
type SiblingPosition = "none" | "middle" | "end";

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
  birthOrder: string;
  siblings: string;

  // 기타 요구사항
  restrictions: string;
  preferences: string;
  specialRequests: string;

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

interface GeneratedNameResult {
  id: string;
  fullName: string;
  givenName: string;
  surname: string;
  meaning?: string;
  score: number;
  reason: string;
}

const chipBase =
  "px-4 py-2 rounded-lg border text-sm transition-colors cursor-pointer";
const chipInactive = "border-[#2A2A2A] text-[#A3A3A3] hover:border-white";
const chipActive = "border-white text-white";

const fieldLabel = "block text-sm font-medium text-[#A3A3A3] mb-1";
const selectBase =
  "w-full p-2 border rounded-lg bg-[#0A0A0A] border-[#2A2A2A] text-white focus:outline-none focus:border-white";
const textareaBase =
  "w-full p-3 border rounded-lg bg-[#0A0A0A] border-[#2A2A2A] text-white placeholder:text-[#525252] focus:outline-none focus:border-white";

export const NameGeneratorPage: React.FC = () => {
  const [formData, setFormData] = useState<NameApplicationData>({
    calendarType: "solar",
    birthYear: "",
    birthMonth: "",
    birthDay: "",
    birthHour: "",
    birthMinute: "",
    gender: "male",
    surnameKorean: "",
    surnameHanja: "",
    surnameOrigin: "",
    useSiblingName: false,
    siblingPosition: "none",
    siblingNameKorean: "",
    siblingNameHanja: "",
    fatherName: "",
    motherName: "",
    birthOrder: "",
    siblings: "",
    restrictions: "",
    preferences: "",
    specialRequests: "",
    applicantName: "",
    relationship: "",
    phone: "",
    mobile: "",
    email: "",
    postalCode: "",
    address: "",
    detailAddress: "",
    referralSource: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [generatedNames, setGeneratedNames] = useState<GeneratedNameResult[]>(
    [],
  );
  const [showResults, setShowResults] = useState(false);
  const [errors, setErrors] = useState<Partial<NameApplicationData>>({});

  const updateFormData = (
    field: keyof NameApplicationData,
    value: string | boolean,
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<NameApplicationData> = {};

    if (!formData.birthYear || !formData.birthMonth || !formData.birthDay) {
      newErrors.birthYear = "출생일시는 필수 입력사항입니다.";
    }
    if (!formData.surnameKorean || !formData.surnameHanja) {
      newErrors.surnameKorean = "성씨는 필수 입력사항입니다.";
    }
    if (!formData.applicantName) {
      newErrors.applicantName = "신청인 성명은 필수 입력사항입니다.";
    }
    if (!formData.mobile) {
      newErrors.mobile = "휴대폰번호는 필수 입력사항입니다.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const generateNamesForUser = (
    data: NameApplicationData,
  ): GeneratedNameResult[] => {
    const options: NameGenerationOptions = {
      gender: data.gender === "male" ? "male" : "female",
      country: "korea",
      includeMeaning: true,
      popularityRange: { min: 3, max: 10 },
    };

    const nameCandidates = generateNameCombinations(options, 20);

    const restrictedNames = data.restrictions
      ? data.restrictions
          .split(/[,\s]+/)
          .map((name) => name.trim())
          .filter((name) => name.length > 0)
      : [];

    const siblingNames = data.siblings
      ? data.siblings
          .split(/[,\s]+/)
          .map((name) => name.trim())
          .filter((name) => name.length > 0)
      : [];

    const filteredNames = nameCandidates.filter((name) => {
      const fullName = `${data.surnameKorean}${name.name}`;
      const isRestricted = restrictedNames.some(
        (restricted) =>
          fullName.includes(restricted) || restricted.includes(name.name),
      );
      const isSiblingName = siblingNames.some(
        (sibling) => fullName.includes(sibling) || sibling.includes(name.name),
      );

      return !isRestricted && !isSiblingName;
    });

    const selectedNames = filteredNames.slice(0, 5);

    return selectedNames.map((name, index) => {
      let baseScore = name.popularity;
      const birthMonth = parseInt(data.birthMonth) || 1;
      const birthDay = parseInt(data.birthDay) || 1;

      if (birthMonth >= 1 && birthMonth <= 12) {
        baseScore += (birthMonth % 3) * 0.5;
      }
      if (birthDay >= 1 && birthDay <= 31) {
        baseScore += (birthDay % 5) * 0.3;
      }

      if (data.useSiblingName && data.siblingNameKorean) {
        if (name.name.includes(data.siblingNameKorean)) {
          baseScore += 1;
        }
      }

      const score = Math.min(10, Math.max(1, baseScore));

      let reason = "";
      if (name.meaning) {
        reason = `"${name.meaning}"의 좋은 의미를 담고 있습니다.`;
      } else {
        const reasons = [
          "전통적이고 고풍스러운 느낌의 이름입니다.",
          "현대적이면서도 세련된 인상을 줍니다.",
          "부드럽고 친근한 느낌이 드는 이름입니다.",
          "강인하고 믿음직한 인상을 줍니다.",
          "우아하고 고급스러운 느낌의 이름입니다.",
          "상큼하고 밝은 이미지를 전달합니다.",
          "차분하고 신뢰감을 주는 이름입니다.",
          "독특하면서도 매력적인 이름입니다.",
        ];
        reason = reasons[index % reasons.length];
      }

      if (data.preferences) {
        if (
          data.preferences.includes("강한") ||
          data.preferences.includes("힘든")
        ) {
          reason += " 강인한 인상을 주는 이름으로 선택했습니다.";
        } else if (
          data.preferences.includes("부드러운") ||
          data.preferences.includes("친근한")
        ) {
          reason += " 부드럽고 친근한 느낌의 이름입니다.";
        }
      }

      return {
        id: `name-${index + 1}`,
        fullName: `${data.surnameKorean}${name.name}`,
        givenName: name.name,
        surname: data.surnameKorean,
        meaning: name.meaning,
        score: Math.round(score * 10) / 10,
        reason,
      };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));

      const generatedResults = generateNamesForUser(formData);
      setGeneratedNames(generatedResults);
      setShowResults(true);
    } catch (error) {
      console.error("이름 생성 실패:", error);
      alert("이름 생성에 실패했습니다. 다시 시도해주세요.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (showResults) {
    return (
      <AppLayout>
        <ToolHeader
          eyebrow="NAME"
          title="아이 이름 작명기"
          description="아름다운 이름 추천"
        />

        <div className="space-y-8">
          {/* 결과 헤더 */}
          <div className="bg-[#0A0A0A] border border-[#1A1A1A] rounded-xl p-6">
            <div className="flex items-center gap-3 mb-3">
              <CheckCircle className="w-6 h-6 text-white" strokeWidth={1.5} />
              <h2 className="text-xl font-semibold text-white">AI 작명 결과</h2>
            </div>
            <p className="text-[#A3A3A3]">
              {formData.applicantName}님의 아이를 위한 맞춤 이름 추천입니다.
              AI가 출생일시, 성별, 가족사항 등을 고려하여 최적의 이름을
              추천했습니다.
            </p>
          </div>

          {/* 생성된 이름들 */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {generatedNames.map((name, index) => (
              <div
                key={name.id}
                className="bg-[#0A0A0A] border border-[#1A1A1A] rounded-xl p-6"
              >
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="inline-flex items-center gap-2 px-3 py-1 border border-[#2A2A2A] rounded-full text-xs font-medium text-[#A3A3A3]">
                      <span>추천순위 #{index + 1}</span>
                    </div>
                    <h3 className="text-2xl font-semibold text-white mt-3">
                      {name.fullName}
                    </h3>
                    <div className="flex items-center justify-center gap-1 mt-2">
                      <span className="text-[#A3A3A3] text-sm">
                        {name.score}점
                      </span>
                    </div>
                  </div>

                  {name.meaning && (
                    <div className="bg-black border border-[#1A1A1A] p-3 rounded-lg">
                      <p className="text-sm text-[#A3A3A3] italic">
                        &quot;{name.meaning}&quot;
                      </p>
                    </div>
                  )}

                  <div className="bg-black border border-[#1A1A1A] p-3 rounded-lg">
                    <p className="text-sm text-[#A3A3A3]">{name.reason}</p>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => {
                        navigator.clipboard?.writeText(name.fullName);
                        alert(
                          `${name.fullName}이(가) 클립보드에 복사되었습니다.`,
                        );
                      }}
                      className="flex-1 px-4 py-2 rounded-lg border border-[#2A2A2A] text-sm text-[#A3A3A3] hover:border-white hover:text-white transition-colors"
                    >
                      복사하기
                    </button>
                    <button
                      type="button"
                      className="flex-1 px-4 py-2 rounded-lg bg-white text-black text-sm font-medium hover:bg-neutral-200 transition-colors"
                    >
                      선택하기
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* 작명 TIP */}
          <div className="bg-[#0A0A0A] border border-[#1A1A1A] rounded-xl p-6">
            <h3 className="text-lg font-semibold text-white mb-4">작명 TIP</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-[#A3A3A3]">
              <p>
                <span className="text-white">이름의 의미:</span> 아이의 성격과
                운명에 영향을 줄 수 있습니다.
              </p>
              <p>
                <span className="text-white">발음의 중요성:</span> 부르기 쉽고
                기억하기 좋은 이름이 좋습니다.
              </p>
              <p>
                <span className="text-white">가족 조화:</span> 가족 이름들과의
                조화를 고려하세요.
              </p>
              <p>
                <span className="text-white">미래 지향:</span> 아이의 성장
                과정에서 어울릴 이름을 선택하세요.
              </p>
            </div>
          </div>

          {/* 액션 버튼들 */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={() => setShowResults(false)}
              variant="secondary"
              size="lg"
            >
              다른 이름 더 보기
            </Button>
            <Button
              variant="primary"
              size="lg"
              onClick={() => {
                setShowResults(false);
                setGeneratedNames([]);
                setFormData({
                  calendarType: "solar",
                  birthYear: "",
                  birthMonth: "",
                  birthDay: "",
                  birthHour: "",
                  birthMinute: "",
                  gender: "male",
                  surnameKorean: "",
                  surnameHanja: "",
                  surnameOrigin: "",
                  useSiblingName: false,
                  siblingPosition: "none",
                  siblingNameKorean: "",
                  siblingNameHanja: "",
                  fatherName: "",
                  motherName: "",
                  birthOrder: "",
                  siblings: "",
                  restrictions: "",
                  preferences: "",
                  specialRequests: "",
                  applicantName: "",
                  relationship: "",
                  phone: "",
                  mobile: "",
                  email: "",
                  postalCode: "",
                  address: "",
                  detailAddress: "",
                  referralSource: "",
                });
              }}
            >
              새로운 신청서 작성하기
            </Button>
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <ToolHeader
        eyebrow="NAME"
        title="아이 이름 작명기"
        description="아름다운 이름 추천"
      />

      <div className="bg-[#0A0A0A] border border-[#1A1A1A] rounded-xl p-4 mb-8">
        <p className="text-sm text-[#A3A3A3]">
          AI가 정성스럽게 이름을 지어드립니다.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* 출생일시 */}
        <Card padding="md">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-white" strokeWidth={1.5} />
            출생일시
          </h3>

          <div className="space-y-4">
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => updateFormData("calendarType", "solar")}
                className={`${chipBase} ${formData.calendarType === "solar" ? chipActive : chipInactive}`}
              >
                양력
              </button>
              <button
                type="button"
                onClick={() => updateFormData("calendarType", "lunar")}
                className={`${chipBase} ${formData.calendarType === "lunar" ? chipActive : chipInactive}`}
              >
                음력
              </button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <div>
                <label className={fieldLabel}>년</label>
                <select
                  value={formData.birthYear}
                  onChange={(e) => updateFormData("birthYear", e.target.value)}
                  className={selectBase}
                  required
                >
                  <option value="">선택</option>
                  {Array.from(
                    { length: 50 },
                    (_, i) => new Date().getFullYear() - i,
                  ).map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className={fieldLabel}>월</label>
                <select
                  value={formData.birthMonth}
                  onChange={(e) => updateFormData("birthMonth", e.target.value)}
                  className={selectBase}
                  required
                >
                  <option value="">선택</option>
                  {Array.from({ length: 12 }, (_, i) => i + 1).map((month) => (
                    <option key={month} value={month}>
                      {month}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className={fieldLabel}>일</label>
                <select
                  value={formData.birthDay}
                  onChange={(e) => updateFormData("birthDay", e.target.value)}
                  className={selectBase}
                  required
                >
                  <option value="">선택</option>
                  {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => (
                    <option key={day} value={day}>
                      {day}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className={fieldLabel}>시</label>
                <select
                  value={formData.birthHour}
                  onChange={(e) => updateFormData("birthHour", e.target.value)}
                  className={selectBase}
                >
                  <option value="">선택</option>
                  {Array.from({ length: 24 }, (_, i) => i).map((hour) => (
                    <option key={hour} value={hour}>
                      {hour.toString().padStart(2, "0")}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className={fieldLabel}>분</label>
                <select
                  value={formData.birthMinute}
                  onChange={(e) =>
                    updateFormData("birthMinute", e.target.value)
                  }
                  className={selectBase}
                >
                  <option value="">선택</option>
                  {Array.from({ length: 60 }, (_, i) => i).map((minute) => (
                    <option key={minute} value={minute}>
                      {minute.toString().padStart(2, "0")}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {errors.birthYear && (
              <p className="text-red-400 text-sm">{errors.birthYear}</p>
            )}
          </div>
        </Card>

        {/* 성별 및 성씨 */}
        <Card padding="md">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className={fieldLabel}>성별</label>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => updateFormData("gender", "male")}
                  className={`${chipBase} ${formData.gender === "male" ? chipActive : chipInactive}`}
                >
                  남
                </button>
                <button
                  type="button"
                  onClick={() => updateFormData("gender", "female")}
                  className={`${chipBase} ${formData.gender === "female" ? chipActive : chipInactive}`}
                >
                  여
                </button>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className={fieldLabel}>
                  성씨(한글) <span className="text-red-400">*</span>
                </label>
                <Input
                  type="text"
                  placeholder="예) 김"
                  value={formData.surnameKorean}
                  onChange={(e) =>
                    updateFormData("surnameKorean", e.target.value)
                  }
                  required
                />
              </div>
              <div>
                <label className={fieldLabel}>
                  성씨(한자) <span className="text-red-400">*</span>
                </label>
                <Input
                  type="text"
                  placeholder="예) 金"
                  value={formData.surnameHanja}
                  onChange={(e) =>
                    updateFormData("surnameHanja", e.target.value)
                  }
                  required
                />
              </div>
              <div>
                <label className={fieldLabel}>본관</label>
                <Input
                  type="text"
                  placeholder="예) 경주 김씨"
                  value={formData.surnameOrigin}
                  onChange={(e) =>
                    updateFormData("surnameOrigin", e.target.value)
                  }
                />
              </div>
              {errors.surnameKorean && (
                <p className="text-red-400 text-sm">{errors.surnameKorean}</p>
              )}
            </div>
          </div>
        </Card>

        {/* 돌림자 */}
        <Card padding="md">
          <h3 className="text-lg font-semibold text-white mb-4">돌림자</h3>

          <div className="space-y-4">
            <label className="flex items-center gap-2 text-[#A3A3A3] cursor-pointer">
              <input
                type="checkbox"
                checked={formData.useSiblingName}
                onChange={(e) =>
                  updateFormData("useSiblingName", e.target.checked)
                }
                className="accent-white"
              />
              돌림자를 사용하시는 분만 입력해주세요.
            </label>

            {formData.useSiblingName && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className={fieldLabel}>돌림자 위치</label>
                  <select
                    value={formData.siblingPosition}
                    onChange={(e) =>
                      updateFormData("siblingPosition", e.target.value)
                    }
                    className={selectBase}
                  >
                    <option value="none">사용안함</option>
                    <option value="middle">가운데</option>
                    <option value="end">끝자</option>
                  </select>
                </div>
                <div>
                  <label className={fieldLabel}>돌림자(한글)</label>
                  <Input
                    type="text"
                    placeholder="돌림자 한글"
                    value={formData.siblingNameKorean}
                    onChange={(e) =>
                      updateFormData("siblingNameKorean", e.target.value)
                    }
                  />
                </div>
                <div>
                  <label className={fieldLabel}>돌림자(한자)</label>
                  <Input
                    type="text"
                    placeholder="돌림자 한자"
                    value={formData.siblingNameHanja}
                    onChange={(e) =>
                      updateFormData("siblingNameHanja", e.target.value)
                    }
                  />
                </div>
              </div>
            )}
          </div>
        </Card>

        {/* 가족 정보 */}
        <Card padding="md">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <User className="w-5 h-5 text-white" strokeWidth={1.5} />
            가족 정보
          </h3>

          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={fieldLabel}>아빠(한글)</label>
                <Input
                  type="text"
                  placeholder="아버지 성함"
                  value={formData.fatherName}
                  onChange={(e) => updateFormData("fatherName", e.target.value)}
                />
              </div>
              <div>
                <label className={fieldLabel}>엄마(한글)</label>
                <Input
                  type="text"
                  placeholder="어머니 성함"
                  value={formData.motherName}
                  onChange={(e) => updateFormData("motherName", e.target.value)}
                />
              </div>
            </div>

            <div className="bg-black border border-[#1A1A1A] p-3 rounded-lg">
              <p className="text-sm text-[#A3A3A3]">
                본인사주로 父母, 兄弟, 妻(夫), 子를 알 수 있으므로 부모님의
                출생일시는 불필요 합니다.
              </p>
            </div>

            <div>
              <label className={fieldLabel}>신생아 서열</label>
              <Input
                type="text"
                placeholder="예: 1남 1녀중 첫째"
                value={formData.birthOrder}
                onChange={(e) => updateFormData("birthOrder", e.target.value)}
              />
            </div>

            <div>
              <label className={fieldLabel}>신생아 형제자매 성명</label>
              <textarea
                placeholder="한글로 입력해주세요."
                value={formData.siblings}
                onChange={(e) => updateFormData("siblings", e.target.value)}
                className={`${textareaBase} min-h-[80px]`}
              />
            </div>
          </div>
        </Card>

        {/* 기타 요구사항 */}
        <Card padding="md">
          <h3 className="text-lg font-semibold text-white mb-4">기타</h3>

          <div className="space-y-4">
            <div>
              <label className={fieldLabel}>
                중복되면 안되는 친척이름과 희망이름, 기타 작명시 부탁하실 내용
              </label>
              <textarea
                placeholder="중복되지 말아야 할 친척 이름, 희망하는 이름 스타일, 특이사항 등을 적어주세요."
                value={formData.restrictions}
                onChange={(e) => updateFormData("restrictions", e.target.value)}
                className={`${textareaBase} min-h-[100px]`}
              />
            </div>

            <div className="bg-black border border-[#1A1A1A] p-4 rounded-lg">
              <p className="text-sm text-[#A3A3A3]">
                작명 신청시, 직계가족에 한해 이름감명을 해드리고 있습니다.
                원하시면 감명하실분의 한자이름, 생년월일, 태어난 시를 함께
                적어주세요. 전화드려 설명해드립니다. 감사합니다.
              </p>
            </div>
          </div>
        </Card>

        {/* 신청인 정보 */}
        <Card padding="md">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <User className="w-5 h-5 text-white" strokeWidth={1.5} />
            신청인 정보
          </h3>

          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={fieldLabel}>
                  신청인 성명(한글) <span className="text-red-400">*</span>
                </label>
                <Input
                  type="text"
                  placeholder="신청인 성명"
                  value={formData.applicantName}
                  onChange={(e) =>
                    updateFormData("applicantName", e.target.value)
                  }
                  required
                />
                {errors.applicantName && (
                  <p className="text-red-400 text-sm mt-1">
                    {errors.applicantName}
                  </p>
                )}
              </div>
              <div>
                <label className={fieldLabel}>신생아와의 관계</label>
                <Input
                  type="text"
                  placeholder="예: 아버지, 어머니"
                  value={formData.relationship}
                  onChange={(e) =>
                    updateFormData("relationship", e.target.value)
                  }
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={`${fieldLabel} flex items-center gap-2`}>
                  <Phone className="w-4 h-4" strokeWidth={1.5} />
                  전화번호
                </label>
                <Input
                  type="tel"
                  placeholder="02-1234-5678"
                  value={formData.phone}
                  onChange={(e) => updateFormData("phone", e.target.value)}
                />
              </div>
              <div>
                <label className={`${fieldLabel} flex items-center gap-2`}>
                  <Phone className="w-4 h-4" strokeWidth={1.5} />
                  휴대폰번호 <span className="text-red-400">*</span>
                </label>
                <Input
                  type="tel"
                  placeholder="010-1234-5678"
                  value={formData.mobile}
                  onChange={(e) => updateFormData("mobile", e.target.value)}
                  required
                />
                <p className="text-xs text-[#525252] mt-1">
                  문자 MMS로 이름을 보내드리니 정확히 기재해 주세요.
                </p>
                {errors.mobile && (
                  <p className="text-red-400 text-sm mt-1">{errors.mobile}</p>
                )}
              </div>
            </div>

            <div>
              <label className={`${fieldLabel} flex items-center gap-2`}>
                <Mail className="w-4 h-4" strokeWidth={1.5} />
                E-MAIL 주소
              </label>
              <Input
                type="email"
                placeholder="example@email.com"
                value={formData.email}
                onChange={(e) => updateFormData("email", e.target.value)}
              />
            </div>

            <div className="space-y-4">
              <div>
                <label className={`${fieldLabel} flex items-center gap-2`}>
                  <MapPin className="w-4 h-4" strokeWidth={1.5} />
                  우편주소
                </label>
                <div className="grid grid-cols-1 md:grid-cols-6 gap-2 mb-2">
                  <div className="md:col-span-2">
                    <Input
                      type="text"
                      placeholder="우편번호"
                      value={formData.postalCode}
                      onChange={(e) =>
                        updateFormData("postalCode", e.target.value)
                      }
                    />
                  </div>
                  <div className="md:col-span-4">
                    <Input
                      type="text"
                      placeholder="주소 검색 또는 입력"
                      value={formData.address}
                      onChange={(e) =>
                        updateFormData("address", e.target.value)
                      }
                    />
                  </div>
                </div>
                <Input
                  type="text"
                  placeholder="세부주소 (아파트 동호수 등)"
                  value={formData.detailAddress}
                  onChange={(e) =>
                    updateFormData("detailAddress", e.target.value)
                  }
                />
              </div>
            </div>

            <div>
              <label className={fieldLabel}>방문경로</label>
              <select
                value={formData.referralSource}
                onChange={(e) =>
                  updateFormData("referralSource", e.target.value)
                }
                className={selectBase}
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
            variant="primary"
            size="lg"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <span className="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-black mr-2 align-middle" />
                신청서 제출 중...
              </>
            ) : (
              <span className="inline-flex items-center gap-2">
                <Send className="w-5 h-5" strokeWidth={1.5} />
                작명 신청하기
              </span>
            )}
          </Button>

          <p className="text-sm text-[#525252] mt-4">
            신청서 제출 후 2-3일 이내에 전문 작명사가 검토하여 연락드리겠습니다.
          </p>
        </div>
      </form>
    </AppLayout>
  );
};
