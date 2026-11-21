import type { Building } from './data'

/**
 * Human-friendly visual recognition guide for each Dongseo University building (1..31)
 * so students and visitors can immediately tell what the building looks like on campus.
 */
export function getBuildingVisualDescription(building: Building): string {
  const num = building.campusNumber ?? building.id
  switch (num) {
    case 1:
      return '반원형 아치 광장 우측의 9층 곡선형 유리·석재 복합 건물 (청색 지붕)'
    case 2:
      return '운동장 위편 가로로 길게 뻗은 5층 블루 지붕 & 베이지·브라운 벽면 건물'
    case 3:
      return '산자락 중턱의 깔끔한 6층 네이비 지붕 & 화이트 격자 창문 건물'
    case 4:
      return '보건의료관 옆 나란히 배치된 6층 블루 지붕 공학 실습동'
    case 5:
      return '디자인홀 앞쪽의 6층 진청색 지붕 & 밝은 회백색 현대식 산학 연구동'
    case 6:
      return '국제협력관과 마주보는 반원형 곡선 파사드의 7층 어문 교육관'
    case 7:
      return '스튜던트 플라자 뒤편 좌측의 7층 화이트·블루 루프 건물'
    case 8:
      return '스튜던트 플라자 뒤편 우측의 8층 깔끔한 직사각형 경영관'
    case 9:
      return '강렬한 레드(빨강) & 화이트 외벽 포인트가 돋보이는 8층 대형 디자인 건물'
    case 10:
      return '초록색 박공 지붕과 연두빛 외벽이 특징인 친환경 4층 그린홀'
    case 11:
      return '언덕길 가로변을 따라 아치형 캐노피가 연속된 2층 창업·지원 공간'
    case 12:
      return '캠퍼스 최상단 언덕 위 황금빛 베이지 곡선 외벽과 초록 지붕의 7층 기숙사'
    case 13:
      return '4층 석재 기단(포디엄) 위에 15층 푸른 통유리 타워가 솟은 동서대 대표 랜드마크'
    case 14:
      return '뉴밀레니엄관 아래쪽 9층 규모의 스카이블루 루프 & 화이트 IT 건물'
    case 15:
      return '상단 숲속에 위치한 붉은 벽돌빛 지붕과 따뜻한 베이지 외벽의 5층 건물'
    case 16:
      return '전면 대형 유리 커튼월과 청록색 루프가 돋보이는 6층 학생문화관'
    case 17:
      return '붉은 아치형 지붕과 파란 곡선 유리 정면부를 가진 5층 대형 스포츠센터'
    case 18:
      return '붉은 테라코타 원형 돔 지붕과 십자가가 한눈에 보이는 원통형 대학교회'
    case 19:
      return '정문 아래쪽 나란히 배치된 5층 화이트·민트 지붕 학생생활아파트 단지'
    case 20:
      return '붉은 벽돌색 외벽과 갈색 지붕의 10층 고층 국제생활관 제2동'
    case 21:
      return '비상하는 날개형 지붕과 대형 푸른 통유리창이 인상적인 6층 민석도서관'
    case 22:
      return '따뜻한 테라코타·오렌지 외벽의 아담한 4층 한국어교육원 건물'
    case 23:
      return '동일한 형태의 12층 현대식 트윈 타워(쌍둥이 고층 동)로 이루어진 글로벌빌리지'
    case 24:
      return '푸른 인조잔디 축구장과 400m 붉은 육상 트랙, 관람석 스탠드를 갖춘 종합운동장'
    case 25:
      return '초록·주황 코트 바닥과 펜스가 설치된 야외 테니스장 코트'
    case 26:
      return '푸른 소나무 숲과 벤치, 파고라 쉼터가 조성된 캠퍼스 힐링 정원'
    case 27:
      return '아담한 붉은 박공지붕과 테라스를 갖춘 2층 규모의 우정의집'
    case 29:
      return '상징 조형물 타워와 산책 데크가 어우러진 유니버시티 파크 광장'
    case 30:
      return '부채꼴 돌계단 객석과 반원형 야외 무대로 꾸며진 야외공연장 (Muse Park)'
    case 31:
      return '선명한 코발트블루 포인트 외벽과 유리 파사드의 5층 인터내셔널 칼리지'
    default:
      return `${building.levels ?? 4}층 규모의 동서대학교 캠퍼스 교육·연구 건물`
  }
}

/**
 * Generates a clean, instant-loading SVG illustration (as a data URI) showing
 * what the building looks like so users can recognize its silhouette, color, and style at a glance.
 */
export function getBuildingAppearanceSvgDataUri(building: Building): string {
  const num = building.campusNumber ?? building.id
  const roof = building.roofColor ?? '#24579e'
  const wall = building.wallColor ?? '#f8fafc'
  const side = building.wallSideColor ?? '#cbd5e1'
  const accent = building.accentColor ?? '#1d4ed8'
  const levels = Math.max(1, building.levels ?? 4)
  const shape = building.shapeType ?? 'prism'

  let innerSvg = ''

  // 1. #13 New Millennium Hall (15F Blue Glass Tower on 4F Podium)
  if (shape === 'tower-podium' || num === 13) {
    innerSvg = `
      <!-- Podium -->
      <rect x="14" y="54" width="92" height="24" rx="2" fill="#e2e8f0" stroke="#475569" stroke-width="1.5"/>
      <polygon points="14,54 24,47 114,47 106,54" fill="#64748b"/>
      <rect x="20" y="60" width="80" height="4" fill="#334155" opacity="0.5"/>
      <rect x="20" y="68" width="80" height="4" fill="#334155" opacity="0.5"/>
      <!-- High-rise Glass Tower -->
      <rect x="44" y="14" width="44" height="44" rx="2" fill="#38bdf8" stroke="#0369a1" stroke-width="1.5"/>
      <polygon points="44,14 52,8 94,8 88,14" fill="#0284c7"/>
      <polygon points="88,14 94,8 94,52 88,58" fill="#0369a1"/>
      <!-- Glass Curtain Wall Grid -->
      <line x1="55" y1="14" x2="55" y2="58" stroke="#e0f2fe" stroke-width="1" opacity="0.7"/>
      <line x1="66" y1="14" x2="66" y2="58" stroke="#e0f2fe" stroke-width="1" opacity="0.7"/>
      <line x1="77" y1="14" x2="77" y2="58" stroke="#e0f2fe" stroke-width="1" opacity="0.7"/>
      <line x1="44" y1="23" x2="88" y2="23" stroke="#0284c7" stroke-width="1.2"/>
      <line x1="44" y1="32" x2="88" y2="32" stroke="#0284c7" stroke-width="1.2"/>
      <line x1="44" y1="41" x2="88" y2="41" stroke="#0284c7" stroke-width="1.2"/>
      <line x1="44" y1="50" x2="88" y2="50" stroke="#0284c7" stroke-width="1.2"/>
      <!-- Entrance -->
      <rect x="52" y="70" width="16" height="8" rx="1" fill="#0f172a"/>
    `
  }
  // 2. #23 Global Village (Twin Towers)
  else if (shape === 'twin-towers' || num === 23) {
    innerSvg = `
      <!-- Base Podium -->
      <rect x="14" y="64" width="92" height="14" rx="2" fill="#cbd5e1" stroke="#475569" stroke-width="1.4"/>
      <!-- Left Tower -->
      <rect x="20" y="18" width="32" height="48" rx="2" fill="#f8fafc" stroke="#475569" stroke-width="1.5"/>
      <polygon points="20,18 26,12 58,12 52,18" fill="${roof}"/>
      <polygon points="52,18 58,12 58,60 52,66" fill="${side}"/>
      <!-- Right Tower -->
      <rect x="64" y="18" width="32" height="48" rx="2" fill="#f8fafc" stroke="#475569" stroke-width="1.5"/>
      <polygon points="64,18 70,12 102,12 96,18" fill="${roof}"/>
      <polygon points="96,18 102,12 102,60 96,66" fill="${side}"/>
      <!-- Windows Left & Right -->
      ${[25, 33, 41, 49, 57].map((y) => `<rect x="25" y="${y}" width="22" height="3.5" rx="1" fill="#38bdf8" stroke="#0284c7" stroke-width="0.6"/><rect x="69" y="${y}" width="22" height="3.5" rx="1" fill="#38bdf8" stroke="#0284c7" stroke-width="0.6"/>`).join('')}
    `
  }
  // 3. #21 Minseok Library (Winged Roof & Blue Glass Facade)
  else if (num === 21) {
    innerSvg = `
      <!-- Grand Steps & Base -->
      <rect x="14" y="54" width="92" height="24" rx="2" fill="#f1f5f9" stroke="#64748b" stroke-width="1.5"/>
      <rect x="20" y="58" width="80" height="10" rx="1" fill="#38bdf8" stroke="#0284c7" stroke-width="1"/>
      <!-- Upper Library Hall -->
      <rect x="28" y="30" width="64" height="24" fill="#e2e8f0" stroke="#475569" stroke-width="1.4"/>
      <rect x="34" y="34" width="52" height="16" fill="#0284c7"/>
      <line x1="47" y1="34" x2="47" y2="50" stroke="#bae6fd" stroke-width="1.2"/>
      <line x1="60" y1="34" x2="60" y2="50" stroke="#bae6fd" stroke-width="1.2"/>
      <line x1="73" y1="34" x2="73" y2="50" stroke="#bae6fd" stroke-width="1.2"/>
      <!-- Signature Winged Roof -->
      <path d="M 16 31 Q 60 20 104 31 L 96 23 Q 60 14 24 23 Z" fill="#1e40af" stroke="#ffffff" stroke-width="1.2"/>
      <!-- Entrance Stairs -->
      <polygon points="46,78 50,70 70,70 74,78" fill="#94a3b8"/>
    `
  }
  // 4. #9 Design Hall (Red & White Modern Facade)
  else if (shape === 'design-hall' || num === 9) {
    innerSvg = `
      <polygon points="12,30 22,22 110,22 100,30" fill="${roof}"/>
      <rect x="12" y="30" width="88" height="48" rx="2" fill="#f8fafc" stroke="#475569" stroke-width="1.5"/>
      <polygon points="100,30 110,22 110,70 100,78" fill="#cbd5e1"/>
      <!-- Signature Red Architectural Vertical Blocks -->
      <rect x="26" y="30" width="16" height="48" fill="#dc2626"/>
      <rect x="64" y="30" width="16" height="48" fill="#dc2626"/>
      <!-- Window Strips -->
      ${[36, 44, 52, 60, 68].map((y) => `<rect x="16" y="${y}" width="78" height="3.5" fill="#1e293b" opacity="0.65"/>`).join('')}
    `
  }
  // 5. #18 University Church (Circular Red Terracotta Dome + Cross)
  else if (shape === 'dome' || num === 18) {
    innerSvg = `
      <!-- Circular Sanctuary Body -->
      <ellipse cx="60" cy="72" rx="34" ry="7" fill="#cbd5e1" stroke="#64748b" stroke-width="1.4"/>
      <rect x="26" y="42" width="68" height="30" fill="#f8fafc" stroke="#64748b" stroke-width="1.4"/>
      <!-- Red Terracotta Dome Roof -->
      <path d="M 24 42 Q 60 16 96 42 Z" fill="#b91c1c" stroke="#7f1d1d" stroke-width="1.5"/>
      <ellipse cx="60" cy="42" rx="36" ry="7" fill="#dc2626" stroke="#fef08a" stroke-width="1.2"/>
      <!-- Vertical Stained Glass Windows -->
      <rect x="36" y="49" width="6" height="16" rx="3" fill="#3b82f6"/>
      <rect x="49" y="50" width="6" height="16" rx="3" fill="#3b82f6"/>
      <rect x="65" y="50" width="6" height="16" rx="3" fill="#3b82f6"/>
      <rect x="78" y="49" width="6" height="16" rx="3" fill="#3b82f6"/>
      <!-- Golden Cross -->
      <line x1="60" y1="9" x2="60" y2="25" stroke="#eab308" stroke-width="3" stroke-linecap="round"/>
      <line x1="54" y1="15" x2="66" y2="15" stroke="#eab308" stroke-width="3" stroke-linecap="round"/>
    `
  }
  // 6. #24 Stadium (Soccer Turf Pitch & 400m Red Track)
  else if (shape === 'stadium' || num === 24) {
    innerSvg = `
      <!-- Stadium Grandstand Bowl -->
      <rect x="10" y="20" width="100" height="54" rx="26" fill="#cbd5e1" stroke="#475569" stroke-width="1.8"/>
      <!-- Red 400m Running Track -->
      <rect x="16" y="26" width="88" height="42" rx="20" fill="#dc2626" stroke="#fca5a5" stroke-width="1.2"/>
      <!-- Green Soccer Field -->
      <rect x="26" y="32" width="68" height="30" rx="4" fill="#16a34a" stroke="#ffffff" stroke-width="1.5"/>
      <!-- Field Markings -->
      <line x1="60" y1="32" x2="60" y2="62" stroke="#ffffff" stroke-width="1.3"/>
      <circle cx="60" cy="47" r="7" fill="none" stroke="#ffffff" stroke-width="1.3"/>
      <rect x="26" y="40" width="9" height="14" fill="none" stroke="#ffffff" stroke-width="1.1"/>
      <rect x="85" y="40" width="9" height="14" fill="none" stroke="#ffffff" stroke-width="1.1"/>
    `
  }
  // 7. #25 Tennis Courts
  else if (shape === 'court' || num === 25) {
    innerSvg = `
      <rect x="12" y="24" width="96" height="48" rx="5" fill="#15803d" stroke="#ffffff" stroke-width="1.6"/>
      <rect x="20" y="30" width="36" height="36" fill="#ea580c" stroke="#ffffff" stroke-width="1.3"/>
      <line x1="38" y1="30" x2="38" y2="66" stroke="#ffffff" stroke-width="1.4"/>
      <rect x="64" y="30" width="36" height="36" fill="#ea580c" stroke="#ffffff" stroke-width="1.3"/>
      <line x1="82" y1="30" x2="82" y2="66" stroke="#ffffff" stroke-width="1.4"/>
    `
  }
  // 8. #26 Minseok Garden / #29 University Park
  else if (shape === 'park' || num === 26 || num === 29) {
    innerSvg = `
      <ellipse cx="60" cy="64" rx="44" ry="13" fill="#4ade80" stroke="#16a34a" stroke-width="1.5"/>
      <path d="M 30 66 Q 60 54 90 66" fill="none" stroke="#fef08a" stroke-width="4" stroke-linecap="round"/>
      <!-- Trees -->
      <rect x="34" y="45" width="4" height="16" fill="#78350f"/>
      <circle cx="36" cy="39" r="12" fill="#15803d"/>
      <circle cx="33" cy="36" r="8" fill="#22c55e"/>
      <rect x="78" y="46" width="4" height="15" fill="#78350f"/>
      <circle cx="80" cy="40" r="11" fill="#166534"/>
      <circle cx="77" cy="37" r="7" fill="#4ade80"/>
      <!-- Monument / Pergola -->
      <rect x="55" y="28" width="10" height="32" rx="2" fill="#f8fafc" stroke="#475569" stroke-width="1.4"/>
      <circle cx="60" cy="24" r="5" fill="#f59e0b"/>
    `
  }
  // 9. #30 Outdoor Amphitheater (Muse Park)
  else if (shape === 'amphitheater' || num === 30) {
    innerSvg = `
      <path d="M 14 28 Q 60 8 106 28 L 90 68 Q 60 56 30 68 Z" fill="#cbd5e1" stroke="#475569" stroke-width="1.5"/>
      <path d="M 22 38 Q 60 22 98 38" fill="none" stroke="#64748b" stroke-width="1.6"/>
      <path d="M 27 49 Q 60 36 93 49" fill="none" stroke="#64748b" stroke-width="1.6"/>
      <ellipse cx="60" cy="66" rx="22" ry="8" fill="#d97706" stroke="#ffffff" stroke-width="1.5"/>
    `
  }
  // 10. #1 & #6 Curved Student Plaza Wings / #12 Curved Dormitory
  else if (num === 1 || num === 6 || num === 12) {
    innerSvg = `
      <path d="M 16 26 Q 60 16 104 26 L 104 72 Q 60 62 16 72 Z" fill="${wall}" stroke="#475569" stroke-width="1.5"/>
      <path d="M 16 26 Q 60 16 104 26 L 98 20 Q 60 10 22 20 Z" fill="${roof}"/>
      <!-- Curved Glass Curtain Center -->
      <path d="M 36 30 Q 60 24 84 30 L 84 67 Q 60 61 36 67 Z" fill="#38bdf8" opacity="0.85" stroke="#0284c7" stroke-width="1.2"/>
      ${[37, 45, 53, 61].map((y) => `<path d="M 22 ${y} Q 60 ${y - 6} 98 ${y}" fill="none" stroke="#1e293b" stroke-width="1.3" opacity="0.55"/>`).join('')}
    `
  }
  // 11. General Academic Buildings (Scaled by floor height, roof color, wall color, window grid)
  else {
    const bHeight = Math.min(54, Math.max(26, levels * 6))
    const bTop = 76 - bHeight
    const rowCount = Math.min(6, Math.max(2, Math.round(levels * 0.7)))
    const rows: string[] = []
    for (let r = 1; r <= rowCount; r++) {
      const y = bTop + (bHeight / (rowCount + 1)) * r - 2
      rows.push(`<rect x="22" y="${y.toFixed(1)}" width="64" height="3.8" rx="1" fill="${accent}" opacity="0.72"/>`)
    }
    innerSvg = `
      <!-- 3D Roof Top -->
      <polygon points="16,${bTop} 28,${bTop - 9} 104,${bTop - 9} 92,${bTop}" fill="${roof}" stroke="#ffffff" stroke-width="1"/>
      <!-- Front Wall -->
      <rect x="16" y="${bTop}" width="76" height="${bHeight}" rx="2" fill="${wall}" stroke="#475569" stroke-width="1.5"/>
      <!-- Side Wall -->
      <polygon points="92,${bTop} 104,${bTop - 9} 104,${76 - 9} 92,76" fill="${side}" stroke="#475569" stroke-width="1.2"/>
      <!-- Floor Windows -->
      ${rows.join('')}
      <!-- Main Entrance Canopy -->
      <rect x="44" y="66" width="20" height="10" rx="1.5" fill="#1e293b"/>
      <rect x="41" y="64" width="26" height="3" rx="1" fill="${roof}"/>
    `
  }

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 86" width="120" height="86">
    <defs>
      <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#e0f2fe"/>
        <stop offset="70%" stop-color="#f0fdf4"/>
        <stop offset="100%" stop-color="#dcfce7"/>
      </linearGradient>
    </defs>
    <!-- Soft Sky & Lawn Backdrop -->
    <rect width="120" height="86" rx="10" fill="url(#sky)"/>
    <ellipse cx="60" cy="79" rx="52" ry="6" fill="#bbf7d0"/>
    ${innerSvg}
  </svg>`

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`
}
