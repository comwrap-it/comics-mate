import base64
import json
import os
import random
import time

from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})

# Use a folder in the project directory
BASE_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "badges")
BASE_DIR = os.path.abspath(BASE_DIR)
# Create directory if it doesn't exist
os.makedirs(BASE_DIR, exist_ok=True)
print(f"Badges will be saved to: {BASE_DIR}")


@app.route("/get-badges", methods=["GET"])
def get_badges():
    badges = []

    for category in os.listdir(BASE_DIR):
        category_path = os.path.join(BASE_DIR, category)

        if os.path.isdir(category_path):
            for img_name in os.listdir(category_path):
                if img_name.lower().endswith((".png", ".jpg", ".jpeg", ".webp")):
                    img_url = f"http://localhost:5000/static/{category}/{img_name}"
                    
                    # Try to load metadata JSON file
                    metadata_file = os.path.join(category_path, f"{img_name}.json")
                    user_name = img_name  # Default to filename
                    
                    if os.path.exists(metadata_file):
                        try:
                            with open(metadata_file, "r", encoding="utf-8") as f:
                                metadata = json.load(f)
                                user_name = metadata.get("userName", img_name)
                        except:
                            pass
                    
                    badges.append({
                        "id": f"{category}_{img_name}",
                        "name": user_name,
                        "category": category,
                        "imageUrl": img_url
                    })

    random.shuffle(badges)

    return jsonify(badges)


@app.route("/save-badge", methods=["POST"])
def save_badge():
    data = request.get_json()
    image_base64 = data.get("image")
    category = data.get("category")
    user_name = data.get("userName", "Unknown")

    if not image_base64 or not category:
        return jsonify({"error": "Missing image or category"}), 400

    try:
        image_data = base64.b64decode(image_base64.split(",")[1])  # rimuove "data:image/png;base64,"
    except Exception as e:
        return jsonify({"error": f"Invalid image data: {str(e)}"}), 400

    category_path = os.path.join(BASE_DIR, category)
    os.makedirs(category_path, exist_ok=True)

    # Use timestamp for unique filename
    timestamp = int(time.time() * 1000)  # milliseconds for better uniqueness
    filename = f"badge_{timestamp}.png"
    file_path = os.path.join(category_path, filename)

    # Save image
    with open(file_path, "wb") as f:
        f.write(image_data)

    # Save metadata JSON file with user name
    metadata_file = os.path.join(category_path, f"{filename}.json")
    with open(metadata_file, "w", encoding="utf-8") as f:
        json.dump({"userName": user_name, "timestamp": timestamp}, f, ensure_ascii=False)

    return jsonify({"message": "Badge saved", "file": filename})


@app.route("/static/<category>/<filename>")
def serve_image(category, filename):
    return send_from_directory(os.path.join(BASE_DIR, category), filename)


@app.route("/delete-badge", methods=["DELETE"])
def delete_badge():
    data = request.get_json()
    badge_id = data.get("id")
    
    if not badge_id:
        return jsonify({"error": "Badge ID is required"}), 400
    
    try:
        # Parse badge_id format: "{category}_{filename}"
        # The filename might contain underscores, so we split only on the first underscore
        if "_" not in badge_id:
            return jsonify({"error": "Invalid badge ID format"}), 400
        
        # Split only on the first underscore to separate category from filename
        parts = badge_id.split("_", 1)
        if len(parts) != 2:
            return jsonify({"error": "Invalid badge ID format"}), 400
        
        category = parts[0]
        filename = parts[1]
        
        # Security: prevent directory traversal
        if ".." in category or ".." in filename or "/" in category or "\\" in category:
            return jsonify({"error": "Invalid path"}), 400
        
        category_path = os.path.join(BASE_DIR, category)
        file_path = os.path.join(category_path, filename)
        
        # Verify the file exists and is within BASE_DIR
        if not os.path.exists(file_path):
            return jsonify({"error": "Badge not found"}), 404
        
        # Additional security check
        real_path = os.path.realpath(file_path)
        real_base = os.path.realpath(BASE_DIR)
        if not real_path.startswith(real_base):
            return jsonify({"error": "Invalid path"}), 400
        
        # Remove the image file
        os.remove(file_path)
        
        # Also remove the metadata JSON file if it exists
        metadata_file = os.path.join(category_path, f"{filename}.json")
        if os.path.exists(metadata_file):
            os.remove(metadata_file)
        
        return jsonify({"message": "Badge deleted successfully"})
    except Exception as e:
        return jsonify({"error": f"Error deleting badge: {str(e)}"}), 500


if __name__ == '__main__':
    app.run(debug=True)
