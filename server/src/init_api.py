import boto3
import json
import os
from dotenv import load_dotenv
from botocore.exceptions import ClientError
from PIL import Image
from transformers import CLIPProcessor, CLIPModel
import torch

load_dotenv()

model_id = 'laion/CLIP-ViT-H-14-laion2B-s32B-b79K'
model = CLIPModel.from_pretrained(model_id)
processor = CLIPProcessor.from_pretrained(model_id)

REGION = os.getenv("AWS_DEFAULT_REGION")
AWS_ACCESS_KEY_ID = os.getenv("AWS_ACCESS_KEY_ID")
AWS_SECRET_ACCESS_KEY = os.getenv("AWS_SECRET_ACCESS_KEY")

bedrock = boto3.client(
    "bedrock-runtime",
    aws_access_key_id=AWS_ACCESS_KEY_ID,
    aws_secret_access_key=AWS_SECRET_ACCESS_KEY,
    region_name=REGION
)

s3vectors = boto3.client(
    "s3vectors",
    aws_access_key_id=AWS_ACCESS_KEY_ID,
    aws_secret_access_key=AWS_SECRET_ACCESS_KEY,
    region_name=REGION
)

def load_and_preprocess_image(image_path):
    image = Image.open(image_path)
    return processor(text=None, images=image, return_tensors="pt", padding=True)

def get_image_embeddings(image_path):
    inputs = load_and_preprocess_image(image_path)
    with torch.no_grad():
        image_features = model.get_image_features(**inputs)
    return image_features[0].numpy()

def list_fruit_files_upload():
    files = os.listdir('fruits')
    vectors = []
    batch_size = 10
    for file in files:
        embedding = get_image_embeddings(f"fruits/{file}")
        vectors.append({
            "key": file,
            "data": {"float32": embedding.tolist()},
            "metadata": {"source_image_name": file, "genre": "fruits"}
        })
        if len(vectors) >= batch_size:
            s3vectors.put_vectors(
                vectorBucketName="tester",
                indexName="apples",
                vectors=vectors
            )
            vectors = []
    if vectors:
        s3vectors.put_vectors(
            vectorBucketName="tester",
            indexName="apples",
            vectors=vectors
        )

if __name__ == "__main__":
    list_fruit_files_upload()