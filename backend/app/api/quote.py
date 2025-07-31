import yfinance_cache as yf
# import yfinance as yf
from flask_restful import Resource
from requests.exceptions import HTTPError

class QuoteResource(Resource):
    def get(self, ticker):
        try:
            stock = yf.Ticker(ticker)
            hist = stock.history(period="1d")
            if hist.empty:
                return {"error": f"Ticker = {ticker} not found"}, 404

            latest = hist.iloc[-1]
            return {
                "symbol": ticker.upper(),
                "price": round(latest["Close"], 2),
                "change": round((latest["Close"] / latest["Open"] - 1) * 100, 2)
            }
        except HTTPError as e:
            if e.response.status_code == 429:
                return {"error": "Rate limit exceeded. Please try again later."}, 429
            return {"error": str(e)}, 500