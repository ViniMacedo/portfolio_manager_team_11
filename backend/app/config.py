class Config:
    # NOTE: In a production environment, these values should be in environment variables
    # and not hardcoded in the source code. This is just for development simplicity.
    SECRET_KEY = 'dev-secret-key'
    
    # MySQL configuration - Update these values with your MySQL credentials
    SQLALCHEMY_DATABASE_URI = 'mysql://root:123456@localhost/portfolio_manager'
    SQLALCHEMY_TRACK_MODIFICATIONS = False
