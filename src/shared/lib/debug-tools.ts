/**
 * 개발자 디버깅 도구
 * 브라우저 콘솔에서 사용할 수 있는 유틸리티 함수들
 */

interface DebugTools {
  version: () => void;
  versionInfo: () => any;
  copyVersion: () => void;
  checkVersion: () => Promise<any>;
  compareVersions: () => Promise<void>;
  rollbackInfo: () => void;
  clearCache: () => void;
  debugMode: (enabled?: boolean) => void;
}

// 전역 디버그 도구 생성
function createDebugTools(): DebugTools {
  return {
    // 현재 버전 정보 출력
    version: () => {
      if (typeof window !== 'undefined' && window.__APP_VERSION__) {
        const v = window.__APP_VERSION__;
        console.group('🚀 현재 버전 정보');
        console.log(`버전: ${v.version}`);
        console.log(`빌드 시간: ${v.buildTime}`);
        console.log(`커밋: ${v.git.shortHash} (${v.git.branch})`);
        console.log(`환경: ${v.environment}`);
        console.log(`빌드 번호: ${v.buildNumber}`);
        console.groupEnd();
      } else {
        console.warn('버전 정보를 찾을 수 없습니다.');
      }
    },

    // 전체 버전 정보 반환
    versionInfo: () => {
      if (typeof window !== 'undefined' && window.__APP_VERSION__) {
        return window.__APP_VERSION__;
      }
      return null;
    },

    // 버전 정보를 클립보드에 복사
    copyVersion: () => {
      if (typeof window !== 'undefined' && window.__APP_VERSION__) {
        const v = window.__APP_VERSION__;
        const info = `
WooBottle Labs - 디버깅 정보
==========================
버전: ${v.version}
빌드 시간: ${v.buildTime}
커밋: ${v.git.commitHash}
브랜치: ${v.git.branch}
환경: ${v.environment}
빌드 번호: ${v.buildNumber}
커밋 메시지: ${v.git.commitMessage}
URL: ${window.location.href}
User Agent: ${navigator.userAgent}
        `.trim();
        
        navigator.clipboard.writeText(info).then(() => {
          console.log('✅ 디버깅 정보가 클립보드에 복사되었습니다!');
        });
      }
    },

    // 서버의 최신 버전 정보 확인
    checkVersion: async () => {
      try {
        const response = await fetch('/version.json');
        const serverVersion = await response.json();
        
        if (typeof window !== 'undefined' && window.__APP_VERSION__) {
          const clientVersion = window.__APP_VERSION__;
          
          console.group('🔍 버전 비교');
          console.log('클라이언트 버전:', clientVersion.version);
          console.log('서버 버전:', serverVersion.version);
          
          if (clientVersion.version !== serverVersion.version) {
            console.warn('⚠️ 버전이 다릅니다! 새로고침이 필요할 수 있습니다.');
          } else {
            console.log('✅ 버전이 일치합니다.');
          }
          console.groupEnd();
        }
        
        return serverVersion;
      } catch (error) {
        console.error('❌ 서버 버전 정보를 가져올 수 없습니다:', error);
        return null;
      }
    },

    // 사용 가능한 버전들 비교
    compareVersions: async () => {
      try {
        // S3에서 사용 가능한 버전 목록 가져오기 (deploy-info.json 활용)
        const response = await fetch('/deploy-info.json');
        const deployInfo = await response.json();
        
        console.group('📋 배포 정보');
        console.log('현재 배포 버전:', deployInfo.version);
        console.log('배포 시간:', deployInfo.timestamp);
        console.log('환경:', deployInfo.environment);
        console.log('커밋 해시:', deployInfo.commit_hash);
        console.log('브랜치:', deployInfo.branch);
        console.groupEnd();
        
        return deployInfo;
      } catch (error) {
        console.error('❌ 배포 정보를 가져올 수 없습니다:', error);
        return null;
      }
    },

    // 롤백 관련 정보
    rollbackInfo: () => {
      console.group('🔄 롤백 정보');
      console.log('사용 가능한 롤백 명령어:');
      console.log('  npm run rollback              # 대화형 롤백');
      console.log('  npm run versions               # Git 태그 목록');
      console.log('  npm run versions:s3:prod       # S3 버전 목록');
      console.log('');
      console.log('수동 롤백 방법:');
      console.log('  1. 사용 가능한 버전 확인: npm run versions:s3:prod');
      console.log('  2. 특정 버전으로 롤백: ./scripts/rollback.sh --version v1.0.0');
      console.log('');
      console.log('긴급 롤백 (AWS CLI):');
      console.log('  aws s3 sync s3://woo-bottle.com/versions/v1.0.0/ s3://woo-bottle.com/current/ --delete');
      console.groupEnd();
    },

    // 캐시 클리어
    clearCache: () => {
      if ('caches' in window) {
        caches.keys().then(names => {
          names.forEach(name => {
            caches.delete(name);
          });
        });
        console.log('🧹 캐시가 클리어되었습니다. 새로고침하세요.');
      }
      
      // 로컬 스토리지도 클리어 (선택적)
      if (confirm('로컬 스토리지도 클리어하시겠습니까?')) {
        localStorage.clear();
        sessionStorage.clear();
        console.log('🧹 로컬 스토리지도 클리어되었습니다.');
      }
    },

    // 디버그 모드 토글
    debugMode: (enabled?: boolean) => {
      const isEnabled = enabled ?? !localStorage.getItem('debug-mode');
      
      if (isEnabled) {
        localStorage.setItem('debug-mode', 'true');
        console.log('🐛 디버그 모드가 활성화되었습니다.');
        
        // 추가 디버그 정보 출력
        console.log('디버그 도구 사용법:');
        console.log('  __debug.version()           # 현재 버전 정보');
        console.log('  __debug.checkVersion()      # 서버 버전 확인');
        console.log('  __debug.copyVersion()       # 버전 정보 복사');
        console.log('  __debug.compareVersions()   # 배포 정보 확인');
        console.log('  __debug.rollbackInfo()      # 롤백 방법 안내');
        console.log('  __debug.clearCache()        # 캐시 클리어');
      } else {
        localStorage.removeItem('debug-mode');
        console.log('🐛 디버그 모드가 비활성화되었습니다.');
      }
    }
  };
}

// 브라우저 환경에서만 전역 디버그 도구 등록
if (typeof window !== 'undefined') {
  // 전역 디버그 도구 등록
  (window as any).__debug = createDebugTools();
  
  // 개발 환경에서 자동으로 버전 정보 출력
  if (process.env.NODE_ENV === 'development') {
    setTimeout(() => {
      (window as any).__debug.version();
      console.log('💡 디버그 도구: __debug 객체를 사용하세요.');
    }, 1000);
  }
}

export { createDebugTools };
export type { DebugTools };
