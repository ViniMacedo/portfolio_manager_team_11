from flask_restful import Resource
from flask import request
from app.models import db, Portfolio

class PortfolioResource(Resource):
    def get(self, portfolio_id):
        portfolio = Portfolio.query.get(portfolio_id)
        if not portfolio:
            return {"error": "Portfolio not found"}, 404
        return {
            "id": portfolio.id,
            "name": portfolio.name,
            "created_at": portfolio.created_at.isoformat()
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