class Config:
    # NOTE: In a production environment, these values should be in environment variables
    # and not hardcoded in the source code. This is just for development simplicity.
    SECRET_KEY = 'dev-secret-key'
    SQLALCHEMY_DATABASE_URI = 'sqlite:///portfolio.db'
    SQLALCHEMY_TRACK_MODIFICATIONS = False
