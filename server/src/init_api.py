import boto3
import json
import os
from dotenv import load_dotenv
from botocore.exceptions import ClientError
from PIL import Image
from transformers import CLIPProcessor, CLIPModel
import torch
import base64
import io
import hashlib

load_dotenv()

model_id = 'laion/CLIP-ViT-H-14-laion2B-s32B-b79K'
model = CLIPModel.from_pretrained(model_id)
processor = CLIPProcessor.from_pretrained(model_id, use_fast=True)

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


def upload_base64_image(base64_str, location="", description = "", contact_info = ""):
    try:
        # Decode base64 string into image
        image_data = base64.b64decode(base64_str, validate=True)
        image = Image.open(io.BytesIO(image_data))
        hash_value = hashlib.sha256(image_data).hexdigest()

        # Preprocess and get embedding
        inputs = processor(text=description, images=image, return_tensors="pt", padding=True)
        with torch.no_grad():
            image_features = model.get_image_features(**inputs)
        embedding = image_features[0].numpy()

        # Upload vector to S3 Vectors
        response = s3vectors.put_vectors(
            vectorBucketName="tester",
            indexName="database",
            vectors=[
                {
                    "key": hash_value,
                    "data": {"float32": embedding.tolist()},
                    "metadata": {"location": location, "description": description, "contact_info": contact_info, "image_data": base64_str}
                }
            ]
        )

        print(f"✅ Uploaded {hash_value} successfully.")
        return response

    except Exception as e:
        print(f"❌ Error uploading image: {e}")
        raise


