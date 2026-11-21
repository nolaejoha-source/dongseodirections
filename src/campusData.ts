// Auto-generated from verified OpenStreetMap building polygons, official Dongseo University Campus Map, and Open-Meteo elevation data.

export const CAMPUS_CENTER: [number, number] = [35.14495, 129.00945]

export const CAMPUS_BOUNDS: [[number, number], [number, number]] = [
  [35.1402, 129.0025],
  [35.1495, 129.0165],
]

// Exact Dongseo University Jurye Campus polygon [lat, lng] (Counter-Clockwise)
export const CAMPUS_BOUNDARY: [number, number][] = [[35.14318, 129.00598], [35.14278, 129.0062], [35.14278, 129.00708], [35.14244, 129.00752], [35.14245, 129.00786], [35.14295, 129.00865], [35.14318, 129.00887], [35.14339, 129.01138], [35.14389, 129.0133], [35.14435, 129.01332], [35.14498, 129.01304], [35.14498, 129.01208], [35.14533, 129.01207], [35.14587, 129.01186], [35.14626, 129.01138], [35.14681, 129.01117], [35.14672, 129.01003], [35.14665, 129.0094], [35.14658, 129.00805], [35.14645, 129.00645], [35.14585, 129.0063], [35.1451, 129.00675], [35.14447, 129.00685], [35.14363, 129.00631], [35.14318, 129.00598]]

// Outer mask ring (Clockwise) with an inner cutout hole (Counter-Clockwise) for Dongseo University campus only
export const CAMPUS_MASK_POLYGON: [number, number][][] = [
  [
    [35.165, 128.985],
    [35.165, 129.035],
    [35.125, 129.035],
    [35.125, 128.985],
  ],
  CAMPUS_BOUNDARY,
]

export type CampusNode = {
  id: string
  building_id: number | null
  location: { type: 'Point'; coordinates: [number, number] }
  elevation: number
}

export type CampusEdge = {
  id: string
  from_node: string
  to_node: string
  distance_m: number
  slope_pct: number
  is_step_free: boolean
  bidirectional: boolean
  accessible: boolean
}

export const SEEDED_BUILDINGS_RAW = [
  {
    "id": 18,
    "num": 1,
    "way_id": 742661083,
    "name": "국제협력관",
    "name_en": "International Cooperation Building",
    "lat": 35.144083,
    "lng": 129.010437,
    "levels": 9,
    "aliases": [
      "1번",
      "CO",
      "CO101",
      "CO104",
      "CO201",
      "CO205",
      "CO301",
      "CO304",
      "CO401",
      "CO406",
      "CO501",
      "CO505",
      "CO601",
      "CO604",
      "CO701",
      "CO801",
      "CO901",
      "국제협력관",
      "민석교양대학",
      "학생상담센터"
    ],
    "footprint": [
      [
        35.144141,
        129.010611
      ],
      [
        35.144227,
        129.010574
      ],
      [
        35.144255,
        129.010503
      ],
      [
        35.144171,
        129.010353
      ],
      [
        35.144049,
        129.010255
      ],
      [
        35.143874,
        129.010204
      ],
      [
        35.143888,
        129.01036
      ],
      [
        35.143996,
        129.010404
      ],
      [
        35.144088,
        129.010489
      ],
      [
        35.144141,
        129.010611
      ]
    ],
    "floor_details": [
      {
        "floor": 1,
        "label": "1F",
        "facilities": [
          {
            "code": "CO101",
            "name": "[CO101] 학생상담센터 · 심리검사소 (1101호)",
            "category": "행정·지원",
            "note": "재학생 심리상담 및 진로적성 검사"
          },
          {
            "code": "CO104",
            "name": "[CO104] 장애학생지원센터",
            "category": "행정·지원",
            "note": "이동 및 학습 보조기기 지원 센터"
          }
        ]
      },
      {
        "floor": 2,
        "label": "2F",
        "facilities": [
          {
            "code": "CO201",
            "name": "[CO201] 민석교양대학 행정실 (1201호)",
            "category": "학과사무실",
            "note": "교양 필수·선택 교과목 학사 안내"
          },
          {
            "code": "CO205",
            "name": "[CO205] 교양 글쓰기·토론 클리닉룸",
            "category": "강의실",
            "note": "의사소통 및 발표 클리닉 강의실"
          }
        ]
      },
      {
        "floor": 3,
        "label": "3F",
        "facilities": [
          {
            "code": "CO301",
            "name": "[CO301] 일반대학원 통합교학팀",
            "category": "대학원",
            "note": "석·박사 학위과정 행정 지원실"
          },
          {
            "code": "CO304",
            "name": "[CO304] 대학원 합동세미나실",
            "category": "대학원",
            "note": "학위논문 심사 및 세미나실"
          }
        ]
      },
      {
        "floor": 4,
        "label": "4F",
        "facilities": [
          {
            "code": "CO401",
            "name": "[CO401] 교양융합 강의실 401",
            "category": "강의실",
            "note": "인문·교양 중형 강의실"
          },
          {
            "code": "CO406",
            "name": "[CO406] 교양대학 교수연구실 (CO405~412)",
            "category": "교수연구실",
            "note": "전임교원 연구실"
          }
        ]
      },
      {
        "floor": 5,
        "label": "5F",
        "facilities": [
          {
            "code": "CO501",
            "name": "[CO501] 부총장실 · 대외협력실",
            "category": "대학본부",
            "note": "대외교류 및 국제협력 집무실"
          },
          {
            "code": "CO505",
            "name": "[CO505] 교수연구실 (CO504~510)",
            "category": "교수연구실",
            "note": "전임교원 연구실"
          }
        ]
      },
      {
        "floor": 6,
        "label": "6F~7F",
        "facilities": [
          {
            "code": "CO601",
            "name": "[CO601] 동아시아학과 사무실 · 캠퍼스아시아사업단",
            "category": "학과사무실",
            "note": "한·중·일 공동학위 프로그램 운영실"
          },
          {
            "code": "CO604",
            "name": "[CO604] 국제지역학 강의실",
            "category": "강의실",
            "note": "동아시아 지역학 전공 강의실"
          },
          {
            "code": "CO701",
            "name": "[CO701] 전임교원 교수연구실 (CO701~712)",
            "category": "교수연구실",
            "note": "7층 교수연구실 구역"
          }
        ]
      },
      {
        "floor": 8,
        "label": "8F~9F",
        "facilities": [
          {
            "code": "CO801",
            "name": "[CO801] 일본연구센터 · 국제학술실",
            "category": "연구소",
            "note": "한일 관계 및 일본 문화·경제 연구소"
          },
          {
            "code": "CO901",
            "name": "[CO901] 국제협력 세미나 강의실 (CO901~904)",
            "category": "강의실",
            "note": "9층 세미나 및 심화 강의실"
          }
        ]
      }
    ],
    "elevation": 159.0,
    "code_prefix": "CO",
    "code_range": "CO101 ~ CO904",
    "department_summary": "민석교양대학 · 학생상담센터 · 일반대학원 · 동아시아학과 · 일본연구센터",
    "roof_color": "#5b7c99",
    "wall_color": "#e2ecf5",
    "wall_side_color": "#b8cce0",
    "accent_color": "#3b82f6",
    "shape_type": "curved"
  },
  {
    "id": 6,
    "num": 2,
    "way_id": 742661079,
    "name": "전자정보관",
    "name_en": "Electronic Information Building",
    "lat": 35.144697,
    "lng": 129.009538,
    "levels": 6,
    "aliases": [
      "2번",
      "EL",
      "EL101",
      "EL104",
      "EL201",
      "EL205",
      "EL301",
      "EL304",
      "EL306",
      "EL401",
      "EL405",
      "EL410",
      "EL501",
      "EL504",
      "EL510",
      "EL601",
      "EL606",
      "이공대학",
      "전자정보관",
      "팹랩"
    ],
    "footprint": [
      [
        35.144724,
        129.008951
      ],
      [
        35.144606,
        129.008963
      ],
      [
        35.144641,
        129.009501
      ],
      [
        35.144549,
        129.00954
      ],
      [
        35.144565,
        129.009724
      ],
      [
        35.144651,
        129.009716
      ],
      [
        35.144785,
        129.010231
      ],
      [
        35.1449,
        129.010191
      ],
      [
        35.144775,
        129.009685
      ],
      [
        35.14475,
        129.009466
      ],
      [
        35.144724,
        129.008951
      ]
    ],
    "floor_details": [
      {
        "floor": 1,
        "label": "1F",
        "facilities": [
          {
            "code": "EL101",
            "name": "[EL101] 이공대학 통합행정실 (2101호)",
            "category": "학과사무실",
            "note": "전자·건축·토목·공학계열 학사 행정실"
          },
          {
            "code": "EL104",
            "name": "[EL104] 창의능력개발공간 · 라운지",
            "category": "실습·연구",
            "note": "공학도 창의 설계 및 스터디 라운지"
          }
        ]
      },
      {
        "floor": 2,
        "label": "2F",
        "facilities": [
          {
            "code": "EL201",
            "name": "[EL201] 팹랩 부산 (Fab Lab · 메이커스페이스)",
            "category": "실습·연구",
            "note": "3D프린터·CNC·레이저커터 시제품 제작소"
          },
          {
            "code": "EL205",
            "name": "[EL205] 창의공학설계 강의실",
            "category": "강의실",
            "note": "공학설계 입문 및 실습 강의실"
          }
        ]
      },
      {
        "floor": 3,
        "label": "3F",
        "facilities": [
          {
            "code": "EL301",
            "name": "[EL301] 미래커리어대학 행정실",
            "category": "학과사무실",
            "note": "성인학습자 및 평생교육 단과대학 행정실"
          },
          {
            "code": "EL304",
            "name": "[EL304] 전자회로·마이크로프로세서 실험실",
            "category": "실습·연구",
            "note": "오실로스코프 및 디지털 회로 실험실"
          },
          {
            "code": "EL306",
            "name": "[EL306] 사회복지상담학과 사무실 (2306호)",
            "category": "학과사무실",
            "note": "미래커리어대학 학과 사무실"
          }
        ]
      },
      {
        "floor": 4,
        "label": "4F",
        "facilities": [
          {
            "code": "EL401",
            "name": "[EL401] 건축공학·구조역학 실습실",
            "category": "실습·연구",
            "note": "건축 구조 및 시공 시뮬레이션 실습실"
          },
          {
            "code": "EL405",
            "name": "[EL405] 전자·통신시스템 실습실",
            "category": "실습·연구",
            "note": "통신공학 및 회로설계 실습실"
          },
          {
            "code": "EL410",
            "name": "[EL410] 이공대학 교수연구실 (EL408~415)",
            "category": "교수연구실",
            "note": "전임교원 연구실"
          }
        ]
      },
      {
        "floor": 5,
        "label": "5F",
        "facilities": [
          {
            "code": "EL501",
            "name": "[EL501] 전공이론 강의실 501",
            "category": "강의실",
            "note": "공학 수학 및 전공 이론 강의실"
          },
          {
            "code": "EL504",
            "name": "[EL504] 전공이론 강의실 504",
            "category": "강의실",
            "note": "스마트공학 멀티미디어 강의실"
          },
          {
            "code": "EL510",
            "name": "[EL510] 교수연구실 (EL508~516)",
            "category": "교수연구실",
            "note": "이공대학 교원 연구실"
          }
        ]
      },
      {
        "floor": 6,
        "label": "6F",
        "facilities": [
          {
            "code": "EL601",
            "name": "[EL601] 창의설계스튜디오 (건축·토목)",
            "category": "실습·연구",
            "note": "졸업설계 및 캡스톤 제도 스튜디오"
          },
          {
            "code": "EL606",
            "name": "[EL606] 공학연구실 · 교수연구실",
            "category": "교수연구실",
            "note": "전임교원 및 대학원 연구실"
          }
        ]
      }
    ],
    "elevation": 132.0,
    "code_prefix": "EL",
    "code_range": "EL101 ~ EL608",
    "department_summary": "이공대학 · 팹랩(Fab Lab) · 전자공학 · 건축/토목 · 미래커리어대학",
    "roof_color": "#24579e",
    "wall_color": "#d97746",
    "wall_side_color": "#b5592e",
    "accent_color": "#f8fafc",
    "shape_type": "prism"
  },
  {
    "id": 7,
    "num": 3,
    "way_id": 759012057,
    "name": "보건의료관 I",
    "name_en": "Healthcare Center I",
    "lat": 35.143939,
    "lng": 129.008217,
    "levels": 6,
    "aliases": [
      "3번",
      "HC",
      "HC101",
      "HC103",
      "HC201",
      "HC204",
      "HC301",
      "HC303",
      "HC306",
      "HC401",
      "HC404",
      "HC501",
      "HC506",
      "HC601",
      "HC604",
      "동서스포츠클리닉센터",
      "보건의료관",
      "보건의료관 1",
      "보건의료관 I"
    ],
    "footprint": [
      [
        35.144097,
        129.008592
      ],
      [
        35.143879,
        129.008626
      ],
      [
        35.143867,
        129.008506
      ],
      [
        35.143921,
        129.008498
      ],
      [
        35.14387,
        129.008014
      ],
      [
        35.143887,
        129.008011
      ],
      [
        35.143879,
        129.007943
      ],
      [
        35.143822,
        129.007952
      ],
      [
        35.143818,
        129.007907
      ],
      [
        35.143915,
        129.007892
      ],
      [
        35.143923,
        129.007968
      ],
      [
        35.143991,
        129.007957
      ],
      [
        35.144037,
        129.008398
      ],
      [
        35.144076,
        129.008391
      ],
      [
        35.144097,
        129.008592
      ]
    ],
    "floor_details": [
      {
        "floor": 1,
        "label": "1F",
        "facilities": [
          {
            "code": "HC101",
            "name": "[HC101] 바이오헬스융합대학 교학팀 (3101호)",
            "category": "학과사무실",
            "note": "간호·임상병리·보건의료 계열 행정실"
          },
          {
            "code": "HC103",
            "name": "[HC103] 간호학과 전공강의실 1",
            "category": "강의실",
            "note": "기본간호학 및 성인간호학 강의실"
          }
        ]
      },
      {
        "floor": 2,
        "label": "2F",
        "facilities": [
          {
            "code": "HC201",
            "name": "[HC201] 기본간호학 실습실",
            "category": "실습·연구",
            "note": "병동 환경 베드 및 간호술기 실습실"
          },
          {
            "code": "HC204",
            "name": "[HC204] 간호시뮬레이션 센터 (BLS센터)",
            "category": "실습·연구",
            "note": "응급간호 및 고충실도 시뮬레이터 실습"
          }
        ]
      },
      {
        "floor": 3,
        "label": "3F",
        "facilities": [
          {
            "code": "HC301",
            "name": "[HC301] 임상병리학과 학과사무실",
            "category": "학과사무실",
            "note": "임상병리학과 학사 및 국가고시 안내"
          },
          {
            "code": "HC303",
            "name": "[HC303] 임상미생물·혈액학 실험실",
            "category": "실습·연구",
            "note": "진단검사 및 현미경 분석 실험실"
          },
          {
            "code": "HC306",
            "name": "[HC306] 조직병리·분자진단 실험실",
            "category": "실습·연구",
            "note": "PCR 및 유전자 진단 실습실"
          }
        ]
      },
      {
        "floor": 4,
        "label": "4F",
        "facilities": [
          {
            "code": "HC401",
            "name": "[HC401] 간호학과 계단식 강의실",
            "category": "강의실",
            "note": "간호학과 합동 이론 강의실"
          },
          {
            "code": "HC404",
            "name": "[HC404] 국가고시 준비실 (나이팅게일실)",
            "category": "도서관·열람",
            "note": "간호사·임상병리사 국가고시 정독실"
          }
        ]
      },
      {
        "floor": 5,
        "label": "5F",
        "facilities": [
          {
            "code": "HC501",
            "name": "[HC501] 모성·아동간호 시뮬레이션실",
            "category": "실습·연구",
            "note": "분만·신생아 간호 임상 시뮬레이션"
          },
          {
            "code": "HC506",
            "name": "[HC506] 보건의료 교수연구실 (HC505~512)",
            "category": "교수연구실",
            "note": "간호·임상병리 전임교원 연구실"
          }
        ]
      },
      {
        "floor": 6,
        "label": "6F",
        "facilities": [
          {
            "code": "HC601",
            "name": "[HC601] 보건의료 세미나실 ·PBL룸",
            "category": "강의실",
            "note": "임상 케이스 스터디 및 토론 강의실"
          },
          {
            "code": "HC604",
            "name": "[HC604] 정신·지역사회간호 강의실",
            "category": "강의실",
            "note": "전공 이론 및 실습 디브리핑룸"
          }
        ]
      }
    ],
    "elevation": 147.0,
    "code_prefix": "HC",
    "code_range": "HC101 ~ HC606",
    "department_summary": "바이오헬스융합대학 · 간호학과 · 임상병리학과",
    "roof_color": "#24579e",
    "wall_color": "#f1f5f9",
    "wall_side_color": "#cbd5e1",
    "accent_color": "#c2410c",
    "shape_type": "prism"
  },
  {
    "id": 8,
    "num": 4,
    "way_id": 759012058,
    "name": "응용공학관",
    "name_en": "Applied Engineering Building",
    "lat": 35.143695,
    "lng": 129.007729,
    "levels": 6,
    "aliases": [
      "4번",
      "AE",
      "AE101",
      "AE104",
      "AE106",
      "AE201",
      "AE206",
      "AE301",
      "AE304",
      "AE401",
      "AE405",
      "AE416",
      "AE501",
      "AE505",
      "AE601",
      "AE604",
      "응용공학관"
    ],
    "footprint": [
      [
        35.143803,
        129.008029
      ],
      [
        35.143762,
        129.008048
      ],
      [
        35.143696,
        129.007992
      ],
      [
        35.143652,
        129.008065
      ],
      [
        35.143608,
        129.00803
      ],
      [
        35.143599,
        129.00796
      ],
      [
        35.143649,
        129.007938
      ],
      [
        35.143605,
        129.007408
      ],
      [
        35.143585,
        129.00741
      ],
      [
        35.143578,
        129.007297
      ],
      [
        35.143626,
        129.007292
      ],
      [
        35.14363,
        129.007347
      ],
      [
        35.14371,
        129.007339
      ],
      [
        35.143716,
        129.007407
      ],
      [
        35.143765,
        129.007398
      ],
      [
        35.143807,
        129.007833
      ],
      [
        35.143751,
        129.007839
      ],
      [
        35.143764,
        129.00795
      ],
      [
        35.1438,
        129.007974
      ],
      [
        35.143803,
        129.008029
      ]
    ],
    "floor_details": [
      {
        "floor": 1,
        "label": "1F",
        "facilities": [
          {
            "code": "AE101",
            "name": "[AE101] 일반화학·생화학 실험실",
            "category": "실습·연구",
            "note": "기초 화학 합성 및 생화학 분석 실험실"
          },
          {
            "code": "AE104",
            "name": "[AE104] 한-EU 국제협력센터",
            "category": "연구소",
            "note": "유럽 대학 공동연구 및 국제교류 센터"
          },
          {
            "code": "AE106",
            "name": "[AE106] 식품영양학과 학과사무실 (4106호)",
            "category": "학과사무실",
            "note": "식품영양학 전공 학사 행정실"
          }
        ]
      },
      {
        "floor": 2,
        "label": "2F",
        "facilities": [
          {
            "code": "AE201",
            "name": "[AE201] 정밀기기 공동실험실",
            "category": "실습·연구",
            "note": "HPLC·GC·분광분석기 등 정밀 분석실"
          },
          {
            "code": "AE206",
            "name": "[AE206] 응용공학 교수연구실 (AE205~212)",
            "category": "교수연구실",
            "note": "교원 연구 및 실험 지도실"
          }
        ]
      },
      {
        "floor": 3,
        "label": "3F",
        "facilities": [
          {
            "code": "AE301",
            "name": "[AE301] 식품가공·조리과학 실험실",
            "category": "실습·연구",
            "note": "단체급식 및 실험조리 실습실"
          },
          {
            "code": "AE304",
            "name": "[AE304] 식품미생물·발효공학 실험실",
            "category": "실습·연구",
            "note": "식품 위생 및 미생물 배양 실험실"
          }
        ]
      },
      {
        "floor": 4,
        "label": "4F",
        "facilities": [
          {
            "code": "AE401",
            "name": "[AE401] 신소재·나노소재 실험실",
            "category": "실습·연구",
            "note": "이차전지 및 기능성 고분자 소재 실험실"
          },
          {
            "code": "AE405",
            "name": "[AE405] 바이오제약 공정 실험실",
            "category": "실습·연구",
            "note": "의약품 제제 및 세포배양 실험실"
          },
          {
            "code": "AE416",
            "name": "[AE416] 바이오제약공학과 사무실 (4416호)",
            "category": "학과사무실",
            "note": "바이오제약공학과 학사 행정실"
          }
        ]
      },
      {
        "floor": 5,
        "label": "5F",
        "facilities": [
          {
            "code": "AE501",
            "name": "[AE501] 에너지·환경공학 실험실",
            "category": "실습·연구",
            "note": "수질·대기 환경 분석 및 신재생에너지 랩"
          },
          {
            "code": "AE505",
            "name": "[AE505] 스마트모빌리티 제어 실습실",
            "category": "실습·연구",
            "note": "자율주행 센서 및 전장 제어 실습실"
          }
        ]
      },
      {
        "floor": 6,
        "label": "6F",
        "facilities": [
          {
            "code": "AE601",
            "name": "[AE601] 응용공학 합동강의실 1",
            "category": "강의실",
            "note": "공학계열 전공 이론 강의실"
          },
          {
            "code": "AE604",
            "name": "[AE604] 응용공학 세미나실 2",
            "category": "강의실",
            "note": "캡스톤 발표 및 학술 세미나실"
          }
        ]
      }
    ],
    "elevation": 147.0,
    "code_prefix": "AE",
    "code_range": "AE101 ~ AE605",
    "department_summary": "바이오제약공학 · 식품영양학 · 신소재/화학 · 스마트모빌리티",
    "roof_color": "#24579e",
    "wall_color": "#f1f5f9",
    "wall_side_color": "#cbd5e1",
    "accent_color": "#1e40af",
    "shape_type": "prism"
  },
  {
    "id": 5,
    "num": 5,
    "way_id": 469947484,
    "name": "산학협력관",
    "name_en": "Industry-Academic Cooperation Hall",
    "lat": 35.145307,
    "lng": 129.008671,
    "levels": 5,
    "aliases": [
      "5번",
      "SH",
      "SH101",
      "SH104",
      "SH201",
      "SH205",
      "SH301",
      "SH304",
      "SH401",
      "SH403",
      "SH406",
      "SH501",
      "SH503",
      "산학협력관",
      "창업보육센터"
    ],
    "footprint": [
      [
        35.145463,
        129.008447
      ],
      [
        35.145512,
        129.008866
      ],
      [
        35.145474,
        129.008926
      ],
      [
        35.145353,
        129.00896
      ],
      [
        35.145322,
        129.008925
      ],
      [
        35.14531,
        129.008848
      ],
      [
        35.144891,
        129.008941
      ],
      [
        35.14485,
        129.008667
      ],
      [
        35.145284,
        129.00857
      ],
      [
        35.145272,
        129.008488
      ],
      [
        35.145304,
        129.008459
      ],
      [
        35.145373,
        129.008427
      ],
      [
        35.145423,
        129.00843
      ],
      [
        35.145463,
        129.008447
      ]
    ],
    "floor_details": [
      {
        "floor": 1,
        "label": "1F",
        "facilities": [
          {
            "code": "SH101",
            "name": "[SH101] I.C 융합강의실",
            "category": "강의실",
            "note": "산학연계 합동 강의실"
          },
          {
            "code": "SH104",
            "name": "[SH104] 산학 미디어 스튜디오",
            "category": "미디어·스튜디오",
            "note": "기업 홍보 콘텐츠 및 라이브커머스 촬영실"
          }
        ]
      },
      {
        "floor": 2,
        "label": "2F",
        "facilities": [
          {
            "code": "SH201",
            "name": "[SH201] 산학 연구마을 (기업부설연구소)",
            "category": "연구소",
            "note": "산학협력 입주기업 공동 연구실"
          },
          {
            "code": "SH205",
            "name": "[SH205] 대학원 융합강의실",
            "category": "대학원",
            "note": "산학대학원 야간·주말 강의실"
          }
        ]
      },
      {
        "floor": 3,
        "label": "3F",
        "facilities": [
          {
            "code": "SH301",
            "name": "[SH301] 창업보육센터 행정실",
            "category": "행정·산학",
            "note": "입주 스타트업 경영·기술 지원 센터"
          },
          {
            "code": "SH304",
            "name": "[SH304] 학생 창업공간 (Start-up Zone)",
            "category": "실습·연구",
            "note": "창업동아리 입주 오피스 구역"
          }
        ]
      },
      {
        "floor": 4,
        "label": "4F",
        "facilities": [
          {
            "code": "SH401",
            "name": "[SH401] 경찰학과 전공강의실",
            "category": "강의실",
            "note": "형법·범죄학·경찰학 이론 강의실"
          },
          {
            "code": "SH403",
            "name": "[SH403] 공무원·경찰 고시실 (청운실)",
            "category": "도서관·열람",
            "note": "경찰공무원 시험 준비 전용 열람실"
          },
          {
            "code": "SH406",
            "name": "[SH406] 경호·무도 실습실",
            "category": "실습·연구",
            "note": "호신술 및 체포술 훈련 실습장"
          }
        ]
      },
      {
        "floor": 5,
        "label": "5F",
        "facilities": [
          {
            "code": "SH501",
            "name": "[SH501] 산학협력관 대강당",
            "category": "공연·문화",
            "note": "채플 및 대규모 학술 특강 강당"
          },
          {
            "code": "SH503",
            "name": "[SH503] 교목실 · 신앙상담실",
            "category": "행정·지원",
            "note": "교목 행정 및 학생 인성·신앙 상담"
          }
        ]
      }
    ],
    "elevation": 106.0,
    "code_prefix": "SH",
    "code_range": "SH101 ~ SH503",
    "department_summary": "창업보육센터 · 경찰학과 · 경호전공 · 대강당",
    "roof_color": "#1d4ed8",
    "wall_color": "#f1f5f9",
    "wall_side_color": "#cbd5e1",
    "accent_color": "#1e3a8a",
    "shape_type": "prism"
  },
  {
    "id": 19,
    "num": 6,
    "way_id": 742661082,
    "name": "어문관",
    "name_en": "Language & Literature Hall",
    "lat": 35.144072,
    "lng": 129.010945,
    "levels": 9,
    "aliases": [
      "6번",
      "LL",
      "LL101",
      "LL103",
      "LL107",
      "LL201",
      "LL205",
      "LL301",
      "LL306",
      "LL401",
      "LL406",
      "LL502",
      "LL601",
      "LL701",
      "LL801",
      "LL901",
      "LL902",
      "솔루션데스크",
      "어문관"
    ],
    "footprint": [
      [
        35.144141,
        129.010757
      ],
      [
        35.14426,
        129.010815
      ],
      [
        35.14418,
        129.010988
      ],
      [
        35.144055,
        129.0111
      ],
      [
        35.143888,
        129.011155
      ],
      [
        35.143877,
        129.011046
      ],
      [
        35.144005,
        129.010995
      ],
      [
        35.144105,
        129.010893
      ],
      [
        35.144141,
        129.010757
      ]
    ],
    "floor_details": [
      {
        "floor": 1,
        "label": "1F",
        "facilities": [
          {
            "code": "LL101",
            "name": "[LL101] 메이크 스페이스 (Make Space)",
            "category": "실습·연구",
            "note": "외국어 스터디 및 글로벌 라운지"
          },
          {
            "code": "LL103",
            "name": "[LL103] 학생원스톱 솔루션데스크",
            "category": "행정·지원",
            "note": "증명서 발급 및 학사 민원 통합 창구"
          },
          {
            "code": "LL107",
            "name": "[LL107] 달란트개발센터 (6107호)",
            "category": "행정·지원",
            "note": "학생 역량 개발 및 비교과 코칭"
          }
        ]
      },
      {
        "floor": 2,
        "label": "2F",
        "facilities": [
          {
            "code": "LL201",
            "name": "[LL201] 중국어학과 전공강의실",
            "category": "강의실",
            "note": "중국어 회화 및 통번역 강의실"
          },
          {
            "code": "LL205",
            "name": "[LL205] 중국어학과 교수연구실 (LL205~212)",
            "category": "교수연구실",
            "note": "중국어전공 교원 연구실"
          }
        ]
      },
      {
        "floor": 3,
        "label": "3F",
        "facilities": [
          {
            "code": "LL301",
            "name": "[LL301] 일본어학과 학과사무실 · 강의실",
            "category": "학과사무실",
            "note": "일본어학과 학사 안내 및 어학 실습"
          },
          {
            "code": "LL306",
            "name": "[LL306] 일본어학과 교수연구실 (LL306~314)",
            "category": "교수연구실",
            "note": "일본어전공 교원 연구실"
          }
        ]
      },
      {
        "floor": 4,
        "label": "4F~5F",
        "facilities": [
          {
            "code": "LL401",
            "name": "[LL401] 영어학과 학과사무실 · 멀티미디어어학실",
            "category": "학과사무실",
            "note": "영어학과 행정 및 어학 실습실"
          },
          {
            "code": "LL406",
            "name": "[LL406] 영어학과 교수연구실 (6406호 외)",
            "category": "교수연구실",
            "note": "4~5층 영어학과 교수연구실"
          },
          {
            "code": "LL502",
            "name": "[LL502] 비즈니스영어·통번역 실습실",
            "category": "실습·연구",
            "note": "동시통역 부스 및 어학 실습실"
          }
        ]
      },
      {
        "floor": 6,
        "label": "6F~8F",
        "facilities": [
          {
            "code": "LL601",
            "name": "[LL601] 외국어 회화 소강의실 (LL601~608)",
            "category": "강의실",
            "note": "원어민 소그룹 회화 전용 강의실"
          },
          {
            "code": "LL701",
            "name": "[LL701] 중국연구센터 (China Research Center)",
            "category": "연구소",
            "note": "중국 경제·문화 학술 연구소"
          },
          {
            "code": "LL801",
            "name": "[LL801] 어문계열 합동강의실 (LL801~805)",
            "category": "강의실",
            "note": "8층 어학 강의실"
          }
        ]
      },
      {
        "floor": 9,
        "label": "9F",
        "facilities": [
          {
            "code": "LL901",
            "name": "[LL901] CBT 어학평가실 1 (Computer Based Test)",
            "category": "실습·연구",
            "note": "토익·모의어학시험 및 컴퓨터 시험장"
          },
          {
            "code": "LL902",
            "name": "[LL902] CBT 어학평가실 2",
            "category": "실습·연구",
            "note": "온라인 외국어 능력 진단 평가실"
          }
        ]
      }
    ],
    "elevation": 160.0,
    "code_prefix": "LL",
    "code_range": "LL101 ~ LL902",
    "department_summary": "영어학과 · 일본어학과 · 중국어학과 · 솔루션데스크 · CBT실",
    "roof_color": "#4d7c6f",
    "wall_color": "#e2ecf5",
    "wall_side_color": "#b8cce0",
    "accent_color": "#0d9488",
    "shape_type": "curved"
  },
  {
    "id": 20,
    "num": 7,
    "way_id": 742661085,
    "name": "국제관",
    "name_en": "International Studies Building",
    "lat": 35.143556,
    "lng": 129.010942,
    "levels": 5,
    "aliases": [
      "7번",
      "IS",
      "IS101",
      "IS104",
      "IS201",
      "IS301",
      "IS401",
      "IS501",
      "국제관",
      "차이니스카페"
    ],
    "footprint": [
      [
        35.143591,
        129.010679
      ],
      [
        35.143594,
        129.01074
      ],
      [
        35.143638,
        129.01074
      ],
      [
        35.143638,
        129.011076
      ],
      [
        35.143597,
        129.01109
      ],
      [
        35.1436,
        129.011121
      ],
      [
        35.143722,
        129.011117
      ],
      [
        35.143733,
        129.011229
      ],
      [
        35.143408,
        129.01126
      ],
      [
        35.143402,
        129.011148
      ],
      [
        35.143483,
        129.011134
      ],
      [
        35.143461,
        129.01109
      ],
      [
        35.14345,
        129.010757
      ],
      [
        35.143477,
        129.010727
      ],
      [
        35.143538,
        129.010737
      ],
      [
        35.143533,
        129.010685
      ],
      [
        35.143591,
        129.010679
      ]
    ],
    "floor_details": [
      {
        "floor": 1,
        "label": "1F",
        "facilities": [
          {
            "code": "IS101",
            "name": "[IS101] 차이니스 카페 · 글로벌 문화라운지",
            "category": "식당·카페",
            "note": "외국어 교류 카페 및 휴게 공간"
          },
          {
            "code": "IS104",
            "name": "[IS104] 국제학 교원 연구실 (IS104~108)",
            "category": "교수연구실",
            "note": "1층 교수연구실"
          }
        ]
      },
      {
        "floor": 2,
        "label": "2F~3F",
        "facilities": [
          {
            "code": "IS201",
            "name": "[IS201] 국제학·글로벌통상 강의실 A",
            "category": "강의실",
            "note": "국제통상 및 글로벌지역학 강의실"
          },
          {
            "code": "IS301",
            "name": "[IS301] 국제학 세미나실 B",
            "category": "강의실",
            "note": "원어 토론 및 팀 발표 강의실"
          }
        ]
      },
      {
        "floor": 4,
        "label": "4F~5F",
        "facilities": [
          {
            "code": "IS401",
            "name": "[IS401] 국제관 전공강의실 (IS401~405)",
            "category": "강의실",
            "note": "다국적 학생 합동 수업 강의실"
          },
          {
            "code": "IS501",
            "name": "[IS501] 국제관 교수연구실 (IS501~508)",
            "category": "교수연구실",
            "note": "전임교원 연구실"
          }
        ]
      }
    ],
    "elevation": 160.0,
    "code_prefix": "IS",
    "code_range": "IS101 ~ IS508",
    "department_summary": "국제학부 · 글로벌통상 · 차이니스카페",
    "roof_color": "#64748b",
    "wall_color": "#f8fafc",
    "wall_side_color": "#cbd5e1",
    "accent_color": "#475569",
    "shape_type": "prism"
  },
  {
    "id": 21,
    "num": 8,
    "way_id": 742661084,
    "name": "경영관",
    "name_en": "Business Administration Building",
    "lat": 35.143584,
    "lng": 129.010428,
    "levels": 6,
    "aliases": [
      "8번",
      "BA",
      "BA101",
      "BA103",
      "BA201",
      "BA204",
      "BA301",
      "BA304",
      "BA401",
      "BA406",
      "BA501",
      "BA504",
      "BA508",
      "BA601",
      "BA604",
      "경영관",
      "경영관식당"
    ],
    "footprint": [
      [
        35.143727,
        129.010112
      ],
      [
        35.143558,
        129.010119
      ],
      [
        35.143549,
        129.010333
      ],
      [
        35.143619,
        129.010343
      ],
      [
        35.143622,
        129.010414
      ],
      [
        35.14358,
        129.010411
      ],
      [
        35.143494,
        129.010306
      ],
      [
        35.1434,
        129.010438
      ],
      [
        35.143491,
        129.01056
      ],
      [
        35.143486,
        129.01069
      ],
      [
        35.143533,
        129.010685
      ],
      [
        35.143591,
        129.010679
      ],
      [
        35.143597,
        129.010584
      ],
      [
        35.143647,
        129.01053
      ],
      [
        35.143724,
        129.01053
      ],
      [
        35.143727,
        129.010112
      ]
    ],
    "floor_details": [
      {
        "floor": 1,
        "label": "1F",
        "facilities": [
          {
            "code": "BA101",
            "name": "[BA101] 글로벌비즈니스대학 통합행정실 (8101호)",
            "category": "학과사무실",
            "note": "경영·관광·물류·사회복지 학사 행정실"
          },
          {
            "code": "BA103",
            "name": "[BA103] 경영관 학생식당 · 카페테리아",
            "category": "식당·카페",
            "note": "상단 캠퍼스(경영·어문·도서관) 학생식당"
          }
        ]
      },
      {
        "floor": 2,
        "label": "2F",
        "facilities": [
          {
            "code": "BA201",
            "name": "[BA201] 계단식 케이스스터디 강의실 1",
            "category": "강의실",
            "note": "하버드 비즈니스 케이스 토론형 강의실"
          },
          {
            "code": "BA204",
            "name": "[BA204] 계단식 합동강의실 2",
            "category": "강의실",
            "note": "경영학 원론 및 특강 강의실"
          }
        ]
      },
      {
        "floor": 3,
        "label": "3F",
        "facilities": [
          {
            "code": "BA301",
            "name": "[BA301] 회계·세무 ERP 전산실습실",
            "category": "실습·연구",
            "note": "전산세무회계 및 경영정보시스템 실습"
          },
          {
            "code": "BA304",
            "name": "[BA304] 국제물류·무역실무 강의실",
            "category": "강의실",
            "note": "물류 시뮬레이션 및 무역학 강의실"
          }
        ]
      },
      {
        "floor": 4,
        "label": "4F",
        "facilities": [
          {
            "code": "BA401",
            "name": "[BA401] 글로벌비즈니스 전공강의실",
            "category": "강의실",
            "note": "마케팅·재무관리 이론 강의실"
          },
          {
            "code": "BA406",
            "name": "[BA406] 외국인교수 및 전임교원 연구실",
            "category": "교수연구실",
            "note": "글로벌비즈니스 교원 연구실"
          }
        ]
      },
      {
        "floor": 5,
        "label": "5F",
        "facilities": [
          {
            "code": "BA501",
            "name": "[BA501] 관광경영·컨벤션학과 사무실 (8501호)",
            "category": "학과사무실",
            "note": "호텔·관광·MICE 전공 학과사무실"
          },
          {
            "code": "BA504",
            "name": "[BA504] 경영학부·사회복지학과 행정실 (8504호)",
            "category": "학과사무실",
            "note": "학부 행정 및 학생 상담실"
          },
          {
            "code": "BA508",
            "name": "[BA508] 호텔·컨벤션 서비스 실습실",
            "category": "실습·연구",
            "note": "식음료 및 호텔 프런트 실무 실습실"
          }
        ]
      },
      {
        "floor": 6,
        "label": "6F",
        "facilities": [
          {
            "code": "BA601",
            "name": "[BA601] 경영학부 고시실 (CPA·세무사반)",
            "category": "도서관·열람",
            "note": "공인회계사·세무사·관세사 준비 열람실"
          },
          {
            "code": "BA604",
            "name": "[BA604] 경영관 자율열람실",
            "category": "도서관·열람",
            "note": "상단 캠퍼스 학생 전용 학습실"
          }
        ]
      }
    ],
    "elevation": 159.0,
    "code_prefix": "BA",
    "code_range": "BA101 ~ BA605",
    "department_summary": "글로벌비즈니스대학 · 경영학부 · 관광경영컨벤션 · 국제물류 · 경영관식당",
    "roof_color": "#64748b",
    "wall_color": "#f8fafc",
    "wall_side_color": "#cbd5e1",
    "accent_color": "#475569",
    "shape_type": "prism"
  },
  {
    "id": 3,
    "num": 9,
    "way_id": 469080346,
    "name": "디자인홀",
    "name_en": "Design Hall",
    "lat": 35.144663,
    "lng": 129.007588,
    "levels": 5,
    "aliases": [
      "9번",
      "DH",
      "DH101",
      "DH102",
      "DH105",
      "DH108",
      "DH201",
      "DH203",
      "DH204",
      "DH301",
      "DH304",
      "DH307",
      "DH309",
      "DH401",
      "DH405",
      "DH409",
      "DH501",
      "DH504",
      "DH510",
      "디자인관",
      "디자인홀"
    ],
    "footprint": [
      [
        35.144634,
        129.006982
      ],
      [
        35.144525,
        129.007002
      ],
      [
        35.144707,
        129.008496
      ],
      [
        35.144816,
        129.008476
      ],
      [
        35.144634,
        129.006982
      ]
    ],
    "floor_details": [
      {
        "floor": 1,
        "label": "1F",
        "facilities": [
          {
            "code": "DH101",
            "name": "[DH101] 디자인대학 통합행정실 (9101호)",
            "category": "학과사무실",
            "note": "디자인학부·건축·광고홍보 학사 행정실"
          },
          {
            "code": "DH102",
            "name": "[DH102] 디자인홀 갤러리 (D-Gallery)",
            "category": "전시·문화",
            "note": "학생 졸업작품 및 국제 초대전시관"
          },
          {
            "code": "DH105",
            "name": "[DH105] IFS 국제디자인스튜디오",
            "category": "실습·연구",
            "note": "국제 워크숍 및 융합 디자인 스튜디오"
          },
          {
            "code": "DH108",
            "name": "[DH108] 3D 프린팅·모형제작 워크숍",
            "category": "실습·연구",
            "note": "레이저커터 및 목공·조형 작업실"
          }
        ]
      },
      {
        "floor": 2,
        "label": "2F",
        "facilities": [
          {
            "code": "DH201",
            "name": "[DH201] 시각디자인 스튜디오 1",
            "category": "실습·연구",
            "note": "브랜드·편집·패키지 디자인 실습실"
          },
          {
            "code": "DH203",
            "name": "[DH203] 멀티미디어디자인 Mac 실습실",
            "category": "실습·연구",
            "note": "iMac 기반 그래픽·모션디자인 실습실"
          },
          {
            "code": "DH204",
            "name": "[DH204] 시각디자인 교수연구실 (DH204~210)",
            "category": "교수연구실",
            "note": "시각디자인전공 교수 연구 공간"
          }
        ]
      },
      {
        "floor": 3,
        "label": "3F",
        "facilities": [
          {
            "code": "DH301",
            "name": "[DH301] 환경·실내건축디자인 제도실",
            "category": "실습·연구",
            "note": "공간설계 및 CAD/BIM 디자인 스튜디오"
          },
          {
            "code": "DH304",
            "name": "[DH304] 제품·인터랙션 디자인 실습실",
            "category": "실습·연구",
            "note": "산업디자인 프로토타이핑 실습실"
          },
          {
            "code": "DH307",
            "name": "[DH307] 디지털미디어디자인 연구실 (9307호)",
            "category": "실습·연구",
            "note": "UI/UX 및 인터랙티브 미디어 연구"
          },
          {
            "code": "DH309",
            "name": "[DH309] 환경디자인 교수연구실 (9309호)",
            "category": "교수연구실",
            "note": "환경디자인전공 교수 연구실"
          }
        ]
      },
      {
        "floor": 4,
        "label": "4F",
        "facilities": [
          {
            "code": "DH401",
            "name": "[DH401] 통합 디자인 스튜디오 A",
            "category": "실습·연구",
            "note": "캡스톤 디자인 및 산학 프로젝트실"
          },
          {
            "code": "DH405",
            "name": "[DH405] 포토그래피·광고촬영 스튜디오",
            "category": "미디어·스튜디오",
            "note": "제품 및 인물 광고사진 촬영실"
          },
          {
            "code": "DH409",
            "name": "[DH409] 디지털미디어 연구실 (9409호)",
            "category": "교수연구실",
            "note": "미디어디자인 교수 연구 및 지도실"
          }
        ]
      },
      {
        "floor": 5,
        "label": "5F",
        "facilities": [
          {
            "code": "DH501",
            "name": "[DH501] 디자인 크리틱 세미나실",
            "category": "강의실",
            "note": "디자인 품평회 및 프레젠테이션 홀"
          },
          {
            "code": "DH504",
            "name": "[DH504] 공모전 준비실 (Red Dot / iF Lab)",
            "category": "실습·연구",
            "note": "국제 디자인 어워드 출품 프로젝트실"
          },
          {
            "code": "DH510",
            "name": "[DH510] 디자인대학 교수연구실 (DH508~512)",
            "category": "교수연구실",
            "note": "전임교원 연구실 구역"
          }
        ]
      }
    ],
    "elevation": 123.0,
    "code_prefix": "DH",
    "code_range": "DH101 ~ DH512",
    "department_summary": "디자인대학 · 시각디자인 · 디지털미디어디자인 · 환경/산업디자인",
    "roof_color": "#7c8ea0",
    "wall_color": "#f1f5f9",
    "wall_side_color": "#cbd5e1",
    "accent_color": "#dc2626",
    "shape_type": "design-hall"
  },
  {
    "id": 23,
    "num": 10,
    "way_id": null,
    "name": "그린홀",
    "name_en": "Green Hall",
    "lat": 35.14415,
    "lng": 129.00722,
    "elevation": 136.0,
    "levels": 5,
    "code_prefix": "GH",
    "code_range": "GH101 ~ GH505",
    "department_summary": "토목공학 실험실 · 작업치료학과 실습실 및 학과사무실",
    "aliases": [
      "그린홀",
      "Green Hall",
      "10번",
      "GH",
      "GH101",
      "GH301",
      "GH501",
      "작업치료학과"
    ],
    "footprint": [
      [
        35.143896,
        129.007195
      ],
      [
        35.144006,
        129.007431
      ],
      [
        35.144404,
        129.007245
      ],
      [
        35.144294,
        129.007009
      ],
      [
        35.143896,
        129.007195
      ]
    ],
    "floor_details": [
      {
        "floor": 1,
        "label": "1F",
        "facilities": [
          {
            "code": "GH101",
            "name": "[GH101] 토목공학 재료·토질 실험실",
            "category": "실습·연구",
            "note": "토목 구조 및 콘크리트·토질 시험실"
          }
        ]
      },
      {
        "floor": 2,
        "label": "2F",
        "facilities": [
          {
            "code": "GH201",
            "name": "[GH201] 수리·수문학 실험실 및 교수연구실",
            "category": "실습·연구",
            "note": "수리 실험 장치 및 전공 교수연구실"
          }
        ]
      },
      {
        "floor": 3,
        "label": "3F",
        "facilities": [
          {
            "code": "GH301",
            "name": "[GH301] 토목공학과 학과사무실 · 강의실",
            "category": "학과사무실",
            "note": "토목공학 전공 학사 행정실"
          }
        ]
      },
      {
        "floor": 4,
        "label": "4F",
        "facilities": [
          {
            "code": "GH401",
            "name": "[GH401] 작업치료학과 일상생활동작(ADL) 실습실",
            "category": "실습·연구",
            "note": "재활 및 감각통합 작업치료 실습실"
          }
        ]
      },
      {
        "floor": 5,
        "label": "5F",
        "facilities": [
          {
            "code": "GH501",
            "name": "[GH501] 작업치료학과 학과사무실 · 임상실습실",
            "category": "학과사무실",
            "note": "작업치료학과 행정 및 국가고시 준비실"
          }
        ]
      }
    ],
    "roof_color": "#2e7d32",
    "wall_color": "#eef5e9",
    "wall_side_color": "#c5d9b8",
    "accent_color": "#15803d",
    "shape_type": "prism"
  },
  {
    "id": 24,
    "num": 11,
    "way_id": null,
    "name": "드림e밸리",
    "name_en": "Dream E. Valley",
    "lat": 35.14448,
    "lng": 129.00855,
    "elevation": 134.0,
    "levels": 2,
    "code_prefix": "DV",
    "code_range": "DV001 ~ DV105",
    "department_summary": "창업동아리(A101~A124) · Q College (큐칼리지)",
    "aliases": [
      "드림e밸리",
      "드림e벨리",
      "Dream E Valley",
      "11번",
      "DV",
      "DV001",
      "DV101",
      "큐칼리지"
    ],
    "footprint": [
      [
        35.144442,
        129.008153
      ],
      [
        35.144284,
        129.008897
      ],
      [
        35.144518,
        129.008947
      ],
      [
        35.144676,
        129.008203
      ],
      [
        35.144442,
        129.008153
      ]
    ],
    "floor_details": [
      {
        "floor": -1,
        "label": "B1",
        "facilities": [
          {
            "code": "DV001",
            "name": "[DV001] 학생 창업동아리실 (A101~A124)",
            "category": "실습·연구",
            "note": "학생 스타트업 및 창업동아리 전용 공간"
          }
        ]
      },
      {
        "floor": 1,
        "label": "1F",
        "facilities": [
          {
            "code": "DV101",
            "name": "[DV101] Q College (큐칼리지) 프로젝트룸",
            "category": "강의실",
            "note": "혁신 교육과정 및 자기주도 프로젝트 공간"
          }
        ]
      }
    ],
    "roof_color": "#64748b",
    "wall_color": "#f1f5f9",
    "wall_side_color": "#cbd5e1",
    "accent_color": "#475569",
    "shape_type": "prism"
  },
  {
    "id": 15,
    "num": 12,
    "way_id": 790768123,
    "name": "국제생활관 1",
    "name_en": "International House I",
    "lat": 35.143596,
    "lng": 129.006738,
    "levels": 8,
    "aliases": [
      "12번",
      "IH",
      "IH001",
      "IH002",
      "IH101",
      "IH103",
      "IH201",
      "IH801",
      "국제생활관 1",
      "국제생활관1",
      "국제생활관Ⅰ"
    ],
    "footprint": [
      [
        35.143349,
        129.00679
      ],
      [
        35.14349,
        129.006443
      ],
      [
        35.14402,
        129.006766
      ],
      [
        35.143969,
        129.006891
      ],
      [
        35.143543,
        129.006631
      ],
      [
        35.143453,
        129.006853
      ],
      [
        35.143349,
        129.00679
      ]
    ],
    "floor_details": [
      {
        "floor": -1,
        "label": "B1",
        "facilities": [
          {
            "code": "IH001",
            "name": "[IH001] 공동취사실 · 다이닝룸",
            "category": "기숙사",
            "note": "유학생 및 사생 자율 조리 공간"
          },
          {
            "code": "IH002",
            "name": "[IH002] 무인세탁실 · 건조실",
            "category": "기숙사",
            "note": "코인 세탁기 및 다림질실"
          }
        ]
      },
      {
        "floor": 1,
        "label": "1F",
        "facilities": [
          {
            "code": "IH101",
            "name": "[IH101] 국제생활관 1 사감실 · 경비실",
            "category": "기숙사",
            "note": "출입 보안 및 우편물·택배 수령처"
          },
          {
            "code": "IH103",
            "name": "[IH103] 인터내셔널 소극장",
            "category": "공연·문화",
            "note": "기숙사 문화행사 및 영화 상영홀"
          }
        ]
      },
      {
        "floor": 2,
        "label": "2F~7F",
        "facilities": [
          {
            "code": "IH201",
            "name": "[IH201] 생활관 사생실 (IH201~IH714)",
            "category": "기숙사",
            "note": "재학생 및 교환학생 기숙사 호실"
          }
        ]
      },
      {
        "floor": 8,
        "label": "8F",
        "facilities": [
          {
            "code": "IH801",
            "name": "[IH801] 스카이라운지 · 정독실",
            "category": "기숙사",
            "note": "산자락 전망 휴게실 및 야간 스터디룸"
          }
        ]
      }
    ],
    "elevation": 133.0,
    "code_prefix": "IH",
    "code_range": "IH001 ~ IH801",
    "department_summary": "제1국제생활관 기숙사 · 소극장 · 스카이라운지",
    "roof_color": "#2e7d32",
    "wall_color": "#f5e6c8",
    "wall_side_color": "#dcc496",
    "accent_color": "#d97706",
    "shape_type": "curved"
  },
  {
    "id": 1,
    "num": 13,
    "way_id": 469080345,
    "name": "뉴밀레니엄관",
    "name_en": "New Millennium Hall",
    "lat": 35.145252,
    "lng": 129.007613,
    "levels": 15,
    "aliases": [
      "13번",
      "NM",
      "NM001",
      "NM002",
      "NM003",
      "NM005",
      "NM1001",
      "NM1008",
      "NM101",
      "NM102",
      "NM104",
      "NM108",
      "NM1101",
      "NM1103",
      "NM1201",
      "NM1204",
      "NM1301",
      "NM1305",
      "NM1401",
      "NM1410",
      "NM1501",
      "NM1502",
      "NM201",
      "NM210",
      "NM243",
      "NM245",
      "NM246",
      "NM301",
      "NM304",
      "NM308",
      "NM315",
      "NM401",
      "NM402",
      "NM403",
      "NM404",
      "NM408",
      "NM501",
      "NM503",
      "NM506",
      "NM512",
      "NM601",
      "NM604",
      "NM608",
      "NM701",
      "NM704",
      "NM708",
      "NM801",
      "NM804",
      "NM808",
      "NM901",
      "NM905",
      "NM910",
      "뉴밀레니엄관",
      "대학본부",
      "본관",
      "소향아트홀"
    ],
    "footprint": [
      [
        35.145349,
        129.00718
      ],
      [
        35.144981,
        129.007247
      ],
      [
        35.145106,
        129.008264
      ],
      [
        35.145474,
        129.008196
      ],
      [
        35.145349,
        129.00718
      ]
    ],
    "floor_details": [
      {
        "floor": -1,
        "label": "B1",
        "facilities": [
          {
            "code": "NM001",
            "name": "[NM001] 종합영상스튜디오 A",
            "category": "미디어·스튜디오",
            "note": "대형 크로마키 및 방송 촬영 스튜디오"
          },
          {
            "code": "NM002",
            "name": "[NM002] 종합음향녹음실 · 폴리룸",
            "category": "미디어·스튜디오",
            "note": "더빙 및 사운드 믹싱 실습실"
          },
          {
            "code": "NM003",
            "name": "[NM003] 디지털색보정·종합편집실",
            "category": "미디어·스튜디오",
            "note": "4K 영상 편집 및 DI 실습실"
          },
          {
            "code": "NM005",
            "name": "[NM005] 지하주차장 · 기계전기실",
            "category": "편의·관리",
            "note": "캠퍼스 순환로 직결 지하주차장"
          }
        ]
      },
      {
        "floor": 1,
        "label": "1F",
        "facilities": [
          {
            "code": "NM101",
            "name": "[NM101] 다빈치 카페 · 베이커리 라운지",
            "category": "편의시설",
            "note": "학생 및 방문객 휴게 카페테리아"
          },
          {
            "code": "NM102",
            "name": "[NM102] 방송영상장비대여실",
            "category": "미디어·스튜디오",
            "note": "카메라·조명·음향 촬영장비 대여 센터"
          },
          {
            "code": "NM104",
            "name": "[NM104] 오픈 스튜디오 · 전시로비",
            "category": "미디어·스튜디오",
            "note": "1층 메인 로비 미디어 전시홀"
          },
          {
            "code": "NM108",
            "name": "[NM108] 캠퍼스 통합안내데스크",
            "category": "행정·지원",
            "note": "방문객 안내 및 보안 데스크"
          }
        ]
      },
      {
        "floor": 2,
        "label": "2F",
        "facilities": [
          {
            "code": "NM201",
            "name": "[NM201] 소향아트홀 대공연장",
            "category": "공연·문화",
            "note": "1,100석 규모 뮤지컬·콘서트 전문 공연장"
          },
          {
            "code": "NM210",
            "name": "[NM210] 아시아미래디자인연구소",
            "category": "연구소",
            "note": "디자인 혁신 및 국제 산학 연구센터"
          },
          {
            "code": "NM243",
            "name": "[NM243] 동서미디어센터 제작실",
            "category": "미디어·스튜디오",
            "note": "교내 방송국 및 콘텐츠 제작실"
          },
          {
            "code": "NM245",
            "name": "[NM245] 뉴미디어 콘텐츠 실험실",
            "category": "실습·연구",
            "note": "실감미디어 및 VFX 연구실"
          },
          {
            "code": "NM246",
            "name": "[NM246] 방송편집 아카이브실",
            "category": "미디어·스튜디오",
            "note": "영상 미디어 편집 및 서버실"
          }
        ]
      },
      {
        "floor": 3,
        "label": "3F",
        "facilities": [
          {
            "code": "NM301",
            "name": "[NM301] 미디어커뮤니케이션학부 사무실",
            "category": "학과사무실",
            "note": "미디어커뮤니케이션학부 학사 행정 안내"
          },
          {
            "code": "NM304",
            "name": "[NM304] 저널리즘·방송화법 강의실",
            "category": "강의실",
            "note": "미디어커뮤니케이션 전공 이론 강의실"
          },
          {
            "code": "NM308",
            "name": "[NM308] 디지털방송제작 실습실",
            "category": "실습·연구",
            "note": "1인 미디어 및 방송 제작 실습"
          },
          {
            "code": "NM315",
            "name": "[NM315] 미디어학부 교수연구실 (315~324)",
            "category": "교수연구실",
            "note": "전임교원 연구실 구역"
          }
        ]
      },
      {
        "floor": 4,
        "label": "4F",
        "facilities": [
          {
            "code": "NM401",
            "name": "[NM401] 교무처 · 학사지원팀",
            "category": "대학본부",
            "note": "수강신청·성적·졸업 등 학사 행정 본부"
          },
          {
            "code": "NM402",
            "name": "[NM402] 사무처 · 총무인사팀",
            "category": "대학본부",
            "note": "대학 행정 및 시설 총괄 부서"
          },
          {
            "code": "NM403",
            "name": "[NM403] 국제처 · 글로벌교류팀",
            "category": "대학본부",
            "note": "유학생 지원 및 해외 교환학생 행정"
          },
          {
            "code": "NM404",
            "name": "[NM404] 첨단멀티미디어강의실 · 중형시사실",
            "category": "강의실",
            "note": "계단식 시청각 시사 및 합동 강의실"
          },
          {
            "code": "NM408",
            "name": "[NM408] 교육혁신본부 · 교수학습개발센터",
            "category": "행정·지원",
            "note": "비교과 프로그램 및 학습 지원"
          }
        ]
      },
      {
        "floor": 5,
        "label": "5F",
        "facilities": [
          {
            "code": "NM501",
            "name": "[NM501] 패션디자인학과 학과사무실",
            "category": "학과사무실",
            "note": "패션디자인학과 행정 및 상담"
          },
          {
            "code": "NM503",
            "name": "[NM503] 의복구성·패턴메이킹 실습실",
            "category": "실습·연구",
            "note": "패션 봉제 및 패턴 제작 스튜디오"
          },
          {
            "code": "NM506",
            "name": "[NM506] 텍스타일·패션CAD 실습실",
            "category": "실습·연구",
            "note": "3D 버추얼 패션 디자인 실습실"
          },
          {
            "code": "NM512",
            "name": "[NM512] 패션디자인 교수연구실 (512~520)",
            "category": "교수연구실",
            "note": "패션디자인 전공 교수연구실"
          }
        ]
      },
      {
        "floor": 6,
        "label": "6F",
        "facilities": [
          {
            "code": "NM601",
            "name": "[NM601] 한중뉴미디어대학 행정실",
            "category": "학과사무실",
            "note": "국제 합작 교육과정 행정지원실"
          },
          {
            "code": "NM604",
            "name": "[NM604] 뉴미디어 기획 강의실 1",
            "category": "강의실",
            "note": "멀티미디어 프로젝션 강의실"
          },
          {
            "code": "NM608",
            "name": "[NM608] 게임·애니메이션 융합실습실",
            "category": "실습·연구",
            "note": "디지털 콘텐츠 제작 실습실"
          }
        ]
      },
      {
        "floor": 7,
        "label": "7F",
        "facilities": [
          {
            "code": "NM701",
            "name": "[NM701] 디자인전문대학원 교학과",
            "category": "대학원",
            "note": "석·박사 과정 학사 행정실"
          },
          {
            "code": "NM704",
            "name": "[NM704] 대학원 세미나실 A",
            "category": "강의실",
            "note": "대학원 심화 세미나 및 논문 발표실"
          },
          {
            "code": "NM708",
            "name": "[NM708] 융합디자인 프로젝트실",
            "category": "실습·연구",
            "note": "대학원생 연구 프로젝트 공간"
          }
        ]
      },
      {
        "floor": 8,
        "label": "8F",
        "facilities": [
          {
            "code": "NM801",
            "name": "[NM801] 산학협력단 본부",
            "category": "행정·산학",
            "note": "산학연구 과제 및 기술이전 전담 부서"
          },
          {
            "code": "NM804",
            "name": "[NM804] LINC 3.0 사업단 운영실",
            "category": "행정·산학",
            "note": "산학연 협력 선도대학 사업단"
          },
          {
            "code": "NM808",
            "name": "[NM808] 창업지원단 · 학생창업상담실",
            "category": "행정·산학",
            "note": "스타트업 인큐베이팅 및 창업 멘토링"
          }
        ]
      },
      {
        "floor": 9,
        "label": "9F",
        "facilities": [
          {
            "code": "NM901",
            "name": "[NM901] 사상발전연구소 · 지역사회연구소",
            "category": "연구소",
            "note": "지역 현안 및 산학관 협력 연구소"
          },
          {
            "code": "NM905",
            "name": "[NM905] 인문사회 학술연구실",
            "category": "연구소",
            "note": "국책 연구과제 수행 연구 공간"
          },
          {
            "code": "NM910",
            "name": "[NM910] 교수연구실 (910~922)",
            "category": "교수연구실",
            "note": "전임교원 연구실 구역"
          }
        ]
      },
      {
        "floor": 10,
        "label": "10F",
        "facilities": [
          {
            "code": "NM1001",
            "name": "[NM1001] 전공심화 세미나실",
            "category": "강의실",
            "note": "소규모 토론 및 세미나 강의실"
          },
          {
            "code": "NM1008",
            "name": "[NM1008] 융합연구 교수연구실 (1004~1018)",
            "category": "교수연구실",
            "note": "교수 연구 및 학생 면담실"
          }
        ]
      },
      {
        "floor": 11,
        "label": "11F",
        "facilities": [
          {
            "code": "NM1101",
            "name": "[NM1101] 총장실 · 비서실",
            "category": "대학본부",
            "note": "동서대학교 총장 집무실"
          },
          {
            "code": "NM1103",
            "name": "[NM1103] 대회의실 · 글로벌화상회의실",
            "category": "대학본부",
            "note": "교무위원 회의 및 국제 협약식장"
          }
        ]
      },
      {
        "floor": 12,
        "label": "12F",
        "facilities": [
          {
            "code": "NM1201",
            "name": "[NM1201] 학교법인 동서학원 재단사무국",
            "category": "대학본부",
            "note": "법인 행정 사무국"
          },
          {
            "code": "NM1204",
            "name": "[NM1204] 법무감사실 · 기획회의실",
            "category": "대학본부",
            "note": "내부 감사 및 법무 지원실"
          }
        ]
      },
      {
        "floor": 13,
        "label": "13F",
        "facilities": [
          {
            "code": "NM1301",
            "name": "[NM1301] 기획연구처 · 대학혁신지원사업단",
            "category": "대학본부",
            "note": "대학 중장기 발전계획 및 예산 기획"
          },
          {
            "code": "NM1305",
            "name": "[NM1305] IR센터 · 데이터성과분석실",
            "category": "대학본부",
            "note": "교육 성과 및 통계 분석 센터"
          }
        ]
      },
      {
        "floor": 14,
        "label": "14F",
        "facilities": [
          {
            "code": "NM1401",
            "name": "[NM1401] 글로벌 VIP 게스트룸 (1401~1408)",
            "category": "편의·영빈관",
            "note": "해외 석학 및 초빙교수 숙소"
          },
          {
            "code": "NM1410",
            "name": "[NM1410] 스카이 리셉션 라운지",
            "category": "편의·영빈관",
            "note": "외빈 접견 라운지"
          }
        ]
      },
      {
        "floor": 15,
        "label": "15F",
        "facilities": [
          {
            "code": "NM1501",
            "name": "[NM1501] 스카이 교직원식당",
            "category": "식당·카페",
            "note": "파노라마 캠퍼스 전망 식당"
          },
          {
            "code": "NM1502",
            "name": "[NM1502] 스카이라운지 카페 · 전망대",
            "category": "식당·카페",
            "note": "15층 캠퍼스 조망 휴게 라운지"
          }
        ]
      }
    ],
    "elevation": 97.0,
    "code_prefix": "NM",
    "code_range": "NM001 ~ NM1503",
    "department_summary": "대학본부 · 미디어커뮤니케이션 · 패션디자인 · 소향아트홀",
    "roof_color": "#0284c7",
    "wall_color": "#bae6fd",
    "wall_side_color": "#7dd3fc",
    "accent_color": "#0369a1",
    "shape_type": "tower-podium"
  },
  {
    "id": 2,
    "num": 14,
    "way_id": 469080344,
    "name": "U-IT관",
    "name_en": "U-IT Building",
    "lat": 35.145669,
    "lng": 129.007242,
    "levels": 8,
    "aliases": [
      "14번",
      "U",
      "U-IT관",
      "U001",
      "U002",
      "U003",
      "U004",
      "U101",
      "U102",
      "U107",
      "U108",
      "U110",
      "U201",
      "U202",
      "U209",
      "U212",
      "U302",
      "U303",
      "U308",
      "U310",
      "U401",
      "U403",
      "U405",
      "U408",
      "U501",
      "U504",
      "U510",
      "U601",
      "U602",
      "U605",
      "U701",
      "U705",
      "U709",
      "U801",
      "U803",
      "U805",
      "UIT관",
      "유아이티관"
    ],
    "footprint": [
      [
        35.145819,
        129.007678
      ],
      [
        35.145706,
        129.007701
      ],
      [
        35.145607,
        129.006981
      ],
      [
        35.145518,
        129.007004
      ],
      [
        35.145502,
        129.006852
      ],
      [
        35.145708,
        129.0068
      ],
      [
        35.145819,
        129.007678
      ]
    ],
    "floor_details": [
      {
        "floor": -1,
        "label": "B1",
        "facilities": [
          {
            "code": "U001",
            "name": "[U001] 컴퓨터공학 이론강의실",
            "category": "강의실",
            "note": "컴퓨터공학 기초 및 전공 이론 강의실"
          },
          {
            "code": "U002",
            "name": "[U002] 멀티미디어 영상강의실",
            "category": "강의실",
            "note": "시청각 프로젝션 대형 강의실"
          },
          {
            "code": "U003",
            "name": "[U003] U-IT 대강의실 (계단식)",
            "category": "강의실",
            "note": "합동 특강 및 학부 세미나 대강의실"
          },
          {
            "code": "U004",
            "name": "[U004] SW 기초 일반강의실",
            "category": "강의실",
            "note": "프로그래밍 기초 이론 강의실"
          }
        ]
      },
      {
        "floor": 1,
        "label": "1F",
        "facilities": [
          {
            "code": "U101",
            "name": "[U101] U-IT 융합 스튜디오",
            "category": "실습·연구",
            "note": "XR/VR 및 인터랙티브 미디어 실습실"
          },
          {
            "code": "U102",
            "name": "[U102] ICT 프로젝트 실습실",
            "category": "실습·연구",
            "note": "팀 프로젝트 기반 코딩 및 서버 실습실"
          },
          {
            "code": "U107",
            "name": "[U107] 네트워크 설계 응용 실험실",
            "category": "실습·연구",
            "note": "라우터·스위치 및 클라우드 네트워크 실습"
          },
          {
            "code": "U108",
            "name": "[U108] U-임베디드 시스템 실습실",
            "category": "실습·연구",
            "note": "마이크로컨트롤러 및 펌웨어 실습실"
          },
          {
            "code": "U110",
            "name": "[U110] 정보통신 실험실",
            "category": "실습·연구",
            "note": "무선통신 및 신호처리 실험실"
          }
        ]
      },
      {
        "floor": 2,
        "label": "2F",
        "facilities": [
          {
            "code": "U201",
            "name": "[U201] 창의능력개발실 · SW라운지",
            "category": "실습·연구",
            "note": "학생 자율 코딩 및 해커톤 스터디 공간"
          },
          {
            "code": "U202",
            "name": "[U202] 캡스톤 프로젝트실 1",
            "category": "실습·연구",
            "note": "산학연계 캡스톤디자인 팀 작업실"
          },
          {
            "code": "U209",
            "name": "[U209] 그래픽 프로그래밍 실습실",
            "category": "실습·연구",
            "note": "3D 컴퓨터 그래픽스 및 게임엔진 실습실"
          },
          {
            "code": "U212",
            "name": "[U212] 캡스톤 설계 실습실",
            "category": "실습·연구",
            "note": "하드웨어·소프트웨어 융합 설계실"
          }
        ]
      },
      {
        "floor": 3,
        "label": "3F",
        "facilities": [
          {
            "code": "U302",
            "name": "[U302] 캡스톤 프로젝트실 2",
            "category": "실습·연구",
            "note": "졸업작품 및 산학 프로젝트 개발실"
          },
          {
            "code": "U303",
            "name": "[U303] 인터넷·웹 프로그래밍 실습실",
            "category": "실습·연구",
            "note": "풀스택 웹/모바일 앱 개발 실습실"
          },
          {
            "code": "U308",
            "name": "[U308] 임베디드 소프트웨어 실습실",
            "category": "실습·연구",
            "note": "IoT 센서 및 임베디드 리눅스 실습실"
          },
          {
            "code": "U310",
            "name": "[U310] 스마트 소프트웨어 실습실",
            "category": "실습·연구",
            "note": "모바일 및 클라우드 SW 실습실"
          }
        ]
      },
      {
        "floor": 4,
        "label": "4F",
        "facilities": [
          {
            "code": "U401",
            "name": "[U401] 소프트웨어융합대학 행정실",
            "category": "학과사무실",
            "note": "컴퓨터공학·AI·정보보안 학사 행정실"
          },
          {
            "code": "U403",
            "name": "[U403] 정보보안·사이버포렌식 실습실",
            "category": "실습·연구",
            "note": "네트워크 보안 및 모의해킹 실습실"
          },
          {
            "code": "U405",
            "name": "[U405] SW 컨셉디자인룸",
            "category": "실습·연구",
            "note": "UI/UX 및 소프트웨어 아키텍처 설계실"
          },
          {
            "code": "U408",
            "name": "[U408] 알고리즘·자료구조 강의실",
            "category": "강의실",
            "note": "전공 필수 이론 및 코딩 강의실"
          }
        ]
      },
      {
        "floor": 5,
        "label": "5F",
        "facilities": [
          {
            "code": "U501",
            "name": "[U501] SW 툴교육센터 (Tool Center)",
            "category": "실습·연구",
            "note": "최신 개발 툴 및 클라우드 플랫폼 실습"
          },
          {
            "code": "U504",
            "name": "[U504] 인공지능·머신러닝 실습실",
            "category": "실습·연구",
            "note": "GPU 워크스테이션 딥러닝 실습실"
          },
          {
            "code": "U510",
            "name": "[U510] 컴퓨터공학 교수연구실 (508~518)",
            "category": "교수연구실",
            "note": "전임교원 연구실 구역"
          }
        ]
      },
      {
        "floor": 6,
        "label": "6F",
        "facilities": [
          {
            "code": "U601",
            "name": "[U601] 첨단강의실 1 (스마트클래스)",
            "category": "강의실",
            "note": "전자칠판 및 원격강의 시스템 완비"
          },
          {
            "code": "U602",
            "name": "[U602] 국제세미나실 · 학술발표장",
            "category": "강의실",
            "note": "IT 국제 학술대회 및 초청 특강실"
          },
          {
            "code": "U605",
            "name": "[U605] 첨단강의실 2",
            "category": "강의실",
            "note": "PBL(문제해결형) 그룹 수업 강의실"
          }
        ]
      },
      {
        "floor": 7,
        "label": "7F",
        "facilities": [
          {
            "code": "U701",
            "name": "[U701] AI+X 융합연구센터 (1A1 연구소)",
            "category": "연구소",
            "note": "인공지능 융합 국책과제 연구센터"
          },
          {
            "code": "U705",
            "name": "[U705] 빅데이터·클라우드 연구실",
            "category": "연구소",
            "note": "대학원 데이터사이언스 연구실"
          },
          {
            "code": "U709",
            "name": "[U709] 데이터베이스 실습실",
            "category": "실습·연구",
            "note": "DB 설계 및 대용량 데이터 처리 실습실"
          }
        ]
      },
      {
        "floor": 8,
        "label": "8F",
        "facilities": [
          {
            "code": "U801",
            "name": "[U801] 상상 아뜰리에 · SW창작소",
            "category": "실습·연구",
            "note": "창의 아이디어 시제품 및 스타트업 랩"
          },
          {
            "code": "U803",
            "name": "[U803] BK21 인공지능 연구실",
            "category": "연구소",
            "note": "석·박사 고급 인재 양성 연구실"
          },
          {
            "code": "U805",
            "name": "[U805] 미래ICT 융합세미나실",
            "category": "강의실",
            "note": "대학원 연구 발표 및 세미나실"
          }
        ]
      }
    ],
    "elevation": 88.0,
    "code_prefix": "U",
    "code_range": "U001 ~ U805",
    "department_summary": "소프트웨어융합대학 · 컴퓨터공학 · AI공학 · 정보보안",
    "roof_color": "#475569",
    "wall_color": "#f1f5f9",
    "wall_side_color": "#cbd5e1",
    "accent_color": "#0284c7",
    "shape_type": "prism"
  },
  {
    "id": 25,
    "num": 15,
    "way_id": null,
    "name": "바이오헬스관",
    "name_en": "Bio Health Hall",
    "lat": 35.14328,
    "lng": 129.00812,
    "elevation": 154.0,
    "levels": 4,
    "code_prefix": "BH",
    "code_range": "BH101 ~ BH404",
    "department_summary": "바이오헬스융합 실험실 · 헬스케어 실습실",
    "aliases": [
      "바이오헬스관",
      "Bio Health Hall",
      "15번",
      "BH",
      "BH101",
      "BH201"
    ],
    "footprint": [
      [
        35.143168,
        129.007842
      ],
      [
        35.143044,
        129.008305
      ],
      [
        35.143392,
        129.008398
      ],
      [
        35.143516,
        129.007935
      ],
      [
        35.143168,
        129.007842
      ]
    ],
    "floor_details": [
      {
        "floor": 1,
        "label": "1F",
        "facilities": [
          {
            "code": "BH101",
            "name": "[BH101] 바이오헬스 기초실험실",
            "category": "실습·연구",
            "note": "생명과학 및 바이오 분석 실습실"
          }
        ]
      },
      {
        "floor": 2,
        "label": "2F",
        "facilities": [
          {
            "code": "BH201",
            "name": "[BH201] 스마트헬스케어 기기 실습실",
            "category": "실습·연구",
            "note": "웨어러블 및 디지털 헬스케어 실습"
          }
        ]
      },
      {
        "floor": 3,
        "label": "3F",
        "facilities": [
          {
            "code": "BH301",
            "name": "[BH301] 바이오헬스 전공강의실",
            "category": "강의실",
            "note": "바이오헬스융합대학 이론 강의실"
          }
        ]
      },
      {
        "floor": 4,
        "label": "4F",
        "facilities": [
          {
            "code": "BH401",
            "name": "[BH401] 바이오헬스 연구실",
            "category": "연구소",
            "note": "산학 공동 바이오 연구 공간"
          }
        ]
      }
    ],
    "roof_color": "#c26d48",
    "wall_color": "#f5ebe1",
    "wall_side_color": "#d9c3b0",
    "accent_color": "#9a3412",
    "shape_type": "prism"
  },
  {
    "id": 11,
    "num": 16,
    "way_id": 744531513,
    "name": "학생문화관 (문화센터)",
    "name_en": "Student Culture Center",
    "lat": 35.146412,
    "lng": 129.009769,
    "levels": 9,
    "aliases": [
      "16번",
      "CC",
      "CC001",
      "CC003",
      "CC1001",
      "CC101",
      "CC103",
      "CC401",
      "CC403",
      "CC701",
      "CC705",
      "CC801",
      "문화센터",
      "콘서트홀",
      "학생문화관"
    ],
    "footprint": [
      [
        35.146386,
        129.009318
      ],
      [
        35.146212,
        129.009411
      ],
      [
        35.146336,
        129.009835
      ],
      [
        35.146351,
        129.009835
      ],
      [
        35.14636,
        129.009872
      ],
      [
        35.14637,
        129.009872
      ],
      [
        35.14638,
        129.009902
      ],
      [
        35.146403,
        129.009927
      ],
      [
        35.146429,
        129.009934
      ],
      [
        35.146464,
        129.009932
      ],
      [
        35.146487,
        129.009906
      ],
      [
        35.146504,
        129.009869
      ],
      [
        35.146507,
        129.009833
      ],
      [
        35.146498,
        129.009792
      ],
      [
        35.146512,
        129.009756
      ],
      [
        35.146386,
        129.009318
      ]
    ],
    "floor_details": [
      {
        "floor": -1,
        "label": "B1",
        "facilities": [
          {
            "code": "CC001",
            "name": "[CC001] 문화센터 콘서트홀",
            "category": "공연·문화",
            "note": "음악회·연극·공연예술 무대 홀"
          },
          {
            "code": "CC003",
            "name": "[CC003] 공연분장실 · 리허설룸",
            "category": "공연·문화",
            "note": "공연 준비 및 악기 연습실"
          }
        ]
      },
      {
        "floor": 1,
        "label": "1F",
        "facilities": [
          {
            "code": "CC101",
            "name": "[CC101] 문화센터 안내로비 · 라운지",
            "category": "편의시설",
            "note": "정문 인접 방문객 맞이 로비"
          },
          {
            "code": "CC103",
            "name": "[CC103] 평생교육원 상담실",
            "category": "행정·지원",
            "note": "지역주민 평생학습 강좌 안내"
          }
        ]
      },
      {
        "floor": 4,
        "label": "4F",
        "facilities": [
          {
            "code": "CC401",
            "name": "[CC401] 정보통신센터 · 전산운영팀",
            "category": "행정·지원",
            "note": "캠퍼스 와이파이·포털·네트워크 기술지원"
          },
          {
            "code": "CC403",
            "name": "[CC403] 통합 클라우드 서버실",
            "category": "행정·지원",
            "note": "대학 학사행정 메인 데이터센터"
          }
        ]
      },
      {
        "floor": 7,
        "label": "7F",
        "facilities": [
          {
            "code": "CC701",
            "name": "[CC701] 부산디지털대학교 교학처",
            "category": "행정·지원",
            "note": "사이버대학 학사 행정 본부"
          },
          {
            "code": "CC705",
            "name": "[CC705] 원격콘텐츠 제작 스튜디오",
            "category": "미디어·스튜디오",
            "note": "온라인 강의 촬영 및 편집실"
          }
        ]
      },
      {
        "floor": 8,
        "label": "8F",
        "facilities": [
          {
            "code": "CC801",
            "name": "[CC801] 부산디지털대학교 교수연구실",
            "category": "교수연구실",
            "note": "전임교원 연구실 및 회의실"
          }
        ]
      },
      {
        "floor": 10,
        "label": "10F",
        "facilities": [
          {
            "code": "CC1001",
            "name": "[CC1001] 문화센터 교직원식당 · 연회장",
            "category": "식당·카페",
            "note": "10층 전망 식당 및 세미나 오찬장"
          }
        ]
      }
    ],
    "elevation": 97.0,
    "code_prefix": "CC",
    "code_range": "CC001 ~ CC1001",
    "department_summary": "콘서트홀 · 정보통신센터 · 부산디지털대학교",
    "roof_color": "#0369a1",
    "wall_color": "#bae6fd",
    "wall_side_color": "#7dd3fc",
    "accent_color": "#0284c7",
    "shape_type": "prism"
  },
  {
    "id": 12,
    "num": 17,
    "way_id": 742661078,
    "name": "민석스포츠센터",
    "name_en": "Minseok Sports Center",
    "lat": 35.14528,
    "lng": 129.011525,
    "levels": 4,
    "aliases": [
      "17번",
      "MS",
      "MS001",
      "MS002",
      "MS003",
      "MS101",
      "MS103",
      "MS201",
      "MS204",
      "MS301",
      "MS303",
      "MS401",
      "MS403",
      "민석스포츠센터",
      "스포츠센터",
      "체육관"
    ],
    "footprint": [
      [
        35.145483,
        129.011361
      ],
      [
        35.145378,
        129.011307
      ],
      [
        35.144893,
        129.011338
      ],
      [
        35.14488,
        129.011794
      ],
      [
        35.145362,
        129.011814
      ],
      [
        35.14548,
        129.0117
      ],
      [
        35.145483,
        129.011361
      ]
    ],
    "floor_details": [
      {
        "floor": -1,
        "label": "B1",
        "facilities": [
          {
            "code": "MS001",
            "name": "[MS001] 피트니스 헬스실",
            "category": "체육·복지",
            "note": "유산소·프리웨이트 트레이닝 센터"
          },
          {
            "code": "MS002",
            "name": "[MS002] 건강클리닉센터 · 운동처방실",
            "category": "체육·복지",
            "note": "체성분 측정 및 스포츠 재활 클리닉"
          },
          {
            "code": "MS003",
            "name": "[MS003] 공인 스쿼시코트",
            "category": "체육·복지",
            "note": "실내 스쿼시 경기 및 수업 코트"
          }
        ]
      },
      {
        "floor": 1,
        "label": "1F",
        "facilities": [
          {
            "code": "MS101",
            "name": "[MS101] 제1실내체육관 (주경기장)",
            "category": "체육·복지",
            "note": "농구·배구·배드민턴 다목적 플로어"
          },
          {
            "code": "MS103",
            "name": "[MS103] 스포츠센터 운영사무실",
            "category": "행정·지원",
            "note": "시설 대관 및 체육프로그램 안내"
          }
        ]
      },
      {
        "floor": 2,
        "label": "2F",
        "facilities": [
          {
            "code": "MS201",
            "name": "[MS201] 제1체육관 관람석",
            "category": "체육·복지",
            "note": "경기 관람 스탠드"
          },
          {
            "code": "MS204",
            "name": "[MS204] 체육계열 교수연구실 (MS204~208)",
            "category": "교수연구실",
            "note": "레포츠·체육 전임교원 연구실"
          }
        ]
      },
      {
        "floor": 3,
        "label": "3F",
        "facilities": [
          {
            "code": "MS301",
            "name": "[MS301] 제2체육관 (무용·에어로빅·탁구)",
            "category": "체육·복지",
            "note": "다목적 실내 스포츠 실습장"
          },
          {
            "code": "MS303",
            "name": "[MS303] 스포츠과학 영상강의실",
            "category": "강의실",
            "note": "운동역학 및 스포츠이론 강의실"
          }
        ]
      },
      {
        "floor": 4,
        "label": "4F",
        "facilities": [
          {
            "code": "MS401",
            "name": "[MS401] 레포츠과학부 학부사무실",
            "category": "학과사무실",
            "note": "체육학·레포츠 전공 학사 행정실"
          },
          {
            "code": "MS403",
            "name": "[MS403] 전문 웨이트트레이닝 실습실",
            "category": "체육·복지",
            "note": "선수 및 전공생 근력 트레이닝장"
          }
        ]
      }
    ],
    "elevation": 117.0,
    "code_prefix": "MS",
    "code_range": "MS001 ~ MS404",
    "department_summary": "실내체육관 · 피트니스/헬스장 · 스쿼시실 · 레포츠과학부",
    "roof_color": "#c2410c",
    "wall_color": "#e2ecf5",
    "wall_side_color": "#b8cce0",
    "accent_color": "#2563eb",
    "shape_type": "sports-center"
  },
  {
    "id": 13,
    "num": 18,
    "way_id": 744531509,
    "name": "대학교회",
    "name_en": "University Chapel",
    "lat": 35.145513,
    "lng": 129.010836,
    "levels": 4,
    "aliases": [
      "18번",
      "CH",
      "CH101",
      "CH103",
      "CH201",
      "CH301",
      "CH302",
      "대학교회",
      "채플"
    ],
    "footprint": [
      [
        35.145684,
        129.010821
      ],
      [
        35.145684,
        129.01091
      ],
      [
        35.145635,
        129.011003
      ],
      [
        35.145514,
        129.011052
      ],
      [
        35.145406,
        129.011022
      ],
      [
        35.145322,
        129.010945
      ],
      [
        35.145293,
        129.010863
      ],
      [
        35.145312,
        129.010779
      ],
      [
        35.145381,
        129.010712
      ],
      [
        35.145451,
        129.010674
      ],
      [
        35.145539,
        129.01066
      ],
      [
        35.145614,
        129.01069
      ],
      [
        35.14566,
        129.010751
      ],
      [
        35.145684,
        129.010821
      ]
    ],
    "floor_details": [
      {
        "floor": 1,
        "label": "1F",
        "facilities": [
          {
            "code": "CH101",
            "name": "[CH101] 소예배실 · 친교실",
            "category": "종교·인성",
            "note": "소규모 예배 및 학생 모임 라운지"
          },
          {
            "code": "CH103",
            "name": "[CH103] 교목실 · 인성교육상담실",
            "category": "행정·지원",
            "note": "채플 학사 안내 및 목회 상담"
          }
        ]
      },
      {
        "floor": 2,
        "label": "2F",
        "facilities": [
          {
            "code": "CH201",
            "name": "[CH201] 대학교회 대예배당 (본당)",
            "category": "종교·인성",
            "note": "교내 채플 및 파이프오르간 예배당"
          }
        ]
      },
      {
        "floor": 3,
        "label": "3F",
        "facilities": [
          {
            "code": "CH301",
            "name": "[CH301] 대예배당 2층 발코니석",
            "category": "종교·인성",
            "note": "합창단 및 상부 관람석"
          },
          {
            "code": "CH302",
            "name": "[CH302] 찬양대·교회음악 연습실",
            "category": "실습·연구",
            "note": "성가대 및 음악 리허설룸"
          }
        ]
      }
    ],
    "elevation": 117.0,
    "code_prefix": "CH",
    "code_range": "CH101 ~ CH302",
    "department_summary": "대예배당 · 채플홀 · 교회음악 실습실 · 교목실",
    "roof_color": "#b45309",
    "wall_color": "#f5ebe1",
    "wall_side_color": "#d6c1ae",
    "accent_color": "#92400e",
    "shape_type": "dome"
  },
  {
    "id": 17,
    "num": 19,
    "way_id": 742661081,
    "name": "학생생활아파트",
    "name_en": "Student Apartment",
    "lat": 35.146205,
    "lng": 129.008271,
    "levels": 5,
    "aliases": [
      "19번",
      "SA",
      "SA101",
      "SA102",
      "SA201",
      "기숙사아파트",
      "학생생활아파트"
    ],
    "footprint": [
      [
        35.146232,
        129.008018
      ],
      [
        35.146121,
        129.008026
      ],
      [
        35.146165,
        129.008657
      ],
      [
        35.146277,
        129.008638
      ],
      [
        35.146232,
        129.008018
      ]
    ],
    "floor_details": [
      {
        "floor": 1,
        "label": "1F",
        "facilities": [
          {
            "code": "SA101",
            "name": "[SA101] 학생생활아파트 관리실 · 사감실",
            "category": "기숙사",
            "note": "택배 보관함 및 출입 관리실"
          },
          {
            "code": "SA102",
            "name": "[SA102] 1층 아파트 사생실 (SA102~SA110)",
            "category": "기숙사",
            "note": "다인실 아파트형 기숙사"
          }
        ]
      },
      {
        "floor": 2,
        "label": "2F~5F",
        "facilities": [
          {
            "code": "SA201",
            "name": "[SA201] 아파트형 기숙사 호실 (SA201~SA510)",
            "category": "기숙사",
            "note": "거실·조리공간 포함 자치형 기숙사"
          }
        ]
      }
    ],
    "elevation": 84.0,
    "code_prefix": "SA",
    "code_range": "SA101 ~ SA510",
    "department_summary": "아파트형 학생기숙사 · 자치조리실 · 스터디룸",
    "roof_color": "#64748b",
    "wall_color": "#f8fafc",
    "wall_side_color": "#cbd5e1",
    "accent_color": "#475569",
    "shape_type": "prism"
  },
  {
    "id": 16,
    "num": 20,
    "way_id": 1387784067,
    "name": "국제생활관 2",
    "name_en": "International House II",
    "lat": 35.146233,
    "lng": 129.008792,
    "levels": 13,
    "aliases": [
      "20번",
      "IH2",
      "IH2-001",
      "IH2-101",
      "IH2-201",
      "IH2-205",
      "IH2-401",
      "IH2-501",
      "IH2001",
      "IH2101",
      "IH2201",
      "IH2205",
      "IH2401",
      "IH2501",
      "국제생활관 2",
      "국제생활관2",
      "국제생활관Ⅱ"
    ],
    "footprint": [
      [
        35.146134,
        129.008898
      ],
      [
        35.14642,
        129.008763
      ],
      [
        35.146385,
        129.008632
      ],
      [
        35.14609,
        129.008768
      ],
      [
        35.146134,
        129.008898
      ]
    ],
    "floor_details": [
      {
        "floor": -1,
        "label": "B1",
        "facilities": [
          {
            "code": "IH2-001",
            "name": "[IH2-001] 공동취사실 · 세탁실 · 휴게실",
            "category": "기숙사",
            "note": "사생 공용 조리 및 세탁 시설"
          }
        ]
      },
      {
        "floor": 1,
        "label": "1F",
        "facilities": [
          {
            "code": "IH2-101",
            "name": "[IH2-101] 국제생활관 2 사감실 · 안내실",
            "category": "기숙사",
            "note": "기숙사 입사 등록 및 생활 지도실"
          }
        ]
      },
      {
        "floor": 2,
        "label": "2F~3F",
        "facilities": [
          {
            "code": "IH2-201",
            "name": "[IH2-201] 동서어학당 강의실 (201~204 / 301~304)",
            "category": "강의실",
            "note": "한국어 및 외국어 회화 강의실"
          },
          {
            "code": "IH2-205",
            "name": "[IH2-205] 기숙사 사생실 (205~320)",
            "category": "기숙사",
            "note": "생활관 숙소 구역"
          }
        ]
      },
      {
        "floor": 4,
        "label": "4F",
        "facilities": [
          {
            "code": "IH2-401",
            "name": "[IH2-401] 농협은행 동서대지점 · ATM코너",
            "category": "편의시설",
            "note": "캠퍼스 금융 창구 및 자동화기기"
          }
        ]
      },
      {
        "floor": 5,
        "label": "5F~13F",
        "facilities": [
          {
            "code": "IH2-501",
            "name": "[IH2-501] 국제생활관 2 기숙사 호실 (501~1315)",
            "category": "기숙사",
            "note": "국내외 재학생 기숙사 생활 공간"
          }
        ]
      }
    ],
    "elevation": 90.0,
    "code_prefix": "IH2",
    "code_range": "IH2-001 ~ IH2-1315",
    "department_summary": "제2국제생활관 기숙사 · 동서어학당 강의실 · 농협",
    "roof_color": "#78350f",
    "wall_color": "#e7d2c0",
    "wall_side_color": "#c7a98f",
    "accent_color": "#92400e",
    "shape_type": "prism"
  },
  {
    "id": 9,
    "num": 21,
    "way_id": 742661086,
    "name": "민석도서관",
    "name_en": "Minseok Library",
    "lat": 35.144105,
    "lng": 129.012517,
    "levels": 6,
    "aliases": [
      "21번",
      "ML",
      "ML001",
      "ML002",
      "ML011",
      "ML015",
      "ML101",
      "ML102",
      "ML103",
      "ML105",
      "ML201",
      "ML204",
      "ML208",
      "ML301",
      "ML304",
      "ML401",
      "ML403",
      "ML405",
      "ML501",
      "ML503",
      "ML601",
      "ML604",
      "도서관",
      "민석도서관",
      "중앙도서관"
    ],
    "footprint": [
      [
        35.144329,
        129.011918
      ],
      [
        35.14396,
        129.011935
      ],
      [
        35.143891,
        129.01221
      ],
      [
        35.143905,
        129.012947
      ],
      [
        35.14403,
        129.012926
      ],
      [
        35.144035,
        129.013164
      ],
      [
        35.14436,
        129.013116
      ],
      [
        35.144329,
        129.011918
      ]
    ],
    "floor_details": [
      {
        "floor": -2,
        "label": "B2",
        "facilities": [
          {
            "code": "ML001",
            "name": "[ML001] e-Cafe 라운지 · 북카페",
            "category": "식당·카페",
            "note": "도서관 내 휴게 음료 및 스터디 카페"
          },
          {
            "code": "ML002",
            "name": "[ML002] 보존서고 · 학위논문서고",
            "category": "도서관·열람",
            "note": "귀중 정기간행물 및 보존 도서 서고"
          }
        ]
      },
      {
        "floor": -1,
        "label": "B1",
        "facilities": [
          {
            "code": "ML011",
            "name": "[ML011] 제2자유열람실 (24시간/집중열람)",
            "category": "도서관·열람",
            "note": "개인 좌석 예약제 집중 학습 열람실"
          },
          {
            "code": "ML015",
            "name": "[ML015] 동서대학교 공자아카데미",
            "category": "연구소",
            "note": "중국어 교육 및 한중 문화교류원"
          }
        ]
      },
      {
        "floor": 1,
        "label": "1F",
        "facilities": [
          {
            "code": "ML101",
            "name": "[ML101] 통합대출·반납 데스크 & IT-Zone",
            "category": "도서관·열람",
            "note": "PC 검색대·프린트·스캐너·노트북 열람석"
          },
          {
            "code": "ML102",
            "name": "[ML102] U-Zone (멀티미디어·VR/UCC룸)",
            "category": "도서관·열람",
            "note": "DVD 감상 부스 및 영상 편집 스튜디오"
          },
          {
            "code": "ML103",
            "name": "[ML103] 멀티플렉스 소극장 (Multiplex)",
            "category": "공연·문화",
            "note": "영화 상영 및 북콘서트·특강 홀"
          },
          {
            "code": "ML105",
            "name": "[ML105] 제1자유열람실",
            "category": "도서관·열람",
            "note": "자연채광 개방형 학습 열람실"
          }
        ]
      },
      {
        "floor": 2,
        "label": "2F",
        "facilities": [
          {
            "code": "ML201",
            "name": "[ML201] 제1자료실 (인문·사회·문학)",
            "category": "도서관·열람",
            "note": "단행본 열람 및 도서 대출 자료실"
          },
          {
            "code": "ML204",
            "name": "[ML204] 참고자료실 · 연속간행물실",
            "category": "도서관·열람",
            "note": "국내외 학술지·신문·잡지 열람"
          },
          {
            "code": "ML208",
            "name": "[ML208] 그룹 스터디룸 (S201~S206)",
            "category": "도서관·열람",
            "note": "4~8인 팀 프로젝트 토론실"
          }
        ]
      },
      {
        "floor": 3,
        "label": "3F",
        "facilities": [
          {
            "code": "ML301",
            "name": "[ML301] 제2자료실 (자연과학·공학·예술)",
            "category": "도서관·열람",
            "note": "전공 도서 및 예술·디자인 화집 자료실"
          },
          {
            "code": "ML304",
            "name": "[ML304] 과제도서실 · 지정도서 코너",
            "category": "도서관·열람",
            "note": "수업 교재 및 추천도서 비치실"
          }
        ]
      },
      {
        "floor": 4,
        "label": "4F",
        "facilities": [
          {
            "code": "ML401",
            "name": "[ML401] 학술정보교육실 (PC 교육장)",
            "category": "실습·연구",
            "note": "논문 검색 및 학술DB 활용 교육장"
          },
          {
            "code": "ML403",
            "name": "[ML403] 귀중본자료실 · 기증문고실",
            "category": "도서관·열람",
            "note": "희귀 고서 및 명사 기증문고 전시"
          },
          {
            "code": "ML405",
            "name": "[ML405] 도서관장실 · 학술정보지원팀",
            "category": "행정·지원",
            "note": "도서관 운영 행정 사무실"
          }
        ]
      },
      {
        "floor": 5,
        "label": "5F",
        "facilities": [
          {
            "code": "ML501",
            "name": "[ML501] 설립자 민석 기념자료관 · 박물관",
            "category": "전시·문화",
            "note": "동서학원 역사 및 설립자 기념 전시관"
          },
          {
            "code": "ML503",
            "name": "[ML503] 기획전시홀",
            "category": "전시·문화",
            "note": "학술 및 문화 예술 기획 전시장"
          }
        ]
      },
      {
        "floor": 6,
        "label": "6F",
        "facilities": [
          {
            "code": "ML601",
            "name": "[ML601] 국제세미나실 (동시통역 완비)",
            "category": "강의실",
            "note": "국제 심포지엄 및 학술 세미나 홀"
          },
          {
            "code": "ML604",
            "name": "[ML604] 다목적 컨퍼런스홀",
            "category": "강의실",
            "note": "대형 학술행사 및 특강장"
          }
        ]
      }
    ],
    "elevation": 162.0,
    "code_prefix": "ML",
    "code_range": "ML001 ~ ML604",
    "department_summary": "중앙도서관 · 열람실 · IT-Zone · 멀티플렉스 · 공자아카데미",
    "roof_color": "#0284c7",
    "wall_color": "#e0f2fe",
    "wall_side_color": "#bae6fd",
    "accent_color": "#0369a1",
    "shape_type": "library"
  },
  {
    "id": 22,
    "num": 22,
    "way_id": 744531512,
    "name": "한국어교육원",
    "name_en": "Korean Language Institute",
    "lat": 35.146244,
    "lng": 129.009102,
    "levels": 4,
    "aliases": [
      "22번",
      "KL",
      "KL001",
      "KL008",
      "KL101",
      "KL201",
      "KL301",
      "KL304",
      "외국어교육원",
      "한국어교육원"
    ],
    "footprint": [
      [
        35.146286,
        129.008944
      ],
      [
        35.146205,
        129.008982
      ],
      [
        35.146229,
        129.009058
      ],
      [
        35.146111,
        129.009114
      ],
      [
        35.146195,
        129.009382
      ],
      [
        35.146394,
        129.009289
      ],
      [
        35.146286,
        129.008944
      ]
    ],
    "floor_details": [
      {
        "floor": -1,
        "label": "B1~B4",
        "facilities": [
          {
            "code": "KL001",
            "name": "[KL001] 한국어 회화 집중강의실 (KL001~006)",
            "category": "강의실",
            "note": "급수별(1급~6급) 한국어 어학 강의실"
          },
          {
            "code": "KL008",
            "name": "[KL008] 한국문화 체험실",
            "category": "실습·연구",
            "note": "전통문화 및 한국 생활 적응 실습실"
          }
        ]
      },
      {
        "floor": 1,
        "label": "1F~2F",
        "facilities": [
          {
            "code": "KL101",
            "name": "[KL101] 유학생 라운지 · 글로벌 스터디존",
            "category": "편의시설",
            "note": "다국적 유학생 교류 및 휴게 공간"
          },
          {
            "code": "KL201",
            "name": "[KL201] TOPIK(한국어능력시험) 대비 강의실",
            "category": "강의실",
            "note": "한국어능력시험 집중 특강실"
          }
        ]
      },
      {
        "floor": 3,
        "label": "3F",
        "facilities": [
          {
            "code": "KL301",
            "name": "[KL301] 한국어교육원 교학과 사무실",
            "category": "학과사무실",
            "note": "어학연수생 등록·비자·학사 행정실"
          },
          {
            "code": "KL304",
            "name": "[KL304] 한국어강사 연구실 · 회의실",
            "category": "교수연구실",
            "note": "한국어 교원 연구 및 교재 개발실"
          }
        ]
      }
    ],
    "elevation": 90.0,
    "code_prefix": "KL",
    "code_range": "KL001 ~ KL306",
    "department_summary": "한국어학당 · TOPIK 교육 · 유학생 한국문화체험실",
    "roof_color": "#9a3412",
    "wall_color": "#e7cbc0",
    "wall_side_color": "#c99f8f",
    "accent_color": "#7c2d12",
    "shape_type": "prism"
  },
  {
    "id": 14,
    "num": 23,
    "way_id": 742661077,
    "name": "글로벌빌리지",
    "name_en": "Global Village",
    "lat": 35.14605,
    "lng": 129.00705,
    "levels": 19,
    "aliases": [
      "23번",
      "GV",
      "GV101",
      "GV105",
      "GV201",
      "GV205",
      "GV301",
      "GV305",
      "GV308",
      "GV401",
      "GV501",
      "GV504",
      "GV601",
      "GV605",
      "GV701",
      "GV703",
      "GV801",
      "GV851",
      "글로벌빌리지",
      "글로벌하우스"
    ],
    "footprint": [
      [
        35.145977,
        129.007483
      ],
      [
        35.145956,
        129.007176
      ],
      [
        35.146197,
        129.007138
      ],
      [
        35.14622,
        129.007451
      ],
      [
        35.145977,
        129.007483
      ]
    ],
    "floor_details": [
      {
        "floor": 1,
        "label": "1F",
        "facilities": [
          {
            "code": "GV101",
            "name": "[GV101] 글로벌빌리지 로비 · 편의점",
            "category": "편의시설",
            "note": "기숙사 및 강의동 메인 출입 로비"
          },
          {
            "code": "GV105",
            "name": "[GV105] 실내주차장 · 셔틀정류장",
            "category": "편의시설",
            "note": "캠퍼스 하단 진입 주차 구역"
          }
        ]
      },
      {
        "floor": 2,
        "label": "2F",
        "facilities": [
          {
            "code": "GV201",
            "name": "[GV201] 디지털콘텐츠학부 강의실",
            "category": "강의실",
            "note": "게임·애니메이션·VFX 전공 강의실"
          },
          {
            "code": "GV205",
            "name": "[GV205] CG·모션캡처 실습실",
            "category": "실습·연구",
            "note": "3D 애니메이션 및 모션캡처 스튜디오"
          }
        ]
      },
      {
        "floor": 3,
        "label": "3F",
        "facilities": [
          {
            "code": "GV301",
            "name": "[GV301] 보건의료관 II (방사선학과 실습실)",
            "category": "실습·연구",
            "note": "X선·CT·초음파 영상진단 실습실"
          },
          {
            "code": "GV305",
            "name": "[GV305] 치위생학과 임상실습실",
            "category": "실습·연구",
            "note": "치과 유니트체어 구강보건 실습실"
          },
          {
            "code": "GV308",
            "name": "[GV308] 방사선·치위생 학과사무실",
            "category": "학과사무실",
            "note": "보건의료관 II 학과 행정실"
          }
        ]
      },
      {
        "floor": 4,
        "label": "4F",
        "facilities": [
          {
            "code": "GV401",
            "name": "[GV401] 글로벌빌리지 스포츠센터 · 수영장",
            "category": "체육·복지",
            "note": "실내 피트니스 및 체육 실습 시설"
          }
        ]
      },
      {
        "floor": 5,
        "label": "5F",
        "facilities": [
          {
            "code": "GV501",
            "name": "[GV501] 사회복지관 · 보건행정학과 강의실",
            "category": "강의실",
            "note": "의무기록 및 보건의료정보 실습실"
          },
          {
            "code": "GV504",
            "name": "[GV504] 보건행정학과 사무실",
            "category": "학과사무실",
            "note": "보건행정전공 학사 안내"
          }
        ]
      },
      {
        "floor": 6,
        "label": "6F",
        "facilities": [
          {
            "code": "GV601",
            "name": "[GV601] 건축설계관 스튜디오",
            "category": "실습·연구",
            "note": "건축학 5년제 설계 제도 스튜디오"
          },
          {
            "code": "GV605",
            "name": "[GV605] 건축모형 및 크리틱룸",
            "category": "강의실",
            "note": "건축 설계 도면 품평회실"
          }
        ]
      },
      {
        "floor": 7,
        "label": "7F",
        "facilities": [
          {
            "code": "GV701",
            "name": "[GV701] 글로벌하우스 통합사감실",
            "category": "기숙사",
            "note": "동관·서관 기숙사 입퇴사 및 생활 안내"
          },
          {
            "code": "GV703",
            "name": "[GV703] 기숙사 세탁실 · 공용라운지",
            "category": "기숙사",
            "note": "기숙사생 전용 편의 공간"
          }
        ]
      },
      {
        "floor": 8,
        "label": "8F~19F",
        "facilities": [
          {
            "code": "GV801",
            "name": "[GV801] 글로벌하우스 동관 호실 (GV801~GV1922)",
            "category": "기숙사",
            "note": "2인 1실 생활관 및 층별 휴게실"
          },
          {
            "code": "GV851",
            "name": "[GV851] 글로벌하우스 서관 호실 (GV851~GV1972)",
            "category": "기숙사",
            "note": "2인 1실 생활관 및 스터디룸"
          }
        ]
      }
    ],
    "elevation": 69.0,
    "code_prefix": "GV",
    "code_range": "GV101 ~ GV1920",
    "department_summary": "디지털콘텐츠 · 보건의료관II(방사선/치위생) · 건축설계 · 글로벌하우스 기숙사",
    "roof_color": "#475569",
    "wall_color": "#f8fafc",
    "wall_side_color": "#cbd5e1",
    "accent_color": "#334155",
    "shape_type": "twin-towers",
    "secondary_footprint": [
      [
        35.145943,
        129.00689
      ],
      [
        35.145922,
        129.006583
      ],
      [
        35.146163,
        129.006544
      ],
      [
        35.146186,
        129.006857
      ],
      [
        35.145943,
        129.00689
      ]
    ]
  },
  {
    "id": 10,
    "num": 24,
    "way_id": 469947482,
    "name": "스튜던트 플라자",
    "name_en": "Student Plaza & Sports Complex",
    "lat": 35.14571,
    "lng": 129.009453,
    "levels": 3,
    "aliases": [
      "24번",
      "SP",
      "SP101",
      "SP103",
      "SP105",
      "SP201",
      "SP204",
      "SP301",
      "SP303",
      "SP305",
      "SP310",
      "스튜던트 플라자",
      "스튜던트플라자",
      "종합운동장",
      "푸드코트",
      "학생식당"
    ],
    "footprint": [
      [
        35.145892,
        129.008911
      ],
      [
        35.145192,
        129.00914
      ],
      [
        35.145438,
        129.010267
      ],
      [
        35.146138,
        129.010038
      ],
      [
        35.145892,
        129.008911
      ]
    ],
    "floor_details": [
      {
        "floor": 1,
        "label": "1F",
        "facilities": [
          {
            "code": "SP101",
            "name": "[SP101] 스튜던트 푸드코트 (학생식당)",
            "category": "식당·카페",
            "note": "한식·양식·일품요리 학생 복지 식당"
          },
          {
            "code": "SP103",
            "name": "[SP103] 편의점 · 캠퍼스 문구/서점",
            "category": "편의시설",
            "note": "교재·문구류 및 생활용품 스토어"
          },
          {
            "code": "SP105",
            "name": "[SP105] 학생 휴게 라운지 & 카페",
            "category": "식당·카페",
            "note": "운동장 전망 오픈 휴게실"
          }
        ]
      },
      {
        "floor": 2,
        "label": "2F",
        "facilities": [
          {
            "code": "SP201",
            "name": "[SP201] 종합운동장 본부석 · 스탠드",
            "category": "체육·복지",
            "note": "인조잔디 축구장 및 트랙 관람석"
          },
          {
            "code": "SP204",
            "name": "[SP204] 체육부실 · 운동장비 보관실",
            "category": "체육·복지",
            "note": "교내 체육대회 및 동아리 체육 지원"
          }
        ]
      },
      {
        "floor": 3,
        "label": "3F",
        "facilities": [
          {
            "code": "SP301",
            "name": "[SP301] 입학처 · 입학홍보팀",
            "category": "대학본부",
            "note": "신·편입학 입시 상담 및 전형 운영"
          },
          {
            "code": "SP303",
            "name": "[SP303] 학생취업지원처 · 대학일자리플러스센터",
            "category": "행정·지원",
            "note": "진로·취업 컨설팅 및 장학/복지 지원"
          },
          {
            "code": "SP305",
            "name": "[SP305] 총학생회실 · 단과대 학생회실",
            "category": "학생자치",
            "note": "학생 자치기구 운영 사무실"
          },
          {
            "code": "SP310",
            "name": "[SP310] 중앙동아리방 (SP310~SP325)",
            "category": "학생자치",
            "note": "공연·학술·봉사·체육 중앙동아리실"
          }
        ]
      }
    ],
    "elevation": 114.0,
    "code_prefix": "SP",
    "code_range": "SP101 ~ SP315",
    "department_summary": "학생식당(푸드코트) · 입학처 · 학생취업지원처 · 총학생회 · 동아리방",
    "roof_color": "#16a34a",
    "wall_color": "#b45309",
    "wall_side_color": "#78350f",
    "accent_color": "#dc2626",
    "shape_type": "stadium"
  },
  {
    "id": 26,
    "num": 25,
    "way_id": 790768124,
    "name": "테니스장",
    "name_en": "Tennis Court",
    "lat": 35.14283,
    "lng": 129.007817,
    "elevation": 158.0,
    "levels": 1,
    "code_prefix": "TC",
    "code_range": "TC101",
    "department_summary": "야외 테니스 코트 · 체육실기장",
    "aliases": [
      "테니스장",
      "Tennis Court",
      "25번",
      "TC"
    ],
    "footprint": [
      [
        35.142958,
        129.008048
      ],
      [
        35.142513,
        129.00776
      ],
      [
        35.142637,
        129.007472
      ],
      [
        35.143082,
        129.00776
      ],
      [
        35.142958,
        129.008048
      ]
    ],
    "floor_details": [
      {
        "floor": 1,
        "label": "야외",
        "facilities": [
          {
            "code": "TC101",
            "name": "[TC101] 동서대 테니스 코트 (1~4코트)",
            "category": "체육·복지",
            "note": "교양 체육 수업 및 동아리 테니스장"
          }
        ]
      }
    ],
    "roof_color": "#15803d",
    "wall_color": "#bbf7d0",
    "wall_side_color": "#86efac",
    "accent_color": "#166534",
    "shape_type": "court"
  },
  {
    "id": 27,
    "num": 26,
    "way_id": null,
    "name": "민석동산",
    "name_en": "Min-seok Hill",
    "lat": 35.14492,
    "lng": 129.01105,
    "elevation": 135.0,
    "levels": 1,
    "code_prefix": "MH",
    "code_range": "MH101",
    "department_summary": "캠퍼스 중앙 산책공원 · 휴게 쉼터",
    "aliases": [
      "민석동산",
      "Min-seok Hill",
      "26번",
      "MH"
    ],
    "footprint": [
      [
        35.14492,
        129.0113
      ],
      [
        35.144997,
        129.011281
      ],
      [
        35.145061,
        129.011227
      ],
      [
        35.145105,
        129.011146
      ],
      [
        35.14512,
        129.01105
      ],
      [
        35.145105,
        129.010954
      ],
      [
        35.145061,
        129.010873
      ],
      [
        35.144997,
        129.010819
      ],
      [
        35.14492,
        129.0108
      ],
      [
        35.144843,
        129.010819
      ],
      [
        35.144779,
        129.010873
      ],
      [
        35.144735,
        129.010954
      ],
      [
        35.14472,
        129.01105
      ],
      [
        35.144735,
        129.011146
      ],
      [
        35.144779,
        129.011227
      ],
      [
        35.144843,
        129.011281
      ],
      [
        35.14492,
        129.0113
      ]
    ],
    "floor_details": [
      {
        "floor": 1,
        "label": "공원",
        "facilities": [
          {
            "code": "MH101",
            "name": "[MH101] 민석동산 전망 산책로 · 벤치",
            "category": "편의시설",
            "note": "대학교회와 어문관 사이 녹지 휴게 공원"
          }
        ]
      }
    ],
    "roof_color": "#16a34a",
    "wall_color": "#dcfce7",
    "wall_side_color": "#bbf7d0",
    "accent_color": "#15803d",
    "shape_type": "park"
  },
  {
    "id": 28,
    "num": 27,
    "way_id": null,
    "name": "우정의집",
    "name_en": "Friendship House",
    "lat": 35.14382,
    "lng": 129.00958,
    "elevation": 152.0,
    "levels": 2,
    "code_prefix": "FH",
    "code_range": "FH101 ~ FH201",
    "department_summary": "학생 휴게 파빌리온 · 스터디 라운지",
    "aliases": [
      "우정의집",
      "Friendship House",
      "27번",
      "FH"
    ],
    "footprint": [
      [
        35.14373,
        129.009402
      ],
      [
        35.143674,
        129.009717
      ],
      [
        35.14391,
        129.009758
      ],
      [
        35.143966,
        129.009443
      ],
      [
        35.14373,
        129.009402
      ]
    ],
    "floor_details": [
      {
        "floor": 1,
        "label": "1F",
        "facilities": [
          {
            "code": "FH101",
            "name": "[FH101] 우정의집 학생 쉼터 · 카페테리아",
            "category": "편의시설",
            "note": "상단 캠퍼스 학생 휴게 및 모임 공간"
          }
        ]
      }
    ],
    "roof_color": "#b45309",
    "wall_color": "#fef3c7",
    "wall_side_color": "#fde68a",
    "accent_color": "#92400e",
    "shape_type": "prism"
  },
  {
    "id": 29,
    "num": 29,
    "way_id": null,
    "name": "UNIVERSITY PARK",
    "name_en": "University Park",
    "lat": 35.14422,
    "lng": 129.00958,
    "elevation": 145.0,
    "levels": 1,
    "code_prefix": "UP",
    "code_range": "UP101",
    "department_summary": "캠퍼스 상징 조형물 광장 · 중앙 정원",
    "aliases": [
      "UNIVERSITY PARK",
      "유니버시티 파크",
      "29번",
      "UP"
    ],
    "footprint": [
      [
        35.14422,
        129.00978
      ],
      [
        35.144281,
        129.009765
      ],
      [
        35.144333,
        129.009721
      ],
      [
        35.144368,
        129.009657
      ],
      [
        35.14438,
        129.00958
      ],
      [
        35.144368,
        129.009503
      ],
      [
        35.144333,
        129.009439
      ],
      [
        35.144281,
        129.009395
      ],
      [
        35.14422,
        129.00938
      ],
      [
        35.144159,
        129.009395
      ],
      [
        35.144107,
        129.009439
      ],
      [
        35.144072,
        129.009503
      ],
      [
        35.14406,
        129.00958
      ],
      [
        35.144072,
        129.009657
      ],
      [
        35.144107,
        129.009721
      ],
      [
        35.144159,
        129.009765
      ],
      [
        35.14422,
        129.00978
      ]
    ],
    "floor_details": [
      {
        "floor": 1,
        "label": "광장",
        "facilities": [
          {
            "code": "UP101",
            "name": "[UP101] 유니버시티 파크 중앙광장 · 상징탑",
            "category": "편의시설",
            "note": "국제협력관과 전자정보관 사이 중앙 보행 광장"
          }
        ]
      }
    ],
    "roof_color": "#0d9488",
    "wall_color": "#ccfbf1",
    "wall_side_color": "#99f6e4",
    "accent_color": "#0f766e",
    "shape_type": "park"
  },
  {
    "id": 30,
    "num": 30,
    "way_id": null,
    "name": "야외공연장 (Muse Park)",
    "name_en": "Muse Park Amphitheater",
    "lat": 35.14335,
    "lng": 129.00965,
    "elevation": 158.0,
    "levels": 2,
    "code_prefix": "MP",
    "code_range": "MP101",
    "department_summary": "반원형 야외 음악당 · 버스킹 및 축제 무대",
    "aliases": [
      "야외공연장",
      "Muse Park",
      "뮤즈파크",
      "30번",
      "MP"
    ],
    "footprint": [
      [
        35.14335,
        129.00991
      ],
      [
        35.143427,
        129.00989
      ],
      [
        35.143491,
        129.009834
      ],
      [
        35.143535,
        129.009749
      ],
      [
        35.14355,
        129.00965
      ],
      [
        35.143535,
        129.009551
      ],
      [
        35.143491,
        129.009466
      ],
      [
        35.143427,
        129.00941
      ],
      [
        35.14335,
        129.00939
      ],
      [
        35.143273,
        129.00941
      ],
      [
        35.143209,
        129.009466
      ],
      [
        35.143165,
        129.009551
      ],
      [
        35.14315,
        129.00965
      ],
      [
        35.143165,
        129.009749
      ],
      [
        35.143209,
        129.009834
      ],
      [
        35.143273,
        129.00989
      ],
      [
        35.14335,
        129.00991
      ]
    ],
    "floor_details": [
      {
        "floor": 1,
        "label": "야외무대",
        "facilities": [
          {
            "code": "MP101",
            "name": "[MP101] 뮤즈파크 반원형 야외공연장 · 스탠드",
            "category": "공연·문화",
            "note": "야외 문화공연 및 동아리 페스티벌 무대"
          }
        ]
      }
    ],
    "roof_color": "#64748b",
    "wall_color": "#e2e8f0",
    "wall_side_color": "#cbd5e1",
    "accent_color": "#475569",
    "shape_type": "amphitheater"
  },
  {
    "id": 4,
    "num": 31,
    "way_id": 1306688756,
    "name": "International College",
    "name_en": "International College",
    "lat": 35.146058,
    "lng": 129.00827,
    "levels": 7,
    "aliases": [
      "31번",
      "IC",
      "IC101",
      "IC103",
      "IC201",
      "IC204",
      "IC301",
      "IC303",
      "IC305",
      "IC401",
      "IC404",
      "IC501",
      "IC504",
      "IC601",
      "IC605",
      "IC701",
      "IC704",
      "IC빌딩",
      "International College",
      "디자인팩토리",
      "인터내셔널 칼리지"
    ],
    "footprint": [
      [
        35.14609,
        129.008139
      ],
      [
        35.14613,
        129.008606
      ],
      [
        35.145985,
        129.008321
      ],
      [
        35.145994,
        129.008144
      ],
      [
        35.14609,
        129.008139
      ]
    ],
    "floor_details": [
      {
        "floor": 1,
        "label": "1F",
        "facilities": [
          {
            "code": "IC101",
            "name": "[IC101] 동서 디자인팩토리 (DFK 스튜디오)",
            "category": "실습·연구",
            "note": "글로벌 산학협동 시제품 제작 메이커스페이스"
          },
          {
            "code": "IC103",
            "name": "[IC103] 아이디어 피칭 아레나",
            "category": "강의실",
            "note": "오픈형 글로벌 팀 프로젝트 발표장"
          }
        ]
      },
      {
        "floor": 2,
        "label": "2F",
        "facilities": [
          {
            "code": "IC201",
            "name": "[IC201] 글로벌 액티브러닝 강의실 1",
            "category": "강의실",
            "note": "영어 전용 수업 및 토론형 강의실"
          },
          {
            "code": "IC204",
            "name": "[IC204] 글로벌 액티브러닝 강의실 2",
            "category": "강의실",
            "note": "원격 국제 화상 합동 강의실"
          }
        ]
      },
      {
        "floor": 3,
        "label": "3F",
        "facilities": [
          {
            "code": "IC301",
            "name": "[IC301] 디자인 전문도서관 (Design Library)",
            "category": "도서관·열람",
            "note": "해외 디자인 서적 및 정기간행물 열람실"
          },
          {
            "code": "IC303",
            "name": "[IC303] IC 크리에이티브 갤러리",
            "category": "전시·문화",
            "note": "글로벌 캡스톤 결과물 상설 전시관"
          },
          {
            "code": "IC305",
            "name": "[IC305] 국제 세미나룸",
            "category": "강의실",
            "note": "소규모 학술 워크숍 공간"
          }
        ]
      },
      {
        "floor": 4,
        "label": "4F",
        "facilities": [
          {
            "code": "IC401",
            "name": "[IC401] 글로벌 컴퓨터 실습실 1",
            "category": "실습·연구",
            "note": "다국어 OS 및 디자인/코딩 SW 실습실"
          },
          {
            "code": "IC404",
            "name": "[IC404] 국제전공 강의실 A",
            "category": "강의실",
            "note": "유학생 및 글로벌학부 전공 강의실"
          }
        ]
      },
      {
        "floor": 5,
        "label": "5F",
        "facilities": [
          {
            "code": "IC501",
            "name": "[IC501] 글로벌 컴퓨터 실습실 2",
            "category": "실습·연구",
            "note": "디지털 콘텐츠 및 데이터 분석 실습실"
          },
          {
            "code": "IC504",
            "name": "[IC504] 국제전공 강의실 B",
            "category": "강의실",
            "note": "멀티미디어 전공 강의실"
          }
        ]
      },
      {
        "floor": 6,
        "label": "6F",
        "facilities": [
          {
            "code": "IC601",
            "name": "[IC601] 글로벌 프로젝트 세미나실",
            "category": "강의실",
            "note": "팀 프로젝트 및 발표 강의실"
          },
          {
            "code": "IC605",
            "name": "[IC605] 외국인 교원 연구실 (IC604~610)",
            "category": "교수연구실",
            "note": "국제대학 전임교수 연구실"
          }
        ]
      },
      {
        "floor": 7,
        "label": "7F",
        "facilities": [
          {
            "code": "IC701",
            "name": "[IC701] International College 행정실",
            "category": "학과사무실",
            "note": "국제대학 학사 지원 및 유학생 상담실"
          },
          {
            "code": "IC704",
            "name": "[IC704] 글로벌 컨퍼런스룸",
            "category": "강의실",
            "note": "국제교류 회의 및 세미나실"
          }
        ]
      }
    ],
    "elevation": 84.0,
    "code_prefix": "IC",
    "code_range": "IC101 ~ IC704",
    "department_summary": "인터내셔널칼리지 · 디자인팩토리(DFK) · 글로벌전공",
    "roof_color": "#1d4ed8",
    "wall_color": "#dbeafe",
    "wall_side_color": "#93c5fd",
    "accent_color": "#2563eb",
    "shape_type": "prism"
  }
]

export const SEEDED_PATH_NODES: CampusNode[] = [{"id": "osm-1762118438", "building_id": null, "location": {"type": "Point", "coordinates": [129.00893, 35.144109]}, "elevation": 152.0}, {"id": "osm-1762118482", "building_id": null, "location": {"type": "Point", "coordinates": [129.009388, 35.144319]}, "elevation": 132.0}, {"id": "osm-1762118527", "building_id": null, "location": {"type": "Point", "coordinates": [129.013062, 35.146428]}, "elevation": 96.0}, {"id": "osm-4642036745", "building_id": null, "location": {"type": "Point", "coordinates": [129.013041, 35.146833]}, "elevation": 84.0}, {"id": "osm-1762118301", "building_id": null, "location": {"type": "Point", "coordinates": [129.007292, 35.144085]}, "elevation": 133.0}, {"id": "osm-4642036701", "building_id": null, "location": {"type": "Point", "coordinates": [129.007545, 35.144126]}, "elevation": 147.0}, {"id": "osm-1762118163", "building_id": null, "location": {"type": "Point", "coordinates": [129.007612, 35.144137]}, "elevation": 147.0}, {"id": "osm-1762118518", "building_id": null, "location": {"type": "Point", "coordinates": [129.007871, 35.144189]}, "elevation": 123.0}, {"id": "osm-1762118178", "building_id": null, "location": {"type": "Point", "coordinates": [129.008857, 35.14438]}, "elevation": 128.0}, {"id": "osm-4642032058", "building_id": null, "location": {"type": "Point", "coordinates": [129.010591, 35.14444]}, "elevation": 137.0}, {"id": "osm-4632371524", "building_id": null, "location": {"type": "Point", "coordinates": [129.011238, 35.144478]}, "elevation": 138.0}, {"id": "osm-436806147", "building_id": null, "location": {"type": "Point", "coordinates": [129.01117, 35.146808]}, "elevation": 85.0}, {"id": "osm-1762118283", "building_id": null, "location": {"type": "Point", "coordinates": [129.010568, 35.146762]}, "elevation": 84.0}, {"id": "osm-4710085538", "building_id": null, "location": {"type": "Point", "coordinates": [129.010204, 35.146735]}, "elevation": 84.0}, {"id": "osm-4710085537", "building_id": null, "location": {"type": "Point", "coordinates": [129.010032, 35.146721]}, "elevation": 84.0}, {"id": "osm-4710085531", "building_id": null, "location": {"type": "Point", "coordinates": [129.009709, 35.146697]}, "elevation": 79.0}, {"id": "osm-1762118343", "building_id": null, "location": {"type": "Point", "coordinates": [129.009289, 35.146665]}, "elevation": 79.0}, {"id": "osm-4710085532", "building_id": null, "location": {"type": "Point", "coordinates": [129.008545, 35.146608]}, "elevation": 90.0}, {"id": "osm-7247047825", "building_id": null, "location": {"type": "Point", "coordinates": [129.008228, 35.146584]}, "elevation": 84.0}, {"id": "osm-1762118434", "building_id": null, "location": {"type": "Point", "coordinates": [129.007883, 35.146558]}, "elevation": 84.0}, {"id": "osm-4632371512", "building_id": null, "location": {"type": "Point", "coordinates": [129.007583, 35.146535]}, "elevation": 84.0}, {"id": "osm-1762118371", "building_id": null, "location": {"type": "Point", "coordinates": [129.006497, 35.146452]}, "elevation": 57.0}, {"id": "osm-4632371513", "building_id": null, "location": {"type": "Point", "coordinates": [129.008147, 35.145639]}, "elevation": 97.0}, {"id": "osm-4632371514", "building_id": null, "location": {"type": "Point", "coordinates": [129.008514, 35.145764]}, "elevation": 106.0}, {"id": "osm-4642036719", "building_id": null, "location": {"type": "Point", "coordinates": [129.008768, 35.145905]}, "elevation": 90.0}, {"id": "osm-4632371515", "building_id": null, "location": {"type": "Point", "coordinates": [129.00903, 35.146051]}, "elevation": 90.0}, {"id": "osm-4632371516", "building_id": null, "location": {"type": "Point", "coordinates": [129.010136, 35.146323]}, "elevation": 97.0}, {"id": "osm-4632371517", "building_id": null, "location": {"type": "Point", "coordinates": [129.010404, 35.146171]}, "elevation": 97.0}, {"id": "osm-4642036717", "building_id": null, "location": {"type": "Point", "coordinates": [129.010357, 35.145326]}, "elevation": 114.0}, {"id": "osm-4632371518", "building_id": null, "location": {"type": "Point", "coordinates": [129.010349, 35.145223]}, "elevation": 114.0}, {"id": "osm-4632371519", "building_id": null, "location": {"type": "Point", "coordinates": [129.011144, 35.14641]}, "elevation": 99.0}, {"id": "osm-4632371520", "building_id": null, "location": {"type": "Point", "coordinates": [129.01035, 35.145065]}, "elevation": 114.0}, {"id": "osm-4632371521", "building_id": null, "location": {"type": "Point", "coordinates": [129.010425, 35.14474]}, "elevation": 137.0}, {"id": "osm-7351322764", "building_id": null, "location": {"type": "Point", "coordinates": [129.010454, 35.144732]}, "elevation": 137.0}, {"id": "osm-4710085536", "building_id": null, "location": {"type": "Point", "coordinates": [129.010004, 35.146585]}, "elevation": 97.0}, {"id": "osm-4632371526", "building_id": null, "location": {"type": "Point", "coordinates": [129.010255, 35.146609]}, "elevation": 97.0}, {"id": "osm-4632371528", "building_id": null, "location": {"type": "Point", "coordinates": [129.009338, 35.146441]}, "elevation": 97.0}, {"id": "osm-4642032041", "building_id": null, "location": {"type": "Point", "coordinates": [129.013206, 35.143927]}, "elevation": 162.0}, {"id": "osm-4642032042", "building_id": null, "location": {"type": "Point", "coordinates": [129.013005, 35.143919]}, "elevation": 162.0}, {"id": "osm-4642032043", "building_id": null, "location": {"type": "Point", "coordinates": [129.013008, 35.143877]}, "elevation": 162.0}, {"id": "osm-4642032044", "building_id": null, "location": {"type": "Point", "coordinates": [129.012357, 35.143859]}, "elevation": 163.0}, {"id": "osm-4642032045", "building_id": null, "location": {"type": "Point", "coordinates": [129.012207, 35.143855]}, "elevation": 163.0}, {"id": "osm-4642032046", "building_id": null, "location": {"type": "Point", "coordinates": [129.011979, 35.143899]}, "elevation": 163.0}, {"id": "osm-4642032047", "building_id": null, "location": {"type": "Point", "coordinates": [129.011872, 35.143979]}, "elevation": 163.0}, {"id": "osm-11285287769", "building_id": null, "location": {"type": "Point", "coordinates": [129.011806, 35.143988]}, "elevation": 163.0}, {"id": "osm-4642032048", "building_id": null, "location": {"type": "Point", "coordinates": [129.011732, 35.143999]}, "elevation": 163.0}, {"id": "osm-4642032049", "building_id": null, "location": {"type": "Point", "coordinates": [129.011622, 35.143974]}, "elevation": 160.0}, {"id": "osm-4642032050", "building_id": null, "location": {"type": "Point", "coordinates": [129.011497, 35.143904]}, "elevation": 160.0}, {"id": "osm-4642032051", "building_id": null, "location": {"type": "Point", "coordinates": [129.011287, 35.143825]}, "elevation": 160.0}, {"id": "osm-4642032052", "building_id": null, "location": {"type": "Point", "coordinates": [129.011232, 35.143817]}, "elevation": 160.0}, {"id": "osm-4642032053", "building_id": null, "location": {"type": "Point", "coordinates": [129.010142, 35.143822]}, "elevation": 159.0}, {"id": "osm-4642032054", "building_id": null, "location": {"type": "Point", "coordinates": [129.01013, 35.143919]}, "elevation": 159.0}, {"id": "osm-4642032055", "building_id": null, "location": {"type": "Point", "coordinates": [129.01017, 35.144058]}, "elevation": 159.0}, {"id": "osm-4642032056", "building_id": null, "location": {"type": "Point", "coordinates": [129.010268, 35.144191]}, "elevation": 137.0}, {"id": "osm-4642032057", "building_id": null, "location": {"type": "Point", "coordinates": [129.01042, 35.144308]}, "elevation": 137.0}, {"id": "osm-11285287781", "building_id": null, "location": {"type": "Point", "coordinates": [129.01128, 35.143793]}, "elevation": 160.0}, {"id": "osm-4642032059", "building_id": null, "location": {"type": "Point", "coordinates": [129.011263, 35.143715]}, "elevation": 160.0}, {"id": "osm-4642032060", "building_id": null, "location": {"type": "Point", "coordinates": [129.011287, 35.143501]}, "elevation": 160.0}, {"id": "osm-4642032085", "building_id": null, "location": {"type": "Point", "coordinates": [129.007178, 35.144082]}, "elevation": 133.0}, {"id": "osm-4642032061", "building_id": null, "location": {"type": "Point", "coordinates": [129.006928, 35.144076]}, "elevation": 133.0}, {"id": "osm-4642032062", "building_id": null, "location": {"type": "Point", "coordinates": [129.006708, 35.144061]}, "elevation": 133.0}, {"id": "osm-4642032063", "building_id": null, "location": {"type": "Point", "coordinates": [129.006364, 35.143506]}, "elevation": 119.0}, {"id": "osm-4642032064", "building_id": null, "location": {"type": "Point", "coordinates": [129.007549, 35.14293]}, "elevation": 169.0}, {"id": "osm-4642032069", "building_id": null, "location": {"type": "Point", "coordinates": [129.007622, 35.142998]}, "elevation": 169.0}, {"id": "osm-4642032065", "building_id": null, "location": {"type": "Point", "coordinates": [129.007747, 35.143112]}, "elevation": 169.0}, {"id": "osm-4642032066", "building_id": null, "location": {"type": "Point", "coordinates": [129.007893, 35.143112]}, "elevation": 169.0}, {"id": "osm-4642032067", "building_id": null, "location": {"type": "Point", "coordinates": [129.007985, 35.14314]}, "elevation": 169.0}, {"id": "osm-4642032068", "building_id": null, "location": {"type": "Point", "coordinates": [129.008043, 35.143149]}, "elevation": 169.0}, {"id": "osm-4642032070", "building_id": null, "location": {"type": "Point", "coordinates": [129.007507, 35.14303]}, "elevation": 169.0}, {"id": "osm-4642032071", "building_id": null, "location": {"type": "Point", "coordinates": [129.007278, 35.143481]}, "elevation": 133.0}, {"id": "osm-4642032072", "building_id": null, "location": {"type": "Point", "coordinates": [129.007232, 35.1436]}, "elevation": 133.0}, {"id": "osm-4642032073", "building_id": null, "location": {"type": "Point", "coordinates": [129.007306, 35.14374]}, "elevation": 133.0}, {"id": "osm-4642032074", "building_id": null, "location": {"type": "Point", "coordinates": [129.007525, 35.143884]}, "elevation": 147.0}, {"id": "osm-4642032075", "building_id": null, "location": {"type": "Point", "coordinates": [129.007692, 35.144034]}, "elevation": 147.0}, {"id": "osm-4642032076", "building_id": null, "location": {"type": "Point", "coordinates": [129.007717, 35.144081]}, "elevation": 147.0}, {"id": "osm-4642032077", "building_id": null, "location": {"type": "Point", "coordinates": [129.007427, 35.143526]}, "elevation": 133.0}, {"id": "osm-4642032078", "building_id": null, "location": {"type": "Point", "coordinates": [129.007912, 35.143578]}, "elevation": 147.0}, {"id": "osm-4642032079", "building_id": null, "location": {"type": "Point", "coordinates": [129.007985, 35.143553]}, "elevation": 147.0}, {"id": "osm-4642032080", "building_id": null, "location": {"type": "Point", "coordinates": [129.008125, 35.143571]}, "elevation": 147.0}, {"id": "osm-4642032081", "building_id": null, "location": {"type": "Point", "coordinates": [129.008186, 35.143673]}, "elevation": 147.0}, {"id": "osm-4642032082", "building_id": null, "location": {"type": "Point", "coordinates": [129.008484, 35.143765]}, "elevation": 152.0}, {"id": "osm-4642032083", "building_id": null, "location": {"type": "Point", "coordinates": [129.008686, 35.143859]}, "elevation": 152.0}, {"id": "osm-4642032084", "building_id": null, "location": {"type": "Point", "coordinates": [129.008716, 35.143964]}, "elevation": 152.0}, {"id": "osm-4642032086", "building_id": null, "location": {"type": "Point", "coordinates": [129.007232, 35.144141]}, "elevation": 133.0}, {"id": "osm-4642032087", "building_id": null, "location": {"type": "Point", "coordinates": [129.007552, 35.144275]}, "elevation": 123.0}, {"id": "osm-4642032088", "building_id": null, "location": {"type": "Point", "coordinates": [129.007833, 35.144335]}, "elevation": 123.0}, {"id": "osm-4642036689", "building_id": null, "location": {"type": "Point", "coordinates": [129.007896, 35.144343]}, "elevation": 123.0}, {"id": "osm-4642036690", "building_id": null, "location": {"type": "Point", "coordinates": [129.00793, 35.144325]}, "elevation": 123.0}, {"id": "osm-4642036691", "building_id": null, "location": {"type": "Point", "coordinates": [129.008679, 35.144457]}, "elevation": 128.0}, {"id": "osm-4642036692", "building_id": null, "location": {"type": "Point", "coordinates": [129.008798, 35.14445]}, "elevation": 128.0}, {"id": "osm-4642036693", "building_id": null, "location": {"type": "Point", "coordinates": [129.00896, 35.144447]}, "elevation": 128.0}, {"id": "osm-4642036694", "building_id": null, "location": {"type": "Point", "coordinates": [129.006416, 35.143197]}, "elevation": 149.0}, {"id": "osm-4642036695", "building_id": null, "location": {"type": "Point", "coordinates": [129.006815, 35.143204]}, "elevation": 151.0}, {"id": "osm-4642036696", "building_id": null, "location": {"type": "Point", "coordinates": [129.006906, 35.143483]}, "elevation": 133.0}, {"id": "osm-4642036697", "building_id": null, "location": {"type": "Point", "coordinates": [129.00715, 35.143907]}, "elevation": 133.0}, {"id": "osm-4642036698", "building_id": null, "location": {"type": "Point", "coordinates": [129.007251, 35.143967]}, "elevation": 133.0}, {"id": "osm-4642036699", "building_id": null, "location": {"type": "Point", "coordinates": [129.007564, 35.144056]}, "elevation": 147.0}, {"id": "osm-4642036700", "building_id": null, "location": {"type": "Point", "coordinates": [129.008774, 35.144293]}, "elevation": 128.0}, {"id": "osm-4642036702", "building_id": null, "location": {"type": "Point", "coordinates": [129.008841, 35.144759]}, "elevation": 128.0}, {"id": "osm-4642036703", "building_id": null, "location": {"type": "Point", "coordinates": [129.008881, 35.144824]}, "elevation": 128.0}, {"id": "osm-4642036704", "building_id": null, "location": {"type": "Point", "coordinates": [129.00906, 35.144903]}, "elevation": 128.0}, {"id": "osm-4642036705", "building_id": null, "location": {"type": "Point", "coordinates": [129.009155, 35.144998]}, "elevation": 114.0}, {"id": "osm-4642036706", "building_id": null, "location": {"type": "Point", "coordinates": [129.009066, 35.145028]}, "elevation": 106.0}, {"id": "osm-4642036707", "building_id": null, "location": {"type": "Point", "coordinates": [129.009008, 35.145309]}, "elevation": 106.0}, {"id": "osm-4642036708", "building_id": null, "location": {"type": "Point", "coordinates": [129.009015, 35.144502]}, "elevation": 128.0}, {"id": "osm-4642036709", "building_id": null, "location": {"type": "Point", "coordinates": [129.009328, 35.144522]}, "elevation": 132.0}, {"id": "osm-4642036710", "building_id": null, "location": {"type": "Point", "coordinates": [129.009572, 35.144517]}, "elevation": 132.0}, {"id": "osm-4642036711", "building_id": null, "location": {"type": "Point", "coordinates": [129.009712, 35.144532]}, "elevation": 132.0}, {"id": "osm-4642036712", "building_id": null, "location": {"type": "Point", "coordinates": [129.009871, 35.144597]}, "elevation": 132.0}, {"id": "osm-4642036713", "building_id": null, "location": {"type": "Point", "coordinates": [129.010133, 35.144649]}, "elevation": 137.0}, {"id": "osm-4642036714", "building_id": null, "location": {"type": "Point", "coordinates": [129.010306, 35.144674]}, "elevation": 137.0}, {"id": "osm-4642036715", "building_id": null, "location": {"type": "Point", "coordinates": [129.009627, 35.145085]}, "elevation": 114.0}, {"id": "osm-4642036716", "building_id": null, "location": {"type": "Point", "coordinates": [129.00995, 35.145167]}, "elevation": 114.0}, {"id": "osm-4642036730", "building_id": null, "location": {"type": "Point", "coordinates": [129.008876, 35.145781]}, "elevation": 106.0}, {"id": "osm-4642036718", "building_id": null, "location": {"type": "Point", "coordinates": [129.008868, 35.14581]}, "elevation": 106.0}, {"id": "osm-1762118540", "building_id": null, "location": {"type": "Point", "coordinates": [129.012569, 35.14453]}, "elevation": 130.0}, {"id": "osm-4642036738", "building_id": null, "location": {"type": "Point", "coordinates": [129.007755, 35.146025]}, "elevation": 84.0}, {"id": "osm-4642036731", "building_id": null, "location": {"type": "Point", "coordinates": [129.008043, 35.145654]}, "elevation": 97.0}, {"id": "osm-4642036732", "building_id": null, "location": {"type": "Point", "coordinates": [129.007066, 35.145544]}, "elevation": 88.0}, {"id": "osm-4642036733", "building_id": null, "location": {"type": "Point", "coordinates": [129.006779, 35.145533]}, "elevation": 88.0}, {"id": "osm-6953410685", "building_id": null, "location": {"type": "Point", "coordinates": [129.006738, 35.145737]}, "elevation": 88.0}, {"id": "osm-4642036734", "building_id": null, "location": {"type": "Point", "coordinates": [129.006714, 35.145849]}, "elevation": 69.0}, {"id": "osm-4642036735", "building_id": null, "location": {"type": "Point", "coordinates": [129.007636, 35.145915]}, "elevation": 84.0}, {"id": "osm-4642036736", "building_id": null, "location": {"type": "Point", "coordinates": [129.006348, 35.146372]}, "elevation": 57.0}, {"id": "osm-4642036737", "building_id": null, "location": {"type": "Point", "coordinates": [129.007487, 35.146449]}, "elevation": 84.0}, {"id": "osm-4642036739", "building_id": null, "location": {"type": "Point", "coordinates": [129.011381, 35.146262]}, "elevation": 99.0}, {"id": "osm-4710085510", "building_id": null, "location": {"type": "Point", "coordinates": [129.01136, 35.145878]}, "elevation": 99.0}, {"id": "osm-4642036740", "building_id": null, "location": {"type": "Point", "coordinates": [129.011353, 35.145732]}, "elevation": 117.0}, {"id": "osm-4642036741", "building_id": null, "location": {"type": "Point", "coordinates": [129.011451, 35.14644]}, "elevation": 99.0}, {"id": "osm-4642036742", "building_id": null, "location": {"type": "Point", "coordinates": [129.011947, 35.146668]}, "elevation": 85.0}, {"id": "osm-4642036743", "building_id": null, "location": {"type": "Point", "coordinates": [129.0123, 35.146757]}, "elevation": 85.0}, {"id": "osm-4642036762", "building_id": null, "location": {"type": "Point", "coordinates": [129.008851, 35.145634]}, "elevation": 106.0}, {"id": "osm-4642036763", "building_id": null, "location": {"type": "Point", "coordinates": [129.008362, 35.145544]}, "elevation": 106.0}, {"id": "osm-4642036764", "building_id": null, "location": {"type": "Point", "coordinates": [129.007751, 35.145474]}, "elevation": 97.0}, {"id": "osm-4642036765", "building_id": null, "location": {"type": "Point", "coordinates": [129.007144, 35.145395]}, "elevation": 88.0}, {"id": "osm-4642036766", "building_id": null, "location": {"type": "Point", "coordinates": [129.007261, 35.144835]}, "elevation": 110.0}, {"id": "osm-4642036767", "building_id": null, "location": {"type": "Point", "coordinates": [129.007405, 35.144852]}, "elevation": 110.0}, {"id": "osm-4642036776", "building_id": null, "location": {"type": "Point", "coordinates": [129.007462, 35.14488]}, "elevation": 110.0}, {"id": "osm-4642036768", "building_id": null, "location": {"type": "Point", "coordinates": [129.007741, 35.145019]}, "elevation": 97.0}, {"id": "osm-4642036777", "building_id": null, "location": {"type": "Point", "coordinates": [129.007899, 35.145036]}, "elevation": 97.0}, {"id": "osm-4642036769", "building_id": null, "location": {"type": "Point", "coordinates": [129.008012, 35.145048]}, "elevation": 97.0}, {"id": "osm-4642036780", "building_id": null, "location": {"type": "Point", "coordinates": [129.008109, 35.145022]}, "elevation": 97.0}, {"id": "osm-4642036770", "building_id": null, "location": {"type": "Point", "coordinates": [129.008259, 35.144983]}, "elevation": 123.0}, {"id": "osm-4642036771", "building_id": null, "location": {"type": "Point", "coordinates": [129.008356, 35.144991]}, "elevation": 106.0}, {"id": "osm-4642036772", "building_id": null, "location": {"type": "Point", "coordinates": [129.008382, 35.144864]}, "elevation": 128.0}, {"id": "osm-4642036773", "building_id": null, "location": {"type": "Point", "coordinates": [129.007677, 35.144924]}, "elevation": 123.0}, {"id": "osm-4642036774", "building_id": null, "location": {"type": "Point", "coordinates": [129.00763, 35.144778]}, "elevation": 123.0}, {"id": "osm-4642036775", "building_id": null, "location": {"type": "Point", "coordinates": [129.007585, 35.144775]}, "elevation": 123.0}, {"id": "osm-4642036778", "building_id": null, "location": {"type": "Point", "coordinates": [129.00795, 35.144806]}, "elevation": 123.0}, {"id": "osm-4642036779", "building_id": null, "location": {"type": "Point", "coordinates": [129.008068, 35.144956]}, "elevation": 123.0}, {"id": "osm-4642036781", "building_id": null, "location": {"type": "Point", "coordinates": [129.008218, 35.144896]}, "elevation": 123.0}, {"id": "osm-4642036787", "building_id": null, "location": {"type": "Point", "coordinates": [129.01046, 35.145855]}, "elevation": 97.0}, {"id": "osm-4642036788", "building_id": null, "location": {"type": "Point", "coordinates": [129.011271, 35.145781]}, "elevation": 117.0}, {"id": "osm-6953410686", "building_id": null, "location": {"type": "Point", "coordinates": [129.007644, 35.145846]}, "elevation": 84.0}, {"id": "osm-6968170522", "building_id": null, "location": {"type": "Point", "coordinates": [129.010162, 35.145878]}, "elevation": 97.0}, {"id": "osm-6968170523", "building_id": null, "location": {"type": "Point", "coordinates": [129.010117, 35.146028]}, "elevation": 97.0}, {"id": "osm-6968170524", "building_id": null, "location": {"type": "Point", "coordinates": [129.010188, 35.14579]}, "elevation": 114.0}, {"id": "osm-6968170525", "building_id": null, "location": {"type": "Point", "coordinates": [129.010227, 35.145676]}, "elevation": 114.0}, {"id": "osm-6968170563", "building_id": null, "location": {"type": "Point", "coordinates": [129.008343, 35.145026]}, "elevation": 106.0}, {"id": "osm-6968170564", "building_id": null, "location": {"type": "Point", "coordinates": [129.008324, 35.145126]}, "elevation": 106.0}, {"id": "osm-6968170565", "building_id": null, "location": {"type": "Point", "coordinates": [129.008309, 35.145193]}, "elevation": 97.0}, {"id": "osm-6968170566", "building_id": null, "location": {"type": "Point", "coordinates": [129.00829, 35.145287]}, "elevation": 97.0}, {"id": "osm-6974524313", "building_id": null, "location": {"type": "Point", "coordinates": [129.010415, 35.144707]}, "elevation": 137.0}, {"id": "osm-6974524314", "building_id": null, "location": {"type": "Point", "coordinates": [129.010503, 35.144764]}, "elevation": 137.0}, {"id": "osm-4710085535", "building_id": null, "location": {"type": "Point", "coordinates": [129.007608, 35.146372]}, "elevation": 84.0}, {"id": "osm-4642036720", "building_id": null, "location": {"type": "Point", "coordinates": [129.007684, 35.146193]}, "elevation": 84.0}, {"id": "osm-4710085534", "building_id": null, "location": {"type": "Point", "coordinates": [129.007978, 35.145817]}, "elevation": 97.0}, {"id": "osm-11285265578", "building_id": null, "location": {"type": "Point", "coordinates": [129.008879, 35.14281]}, "elevation": 182.0}, {"id": "osm-11285265579", "building_id": null, "location": {"type": "Point", "coordinates": [129.008825, 35.142722]}, "elevation": 182.0}, {"id": "osm-11285265580", "building_id": null, "location": {"type": "Point", "coordinates": [129.008704, 35.142659]}, "elevation": 182.0}, {"id": "osm-11285287779", "building_id": null, "location": {"type": "Point", "coordinates": [129.013063, 35.142794]}, "elevation": 207.0}, {"id": "osm-11285287778", "building_id": null, "location": {"type": "Point", "coordinates": [129.012872, 35.142908]}, "elevation": 207.0}, {"id": "osm-11285287777", "building_id": null, "location": {"type": "Point", "coordinates": [129.012599, 35.143053]}, "elevation": 207.0}, {"id": "osm-11285287776", "building_id": null, "location": {"type": "Point", "coordinates": [129.012371, 35.143165]}, "elevation": 191.0}, {"id": "osm-11285287775", "building_id": null, "location": {"type": "Point", "coordinates": [129.012068, 35.143382]}, "elevation": 163.0}, {"id": "osm-11285287774", "building_id": null, "location": {"type": "Point", "coordinates": [129.011931, 35.143487]}, "elevation": 163.0}, {"id": "osm-11285287773", "building_id": null, "location": {"type": "Point", "coordinates": [129.011797, 35.143628]}, "elevation": 163.0}, {"id": "osm-11285287772", "building_id": null, "location": {"type": "Point", "coordinates": [129.011681, 35.143751]}, "elevation": 163.0}, {"id": "osm-11285287771", "building_id": null, "location": {"type": "Point", "coordinates": [129.011673, 35.143828]}, "elevation": 163.0}, {"id": "osm-11285287770", "building_id": null, "location": {"type": "Point", "coordinates": [129.011759, 35.143909]}, "elevation": 163.0}, {"id": "osm-11285287807", "building_id": null, "location": {"type": "Point", "coordinates": [129.010576, 35.142632]}, "elevation": 186.0}, {"id": "osm-11285287806", "building_id": null, "location": {"type": "Point", "coordinates": [129.01058, 35.142752]}, "elevation": 186.0}, {"id": "osm-11285287805", "building_id": null, "location": {"type": "Point", "coordinates": [129.010611, 35.142835]}, "elevation": 186.0}, {"id": "osm-11285287804", "building_id": null, "location": {"type": "Point", "coordinates": [129.010662, 35.142863]}, "elevation": 186.0}, {"id": "osm-11285287803", "building_id": null, "location": {"type": "Point", "coordinates": [129.010729, 35.142874]}, "elevation": 186.0}, {"id": "osm-11285287802", "building_id": null, "location": {"type": "Point", "coordinates": [129.010835, 35.142881]}, "elevation": 186.0}, {"id": "osm-11285287801", "building_id": null, "location": {"type": "Point", "coordinates": [129.010918, 35.142867]}, "elevation": 186.0}, {"id": "osm-11285287800", "building_id": null, "location": {"type": "Point", "coordinates": [129.011008, 35.142834]}, "elevation": 186.0}, {"id": "osm-11285287799", "building_id": null, "location": {"type": "Point", "coordinates": [129.011082, 35.142805]}, "elevation": 186.0}, {"id": "osm-11285287798", "building_id": null, "location": {"type": "Point", "coordinates": [129.011122, 35.142797]}, "elevation": 186.0}, {"id": "osm-11285287797", "building_id": null, "location": {"type": "Point", "coordinates": [129.011229, 35.142815]}, "elevation": 186.0}, {"id": "osm-11285287796", "building_id": null, "location": {"type": "Point", "coordinates": [129.011284, 35.142814]}, "elevation": 186.0}, {"id": "osm-11285287795", "building_id": null, "location": {"type": "Point", "coordinates": [129.011363, 35.142803]}, "elevation": 186.0}, {"id": "osm-11285287794", "building_id": null, "location": {"type": "Point", "coordinates": [129.011408, 35.14281]}, "elevation": 186.0}, {"id": "osm-11285287793", "building_id": null, "location": {"type": "Point", "coordinates": [129.011433, 35.142847]}, "elevation": 186.0}, {"id": "osm-11285287792", "building_id": null, "location": {"type": "Point", "coordinates": [129.01147, 35.143]}, "elevation": 186.0}, {"id": "osm-11285287791", "building_id": null, "location": {"type": "Point", "coordinates": [129.01147, 35.143042]}, "elevation": 186.0}, {"id": "osm-11285287790", "building_id": null, "location": {"type": "Point", "coordinates": [129.011429, 35.143153]}, "elevation": 186.0}, {"id": "osm-11285287789", "building_id": null, "location": {"type": "Point", "coordinates": [129.011394, 35.143254]}, "elevation": 186.0}, {"id": "osm-11285287788", "building_id": null, "location": {"type": "Point", "coordinates": [129.0114, 35.143312]}, "elevation": 186.0}, {"id": "osm-11285287787", "building_id": null, "location": {"type": "Point", "coordinates": [129.011447, 35.143494]}, "elevation": 160.0}, {"id": "osm-11285287786", "building_id": null, "location": {"type": "Point", "coordinates": [129.011453, 35.143559]}, "elevation": 160.0}, {"id": "osm-11285287785", "building_id": null, "location": {"type": "Point", "coordinates": [129.011437, 35.143593]}, "elevation": 160.0}, {"id": "osm-11285287784", "building_id": null, "location": {"type": "Point", "coordinates": [129.011357, 35.14362]}, "elevation": 160.0}, {"id": "osm-11285287783", "building_id": null, "location": {"type": "Point", "coordinates": [129.011321, 35.143708]}, "elevation": 160.0}, {"id": "osm-11285287782", "building_id": null, "location": {"type": "Point", "coordinates": [129.011306, 35.143763]}, "elevation": 160.0}, {"id": "bldg-1", "building_id": 1, "location": {"type": "Point", "coordinates": [129.007613, 35.145252]}, "elevation": 97.0}, {"id": "bldg-2", "building_id": 2, "location": {"type": "Point", "coordinates": [129.007242, 35.145669]}, "elevation": 88.0}, {"id": "bldg-3", "building_id": 3, "location": {"type": "Point", "coordinates": [129.007588, 35.144663]}, "elevation": 123.0}, {"id": "bldg-4", "building_id": 4, "location": {"type": "Point", "coordinates": [129.00827, 35.146058]}, "elevation": 84.0}, {"id": "bldg-5", "building_id": 5, "location": {"type": "Point", "coordinates": [129.008671, 35.145307]}, "elevation": 106.0}, {"id": "bldg-6", "building_id": 6, "location": {"type": "Point", "coordinates": [129.009538, 35.144697]}, "elevation": 132.0}, {"id": "bldg-7", "building_id": 7, "location": {"type": "Point", "coordinates": [129.008217, 35.143939]}, "elevation": 147.0}, {"id": "bldg-8", "building_id": 8, "location": {"type": "Point", "coordinates": [129.007729, 35.143695]}, "elevation": 147.0}, {"id": "bldg-9", "building_id": 9, "location": {"type": "Point", "coordinates": [129.012517, 35.144105]}, "elevation": 162.0}, {"id": "bldg-10", "building_id": 10, "location": {"type": "Point", "coordinates": [129.009453, 35.14571]}, "elevation": 114.0}, {"id": "bldg-11", "building_id": 11, "location": {"type": "Point", "coordinates": [129.009769, 35.146412]}, "elevation": 97.0}, {"id": "bldg-12", "building_id": 12, "location": {"type": "Point", "coordinates": [129.011525, 35.14528]}, "elevation": 117.0}, {"id": "bldg-13", "building_id": 13, "location": {"type": "Point", "coordinates": [129.010836, 35.145513]}, "elevation": 117.0}, {"id": "bldg-14", "building_id": 14, "location": {"type": "Point", "coordinates": [129.007346, 35.146065]}, "elevation": 69.0}, {"id": "bldg-15", "building_id": 15, "location": {"type": "Point", "coordinates": [129.006738, 35.143596]}, "elevation": 133.0}, {"id": "bldg-16", "building_id": 16, "location": {"type": "Point", "coordinates": [129.008792, 35.146233]}, "elevation": 90.0}, {"id": "bldg-17", "building_id": 17, "location": {"type": "Point", "coordinates": [129.008271, 35.146205]}, "elevation": 84.0}, {"id": "bldg-18", "building_id": 18, "location": {"type": "Point", "coordinates": [129.010437, 35.144083]}, "elevation": 159.0}, {"id": "bldg-19", "building_id": 19, "location": {"type": "Point", "coordinates": [129.010945, 35.144072]}, "elevation": 160.0}, {"id": "bldg-20", "building_id": 20, "location": {"type": "Point", "coordinates": [129.010942, 35.143556]}, "elevation": 160.0}, {"id": "bldg-21", "building_id": 21, "location": {"type": "Point", "coordinates": [129.010428, 35.143584]}, "elevation": 159.0}, {"id": "bldg-22", "building_id": 22, "location": {"type": "Point", "coordinates": [129.009102, 35.146244]}, "elevation": 90.0}, {"id": "bldg-23", "building_id": 23, "location": {"type": "Point", "coordinates": [129.00722, 35.14415]}, "elevation": 136.0}, {"id": "bldg-24", "building_id": 24, "location": {"type": "Point", "coordinates": [129.00855, 35.14448]}, "elevation": 134.0}, {"id": "bldg-25", "building_id": 25, "location": {"type": "Point", "coordinates": [129.00812, 35.14328]}, "elevation": 154.0}, {"id": "bldg-26", "building_id": 26, "location": {"type": "Point", "coordinates": [129.007817, 35.14283]}, "elevation": 158.0}, {"id": "bldg-27", "building_id": 27, "location": {"type": "Point", "coordinates": [129.01105, 35.14492]}, "elevation": 135.0}, {"id": "bldg-28", "building_id": 28, "location": {"type": "Point", "coordinates": [129.00958, 35.14382]}, "elevation": 152.0}, {"id": "bldg-29", "building_id": 29, "location": {"type": "Point", "coordinates": [129.00958, 35.14422]}, "elevation": 145.0}, {"id": "bldg-30", "building_id": 30, "location": {"type": "Point", "coordinates": [129.00965, 35.14335]}, "elevation": 158.0}]

export const SEEDED_PATH_EDGES: CampusEdge[] = [{"id": "edge-1", "from_node": "osm-1762118438", "to_node": "osm-1762118482", "distance_m": 47.7, "slope_pct": -35.0, "is_step_free": true, "bidirectional": true, "accessible": true}, {"id": "edge-2", "from_node": "osm-1762118527", "to_node": "osm-4642036745", "distance_m": 45.1, "slope_pct": -26.6, "is_step_free": true, "bidirectional": true, "accessible": true}, {"id": "edge-3", "from_node": "osm-1762118301", "to_node": "osm-4642036701", "distance_m": 23.5, "slope_pct": 35.0, "is_step_free": true, "bidirectional": true, "accessible": true}, {"id": "edge-4", "from_node": "osm-4642036701", "to_node": "osm-1762118163", "distance_m": 6.2, "slope_pct": 0.0, "is_step_free": true, "bidirectional": true, "accessible": true}, {"id": "edge-5", "from_node": "osm-1762118163", "to_node": "osm-1762118518", "distance_m": 24.2, "slope_pct": -35.0, "is_step_free": true, "bidirectional": true, "accessible": true}, {"id": "edge-6", "from_node": "osm-1762118518", "to_node": "osm-1762118178", "distance_m": 92.1, "slope_pct": 5.4, "is_step_free": true, "bidirectional": true, "accessible": true}, {"id": "edge-7", "from_node": "osm-1762118178", "to_node": "osm-1762118482", "distance_m": 48.8, "slope_pct": 8.2, "is_step_free": true, "bidirectional": true, "accessible": true}, {"id": "edge-8", "from_node": "osm-1762118482", "to_node": "osm-4642032058", "distance_m": 110.2, "slope_pct": 4.5, "is_step_free": true, "bidirectional": true, "accessible": true}, {"id": "edge-9", "from_node": "osm-4642032058", "to_node": "osm-4632371524", "distance_m": 59.0, "slope_pct": 1.7, "is_step_free": true, "bidirectional": true, "accessible": true}, {"id": "edge-10", "from_node": "osm-436806147", "to_node": "osm-1762118283", "distance_m": 55.0, "slope_pct": -1.8, "is_step_free": true, "bidirectional": true, "accessible": true}, {"id": "edge-11", "from_node": "osm-1762118283", "to_node": "osm-4710085538", "distance_m": 33.2, "slope_pct": 0.0, "is_step_free": true, "bidirectional": true, "accessible": true}, {"id": "edge-12", "from_node": "osm-4710085538", "to_node": "osm-4710085537", "distance_m": 15.7, "slope_pct": 0.0, "is_step_free": true, "bidirectional": true, "accessible": true}, {"id": "edge-13", "from_node": "osm-4710085537", "to_node": "osm-4710085531", "distance_m": 29.5, "slope_pct": -16.9, "is_step_free": true, "bidirectional": true, "accessible": true}, {"id": "edge-14", "from_node": "osm-4710085531", "to_node": "osm-1762118343", "distance_m": 38.4, "slope_pct": 0.0, "is_step_free": true, "bidirectional": true, "accessible": true}, {"id": "edge-15", "from_node": "osm-1762118343", "to_node": "osm-4710085532", "distance_m": 67.9, "slope_pct": 16.2, "is_step_free": true, "bidirectional": true, "accessible": true}, {"id": "edge-16", "from_node": "osm-4710085532", "to_node": "osm-7247047825", "distance_m": 28.9, "slope_pct": -20.8, "is_step_free": true, "bidirectional": true, "accessible": true}, {"id": "edge-17", "from_node": "osm-7247047825", "to_node": "osm-1762118434", "distance_m": 31.5, "slope_pct": 0.0, "is_step_free": true, "bidirectional": true, "accessible": true}, {"id": "edge-18", "from_node": "osm-1762118434", "to_node": "osm-4632371512", "distance_m": 27.4, "slope_pct": 0.0, "is_step_free": true, "bidirectional": true, "accessible": true}, {"id": "edge-19", "from_node": "osm-4632371512", "to_node": "osm-1762118371", "distance_m": 99.2, "slope_pct": -27.2, "is_step_free": true, "bidirectional": true, "accessible": true}, {"id": "edge-20", "from_node": "osm-4632371513", "to_node": "osm-4632371514", "distance_m": 36.1, "slope_pct": 24.9, "is_step_free": true, "bidirectional": true, "accessible": true}, {"id": "edge-21", "from_node": "osm-4632371514", "to_node": "osm-4642036719", "distance_m": 27.9, "slope_pct": -35.0, "is_step_free": true, "bidirectional": true, "accessible": true}, {"id": "edge-22", "from_node": "osm-4642036719", "to_node": "osm-4632371515", "distance_m": 28.8, "slope_pct": 0.0, "is_step_free": true, "bidirectional": true, "accessible": true}, {"id": "edge-23", "from_node": "osm-4632371515", "to_node": "osm-4632371516", "distance_m": 105.0, "slope_pct": 6.7, "is_step_free": true, "bidirectional": true, "accessible": true}, {"id": "edge-24", "from_node": "osm-4632371516", "to_node": "osm-4632371517", "distance_m": 29.7, "slope_pct": 0.0, "is_step_free": true, "bidirectional": true, "accessible": true}, {"id": "edge-25", "from_node": "osm-4632371517", "to_node": "osm-4642036717", "distance_m": 94.1, "slope_pct": 18.1, "is_step_free": true, "bidirectional": true, "accessible": true}, {"id": "edge-26", "from_node": "osm-4642036717", "to_node": "osm-4632371518", "distance_m": 11.5, "slope_pct": 0.0, "is_step_free": true, "bidirectional": true, "accessible": true}, {"id": "edge-27", "from_node": "osm-4632371517", "to_node": "osm-4632371519", "distance_m": 72.3, "slope_pct": 2.8, "is_step_free": true, "bidirectional": true, "accessible": true}, {"id": "edge-28", "from_node": "osm-4632371518", "to_node": "osm-4632371520", "distance_m": 17.6, "slope_pct": 0.0, "is_step_free": true, "bidirectional": true, "accessible": true}, {"id": "edge-29", "from_node": "osm-4632371520", "to_node": "osm-4632371521", "distance_m": 36.8, "slope_pct": 35.0, "is_step_free": true, "bidirectional": true, "accessible": true}, {"id": "edge-30", "from_node": "osm-4632371521", "to_node": "osm-7351322764", "distance_m": 2.8, "slope_pct": 0.0, "is_step_free": true, "bidirectional": true, "accessible": true}, {"id": "edge-31", "from_node": "osm-7351322764", "to_node": "osm-4632371524", "distance_m": 76.7, "slope_pct": 1.3, "is_step_free": true, "bidirectional": true, "accessible": true}, {"id": "edge-32", "from_node": "osm-4632371516", "to_node": "osm-4710085536", "distance_m": 31.5, "slope_pct": 0.0, "is_step_free": true, "bidirectional": true, "accessible": true}, {"id": "edge-33", "from_node": "osm-4710085536", "to_node": "osm-4632371526", "distance_m": 23.0, "slope_pct": 0.0, "is_step_free": true, "bidirectional": true, "accessible": true}, {"id": "edge-34", "from_node": "osm-4632371526", "to_node": "osm-4710085538", "distance_m": 14.8, "slope_pct": -35.0, "is_step_free": true, "bidirectional": true, "accessible": true}, {"id": "edge-35", "from_node": "osm-4710085536", "to_node": "osm-4632371528", "distance_m": 62.6, "slope_pct": 0.0, "is_step_free": true, "bidirectional": true, "accessible": true}, {"id": "edge-36", "from_node": "osm-4642032041", "to_node": "osm-4642032042", "distance_m": 18.3, "slope_pct": 0.0, "is_step_free": true, "bidirectional": true, "accessible": true}, {"id": "edge-37", "from_node": "osm-4642032042", "to_node": "osm-4642032043", "distance_m": 4.7, "slope_pct": 0.0, "is_step_free": true, "bidirectional": true, "accessible": true}, {"id": "edge-38", "from_node": "osm-4642032043", "to_node": "osm-4642032044", "distance_m": 59.2, "slope_pct": 1.7, "is_step_free": true, "bidirectional": true, "accessible": true}, {"id": "edge-39", "from_node": "osm-4642032044", "to_node": "osm-4642032045", "distance_m": 13.6, "slope_pct": 0.0, "is_step_free": true, "bidirectional": true, "accessible": true}, {"id": "edge-40", "from_node": "osm-4642032045", "to_node": "osm-4642032046", "distance_m": 21.3, "slope_pct": 0.0, "is_step_free": true, "bidirectional": true, "accessible": true}, {"id": "edge-41", "from_node": "osm-4642032046", "to_node": "osm-4642032047", "distance_m": 13.2, "slope_pct": 0.0, "is_step_free": true, "bidirectional": true, "accessible": true}, {"id": "edge-42", "from_node": "osm-4642032047", "to_node": "osm-11285287769", "distance_m": 6.1, "slope_pct": 0.0, "is_step_free": true, "bidirectional": true, "accessible": true}, {"id": "edge-43", "from_node": "osm-11285287769", "to_node": "osm-4642032048", "distance_m": 6.8, "slope_pct": 0.0, "is_step_free": true, "bidirectional": true, "accessible": true}, {"id": "edge-44", "from_node": "osm-4642032048", "to_node": "osm-4642032049", "distance_m": 10.4, "slope_pct": -28.8, "is_step_free": true, "bidirectional": true, "accessible": true}, {"id": "edge-45", "from_node": "osm-4642032049", "to_node": "osm-4642032050", "distance_m": 13.8, "slope_pct": 0.0, "is_step_free": true, "bidirectional": true, "accessible": true}, {"id": "edge-46", "from_node": "osm-4642032050", "to_node": "osm-4642032051", "distance_m": 21.0, "slope_pct": 0.0, "is_step_free": true, "bidirectional": true, "accessible": true}, {"id": "edge-47", "from_node": "osm-4642032051", "to_node": "osm-4642032052", "distance_m": 5.1, "slope_pct": 0.0, "is_step_free": true, "bidirectional": true, "accessible": true}, {"id": "edge-48", "from_node": "osm-4642032052", "to_node": "osm-4642032053", "distance_m": 99.1, "slope_pct": -1.0, "is_step_free": true, "bidirectional": true, "accessible": true}, {"id": "edge-49", "from_node": "osm-4642032053", "to_node": "osm-4642032054", "distance_m": 10.8, "slope_pct": 0.0, "is_step_free": true, "bidirectional": true, "accessible": true}, {"id": "edge-50", "from_node": "osm-4642032054", "to_node": "osm-4642032055", "distance_m": 15.9, "slope_pct": 0.0, "is_step_free": true, "bidirectional": true, "accessible": true}, {"id": "edge-51", "from_node": "osm-4642032055", "to_node": "osm-4642032056", "distance_m": 17.3, "slope_pct": -35.0, "is_step_free": true, "bidirectional": true, "accessible": true}, {"id": "edge-52", "from_node": "osm-4642032056", "to_node": "osm-4642032057", "distance_m": 19.0, "slope_pct": 0.0, "is_step_free": true, "bidirectional": true, "accessible": true}, {"id": "edge-53", "from_node": "osm-4642032057", "to_node": "osm-4642032058", "distance_m": 21.4, "slope_pct": 0.0, "is_step_free": true, "bidirectional": true, "accessible": true}, {"id": "edge-54", "from_node": "osm-4642032051", "to_node": "osm-11285287781", "distance_m": 3.6, "slope_pct": 0.0, "is_step_free": true, "bidirectional": true, "accessible": true}, {"id": "edge-55", "from_node": "osm-11285287781", "to_node": "osm-4642032059", "distance_m": 8.8, "slope_pct": 0.0, "is_step_free": true, "bidirectional": true, "accessible": true}, {"id": "edge-56", "from_node": "osm-4642032059", "to_node": "osm-4642032060", "distance_m": 23.9, "slope_pct": 0.0, "is_step_free": true, "bidirectional": true, "accessible": true}, {"id": "edge-57", "from_node": "osm-1762118301", "to_node": "osm-4642032085", "distance_m": 10.4, "slope_pct": 0.0, "is_step_free": true, "bidirectional": true, "accessible": true}, {"id": "edge-58", "from_node": "osm-4642032085", "to_node": "osm-4642032061", "distance_m": 22.7, "slope_pct": 0.0, "is_step_free": true, "bidirectional": true, "accessible": true}, {"id": "edge-59", "from_node": "osm-4642032061", "to_node": "osm-4642032062", "distance_m": 20.1, "slope_pct": 0.0, "is_step_free": true, "bidirectional": true, "accessible": true}, {"id": "edge-60", "from_node": "osm-4642032062", "to_node": "osm-4642032063", "distance_m": 69.2, "slope_pct": -20.2, "is_step_free": true, "bidirectional": true, "accessible": true}, {"id": "edge-61", "from_node": "osm-4642032064", "to_node": "osm-4642032069", "distance_m": 10.1, "slope_pct": 0.0, "is_step_free": true, "bidirectional": true, "accessible": true}, {"id": "edge-62", "from_node": "osm-4642032069", "to_node": "osm-4642032065", "distance_m": 17.0, "slope_pct": 0.0, "is_step_free": true, "bidirectional": true, "accessible": true}, {"id": "edge-63", "from_node": "osm-4642032065", "to_node": "osm-4642032066", "distance_m": 13.3, "slope_pct": 0.0, "is_step_free": true, "bidirectional": true, "accessible": true}, {"id": "edge-64", "from_node": "osm-4642032066", "to_node": "osm-4642032067", "distance_m": 8.9, "slope_pct": 0.0, "is_step_free": true, "bidirectional": true, "accessible": true}, {"id": "edge-65", "from_node": "osm-4642032067", "to_node": "osm-4642032068", "distance_m": 5.4, "slope_pct": 0.0, "is_step_free": true, "bidirectional": true, "accessible": true}, {"id": "edge-66", "from_node": "osm-4642032069", "to_node": "osm-4642032070", "distance_m": 11.0, "slope_pct": 0.0, "is_step_free": true, "bidirectional": true, "accessible": true}, {"id": "edge-67", "from_node": "osm-4642032070", "to_node": "osm-4642032071", "distance_m": 54.3, "slope_pct": -35.0, "is_step_free": true, "bidirectional": true, "accessible": true}, {"id": "edge-68", "from_node": "osm-4642032071", "to_node": "osm-4642032072", "distance_m": 13.9, "slope_pct": 0.0, "is_step_free": true, "bidirectional": true, "accessible": true}, {"id": "edge-69", "from_node": "osm-4642032072", "to_node": "osm-4642032073", "distance_m": 17.0, "slope_pct": 0.0, "is_step_free": true, "bidirectional": true, "accessible": true}, {"id": "edge-70", "from_node": "osm-4642032073", "to_node": "osm-4642032074", "distance_m": 25.6, "slope_pct": 35.0, "is_step_free": true, "bidirectional": true, "accessible": true}, {"id": "edge-71", "from_node": "osm-4642032074", "to_node": "osm-4642032075", "distance_m": 22.6, "slope_pct": 0.0, "is_step_free": true, "bidirectional": true, "accessible": true}, {"id": "edge-72", "from_node": "osm-4642032075", "to_node": "osm-4642032076", "distance_m": 5.7, "slope_pct": 0.0, "is_step_free": true, "bidirectional": true, "accessible": true}, {"id": "edge-73", "from_node": "osm-4642032071", "to_node": "osm-4642032077", "distance_m": 14.4, "slope_pct": 0.0, "is_step_free": true, "bidirectional": true, "accessible": true}, {"id": "edge-74", "from_node": "osm-4642032077", "to_node": "osm-4642032078", "distance_m": 44.5, "slope_pct": 31.5, "is_step_free": true, "bidirectional": true, "accessible": true}, {"id": "edge-75", "from_node": "osm-4642032078", "to_node": "osm-4642032079", "distance_m": 7.2, "slope_pct": 0.0, "is_step_free": true, "bidirectional": true, "accessible": true}, {"id": "edge-76", "from_node": "osm-4642032079", "to_node": "osm-4642032080", "distance_m": 12.9, "slope_pct": 0.0, "is_step_free": true, "bidirectional": true, "accessible": true}, {"id": "edge-77", "from_node": "osm-4642032080", "to_node": "osm-4642032081", "distance_m": 12.6, "slope_pct": 0.0, "is_step_free": true, "bidirectional": true, "accessible": true}, {"id": "edge-78", "from_node": "osm-4642032081", "to_node": "osm-4642032082", "distance_m": 29.0, "slope_pct": 17.2, "is_step_free": true, "bidirectional": true, "accessible": true}, {"id": "edge-79", "from_node": "osm-4642032082", "to_node": "osm-4642032083", "distance_m": 21.1, "slope_pct": 0.0, "is_step_free": true, "bidirectional": true, "accessible": true}, {"id": "edge-80", "from_node": "osm-4642032083", "to_node": "osm-4642032084", "distance_m": 12.0, "slope_pct": 0.0, "is_step_free": true, "bidirectional": true, "accessible": true}, {"id": "edge-81", "from_node": "osm-4642032084", "to_node": "osm-1762118438", "distance_m": 25.3, "slope_pct": 0.0, "is_step_free": true, "bidirectional": true, "accessible": true}, {"id": "edge-82", "from_node": "osm-4642032085", "to_node": "osm-4642032086", "distance_m": 8.2, "slope_pct": 0.0, "is_step_free": true, "bidirectional": true, "accessible": true}, {"id": "edge-83", "from_node": "osm-4642032086", "to_node": "osm-4642032087", "distance_m": 32.7, "slope_pct": -30.6, "is_step_free": true, "bidirectional": true, "accessible": true}, {"id": "edge-84", "from_node": "osm-4642032087", "to_node": "osm-4642032088", "distance_m": 26.4, "slope_pct": 0.0, "is_step_free": true, "bidirectional": true, "accessible": true}, {"id": "edge-85", "from_node": "osm-4642032088", "to_node": "osm-4642036689", "distance_m": 5.8, "slope_pct": 0.0, "is_step_free": true, "bidirectional": true, "accessible": true}, {"id": "edge-86", "from_node": "osm-4642036689", "to_node": "osm-4642036690", "distance_m": 3.7, "slope_pct": 0.0, "is_step_free": true, "bidirectional": true, "accessible": true}, {"id": "edge-87", "from_node": "osm-4642036690", "to_node": "osm-4642036691", "distance_m": 69.7, "slope_pct": 7.2, "is_step_free": true, "bidirectional": true, "accessible": true}, {"id": "edge-88", "from_node": "osm-4642036691", "to_node": "osm-4642036692", "distance_m": 10.8, "slope_pct": 0.0, "is_step_free": true, "bidirectional": true, "accessible": true}, {"id": "edge-89", "from_node": "osm-4642036692", "to_node": "osm-4642036693", "distance_m": 14.7, "slope_pct": 0.0, "is_step_free": true, "bidirectional": true, "accessible": true}, {"id": "edge-90", "from_node": "osm-4642036694", "to_node": "osm-4642036695", "distance_m": 36.3, "slope_pct": 5.5, "is_step_free": true, "bidirectional": true, "accessible": true}, {"id": "edge-91", "from_node": "osm-4642036695", "to_node": "osm-4642036696", "distance_m": 32.1, "slope_pct": -35.0, "is_step_free": true, "bidirectional": true, "accessible": true}, {"id": "edge-92", "from_node": "osm-4642036696", "to_node": "osm-4642036697", "distance_m": 52.1, "slope_pct": 0.0, "is_step_free": true, "bidirectional": true, "accessible": true}, {"id": "edge-93", "from_node": "osm-4642036697", "to_node": "osm-4642036698", "distance_m": 11.4, "slope_pct": 0.0, "is_step_free": true, "bidirectional": true, "accessible": true}, {"id": "edge-94", "from_node": "osm-4642036698", "to_node": "osm-4642036699", "distance_m": 30.1, "slope_pct": 35.0, "is_step_free": true, "bidirectional": true, "accessible": true}, {"id": "edge-95", "from_node": "osm-4642036699", "to_node": "osm-4642032076", "distance_m": 14.2, "slope_pct": 0.0, "is_step_free": true, "bidirectional": true, "accessible": true}, {"id": "edge-96", "from_node": "osm-4642032076", "to_node": "osm-4642036700", "distance_m": 99.0, "slope_pct": -19.2, "is_step_free": true, "bidirectional": true, "accessible": true}, {"id": "edge-97", "from_node": "osm-4642036700", "to_node": "osm-1762118178", "distance_m": 12.3, "slope_pct": 0.0, "is_step_free": true, "bidirectional": true, "accessible": true}, {"id": "edge-98", "from_node": "osm-4642036701", "to_node": "osm-4642036699", "distance_m": 8.0, "slope_pct": 0.0, "is_step_free": true, "bidirectional": true, "accessible": true}, {"id": "edge-99", "from_node": "osm-4642036693", "to_node": "osm-4642036702", "distance_m": 36.3, "slope_pct": 0.0, "is_step_free": true, "bidirectional": true, "accessible": true}, {"id": "edge-100", "from_node": "osm-4642036702", "to_node": "osm-4642036703", "distance_m": 8.1, "slope_pct": 0.0, "is_step_free": true, "bidirectional": true, "accessible": true}, {"id": "edge-101", "from_node": "osm-4642036703", "to_node": "osm-4642036704", "distance_m": 18.5, "slope_pct": 0.0, "is_step_free": true, "bidirectional": true, "accessible": true}, {"id": "edge-102", "from_node": "osm-4642036704", "to_node": "osm-4642036705", "distance_m": 13.6, "slope_pct": -35.0, "is_step_free": true, "bidirectional": true, "accessible": true}, {"id": "edge-103", "from_node": "osm-4642036705", "to_node": "osm-4642036706", "distance_m": 8.8, "slope_pct": -35.0, "is_step_free": true, "bidirectional": true, "accessible": true}, {"id": "edge-104", "from_node": "osm-4642036706", "to_node": "osm-4642036707", "distance_m": 31.7, "slope_pct": 0.0, "is_step_free": true, "bidirectional": true, "accessible": true}, {"id": "edge-105", "from_node": "osm-4642036693", "to_node": "osm-4642036708", "distance_m": 7.9, "slope_pct": 0.0, "is_step_free": true, "bidirectional": true, "accessible": true}, {"id": "edge-106", "from_node": "osm-4642036708", "to_node": "osm-4642036709", "distance_m": 28.5, "slope_pct": 14.0, "is_step_free": true, "bidirectional": true, "accessible": true}, {"id": "edge-107", "from_node": "osm-4642036709", "to_node": "osm-4642036710", "distance_m": 22.2, "slope_pct": 0.0, "is_step_free": true, "bidirectional": true, "accessible": true}, {"id": "edge-108", "from_node": "osm-4642036710", "to_node": "osm-4642036711", "distance_m": 12.8, "slope_pct": 0.0, "is_step_free": true, "bidirectional": true, "accessible": true}, {"id": "edge-109", "from_node": "osm-4642036711", "to_node": "osm-4642036712", "distance_m": 16.2, "slope_pct": 0.0, "is_step_free": true, "bidirectional": true, "accessible": true}, {"id": "edge-110", "from_node": "osm-4642036712", "to_node": "osm-4642036713", "distance_m": 24.5, "slope_pct": 20.4, "is_step_free": true, "bidirectional": true, "accessible": true}, {"id": "edge-111", "from_node": "osm-4642036713", "to_node": "osm-4642036714", "distance_m": 16.0, "slope_pct": 0.0, "is_step_free": true, "bidirectional": true, "accessible": true}, {"id": "edge-112", "from_node": "osm-4642036705", "to_node": "osm-4642036715", "distance_m": 44.0, "slope_pct": 0.0, "is_step_free": true, "bidirectional": true, "accessible": true}, {"id": "edge-113", "from_node": "osm-4642036715", "to_node": "osm-4642036716", "distance_m": 30.8, "slope_pct": 0.0, "is_step_free": true, "bidirectional": true, "accessible": true}, {"id": "edge-114", "from_node": "osm-4642036716", "to_node": "osm-4642036717", "distance_m": 41.0, "slope_pct": 0.0, "is_step_free": true, "bidirectional": true, "accessible": true}, {"id": "edge-115", "from_node": "osm-4642036707", "to_node": "osm-4642036730", "distance_m": 53.8, "slope_pct": 0.0, "is_step_free": true, "bidirectional": true, "accessible": true}, {"id": "edge-116", "from_node": "osm-4642036730", "to_node": "osm-4642036718", "distance_m": 3.3, "slope_pct": 0.0, "is_step_free": true, "bidirectional": true, "accessible": true}, {"id": "edge-117", "from_node": "osm-4642036718", "to_node": "osm-4642036719", "distance_m": 13.9, "slope_pct": -35.0, "is_step_free": true, "bidirectional": true, "accessible": true}, {"id": "edge-118", "from_node": "osm-4642036714", "to_node": "osm-4632371521", "distance_m": 13.1, "slope_pct": 0.0, "is_step_free": false, "bidirectional": true, "accessible": true}, {"id": "edge-119", "from_node": "osm-4632371524", "to_node": "osm-1762118540", "distance_m": 121.2, "slope_pct": -6.6, "is_step_free": true, "bidirectional": true, "accessible": true}, {"id": "edge-120", "from_node": "osm-4642036738", "to_node": "osm-4642036731", "distance_m": 48.9, "slope_pct": 26.6, "is_step_free": true, "bidirectional": true, "accessible": true}, {"id": "edge-121", "from_node": "osm-4642036731", "to_node": "osm-4642036732", "distance_m": 89.7, "slope_pct": -10.0, "is_step_free": true, "bidirectional": true, "accessible": true}, {"id": "edge-122", "from_node": "osm-4642036733", "to_node": "osm-6953410685", "distance_m": 23.0, "slope_pct": 0.0, "is_step_free": true, "bidirectional": true, "accessible": true}, {"id": "edge-123", "from_node": "osm-6953410685", "to_node": "osm-4642036734", "distance_m": 12.6, "slope_pct": -35.0, "is_step_free": true, "bidirectional": true, "accessible": true}, {"id": "edge-124", "from_node": "osm-4642036734", "to_node": "osm-4642036735", "distance_m": 84.2, "slope_pct": 17.8, "is_step_free": true, "bidirectional": true, "accessible": true}, {"id": "edge-125", "from_node": "osm-4642036735", "to_node": "osm-4642036738", "distance_m": 16.3, "slope_pct": 0.0, "is_step_free": true, "bidirectional": true, "accessible": true}, {"id": "edge-126", "from_node": "osm-4642036736", "to_node": "osm-4642036737", "distance_m": 103.9, "slope_pct": 26.0, "is_step_free": true, "bidirectional": true, "accessible": true}, {"id": "edge-127", "from_node": "osm-4642036737", "to_node": "osm-4642036738", "distance_m": 53.1, "slope_pct": 0.0, "is_step_free": true, "bidirectional": true, "accessible": true}, {"id": "edge-128", "from_node": "osm-4632371519", "to_node": "osm-4642036739", "distance_m": 27.1, "slope_pct": 0.0, "is_step_free": true, "bidirectional": true, "accessible": true}, {"id": "edge-129", "from_node": "osm-4642036739", "to_node": "osm-4710085510", "distance_m": 42.7, "slope_pct": 0.0, "is_step_free": true, "bidirectional": true, "accessible": true}, {"id": "edge-130", "from_node": "osm-4710085510", "to_node": "osm-4642036740", "distance_m": 16.2, "slope_pct": 35.0, "is_step_free": true, "bidirectional": true, "accessible": true}, {"id": "edge-131", "from_node": "osm-4632371519", "to_node": "osm-4642036741", "distance_m": 28.1, "slope_pct": 0.0, "is_step_free": true, "bidirectional": true, "accessible": true}, {"id": "edge-132", "from_node": "osm-4642036741", "to_node": "osm-4642036742", "distance_m": 51.7, "slope_pct": -27.1, "is_step_free": true, "bidirectional": true, "accessible": true}, {"id": "edge-133", "from_node": "osm-4642036742", "to_node": "osm-4642036743", "distance_m": 33.6, "slope_pct": 0.0, "is_step_free": true, "bidirectional": true, "accessible": true}, {"id": "edge-134", "from_node": "osm-4642036762", "to_node": "osm-4642036763", "distance_m": 45.6, "slope_pct": 0.0, "is_step_free": true, "bidirectional": true, "accessible": true}, {"id": "edge-135", "from_node": "osm-4642036763", "to_node": "osm-4642036764", "distance_m": 56.1, "slope_pct": -16.0, "is_step_free": true, "bidirectional": true, "accessible": true}, {"id": "edge-136", "from_node": "osm-4642036764", "to_node": "osm-4642036765", "distance_m": 55.9, "slope_pct": -16.1, "is_step_free": true, "bidirectional": true, "accessible": true}, {"id": "edge-137", "from_node": "osm-4642036765", "to_node": "osm-4642036766", "distance_m": 63.2, "slope_pct": 34.8, "is_step_free": true, "bidirectional": true, "accessible": true}, {"id": "edge-138", "from_node": "osm-4642036766", "to_node": "osm-4642036767", "distance_m": 13.2, "slope_pct": 0.0, "is_step_free": true, "bidirectional": true, "accessible": true}, {"id": "edge-139", "from_node": "osm-4642036767", "to_node": "osm-4642036776", "distance_m": 6.0, "slope_pct": 0.0, "is_step_free": true, "bidirectional": true, "accessible": true}, {"id": "edge-140", "from_node": "osm-4642036776", "to_node": "osm-4642036768", "distance_m": 29.7, "slope_pct": -35.0, "is_step_free": true, "bidirectional": true, "accessible": true}, {"id": "edge-141", "from_node": "osm-4642036768", "to_node": "osm-4642036777", "distance_m": 14.5, "slope_pct": 0.0, "is_step_free": true, "bidirectional": true, "accessible": true}, {"id": "edge-142", "from_node": "osm-4642036777", "to_node": "osm-4642036769", "distance_m": 10.4, "slope_pct": 0.0, "is_step_free": true, "bidirectional": true, "accessible": true}, {"id": "edge-143", "from_node": "osm-4642036769", "to_node": "osm-4642036780", "distance_m": 9.3, "slope_pct": 0.0, "is_step_free": true, "bidirectional": true, "accessible": true}, {"id": "edge-144", "from_node": "osm-4642036780", "to_node": "osm-4642036770", "distance_m": 14.3, "slope_pct": 35.0, "is_step_free": true, "bidirectional": true, "accessible": true}, {"id": "edge-145", "from_node": "osm-4642036770", "to_node": "osm-4642036771", "distance_m": 8.9, "slope_pct": -35.0, "is_step_free": true, "bidirectional": true, "accessible": true}, {"id": "edge-146", "from_node": "osm-4642036771", "to_node": "osm-4642036772", "distance_m": 14.3, "slope_pct": 35.0, "is_step_free": true, "bidirectional": true, "accessible": true}, {"id": "edge-147", "from_node": "osm-4642036768", "to_node": "osm-4642036773", "distance_m": 12.1, "slope_pct": 35.0, "is_step_free": true, "bidirectional": true, "accessible": true}, {"id": "edge-148", "from_node": "osm-4642036773", "to_node": "osm-4642036774", "distance_m": 16.8, "slope_pct": 0.0, "is_step_free": true, "bidirectional": true, "accessible": true}, {"id": "edge-149", "from_node": "osm-4642036774", "to_node": "osm-4642036775", "distance_m": 4.1, "slope_pct": 0.0, "is_step_free": true, "bidirectional": true, "accessible": true}, {"id": "edge-150", "from_node": "osm-4642036775", "to_node": "osm-4642036776", "distance_m": 16.2, "slope_pct": -35.0, "is_step_free": true, "bidirectional": true, "accessible": true}, {"id": "edge-151", "from_node": "osm-4642036777", "to_node": "osm-4642036778", "distance_m": 26.0, "slope_pct": 35.0, "is_step_free": true, "bidirectional": true, "accessible": true}, {"id": "edge-152", "from_node": "osm-4642036778", "to_node": "osm-4642036779", "distance_m": 19.8, "slope_pct": 0.0, "is_step_free": true, "bidirectional": true, "accessible": true}, {"id": "edge-153", "from_node": "osm-4642036779", "to_node": "osm-4642036777", "distance_m": 17.8, "slope_pct": -35.0, "is_step_free": true, "bidirectional": true, "accessible": true}, {"id": "edge-154", "from_node": "osm-4642036779", "to_node": "osm-4642036780", "distance_m": 8.2, "slope_pct": -35.0, "is_step_free": true, "bidirectional": true, "accessible": true}, {"id": "edge-155", "from_node": "osm-4642036779", "to_node": "osm-4642036781", "distance_m": 15.2, "slope_pct": 0.0, "is_step_free": true, "bidirectional": true, "accessible": true}, {"id": "edge-156", "from_node": "osm-4642036787", "to_node": "osm-4642036788", "distance_m": 74.2, "slope_pct": 27.0, "is_step_free": true, "bidirectional": true, "accessible": true}, {"id": "edge-157", "from_node": "osm-6953410685", "to_node": "osm-6953410686", "distance_m": 83.3, "slope_pct": -4.8, "is_step_free": true, "bidirectional": true, "accessible": true}, {"id": "edge-158", "from_node": "osm-6953410686", "to_node": "osm-4642036735", "distance_m": 7.7, "slope_pct": 0.0, "is_step_free": true, "bidirectional": true, "accessible": true}, {"id": "edge-159", "from_node": "osm-6968170522", "to_node": "osm-6968170523", "distance_m": 17.2, "slope_pct": 0.0, "is_step_free": false, "bidirectional": true, "accessible": true}, {"id": "edge-160", "from_node": "osm-6968170524", "to_node": "osm-6968170525", "distance_m": 13.2, "slope_pct": 0.0, "is_step_free": false, "bidirectional": true, "accessible": true}, {"id": "edge-161", "from_node": "osm-6968170563", "to_node": "osm-6968170564", "distance_m": 11.3, "slope_pct": 0.0, "is_step_free": false, "bidirectional": true, "accessible": true}, {"id": "edge-162", "from_node": "osm-6968170565", "to_node": "osm-6968170566", "distance_m": 10.6, "slope_pct": 0.0, "is_step_free": false, "bidirectional": true, "accessible": true}, {"id": "edge-163", "from_node": "osm-6974524313", "to_node": "osm-7351322764", "distance_m": 4.5, "slope_pct": 0.0, "is_step_free": true, "bidirectional": true, "accessible": true}, {"id": "edge-164", "from_node": "osm-7351322764", "to_node": "osm-6974524314", "distance_m": 5.7, "slope_pct": 0.0, "is_step_free": true, "bidirectional": true, "accessible": true}, {"id": "edge-165", "from_node": "osm-4632371519", "to_node": "osm-436806147", "distance_m": 44.3, "slope_pct": -31.6, "is_step_free": true, "bidirectional": true, "accessible": true}, {"id": "edge-166", "from_node": "osm-4632371512", "to_node": "osm-4710085535", "distance_m": 18.3, "slope_pct": 0.0, "is_step_free": true, "bidirectional": true, "accessible": true}, {"id": "edge-167", "from_node": "osm-4710085535", "to_node": "osm-4642036720", "distance_m": 21.1, "slope_pct": 0.0, "is_step_free": true, "bidirectional": true, "accessible": true}, {"id": "edge-168", "from_node": "osm-4642036720", "to_node": "osm-4710085534", "distance_m": 49.6, "slope_pct": 26.2, "is_step_free": true, "bidirectional": true, "accessible": true}, {"id": "edge-169", "from_node": "osm-4710085534", "to_node": "osm-4632371513", "distance_m": 25.1, "slope_pct": 0.0, "is_step_free": true, "bidirectional": true, "accessible": true}, {"id": "edge-170", "from_node": "osm-11285265578", "to_node": "osm-11285265579", "distance_m": 10.9, "slope_pct": 0.0, "is_step_free": true, "bidirectional": true, "accessible": true}, {"id": "edge-171", "from_node": "osm-11285265579", "to_node": "osm-11285265580", "distance_m": 13.0, "slope_pct": 0.0, "is_step_free": true, "bidirectional": true, "accessible": true}, {"id": "edge-172", "from_node": "osm-11285287779", "to_node": "osm-11285287778", "distance_m": 21.5, "slope_pct": 0.0, "is_step_free": true, "bidirectional": true, "accessible": true}, {"id": "edge-173", "from_node": "osm-11285287778", "to_node": "osm-11285287777", "distance_m": 29.6, "slope_pct": 0.0, "is_step_free": true, "bidirectional": true, "accessible": true}, {"id": "edge-174", "from_node": "osm-11285287777", "to_node": "osm-11285287776", "distance_m": 24.2, "slope_pct": -35.0, "is_step_free": true, "bidirectional": true, "accessible": true}, {"id": "edge-175", "from_node": "osm-11285287776", "to_node": "osm-11285287775", "distance_m": 36.6, "slope_pct": -35.0, "is_step_free": true, "bidirectional": true, "accessible": true}, {"id": "edge-176", "from_node": "osm-11285287775", "to_node": "osm-11285287774", "distance_m": 17.1, "slope_pct": 0.0, "is_step_free": true, "bidirectional": true, "accessible": true}, {"id": "edge-177", "from_node": "osm-11285287774", "to_node": "osm-11285287773", "distance_m": 19.9, "slope_pct": 0.0, "is_step_free": true, "bidirectional": true, "accessible": true}, {"id": "edge-178", "from_node": "osm-11285287773", "to_node": "osm-11285287772", "distance_m": 17.3, "slope_pct": 0.0, "is_step_free": true, "bidirectional": true, "accessible": true}, {"id": "edge-179", "from_node": "osm-11285287772", "to_node": "osm-11285287771", "distance_m": 8.6, "slope_pct": 0.0, "is_step_free": true, "bidirectional": true, "accessible": true}, {"id": "edge-180", "from_node": "osm-11285287771", "to_node": "osm-11285287770", "distance_m": 11.9, "slope_pct": 0.0, "is_step_free": true, "bidirectional": true, "accessible": true}, {"id": "edge-181", "from_node": "osm-11285287770", "to_node": "osm-11285287769", "distance_m": 9.8, "slope_pct": 0.0, "is_step_free": true, "bidirectional": true, "accessible": true}, {"id": "edge-182", "from_node": "osm-11285287807", "to_node": "osm-11285287806", "distance_m": 13.3, "slope_pct": 0.0, "is_step_free": true, "bidirectional": true, "accessible": true}, {"id": "edge-183", "from_node": "osm-11285287806", "to_node": "osm-11285287805", "distance_m": 9.7, "slope_pct": 0.0, "is_step_free": true, "bidirectional": true, "accessible": true}, {"id": "edge-184", "from_node": "osm-11285287805", "to_node": "osm-11285287804", "distance_m": 5.6, "slope_pct": 0.0, "is_step_free": true, "bidirectional": true, "accessible": true}, {"id": "edge-185", "from_node": "osm-11285287804", "to_node": "osm-11285287803", "distance_m": 6.2, "slope_pct": 0.0, "is_step_free": true, "bidirectional": true, "accessible": true}, {"id": "edge-186", "from_node": "osm-11285287803", "to_node": "osm-11285287802", "distance_m": 9.7, "slope_pct": 0.0, "is_step_free": true, "bidirectional": true, "accessible": true}, {"id": "edge-187", "from_node": "osm-11285287802", "to_node": "osm-11285287801", "distance_m": 7.7, "slope_pct": 0.0, "is_step_free": true, "bidirectional": true, "accessible": true}, {"id": "edge-188", "from_node": "osm-11285287801", "to_node": "osm-11285287800", "distance_m": 9.0, "slope_pct": 0.0, "is_step_free": true, "bidirectional": true, "accessible": true}, {"id": "edge-189", "from_node": "osm-11285287800", "to_node": "osm-11285287799", "distance_m": 7.5, "slope_pct": 0.0, "is_step_free": true, "bidirectional": true, "accessible": true}, {"id": "edge-190", "from_node": "osm-11285287799", "to_node": "osm-11285287798", "distance_m": 3.7, "slope_pct": 0.0, "is_step_free": true, "bidirectional": true, "accessible": true}, {"id": "edge-191", "from_node": "osm-11285287798", "to_node": "osm-11285287797", "distance_m": 9.9, "slope_pct": 0.0, "is_step_free": true, "bidirectional": true, "accessible": true}, {"id": "edge-192", "from_node": "osm-11285287797", "to_node": "osm-11285287796", "distance_m": 5.0, "slope_pct": 0.0, "is_step_free": true, "bidirectional": true, "accessible": true}, {"id": "edge-193", "from_node": "osm-11285287796", "to_node": "osm-11285287795", "distance_m": 7.3, "slope_pct": 0.0, "is_step_free": true, "bidirectional": true, "accessible": true}, {"id": "edge-194", "from_node": "osm-11285287795", "to_node": "osm-11285287794", "distance_m": 4.2, "slope_pct": 0.0, "is_step_free": true, "bidirectional": true, "accessible": true}, {"id": "edge-195", "from_node": "osm-11285287794", "to_node": "osm-11285287793", "distance_m": 4.7, "slope_pct": 0.0, "is_step_free": true, "bidirectional": true, "accessible": true}, {"id": "edge-196", "from_node": "osm-11285287793", "to_node": "osm-11285287792", "distance_m": 17.3, "slope_pct": 0.0, "is_step_free": true, "bidirectional": true, "accessible": true}, {"id": "edge-197", "from_node": "osm-11285287792", "to_node": "osm-11285287791", "distance_m": 4.7, "slope_pct": 0.0, "is_step_free": true, "bidirectional": true, "accessible": true}, {"id": "edge-198", "from_node": "osm-11285287791", "to_node": "osm-11285287790", "distance_m": 12.9, "slope_pct": 0.0, "is_step_free": true, "bidirectional": true, "accessible": true}, {"id": "edge-199", "from_node": "osm-11285287790", "to_node": "osm-11285287789", "distance_m": 11.7, "slope_pct": 0.0, "is_step_free": true, "bidirectional": true, "accessible": true}, {"id": "edge-200", "from_node": "osm-11285287789", "to_node": "osm-11285287788", "distance_m": 6.5, "slope_pct": 0.0, "is_step_free": true, "bidirectional": true, "accessible": true}, {"id": "edge-201", "from_node": "osm-11285287788", "to_node": "osm-11285287787", "distance_m": 20.7, "slope_pct": -35.0, "is_step_free": true, "bidirectional": true, "accessible": true}, {"id": "edge-202", "from_node": "osm-11285287787", "to_node": "osm-11285287786", "distance_m": 7.2, "slope_pct": 0.0, "is_step_free": true, "bidirectional": true, "accessible": true}, {"id": "edge-203", "from_node": "osm-11285287786", "to_node": "osm-11285287785", "distance_m": 4.1, "slope_pct": 0.0, "is_step_free": true, "bidirectional": true, "accessible": true}, {"id": "edge-204", "from_node": "osm-11285287785", "to_node": "osm-11285287784", "distance_m": 7.9, "slope_pct": 0.0, "is_step_free": true, "bidirectional": true, "accessible": true}, {"id": "edge-205", "from_node": "osm-11285287784", "to_node": "osm-11285287783", "distance_m": 10.3, "slope_pct": 0.0, "is_step_free": true, "bidirectional": true, "accessible": true}, {"id": "edge-206", "from_node": "osm-11285287783", "to_node": "osm-11285287782", "distance_m": 6.3, "slope_pct": 0.0, "is_step_free": true, "bidirectional": true, "accessible": true}, {"id": "edge-207", "from_node": "osm-11285287782", "to_node": "osm-11285287781", "distance_m": 4.1, "slope_pct": 0.0, "is_step_free": true, "bidirectional": true, "accessible": true}, {"id": "edge-208", "from_node": "osm-4642036740", "to_node": "osm-4642036788", "distance_m": 9.2, "slope_pct": 0.0, "is_step_free": true, "bidirectional": true, "accessible": true}, {"id": "edge-209", "from_node": "osm-4632371513", "to_node": "osm-4642036731", "distance_m": 9.6, "slope_pct": 0.0, "is_step_free": true, "bidirectional": true, "accessible": true}, {"id": "edge-210", "from_node": "osm-4642036730", "to_node": "osm-4642036762", "distance_m": 16.5, "slope_pct": 0.0, "is_step_free": true, "bidirectional": true, "accessible": true}, {"id": "edge-211", "from_node": "osm-4642036771", "to_node": "osm-6968170563", "distance_m": 4.1, "slope_pct": 0.0, "is_step_free": true, "bidirectional": true, "accessible": true}, {"id": "edge-213", "from_node": "osm-6968170564", "to_node": "osm-6968170565", "distance_m": 7.6, "slope_pct": -35.0, "is_step_free": true, "bidirectional": true, "accessible": true}, {"id": "edge-215", "from_node": "osm-4642036787", "to_node": "osm-6968170524", "distance_m": 25.8, "slope_pct": 35.0, "is_step_free": true, "bidirectional": true, "accessible": true}, {"id": "edge-216", "from_node": "osm-6968170524", "to_node": "osm-6968170522", "distance_m": 10.1, "slope_pct": -35.0, "is_step_free": true, "bidirectional": true, "accessible": true}, {"id": "edge-219", "from_node": "osm-4642036743", "to_node": "osm-4642036745", "distance_m": 67.9, "slope_pct": -1.5, "is_step_free": true, "bidirectional": true, "accessible": true}, {"id": "edge-220", "from_node": "osm-4642032068", "to_node": "osm-11285265580", "distance_m": 81.1, "slope_pct": 16.0, "is_step_free": true, "bidirectional": true, "accessible": true}, {"id": "edge-221", "from_node": "bldg-1", "to_node": "osm-4642036764", "distance_m": 27.7, "slope_pct": 0.0, "is_step_free": true, "bidirectional": true, "accessible": true}, {"id": "edge-222", "from_node": "bldg-1", "to_node": "osm-4642036768", "distance_m": 28.4, "slope_pct": 0.0, "is_step_free": true, "bidirectional": true, "accessible": true}, {"id": "edge-223", "from_node": "bldg-2", "to_node": "osm-4642036732", "distance_m": 21.2, "slope_pct": 0.0, "is_step_free": true, "bidirectional": true, "accessible": true}, {"id": "edge-224", "from_node": "bldg-2", "to_node": "osm-4642036765", "distance_m": 31.7, "slope_pct": 0.0, "is_step_free": true, "bidirectional": true, "accessible": true}, {"id": "edge-225", "from_node": "bldg-3", "to_node": "osm-4642036775", "distance_m": 12.5, "slope_pct": 0.0, "is_step_free": true, "bidirectional": true, "accessible": true}, {"id": "edge-226", "from_node": "bldg-3", "to_node": "osm-4642036774", "distance_m": 13.3, "slope_pct": 0.0, "is_step_free": true, "bidirectional": true, "accessible": true}, {"id": "edge-227", "from_node": "bldg-4", "to_node": "osm-4710085534", "distance_m": 37.7, "slope_pct": 34.5, "is_step_free": true, "bidirectional": true, "accessible": true}, {"id": "edge-228", "from_node": "bldg-4", "to_node": "osm-4632371514", "distance_m": 39.5, "slope_pct": 35.0, "is_step_free": true, "bidirectional": true, "accessible": true}, {"id": "edge-229", "from_node": "bldg-5", "to_node": "osm-4642036707", "distance_m": 30.6, "slope_pct": 0.0, "is_step_free": true, "bidirectional": true, "accessible": true}, {"id": "edge-230", "from_node": "bldg-5", "to_node": "osm-6968170566", "distance_m": 34.7, "slope_pct": -25.9, "is_step_free": true, "bidirectional": true, "accessible": true}, {"id": "edge-231", "from_node": "bldg-6", "to_node": "osm-4642036710", "distance_m": 20.3, "slope_pct": 0.0, "is_step_free": true, "bidirectional": true, "accessible": true}, {"id": "edge-232", "from_node": "bldg-6", "to_node": "osm-4642036711", "distance_m": 24.2, "slope_pct": 0.0, "is_step_free": true, "bidirectional": true, "accessible": true}, {"id": "edge-233", "from_node": "bldg-7", "to_node": "osm-4642032081", "distance_m": 29.7, "slope_pct": 0.0, "is_step_free": true, "bidirectional": true, "accessible": true}, {"id": "edge-234", "from_node": "bldg-7", "to_node": "osm-4642032082", "distance_m": 31.0, "slope_pct": 16.1, "is_step_free": true, "bidirectional": true, "accessible": true}, {"id": "edge-235", "from_node": "bldg-8", "to_node": "osm-4642032078", "distance_m": 21.1, "slope_pct": 0.0, "is_step_free": true, "bidirectional": true, "accessible": true}, {"id": "edge-236", "from_node": "bldg-8", "to_node": "osm-4642032074", "distance_m": 28.0, "slope_pct": 0.0, "is_step_free": true, "bidirectional": true, "accessible": true}, {"id": "edge-237", "from_node": "bldg-9", "to_node": "osm-4642032044", "distance_m": 31.0, "slope_pct": 3.2, "is_step_free": true, "bidirectional": true, "accessible": true}, {"id": "edge-238", "from_node": "bldg-9", "to_node": "osm-4642032045", "distance_m": 39.6, "slope_pct": 2.5, "is_step_free": true, "bidirectional": true, "accessible": true}, {"id": "edge-239", "from_node": "bldg-10", "to_node": "osm-4642036730", "distance_m": 53.1, "slope_pct": -15.1, "is_step_free": true, "bidirectional": true, "accessible": true}, {"id": "edge-240", "from_node": "bldg-10", "to_node": "osm-4632371515", "distance_m": 54.0, "slope_pct": -35.0, "is_step_free": true, "bidirectional": true, "accessible": true}, {"id": "edge-241", "from_node": "bldg-11", "to_node": "osm-4710085536", "distance_m": 28.8, "slope_pct": 0.0, "is_step_free": true, "bidirectional": true, "accessible": true}, {"id": "edge-242", "from_node": "bldg-11", "to_node": "osm-4710085531", "distance_m": 32.2, "slope_pct": -35.0, "is_step_free": true, "bidirectional": true, "accessible": true}, {"id": "edge-243", "from_node": "bldg-12", "to_node": "osm-4642036740", "distance_m": 52.6, "slope_pct": 0.0, "is_step_free": true, "bidirectional": true, "accessible": true}, {"id": "edge-244", "from_node": "bldg-12", "to_node": "osm-4642036788", "distance_m": 60.3, "slope_pct": 0.0, "is_step_free": true, "bidirectional": true, "accessible": true}, {"id": "edge-245", "from_node": "bldg-13", "to_node": "osm-4642036717", "distance_m": 48.3, "slope_pct": -6.2, "is_step_free": true, "bidirectional": true, "accessible": true}, {"id": "edge-246", "from_node": "bldg-13", "to_node": "osm-4642036788", "distance_m": 49.5, "slope_pct": 0.0, "is_step_free": true, "bidirectional": true, "accessible": true}, {"id": "edge-247", "from_node": "bldg-14", "to_node": "osm-4642036735", "distance_m": 31.2, "slope_pct": 35.0, "is_step_free": true, "bidirectional": true, "accessible": true}, {"id": "edge-248", "from_node": "bldg-14", "to_node": "osm-4642036720", "distance_m": 33.9, "slope_pct": 35.0, "is_step_free": true, "bidirectional": true, "accessible": true}, {"id": "edge-249", "from_node": "bldg-15", "to_node": "osm-4642036696", "distance_m": 19.8, "slope_pct": 0.0, "is_step_free": true, "bidirectional": true, "accessible": true}, {"id": "edge-250", "from_node": "bldg-15", "to_node": "osm-4642032063", "distance_m": 35.4, "slope_pct": -35.0, "is_step_free": true, "bidirectional": true, "accessible": true}, {"id": "edge-251", "from_node": "bldg-16", "to_node": "osm-4632371515", "distance_m": 29.6, "slope_pct": 0.0, "is_step_free": true, "bidirectional": true, "accessible": true}, {"id": "edge-252", "from_node": "bldg-16", "to_node": "osm-4642036719", "distance_m": 36.5, "slope_pct": 0.0, "is_step_free": true, "bidirectional": true, "accessible": true}, {"id": "edge-253", "from_node": "bldg-17", "to_node": "osm-7247047825", "distance_m": 42.3, "slope_pct": 0.0, "is_step_free": true, "bidirectional": true, "accessible": true}, {"id": "edge-254", "from_node": "bldg-17", "to_node": "osm-4710085534", "distance_m": 50.7, "slope_pct": 25.6, "is_step_free": true, "bidirectional": true, "accessible": true}, {"id": "edge-255", "from_node": "bldg-18", "to_node": "osm-4642032056", "distance_m": 19.5, "slope_pct": -35.0, "is_step_free": true, "bidirectional": true, "accessible": true}, {"id": "edge-256", "from_node": "bldg-18", "to_node": "osm-4642032055", "distance_m": 24.4, "slope_pct": 0.0, "is_step_free": true, "bidirectional": true, "accessible": true}, {"id": "edge-257", "from_node": "bldg-19", "to_node": "osm-4642032052", "distance_m": 38.5, "slope_pct": 0.0, "is_step_free": true, "bidirectional": true, "accessible": true}, {"id": "edge-258", "from_node": "bldg-19", "to_node": "osm-4642032051", "distance_m": 41.5, "slope_pct": 0.0, "is_step_free": true, "bidirectional": true, "accessible": true}, {"id": "edge-259", "from_node": "bldg-20", "to_node": "osm-4642032060", "distance_m": 32.0, "slope_pct": 0.0, "is_step_free": true, "bidirectional": true, "accessible": true}, {"id": "edge-260", "from_node": "bldg-20", "to_node": "osm-4642032059", "distance_m": 34.1, "slope_pct": 0.0, "is_step_free": true, "bidirectional": true, "accessible": true}, {"id": "edge-261", "from_node": "bldg-21", "to_node": "osm-4642032053", "distance_m": 37.1, "slope_pct": 0.0, "is_step_free": true, "bidirectional": true, "accessible": true}, {"id": "edge-262", "from_node": "bldg-21", "to_node": "osm-4642032054", "distance_m": 46.1, "slope_pct": 0.0, "is_step_free": true, "bidirectional": true, "accessible": true}, {"id": "edge-263", "from_node": "bldg-22", "to_node": "osm-4632371515", "distance_m": 22.4, "slope_pct": 0.0, "is_step_free": true, "bidirectional": true, "accessible": true}, {"id": "edge-264", "from_node": "bldg-22", "to_node": "osm-4632371528", "distance_m": 30.7, "slope_pct": 22.8, "is_step_free": true, "bidirectional": true, "accessible": true}, {"id": "edge-extra-23-1", "from_node": "bldg-23", "to_node": "osm-4642032086", "distance_m": 1.5, "slope_pct": -35.0, "is_step_free": true, "bidirectional": true, "accessible": true}, {"id": "edge-extra-23-2", "from_node": "bldg-23", "to_node": "osm-4642032085", "distance_m": 8.5, "slope_pct": -35.0, "is_step_free": true, "bidirectional": true, "accessible": true}, {"id": "edge-extra-24-1", "from_node": "bldg-24", "to_node": "osm-4642036691", "distance_m": 12.0, "slope_pct": -35.0, "is_step_free": true, "bidirectional": true, "accessible": true}, {"id": "edge-extra-24-2", "from_node": "bldg-24", "to_node": "osm-4642036692", "distance_m": 22.8, "slope_pct": -26.3, "is_step_free": true, "bidirectional": true, "accessible": true}, {"id": "edge-extra-25-1", "from_node": "bldg-25", "to_node": "osm-4642032068", "distance_m": 16.2, "slope_pct": 35.0, "is_step_free": true, "bidirectional": true, "accessible": true}, {"id": "edge-extra-25-2", "from_node": "bldg-25", "to_node": "osm-4642032067", "distance_m": 19.8, "slope_pct": 35.0, "is_step_free": true, "bidirectional": true, "accessible": true}, {"id": "edge-extra-26-1", "from_node": "bldg-26", "to_node": "osm-4642032069", "distance_m": 25.8, "slope_pct": 35.0, "is_step_free": true, "bidirectional": true, "accessible": true}, {"id": "edge-extra-26-2", "from_node": "bldg-26", "to_node": "osm-4642032064", "distance_m": 26.8, "slope_pct": 35.0, "is_step_free": true, "bidirectional": true, "accessible": true}, {"id": "edge-extra-27-1", "from_node": "bldg-27", "to_node": "osm-4632371524", "distance_m": 52.0, "slope_pct": 5.8, "is_step_free": true, "bidirectional": true, "accessible": true}, {"id": "edge-extra-27-2", "from_node": "bldg-27", "to_node": "osm-6974524314", "distance_m": 52.7, "slope_pct": 3.8, "is_step_free": true, "bidirectional": true, "accessible": true}, {"id": "edge-extra-28-1", "from_node": "bldg-28", "to_node": "osm-4642032053", "distance_m": 51.1, "slope_pct": 13.7, "is_step_free": true, "bidirectional": true, "accessible": true}, {"id": "edge-extra-28-2", "from_node": "bldg-28", "to_node": "osm-4642032054", "distance_m": 51.2, "slope_pct": 13.7, "is_step_free": true, "bidirectional": true, "accessible": true}, {"id": "edge-extra-29-1", "from_node": "bldg-29", "to_node": "osm-1762118482", "distance_m": 20.6, "slope_pct": -35.0, "is_step_free": true, "bidirectional": true, "accessible": true}, {"id": "edge-extra-29-2", "from_node": "bldg-29", "to_node": "osm-4642036710", "distance_m": 33.0, "slope_pct": -35.0, "is_step_free": true, "bidirectional": true, "accessible": true}, {"id": "edge-extra-30-1", "from_node": "bldg-30", "to_node": "osm-4642032053", "distance_m": 69.0, "slope_pct": 1.4, "is_step_free": true, "bidirectional": true, "accessible": true}, {"id": "edge-extra-30-2", "from_node": "bldg-30", "to_node": "osm-4642032054", "distance_m": 76.9, "slope_pct": 1.3, "is_step_free": true, "bidirectional": true, "accessible": true}]
