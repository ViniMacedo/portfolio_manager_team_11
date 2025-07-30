from flask import Blueprint, jsonify, request
from .models import TestEntry
from app import db

api_bp = Blueprint('api', __name__)

@api_bp.route('/hello')
def hello():
    return jsonify({'message': 'Hello from Flask!'})

# Test database endpoints
@api_bp.route('/test/create', methods=['POST'])
def create_test_entry():
    data = request.get_json()
    new_entry = TestEntry(content=data.get('content', 'Test content'))
    db.session.add(new_entry)
    db.session.commit()
    return jsonify(new_entry.to_dict())

@api_bp.route('/test/list', methods=['GET'])
def list_test_entries():
    entries = TestEntry.query.all()
    return jsonify([entry.to_dict() for entry in entries])

@api_bp.route('/test/clear', methods=['DELETE'])
def clear_test_entries():
    TestEntry.query.delete()
    db.session.commit()
    return jsonify({'message': 'All test entries cleared'})
