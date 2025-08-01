class Config:
    # NOTE: In a production environment, these values should be in environment variables
    # and not hardcoded in the source code. This is just for development simplicity.
    SECRET_KEY = 'dev-secret-key'
    
    # MySQL configuration 
    SQLALCHEMY_DATABASE_URI = 'mysql+mysqlconnector://root:n3u3da!@localhost/portfolio_manager'
    SQLALCHEMY_TRACK_MODIFICATIONS = False
