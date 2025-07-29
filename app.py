from flask import Flask, jsonify
from flask_cors import CORS
import yfinance as yf

app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "http://localhost:3000"}})

@app.route("/api/quote/<string:ticker>", methods=["GET"])
def get_quote(ticker):
    """
    REST endpoint JSON: { symbol, price, change }
    """
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


if __name__ == "__main__":
    # defaults to port 5000
    app.run(debug=True)
