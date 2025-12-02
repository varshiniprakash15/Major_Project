from flask import Flask, request, jsonify
from crop_and_soil_management import get_crop_and_soil_advice
from article import get_article_info

app = Flask(__name__)

@app.route("/crop-soil", methods=["GET"])
def crop_soil():
    crop = request.args.get("crop")
    soil = request.args.get("soil")
    advice = get_crop_and_soil_advice(crop, soil)
    return jsonify({"advice": advice})

@app.route("/article", methods=["GET"])
def article():
    topic = request.args.get("topic")
    article_info = get_article_info(topic)
    return jsonify({"article": article_info})

if __name__ == "__main__":
    app.run(port=5000)
