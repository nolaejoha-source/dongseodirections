"""Fetch a campus-sized SRTM 30 m elevation grid for the Blender scene."""

from __future__ import annotations

import json
import math
import time
from pathlib import Path
from urllib.request import Request, urlopen


ROOT = Path(__file__).resolve().parents[1]
OUTPUT = ROOT / "data" / "campus_srtm30m.json"

CENTER_LAT = 35.14495
CENTER_LNG = 129.00945
METERS_PER_DEGREE_LAT = 111_320.0
METERS_PER_DEGREE_LNG = METERS_PER_DEGREE_LAT * math.cos(math.radians(CENTER_LAT))

# These are the horizontal bounds of Campus_Terrain in campus_scene.glb.
X_MIN, X_MAX = -352.0, 352.0
Y_MIN, Y_MAX = -272.0, 216.0
NX, NY = 30, 21
BATCH_SIZE = 80


def main() -> None:
    xs = [X_MIN + (X_MAX - X_MIN) * i / (NX - 1) for i in range(NX)]
    ys = [Y_MIN + (Y_MAX - Y_MIN) * j / (NY - 1) for j in range(NY)]
    points = []
    for y in ys:
        lat = CENTER_LAT + y / METERS_PER_DEGREE_LAT
        for x in xs:
            lng = CENTER_LNG + x / METERS_PER_DEGREE_LNG
            points.append((lat, lng))

    values: list[float | None] = []
    for start in range(0, len(points), BATCH_SIZE):
        batch = points[start : start + BATCH_SIZE]
        locations = "|".join(f"{lat:.7f},{lng:.7f}" for lat, lng in batch)
        body = json.dumps({"locations": locations, "interpolation": "bilinear"}).encode("utf-8")
        request = Request(
            "https://api.opentopodata.org/v1/srtm30m",
            data=body,
            headers={
                "Content-Type": "application/json",
                "User-Agent": "CampusMap-Blender-Terrain/1.0",
            },
            method="POST",
        )
        with urlopen(request, timeout=45) as response:
            payload = json.load(response)
        if payload.get("status") != "OK" or len(payload.get("results", [])) != len(batch):
            raise RuntimeError(f"SRTM request failed for batch {start // BATCH_SIZE + 1}: {payload}")
        values.extend(result["elevation"] for result in payload["results"])
        print(f"Fetched {min(start + len(batch), len(points))}/{len(points)} points")
        if start + BATCH_SIZE < len(points):
            time.sleep(1.0)

    if any(value is None for value in values):
        raise RuntimeError("SRTM returned missing elevations inside the campus bounds")

    grid = [values[j * NX : (j + 1) * NX] for j in range(NY)]
    result = {
        "source": "SRTM 30m via OpenTopoData public API",
        "dataset": "srtm30m",
        "interpolation": "bilinear",
        "license_note": "SRTM Version 3; attribution to OpenTopoData and USGS/NASA SRTM",
        "center": {"latitude": CENTER_LAT, "longitude": CENTER_LNG},
        "bounds_m": {"x_min": X_MIN, "x_max": X_MAX, "y_min": Y_MIN, "y_max": Y_MAX},
        "shape": {"columns": NX, "rows": NY},
        "x_m": xs,
        "y_m": ys,
        "elevation_m": grid,
    }
    OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    OUTPUT.write_text(json.dumps(result, ensure_ascii=False, indent=2), encoding="utf-8")
    flattened = [float(value) for value in values]
    print(f"Saved {OUTPUT}")
    print(f"Elevation range: {min(flattened):.1f}-{max(flattened):.1f} m")


if __name__ == "__main__":
    main()
