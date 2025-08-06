import os
import time
import json
from cachetools import TTLCache
from flask import request
from flask_restful import Resource
import requests
from collections import deque

API_KEY = os.getenv("ALPHA_VANTAGE_API_KEY")

# Cache (max 100 items, 60 sec TTL)
symbol_cache = TTLCache(maxsize=100, ttl=60)

# Track timestamps of Alpha Vantage API calls
alpha_vantage_calls = deque(maxlen=5)  # store last 5 timestamps
RATE_LIMIT_INTERVAL = 60  # seconds

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
            t for t in local_tickers
            if query in t["ticker"].lower() or query in t["name"].lower()
        ]
        if local_matches:
            symbol_cache[query] = local_matches
            return {"matches": local_matches}, 200

        # Enforce Alpha Vantage rate limit
        now = time.time()
        alpha_vantage_calls.append(now)
        if len(alpha_vantage_calls) == alpha_vantage_calls.maxlen:
            elapsed = now - alpha_vantage_calls[0]
            if elapsed < RATE_LIMIT_INTERVAL:
                return {"error": "Rate limit exceeded. Please wait a few seconds."}, 429

        # Fallback to Alpha Vantage
        try:
            url = "https://www.alphavantage.co/query"
            params = {
                "function": "SYMBOL_SEARCH",
                "keywords": query,
                "apikey": API_KEY
            }
            response = requests.get(url, params=params, timeout=5)
            response.raise_for_status()
            data = response.json()
            matches = data.get("bestMatches", [])
            parsed = [
                {
                    "symbol": m.get("1. symbol"),
                    "name": m.get("2. name")
                }
                for m in matches
            ]
            symbol_cache[query] = parsed
            return {"matches": parsed}, 200
        except Exception as e:
            return {"error": f"Failed to fetch symbols: {str(e)}"}, 500
