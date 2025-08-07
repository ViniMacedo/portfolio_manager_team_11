import yfinance_cache as yf
from flask_restful import Resource
from requests.exceptions import HTTPError
from datetime import datetime, timedelta, timezone
import math
import threading

class StockDataCache:
    def __init__(self, ttl_seconds=60):
        self.ttl = timedelta(seconds=ttl_seconds)
        self.data = {}
        self.lock = threading.Lock()

    def get(self, symbol):
        with self.lock:
            entry = self.data.get(symbol)
            if entry and datetime.now(timezone.utc) - entry["timestamp"] < self.ttl:
                return entry["data"]
            return None

    def set(self, symbol, data):
        with self.lock:
            self.data[symbol] = {"data": data, "timestamp": datetime.now(timezone.utc)}

stock_cache = StockDataCache(ttl_seconds=60)

def fetch_full_stock_data(symbol):
    cached = stock_cache.get(symbol)
    if cached:
        return cached

    try:
        stock = yf.Ticker(symbol)

        info = stock.info or {}
        fast_info = stock.fast_info or {}
        hist_1d = stock.history(period="1d")
        hist_max = stock.history(period="max")

        result = {
            "info": info,
            "fast_info": fast_info,
            "history_1d": hist_1d,
            "history_max": hist_max,
        }

        stock_cache.set(symbol, result)
        return result

    except Exception as e:
        print(f"Error fetching data for {symbol}: {e}")
        return None


def format_market_cap(market_cap):
    if market_cap is None:
        return None
    trillion = 1_000_000_000_000
    billion = 1_000_000_000
    million = 1_000_000
    if market_cap >= trillion:
        return f"${market_cap / trillion:.2f}T"
    elif market_cap >= billion:
        return f"${market_cap / billion:.2f}B"
    elif market_cap >= million:
        return f"${market_cap / million:.2f}M"
    return str(market_cap)

def format_volume(volume):
    if volume is None or math.isnan(volume):
        return None
    return f"{volume / 1_000_000:.1f}M"


class QuoteResource(Resource):
    def get(self, ticker):
        try:
            data = fetch_full_stock_data(ticker)
            if not data:
                return {"error": "Failed to fetch stock data"}, 500

            info = data["info"]
            hist = data["history_1d"]
            hist_max = data["history_max"]

            if hist.empty:
                return {"error": f"Ticker = {ticker} not found"}, 404

            dividends = hist_max["Dividends"]
            last_dividend = dividends[dividends != 0].iloc[-1] if not dividends[dividends != 0].empty else 0

            close_prices = hist["Close"].tolist()
            volume_data = hist["Volume"].tolist()
            price = close_prices[-1]
            open_price = hist["Open"].iloc[-1]
            volume = volume_data[-1]

            return {
                "symbol": ticker.upper(),
                "name": info.get("longName"),
                "sector": info.get("sector"),
                "marketCap": format_market_cap(info.get("marketCap")),
                "peRatio": info.get("trailingPE"),
                "fiftyTwoWeekLow": info.get("fiftyTwoWeekLow"),
                "fiftyTwoWeekHigh": info.get("fiftyTwoWeekHigh"),
                "price": round(price, 2),
                "change": round((price / open_price - 1) * 100, 2),
                "volume": format_volume(volume),
                "dividend": last_dividend,
                "chart_prices": close_prices,
                "chart_volume": volume_data
            }

        except HTTPError as e:
            if e.response.status_code == 429:
                return {"error": "Rate limit exceeded. Please try again later."}, 429
            return {"error": str(e)}, 500

    @staticmethod
    def get_current_price(ticker):
        data = fetch_full_stock_data(ticker)
        if not data:
            return None

        try:
            hist = data["history_1d"]
            if hist.empty:
                return None
            return float(hist["Close"].iloc[-1])
        except Exception:
            return None
