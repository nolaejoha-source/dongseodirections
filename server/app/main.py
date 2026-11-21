from __future__ import annotations

import heapq
import json
import logging
import math
import os
import re
from pathlib import Path
from typing import Any, Literal
from urllib.parse import urlparse

from dotenv import load_dotenv
from fastapi import Depends, FastAPI, Header, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import httpx
from pydantic import BaseModel, Field, HttpUrl, field_validator, model_validator
from pymongo import ASCENDING, GEOSPHERE, MongoClient
from pymongo.collection import Collection
from pymongo.errors import PyMongoError

load_dotenv(Path(__file__).resolve().parents[1] / ".env")
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("dsu-campus-api")
DATA_DIR = Path(__file__).resolve().parents[1] / "data"
DATA_FILE = DATA_DIR / "buildings.json"
NODES_FILE = DATA_DIR / "path_nodes.json"
EDGES_FILE = DATA_DIR / "path_edges.json"

LANGUAGE_REPLIES = {
    "ko": {"not_found": "등록된 건물에서 찾지 못했습니다. 건물 이름을 확인해 주세요.", "outside": "이 서비스는 동서대학교 캠퍼스 내 등록 장소만 안내합니다.", "matched": "검색한 건물의 위치입니다."},
    "en": {"not_found": "No registered building matched. Please check the building name.", "outside": "This guide covers registered places on the Dongseo University campus only.", "matched": "Here is the registered building location."},
    "zh": {"not_found": "找不到已登錄的建築，請確認建築名稱。", "outside": "此服務僅提供東西大學校園內已登錄地點。", "matched": "以下是已登錄建築的位置。"},
    "vi": {"not_found": "Không tìm thấy tòa nhà đã đăng ký. Vui lòng kiểm tra tên.", "outside": "Dịch vụ chỉ hướng dẫn các địa điểm đã đăng ký trong khuôn viên Đại học Dongseo.", "matched": "Đây là vị trí tòa nhà đã đăng ký."},
    "lt": {"not_found": "Registruotas pastatas nerastas. Patikrinkite jo pavadinimą.", "outside": "Šis gidas apima tik registruotas Dongseo universiteto vietas.", "matched": "Štai registruoto pastato vieta."},
    "hi": {"not_found": "सूचीबद्ध इमारत नहीं मिली। कृपया नाम जाँचें।", "outside": "यह गाइड केवल डोंगसियो विश्वविद्यालय परिसर के सूचीबद्ध स्थान दिखाता है।", "matched": "यहाँ सूचीबद्ध इमारत का स्थान है।"},
}
OUTSIDE_TERMS = ("부산역", "김해공항", "해운대", "서울역", "공항", "busan station", "gimhae airport", "haeundae", "seoul station", "airport", "outside campus", "off campus", "校外", "机场", "海雲台", "sân bay", "ngoài khuôn viên", "oro uostas", "ne universitete", "हवाई अड्डा", "कैंपस के बाहर")
FOLLOWUP_TERMS = ("거기", "거기까지", "거기로", "那裡", "那里", "那边", "đó")


class PointGeometry(BaseModel):
    type: Literal["Point"] = "Point"
    coordinates: tuple[float, float]

    @field_validator("coordinates")
    @classmethod
    def valid_geojson_order(cls, value: tuple[float, float]) -> tuple[float, float]:
        longitude, latitude = value
        if not (-180 <= longitude <= 180 and -90 <= latitude <= 90):
            raise ValueError("Coordinates must be GeoJSON [longitude, latitude].")
        return value


class FloorRoom(BaseModel):
    name: str
    name_en: str | None = None
    name_zh: str | None = None
    name_vi: str | None = None
    name_lt: str | None = None
    name_hi: str | None = None
    category: str | None = None
    note: str | None = None


class FloorDetail(BaseModel):
    floor: int
    label: str
    facilities: list[FloorRoom] = Field(default_factory=list)


class BuildingInput(BaseModel):
    id: int = Field(ge=1)
    name: str = Field(min_length=1, max_length=120)
    name_en: str | None = None
    name_zh: str | None = None
    name_vi: str | None = None
    name_lt: str | None = None
    name_hi: str | None = None
    aliases: list[str] = Field(default_factory=list)
    location: PointGeometry
    elevation: float | None = None
    video_url: HttpUrl | None = None
    floor_details: list[FloorDetail] = Field(default_factory=list)

    @field_validator("video_url")
    @classmethod
    def youtube_embed_only(cls, value: HttpUrl | None) -> HttpUrl | None:
        if value is None:
            return None
        parsed = urlparse(str(value))
        if parsed.scheme != "https" or parsed.hostname not in {"www.youtube.com", "youtube.com", "www.youtube-nocookie.com"} or not parsed.path.startswith("/embed/"):
            raise ValueError("video_url must be an HTTPS YouTube /embed/ URL.")
        return value


class FacilityInput(BaseModel):
    id: str = Field(min_length=1, max_length=100)
    building_id: int = Field(ge=1)
    name: str = Field(min_length=1, max_length=120)
    name_en: str | None = None
    name_zh: str | None = None
    name_vi: str | None = None
    name_lt: str | None = None
    name_hi: str | None = None
    aliases: list[str] = Field(default_factory=list)
    category: str
    floor: int
    operating_info: str | None = None


class SearchInput(BaseModel):
    query: str = Field(min_length=1, max_length=500)
    context_building_id: int | None = None

    @field_validator("query")
    @classmethod
    def nonblank_query(cls, value: str) -> str:
        value = value.strip()
        if not value:
            raise ValueError("Search query cannot be blank.")
        return value


class RouteInput(BaseModel):
    start_building_id: int | None = Field(default=None, ge=1)
    start_coordinates: PointGeometry | None = None
    end_building_id: int = Field(ge=1)
    step_free: bool = False

    @model_validator(mode="after")
    def exactly_one_origin(self) -> "RouteInput":
        if (self.start_building_id is None) == (self.start_coordinates is None):
            raise ValueError("Provide either start_building_id or start_coordinates.")
        return self


class PathNodeInput(BaseModel):
    id: str = Field(min_length=1, max_length=80)
    building_id: int | None = None
    location: PointGeometry
    elevation: float | None = None


class PathEdgeInput(BaseModel):
    id: str = Field(min_length=1, max_length=100)
    from_node: str
    to_node: str
    distance_m: float = Field(gt=0)
    slope_pct: float | None = Field(default=None, ge=-100, le=100)
    is_step_free: bool
    bidirectional: bool = True
    accessible: bool = True


class ElevationLookupInput(BaseModel):
    node_ids: list[str] = Field(min_length=1, max_length=100)


def seed_buildings() -> list[dict[str, Any]]:
    with DATA_FILE.open(encoding="utf-8") as file:
        return json.load(file)


def seed_nodes() -> list[dict[str, Any]]:
    if not NODES_FILE.exists():
        return []
    with NODES_FILE.open(encoding="utf-8") as file:
        return json.load(file)


def seed_edges() -> list[dict[str, Any]]:
    if not EDGES_FILE.exists():
        return []
    with EDGES_FILE.open(encoding="utf-8") as file:
        return json.load(file)


class Store:
    def __init__(self) -> None:
        self.client: MongoClient | None = None
        self.db: Any = None
        self.memory_buildings = {item["id"]: item for item in seed_buildings()}
        self.memory_facilities: dict[str, dict[str, Any]] = {}
        self.memory_nodes: dict[str, dict[str, Any]] = {item["id"]: item for item in seed_nodes()}
        self.memory_edges: dict[str, dict[str, Any]] = {item["id"]: item for item in seed_edges()}

    def connect(self) -> None:
        uri = os.getenv("MONGODB_URI")
        if not uri:
            logger.info("MONGODB_URI is unset; using seeded in-memory data.")
            return
        try:
            client = MongoClient(uri, serverSelectionTimeoutMS=1800, connectTimeoutMS=1800)
            client.admin.command("ping")
            database = client[os.getenv("MONGODB_DATABASE", "dsu_campus")]
            database.buildings.create_index([("location", GEOSPHERE)])
            database.buildings.create_index([("id", ASCENDING)], unique=True)
            database.buildings.create_index([("aliases", ASCENDING)])
            database.buildings.create_index([(field, "text") for field in ("name", "name_en", "name_zh", "name_vi", "name_lt", "name_hi", "aliases")], name="building_names_text")
            database.path_nodes.create_index([("location", GEOSPHERE)])
            database.path_nodes.create_index([("id", ASCENDING)], unique=True)
            database.path_edges.create_index([("id", ASCENDING)], unique=True)
            database.facilities.create_index([("building_id", ASCENDING)])
            database.facilities.create_index([(field, "text") for field in ("name", "name_en", "name_zh", "name_vi", "name_lt", "name_hi", "aliases")], name="facility_names_text")
            if database.buildings.count_documents({}) == 0:
                database.buildings.insert_many(self.memory_buildings.values())
            if database.path_nodes.count_documents({}) == 0 and self.memory_nodes:
                database.path_nodes.insert_many(self.memory_nodes.values())
            if database.path_edges.count_documents({}) == 0 and self.memory_edges:
                database.path_edges.insert_many(self.memory_edges.values())
            self.client, self.db = client, database
            logger.info("Connected to MongoDB database %s.", database.name)
        except PyMongoError:
            logger.exception("Could not reach MongoDB; using in-memory seeded data.")

    def close(self) -> None:
        if self.client is not None:
            self.client.close()

    @property
    def mongo_enabled(self) -> bool:
        return self.db is not None

    def collection(self, name: str) -> Collection | None:
        return self.db[name] if self.db is not None else None

    def buildings(self) -> list[dict[str, Any]]:
        if self.db is not None:
            return list(self.db.buildings.find({}, {"_id": 0}).sort("id", ASCENDING))
        return sorted(self.memory_buildings.values(), key=lambda item: item["id"])

    def facilities(self) -> list[dict[str, Any]]:
        if self.db is not None:
            return list(self.db.facilities.find({}, {"_id": 0}))
        return list(self.memory_facilities.values())

    def building(self, building_id: int) -> dict[str, Any] | None:
        if self.db is not None:
            return self.db.buildings.find_one({"id": building_id}, {"_id": 0})
        return self.memory_buildings.get(building_id)

    def put(self, collection_name: str, key: str | int, document: dict[str, Any]) -> None:
        if self.db is not None:
            self.db[collection_name].replace_one({"id": key}, document, upsert=True)
            return
        target = getattr(self, f"memory_{collection_name}")
        target[key] = document

    def delete(self, collection_name: str, key: str | int) -> bool:
        if self.db is not None:
            result = self.db[collection_name].delete_one({"id": key})
            return result.deleted_count > 0
        target = getattr(self, f"memory_{collection_name}")
        return target.pop(key, None) is not None

    def nodes(self) -> list[dict[str, Any]]:
        if self.db is not None:
            return list(self.db.path_nodes.find({}, {"_id": 0}))
        return list(self.memory_nodes.values())

    def edges(self) -> list[dict[str, Any]]:
        if self.db is not None:
            return list(self.db.path_edges.find({}, {"_id": 0}))
        return list(self.memory_edges.values())


store = Store()
app = FastAPI(title="Dongseo University Campus Guide API", version="0.2.0")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=False,
    allow_methods=["GET", "POST", "PUT", "PATCH", "DELETE"],
    allow_headers=["Authorization", "Content-Type"],
)


@app.on_event("startup")
def connect_store() -> None:
    store.connect()


@app.on_event("shutdown")
def close_store() -> None:
    store.close()


def public(document: dict[str, Any] | None) -> dict[str, Any] | None:
    if document is None:
        return None
    result = dict(document)
    result.pop("_id", None)
    return result


def normalize(value: str) -> str:
    return re.sub(r"[\s\-_.]", "", value.casefold())


def detect_language(query: str) -> str:
    if re.search(r"[\uac00-\ud7af]", query):
        return "ko"
    if re.search(r"[\u0900-\u097f]", query):
        return "hi"
    if re.search(r"[\u3400-\u9fff]", query):
        return "zh"
    lowered = query.casefold()
    if any(char in lowered for char in "ăâđêôơưệộấắằặểễỉịọỏốồớờợụủứừữựỳỷỹ"):
        return "vi"
    if any(char in lowered for char in "ąčęėįšųūž"):
        return "lt"
    return "en"


def extract_with_ollama(query: str, candidates: list[dict[str, Any]]) -> dict[str, Any] | None:
    base_url = os.getenv("OLLAMA_URL")
    if not base_url:
        return None
    allowed = [
        {"id": item["id"], "names": [value for value in [item.get("name"), item.get("name_en"), item.get("name_zh"), item.get("name_vi"), item.get("name_lt"), item.get("name_hi"), *item.get("aliases", [])] if value]}
        for item in candidates
    ]
    prompt = (
        "Identify a campus building only from this registered catalog. "
        "Do not invent a building. Return JSON only with keys building_id (integer or null), "
        "intent (place, directions, or other), confidence (0 to 1), and language (ko, en, zh, vi, lt, hi). "
        f"Catalog: {json.dumps(allowed, ensure_ascii=False)}\n"
        f"Question: {query}"
    )
    try:
        timeout = max(0.2, min(float(os.getenv("OLLAMA_TIMEOUT_SECONDS", "1.2")), 4.0))
    except ValueError:
        timeout = 1.2
    try:
        response = httpx.post(
            f"{base_url.rstrip('/')}/api/generate",
            json={"model": os.getenv("OLLAMA_MODEL", "qwen2.5:3b"), "prompt": prompt, "stream": False, "format": "json"},
            timeout=timeout,
        )
        response.raise_for_status()
        body = response.json()
        parsed = json.loads(body.get("response", "{}"))
        if not isinstance(parsed, dict):
            return None
        building_id = parsed.get("building_id")
        confidence = float(parsed.get("confidence", 0))
        if not isinstance(building_id, int) or isinstance(building_id, bool) or confidence < 0.8:
            return None
        registered_ids = {item["id"] for item in candidates}
        if building_id not in registered_ids:
            return None
        parsed["language"] = parsed.get("language") if parsed.get("language") in LANGUAGE_REPLIES else detect_language(query)
        return parsed
    except (httpx.HTTPError, ValueError, TypeError, json.JSONDecodeError):
        logger.info("Ollama unavailable or invalid response; using registered-alias fallback.")
        return None


def require_admin(authorization: str | None = Header(default=None)) -> None:
    expected = os.getenv("ADMIN_API_TOKEN")
    if not expected:
        raise HTTPException(status_code=503, detail="Admin API is disabled until ADMIN_API_TOKEN is configured.")
    supplied = authorization.removeprefix("Bearer ") if authorization else ""
    if not supplied or not __import__("hmac").compare_digest(supplied, expected):
        raise HTTPException(status_code=401, detail="Invalid administrator token.")


@app.get("/api/health")
def health() -> dict[str, Any]:
    return {"ok": True, "storage": "mongodb" if store.mongo_enabled else "memory", "building_count": len(store.buildings()), "path_node_count": len(store.nodes()), "path_edge_count": len(store.edges())}


@app.get("/api/buildings")
def list_buildings() -> list[dict[str, Any]]:
    return [public(building) for building in store.buildings()]


@app.get("/api/buildings/{building_id}")
def get_building(building_id: int) -> dict[str, Any]:
    building = public(store.building(building_id))
    if building is None:
        raise HTTPException(status_code=404, detail="Building is not registered.")
    return building


@app.get("/api/buildings/{building_id}/facilities")
def list_facilities(building_id: int) -> list[dict[str, Any]]:
    if store.building(building_id) is None:
        raise HTTPException(status_code=404, detail="Building is not registered.")
    if store.db is not None:
        return list(store.db.facilities.find({"building_id": building_id}, {"_id": 0}))
    return [item for item in store.memory_facilities.values() if item.get("building_id") == building_id]


@app.post("/api/search")
def search_places(request: SearchInput) -> dict[str, Any]:
    language = detect_language(request.query)
    strings = LANGUAGE_REPLIES[language]
    query = normalize(request.query)
    if any(normalize(term) in query for term in OUTSIDE_TERMS):
        return {"status": "campus_only", "language": language, "reply": strings["outside"], "building": None, "source": "guardrail"}

    candidates = store.buildings()
    matches: list[tuple[int, dict[str, Any]]] = []
    for building in candidates:
        terms = [building.get("name", ""), *building.get("aliases", [])]
        terms.extend(building.get(key) or "" for key in ("name_en", "name_zh", "name_vi", "name_lt", "name_hi"))
        terms = [term for term in terms if term]
        normalized_terms = [normalize(term) for term in terms if normalize(term)]
        score = max((10000 + len(term) if term == query else 5000 + len(term) if term in query else 100 + len(query) if query in term else 0 for term in normalized_terms), default=0)
        if score:
            matches.append((score, building))
    if matches:
        matches.sort(key=lambda entry: entry[0], reverse=True)
        top_score = matches[0][0]
        winners = [building for score, building in matches if score == top_score]
        if len(winners) == 1:
            return {"status": "matched", "language": language, "reply": strings["matched"], "building": public(winners[0]), "source": "registered_alias"}
        return {"status": "ambiguous", "language": language, "reply": strings["not_found"], "matches": [public(building) for building in winners], "source": "registered_alias"}

    facility_matches: list[tuple[int, dict[str, Any]]] = []
    for facility in store.facilities():
        names = [facility.get("name", ""), *facility.get("aliases", [])]
        names.extend(facility.get(key) or "" for key in ("name_en", "name_zh", "name_vi", "name_lt", "name_hi"))
        normalized_names = [normalize(name) for name in names if name]
        score = max((10000 + len(name) if name == query else 5000 + len(name) if name in query else 100 + len(query) if query in name else 0 for name in normalized_names), default=0)
        if score:
            facility_matches.append((score, facility))
    if facility_matches:
        facility_matches.sort(key=lambda entry: entry[0], reverse=True)
        best_score = facility_matches[0][0]
        best = [facility for score, facility in facility_matches if score == best_score]
        if len(best) == 1:
            facility = best[0]
            building = public(store.building(int(facility["building_id"])))
            if building:
                return {"status": "matched", "language": language, "reply": strings["matched"], "building": building, "facility": facility, "source": "registered_facility"}
        return {"status": "ambiguous", "language": language, "reply": strings["not_found"], "matches": [{"id": facility.get("id"), "name": facility.get("name"), "building_id": facility.get("building_id")} for facility in best], "source": "registered_facility"}

    # Match floor rooms & room codes (e.g. U001, NM404, DH307, EL201, BA504)
    room_matches: list[tuple[int, dict[str, Any], dict[str, Any]]] = []
    for building in candidates:
        for floor in building.get("floor_details", []):
            for room in floor.get("facilities", []):
                rname = room.get("name", "")
                rnorm = normalize(rname)
                if not rnorm:
                    continue
                score = 10000 + len(rnorm) if rnorm == query else 6000 + len(query) if query in rnorm else 0
                if score:
                    room_matches.append((
                        score,
                        building,
                        {
                            "name": rname,
                            "category": room.get("category") or floor.get("label"),
                            "floor": floor.get("floor"),
                            "note": room.get("note"),
                        },
                    ))
    if room_matches:
        room_matches.sort(key=lambda entry: entry[0], reverse=True)
        _, win_building, win_facility = room_matches[0]
        return {"status": "matched", "language": language, "reply": strings["matched"], "building": public(win_building), "facility": win_facility, "source": "registered_room"}

    is_followup = any(normalize(term) in query for term in FOLLOWUP_TERMS) or re.search(r"\b(?:there|that place|ten|tenai)\b", request.query.casefold()) is not None
    if request.context_building_id and is_followup:
        context = public(store.building(request.context_building_id))
        if context:
            return {"status": "matched", "language": language, "reply": strings["matched"], "building": context, "source": "conversation_context", "intent": "directions"}
    ai_result = extract_with_ollama(request.query, candidates)
    if ai_result:
        ai_building = next((item for item in candidates if item["id"] == ai_result["building_id"]), None)
        if ai_building:
            ai_language = ai_result["language"]
            return {"status": "matched", "language": ai_language, "reply": LANGUAGE_REPLIES[ai_language]["matched"], "building": public(ai_building), "intent": ai_result.get("intent", "place"), "source": "ollama_validated"}
    return {"status": "not_found", "language": language, "reply": strings["not_found"], "building": None, "source": "registered_alias"}


def haversine_meters(lat1: float, lng1: float, lat2: float, lng2: float) -> float:
    phi1, phi2 = math.radians(lat1), math.radians(lat2)
    d_phi, d_lam = math.radians(lat2 - lat1), math.radians(lng2 - lng1)
    value = math.sin(d_phi / 2) ** 2 + math.cos(phi1) * math.cos(phi2) * math.sin(d_lam / 2) ** 2
    return 6_371_000 * 2 * math.atan2(math.sqrt(value), math.sqrt(1 - value))


def build_route(request: RouteInput) -> dict[str, Any]:
    end_building = store.building(request.end_building_id)
    start_building = store.building(request.start_building_id) if request.start_building_id is not None else None
    if (request.start_building_id is not None and start_building is None) or not end_building:
        raise HTTPException(status_code=404, detail="Start or destination building is not registered.")
    if request.start_building_id is not None and request.start_building_id == request.end_building_id:
        raise HTTPException(status_code=400, detail="Start and destination must be different.")

    nodes = store.nodes()
    edges = store.edges()
    buildings_by_id = {b["id"]: b for b in store.buildings()}
    prepend_origin_point: dict[str, Any] | None = None
    initial_walk_m = 0.0

    if request.start_coordinates is not None:
        origin_lng, origin_lat = request.start_coordinates.coordinates
        def meters_from_origin(node: dict[str, Any]) -> float:
            node_lng, node_lat = node["location"]["coordinates"]
            return haversine_meters(origin_lat, origin_lng, node_lat, node_lng)
        nearest = min(nodes, key=meters_from_origin, default=None)
        if nearest is None or meters_from_origin(nearest) > 450:
            raise HTTPException(status_code=404, detail="현재 위치가 동서대학교 캠퍼스 반경 밖에 있습니다. 캠퍼스 안에서 내 위치를 지정하거나 출발 건물을 선택해 주세요.")
        start_nodes = [nearest["id"]]
        initial_walk_m = meters_from_origin(nearest)
        origin_elev = float(nearest.get("elevation") or 100.0)
        route_origin: dict[str, Any] = {
            "name": "현재 위치",
            "location": request.start_coordinates.model_dump(mode="json"),
            "elevation": origin_elev,
        }
        if initial_walk_m > 2.0:
            prepend_origin_point = {
                "id": "user-origin",
                "lat": origin_lat,
                "lng": origin_lng,
                "elevation": origin_elev,
                "distance_to_first_m": round(initial_walk_m, 1),
            }
    else:
        start_nodes = [node["id"] for node in nodes if node.get("building_id") == request.start_building_id]
        route_origin = public(start_building) or {}
    goal_nodes = {node["id"] for node in nodes if node.get("building_id") == request.end_building_id}
    if not start_nodes or not goal_nodes:
        raise HTTPException(status_code=404, detail="No verified pedestrian path is connected to one or both buildings.")

    by_id = {node["id"]: node for node in nodes}
    graph: dict[str, list[tuple[str, float, dict[str, Any]]]] = {node_id: [] for node_id in by_id}
    for edge in edges:
        source, target = edge.get("from_node"), edge.get("to_node")
        if source not in by_id or target not in by_id or not edge.get("accessible", True):
            continue
        if request.step_free and not edge.get("is_step_free", False):
            continue
        distance = float(edge.get("distance_m", 0))
        if distance <= 0:
            continue
        slope = float(edge.get("slope_pct") or 0)
        # In step_free / ramp mode, penalize steep slopes more strongly to prefer gentle ramps
        weight = distance * (1 + abs(slope) / 100 * (1.2 if request.step_free else 0.35))
        graph[source].append((target, weight, edge))
        if edge.get("bidirectional", True):
            reverse_edge = {**edge, "from_node": target, "to_node": source, "slope_pct": round(-slope, 1)}
            reverse_weight = distance * (1 + abs(slope) / 100 * (1.2 if request.step_free else 0.35))
            graph[target].append((source, reverse_weight, reverse_edge))

    distances: dict[str, float] = {}
    previous: dict[str, tuple[str, dict[str, Any]]] = {}
    queue: list[tuple[float, str]] = []
    for start in start_nodes:
        distances[start] = 0
        heapq.heappush(queue, (0, start))
    destination: str | None = None
    while queue:
        cost, node_id = heapq.heappop(queue)
        if cost != distances.get(node_id):
            continue
        if node_id in goal_nodes:
            destination = node_id
            break
        for neighbor, edge_cost, edge in graph[node_id]:
            new_cost = cost + edge_cost
            if new_cost < distances.get(neighbor, math.inf):
                distances[neighbor] = new_cost
                previous[neighbor] = (node_id, edge)
                heapq.heappush(queue, (new_cost, neighbor))
    if destination is None:
        raise HTTPException(status_code=404, detail="No connected verified pedestrian route exists between these buildings.")

    route_ids = [destination]
    route_edges = []
    current = destination
    while current in previous:
        parent, edge = previous[current]
        route_edges.append(edge)
        route_ids.append(parent)
        current = parent
    route_ids.reverse()
    route_edges.reverse()

    waypoints: list[dict[str, Any]] = []
    path_coords: list[dict[str, Any]] = []
    segments: list[dict[str, Any]] = []

    if prepend_origin_point is not None:
        first_node = by_id[route_ids[0]]
        first_lng, first_lat = first_node["location"]["coordinates"]
        first_elev = float(first_node.get("elevation") or 100.0)
        path_coords.append({"type": "Point", "coordinates": [prepend_origin_point["lng"], prepend_origin_point["lat"]]})
        waypoints.append({
            "node_id": "user-origin",
            "lat": prepend_origin_point["lat"],
            "lng": prepend_origin_point["lng"],
            "elevation": prepend_origin_point["elevation"],
            "label": "현재 위치",
        })
        segments.append({
            "id": "edge-origin",
            "from_node": "user-origin",
            "to_node": route_ids[0],
            "from_coord": [prepend_origin_point["lat"], prepend_origin_point["lng"]],
            "to_coord": [first_lat, first_lng],
            "from_elevation": prepend_origin_point["elevation"],
            "to_elevation": first_elev,
            "distance_m": prepend_origin_point["distance_to_first_m"],
            "slope_pct": 0.0,
            "is_step_free": True,
        })

    for node_id in route_ids:
        node = by_id[node_id]
        lng, lat = node["location"]["coordinates"]
        b_id = node.get("building_id")
        b_name = buildings_by_id[b_id]["name"] if b_id in buildings_by_id else None
        path_coords.append(node["location"])
        waypoints.append({
            "node_id": node_id,
            "lat": lat,
            "lng": lng,
            "elevation": float(node.get("elevation") or 100.0),
            "building_id": b_id,
            "label": b_name,
        })

    for edge in route_edges:
        u_node = by_id[edge["from_node"]]
        v_node = by_id[edge["to_node"]]
        u_lng, u_lat = u_node["location"]["coordinates"]
        v_lng, v_lat = v_node["location"]["coordinates"]
        segments.append({
            "id": edge["id"],
            "from_node": edge["from_node"],
            "to_node": edge["to_node"],
            "from_coord": [u_lat, u_lng],
            "to_coord": [v_lat, v_lng],
            "from_elevation": float(u_node.get("elevation") or 100.0),
            "to_elevation": float(v_node.get("elevation") or 100.0),
            "distance_m": round(float(edge["distance_m"]), 1),
            "slope_pct": round(float(edge.get("slope_pct") or 0.0), 1),
            "is_step_free": bool(edge.get("is_step_free", True)),
        })

    distance_m = initial_walk_m + sum(float(edge["distance_m"]) for edge in route_edges)
    walking_minutes = initial_walk_m / 72.0
    max_slope = 0.0
    uphill_m = 0.0
    downhill_m = 0.0
    for edge in route_edges:
        slope = float(edge.get("slope_pct") or 0)
        max_slope = max(max_slope, abs(slope))
        d_m = float(edge["distance_m"])
        if slope >= 3.0:
            uphill_m += d_m
        elif slope <= -3.0:
            downhill_m += d_m
        speed_m_per_min = max(35, 78 / (1 + max(slope, 0) / 100 * 1.4))
        walking_minutes += d_m / speed_m_per_min
    return {
        "start": route_origin,
        "destination": public(end_building),
        "path": path_coords,
        "waypoints": waypoints,
        "segments": segments,
        "distance_m": round(distance_m),
        "estimated_minutes": max(1, round(walking_minutes)),
        "max_slope_pct": round(max_slope, 1),
        "uphill_distance_m": round(uphill_m),
        "downhill_distance_m": round(downhill_m),
        "step_free": request.step_free,
        "estimated": True,
        "note": "Walking time is an estimate based on the registered path graph and elevation data.",
    }


@app.post("/api/routes")
def find_route(request: RouteInput) -> dict[str, Any]:
    return build_route(request)


@app.post("/api/admin/elevations/lookup", dependencies=[Depends(require_admin)])
def lookup_elevations(request: ElevationLookupInput) -> dict[str, Any]:
    nodes_by_id = {node["id"]: node for node in store.nodes()}
    missing = [node_id for node_id in request.node_ids if node_id not in nodes_by_id]
    if missing:
        raise HTTPException(status_code=404, detail=f"Unregistered path nodes: {', '.join(missing)}")
    selected = [nodes_by_id[node_id] for node_id in request.node_ids]
    locations = [
        {"latitude": node["location"]["coordinates"][1], "longitude": node["location"]["coordinates"][0]}
        for node in selected
    ]
    try:
        response = httpx.post("https://api.open-elevation.com/api/v1/lookup", json={"locations": locations}, timeout=5.0)
        response.raise_for_status()
        elevations = response.json().get("results", [])
        if len(elevations) != len(selected):
            raise ValueError("Elevation API returned an incomplete result set.")
    except (httpx.HTTPError, ValueError, TypeError) as error:
        raise HTTPException(status_code=502, detail="Open-Elevation could not return complete elevation data.") from error

    updated: dict[str, dict[str, Any]] = {}
    for node, result in zip(selected, elevations):
        node["elevation"] = float(result["elevation"])
        store.put("nodes", node["id"], node)
        updated[node["id"]] = node

    changed_edges = 0
    for edge in store.edges():
        start = updated.get(edge["from_node"]) or nodes_by_id.get(edge["from_node"])
        end = updated.get(edge["to_node"]) or nodes_by_id.get(edge["to_node"])
        if start is None or end is None or start.get("elevation") is None or end.get("elevation") is None:
            continue
        measured_distance = float(edge.get("distance_m", 0))
        if measured_distance <= 0:
            continue
        edge["slope_pct"] = round((end["elevation"] - start["elevation"]) / measured_distance * 100, 2)
        store.put("edges", edge["id"], edge)
        changed_edges += 1
    return {"updated_nodes": len(updated), "updated_edges": changed_edges}


@app.get("/api/admin/status", dependencies=[Depends(require_admin)])
def admin_status() -> dict[str, Any]:
    return {"buildings": len(store.buildings()), "path_nodes": len(store.nodes()), "path_edges": len(store.edges()), "storage": "mongodb" if store.mongo_enabled else "memory"}


@app.get("/api/admin/buildings", dependencies=[Depends(require_admin)])
def admin_buildings() -> list[dict[str, Any]]:
    return [public(item) for item in store.buildings()]


@app.get("/api/admin/facilities", dependencies=[Depends(require_admin)])
def admin_facilities() -> list[dict[str, Any]]:
    if store.db is not None:
        return list(store.db.facilities.find({}, {"_id": 0}))
    return list(store.memory_facilities.values())


@app.get("/api/admin/path-nodes", dependencies=[Depends(require_admin)])
def admin_path_nodes() -> list[dict[str, Any]]:
    return store.nodes()


@app.get("/api/admin/path-edges", dependencies=[Depends(require_admin)])
def admin_path_edges() -> list[dict[str, Any]]:
    return store.edges()


@app.put("/api/admin/buildings/{building_id}", dependencies=[Depends(require_admin)])
def update_building(building_id: int, building: BuildingInput) -> dict[str, Any]:
    if building_id != building.id:
        raise HTTPException(status_code=400, detail="Path ID and payload ID must match.")
    document = building.model_dump(mode="json")
    store.put("buildings", building_id, document)
    return document


@app.delete("/api/admin/buildings/{building_id}", dependencies=[Depends(require_admin)])
def delete_building(building_id: int) -> dict[str, Any]:
    if not store.delete("buildings", building_id):
        raise HTTPException(status_code=404, detail="Building is not registered.")
    return {"deleted": building_id}


@app.put("/api/admin/facilities/{facility_id}", dependencies=[Depends(require_admin)])
def update_facility(facility_id: str, facility: FacilityInput) -> dict[str, Any]:
    if facility_id != facility.id:
        raise HTTPException(status_code=400, detail="Path ID and payload ID must match.")
    if store.building(facility.building_id) is None:
        raise HTTPException(status_code=400, detail="Facility references an unregistered building.")
    document = facility.model_dump()
    store.put("facilities", facility_id, document)
    return document


@app.delete("/api/admin/facilities/{facility_id}", dependencies=[Depends(require_admin)])
def delete_facility(facility_id: str) -> dict[str, Any]:
    if not store.delete("facilities", facility_id):
        raise HTTPException(status_code=404, detail="Facility is not registered.")
    return {"deleted": facility_id}


@app.put("/api/admin/path-nodes/{node_id}", dependencies=[Depends(require_admin)])
def update_path_node(node_id: str, node: PathNodeInput) -> dict[str, Any]:
    if node_id != node.id:
        raise HTTPException(status_code=400, detail="Path ID and payload ID must match.")
    if node.building_id is not None and store.building(node.building_id) is None:
        raise HTTPException(status_code=400, detail="Path node references an unregistered building.")
    document = node.model_dump()
    store.put("nodes", node_id, document)
    return document


@app.delete("/api/admin/path-nodes/{node_id}", dependencies=[Depends(require_admin)])
def delete_path_node(node_id: str) -> dict[str, Any]:
    if not store.delete("nodes", node_id):
        raise HTTPException(status_code=404, detail="Path node is not registered.")
    return {"deleted": node_id}


@app.put("/api/admin/path-edges/{edge_id}", dependencies=[Depends(require_admin)])
def update_path_edge(edge_id: str, edge: PathEdgeInput) -> dict[str, Any]:
    if edge_id != edge.id:
        raise HTTPException(status_code=400, detail="Path ID and payload ID must match.")
    node_ids = {node["id"] for node in store.nodes()}
    if edge.from_node not in node_ids or edge.to_node not in node_ids:
        raise HTTPException(status_code=400, detail="Path edge endpoints must refer to registered path nodes.")
    document = edge.model_dump()
    store.put("edges", edge_id, document)
    return document


@app.delete("/api/admin/path-edges/{edge_id}", dependencies=[Depends(require_admin)])
def delete_path_edge(edge_id: str) -> dict[str, Any]:
    if not store.delete("edges", edge_id):
        raise HTTPException(status_code=404, detail="Path edge is not registered.")
    return {"deleted": edge_id}
