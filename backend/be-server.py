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


BASE_DIR = r"C:\Users\c.valore\projects\CSC\images"


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

    filename = f"badge_{int(os.path.getmtime(BASE_DIR))}.png"
    file_path = os.path.join(category_path, filename)

    with open(file_path, "wb") as f:
        f.write(image_data)

    return jsonify({"message": "Badge saved", "file": filename})


@app.route("/static/<category>/<filename>")
def serve_image(category, filename):
    return send_from_directory(os.path.join(BASE_DIR, category), filename)


if __name__ == '__main__':
    app.run(debug=True)
