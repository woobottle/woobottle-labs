import { NextRequest, NextResponse } from 'next/server';

interface NameApplicationData {
  calendarType: string;
  birthYear: string;
  birthMonth: string;
  birthDay: string;
  birthHour: string;
  birthMinute: string;
  gender: string;
  surnameKorean: string;
  surnameHanja: string;
  surnameOrigin: string;
  useSiblingName: boolean;
  siblingPosition: string;
  siblingNameKorean: string;
  siblingNameHanja: string;
  fatherName: string;
  motherName: string;
  birthOrder: string;
  siblings: string;
  restrictions: string;
  preferences: string;
  specialRequests: string;
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

export async function POST(request: NextRequest) {
  try {
    const body: NameApplicationData = await request.json();

    // 데이터 검증
    if (!body.applicantName || !body.mobile || !body.surnameKorean || !body.surnameHanja) {
      return NextResponse.json(
        { error: '필수 정보가 누락되었습니다.' },
        { status: 400 }
      );
    }

    // 실제로는 데이터베이스에 저장하거나 외부 서비스로 전송
    console.log('작명 신청서 수신:', {
      신청인: body.applicantName,
      연락처: body.mobile,
      대상자_출생일: `${body.birthYear}-${body.birthMonth}-${body.birthDay}`,
      대상자_성별: body.gender,
      대상자_성씨: `${body.surnameKorean} (${body.surnameHanja})`,
      신청일시: new Date().toISOString(),
    });

    // 성공 응답
    return NextResponse.json({
      success: true,
      message: '작명 신청서가 성공적으로 접수되었습니다.',
      applicationId: `APP-${Date.now()}`,
      estimatedResponseTime: '2-3일',
      contactInfo: {
        phone: '02-538-3200',
        mobile: '010-8077-8158'
      }
    });

  } catch (error) {
    console.error('작명 신청서 처리 중 오류:', error);

    return NextResponse.json(
      { error: '서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.' },
      { status: 500 }
    );
  }
}

// GET 메서드도 지원 (필요시)
export async function GET() {
  return NextResponse.json({
    message: '작명 신청 API 엔드포인트입니다.',
    method: 'POST로 데이터를 전송해주세요.'
  });
}
