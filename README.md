# 동서대학교 캠퍼스 가이드

모바일 우선 캠퍼스 안내 MVP입니다. React, TypeScript, Vite, Leaflet/OpenStreetMap 프런트엔드와 FastAPI/MongoDB API를 포함합니다. Google Maps API나 Google API 키는 사용하지 않습니다.

## 실행

필요 환경: Node.js 18 이상, Python 3.10 이상. MongoDB가 없으면 API는 제공된 17개 건물 좌표를 메모리에서 읽어 화면과 검색을 제공하며, 관리자 수정 내용은 프로세스 종료 시 사라집니다.

```powershell
# API
cd server
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
Copy-Item .env.example .env
# .env에서 ADMIN_API_TOKEN을 임의의 긴 값으로 바꾸고, MongoDB를 쓰려면 MONGODB_URI를 설정
python -m uvicorn app.main:app --reload

# 다른 터미널, 프로젝트 루트
npm install
npm run dev
```

## Android APK

Android APK를 만들려면 Android Studio와 Android SDK(API 24 이상), Node.js 22 이상이 필요합니다. Android Studio를 설치한 뒤 SDK Manager에서 Android SDK와 필요한 빌드 도구를 설치하고, 프로젝트 루트에서 실행합니다.

```powershell
npm install
npm run android:apk
```

완료되면 프로젝트 루트의 `dongseo-campus-map-debug.apk`를 Android 기기에 설치할 수 있습니다. 원본 빌드 파일은 `android/app/build/outputs/apk/debug/app-debug.apk`에도 남습니다. 이 디버그 APK는 테스트·직접 설치용이며 Play 스토어 배포에는 별도 서명된 릴리스 빌드가 필요합니다.

APK에서 건물 검색·관리자 API를 사용하려면 `VITE_API_BASE_URL`을 휴대폰에서 접근 가능한 HTTPS API 주소로 지정해 빌드해야 합니다. Vite 개발 서버의 `127.0.0.1:8000` 프록시는 APK에 포함되지 않습니다. 위치 버튼은 Android의 위치 권한을 요청하며, 기기의 위치 서비스와 권한 설정에 따라 동작합니다.

개발 API 문서는 `http://127.0.0.1:8000/docs`에 있습니다. 관리자 API는 `Authorization: Bearer <ADMIN_API_TOKEN>` 헤더가 필요합니다. `OLLAMA_URL`과 `OLLAMA_MODEL`을 설정하면 자연어 검색에 로컬 Ollama를 사용하고, 모델 응답은 등록된 건물 ID와 대조합니다. Ollama가 꺼져 있거나 제한 시간 내 응답하지 않으면 등록 별칭 검색으로 전환합니다.

## 현재 데이터 상태

- 요청에 포함된 17개 위·경도 좌표를 `[경도, 위도]` GeoJSON 점으로 시드합니다.
- 영상 URL, 층별 시설, 별칭 번역, 고도, 보행로 그래프 데이터는 원본 요청에 없어서 비워 둡니다. 지도 상세 화면은 이를 자료 미등록으로 표시합니다.
- 경로 탐색은 관리자가 실제 `path_nodes`와 `path_edges`를 등록한 연결 구간만 사용합니다. 연결된 보행 경로가 없으면 API와 화면 모두 경로를 안내하지 않습니다.
- 현재 위치는 길찾기 요청 때만 전송합니다. 등록된 보행로 노드에서 5m 이내로 확인되지 않는 위치는 경로 시작점으로 사용하지 않으며, 건물을 출발지로 수동 선택할 수 있습니다.
- 경로 노드 고도는 관리자 API `/api/admin/elevations/lookup`으로 Open-Elevation에서 조회할 수 있습니다. 조회 실패 시 노드·간선 경사 정보는 업데이트하지 않습니다.
- 지도 타일은 OpenStreetMap을 사용하며 지도에 저작자 표시를 유지합니다.
- 건물 사진은 동서대학교 공식 캠퍼스맵의 1~31번 이미지에 연결합니다. 사진은 학교 서버에서 직접 불러오고, 상세 카드에 원본 출처 링크를 표시합니다. 사진 로딩에는 인터넷 연결이 필요합니다.

## 주요 API

| API | 용도 |
| --- | --- |
| `GET /api/buildings` | 등록 건물 및 위치 조회 |
| `POST /api/search` | 별칭 검색, 선택적 Ollama 의도/장소 추출 |
| `POST /api/routes` | 등록된 연결 보행 그래프에서 다익스트라 경로 탐색 |
| `PUT /api/admin/buildings/{id}` | 건물·다국어 이름·별칭·영상·층 정보 등록/수정 |
| `PUT /api/admin/facilities/{id}` | 시설 정보 등록/수정 |
| `PUT /api/admin/path-nodes/{id}` | 갈림길 또는 건물 출입구 노드 등록/수정 |
| `PUT /api/admin/path-edges/{id}` | 검증된 보행 구간·경사·계단 속성 등록/수정 |
| `POST /api/admin/elevations/lookup` | Open-Elevation 조회 및 연결 간선 경사 재계산 |
| `DELETE /api/admin/.../{id}` | 관리자 데이터 삭제 |

삭제 API는 MongoDB 미연결 상태에서는 메모리 저장소에만 적용됩니다. 관리자 작업은 실제 확인된 자료를 입력해야 하며, 기본 시드에는 임의 영상·층별 시설·보행 경로가 없습니다.
