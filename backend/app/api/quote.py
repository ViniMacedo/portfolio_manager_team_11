import yfinance_cache as yf
# import yfinance as yf
from flask_restful import Resource
from requests.exceptions import HTTPError
import math 

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
    if math.isnan(volume):
        return None
    return f"{volume / 1_000_000:.1f}M"

class QuoteResource(Resource):
    def get(self, ticker):
        try:
            stock = yf.Ticker(ticker)
            hist = stock.history(period="1d")
            info = stock.info
            if hist.empty:
                return {"error": f"Ticker = {ticker} not found"}, 404
            
            close_prices = hist["Close"].tolist()
            volume_data = hist["Volume"].tolist()
            price = close_prices[-1]
            open_price = hist["Open"].iloc[-1]
            volume = volume_data[-1]

            return {
                "symbol": ticker.upper(),
                "symbol": ticker,
                "name": info.get("longName"),
                "sector": info.get("sector"),
                "marketCap": format_market_cap(info.get("marketCap")),
                "peRatio": info.get("trailingPE"),
                "fiftyTwoWeekLow": info.get("fiftyTwoWeekLow"),
                "fiftyTwoWeekHigh": info.get("fiftyTwoWeekHigh"),
                "price": round(price, 2),
                "change": round((price / open_price - 1) * 100, 2),
                "volume": format_volume(volume),
                "chart_prices": close_prices,
                "chart_volume": volume_data
            }
        except HTTPError as e:
            if e.response.status_code == 429:
                return {"error": "Rate limit exceeded. Please try again later."}, 429
            return {"error": str(e)}, 500
        
    @staticmethod
    def get_current_price(ticker):
        try:
            stock = yf.Ticker(ticker)
            hist = stock.history(period="1d")
            if hist.empty:
                return None
            return float(hist.iloc[-1]["Close"])
        except Exception:
            return None