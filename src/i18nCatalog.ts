import type { Building, FloorRoomItem, Language } from './data'

type BuildingLocaleEntry = {
  name: Record<Language, string>
  dept: Record<Language, string>
  visual: Record<Language, string>
}

export const BUILDING_I18N: Record<number, BuildingLocaleEntry> = {
  1: {
    name: {
      ko: '국제협력관',
      en: 'International Cooperation Bldg.',
      zh: '國際協力館',
      vi: 'Tòa nhà Hợp tác Quốc tế',
      lt: 'Tarptautinio bendradarbiavimo rūmai',
      hi: 'अंतर्राष्ट्रीय सहयोग भवन',
    },
    dept: {
      ko: '민석교양대학 · 일반대학원 · 부총장실 · 학생상담센터 · 동아시아학과',
      en: 'Minseok Liberal Arts · Graduate School · Student Counseling · East Asian Studies',
      zh: '民石教養大學 · 一般大學院 · 學生諮商中心 · 東亞學科',
      vi: 'Đại học Giáo양 Minseok · Cao học · Trung tâm Tư vấn · Đông Á học',
      lt: 'Humanitarinių mokslų kolegija · Magistrantūra · Konsultavimo centras',
      hi: 'मिनसोक लिबरल आर्ट्स · ग्रेजुएट स्कूल · छात्र परामर्श केंद्र',
    },
    visual: {
      ko: '반원형 아치 광장 우측의 9층 곡선형 유리·석재 복합 건물 (청색 지붕)',
      en: '9-story curved glass & stone building with a blue roof on the right side of the plaza',
      zh: '半圓形拱門廣場右側的9層曲線玻璃與石材建築（藍色屋頂）',
      vi: 'Tòa nhà 9 tầng mặt kính cong mái xanh bên phải quảng trường bán nguyệt',
      lt: '9 aukštų lenkto stiklo ir akmens pastatas mėlynu stogu aikštės dešinėje',
      hi: 'अर्धवृत्ताकार प्लाज़ा के दाईं ओर नीली छत वाली 9-मंज़िला घुमावदार इमारत',
    },
  },
  2: {
    name: {
      ko: '전자정보관',
      en: 'Electronics & Info. Bldg.',
      zh: '電子情報館',
      vi: 'Tòa nhà Điện tử & Thông tin',
      lt: 'Elektronikos ir informacijos rūmai',
      hi: 'इलेक्ट्रॉनिक्स और सूचना भवन',
    },
    dept: {
      ko: '기계소재융합공학 · 전자공학 · 정보통신 · 건축토목공학부',
      en: 'Mechanical & Materials · Electronics · Telecom · Architecture & Civil Eng.',
      zh: '機械素材融合 · 電子工學 · 情報通信 · 建築土木工學部',
      vi: 'Cơ khí Vật liệu · Kỹ thuật Điện tử · Viễn thông · Kiến trúc & Xây dựng',
      lt: 'Mechanikos, elektronikos, telekomunikacijų ir architektūros inžinerija',
      hi: 'मैकेनिकल · इलेक्ट्रॉनिक्स · टेलीकॉम · आर्किटेक्चर और सिविल इंजीनियरिंग',
    },
    visual: {
      ko: '운동장 위편 가로로 길게 뻗은 5층 블루 지붕 & 베이지·브라운 벽면 건물',
      en: 'Long 5-story horizontal building above the stadium with a blue roof & beige walls',
      zh: '運動場上方橫向延伸的5層藍色屋頂與米褐色外牆建築',
      vi: 'Tòa nhà 5 tầng trải dài phía trên sân vận động với mái xanh và tường màu be',
      lt: 'Ilgas 5 aukštų pastatas virš stadiono mėlynu stogu ir smėlio spalvos sienomis',
      hi: 'स्टेडियम के ऊपर नीली छत और बेज दीवारों वाली लंबी 5-मंज़िला इमारत',
    },
  },
  3: {
    name: {
      ko: '보건의료관 I',
      en: 'Health Sciences Bldg. I',
      zh: '保健醫療館 I',
      vi: 'Tòa nhà Y tế & Sức khỏe I',
      lt: 'Sveikatos mokslų rūmai I',
      hi: 'स्वास्थ्य विज्ञान भवन I',
    },
    dept: {
      ko: '간호학과 · 치위생학과 · 방사선학과 · 임상병리학과 · 작업치료학과',
      en: 'Nursing · Dental Hygiene · Radiology · Clinical Pathology · Occupational Therapy',
      zh: '護理學 · 牙科衛生 · 放射線 · 臨床病理 · 職能治療學科',
      vi: 'Điều dưỡng · Nha위생 · X-quang · Xét nghiệm Y học · Hoạt động trị liệu',
      lt: 'Slauga · Burnos higiena · Radiologija · Klinikinė patologija · Ergoterapija',
      hi: 'नर्सिंग · डेंटल हाइजीन · रेडियोलॉजी · क्लिनिकल पैथोलॉजी',
    },
    visual: {
      ko: '산자락 중턱의 깔끔한 6층 네이비 지붕 & 화이트 격자 창문 건물',
      en: '6-story hillside building with a navy roof and clean white grid windows',
      zh: '山腰處整潔的6層深藍屋頂與白色格柵窗建築',
      vi: 'Tòa nhà 6 tầng lưng chừng đồi với mái xanh đậm và cửa sổ ô trắng',
      lt: '6 aukštų pastatas ant šlaito tamsiai mėlynu stogu ir baltais langais',
      hi: 'पहाड़ी ढलान पर नेवी छत और सफेद खिड़कियों वाली 6-मंज़िला इमारत',
    },
  },
  4: {
    name: {
      ko: '응용공학관',
      en: 'Applied Engineering Bldg.',
      zh: '應用工學館',
      vi: 'Tòa nhà Kỹ thuật Ứng dụng',
      lt: 'Taikomosios inžinerijos rūmai',
      hi: 'एप्लाइड इंजीनियरिंग भवन',
    },
    dept: {
      ko: '생명화학공학부 · 식품영양학과 · 바이오제약공학 · 보건행정학과',
      en: 'Biochemical Eng. · Food & Nutrition · Biopharma · Health Administration',
      zh: '生命化學工學 · 食品營養 · 生物製藥 · 保健行政學科',
      vi: 'Kỹ thuật Hóa sinh · Thực phẩm & Dinh dưỡng · Dược sinh học · Quản trị Y tế',
      lt: 'Biochemijos inžinerija · Maisto ir mitybos mokslai · Biofarmacija',
      hi: 'बायोकेमिकल इंजीनियरिंग · खाद्य एवं पोषण · बायोफार्मा · स्वास्थ्य प्रशासन',
    },
    visual: {
      ko: '보건의료관 옆 나란히 배치된 6층 블루 지붕 공학 실습동',
      en: '6-story engineering lab building with a blue roof next to Health Sciences Bldg.',
      zh: '保健醫療館旁並排配置的6層藍色屋頂工學實習棟',
      vi: 'Tòa thực hành kỹ thuật 6 tầng mái xanh nằm cạnh Tòa Y tế',
      lt: '6 aukštų inžinerijos laboratorijų pastatas mėlynu stogu šalia Sveikatos rūmų',
      hi: 'स्वास्थ्य विज्ञान भवन के बगल में नीली छत वाली 6-मंज़िला इंजीनियरिंग इमारत',
    },
  },
  5: {
    name: {
      ko: '산학협력관',
      en: 'Industry-Academic Coop. Bldg.',
      zh: '產學協力館',
      vi: 'Tòa nhà Hợp tác Công-Học',
      lt: 'Verslo ir mokslo bendradarbiavimo rūmai',
      hi: 'उद्योग-अकादमिक सहयोग भवन',
    },
    dept: {
      ko: '산학협력단 · 창업보육센터 · LINC3.0 사업단 · 기업부설연구소',
      en: 'Industry-University Cooperation · Startup Incubator · LINC 3.0 · R&D Labs',
      zh: '產學協力團 · 創業保育中心 · LINC3.0事業團 · 企業研究所',
      vi: 'Khối Hợp tác Công-Học · Vườn ươm Khởi nghiệp · Trung tâm Nghiên cứu R&D',
      lt: 'Verslo inkubatorius · Mokslinių tyrimų ir inovacijų centras',
      hi: 'उद्योग-विश्वविद्यालय सहयोग · स्टार्टअप इनक्यूबेटर · अनुसंधान केंद्र',
    },
    visual: {
      ko: '디자인홀 앞쪽의 6층 진청색 지붕 & 밝은 회백색 현대식 산학 연구동',
      en: 'Modern 6-story light-gray R&D building with a deep blue roof in front of Design Hall',
      zh: '設計館前方的6層深藍屋頂與淺灰白色現代產學研究棟',
      vi: 'Tòa nghiên cứu 6 tầng hiện đại màu xám sáng mái xanh đậm trước Design Hall',
      lt: 'Modernus 6 aukštų šviesiai pilkas pastatas tamsiai mėlynu stogu priešais Dizaino rūmus',
      hi: 'डिज़ाइन हॉल के सामने गहरी नीली छत वाली 6-मंज़िला आधुनिक अनुसंधान इमारत',
    },
  },
  6: {
    name: {
      ko: '어문관',
      en: 'Foreign Languages Bldg.',
      zh: '語文館',
      vi: 'Tòa nhà Ngoại ngữ',
      lt: 'Užsienio kalbų rūmai',
      hi: 'विदेशी भाषा भवन',
    },
    dept: {
      ko: '영어학과 · 일본어학과 · 중국어학과 · 외국어교육원 · 통번역실습실',
      en: 'English · Japanese · Chinese Studies · Foreign Language Institute · Interpretation Labs',
      zh: '英語學科 · 日語學科 · 中國語學科 · 外國語教育院 · 口筆譯實習室',
      vi: 'Khoa Tiếng Anh · Tiếng Nhật · Tiếng Trung · Viện Ngoại ngữ · Phòng dịch thuật',
      lt: 'Anglų, japonų, kinų kalbų katedros · Vertimo laboratorijos',
      hi: 'अंग्रेजी · जापानी · चीनी भाषा विभाग · विदेशी भाषा संस्थान',
    },
    visual: {
      ko: '국제협력관과 마주보는 반원형 곡선 파사드의 7층 어문 교육관',
      en: '7-story curved facade building facing the International Cooperation Building',
      zh: '與國際協力館相對的半圓弧形立面7層語文教育館',
      vi: 'Tòa nhà 7 tầng mặt tiền cong đối diện Tòa Hợp tác Quốc tế',
      lt: '7 aukštų lenkto fasado pastatas priešais Tarptautinio bendradarbiavimo rūmus',
      hi: 'अंतर्राष्ट्रीय सहयोग भवन के सामने घुमावदार अग्रभाग वाली 7-मंज़िला इमारत',
    },
  },
  7: {
    name: {
      ko: '국제관',
      en: 'International Studies Bldg.',
      zh: '國際館',
      vi: 'Tòa nhà Quốc tế',
      lt: 'Tarptautinių studijų rūmai',
      hi: 'अंतर्राष्ट्रीय अध्ययन भवन',
    },
    dept: {
      ko: '국제물류학과 · 국제통상학과 · 관광학부 · 호텔경영 · 이벤트컨벤션',
      en: 'International Logistics · Global Trade · Tourism · Hotel & Event Management',
      zh: '國際物流 · 國際通商 · 觀光學部 · 飯店經營 · 會展管理',
      vi: 'Logistics Quốc tế · Thương mại · Du lịch · Quản trị Khách sạn & Sự kiện',
      lt: 'Tarptautinė logistika · Prekyba · Turizmo ir viešbučių vadyba',
      hi: 'अंतर्राष्ट्रीय लॉजिस्टिक्स · व्यापार · पर्यटन और होटल प्रबंधन',
    },
    visual: {
      ko: '스튜던트 플라자 뒤편 좌측의 7층 화이트·블루 루프 건물',
      en: '7-story white building with a blue roof behind the left wing of Student Plaza',
      zh: '學生廣場後方左側的7層白牆藍頂建築',
      vi: 'Tòa nhà 7 tầng tường trắng mái xanh phía sau bên trái Student Plaza',
      lt: '7 aukštų baltas pastatas mėlynu stogu už Studentų aikštės kairiojo sparno',
      hi: 'स्टूडेंट प्लाज़ा के पीछे बाईं ओर नीली छत वाली 7-मंज़िला सफेद इमारत',
    },
  },
  8: {
    name: {
      ko: '경영관',
      en: 'Business Administration Bldg.',
      zh: '經營館',
      vi: 'Tòa nhà Quản trị Kinh doanh',
      lt: 'Verslo administravimo rūmai',
      hi: 'व्यवसाय प्रशासन भवन',
    },
    dept: {
      ko: '경영학부 · 회계세무학과 · 경찰행정학과 · 사회복지학부 · 아동청소년학과',
      en: 'Business Admin. · Accounting & Tax · Police Admin. · Social Welfare · Youth Studies',
      zh: '經營學部 · 會計稅務 · 警察行政 · 社會福祉 · 兒童青少年學科',
      vi: 'Quản trị Kinh doanh · Kế toán Thuế · Hành chính Cảnh sát · Phúc lợi Xã hội',
      lt: 'Verslo vadyba · Apskaita · Viešasis administravimas · Socialinis darbas',
      hi: 'बिजनेस एडमिनिस्ट्रेशन · अकाउंटिंग · पुलिस प्रशासन · समाज कल्याण',
    },
    visual: {
      ko: '스튜던트 플라자 뒤편 우측의 8층 깔끔한 직사각형 경영관',
      en: 'Clean rectangular 8-story business hall behind the right wing of Student Plaza',
      zh: '學生廣場後方右側的8層方正經營館建築',
      vi: 'Tòa nhà 8 tầng hình chữ nhật phía sau bên phải Student Plaza',
      lt: '8 aukštų stačiakampis verslo fakulteto pastatas dešinėje pusėje',
      hi: 'स्टूडेंट प्लाज़ा के पीछे दाईं ओर 8-मंज़िला आयताकार प्रबंधन भवन',
    },
  },
  9: {
    name: {
      ko: '디자인홀',
      en: 'Design Hall',
      zh: '設計館 (Design Hall)',
      vi: 'Tòa nhà Thiết kế (Design Hall)',
      lt: 'Dizaino rūmai (Design Hall)',
      hi: 'डिज़ाइन हॉल (Design Hall)',
    },
    dept: {
      ko: '디자인대학 · 시각디자인 · 디지털미디어 · 제품인터랙션 · 환경디자인 · 패션디자인',
      en: 'College of Design · Visual · Digital Media · Product · Environmental · Fashion Design',
      zh: '設計大學 · 視覺設計 · 數位媒體 · 產品互動 · 環境設計 · 時裝設計',
      vi: 'Đại học Thiết kế · Thiết kế Đồ họa · Truyền thông Số · Sản phẩm · Thời trang',
      lt: 'Dizaino kolegija · Vizualinis, skaitmeninės medijos, produkto ir mados dizainas',
      hi: 'डिज़ाइन कॉलेज · विजुअल · डिजिटल मीडिया · प्रोडक्ट · फैशन डिज़ाइन',
    },
    visual: {
      ko: '강렬한 레드(빨강) & 화이트 외벽 포인트가 돋보이는 8층 대형 디자인 건물',
      en: 'Large 8-story modern building featuring striking red & white vertical facade accents',
      zh: '醒目紅白相間立面設計的8層大型設計大樓',
      vi: 'Tòa nhà thiết kế 8 tầng nổi bật với điểm nhấn mặt tiền màu đỏ và trắng',
      lt: '8 aukštų dizaino pastatas su ryškiais raudonais ir baltais fasado akcentais',
      hi: 'आकर्षक लाल और सफेद बाहरी दीवारों वाली 8-मंज़िला विशाल डिज़ाइन इमारत',
    },
  },
  10: {
    name: {
      ko: '그린홀',
      en: 'Green Hall',
      zh: '綠館 (Green Hall)',
      vi: 'Tòa nhà Green Hall',
      lt: 'Žalieji rūmai (Green Hall)',
      hi: 'ग्रीन हॉल (Green Hall)',
    },
    dept: {
      ko: '건축설계실습실 · 조경·환경설계 스튜디오 · 종합설계실',
      en: 'Architectural Design Studios · Landscape & Environmental Design Labs',
      zh: '建築設計實習室 · 景觀與環境設計工作室 · 綜合設計室',
      vi: 'Xưởng Thiết kế Kiến trúc · Studio Cảnh quan & Môi trường',
      lt: 'Architektūros ir kraštovaizdžio projektavimo studijos',
      hi: 'आर्किटेक्चरल डिज़ाइन स्टूडियो · पर्यावरण डिज़ाइन प्रयोगशाला',
    },
    visual: {
      ko: '초록색 박공 지붕과 연두빛 외벽이 특징인 친환경 4층 그린홀',
      en: '4-story eco-styled building with a green pitched roof and light-green walls',
      zh: '綠色斜屋頂與淺綠外牆為特色的4層綠館',
      vi: 'Tòa nhà 4 tầng với mái dốc màu xanh lá cây đặc trưng',
      lt: '4 aukštų pastatas žaliu šlaitiniu stogu ir šviesiai žaliomis sienomis',
      hi: 'हरी ढलान वाली छत और हल्के हरे रंग की दीवारों वाली 4-मंज़िला इमारत',
    },
  },
  11: {
    name: {
      ko: '드림e밸리',
      en: 'Dream e-Valley',
      zh: 'Dream e-Valley 創業館',
      vi: 'Dream e-Valley (Khu Khởi nghiệp)',
      lt: 'Dream e-Valley inovacijų centras',
      hi: 'ड्रीम ई-वैली (Dream e-Valley)',
    },
    dept: {
      ko: '학생 창업 스튜디오 · 캡스톤디자인 공방 · 메이커 워크숍',
      en: 'Student Startup Studios · Capstone Design Workshop · Maker Spaces',
      zh: '學生創業工作室 · 頂石設計工坊 · 創客空間',
      vi: 'Studio Khởi nghiệp Sinh viên · Xưởng Capstone Design · Không gian Sáng tạo',
      lt: 'Studentų startuolių studijos · Kūrybinės dirbtuvės',
      hi: 'छात्र स्टार्टअप स्टूडियो · कैपस्टोन डिज़ाइन कार्यशाला',
    },
    visual: {
      ko: '언덕길 가로변을 따라 아치형 캐노피가 연속된 2층 창업·지원 공간',
      en: '2-story hillside complex with continuous arched canopies along the road',
      zh: '沿山坡道路排列連續拱形雨棚的2層創業支援空間',
      vi: 'Khu nhà 2 tầng dọc đường đồi với mái vòm liên tiếp',
      lt: '2 aukštų kompleksas su arkiniais stogeliais palei kalvos kelią',
      hi: 'पहाड़ी सड़क के किनारे मेहराबदार छतरियों वाली 2-मंज़िला स्टार्टअप इमारत',
    },
  },
  12: {
    name: {
      ko: '국제생활관 1',
      en: 'International Dormitory 1',
      zh: '國際生活館 1 (第一宿舍)',
      vi: 'Ký túc xá Quốc tế 1',
      lt: 'Tarptautinis bendrabutis Nr. 1',
      hi: 'अंतर्राष्ट्रीय छात्रावास 1',
    },
    dept: {
      ko: '학부 및 외국인 유학생 생활관 · 글로벌 라운지 · 체력단련실',
      en: 'Student & International Residence Hall 1 · Global Lounge · Fitness Room',
      zh: '本科與外國留學生生活館 · 國際交誼廳 · 健身房',
      vi: 'Ký túc xá Sinh viên & Lưu học sinh 1 · Phòng sinh hoạt chung · Phòng tập gym',
      lt: 'Studentų bendrabutis · Bendroji poilsio erdvė · Sporto salė',
      hi: 'छात्र एवं अंतर्राष्ट्रीय छात्रावास 1 · ग्लोबल लाउंज · फिटनेस रूम',
    },
    visual: {
      ko: '캠퍼스 최상단 언덕 위 황금빛 베이지 곡선 외벽과 초록 지붕의 7층 기숙사',
      en: '7-story residence hall at the top of the hill with curved golden-beige walls & green roof',
      zh: '校園最高處山丘上金色米黃弧形外牆與綠頂的7層宿舍',
      vi: 'Ký túc xá 7 tầng trên đỉnh đồi với tường cong màu vàng be và mái xanh',
      lt: '7 aukštų bendrabutis ant kalvos viršūnės lenktomis auksinėmis sienomis',
      hi: 'पहाड़ी की चोटी पर सुनहरे-बेज घुमावदार अग्रभाग वाला 7-मंज़िला छात्रावास',
    },
  },
  13: {
    name: {
      ko: '뉴밀레니엄관',
      en: 'New Millennium Hall',
      zh: '新千禧館 (New Millennium Hall)',
      vi: 'Tòa nhà New Millennium',
      lt: 'Naujasis Tūkstantmečio pastatas (NM)',
      hi: 'न्यू मिलेनियम हॉल (NM)',
    },
    dept: {
      ko: '대학본부(총장실) · 임권택영화예술대학 · 디지털콘텐츠학부 · 소향아트홀 · 스튜디오',
      en: 'Main Admin · Im Kwon-taek Film & Arts · Digital Contents · Sohyang Art Hall',
      zh: '大學本部 · 林權澤電影藝術大學 · 數位內容學部 · 素香藝術廳',
      vi: 'Hiệu bộ · Đại học Điện ảnh & Nghệ thuật Im Kwon-taek · Nội dung Số · Sohyang Art Hall',
      lt: 'Rektoratas · Kino ir menų kolegija · Skaitmeninio turinio fakultetas · Meno salė',
      hi: 'मुख्य प्रशासन · फिल्म एवं कला कॉलेज · डिजिटल कंटेंट · सोहयांग आर्ट हॉल',
    },
    visual: {
      ko: '4층 석재 기단(포디엄) 위에 15층 푸른 통유리 타워가 솟은 동서대 대표 랜드마크',
      en: 'Flagship landmark with a 15-story blue glass high-rise tower above a 4-story stone podium',
      zh: '4層石材基座之上聳立15層藍色玻璃帷幕高塔的東西大代表地標',
      vi: 'Tòa tháp kính xanh 15 tầng nổi bật trên khối đế 4 tầng - biểu tượng của trường',
      lt: '15 aukštų mėlyno stiklo bokštas ant 4 aukštų podiumo – universiteto simbolis',
      hi: '4-मंज़िला पोडियम के ऊपर 15-मंज़िला नीले कांच का टॉवर - विश्वविद्यालय का मुख्य लैंडमार्क',
    },
  },
  14: {
    name: {
      ko: 'U-IT관',
      en: 'U-IT Building',
      zh: 'U-IT館 (資訊科技館)',
      vi: 'Tòa nhà U-IT (Công nghệ Thông tin)',
      lt: 'U-IT informacinių technologijų rūmai',
      hi: 'यू-आईटी भवन (U-IT Building)',
    },
    dept: {
      ko: '소프트웨어융합대학 · 컴퓨터공학과 · 인공지능응용 · 정보보안 · 전산정보원',
      en: 'College of SW Convergence · Computer Eng. · AI Applications · Cyber Security',
      zh: '軟體融合大學 · 電腦工學 · 人工智慧應用 · 資訊安全 · 電算情報院',
      vi: 'Đại học Phần mềm · Kỹ thuật Máy tính · Trí tuệ Nhân tạo (AI) · An toàn Thông tin',
      lt: 'Programinės įrangos kolegija · Kompiuterių inžinerija · Dirbtinis intelektas · Kibernetinis saugumas',
      hi: 'सॉफ्टवेयर कॉलेज · कंप्यूटर इंजीनियरिंग · आर्टिफिशियल इंटेलिजेंस · साइबर सुरक्षा',
    },
    visual: {
      ko: '뉴밀레니엄관 아래쪽 9층 규모의 스카이블루 루프 & 화이트 IT 건물',
      en: '9-story white IT building with a sky-blue roof just below New Millennium Hall',
      zh: '新千禧館下方9層規模的天藍屋頂與白色IT大樓',
      vi: 'Tòa nhà CNTT 9 tầng màu trắng mái xanh da trời ngay dưới New Millennium Hall',
      lt: '9 aukštų baltas IT pastatas žydru stogu žemiau Naujojo Tūkstantmečio rūmų',
      hi: 'न्यू मिलेनियम हॉल के नीचे आसमानी नीली छत वाली 9-मंज़िला सफेद आईटी इमारत',
    },
  },
  15: {
    name: {
      ko: '바이오헬스관',
      en: 'Bio-Health Building',
      zh: '生物健康館 (Bio-Health)',
      vi: 'Tòa nhà Bio-Health',
      lt: 'Bio-sveikatos mokslų rūmai',
      hi: 'बायो-हेल्थ भवन (Bio-Health)',
    },
    dept: {
      ko: '바이오헬스융합 연구실 · 임상시뮬레이션센터 · 실험동물실',
      en: 'Bio-Health Convergence Labs · Clinical Simulation Center',
      zh: '生物健康融合研究室 · 臨床模擬中心',
      vi: 'Phòng thí nghiệm Hội tụ Y sinh · Trung tâm Mô phỏng Lâm sàng',
      lt: 'Biomedicinos tyrimų laboratorijos · Klinikinės simuliacijos centras',
      hi: 'बायो-हेल्थ प्रयोगशाला · क्लिनिकल सिमुलेशन सेंटर',
    },
    visual: {
      ko: '상단 숲속에 위치한 붉은 벽돌빛 지붕과 따뜻한 베이지 외벽의 5층 건물',
      en: '5-story upper hillside building with a brick-red roof and warm beige walls',
      zh: '位於上方林間的紅磚色屋頂與暖米色外牆5層建築',
      vi: 'Tòa nhà 5 tầng giữa rừng cây phía trên với mái đỏ gạch và tường màu be',
      lt: '5 aukštų pastatas viršutinėje kalvos dalyje raudonu stogu ir rusvomis sienomis',
      hi: 'ऊपरी वन क्षेत्र में ईंट-लाल छत और बेज दीवारों वाली 5-मंज़िला इमारत',
    },
  },
  16: {
    name: {
      ko: '학생문화관 (문화센터)',
      en: 'Student Culture Center',
      zh: '學生文化館 (文化中心)',
      vi: 'Trung tâm Văn hóa Sinh viên',
      lt: 'Studentų kultūros centras',
      hi: 'छात्र संस्कृति केंद्र',
    },
    dept: {
      ko: '학생복지시설 · 보건진료소 · 우체국 · 은행(ATM) · 학생식당 · 세미나실',
      en: 'Student Welfare · Health Clinic · Post Office · Bank/ATM · Cafeteria · Seminar Rooms',
      zh: '學生福利設施 · 保健診療所 · 郵局 · 銀行ATM · 學生餐廳 · 研討室',
      vi: 'Phúc lợi Sinh viên · Phòng Y tế · Bưu điện · Ngân hàng/ATM · Nhà ăn',
      lt: 'Studentų gerovės centras · Medicinos punktas · Paštas · Bankomatas · Valgykla',
      hi: 'छात्र कल्याण · स्वास्थ्य क्लिनिक · डाकघर · एटीएम · कैफेटेरिया',
    },
    visual: {
      ko: '전면 대형 유리 커튼월과 청록색 루프가 돋보이는 6층 학생문화관',
      en: '6-story culture center with a large front glass curtain wall and teal roof',
      zh: '正面大型玻璃帷幕與青綠色屋頂的6層學生文化館',
      vi: 'Tòa nhà 6 tầng với mặt kính lớn phía trước và mái màu xanh ngọc',
      lt: '6 aukštų kultūros centras su dideliu stikliniu fasadu ir žalsvai mėlynu stogu',
      hi: 'बड़े कांच के अग्रभाग और टील छत वाला 6-मंज़िला छात्र संस्कृति केंद्र',
    },
  },
  17: {
    name: {
      ko: '민석스포츠센터',
      en: 'Minseok Sports Center',
      zh: '民石體育中心',
      vi: 'Trung tâm Thể thao Minseok',
      lt: 'Minseok sporto centras',
      hi: 'मिनसोक स्पोर्ट्स सेंटर',
    },
    dept: {
      ko: '체육학과 · 레저스포츠 · 실내체육관(농구/배구) · 피트니스센터 · 스쿼시장',
      en: 'Physical Education · Leisure Sports · Indoor Gymnasium · Fitness & Squash Courts',
      zh: '體育學科 · 休閒運動 · 室內體育館 · 健身中心 · 壁球場',
      vi: 'Khoa Giáo dục Thể chất · Nhà thi đấu Đa năng · Phòng Gym & Sân Squash',
      lt: 'Kūno kultūros katedra · Vidaus sporto arena · Treniruoklių ir skvošo salės',
      hi: 'शारीरिक शिक्षा विभाग · इनडोर स्टेडियम · फिटनेस और स्क्वैश कोर्ट',
    },
    visual: {
      ko: '붉은 아치형 지붕과 파란 곡선 유리 정면부를 가진 5층 대형 스포츠센터',
      en: '5-story sports arena with a terracotta arched roof and curved blue glass front',
      zh: '紅褐色拱形屋頂與藍色弧形玻璃正面的5層大型體育中心',
      vi: 'Trung tâm thể thao 5 tầng với mái vòm đỏ cam và mặt kính xanh uốn cong',
      lt: '5 aukštų sporto kompleksas su arkiniu stogu ir mėlyno stiklo fasadu',
      hi: 'लाल मेहराबदार छत और नीले घुमावदार कांच के अग्रभाग वाला 5-मंज़िला स्पोर्ट्स सेंटर',
    },
  },
  18: {
    name: {
      ko: '대학교회',
      en: 'University Chapel',
      zh: '大學教會 (禮拜堂)',
      vi: 'Nhà thờ Đại học (Chapel)',
      lt: 'Universiteto koplyčia',
      hi: 'विश्वविद्यालय चैपल (चर्च)',
    },
    dept: {
      ko: '교목실 · 대예배실(채플홀) · 소예배실 · 합창연습실 · 기독교상담실',
      en: 'Chaplaincy Office · Main Chapel Hall · Choir Room · Pastoral Counseling',
      zh: '校牧室 · 大禮拜堂(Chapel) · 小禮拜室 · 合唱練習室',
      vi: 'Văn phòng Mục vụ · Hội trường Lễ배 (Chapel Hall) · Phòng Hợp xướng',
      lt: 'Kapeliono biuras · Pagrindinė koplyčios salė · Choro studija',
      hi: 'चैपलिन कार्यालय · मुख्य चैपल हॉल · प्रार्थना एवं संगीत कक्ष',
    },
    visual: {
      ko: '붉은 테라코타 원형 돔 지붕과 십자가가 한눈에 보이는 원통형 대학교회',
      en: 'Cylindrical chapel building crowned with a red terracotta circular dome and cross',
      zh: '醒目紅陶圓形穹頂與十字架的圓柱形大學教會',
      vi: 'Tòa nhà hình trụ với mái vòm tròn màu đỏ gạch và cây thánh giá trên đỉnh',
      lt: 'Cilindro formos koplyčia su raudonu kupolu ir kryžiumi viršuje',
      hi: 'लाल गुंबद और क्रॉस के साथ गोलाकार विश्वविद्यालय चैपल इमारत',
    },
  },
  19: {
    name: {
      ko: '학생생활아파트',
      en: 'Student Residence Apartments',
      zh: '學生生活公寓',
      vi: 'Chung cư Ký túc xá Sinh viên',
      lt: 'Studentų gyvenamieji apartamentai',
      hi: 'छात्र आवासीय अपार्टमेंट',
    },
    dept: {
      ko: '학생 기숙사 아파트동 (A·B·C동) · 자치생활실 · 세탁실',
      en: 'Student Dormitory Apartment Blocks (A, B, C) · Laundry & Common Rooms',
      zh: '學生宿舍公寓棟 (A·B·C棟) · 自治生活室 · 洗衣房',
      vi: 'Khu Căn hộ Ký túc xá (Tòa A, B, C) · Phòng giặt & Sinh hoạt',
      lt: 'Studentų bendrabučio korpusai (A, B, C) · Savitarnos skalbykla',
      hi: 'छात्र छात्रावास अपार्टमेंट ब्लॉक (A, B, C) · लॉन्ड्री और कॉमन रूम',
    },
    visual: {
      ko: '정문 아래쪽 나란히 배치된 5층 화이트·민트 지붕 학생생활아파트 단지',
      en: 'Row of 5-story white apartment blocks with mint-green roofs near the lower gate',
      zh: '正門下方並排配置的5層白牆薄荷綠頂學生公寓群',
      vi: 'Cụm tòa nhà căn hộ 5 tầng tường trắng mái xanh bạc hà gần cổng dưới',
      lt: '5 aukštų baltų apartamentų korpusai mėtų spalvos stogais prie apatinių vartų',
      hi: 'मुख्य द्वार के नीचे पुदीना-हरी छत वाले 5-मंज़िला सफेद अपार्टमेंट ब्लॉक',
    },
  },
  20: {
    name: {
      ko: '국제생활관 2',
      en: 'International Dormitory 2',
      zh: '國際生活館 2 (第二宿舍)',
      vi: 'Ký túc xá Quốc tế 2',
      lt: 'Tarptautinis bendrabutis Nr. 2',
      hi: 'अंतर्राष्ट्रीय छात्रावास 2',
    },
    dept: {
      ko: '제2기숙사 · 유학생 및 재학생 생활관 · 글로벌 스터디룸 · 택배보관실',
      en: 'Residence Hall 2 · Study Lounge · Parcel Room · Student Housing Office',
      zh: '第二宿舍 · 留學生與在校生生活館 · 自習室 · 快遞室',
      vi: 'Ký túc xá số 2 · Phòng tự học · Phòng nhận bưu kiện',
      lt: '2-asis studentų bendrabutis · Mokymosi kambariai · Siuntų skyrius',
      hi: 'छात्रावास संख्या 2 · अध्ययन कक्ष · पार्सल कक्ष',
    },
    visual: {
      ko: '붉은 벽돌색 외벽과 갈색 지붕의 10층 고층 국제생활관 제2동',
      en: '10-story high-rise dormitory building with brick-brown walls and roof',
      zh: '紅磚色外牆與棕色屋頂的10層高層國際生活館二棟',
      vi: 'Tòa ký túc xá cao 10 tầng với tường màu gạch đỏ và mái nâu',
      lt: '10 aukštų raudonų plytų spalvos bendrabučio pastatas',
      hi: 'ईंट-भूरे रंग की दीवारों और छत वाली 10-मंज़िला ऊंची छात्रावास इमारत',
    },
  },
  21: {
    name: {
      ko: '민석도서관',
      en: 'Minseok Library',
      zh: '民石圖書館',
      vi: 'Thư viện Minseok',
      lt: 'Minseok biblioteka',
      hi: 'मिनसोक पुस्तकालय (Minseok Library)',
    },
    dept: {
      ko: '중앙도서관 · 종합자료실 · 창의학습커먼스 · 열람실 · 멀티미디어존 · 북카페',
      en: 'Central Library · Reading Rooms · Learning Commons · Multimedia Zone · Book Cafe',
      zh: '中央圖書館 · 綜合資料室 · 創客學習區 · 閱覽室 · 多媒體區 · 書香咖啡',
      vi: 'Thư viện Trung tâm · Phòng đọc · Không gian Học tập Sáng tạo · Multimedia · Book Cafe',
      lt: 'Centrinė biblioteka · Skaityklos · Multimedijos erdvė · Knygų kavinė',
      hi: 'केंद्रीय पुस्तकालय · अध्ययन कक्ष · मल्टीमीडिया ज़ोन · बुक कैफे',
    },
    visual: {
      ko: '비상하는 날개형 지붕과 대형 푸른 통유리창이 인상적인 6층 민석도서관',
      en: 'Iconic 6-story library featuring a soaring winged roof and panoramic blue glass facade',
      zh: '展翅造型屋頂與大型藍色落地玻璃窗令人印象深刻的6層民石圖書館',
      vi: 'Thư viện 6 tầng ấn tượng với mái hình cánh chim bay và mặt kính xanh lớn',
      lt: '6 aukštų biblioteka su sparnų formos stogu ir mėlyno stiklo fasadu',
      hi: 'पंख के आकार की छत और नीले कांच के विशाल अग्रभाग वाला 6-मंज़िला पुस्तकालय',
    },
  },
  22: {
    name: {
      ko: '한국어교육원',
      en: 'Korean Language Institute',
      zh: '韓國語教育院',
      vi: 'Viện Đào tạo Tiếng Hàn',
      lt: 'Korėjiečių kalbos institutas',
      hi: 'कोरियन भाषा संस्थान',
    },
    dept: {
      ko: '한국어학당 강의실 · 한국문화체험실 · 유학생 한국어교육 행정실',
      en: 'Korean Language Classrooms · Cultural Experience Room · KLI Admin Office',
      zh: '韓國語學堂教室 · 韓國文化體驗室 · 留學生韓語教育行政室',
      vi: 'Phòng học Tiếng Hàn · Phòng Trải nghiệm Văn hóa Hàn Quốc · Văn phòng Viện Tiếng Hàn',
      lt: 'Korėjiečių kalbos auditorijos · Kultūros pažinimo kambarys · Administracija',
      hi: 'कोरियन भाषा कक्षाएं · सांस्कृतिक अनुभव कक्ष · प्रशासन कार्यालय',
    },
    visual: {
      ko: '따뜻한 테라코타·오렌지 외벽의 아담한 4층 한국어교육원 건물',
      en: 'Compact 4-story building with warm terracotta-orange walls near the lower campus',
      zh: '溫暖陶土橙色外牆的精緻4層韓國語教育院建築',
      vi: 'Tòa nhà 4 tầng nhỏ gọn với tường màu cam đất ấm áp',
      lt: 'Kompaktiškas 4 aukštų šiltos terakotos spalvos pastatas',
      hi: 'गर्म टेराकोटा-नारंगी दीवारों वाली 4-मंज़िला कोरियन भाषा संस्थान इमारत',
    },
  },
  23: {
    name: {
      ko: '글로벌빌리지',
      en: 'Global Village',
      zh: '全球村 (Global Village)',
      vi: 'Làng Quốc tế (Global Village)',
      lt: 'Global Village kompleksas',
      hi: 'ग्लोबल विलेज (Global Village)',
    },
    dept: {
      ko: '글로벌 기숙사 타워(남·여동) · 수영장 · 피트니스 · 글로벌 잉글리시 존 · 식당',
      en: 'Global Residence Twin Towers · Swimming Pool · Fitness · Global Lounge · Dining Hall',
      zh: '全球村雙子塔宿舍 · 室內游泳池 · 健身房 · 英語交流區 · 餐廳',
      vi: 'Tháp đôi Ký túc xá Global Village · Hồ bơi · Phòng Gym · Khu Giao류 Quốc tế',
      lt: 'Dviejų bokštų bendrabutis · Baseinas · Sporto salė · Valgykla',
      hi: 'ग्लोबल रेजिडेंस ट्विन टॉवर · स्विमिंग पूल · फिटनेस · डाइनिंग हॉल',
    },
    visual: {
      ko: '동일한 형태의 12층 현대식 트윈 타워(쌍둥이 고층 동)로 이루어진 글로벌빌리지',
      en: 'Modern 12-story Twin Towers standing side-by-side at the lower-west entrance',
      zh: '由兩棟相同造型的12層現代雙子高塔組成的全球村大樓',
      vi: 'Cụm tháp đôi 12 tầng hiện đại nằm cạnh nhau ngay lối vào phía tây',
      lt: 'Du vienodi modernūs 12 aukštų bokštai dvyniai',
      hi: 'एक जैसे दिखने वाले दो आधुनिक 12-मंज़िला ट्विन टॉवर',
    },
  },
  24: {
    name: {
      ko: '스튜던트 플라자 (종합운동장)',
      en: 'Student Plaza & Main Stadium',
      zh: '學生廣場 (綜合運動場)',
      vi: 'Student Plaza (Sân vận động)',
      lt: 'Studentų aikštė ir centrinis stadionas',
      hi: 'स्टूडेंट प्लाज़ा (मुख्य स्टेडियम)',
    },
    dept: {
      ko: '종합운동장(축구장/육상트랙) · 학생식당(푸드코트) · 입학처 · 취업지원처 · 동아리방',
      en: 'Main Soccer Stadium & Track · Student Food Court · Admissions · Career Center · Clubs',
      zh: '綜合運動場(足球場/跑道) · 學生餐廳美食街 · 入學處 · 就業支援處 · 社團室',
      vi: 'Sân vận động chính · Khu Ẩm thực Sinh viên (Food Court) · Phòng Tuyển sinh · CLB',
      lt: 'Futbolo stadionas ir bėgimo takas · Maisto kiemelis · Priėmimo skyrius · Klubai',
      hi: 'मुख्य फुटबॉल स्टेडियम और ट्रैक · स्टूडेंट फूड कोर्ट · प्रवेश एवं करियर केंद्र',
    },
    visual: {
      ko: '푸른 인조잔디 축구장과 400m 붉은 육상 트랙, 관람석 스탠드를 갖춘 종합운동장',
      en: 'Green artificial-turf soccer field surrounded by a 400m red running track and grandstands',
      zh: '擁有翠綠人工草皮足球場、400公尺紅色跑道與看台的大型綜合運動場',
      vi: 'Sân bóng cỏ nhân tạo xanh mướt bao quanh bởi đường chạy đỏ 400m và khán đài',
      lt: 'Žalia futbolo aikštė su 400 m raudonu bėgimo taku ir tribūnomis',
      hi: 'हरे फुटबॉल मैदान और 400 मीटर लाल रनिंग ट्रैक वाला विशाल स्टेडियम',
    },
  },
  25: {
    name: {
      ko: '테니스장',
      en: 'Tennis Courts',
      zh: '網球場',
      vi: 'Sân Quần vợt (Tennis)',
      lt: 'Teniso kortai',
      hi: 'टेनिस कोर्ट',
    },
    dept: {
      ko: '야외 테니스 코트 (1~4코트) · 체육실기장',
      en: 'Outdoor Tennis Courts (Courts 1–4) · Physical Education Practice Ground',
      zh: '戶外網球場 (1~4號球場) · 體育實技場',
      vi: 'Sân Tennis ngoài trời (Sân 1–4) · Khu thực hành Thể chất',
      lt: 'Lauko teniso aikštelės (1–4 kortai)',
      hi: 'आउटडोर टेनिस कोर्ट (कोर्ट 1–4)',
    },
    visual: {
      ko: '초록·주황 코트 바닥과 펜스가 설치된 야외 테니스장 코트',
      en: 'Outdoor green & clay-orange surfaced tennis courts with perimeter fencing',
      zh: '鋪設綠橙雙色球場地面與圍網的戶外網球場',
      vi: 'Sân quần vợt ngoài trời mặt sân xanh cam có hàng rào lưới',
      lt: 'Lauko teniso kortai žalia ir oranžine danga',
      hi: 'हरे और नारंगी रंग के आउटडोर टेनिस कोर्ट',
    },
  },
  26: {
    name: {
      ko: '민석동산',
      en: 'Minseok Hill Garden',
      zh: '民石東山 (校園花園)',
      vi: 'Đồi Công viên Minseok',
      lt: 'Minseok kalvos parkas',
      hi: 'मिनसोक हिल गार्डन',
    },
    dept: {
      ko: '캠퍼스 중앙 산책공원 · 휴게 쉼터 · 전망 벤치',
      en: 'Central Campus Walking Park · Scenic Rest Area & Benches',
      zh: '校園中央散步公園 · 休憩涼亭與景觀長椅',
      vi: 'Công viên đi dạo trung tâm · Khu nghỉ chân & Ghế đá ngắm cảnh',
      lt: 'Centrinis universiteto pasivaikščiojimų parkas ir poilsio zona',
      hi: 'कैंपस केंद्रीय उद्यान · विश्राम स्थल और बेंच',
    },
    visual: {
      ko: '푸른 소나무 숲과 벤치, 파고라 쉼터가 조성된 캠퍼스 힐링 정원',
      en: 'Landscaped green park with pine trees, walking paths, and pergola benches',
      zh: '綠松林立、設有涼亭與步道長椅的校園休憩花園',
      vi: 'Khu vườn xanh mát với rừng thông, lối đi dạo và chòi nghỉ',
      lt: 'Žaliasis parkas su pušimis, takeliais ir pavėsinėmis',
      hi: 'देवदार के पेड़ों, पैदल पथ और बेंचों वाला हरा-भरा उद्यान',
    },
  },
  27: {
    name: {
      ko: '우정의집',
      en: 'Friendship House',
      zh: '友情之家',
      vi: 'Nhà Hữu nghị (Friendship House)',
      lt: 'Draugystės namai',
      hi: 'फ्रेंडशिप हाउस',
    },
    dept: {
      ko: '학생 휴게 파빌리온 · 스터디 라운지 · 카페테리아',
      en: 'Student Rest Pavilion · Study Lounge · Mini Cafeteria',
      zh: '學生休憩亭 · 自習交誼廳 · 簡餐咖啡區',
      vi: 'Nhà nghỉ chân Sinh viên · Phòng đọc nhóm · Cafeteria',
      lt: 'Studentų poilsio paviljonas · Mokymosi erdvė',
      hi: 'छात्र विश्राम मंडप · स्टडी लाउंज · कैफेटेरिया',
    },
    visual: {
      ko: '아담한 붉은 박공지붕과 테라스를 갖춘 2층 규모의 우정의집',
      en: 'Cozy 2-story pavilion with a warm brown-red pitched roof and terrace',
      zh: '擁有溫馨紅棕色屋頂與露台的2層友情之家',
      vi: 'Tòa nhà 2 tầng ấm cúng với mái nâu đỏ và sân hiên',
      lt: 'Jaukus 2 aukštų paviljonas rusvai raudonu stogu ir terasa',
      hi: 'लाल-भूरे रंग की छत और टेरेस वाला 2-मंज़िला पवेलियन',
    },
  },
  29: {
    name: {
      ko: '유니버시티 파크 (UNIVERSITY PARK)',
      en: 'University Park Plaza',
      zh: '大學公園廣場 (University Park)',
      vi: 'Công viên University Park',
      lt: 'Universiteto parko aikštė',
      hi: 'यूनिवर्सिटी पार्क प्लाज़ा',
    },
    dept: {
      ko: '캠퍼스 상징 조형물 광장 · 중앙 보행 정원',
      en: 'Campus Symbolic Monument Plaza · Central Pedestrian Garden',
      zh: '校園象徵紀念塔廣場 · 中央步道花園',
      vi: 'Quảng trường Tháp Biểu tượng · Vườn đi bộ Trung tâm',
      lt: 'Universiteto simbolinio monumento aikštė ir centrinis sodas',
      hi: 'कैंपस स्मारक टॉवर प्लाज़ा · केंद्रीय पैदल उद्यान',
    },
    visual: {
      ko: '상징 조형물 타워와 산책 데크가 어우러진 유니버시티 파크 광장',
      en: 'Open green plaza featuring the university monument tower and wooden walking decks',
      zh: '立有象徵紀念塔與木棧步道的中央景觀廣場',
      vi: 'Quảng trường xanh với tháp biểu tượng và lối đi lát gỗ',
      lt: 'Atvira žalia aikštė su monumento bokštu ir pasivaikščiojimo takais',
      hi: 'स्मारक टॉवर और लकड़ी के डेक वाला खुला हरा प्लाज़ा',
    },
  },
  30: {
    name: {
      ko: '야외공연장 (Muse Park)',
      en: 'Muse Park Amphitheater',
      zh: '露天劇場 (Muse Park)',
      vi: 'Nhà hát Ngoài trời (Muse Park)',
      lt: 'Lauko amfiteatras (Muse Park)',
      hi: 'म्यूज़ पार्क ओपन-एयर थिएटर',
    },
    dept: {
      ko: '반원형 야외 음악당 · 버스킹 및 대학 축제 무대',
      en: 'Semicircular Outdoor Amphitheater · Campus Festival & Busking Stage',
      zh: '半圓形露天音樂堂 · 校園慶典與街頭表演舞台',
      vi: 'Sân khấu Bán nguyệt Ngoài trời · Nơi tổ chức Lễ hội & Biểu diễn',
      lt: 'Pusapvalis lauko amfiteatras · Festivalių ir koncertų scena',
      hi: 'अर्धवृत्ताकार आउटडोर एम्फीथिएटर · उत्सव और संगीत मंच',
    },
    visual: {
      ko: '부채꼴 돌계단 객석과 반원형 야외 무대로 꾸며진 야외공연장 (Muse Park)',
      en: 'Fan-shaped stone tiered seating surrounding a semicircular open-air stage',
      zh: '扇形石階觀眾席環繞半圓形露天舞台的戶外劇場',
      vi: 'Khán đài bậc đá hình quạt bao quanh sân khấu bán nguyệt ngoài trời',
      lt: 'Vėduoklės formos akmeninės tribūnos aplink lauko sceną',
      hi: 'अर्धवृत्ताकार मंच के चारों ओर पत्थर की सीढ़ीदार दर्शक दीर्घा',
    },
  },
  31: {
    name: {
      ko: '인터내셔널 칼리지 (IC)',
      en: 'International College (IC)',
      zh: '國際學院 (International College)',
      vi: 'Trường Quốc tế (International College)',
      lt: 'Tarptautinė kolegija (IC)',
      hi: 'इंटरनेशनल कॉलेज (IC)',
    },
    dept: {
      ko: '인터내셔널칼리지 · 동서 디자인팩토리(DFK) · 글로벌 전공 및 유학생 교육',
      en: 'International College · Design Factory Korea (DFK) · Global Majors & Exchange',
      zh: '國際學院 · 東西設計工廠(DFK) · 全球專業與國際生教育',
      vi: 'International College · Design Factory Korea (DFK) · Chương trình Toàn cầu',
      lt: 'Tarptautinė kolegija · Dizaino fabrikas (DFK) · Tarptautinės studijos',
      hi: 'इंटरनेशनल कॉलेज · डिज़ाइन फैक्ट्री कोरिया (DFK) · ग्लोबल मेजर्स',
    },
    visual: {
      ko: '선명한 코발트블루 포인트 외벽과 유리 파사드의 7층 인터내셔널 칼리지',
      en: '7-story modern building with vibrant cobalt-blue facade accents and glass curtain walls',
      zh: '鮮明鈷藍色立面裝飾與玻璃帷幕的7層國際學院大樓',
      vi: 'Tòa nhà 7 tầng hiện đại với điểm nhấn mặt tiền màu xanh coban và kính lớn',
      lt: '7 aukštų modernus pastatas ryškiai mėlynais fasado akcentais',
      hi: 'कोबाल्ट-नीले अग्रभाग और कांच की दीवारों वाली 7-मंज़िला आधुनिक इमारत',
    },
  },
}

export function getLocalizedBuildingName(building: Building, language: Language): string {
  if (language === 'ko') return building.name
  const num = building.campusNumber ?? building.id
  const entry = BUILDING_I18N[num]
  if (entry?.name[language]) return entry.name[language]
  return building.englishName || building.name
}

export function getLocalizedBuildingDept(building: Building, language: Language): string {
  if (language === 'ko') return building.departmentSummary ?? ''
  const num = building.campusNumber ?? building.id
  const entry = BUILDING_I18N[num]
  if (entry?.dept[language]) return entry.dept[language]
  return building.departmentSummary ?? ''
}

export function getLocalizedBuildingVisualDesc(building: Building, language: Language): string {
  const num = building.campusNumber ?? building.id
  const entry = BUILDING_I18N[num]
  if (entry?.visual[language]) return entry.visual[language]
  return entry?.visual.en ?? ''
}

// Room category dictionary across 6 languages
const CATEGORY_MAP: Record<string, Record<Language, string>> = {
  '강의실': { ko: '강의실', en: 'Lecture Room', zh: '教室', vi: 'Phòng học', lt: 'Auditorija', hi: 'व्याख्यान कक्ष' },
  '실습실': { ko: '실습실', en: 'Lab / Studio', zh: '實習室', vi: 'Phòng thực hành', lt: 'Laboratorija', hi: 'प्रयोगशाला' },
  '실습·연구': { ko: '실습·연구', en: 'Lab & Research', zh: '實習與研究', vi: 'Thực hành & Nghiên cứu', lt: 'Laboratorija ir tyrimai', hi: 'प्रयोगशाला एवं अनुसंधान' },
  '학과사무실': { ko: '학과사무실', en: 'Dept. Office', zh: '學科辦公室', vi: 'Văn phòng Khoa', lt: 'Katedros biuras', hi: 'विभाग कार्यालय' },
  '행정·지원': { ko: '행정·지원', en: 'Admin & Support', zh: '行政與支援', vi: 'Hành chính & Hỗ trợ', lt: 'Administracija', hi: 'प्रशासन एवं सहायता' },
  '교수연구실': { ko: '교수연구실', en: 'Faculty Office', zh: '教授研究室', vi: 'Phòng Giáo sư', lt: 'Dėstytojų kabinetas', hi: 'प्रोफेसर कार्यालय' },
  '대학본부': { ko: '대학본부', en: 'Main Admin', zh: '大學本部', vi: 'Hiệu bộ', lt: 'Rektoratas', hi: 'मुख्य प्रशासन' },
  '대학원': { ko: '대학원', en: 'Graduate School', zh: '大學院', vi: 'Cao học', lt: 'Magistrantūra', hi: 'ग्रेजुएट स्कूल' },
  '연구소': { ko: '연구소', en: 'Research Inst.', zh: '研究所', vi: 'Viện Nghiên cứu', lt: 'Mokslo institutas', hi: 'अनुसंधान संस्थान' },
  '편의시설': { ko: '편의시설', en: 'Amenities', zh: '便利設施', vi: 'Tiện ích', lt: 'Patogumai', hi: 'सुविधाएं' },
  '식당·카페': { ko: '식당·카페', en: 'Dining & Cafe', zh: '餐廳與咖啡', vi: 'Nhà ăn & Cafe', lt: 'Valgykla ir kavinė', hi: 'डाइनिंग और कैफे' },
  '도서관·열람': { ko: '도서관·열람', en: 'Library & Reading', zh: '圖書與閱覽', vi: 'Thư viện & Phòng đọc', lt: 'Biblioteka ir skaitykla', hi: 'पुस्तकालय एवं अध्ययन' },
  '공연·문화': { ko: '공연·문화', en: 'Arts & Culture', zh: '公演與文化', vi: 'Biểu diễn & Văn hóa', lt: 'Menas ir kultūra', hi: 'कला और संस्कृति' },
  '전시·문화': { ko: '전시·문화', en: 'Gallery & Culture', zh: '展示與文化', vi: 'Triển lãm & Văn hóa', lt: 'Galerija ir kultūra', hi: 'प्रदर्शनी एवं संस्कृति' },
  '체육·복지': { ko: '체육·복지', en: 'Sports & Welfare', zh: '體育與福利', vi: 'Thể thao & Phúc lợi', lt: 'Sportas ir gerovė', hi: 'खेल एवं कल्याण' },
  '학생자치': { ko: '학생자치', en: 'Student Union', zh: '學生自治', vi: 'Hội Sinh viên', lt: 'Studentų atstovybė', hi: 'छात्र संघ' },
  '생활관·숙소': { ko: '생활관·숙소', en: 'Dormitory', zh: '宿舍', vi: 'Ký túc xá', lt: 'Bendrabutis', hi: 'छात्रावास' },
  '예배·종교': { ko: '예배·종교', en: 'Chapel', zh: '禮拜堂', vi: 'Nhà nguyện', lt: 'Koplyčia', hi: 'चैपल' },
}

// Common Korean term replacements for automated multi-language room title & note translation
const TERM_TRANSLATIONS: Array<{
  ko: string
  en: string
  zh: string
  vi: string
  lt: string
  hi: string
}> = [
  { ko: '학과사무실', en: 'Department Office', zh: '學科辦公室', vi: 'Văn phòng Khoa', lt: 'Katedros biuras', hi: 'विभाग कार्यालय' },
  { ko: '행정실', en: 'Administration Office', zh: '行政室', vi: 'Phòng Hành chính', lt: 'Administracijos biuras', hi: 'प्रशासन कार्यालय' },
  { ko: '통합교학팀', en: 'Academic Affairs Team', zh: '綜合教學組', vi: 'Ban Giáo vụ', lt: 'Studijų skyrius', hi: 'शैक्षणिक मामलों की टीम' },
  { ko: '교수연구실', en: 'Faculty Offices', zh: '教授研究室', vi: 'Phòng Nghiên cứu Giáo sư', lt: 'Dėstytojų kabinetai', hi: 'प्रोफेसर 연구 कक्ष' },
  { ko: '전임교원 연구실', en: 'Full-time Faculty Offices', zh: '專任教師研究室', vi: 'Phòng Giảng viên Cơ hữu', lt: 'Dėstytojų kabinetai', hi: 'संकाय कार्यालय' },
  { ko: '실습실', en: 'Practice Lab', zh: '實習室', vi: 'Phòng Thực hành', lt: 'Praktikos laboratorija', hi: 'प्रैक्टिस लैब' },
  { ko: '강의실', en: 'Lecture Room', zh: '教室', vi: 'Phòng học', lt: 'Auditorija', hi: 'व्याख्यान कक्ष' },
  { ko: '세미나실', en: 'Seminar Room', zh: '研討室', vi: 'Phòng Seminar', lt: 'Seminarų kambarys', hi: 'सेमिनार कक्ष' },
  { ko: '세미나룸', en: 'Seminar Room', zh: '研討室', vi: 'Phòng Seminar', lt: 'Seminarų kambarys', hi: 'सेमिनार रूम' },
  { ko: '스튜디오', en: 'Studio', zh: '工作室', vi: 'Studio', lt: 'Studija', hi: 'स्टूडियो' },
  { ko: '컴퓨터', en: 'Computer', zh: '電腦', vi: 'Máy tính', lt: 'Kompiuterių', hi: 'कंप्यूटर' },
  { ko: '도서관', en: 'Library', zh: '圖書館', vi: 'Thư viện', lt: 'Biblioteka', hi: 'पुस्तकालय' },
  { ko: '열람실', en: 'Reading Room', zh: '閱覽室', vi: 'Phòng đọc', lt: 'Skaitykla', hi: 'अध्ययन कक्ष' },
  { ko: '자료실', en: 'Reference Room', zh: '資料室', vi: 'Phòng Tư liệu', lt: 'Informacijos centras', hi: 'संदर्भ कक्ष' },
  { ko: '학생식당', en: 'Student Cafeteria', zh: '學生餐廳', vi: 'Nhà ăn Sinh viên', lt: 'Studentų valgykla', hi: 'छात्र कैफेटेरिया' },
  { ko: '푸드코트', en: 'Food Court', zh: '美食街', vi: 'Khu Ẩm thực', lt: 'Maisto kiemelis', hi: 'फूड कोर्ट' },
  { ko: '편의점', en: 'Convenience Store', zh: '便利商店', vi: 'Cửa hàng Tiện lợi', lt: 'Parduotuvė', hi: 'सुविधा स्टोर' },
  { ko: '카페', en: 'Cafe', zh: '咖啡廳', vi: 'Quán Cafe', lt: 'Kavinė', hi: 'कैफे' },
  { ko: '라운지', en: 'Lounge', zh: '交誼廳', vi: 'Phòng Lounge', lt: 'Poilsio zona', hi: 'लाउंज' },
  { ko: '학생상담센터', en: 'Student Counseling Center', zh: '學生諮商中心', vi: 'Trung tâm Tư vấn Sinh viên', lt: 'Studentų konsultavimo centras', hi: 'छात्र परामर्श केंद्र' },
  { ko: '장애학생지원센터', en: 'Disability Support Center', zh: '身障學生支援中心', vi: 'Trung tâm Hỗ trợ SV Khuyết tật', lt: 'Neįgaliųjų studentų centras', hi: 'दिव्यांग छात्र सहायता केंद्र' },
  { ko: '부총장실', en: 'Vice President Office', zh: '副校長室', vi: 'Phòng Phó Hiệu trưởng', lt: 'Prorektoriaus kabinetas', hi: 'उपकुलपति कार्यालय' },
  { ko: '총장실', en: 'President Office', zh: '校長室', vi: 'Phòng Hiệu trưởng', lt: 'Rektoriaus kabinetas', hi: 'कुलपति कार्यालय' },
  { ko: '입학처', en: 'Admissions Office', zh: '入學處', vi: 'Phòng Tuyển sinh', lt: 'Priėmimo skyrius', hi: 'प्रवेश कार्यालय' },
  { ko: '학생취업지원처', en: 'Career & Student Support', zh: '學生就業支援處', vi: 'Trung tâm Hỗ trợ Việc làm', lt: 'Karjeros centras', hi: 'करियर सहायता केंद्र' },
  { ko: '총학생회실', en: 'Student Council Office', zh: '總學生會室', vi: 'Văn phòng Hội Sinh viên', lt: 'Studentų atstovybė', hi: 'छात्र संघ कार्यालय' },
  { ko: '동아리방', en: 'Student Club Rooms', zh: '社團活動室', vi: 'Phòng Câu lạc bộ', lt: 'Studentų klubai', hi: 'छात्र क्लब कक्ष' },
  { ko: '보건진료소', en: 'Campus Health Clinic', zh: '保健診療所', vi: 'Phòng Y tế', lt: 'Medicinos punktas', hi: 'स्वास्थ्य क्लिनिक' },
  { ko: '우체국', en: 'Post Office', zh: '郵局', vi: 'Bưu điện', lt: 'Paštas', hi: 'डाकघर' },
  { ko: '체육관', en: 'Gymnasium', zh: '體育館', vi: 'Nhà thi đấu', lt: 'Sporto salė', hi: 'व्यायामशाला' },
  { ko: '피트니스', en: 'Fitness Center', zh: '健身房', vi: 'Phòng Tập Gym', lt: 'Treniruoklių salė', hi: 'फिटनेस सेंटर' },
  { ko: '수영장', en: 'Swimming Pool', zh: '游泳池', vi: 'Hồ bơi', lt: 'Baseinas', hi: 'स्विमिंग पूल' },
  { ko: '예배실', en: 'Chapel Hall', zh: '禮拜堂', vi: 'Phòng Lễ bái', lt: 'Koplyčios salė', hi: 'प्रार्थना कक्ष' },
  { ko: '교목실', en: 'Chaplaincy Office', zh: '校牧室', vi: 'Văn phòng Mục vụ', lt: 'Kapeliono biuras', hi: 'चैपलिन कार्यालय' },
  { ko: '기숙사', en: 'Dormitory Rooms', zh: '宿舍寢室', vi: 'Phòng Ký túc xá', lt: 'Bendrabučio kambariai', hi: 'छात्रावास कक्ष' },
  { ko: '생활관', en: 'Residence Hall', zh: '生活館', vi: 'Ký túc xá', lt: 'Bendrabutis', hi: 'आवास हॉल' },
  { ko: '영상강의실', en: 'Audio-Visual Lecture Hall', zh: '視聽階梯教室', vi: 'Giảng đường nghe nhìn', lt: 'Vaizdo auditorija', hi: 'ऑडियो-विज़ुअल लेक्चर हॉल' },
  { ko: '국제세미나실', en: 'International Seminar Hall', zh: '國際研討廳', vi: 'Hội trường Quốc tế', lt: 'Tarptautinių seminarų salė', hi: 'अंतर्राष्ट्रीय सेमिनार हॉल' },
  { ko: '강사대기실', en: 'Instructor Lounge', zh: '講師休息室', vi: 'Phòng chờ giảng viên', lt: 'Dėstytojų poilsio kambarys', hi: 'प्रशिक्षक प्रतीक्षालय' },
  { ko: '서버실', en: 'Server Room', zh: '伺服器室', vi: 'Phòng máy chủ', lt: 'Serverinė', hi: 'सर्वर कक्ष' },
  { ko: '뉴밀레니엄관', en: 'New Millennium Hall', zh: '新千禧館', vi: 'Tòa nhà New Millennium', lt: 'Naujojo tūkstantmečio rūmai', hi: 'न्यू मिलेनियम हॉल' },
  { ko: '연결통로', en: 'Connecting Skybridge', zh: '連接走廊', vi: 'Cầu nối sang tòa nhà', lt: 'Jungiamasis koridorius', hi: 'कनेक्टिंग कॉरिडोर' },
  { ko: '물탱크실', en: 'Water Tank Room', zh: '蓄水池機房', vi: 'Phòng bồn nước', lt: 'Vandens rezervuaro patalpa', hi: 'वाटर टैंक कक्ष' },
  { ko: '발전기실', en: 'Generator Room', zh: '發電機房', vi: 'Phòng máy phát điện', lt: 'Generatorinės patalpa', hi: 'जनरेटर कक्ष' },
  { ko: '전기실', en: 'Electrical Room', zh: '配電室', vi: 'Phòng điện', lt: 'Elektros skydinė', hi: 'इलेक्ट्रिकल कक्ष' },
  { ko: '상부 좌석', en: 'Upper Balcony Seating', zh: '上層階梯座席區', vi: 'Khu ghế tầng trên', lt: 'Viršutinės sėdimos vietos', hi: 'ऊपरी बालकनी सीटिंग' },
  { ko: '계단식', en: 'Tiered Auditorium', zh: '階梯式', vi: 'Kiểu bậc thang', lt: 'Pakopų auditorija', hi: 'सीढ़ीदार हॉल' },
]

export function getLocalizedCategory(category: string | null | undefined, language: Language): string {
  if (!category) return ''
  if (language === 'ko') return category
  const hit = CATEGORY_MAP[category]
  if (hit) return hit[language]
  return category
}

export function getLocalizedFloorLabel(label: string, language: Language): string {
  if (language === 'ko') return label
  if (label === '야외' || label === '공원' || label === '광장' || label === '야외무대') {
    const map: Record<Language, string> = {
      ko: label,
      en: 'Outdoor',
      zh: '戶外',
      vi: 'Ngoài trời',
      lt: 'Lauke',
      hi: 'आउटडोर',
    }
    return map[language]
  }
  return label
}

export function getLocalizedRoomTitleAndNote(
  room: FloorRoomItem,
  language: Language,
  building: Building,
  floor: number,
  index: number,
): { codeStr: string; titleStr: string; noteStr: string; categoryStr: string } {
  const rawName = room.name
  const codeMatch = rawName.match(/^\[([^\]]+)\]\s*(.*)$/)
  const codeStr = room.code || (codeMatch ? codeMatch[1] : `${building.codePrefix ?? 'RM'}${floor}0${index + 1}`)
  const koTitle = codeMatch ? codeMatch[2] : rawName
  const categoryStr = getLocalizedCategory(room.category, language)

  if (language === 'ko') {
    return { codeStr, titleStr: koTitle, noteStr: room.note ?? '', categoryStr }
  }

  const explicitKey = `name_${language}` as 'name_en' | 'name_zh' | 'name_vi' | 'name_lt' | 'name_hi'
  const explicitVal = room[explicitKey]
  if (explicitVal) {
    const cleanExplicit = explicitVal.replace(/^\[[^\]]+\]\s*/, '')
    return { codeStr, titleStr: cleanExplicit, noteStr: categoryStr, categoryStr }
  }

  // Translate known Korean terms in room title
  const matchedTerms: string[] = []
  for (const item of TERM_TRANSLATIONS) {
    if (koTitle.includes(item.ko)) {
      matchedTerms.push(item[language])
    }
  }

  const bName = getLocalizedBuildingName(building, language)
  const titleStr =
    matchedTerms.length > 0
      ? `${matchedTerms.slice(0, 2).join(' · ')} (${codeStr})`
      : `${bName} · ${categoryStr || 'Room'} ${codeStr}`

  const noteMatched: string[] = []
  if (room.note) {
    for (const item of TERM_TRANSLATIONS) {
      if (room.note.includes(item.ko) && !matchedTerms.includes(item[language])) {
        noteMatched.push(item[language])
      }
    }
  }
  const noteStr = noteMatched.length > 0 ? noteMatched.join(' · ') : `${bName} (${floor > 0 ? `${floor}F` : 'B1'})`

  return { codeStr, titleStr, noteStr, categoryStr }
}

export const EXT_UI_COPY: Record<
  Language,
  {
    adminBtn: string
    myLocTitle: string
    myLocGps: string
    myLocFollow: string
    myLocPin: string
    nearText: (bName: string, distM: number) => string
    nearShort: (bName: string, distM: number) => string
    insideShort: (bName: string) => string
    insideText: (bName: string) => string
    coordElevText: (lat: string, lng: string, elev: string) => string
    gpsMyLocBtn: string
    clickMapPrompt: string
    changeLocOnMapBtn: string
    followMyViewBtn: string
    compassViewBtn: string
    compassViewOnTitle: string
    compassViewOffTitle: string
    floorPlanSectionTitle: string
    floorPlanTapToZoom: string
    floorPlanClose: string
    floorPlanBadge: string
    floorPlanCountBadge: (count: number) => string
    quickJumpLabel: string
    topBarTitle3D: string
    topBarTitle2D: string
    topBarMyLocLabel: string
    topBarSub: (elev: string) => string
    btn2DMap: string
    btn3DMap: string
    startBadge: string
    endBadge: string
    myLocPillPrefix: string
    pickingBannerText: string
    cancelBtn: string
    activeRouteCaption: (start: string, end: string, dist: number, slope: number) => string
    floorsScale: (levels: number) => string
    roomCodePrefixLabel: string
    stadiumBanner: string
    angleTitle: string
    presetOrtho: string
    presetIso: string
    presetFlat: string
    resetTitle: string
    switchTo2DTitle: string
    toggleLabelsTitle: string
    zoomInTitle: string
    zoomOutTitle: string
    fullCampusTitle: string
    touchGuideTitle: string
    touchGuideBody: string
    showFullRouteBtn: string
    followActiveBtn: string
    followStartBtn: string
    slopeCardTitle: string
    slopeSegmentsCount: (count: number) => string
    segmentMoveDesc: (dist: number, e1: number, e2: number) => string
    slopeEdgesConnected: (count: number) => string
    routeSummaryMsg: (dist: number, min: number, up: number, slope: number) => string
    gpsOutsideMsg: string
    campusNumBreadcrumb: (num: number) => string
    roomCodeBreadcrumb: (prefix: string) => string
    fromMyLocDist: (dist: number) => string
    elevValue: (elev: number) => string
    startFollowCardTitle: string
    floorsAndRoomsCount: (floors: number, rooms: number) => string
    allFloorsTab: (rooms: number) => string
    roomSearchPlaceholder: (prefix: string) => string
    floorZoneLabel: (prefix: string, range: string) => string
    roomsCountUnit: (count: number) => string
    noRoomInFloor: string
    showFullRouteShort: string
    startFollowShort: string
    // Slope labels
    slopeStairsLabel: string
    slopeStairsShort: string
    slopeSteepUpLabel: (pct: string) => string
    slopeSteepUpShort: (pct: string) => string
    slopeGentleUpLabel: (pct: string) => string
    slopeGentleUpShort: (pct: string) => string
    slopeSteepDownLabel: (pct: string) => string
    slopeSteepDownShort: (pct: string) => string
    slopeGentleDownLabel: (pct: string) => string
    slopeGentleDownShort: (pct: string) => string
    slopeFlatLabel: (pct: string) => string
    slopeFlatShort: (pct: string) => string
    // Route Follower HUD
    campusWalkway: string
    arrivedTitle: (dest: string) => string
    arrivedSub: string
    turnRightTitle: (dist: number) => string
    turnLeftTitle: (dist: number) => string
    straightTitle: (dist: number, near: string) => string
    turnSub: (from: string, to: string, slope: string) => string
    straightSub: (dest: string, slope: string) => string
    slopeUpWay: string
    slopeDownWay: string
    slopeFlatWay: string
    remainMeta: (dist: number, min: number, pct: number) => string
    currentPosBadge: (near: string) => string
    switchTo2DBtn: string
    switchTo3DBtn: string
    cameraLockOn: string
    cameraLockOff: string
    exitFollowBtn: string
    slopeProfileTitle: string
    legendFlat: string
    legendGentle: string
    legendSteepUp: string
    legendDown: string
    pauseBtn: string
    replayBtn: string
    playBtn: string
    prevSegBtn: string
    nextSegBtn: string
    speedBtn: (mult: number) => string
    originResetBtn: string
    navToggleOff: string
    navToggleOn: string
    followStopBtn: string
  }
> = {
  ko: {
    adminBtn: '관리자',
    myLocTitle: '현재 내 위치',
    myLocGps: '실시간 GPS',
    myLocFollow: '길안내 이동 중',
    myLocPin: '캠퍼스 위치 지정됨',
    nearText: (bName, distM) => `${bName} 인근 (약 ${distM}m)`,
    nearShort: (bName, distM) => `${bName} 앞 (${distM}m)`,
    insideShort: (bName) => `${bName} 내부`,
    insideText: (bName) => `${bName} 건물 내부`,
    coordElevText: (lat, lng, elev) => `위도 ${lat}° · 경도 ${lng}° · 해발 ${elev}m`,
    gpsMyLocBtn: 'GPS 내 위치',
    clickMapPrompt: '지도를 클릭하세요',
    changeLocOnMapBtn: '지도에서 내 위치 변경',
    followMyViewBtn: '내 시점 길따라가기',
    compassViewBtn: '방향 시점',
    compassViewOnTitle: '휴대폰 방향 시점 추적 켜짐 (끄려면 클릭)',
    compassViewOffTitle: '휴대폰 방향에 맞춰 시점 자동 회전',
    floorPlanSectionTitle: '층별 배치도 (피난대피도)',
    floorPlanTapToZoom: '배치도 크게 보기',
    floorPlanClose: '배치도 닫기',
    floorPlanBadge: '배치도',
    floorPlanCountBadge: (count) => `배치도 ${count}개 층`,
    quickJumpLabel: '빠른 위치 이동:',
    topBarTitle3D: '동서대학교 3D 조감도 캠퍼스맵',
    topBarTitle2D: '동서대학교 2D 평면 캠퍼스맵',
    topBarMyLocLabel: '내 위치',
    topBarSub: (elev) => `해발 ${elev}m · 번호(1~31번) 및 층별 영문+숫자 호실(U001, NM101 등) 안내`,
    btn2DMap: '2D 지도',
    btn3DMap: '3D 캠퍼스맵',
    startBadge: '출발',
    endBadge: '도착',
    myLocPillPrefix: '내 위치',
    pickingBannerText: "동서대학교 캠퍼스 지도 위에서 현재 계신 위치를 클릭하면 즉시 '내 위치'로 설정됩니다.",
    cancelBtn: '취소',
    activeRouteCaption: (start, end, dist, slope) => `경로 활성: ${start} → ${end} (${dist}m · 최고 경사 ${slope}%)`,
    floorsScale: (levels) => `${levels}층`,
    roomCodePrefixLabel: '호실',
    stadiumBanner: '종합운동장',
    angleTitle: '3D 각도',
    presetOrtho: '정사 (68°)',
    presetIso: '입체 (35°)',
    presetFlat: '평면',
    resetTitle: '기본 조감도 시점으로 복귀',
    switchTo2DTitle: '2D 평면 지도로 변환',
    toggleLabelsTitle: '건물명·호실코드 라벨 표시/숨기기',
    zoomInTitle: '3D 캠퍼스 확대',
    zoomOutTitle: '3D 캠퍼스 축소',
    fullCampusTitle: '3D 캠퍼스 전체 보기',
    touchGuideTitle: '손쉬운 3D 터치 가이드',
    touchGuideBody: '손가락 1개(이동), 손가락 2개(확대·축소 핀치 / 비틀어 회전 / 위아래 기울기), 핀 터치 시 호실 확인',
    showFullRouteBtn: '전체 경로 지도에 표시',
    followActiveBtn: '사용자 시점 길따라가기 진행 중',
    followStartBtn: '사용자 시점 길따라가기 시작',
    slopeCardTitle: '경사로 구간별 상세 안내',
    slopeSegmentsCount: (count) => `${count}개 보행 구간`,
    segmentMoveDesc: (dist, e1, e2) => `${dist}m 이동 (해발 ${e1}m → ${e2}m)`,
    slopeEdgesConnected: (count) => `${count}개 경사로 구간 연결 완료`,
    routeSummaryMsg: (dist, min, up, slope) => `총 ${dist}m · 약 ${min}분 · 오르막 ${up}m / 최고 경사 ${slope}%`,
    gpsOutsideMsg: '현재 기기 GPS 위치가 동서대학교 캠퍼스 외부입니다. 지도 위의 원하는 캠퍼스 위치를 클릭해 내 위치를 바로 지정하세요.',
    campusNumBreadcrumb: (num) => `캠퍼스 번호 ${num}번`,
    roomCodeBreadcrumb: (prefix) => `호실 코드 ${prefix}`,
    fromMyLocDist: (dist) => `내 위치에서 ${dist}m`,
    elevValue: (elev) => `해발 ${elev}m`,
    startFollowCardTitle: '사용자 시점 길따라가기 안내 시작',
    floorsAndRoomsCount: (floors, rooms) => `${floors}개 층 · ${rooms}개 호실`,
    allFloorsTab: (rooms) => `전체 (${rooms})`,
    roomSearchPlaceholder: (prefix) => `${prefix}001, ${prefix}101, 실습실, 행정실 등 호실 검색...`,
    floorZoneLabel: (prefix, range) => `${prefix}${range} 호실 구역`,
    roomsCountUnit: (count) => `${count}개 실`,
    noRoomInFloor: '검색한 호실 코드가 이 층에 없습니다.',
    showFullRouteShort: '전체 경로 보기',
    startFollowShort: '내 시점 길따라가기',
    slopeStairsLabel: '계단 구간',
    slopeStairsShort: '계단',
    slopeSteepUpLabel: (pct) => `급경사 오르막 (+${pct}%)`,
    slopeSteepUpShort: (pct) => `급경사 ▲+${pct}%`,
    slopeGentleUpLabel: (pct) => `오르막 경사로 (+${pct}%)`,
    slopeGentleUpShort: (pct) => `경사로 ▲+${pct}%`,
    slopeSteepDownLabel: (pct) => `급경사 내리막 (${pct}%)`,
    slopeSteepDownShort: (pct) => `급내리막 ▼${pct}%`,
    slopeGentleDownLabel: (pct) => `내리막 경사로 (${pct}%)`,
    slopeGentleDownShort: (pct) => `내리막 ▼${pct}%`,
    slopeFlatLabel: (pct) => `평지·완만 보행로 (${pct}%)`,
    slopeFlatShort: (pct) => `완만 ${pct}%`,
    campusWalkway: '캠퍼스 중앙 보행로',
    arrivedTitle: (dest) => `${dest} 도착`,
    arrivedSub: '목적지 건물 입구에 도착했습니다. 건물 마커를 눌러 층별 호실(예: U001, NM101)을 확인하세요.',
    turnRightTitle: (dist) => `${dist}m 앞 우회전`,
    turnLeftTitle: (dist) => `${dist}m 앞 좌회전`,
    straightTitle: (dist, near) => `${dist}m 직진 · ${near}`,
    turnSub: (from, to, slope) => `${from} → ${to} 방면 (${slope})`,
    straightSub: (dest, slope) => `${dest} 방면으로 보행로를 따라 이동 (${slope})`,
    slopeUpWay: '오르막 경사로 구간',
    slopeDownWay: '내리막 경사로 구간',
    slopeFlatWay: '보행로 구간',
    remainMeta: (dist, min, pct) => `남은 거리 ${dist}m · 약 ${min}분 (${pct}%)`,
    currentPosBadge: (near) => `현위치: ${near}`,
    switchTo2DBtn: '2D 지도로 전환',
    switchTo3DBtn: '3D 캠퍼스맵 전환',
    cameraLockOn: '내 위치 카메라 고정',
    cameraLockOff: '자유 지도 이동/줌',
    exitFollowBtn: '안내 종료',
    slopeProfileTitle: '경로 경사로 단면도 (클릭 시 지도 위 해당 경사로 위치로 즉시 이동)',
    legendFlat: '평지·완만',
    legendGentle: '완만 경사로',
    legendSteepUp: '급경사 오르막',
    legendDown: '내리막 경사로',
    pauseBtn: '일시정지',
    replayBtn: '처음부터 다시 따라가기',
    playBtn: '길따라가기 재생',
    prevSegBtn: '이전 구간',
    nextSegBtn: '다음 구간',
    speedBtn: (mult) => `${mult}x 속도`,
    originResetBtn: '출발지',
    navToggleOff: '네비게이션 끄기',
    navToggleOn: '네비게이션 켜기',
    followStopBtn: '내 시점 따라가기 끄기',
  },
  en: {
    adminBtn: 'Admin',
    myLocTitle: 'My Current Location',
    myLocGps: 'Live GPS',
    myLocFollow: 'Following Route',
    myLocPin: 'Campus Pin Set',
    nearText: (bName, distM) => `Near ${bName} (~${distM}m)`,
    nearShort: (bName, distM) => `Near ${bName} (${distM}m)`,
    insideShort: (bName) => `Inside ${bName}`,
    insideText: (bName) => `Inside ${bName}`,
    coordElevText: (lat, lng, elev) => `Lat ${lat}° · Lng ${lng}° · Elev ${elev}m`,
    gpsMyLocBtn: 'GPS Location',
    clickMapPrompt: 'Click on the map',
    changeLocOnMapBtn: 'Pick Location on Map',
    followMyViewBtn: 'Follow My Route',
    compassViewBtn: 'Heading View',
    compassViewOnTitle: 'Phone compass camera lock ON (click to unlock)',
    compassViewOffTitle: 'Align 3D view with phone compass direction',
    floorPlanSectionTitle: 'Floor Plan Layout',
    floorPlanTapToZoom: 'Expand floor plan',
    floorPlanClose: 'Close floor plan',
    floorPlanBadge: 'Floor Plan',
    floorPlanCountBadge: (count) => `${count} floor plans`,
    quickJumpLabel: 'Quick Jump:',
    topBarTitle3D: 'DSU 3D Aerial Campus Map',
    topBarTitle2D: 'DSU 2D Flat Campus Map',
    topBarMyLocLabel: 'My Location',
    topBarSub: (elev) => `Elev ${elev}m · Building Nos. (1–31) & Room Codes (U001, NM101, etc.)`,
    btn2DMap: '2D Map',
    btn3DMap: '3D Campus Map',
    startBadge: 'START',
    endBadge: 'END',
    myLocPillPrefix: 'My Loc',
    pickingBannerText: 'Click anywhere inside Dongseo University campus on the map to set your current location.',
    cancelBtn: 'Cancel',
    activeRouteCaption: (start, end, dist, slope) => `Active Route: ${start} → ${end} (${dist}m · Max Slope ${slope}%)`,
    floorsScale: (levels) => `${levels}F`,
    roomCodePrefixLabel: 'Rooms',
    stadiumBanner: 'Main Stadium',
    angleTitle: '3D Angle',
    presetOrtho: 'Ortho (68°)',
    presetIso: '3D View (35°)',
    presetFlat: 'Top-Down',
    resetTitle: 'Reset 3D View',
    switchTo2DTitle: 'Switch to 2D Map',
    toggleLabelsTitle: 'Toggle Building & Code Labels',
    zoomInTitle: 'Zoom In',
    zoomOutTitle: 'Zoom Out',
    fullCampusTitle: 'Fit Entire Campus',
    touchGuideTitle: '3D Touch & Mouse Controls',
    touchGuideBody: '1-Finger / Left-Drag: Pan · 2-Fingers / Right-Drag: Pinch Zoom, Rotate & Tilt · Tap pin for rooms',
    showFullRouteBtn: 'Show Full Route on Map',
    followActiveBtn: 'Route Following Active',
    followStartBtn: 'Start User-View Route Following',
    slopeCardTitle: 'Step-by-Step Slope Breakdown',
    slopeSegmentsCount: (count) => `${count} segments`,
    segmentMoveDesc: (dist, e1, e2) => `Walk ${dist}m (Elev ${e1}m → ${e2}m)`,
    slopeEdgesConnected: (count) => `${count} slope segments connected`,
    routeSummaryMsg: (dist, min, up, slope) => `Total ${dist}m · ~${min} min · Uphill ${up}m / Max Slope ${slope}%`,
    gpsOutsideMsg: 'Your GPS is outside DSU campus. Click any point on the campus map to set your starting location.',
    campusNumBreadcrumb: (num) => `Building #${num}`,
    roomCodeBreadcrumb: (prefix) => `Code ${prefix}`,
    fromMyLocDist: (dist) => `${dist}m from you`,
    elevValue: (elev) => `Elev ${elev}m`,
    startFollowCardTitle: 'Start User-Perspective Route Following',
    floorsAndRoomsCount: (floors, rooms) => `${floors} Floors · ${rooms} Rooms`,
    allFloorsTab: (rooms) => `All (${rooms})`,
    roomSearchPlaceholder: (prefix) => `Search ${prefix}001, ${prefix}101, lab, office...`,
    floorZoneLabel: (prefix, range) => `${prefix}${range} Room Zone`,
    roomsCountUnit: (count) => `${count} rooms`,
    noRoomInFloor: 'No matching room code found on this floor.',
    showFullRouteShort: 'Show Full Route',
    startFollowShort: 'Follow Route',
    slopeStairsLabel: 'Stairs Section',
    slopeStairsShort: 'Stairs',
    slopeSteepUpLabel: (pct) => `Steep Uphill (+${pct}%)`,
    slopeSteepUpShort: (pct) => `Steep ▲+${pct}%`,
    slopeGentleUpLabel: (pct) => `Uphill Ramp (+${pct}%)`,
    slopeGentleUpShort: (pct) => `Ramp ▲+${pct}%`,
    slopeSteepDownLabel: (pct) => `Steep Downhill (${pct}%)`,
    slopeSteepDownShort: (pct) => `Steep ▼${pct}%`,
    slopeGentleDownLabel: (pct) => `Downhill Ramp (${pct}%)`,
    slopeGentleDownShort: (pct) => `Down ▼${pct}%`,
    slopeFlatLabel: (pct) => `Flat / Gentle Path (${pct}%)`,
    slopeFlatShort: (pct) => `Flat ${pct}%`,
    campusWalkway: 'Central Campus Walkway',
    arrivedTitle: (dest) => `Arrived at ${dest}`,
    arrivedSub: 'You have reached the building entrance. Tap the marker to check floor rooms (e.g. U001, NM101).',
    turnRightTitle: (dist) => `Turn right in ${dist}m`,
    turnLeftTitle: (dist) => `Turn left in ${dist}m`,
    straightTitle: (dist, near) => `Go straight ${dist}m · ${near}`,
    turnSub: (from, to, slope) => `Towards ${from} → ${to} (${slope})`,
    straightSub: (dest, slope) => `Follow the campus path towards ${dest} (${slope})`,
    slopeUpWay: 'Uphill ramp section',
    slopeDownWay: 'Downhill ramp section',
    slopeFlatWay: 'Walkway section',
    remainMeta: (dist, min, pct) => `${dist}m left · ~${min} min (${pct}%)`,
    currentPosBadge: (near) => `At: ${near}`,
    switchTo2DBtn: 'Switch to 2D Map',
    switchTo3DBtn: 'Switch to 3D Map',
    cameraLockOn: 'Camera Locked to Me',
    cameraLockOff: 'Free Pan / Zoom',
    exitFollowBtn: 'Exit Guide',
    slopeProfileTitle: 'Route Elevation & Slope Profile (Click graph to jump along route)',
    legendFlat: 'Flat/Gentle',
    legendGentle: 'Gentle Ramp',
    legendSteepUp: 'Steep Uphill',
    legendDown: 'Downhill',
    pauseBtn: 'Pause',
    replayBtn: 'Replay from Start',
    playBtn: 'Play Route Guide',
    prevSegBtn: 'Prev',
    nextSegBtn: 'Next',
    speedBtn: (mult) => `${mult}x Speed`,
    originResetBtn: 'Start',
    navToggleOff: 'Navigation Off',
    navToggleOn: 'Navigation On',
    followStopBtn: 'Stop Following',
  },
  zh: {
    adminBtn: '管理員',
    myLocTitle: '目前我的位置',
    myLocGps: '即時 GPS',
    myLocFollow: '導航移動中',
    myLocPin: '已指定校園位置',
    nearText: (bName, distM) => `${bName} 附近 (約 ${distM}m)`,
    nearShort: (bName, distM) => `${bName} 前 (${distM}m)`,
    insideShort: (bName) => `${bName} 內部`,
    insideText: (bName) => `${bName} 建築內部`,
    coordElevText: (lat, lng, elev) => `緯度 ${lat}° · 經度 ${lng}° · 海拔 ${elev}m`,
    gpsMyLocBtn: 'GPS 我的位置',
    clickMapPrompt: '請點擊地圖',
    changeLocOnMapBtn: '在地圖上更改位置',
    followMyViewBtn: '用戶視角跟隨導航',
    compassViewBtn: '方向視角',
    compassViewOnTitle: '手機指南針視角追蹤開啟 (點擊關閉)',
    compassViewOffTitle: '依手機朝向自動旋轉 3D 視角',
    floorPlanSectionTitle: '樓層平面配置圖',
    floorPlanTapToZoom: '放大檢視配置圖',
    floorPlanClose: '關閉配置圖',
    floorPlanBadge: '配置圖',
    floorPlanCountBadge: (count) => `共 ${count} 層配置圖`,
    quickJumpLabel: '快速移動位置：',
    topBarTitle3D: '東西大學 3D 鳥瞰校園地圖',
    topBarTitle2D: '東西大學 2D 平面校園地圖',
    topBarMyLocLabel: '我的位置',
    topBarSub: (elev) => `海拔 ${elev}m · 建築編號(1~31號)與各樓層教室代碼(U001, NM101等)指南`,
    btn2DMap: '2D 地圖',
    btn3DMap: '3D 校園地圖',
    startBadge: '出發',
    endBadge: '到達',
    myLocPillPrefix: '位置',
    pickingBannerText: '請在東西大學校園地圖上點選您目前所在的位置，即可設為「我的位置」。',
    cancelBtn: '取消',
    activeRouteCaption: (start, end, dist, slope) => `路線啟用: ${start} → ${end} (${dist}m · 最大坡度 ${slope}%)`,
    floorsScale: (levels) => `${levels}層`,
    roomCodePrefixLabel: '教室',
    stadiumBanner: '綜合運動場',
    angleTitle: '3D 視角',
    presetOrtho: '正射 (68°)',
    presetIso: '立體 (35°)',
    presetFlat: '平面',
    resetTitle: '恢復預設鳥瞰視角',
    switchTo2DTitle: '切換至 2D 平面地圖',
    toggleLabelsTitle: '顯示/隱藏建築與代碼標籤',
    zoomInTitle: '放大 3D 地圖',
    zoomOutTitle: '縮小 3D 地圖',
    fullCampusTitle: '顯示完整校園',
    touchGuideTitle: '3D 觸控與滑鼠指南',
    touchGuideBody: '單指/左鍵拖曳(移動) · 雙指捏合/右鍵拖曳(縮放、360°旋轉、調整傾角) · 點選編號查看教室',
    showFullRouteBtn: '在地圖上顯示完整路線',
    followActiveBtn: '用戶視角跟隨導航進行中',
    followStartBtn: '開始用戶視角路線跟隨',
    slopeCardTitle: '各路段坡道詳細指南',
    slopeSegmentsCount: (count) => `${count}個步行路段`,
    segmentMoveDesc: (dist, e1, e2) => `移動 ${dist}m (海拔 ${e1}m → ${e2}m)`,
    slopeEdgesConnected: (count) => `已連接 ${count} 個坡道路段`,
    routeSummaryMsg: (dist, min, up, slope) => `總長 ${dist}m · 約 ${min}分鐘 · 上坡 ${up}m / 最大坡度 ${slope}%`,
    gpsOutsideMsg: '目前 GPS 位於校園外，請直接點擊地圖上的校園位置來指定您的起點。',
    campusNumBreadcrumb: (num) => `校園編號 ${num}號`,
    roomCodeBreadcrumb: (prefix) => `教室代碼 ${prefix}`,
    fromMyLocDist: (dist) => `距我 ${dist}m`,
    elevValue: (elev) => `海拔 ${elev}m`,
    startFollowCardTitle: '開始用戶視角路線跟隨導航',
    floorsAndRoomsCount: (floors, rooms) => `${floors}個樓層 · ${rooms}間教室`,
    allFloorsTab: (rooms) => `全部 (${rooms})`,
    roomSearchPlaceholder: (prefix) => `搜尋 ${prefix}001, ${prefix}101, 實習室, 辦公室...`,
    floorZoneLabel: (prefix, range) => `${prefix}${range} 教室區域`,
    roomsCountUnit: (count) => `${count}間`,
    noRoomInFloor: '此樓層找不到符合的教室代碼。',
    showFullRouteShort: '查看完整路線',
    startFollowShort: '視角跟隨導航',
    slopeStairsLabel: '階梯路段',
    slopeStairsShort: '階梯',
    slopeSteepUpLabel: (pct) => `陡坡上行 (+${pct}%)`,
    slopeSteepUpShort: (pct) => `陡坡 ▲+${pct}%`,
    slopeGentleUpLabel: (pct) => `上坡坡道 (+${pct}%)`,
    slopeGentleUpShort: (pct) => `上坡 ▲+${pct}%`,
    slopeSteepDownLabel: (pct) => `陡坡下行 (${pct}%)`,
    slopeSteepDownShort: (pct) => `陡降 ▼${pct}%`,
    slopeGentleDownLabel: (pct) => `下坡坡道 (${pct}%)`,
    slopeGentleDownShort: (pct) => `下坡 ▼${pct}%`,
    slopeFlatLabel: (pct) => `平坦·緩坡步道 (${pct}%)`,
    slopeFlatShort: (pct) => `平緩 ${pct}%`,
    campusWalkway: '校園中央步道',
    arrivedTitle: (dest) => `已到達 ${dest}`,
    arrivedSub: '已抵達目的地建築入口。點選標記可查看各樓層教室 (如 U001, NM101)。',
    turnRightTitle: (dist) => `前方 ${dist}m 右轉`,
    turnLeftTitle: (dist) => `前方 ${dist}m 左轉`,
    straightTitle: (dist, near) => `直行 ${dist}m · ${near}`,
    turnSub: (from, to, slope) => `往 ${from} → ${to} 方向 (${slope})`,
    straightSub: (dest, slope) => `沿步道前往 ${dest} 方向 (${slope})`,
    slopeUpWay: '上坡坡道路段',
    slopeDownWay: '下坡坡道路段',
    slopeFlatWay: '一般步道路段',
    remainMeta: (dist, min, pct) => `剩餘 ${dist}m · 約 ${min}分 (${pct}%)`,
    currentPosBadge: (near) => `目前位置: ${near}`,
    switchTo2DBtn: '切換至 2D 地圖',
    switchTo3DBtn: '切換至 3D 地圖',
    cameraLockOn: '鏡頭鎖定我的位置',
    cameraLockOff: '自由移動/縮放地圖',
    exitFollowBtn: '結束導航',
    slopeProfileTitle: '路線海拔與坡道剖面圖 (點擊圖表可立即跳轉至該坡道位置)',
    legendFlat: '平坦·緩坡',
    legendGentle: '緩坡道',
    legendSteepUp: '陡坡上行',
    legendDown: '下坡坡道',
    pauseBtn: '暫停',
    replayBtn: '從起點重新導航',
    playBtn: '播放路線跟隨',
    prevSegBtn: '上一段',
    nextSegBtn: '下一段',
    speedBtn: (mult) => `${mult}x 速度`,
    originResetBtn: '起點',
    navToggleOff: '關閉導航',
    navToggleOn: '開啟導航',
    followStopBtn: '關閉視角跟隨',
  },
  vi: {
    adminBtn: 'Quản trị',
    myLocTitle: 'Vị trí hiện tại của tôi',
    myLocGps: 'GPS trực tiếp',
    myLocFollow: 'Đang dẫn đường',
    myLocPin: 'Đã chọn trên bản đồ',
    nearText: (bName, distM) => `Gần ${bName} (~${distM}m)`,
    nearShort: (bName, distM) => `Trước ${bName} (${distM}m)`,
    insideShort: (bName) => `Bên trong ${bName}`,
    insideText: (bName) => `Bên trong ${bName}`,
    coordElevText: (lat, lng, elev) => `Vĩ độ ${lat}° · Kinh độ ${lng}° · Độ cao ${elev}m`,
    gpsMyLocBtn: 'Vị trí GPS',
    clickMapPrompt: 'Nhấn vào bản đồ',
    changeLocOnMapBtn: 'Đổi vị trí trên bản đồ',
    followMyViewBtn: 'Dẫn đường theo góc nhìn',
    compassViewBtn: 'Góc nhìn hướng',
    compassViewOnTitle: 'Đang khóa góc nhìn theo hướng điện thoại (nhấn để tắt)',
    compassViewOffTitle: 'Xoay góc nhìn 3D theo hướng điện thoại',
    floorPlanSectionTitle: 'Sơ đồ mặt bằng từng tầng',
    floorPlanTapToZoom: 'Phóng to sơ đồ',
    floorPlanClose: 'Đóng sơ đồ',
    floorPlanBadge: 'Sơ đồ',
    floorPlanCountBadge: (count) => `${count} tầng có sơ đồ`,
    quickJumpLabel: 'Di chuyển nhanh:',
    topBarTitle3D: 'Bản đồ 3D Đại học Dongseo',
    topBarTitle2D: 'Bản đồ 2D Đại học Dongseo',
    topBarMyLocLabel: 'Vị trí',
    topBarSub: (elev) => `Độ cao ${elev}m · Số tòa nhà (1–31) & Mã phòng (U001, NM101...)`,
    btn2DMap: 'Bản đồ 2D',
    btn3DMap: 'Bản đồ 3D',
    startBadge: 'ĐI',
    endBadge: 'ĐẾN',
    myLocPillPrefix: 'Vị trí',
    pickingBannerText: 'Nhấn vào vị trí bất kỳ trong khuôn viên Đại học Dongseo trên bản đồ để đặt làm vị trí của bạn.',
    cancelBtn: 'Hủy',
    activeRouteCaption: (start, end, dist, slope) => `Lộ trình: ${start} → ${end} (${dist}m · Độ dốc tối đa ${slope}%)`,
    floorsScale: (levels) => `${levels} tầng`,
    roomCodePrefixLabel: 'Phòng',
    stadiumBanner: 'Sân vận động',
    angleTitle: 'Góc 3D',
    presetOrtho: 'Trực giao (68°)',
    presetIso: 'Góc 3D (35°)',
    presetFlat: 'Mặt phẳng',
    resetTitle: 'Về góc nhìn mặc định',
    switchTo2DTitle: 'Chuyển sang bản đồ 2D',
    toggleLabelsTitle: 'Hiện/ẩn tên tòa nhà',
    zoomInTitle: 'Phóng to',
    zoomOutTitle: 'Thu nhỏ',
    fullCampusTitle: 'Xem toàn cảnh',
    touchGuideTitle: 'Hướng dẫn chạm & chuột 3D',
    touchGuideBody: '1 ngón / Chuột trái: Di chuyển · 2 ngón / Chuột phải: Phóng to, Xoay 360° & Nghiêng · Chạm số đỏ xem phòng',
    showFullRouteBtn: 'Hiện toàn bộ lộ trình trên bản đồ',
    followActiveBtn: 'Đang dẫn đường theo góc nhìn',
    followStartBtn: 'Bắt đầu dẫn đường theo góc nhìn',
    slopeCardTitle: 'Chi tiết độ dốc từng chặng',
    slopeSegmentsCount: (count) => `${count} chặng đi bộ`,
    segmentMoveDesc: (dist, e1, e2) => `Đi ${dist}m (Độ cao ${e1}m → ${e2}m)`,
    slopeEdgesConnected: (count) => `Đã kết nối ${count} đoạn đường dốc`,
    routeSummaryMsg: (dist, min, up, slope) => `Tổng ${dist}m · ~${min} phút · Lên dốc ${up}m / Dốc nhất ${slope}%`,
    gpsOutsideMsg: 'GPS hiện ở ngoài khuôn viên trường. Hãy nhấn trực tiếp lên bản đồ để chọn vị trí của bạn.',
    campusNumBreadcrumb: (num) => `Tòa nhà số ${num}`,
    roomCodeBreadcrumb: (prefix) => `Mã ${prefix}`,
    fromMyLocDist: (dist) => `Cách bạn ${dist}m`,
    elevValue: (elev) => `Cao ${elev}m`,
    startFollowCardTitle: 'Bắt đầu dẫn đường theo góc nhìn người dùng',
    floorsAndRoomsCount: (floors, rooms) => `${floors} tầng · ${rooms} phòng`,
    allFloorsTab: (rooms) => `Tất cả (${rooms})`,
    roomSearchPlaceholder: (prefix) => `Tìm ${prefix}001, ${prefix}101, phòng học, văn phòng...`,
    floorZoneLabel: (prefix, range) => `Khu phòng ${prefix}${range}`,
    roomsCountUnit: (count) => `${count} phòng`,
    noRoomInFloor: 'Không tìm thấy mã phòng phù hợp ở tầng này.',
    showFullRouteShort: 'Xem toàn tuyến',
    startFollowShort: 'Dẫn đường',
    slopeStairsLabel: 'Đoạn cầu thang',
    slopeStairsShort: 'Cầu thang',
    slopeSteepUpLabel: (pct) => `Dốc cao lên (+${pct}%)`,
    slopeSteepUpShort: (pct) => `Dốc cao ▲+${pct}%`,
    slopeGentleUpLabel: (pct) => `Đường dốc lên (+${pct}%)`,
    slopeGentleUpShort: (pct) => `Lên dốc ▲+${pct}%`,
    slopeSteepDownLabel: (pct) => `Dốc cao xuống (${pct}%)`,
    slopeSteepDownShort: (pct) => `Dốc xuống ▼${pct}%`,
    slopeGentleDownLabel: (pct) => `Đường dốc xuống (${pct}%)`,
    slopeGentleDownShort: (pct) => `Xuống dốc ▼${pct}%`,
    slopeFlatLabel: (pct) => `Đường bằng·thoải (${pct}%)`,
    slopeFlatShort: (pct) => `Thoải ${pct}%`,
    campusWalkway: 'Lối đi bộ trung tâm',
    arrivedTitle: (dest) => `Đã đến ${dest}`,
    arrivedSub: 'Bạn đã đến lối vào tòa nhà. Nhấn vàoghim tòa nhà để xem danh sách phòng (VD: U001, NM101).',
    turnRightTitle: (dist) => `Rẽ phải sau ${dist}m`,
    turnLeftTitle: (dist) => `Rẽ trái sau ${dist}m`,
    straightTitle: (dist, near) => `Đi thẳng ${dist}m · ${near}`,
    turnSub: (from, to, slope) => `Hướng ${from} → ${to} (${slope})`,
    straightSub: (dest, slope) => `Điตาม lối đi bộ về hướng ${dest} (${slope})`,
    slopeUpWay: 'Đoạn đường lên dốc',
    slopeDownWay: 'Đoạn đường xuống dốc',
    slopeFlatWay: 'Đoạn đường đi bộ',
    remainMeta: (dist, min, pct) => `Còn ${dist}m · ~${min} phút (${pct}%)`,
    currentPosBadge: (near) => `Tại: ${near}`,
    switchTo2DBtn: 'Chuyển bản đồ 2D',
    switchTo3DBtn: 'Chuyển bản đồ 3D',
    cameraLockOn: 'Khóa camera theo tôi',
    cameraLockOff: 'Tự do kéo / thu phóng',
    exitFollowBtn: 'Kết thúc',
    slopeProfileTitle: 'Mặt cắt độ cao & độ dốc (Nhấn vào biểu đồ để nhảy tới vị trí)',
    legendFlat: 'Bằng/Thoải',
    legendGentle: 'Dốc thoải',
    legendSteepUp: 'Dốc đứng',
    legendDown: 'Xuống dốc',
    pauseBtn: 'Tạm dừng',
    replayBtn: 'Đi lại từ đầu',
    playBtn: 'Phát dẫn đường',
    prevSegBtn: 'Trước',
    nextSegBtn: 'Tiếp',
    speedBtn: (mult) => `Tốc độ ${mult}x`,
    originResetBtn: 'Điểm đi',
    navToggleOff: 'Tắt dẫn đường',
    navToggleOn: 'Bật dẫn đường',
    followStopBtn: 'Tắt theo dõi',
  },
  lt: {
    adminBtn: 'Admin.',
    myLocTitle: 'Mano dabartinė vieta',
    myLocGps: 'Tiesioginis GPS',
    myLocFollow: 'Maršruto sekimas',
    myLocPin: 'Pasirinkta žemėlapyje',
    nearText: (bName, distM) => `Šalia ${bName} (~${distM}m)`,
    nearShort: (bName, distM) => `Prie ${bName} (${distM}m)`,
    insideShort: (bName) => `${bName} viduje`,
    insideText: (bName) => `Pastato ${bName} viduje`,
    coordElevText: (lat, lng, elev) => `Plat. ${lat}° · Ilg. ${lng}° · Aukštis ${elev}m`,
    gpsMyLocBtn: 'GPS vieta',
    clickMapPrompt: 'Spustelėkite žemėlapį',
    changeLocOnMapBtn: 'Keisti vietą žemėlapyje',
    followMyViewBtn: 'Sekti maršrutą',
    compassViewBtn: 'Krypties vaizdas',
    compassViewOnTitle: 'Telefono kompaso vaizdo sekimas įjungtas',
    compassViewOffTitle: 'Pasukti 3D vaizdą pagal telefono kryptį',
    floorPlanSectionTitle: 'Aukštų planai',
    floorPlanTapToZoom: 'Padidinti planą',
    floorPlanClose: 'Uždaryti planą',
    floorPlanBadge: 'Planas',
    floorPlanCountBadge: (count) => `${count} aukštų planai`,
    quickJumpLabel: 'Greitas perėjimas:',
    topBarTitle3D: 'DSU 3D erdvinis žemėlapis',
    topBarTitle2D: 'DSU 2D plokščias žemėlapis',
    topBarMyLocLabel: 'Mano vieta',
    topBarSub: (elev) => `Aukštis ${elev}m · Pastatų Nr. (1–31) ir auditorijų kodai (U001, NM101)`,
    btn2DMap: '2D žemėlapis',
    btn3DMap: '3D žemėlapis',
    startBadge: 'PRADŽIA',
    endBadge: 'TIKSLAS',
    myLocPillPrefix: 'Vieta',
    pickingBannerText: 'Spustelėkite bet kurią vietą universiteto žemėlapyje, kad nustatytumėte savo dabartinę vietą.',
    cancelBtn: 'Atšaukti',
    activeRouteCaption: (start, end, dist, slope) => `Maršrutas: ${start} → ${end} (${dist}m · Maks. nuolydis ${slope}%)`,
    floorsScale: (levels) => `${levels} a.`,
    roomCodePrefixLabel: 'Kab.',
    stadiumBanner: 'Centrinis stadionas',
    angleTitle: '3D kampas',
    presetOrtho: 'Orto (68°)',
    presetIso: '3D vaizdas (35°)',
    presetFlat: 'Iš viršaus',
    resetTitle: 'Atstatyti numatytąjį vaizdą',
    switchTo2DTitle: 'Perjungti į 2D žemėlapį',
    toggleLabelsTitle: 'Rodyti/slėpti pavadinimus',
    zoomInTitle: 'Priartinti',
    zoomOutTitle: 'Atitolinti',
    fullCampusTitle: 'Visas miestelis',
    touchGuideTitle: '3D lietimo ir pelės valdymas',
    touchGuideBody: '1 pirštas / Kairys pelės: Stumdyti · 2 pirštai / Dešinys: Priartinti, Sukti 360° ir Pakreipti',
    showFullRouteBtn: 'Rodyti visą maršrutą žemėlapyje',
    followActiveBtn: 'Vyksta maršruto sekimas',
    followStartBtn: 'Pradėti maršruto sekimą',
    slopeCardTitle: 'Šlaitų ir atkarpų suvestinė',
    slopeSegmentsCount: (count) => `${count} atkarpos`,
    segmentMoveDesc: (dist, e1, e2) => `Eiti ${dist}m (Aukštis ${e1}m → ${e2}m)`,
    slopeEdgesConnected: (count) => `Sujungta ${count} šlaitų atkarpų`,
    routeSummaryMsg: (dist, min, up, slope) => `Iš viso ${dist}m · ~${min} min. · Įkalnė ${up}m / Maks. nuolydis ${slope}%`,
    gpsOutsideMsg: 'Jūsų GPS yra už universiteto ribų. Spustelėkite žemėlapį, kad pasirinktumėte vietą.',
    campusNumBreadcrumb: (num) => `Pastatas Nr. ${num}`,
    roomCodeBreadcrumb: (prefix) => `Kodas ${prefix}`,
    fromMyLocDist: (dist) => `${dist}m nuo jūsų`,
    elevValue: (elev) => `Aukštis ${elev}m`,
    startFollowCardTitle: 'Pradėti maršruto навигаciją',
    floorsAndRoomsCount: (floors, rooms) => `${floors} aukštai · ${rooms} kab.`,
    allFloorsTab: (rooms) => `Visi (${rooms})`,
    roomSearchPlaceholder: (prefix) => `Ieškoti ${prefix}001, ${prefix}101, laboratorija...`,
    floorZoneLabel: (prefix, range) => `${prefix}${range} kabinetų zona`,
    roomsCountUnit: (count) => `${count} kab.`,
    noRoomInFloor: 'Šiame aukšte ieškomo kodo nerasta.',
    showFullRouteShort: 'Visas maršrutas',
    startFollowShort: 'Sekti kelią',
    slopeStairsLabel: 'Laiptų atkarpa',
    slopeStairsShort: 'Laiptai',
    slopeSteepUpLabel: (pct) => `Stati įkalnė (+${pct}%)`,
    slopeSteepUpShort: (pct) => `Stati ▲+${pct}%`,
    slopeGentleUpLabel: (pct) => `Įkalnės pandusas (+${pct}%)`,
    slopeGentleUpShort: (pct) => `Įkalnė ▲+${pct}%`,
    slopeSteepDownLabel: (pct) => `Stati nuokalnė (${pct}%)`,
    slopeSteepDownShort: (pct) => `Stati ▼${pct}%`,
    slopeGentleDownLabel: (pct) => `Nuokalnė (${pct}%)`,
    slopeGentleDownShort: (pct) => `Nuokalnė ▼${pct}%`,
    slopeFlatLabel: (pct) => `Lygus takas (${pct}%)`,
    slopeFlatShort: (pct) => `Lygus ${pct}%`,
    campusWalkway: 'Centrinis pėsčiųjų takas',
    arrivedTitle: (dest) => `Atvykote į ${dest}`,
    arrivedSub: 'Pasiekėte pastato įėjimą. Spustelėkite žymeklį auditorijoms peržiūrėti.',
    turnRightTitle: (dist) => `Už ${dist}m sukite dešinėn`,
    turnLeftTitle: (dist) => `Už ${dist}m sukite kairėn`,
    straightTitle: (dist, near) => `Tiesiai ${dist}m · ${near}`,
    turnSub: (from, to, slope) => `Kryptis ${from} → ${to} (${slope})`,
    straightSub: (dest, slope) => `Eikite taku link ${dest} (${slope})`,
    slopeUpWay: 'Įkalnės atkarpa',
    slopeDownWay: 'Nuokalnės atkarpa',
    slopeFlatWay: 'Pėsčiųjų takas',
    remainMeta: (dist, min, pct) => `Liko ${dist}m · ~${min} min. (${pct}%)`,
    currentPosBadge: (near) => `Vieta: ${near}`,
    switchTo2DBtn: '2D žemėlapis',
    switchTo3DBtn: '3D žemėlapis',
    cameraLockOn: 'Kamera seka mane',
    cameraLockOff: 'Laisvas žemėlapis',
    exitFollowBtn: 'Baigti',
    slopeProfileTitle: 'Maršruto aukščio ir šlaitų profilis (Spustelėkite grafiką)',
    legendFlat: 'Lygus',
    legendGentle: 'Pandusas',
    legendSteepUp: 'Stati įkalnė',
    legendDown: 'Nuokalnė',
    pauseBtn: 'Pristabdyti',
    replayBtn: 'Kartoti nuo pradžių',
    playBtn: 'Paleisti sekimą',
    prevSegBtn: 'Atgal',
    nextSegBtn: 'Pirmyn',
    speedBtn: (mult) => `${mult}x greitis`,
    originResetBtn: 'Pradžia',
    navToggleOff: 'Išjungti navigaciją',
    navToggleOn: 'Įjungti navigaciją',
    followStopBtn: 'Baigti sekimą',
  },
  hi: {
    adminBtn: 'एडमिन',
    myLocTitle: 'मेरा वर्तमान स्थान',
    myLocGps: 'लाइव GPS',
    myLocFollow: 'मार्ग नेविगेशन चालू',
    myLocPin: 'कैंपस स्थान चयनित',
    nearText: (bName, distM) => `${bName} के पास (~${distM}m)`,
    nearShort: (bName, distM) => `${bName} के पास (${distM}m)`,
    insideShort: (bName) => `${bName} के अंदर`,
    insideText: (bName) => `${bName} भवन के अंदर`,
    coordElevText: (lat, lng, elev) => `अक्षांश ${lat}° · देशांतर ${lng}° · ऊँचाई ${elev}m`,
    gpsMyLocBtn: 'GPS स्थान',
    clickMapPrompt: 'नक्शे पर क्लिक करें',
    changeLocOnMapBtn: 'नक्शे पर स्थान बदलें',
    followMyViewBtn: 'मार्ग अनुसरण (Follow)',
    compassViewBtn: 'दिशा व्यू',
    compassViewOnTitle: 'फ़ोन दिशा कैमरा लॉक चालू (बंद करने के लिए क्लिक करें)',
    compassViewOffTitle: 'फ़ोन की दिशा के अनुसार 3D व्यू घुमाएं',
    floorPlanSectionTitle: 'मंज़िल लेआउट मानचित्र',
    floorPlanTapToZoom: 'मैप बड़ा देखें',
    floorPlanClose: 'मानचित्र बंद करें',
    floorPlanBadge: 'लेआउट',
    floorPlanCountBadge: (count) => `${count} मंज़िल मानचित्र`,
    quickJumpLabel: 'त्वरित स्थान:',
    topBarTitle3D: 'डोंगसियो विश्वविद्यालय 3D कैंपस मैप',
    topBarTitle2D: 'डोंगसियो विश्वविद्यालय 2D कैंपस मैप',
    topBarMyLocLabel: 'मेरा स्थान',
    topBarSub: (elev) => `ऊँचाई ${elev}m · भवन संख्या (1–31) और कमरा कोड (U001, NM101 आदि)`,
    btn2DMap: '2D नक्शा',
    btn3DMap: '3D कैंपस मैप',
    startBadge: 'प्रारंभ',
    endBadge: 'गंतव्य',
    myLocPillPrefix: 'मेरा स्थान',
    pickingBannerText: 'अपना वर्तमान स्थान सेट करने के लिए कैंपस के नक्शे पर कहीं भी क्लिक करें।',
    cancelBtn: 'रद्द करें',
    activeRouteCaption: (start, end, dist, slope) => `सक्रिय मार्ग: ${start} → ${end} (${dist}m · अधिकतम ढलान ${slope}%)`,
    floorsScale: (levels) => `${levels} मंज़िल`,
    roomCodePrefixLabel: 'कमरे',
    stadiumBanner: 'मुख्य स्टेडियम',
    angleTitle: '3D कोण',
    presetOrtho: 'ऑर्थो (68°)',
    presetIso: '3D दृश्य (35°)',
    presetFlat: 'टॉप-व्यू',
    resetTitle: 'डिफ़ॉल्ट दृश्य पर रीसेट करें',
    switchTo2DTitle: '2D नक्शे पर स्विच करें',
    toggleLabelsTitle: 'भवन के नाम दिखाएं/छिपाएं',
    zoomInTitle: 'ज़ूम इन',
    zoomOutTitle: 'ज़ूम आउट',
    fullCampusTitle: 'पूरा कैंपस देखें',
    touchGuideTitle: '3D टच और माउस गाइड',
    touchGuideBody: '1 उंगली / बायाँ ड्रैग: खिसकाएं · 2 उंगली / दायाँ ड्रैग: ज़ूम, 360° घुमाएं और झुकाएं · कमरे देखने के लिए पिन टैप करें',
    showFullRouteBtn: 'नक्शे पर पूरा रास्ता दिखाएं',
    followActiveBtn: 'मार्ग अनुसरण चल रहा है',
    followStartBtn: 'यूज़र-व्यू मार्ग अनुसरण शुरू करें',
    slopeCardTitle: 'ढलान और रास्ते का विवरण',
    slopeSegmentsCount: (count) => `${count} पैदल खंड`,
    segmentMoveDesc: (dist, e1, e2) => `${dist}m चलें (ऊँचाई ${e1}m → ${e2}m)`,
    slopeEdgesConnected: (count) => `${count} ढलान खंड जुड़े हुए हैं`,
    routeSummaryMsg: (dist, min, up, slope) => `कुल ${dist}m · ~${min} मिनट · चढ़ाई ${up}m / अधिकतम ढलान ${slope}%`,
    gpsOutsideMsg: 'आपका GPS कैंपस के बाहर है। अपना स्थान चुनने के लिए नक्शे पर क्लिक करें।',
    campusNumBreadcrumb: (num) => `भवन संख्या #${num}`,
    roomCodeBreadcrumb: (prefix) => `कोड ${prefix}`,
    fromMyLocDist: (dist) => `आपसे ${dist}m दूर`,
    elevValue: (elev) => `ऊँचाई ${elev}m`,
    startFollowCardTitle: 'यूज़र-व्यू मार्ग नेविगेशन शुरू करें',
    floorsAndRoomsCount: (floors, rooms) => `${floors} मंज़िल · ${rooms} कमरे`,
    allFloorsTab: (rooms) => `सभी (${rooms})`,
    roomSearchPlaceholder: (prefix) => `${prefix}001, ${prefix}101, लैब, कार्यालय खोजें...`,
    floorZoneLabel: (prefix, range) => `${prefix}${range} कमरा क्षेत्र`,
    roomsCountUnit: (count) => `${count} कमरे`,
    noRoomInFloor: 'इस मंज़िल पर कोई मेल खाता कमरा कोड नहीं मिला।',
    showFullRouteShort: 'पूरा रास्ता देखें',
    startFollowShort: 'नेविगेशन शुरू करें',
    slopeStairsLabel: 'सीढ़ियों वाला भाग',
    slopeStairsShort: 'सीढ़ियाँ',
    slopeSteepUpLabel: (pct) => `तेज़ चढ़ाई (+${pct}%)`,
    slopeSteepUpShort: (pct) => `तेज़ ▲+${pct}%`,
    slopeGentleUpLabel: (pct) => `रैंप चढ़ाई (+${pct}%)`,
    slopeGentleUpShort: (pct) => `चढ़ाई ▲+${pct}%`,
    slopeSteepDownLabel: (pct) => `तेज़ ढलान (${pct}%)`,
    slopeSteepDownShort: (pct) => `ढलान ▼${pct}%`,
    slopeGentleDownLabel: (pct) => `सामान्य ढलान (${pct}%)`,
    slopeGentleDownShort: (pct) => `ढलान ▼${pct}%`,
    slopeFlatLabel: (pct) => `समतल रास्ता (${pct}%)`,
    slopeFlatShort: (pct) => `समतल ${pct}%`,
    campusWalkway: 'कैंपस केंद्रीय पथ',
    arrivedTitle: (dest) => `${dest} पर पहुँचे`,
    arrivedSub: 'आप भवन के प्रवेश द्वार पर पहुँच गए हैं। कमरों (U001, NM101) के लिए मार्कर टैप करें।',
    turnRightTitle: (dist) => `${dist}m आगे दाएं मुड़ें`,
    turnLeftTitle: (dist) => `${dist}m आगे बाएं मुड़ें`,
    straightTitle: (dist, near) => `${dist}m सीधे चलें · ${near}`,
    turnSub: (from, to, slope) => `${from} → ${to} की ओर (${slope})`,
    straightSub: (dest, slope) => `${dest} की ओर पथ का अनुसरण करें (${slope})`,
    slopeUpWay: 'चढ़ाई वाला रैंप',
    slopeDownWay: 'ढलान वाला रैंप',
    slopeFlatWay: 'पैदल पथ',
    remainMeta: (dist, min, pct) => `${dist}m शेष · ~${min} मिनट (${pct}%)`,
    currentPosBadge: (near) => `स्थान: ${near}`,
    switchTo2DBtn: '2D नक्शे पर जाएं',
    switchTo3DBtn: '3D नक्शे पर जाएं',
    cameraLockOn: 'कैमरा लॉक चालू',
    cameraLockOff: 'मुक्त नक्शा मूव',
    exitFollowBtn: 'बंद करें',
    slopeProfileTitle: 'मार्ग ऊँचाई और ढलान प्रोफ़ाइल (कूदने के लिए ग्राफ़ पर क्लिक करें)',
    legendFlat: 'समतल',
    legendGentle: 'हल्का रैंप',
    legendSteepUp: 'तेज़ चढ़ाई',
    legendDown: 'ढलान',
    pauseBtn: 'रोकें',
    replayBtn: 'शुरू से चलाएं',
    playBtn: 'नेविगेशन चलाएं',
    prevSegBtn: 'पिछला',
    nextSegBtn: 'अगला',
    speedBtn: (mult) => `${mult}x गति`,
    originResetBtn: 'प्रारंभ',
    navToggleOff: 'नेविगेशन बंद करें',
    navToggleOn: 'नेविगेशन चालू करें',
    followStopBtn: 'अनुसरण बंद करें',
  },
}
