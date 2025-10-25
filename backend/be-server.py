import logging

from flask import Flask, request, send_file, jsonify
from datetime import datetime

from flask_cors import CORS
from google.genai.types import Image
import base64
import tempfile
import time
import os
from google.genai import Client

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


if __name__ == '__main__':
    app.run(debug=True)
