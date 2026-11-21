import { SEEDED_BUILDINGS_RAW } from './campusData'

export type Language = 'ko' | 'en' | 'zh' | 'vi' | 'lt' | 'hi'

export type FloorRoomItem = {
  code?: string
  name: string
  name_en?: string
  name_zh?: string
  name_vi?: string
  name_lt?: string
  name_hi?: string
  category?: string | null
  note?: string | null
}

export type Building = {
  id: number
  campusNumber?: number
  codePrefix?: string
  codeRange?: string
  departmentSummary?: string
  name: string
  englishName?: string
  lat: number
  lng: number
  elevation?: number
  levels?: number
  footprint?: [number, number][]
  secondaryFootprint?: [number, number][]
  roofColor?: string
  wallColor?: string
  wallSideColor?: string
  accentColor?: string
  shapeType?: string
  aliases?: string[]
  photoUrl?: string
  photoSourceUrl?: string
  videoUrl?: string
  floorDetails?: Array<{ floor: number; label: string; facilities: FloorRoomItem[] }>
}

export type RouteSegment = {
  id: string
  from_node: string
  to_node: string
  from_coord: [number, number]
  to_coord: [number, number]
  from_elevation: number
  to_elevation: number
  distance_m: number
  slope_pct: number
  is_step_free: boolean
}

export type RouteWaypoint = {
  node_id: string
  lat: number
  lng: number
  elevation: number
  building_id?: number | null
  label?: string | null
}

// Verified OpenStreetMap building centroids & 3D extruded footprints with official DSU Campus Map numbers (1..31) & Room Codes
export const officialCampusMapUrl = 'https://www.dongseo.ac.kr/kr/index.php?pCode=campusmap'

const campusPhotoHashes = [
  'e5e54a29766190b6df8546c609ebe5e7', 'ca0a7be63a6cefca89eb4b5b3febc425', '19ceb77134e88df307ef81520fea3dca',
  '0ebb46c12039985d842ca1dcad985030', '4d1707e4769f29891eccda8623f2fdb0', '1040e802fa6969e41440d1c3eea6534b',
  '205656a2ddf8cc6f9d7460fb0d61ecf3', '511e1a6a93266eb2887a6ac12b36a41f', 'e914aa6de5babafe1aea21da9ba0055c',
  '5153c002b67595d82b9c77a54125c7bf', 'b10b1ce4f0ba7b7ebc716123d0ea26db', '63e90c396d00f8e59508c1f0e671854c',
  'dc3bbcc71753e024ce0179de4b74742d', '4fda938fc25b5b3a03a0e8fe4dc24532', 'dfc9e5ac5949497be687169d46d44f6c',
  'eaec85775d997e30cd92d999eaa570c6', '80928f387a962d2c912d41419968f7c6', '6175278f8b73a065ae052056fe1686bb',
  'ba489ea1a05293d64596586f24511886', '80fd6e074cac64fd09301dcc1e051c5c', '85e73da2c7964232ac321786928e03ea',
  'ef62738708368b3e34e2f2bb3c8125d8', 'ae8112f6e2f7040e183a3a8915e0ad95', 'd5900c00bf3ca64d96cfecc96341e180',
  '81be7ba57ff03aa1191dc77701cd6644', '60a988b2d5c4c33cc11a576833145ef6', 'ac7f37bddb7f60d4d598bec7e6730544',
  '9da416c2cb86487a54e1bcceb33cc708', '36aa6a75851e1244fdbcbc932d368cb8', '131da3cc6e5c5866f32c1a9be21c97f7',
  '6a4ad31eb7e6e18365423bb3c6ab4bb9',
]

export const buildings: Building[] = SEEDED_BUILDINGS_RAW.map((b) => {
  const raw = b as Record<string, unknown>
  return {
    id: b.id,
    campusNumber: b.num,
    codePrefix: raw.code_prefix as string | undefined,
    codeRange: raw.code_range as string | undefined,
    departmentSummary: raw.department_summary as string | undefined,
    name: b.name,
    englishName: b.name_en,
    lat: b.lat,
    lng: b.lng,
    elevation: b.elevation,
    levels: b.levels,
    footprint: b.footprint as [number, number][],
    secondaryFootprint: raw.secondary_footprint as [number, number][] | undefined,
    roofColor: (raw.roof_color as string | undefined) ?? '#24579e',
    wallColor: (raw.wall_color as string | undefined) ?? '#f1f5f9',
    wallSideColor: (raw.wall_side_color as string | undefined) ?? '#cbd5e1',
    accentColor: (raw.accent_color as string | undefined) ?? '#1d4ed8',
    shapeType: (raw.shape_type as string | undefined) ?? 'prism',
    aliases: b.aliases,
    photoUrl: `/photos/bldg_${String(b.num).padStart(2, '0')}.jpg`,
    photoSourceUrl: campusPhotoHashes[b.num - 1]
      ? `https://www.dongseo.ac.kr/_Data/UnivCampusMap/${campusPhotoHashes[b.num - 1]}.jpg`
      : officialCampusMapUrl,
    floorDetails: b.floor_details as Building['floorDetails'],
  }
})

export const copy = {
  ko: {
    eyebrow: 'DONGSEO UNIVERSITY · 3D BUILDING MAP GUIDE', title: '동서대학교 전용\n3D 건물 · 호실 길찾기', subtitle: '공식 캠퍼스맵 번호(1~31번) · 색상별 3D 입체 건물 모델 · 사용자 시점 길따라가기', search: '건물 번호(1~31), 건물명, 호실 코드(U001, NM404, DH301) 검색', ask: '검색', map: '동서대 3D 건물 지도', all: '번호별 캠퍼스 건물 (1~31번)', buildings: '개 시설', selected: '선택한 건물', details: '건물 및 호실 정보', floors: '층별 호실 상세 안내', video: '길따라가기 미리보기', noInfo: '아직 등록된 정보가 없습니다.', noVideo: '클릭하면 이 건물까지 사용자 시점 길따라가기를 시작합니다', noFloors: '층별 시설 정보가 등록되지 않았습니다.', directions: '길찾기 · 길안내', from: '출발지', to: '도착지', chooseFrom: '출발 건물 또는 내 위치 선택', chooseTo: '도착 건물 선택', current: '내 현재 위치', route: '경로 탐색 및 길따라가기', routeUnavailable: '선택한 구간 사이에 연결된 보행로가 없습니다.', routeSame: '출발지와 도착지를 다르게 선택해 주세요.', stepFree: '완만 경사로 우선 (계단 제외)', suggested: '주요 캠퍼스 건물', popular: ['민석도서관', '뉴밀레니엄관', '스튜던트 플라자'], count: '캠퍼스 번호', pin: '지도·호실 보기', close: '닫기', noMatch: '등록된 건물이나 호실(예: 13번, U001, NM404)에서 찾지 못했어요.', campusOnly: '동서대학교 캠퍼스 경계 내 등록 건물만 안내합니다.', mapHint: '빨간 번호(1~31) 또는 3D 건물을 눌러 층별 호실(U001·NM101 등)을 확인하세요', locate: '내 위치 찾기', noLocation: 'GPS가 캠퍼스 밖이거나 권한이 꺼져 있어 캠퍼스 내 위치 지정 모드로 전환합니다.', guide: '동서대 3D 캠퍼스맵', routeMode: '사용자 시점 길안내 · 경사로 위치 표시', minutes: '실측 고도(해발 69m~162m)와 경사도를 반영해 3D 건물 지도 위에 경사로 위치와 보행 시간을 안내합니다.', askExample: '예: 13번, 21번, U001, NM201, NM404, DH301, EL201', dataNote: '공식 번호(1~31) · 색상별 3D 건물 모델', searchResults: '건물·호실 탐색', clear: '지우기', floorLabel: '층', basement: '지하', roof: '옥상', coordinates: '실측 좌표 · 해발고도', mapLoading: '지도를 불러오는 중', markerAlt: '건물 위치', infoTitle: '사용자 시점 길따라가기 연동', infoBody: '내 시점 길따라가기를 누르면 3D 입체 건물과 경사로 위치를 따라 실시간 길안내를 진행합니다.', registered: '동서대 전용 보행로 · 경사로 그래프 활성', noRouteTag: '경로 데이터 미등록', language: '언어', fallback: '키워드 검색', noData: '무장애 경사로', footer: '동서대학교 캠퍼스 가이드',
  },
  en: {
    eyebrow: 'DONGSEO UNIVERSITY · 3D BUILDING MAP GUIDE', title: 'Find your way\non DSU Campus', subtitle: 'Official building numbers (1–31) · Colored 3D building models · Room codes (U001, NM101)', search: 'Search building #(1-31), name, or room code (U001, NM404)', ask: 'Search', map: 'DSU 3D Building Map', all: 'Numbered Buildings (1–31)', buildings: 'Buildings', selected: 'Selected building', details: 'Building & Room details', floors: 'Floor & Room directory', video: 'Route Preview', noInfo: 'No information has been added yet.', noVideo: 'Click to start user-perspective route following on the map', noFloors: 'Floor information has not been added.', directions: 'Directions', from: 'From', to: 'To', chooseFrom: 'Choose starting building or My Location', chooseTo: 'Choose a destination', current: 'My Current Location', route: 'Find Route & Follow on Map', routeUnavailable: 'A safe route is unavailable between these points.', routeSame: 'Choose different starting and destination points.', stepFree: 'Prefer gentle ramps (Step-free)', suggested: 'Try searching for', popular: ['Minseok Library', 'New Millennium Hall', 'Student Plaza'], count: 'DSU Buildings', pin: 'Show on map', close: 'Close', noMatch: 'No registered place or room code matched.', campusOnly: 'This guide covers registered buildings inside Dongseo University only.', mapHint: 'Click any red number (1–31) or 3D building model for room details', locate: 'My location', noLocation: 'GPS unavailable or outside campus; click the map to set your campus location.', guide: 'Campus guide', routeMode: 'Slope & Turn-by-Turn Routing', minutes: 'Walking time and slope markers are shown directly on the 3D building campus map.', askExample: 'Try: #13, U001, NM404, Minseok Library', dataNote: '3D Colored Buildings · Official Numbers 1–31', searchResults: 'Explore', clear: 'Clear', floorLabel: 'Floor', basement: 'B', roof: 'Roof', coordinates: 'Coordinates & Elevation', mapLoading: 'Loading map', markerAlt: 'Building location', infoTitle: 'User-Perspective Route Guidance', infoBody: 'Start route guidance to follow the path past 3D colored campus buildings.', registered: 'Verified campus path & slope graph active', noRouteTag: 'No route data', language: 'Language', fallback: 'Keyword search', noData: 'Ramp Route', footer: 'Dongseo University Campus Guide',
  },
  zh: {
    eyebrow: '東西大學 · 3D建築校園導航', title: '在東西大學\n3D建築與教室導航', subtitle: '官方建築編號(1~31) · 彩色3D立體建築模型 · U001/NM101教室指南', search: '搜尋建築編號(1~31)、名稱或教室編號 (如 U001, NM404)', ask: '搜尋', map: '校園3D建築地圖', all: '編號建築列表 (1~31)', buildings: '棟建築', selected: '已選建築', details: '建築與教室資訊', floors: '樓層與教室編號指南', video: '路線預覽', noInfo: '尚未新增資訊。', noVideo: '點擊啟動用戶視角地圖路線跟隨導航', noFloors: '尚未新增樓層設施資訊。', directions: '路線導航', from: '出發地', to: '目的地', chooseFrom: '選擇出發建築或目前位置', chooseTo: '選擇目的建築', current: '目前位置', route: '查看路線與導航', routeUnavailable: '暫時無法提供安全路線。', routeSame: '請選擇不同的出發地和目的地。', stepFree: '優先選擇緩坡道（無階梯）', suggested: '您要找的是？', popular: ['民石圖書館', '新千禧館', '學生廣場'], count: '已登錄建築', pin: '在地圖上查看', close: '關閉', noMatch: '找不到已登錄的地點或教室編號。', campusOnly: '此服務僅提供東西大學校園內已登錄建築資訊。', mapHint: '點選紅色編號(1~31)或3D建築查看各樓層教室編號', locate: '目前位置', noLocation: '無法使用GPS定位，請在校園地圖上點選您的位置。', guide: '校園指南', routeMode: '坡道導航', minutes: '根據校園實測海拔與坡度在地圖標示坡道位置。', askExample: '例如：13, U001, NM404, 民石圖書館', dataNote: '彩色3D建築模型 · 官方編號1~31', searchResults: '建築·教室搜尋', clear: '清除', floorLabel: '樓層', basement: '地下', roof: '屋頂', coordinates: '位置座標與海拔', mapLoading: '地圖載入中', markerAlt: '建築位置', infoTitle: '支援用戶視角跟隨導航', infoBody: '點擊路線即可在地圖上跟隨路線移動。', registered: '校園步道與坡度路網已啟用', noRouteTag: '尚無路線資料', language: '語言', fallback: '關鍵字搜尋', noData: '無障礙坡道', footer: '東西大學校園指南',
  },
  vi: {
    eyebrow: 'ĐẠI HỌC DONGSEO · BẢN ĐỒ TÒA NHÀ 3D', title: 'Tìm phòng & đường đi\ntrong khuôn viên', subtitle: 'Số tòa nhà (1–31) · Mô hình tòa nhà 3D màu sắc · Mã phòng (U001, NM101...)', search: 'Tìm số tòa nhà (1-31) hoặc mã phòng (VD: U001, NM404)', ask: 'Tìm kiếm', map: 'Bản đồ tòa nhà 3D', all: 'Tất cả tòa nhà (1–31)', buildings: 'tòa nhà', selected: 'Tòa nhà đã chọn', details: 'Thông tin tòa nhà & phòng', floors: 'Danh mục phòng theo tầng', video: 'Xem trước lối đi', noInfo: 'Chưa có thông tin.', noVideo: 'Nhấn để bắt đầu dẫn đường theo hướng di chuyển', noFloors: 'Chưa có thông tin tiện ích theo tầng.', directions: 'Chỉ đường', from: 'Điểm đi', to: 'Điểm đến', chooseFrom: 'Chọn tòa nhà xuất phát hoặc Vị trí hiện tại', chooseTo: 'Chọn tòa nhà đích', current: 'Vị trí hiện tại', route: 'Xem đường đi & Dẫn đường', routeUnavailable: 'Chưa thể cung cấp tuyến đường.', routeSame: 'Hãy chọn điểm đi và điểm đến khác nhau.', stepFree: 'Ưu tiên đường dốc thoải (không bậc thang)', suggested: 'Bạn đang tìm?', popular: ['Thư viện Minseok', 'Tòa nhà New Millennium', 'Student Plaza'], count: 'Tòa nhà đã đăng ký', pin: 'Xem trên bản đồ', close: 'Đóng', noMatch: 'Không tìm thấy địa điểm hoặc mã phòng.', campusOnly: 'Chỉ hỗ trợ các tòa nhà đã đăng ký trong khuôn viên.', mapHint: 'Chọn số màu đỏ (1–31) hoặc tòa nhà 3D để xem mã phòng', locate: 'Vị trí của tôi', noLocation: 'Không thể truy cập GPS. Hãy chọn vị trí trên bản đồ khuôn viên.', guide: 'Hướng dẫn khuôn viên', routeMode: 'Tùy chọn đường dốc', minutes: 'Thời gian ước tính dựa trên độ cao và độ dốc thực tế.', askExample: 'Ví dụ: 13, U001, NM404, Thư viện Minseok', dataNote: 'Mô hình 3D màu sắc · Số 1–31', searchResults: 'Khám phá', clear: 'Xóa', floorLabel: 'Tầng', basement: 'Tầng hầm', roof: 'Sân thượng', coordinates: 'Tọa độ & Độ cao', mapLoading: 'Đang tải bản đồ', markerAlt: 'Vị trí tòa nhà', infoTitle: 'Dẫn đường theo góc nhìn', infoBody: 'Bản đồ tự động theo dõi bước đi của bạn.', registered: 'Đã kích hoạt mạng lưới đường dốc khuôn viên', noRouteTag: 'Chưa có dữ liệu đường đi', language: 'Ngôn ngữ', fallback: 'Tìm bằng từ khóa', noData: 'Đường dốc', footer: 'Hướng dẫn khuôn viên Đại học Dongseo',
  },
  lt: {
    eyebrow: 'DONGSEO UNIVERSITETAS · 3D PASTATŲ ŽEMĖLAPIS', title: 'Raskite auditoriją ir kelią\nuniversitete', subtitle: 'Pastatų numeriai (1–31) · Spalvoti 3D pastatų modeliai · Auditorijų kodai', search: 'Ieškokite pastato nr. (1-31) ar auditorijos (pvz. U001, NM404)', ask: 'Ieškoti', map: 'Universiteto 3D žemėlapis', all: 'Visi pastatai (1–31)', buildings: 'pastatai', selected: 'Pasirinktas pastatas', details: 'Pastato informacija', floors: 'Aukštų ir auditorijų katalogas', video: 'Maršruto peržiūra', noInfo: 'Informacija dar nepateikta.', noVideo: 'Spustelėkite maršruto sekimui pradėti', noFloors: 'Aukštų informacija dar nepateikta.', directions: 'Maršrutas', from: 'Iš', to: 'Į', chooseFrom: 'Pasirinkite pradžios pastatą', chooseTo: 'Pasirinkite paskirties pastatą', current: 'Dabartinė vieta', route: 'Rodyti maršrutą žemėlapyje', routeUnavailable: 'Maršrutas negalimas.', routeSame: 'Pasirinkite skirtingus pradžios ir paskirties taškus.', stepFree: 'Rinktis kelią be laiptų (pandusas)', suggested: 'Gal ieškote?', popular: ['Minseok biblioteka', 'New Millennium pastatas', 'Studentų aikštė'], count: 'Registruoti pastatai', pin: 'Rodyti žemėlapyje', close: 'Uždaryti', noMatch: 'Registruota vieta ar auditorija nerasta.', campusOnly: 'Pateikiama tik registruotų universiteto pastatų informacija.', mapHint: 'Pasirinkite raudoną numerį (1–31) arba 3D pastatą', locate: 'Mano vieta', noLocation: 'Vietos nustatyti nepavyko. Pasirinkite vietą žemėlapyje.', guide: 'Universiteto gidas', routeMode: 'Maršruto parinktys', minutes: 'Numatomas laikas pagal šlaitų ir aukščio duomenis.', askExample: 'Pvz.: 13, U001, NM404', dataNote: '3D pastatų modeliai · Numeriai 1–31', searchResults: 'Paieška', clear: 'Išvalyti', floorLabel: 'Aukštas', basement: 'Rūsys', roof: 'Stogas', coordinates: 'Koordinatės', mapLoading: 'Įkeliamas žemėlapis', markerAlt: 'Pastato vieta', infoTitle: 'Maršruto navigacija', infoBody: 'Žemėlapis seka jūsų judėjimo kryptį.', registered: 'Takų ir šlaitų tinklas aktyvus', noRouteTag: 'Maršruto duomenų nėra', language: 'Kalba', fallback: 'Paieška pagal raktažodį', noData: 'Pandusas', footer: 'Dongseo universiteto kampuso gidas',
  },
  hi: {
    eyebrow: 'डोंगसियो विश्वविद्यालय · 3D बिल्डिंग मैप गाइड', title: 'कैंपस में कमरा और\nरास्ता खोजें', subtitle: 'इमारत संख्या (1–31) · रंगीन 3D इमारत मॉडल · कमरा कोड (U001, NM101...)', search: 'इमारत संख्या (1-31) या कमरा कोड खोजें (जैसे U001, NM404)', ask: 'खोजें', map: '3D बिल्डिंग कैंपस नक्शा', all: 'सभी इमारतें (1–31)', buildings: 'इमारतें', selected: 'चुनी गई इमारत', details: 'इमारत और कमरे की जानकारी', floors: 'मंज़िल और कमरा कोड निर्देशिका', video: 'रास्ता देखें', noInfo: 'अभी कोई जानकारी नहीं जोड़ी गई है।', noVideo: 'मैप पर रास्ता अनुसरण शुरू करने के लिए क्लिक करें', noFloors: 'मंज़िल की सुविधा जानकारी अभी उपलब्ध नहीं है।', directions: 'रास्ता', from: 'यहाँ से', to: 'यहाँ तक', chooseFrom: 'शुरुआती इमारत या वर्तमान स्थान चुनें', chooseTo: 'गंतव्य इमारत चुनें', current: 'वर्तमान स्थान', route: 'रास्ता और नेविगेशन देखें', routeUnavailable: 'सुरक्षित रास्ता उपलब्ध नहीं है।', routeSame: 'अलग शुरुआती और गंतव्य स्थान चुनें।', stepFree: 'रैंप / कम सीढ़ियों वाला रास्ता', suggested: 'क्या आप यह खोज रहे हैं?', popular: ['मिनसोक पुस्तकालय', 'न्यू मिलेनियम भवन', 'स्टूडेंट प्लाज़ा'], count: 'सूचीबद्ध इमारतें', pin: 'नक्शे पर देखें', close: 'बंद करें', noMatch: 'सूची में जगह या कमरा कोड नहीं मिला।', campusOnly: 'यह सेवा केवल कैंपस की सूचीबद्ध इमारतों के लिए है।', mapHint: 'कमरा कोड देखने के लिए लाल नंबर (1–31) या 3D इमारत चुनें', locate: 'मेरा स्थान', noLocation: 'GPS उपलब्ध नहीं है। नक्शे पर अपना स्थान चुनें।', guide: 'कैंपस गाइड', routeMode: 'ढलान और रास्ते के विकल्प', minutes: 'अनुमानित समय कैंपस की ऊँचाई और ढलान डेटा पर आधारित है।', askExample: 'जैसे: 13, U001, NM404, मिनसोक पुस्तकालय', dataNote: 'रंगीन 3D इमारत मॉडल · नंबर 1–31', searchResults: 'खोज', clear: 'मिटाएँ', floorLabel: 'मंज़िल', basement: 'तहखाना', roof: 'छत', coordinates: 'निर्देशांक और ऊँचाई', mapLoading: 'नक्शा लोड हो रहा है', markerAlt: 'इमारत का स्थान', infoTitle: 'ढलान नेविगेशन', infoBody: 'नक्शा आपकी चलने की दिशा का अनुसरण करता है।', registered: 'कैंपस पैदल मार्ग और ढलान डेटा सक्रिय', noRouteTag: 'मार्ग डेटा उपलब्ध नहीं', language: 'भाषा', fallback: 'कीवर्ड खोज', noData: 'रैंप मार्ग', footer: 'डोंगसियो विश्वविद्यालय कैंपस गाइड',
  },
} satisfies Record<Language, Record<string, string | string[]>>

export type UiCopy = { [K in keyof typeof copy.ko]: (typeof copy.ko)[K] extends string[] ? string[] : string }

export const languageLabels: Record<Language, string> = { ko: '한국어', en: 'EN', zh: '中文', vi: 'VI', lt: 'LT', hi: 'HI' }
