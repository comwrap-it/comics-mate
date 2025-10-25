from flask import Flask, request, send_file, jsonify
import time
from google.genai import Client

app = Flask(__name__)
client = Client()

@app.route('/generate-video', methods=['POST'])
def generate_video():
    data = request.get_json()
    prompt = data.get('prompt')

    if not prompt:
        return jsonify({'error': 'Prompt is required'}), 400

    try:
        image = client.models.generate_content(
            model="gemini-2.5-flash-image",
            prompt=prompt,
        )

        operation = client.models.generate_videos(
            model="veo-3.1-generate-preview",
            prompt=prompt,
            image=image.generated_images[0].image,
        )

        while not operation.done:
            print("Waiting for video generation to complete...")
            time.sleep(10)
            operation = client.operations.get(operation)

        video = operation.response.generated_videos[0]
        client.files.download(file=video.video)
        video.video.save("veo3_with_image_input.mp4")

        return send_file("veo3_with_image_input.mp4", as_attachment=True)

    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)