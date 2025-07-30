from flask import Flask
from flask_cors import CORS
from api import api as api_blueprint

def create_app():
    app = Flask(__name__)
    CORS(app, resources={r"/api/*": {"origins": "*"}})
    app.register_blueprint(api_blueprint)
    return app

if __name__ == "__main__":
    create_app().run(debug=True, port=5000)