from flask import Blueprint, jsonify
import yfinance as yf

api = Blueprint("api", __name__, url_prefix="/api")

@api.route("/quote/<string:ticker>", methods=["GET"])
def get_quote(ticker):
    stock = yf.Ticker(ticker)
    hist = stock.history(period="1d")
    if hist.empty:
        return jsonify({"error": "Ticker not found"}), 404

    latest = hist.iloc[-1]
    return jsonify({
        "symbol": ticker.upper(),
        "price": round(latest["Close"], 2),
        "change": round((latest["Close"] / latest["Open"] - 1) * 100, 2)
    })
