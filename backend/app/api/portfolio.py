from flask_restful import Resource
from flask import request
from app.models import db, Portfolio, Holding
from app.api.quote import QuoteResource

class PortfolioResource(Resource):
    def get(self, portfolio_id):
        portfolio = Portfolio.query.get(portfolio_id)
        if not portfolio:
            return {"error": "Portfolio not found"}, 404

        holdings = Holding.query.filter_by(portfolio_id=portfolio.id).all()
        holdings_data = []

        for holding in holdings:
            live_price = QuoteResource.get_current_price(holding.product_symbol)

            holding_dict = holding.to_dict()
            if live_price is not None:
                holding_dict["current_price"] = live_price

            holdings_data.append(holding_dict)

        return {
            "id": portfolio.id,
            "name": portfolio.name,
            "created_at": portfolio.created_at.isoformat(),
            "holdings": holdings_data
        }
        
    def post(self):
        data = request.get_json()
        name = data.get("name")
        if not name:
            return {"error": "Name is required"}, 400

        portfolio = Portfolio(name=name)
        db.session.add(portfolio)
        db.session.commit()
        return {"message": "Portfolio created", "id": portfolio.id}, 201