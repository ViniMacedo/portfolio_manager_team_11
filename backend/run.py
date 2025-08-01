from app.app import create_app, db

app = create_app()

if __name__ == '__main__':
    with app.app_context():
        # Make sure tables exist
        db.create_all()
        print("Database tables created/verified!")
        print("API Server starting...")
        print("Test your API at: http://localhost:5000/api/test")

    # Run the Flask development server
    app.run(debug=True, host='0.0.0.0', port=5000)