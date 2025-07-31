from flask import Blueprint, jsonify, request
from .models import TestEntry
from app import db

api_bp = Blueprint('api', __name__)


# Example of database interaction endpoint
# @api_bp.route('/test/create', methods=['POST'])
# def create_test_entry():
#     data = request.get_json()
#     new_entry = TestEntry(content=data.get('content', 'Test content'))
#     db.session.add(new_entry)
#     db.session.commit()
#     return jsonify(new_entry.to_dict())
