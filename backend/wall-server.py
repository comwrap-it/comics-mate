import os
from flask import Flask, send_from_directory
from flask_cors import CORS

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})

# Serve the wall HTML page
@app.route('/')
def wall():
    return send_from_directory(os.path.dirname(os.path.abspath(__file__)), 'wall.html')

# Serve the wall favicon
@app.route('/wall-favicon.svg')
def wall_favicon():
    return send_from_directory(os.path.dirname(os.path.abspath(__file__)), 'wall-favicon.svg')

if __name__ == '__main__':
    print("Superhero Comics Mate Badge Wall Server starting on http://localhost:5001")
    print("Open this URL on your projection screen!")
    app.run(debug=True, port=5001, host='0.0.0.0')

