from flask import Flask
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from flask_restful import Api
from .config import Config

# Initialize SQLAlchemy
db = SQLAlchemy()


def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    # Initialize extensions
    CORS(app)
    db.init_app(app)
    api = Api(app)  # Initialize Flask-RESTful

    # Register RESTful resources
    from .api.quote import QuoteResource
    from .api.portfolio import PortfolioResource
    from .api.user import UserResource
    api.add_resource(QuoteResource, '/api/quote/<string:ticker>')
    api.add_resource(UserResource, '/api/user/<int:user_id>')
    api.add_resource(PortfolioResource, '/api/portfolio/<int:portfolio_id>')

    # Create database tables
    with app.app_context():
        from . import models  # Import models so they are registered with SQLAlchemy
        db.create_all()

    return app