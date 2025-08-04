from flask_restful import Resource
from flask import request
from app.models import db, User

class UserResource(Resource):
    def get(self, user_id):
        user = User.query.get(user_id)
        if not user:
            return {"error": "User not found"}, 404
        return {
            "id": user.id,
            "name": user.name,
            "balance": str(user.balance)
        }