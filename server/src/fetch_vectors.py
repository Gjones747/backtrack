import boto3 
import json 
from dotenv import load_dotenv
from PIL import Image
from transformers import CLIPProcessor, CLIPModel
import torch
import os

load_dotenv()

input_file = "new_inputapple.jpg"

model_id = 'laion/CLIP-ViT-H-14-laion2B-s32B-b79K'
model = CLIPModel.from_pretrained(model_id)
processor = CLIPProcessor.from_pretrained(model_id, use_fast=True)

REGION = os.getenv("AWS_DEFAULT_REGION")
AWS_ACCESS_KEY_ID = os.getenv("AWS_ACCESS_KEY_ID")
AWS_SECRET_ACCESS_KEY = os.getenv("AWS_SECRET_ACCESS_KEY")

s3vectors = boto3.client(
    "s3vectors",
    aws_access_key_id=AWS_ACCESS_KEY_ID,
    aws_secret_access_key=AWS_SECRET_ACCESS_KEY,
    region_name=REGION
)

# ---- Image Embedding ----
def load_and_preprocess_image(image_path):
    image = Image.open(image_path)
    return processor(text=None, images=image, return_tensors="pt", padding=True)

def get_image_embeddings(image_path):
    inputs = load_and_preprocess_image(image_path)
    with torch.no_grad():
        image_features = model.get_image_features(**inputs)
    return image_features[0].numpy()

# ---- Text Embedding ----
def get_text_embeddings(text):
    inputs = processor(text=[text], images=None, return_tensors="pt", padding=True)
    with torch.no_grad():
        text_features = model.get_text_features(**inputs)
    return text_features[0].numpy()

# ---- Query Methods ----
def query_by_image(image_path, top_k=3):
    embedding = get_image_embeddings(image_path)
    response = s3vectors.query_vectors(
        vectorBucketName="tester",
        indexName="apples",
        queryVector={"float32": embedding.tolist()},
        topK=top_k,
        returnDistance=True,
        returnMetadata=True
    )
    print(json.dumps(response["vectors"], indent=2))

def query_by_text(query_text, top_k=3):
    embedding = get_text_embeddings(query_text)
    response = s3vectors.query_vectors(
        vectorBucketName="tester",
        indexName="apples",
        queryVector={"float32": embedding.tolist()},
        topK=top_k,
        returnDistance=True,
        returnMetadata=True
    )
    print(json.dumps(response["vectors"], indent=2))

# ---- Example usage ----
if __name__ == "__main__":
    # print("🔍 Searching by image:")
    # query_by_image(input_file)

    print("\n🔍 Searching by text ('red apple'):")
    x = input("WHAT DO YOU WANT TO SEARCH FOR: ")
    query_by_text(x)
