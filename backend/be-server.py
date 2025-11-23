import base64
import os
import random
import tempfile
import time
from datetime import datetime

from flask import Flask, request, send_file, jsonify, send_from_directory
from flask_cors import CORS
from google.genai import Client
from google.genai.types import Image

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})
client = Client()


@app.route('/generate-video', methods=['POST'])
def generate_video():
    prompt = request.form.get('prompt')
    image_file = request.files.get('image')
    image_base64 = request.form.get('image_base64')

    if not prompt:
        return jsonify({'error': 'Prompt is required'}), 400

    if not image_file and not image_base64:
        return jsonify({'error': 'Image is required (either as file or base64)'}), 400

    try:
        if image_file:
            image_bytes = image_file.read()
        else:
            image_bytes = base64.b64decode(image_base64)

        print("Start generating video")
        image_obj = Image(image_bytes=image_bytes, mime_type="image/png")
        operation = client.models.generate_videos(
            model="veo-3.1-generate-preview",
            prompt=prompt,
            image=image_obj,
        )

        while not operation.done:
            print("Waiting for video generation to complete...")
            time.sleep(10)
            operation = client.operations.get(operation)

        print("Video generated")

        video = operation.response.generated_videos[0]
        client.files.download(file=video.video)

        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        filename = f"veo3_{timestamp}.mp4"
        temp_video_path = os.path.join(tempfile.gettempdir(), filename)

        video.video.save(temp_video_path)

        return send_file(temp_video_path, as_attachment=True)
    except Exception as e:
        return jsonify({'error': str(e)}), 500


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
                    badges.append({
                        "id": f"{category}_{img_name}",
                        "name": img_name,
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

    with open(file_path, "wb") as f:
        f.write(image_data)

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
        
        file_path = os.path.join(BASE_DIR, category, filename)
        
        # Verify the file exists and is within BASE_DIR
        if not os.path.exists(file_path):
            return jsonify({"error": "Badge not found"}), 404
        
        # Additional security check
        real_path = os.path.realpath(file_path)
        real_base = os.path.realpath(BASE_DIR)
        if not real_path.startswith(real_base):
            return jsonify({"error": "Invalid path"}), 400
        
        os.remove(file_path)
        
        return jsonify({"message": "Badge deleted successfully"})
    except Exception as e:
        return jsonify({"error": f"Error deleting badge: {str(e)}"}), 500


if __name__ == '__main__':
    app.run(debug=True)
