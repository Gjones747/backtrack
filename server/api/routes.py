from contextlib import nullcontext
from os import wait
from flask import Blueprint, request, jsonify
from src.fetch_vectors import query_by_text

main = Blueprint('main', __name__)

@main.route("/")
def home():
    return "/ endpoint"

@main.route("/addVector", methods=["POST"])
def addVectorEndpoint():

    """

    request shape for adding to vector store

    {
        "image": "base64encoded image",
        "location": "",
        "description": "",
        "contact": "",
    }                         

    """

    try:
        requestData = request.get_json(force=False)
        if requestData is None:
            return jsonify({"error": "Invalid or missing JSON body"}), 400
    except:
        return jsonify({"error": "Malformed JSON syntax"}), 400

    required_fields = ["image", "location", "description", "contact"]
    missing_fields = [f for f in required_fields if f not in requestData]

    if missing_fields:
        return jsonify({
            "error": "Missing required fields",
            "missing": missing_fields
        }), 400

    if not isinstance(requestData["image"], str):
        return jsonify({"error": "Field 'image' must be a base64 string"}), 400

    imageData = requestData["image"]
    locationData = requestData["location"]
    description = requestData["description"]
    contact = requestData["contact"]

    # call add vector command

    return jsonify({"message": "Vector added successfully"}), 200



@main.route("/getVector", methods=["GET"])
def getVectorEndpoint():
    if 'type' not in request.args:
        return jsonify({"error": "Missing required parameter: type"}), 400

    if "data" not in request.args:
        return jsonify({"error": "Missing required parameter: data"}), 400

    type = request.args.get("type")
    data = request.args.get("data")

    if type == "description":
        results = query_by_text(data)
        return results

    return ""
