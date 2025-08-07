import os
import json
from cachetools import TTLCache
from flask import request
from flask_restful import Resource

# Cache (max 100 items, 60 sec TTL)
symbol_cache = TTLCache(maxsize=100, ttl=60)

# Load local ticker data
TICKERS_PATH = os.path.join(os.path.dirname(__file__), "..", "data", "tickers.json")
with open(TICKERS_PATH, encoding="utf-8") as f:
    local_tickers = json.load(f)

class SymbolSearchResource(Resource):
    def get(self):
        query = request.args.get("q", "").strip().lower()
        if not query:
            return {"matches": []}, 200

        # Check local cache (by prefix)
        for i in range(len(query), 0, -1):
            prefix = query[:i]
            if prefix in symbol_cache:
                filtered = [
                    match for match in symbol_cache[prefix]
                    if query in match["symbol"].lower() or query in match["name"].lower()
                ]
                return {"matches": filtered}, 200

        # Local ticker search
        local_matches = [
            {
                "symbol": t["ticker"],
                "name": t["name"]
            }
            for t in local_tickers
            if query in t["ticker"].lower() or query in t["name"].lower()
        ]
        symbol_cache[query] = local_matches
        return {"matches": local_matches}, 200
