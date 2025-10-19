import boto3
import json
import os
from dotenv import load_dotenv
from botocore.exceptions import ClientError
from PIL import Image
from transformers import CLIPProcessor, CLIPModel
import torch
import base64
from io import BytesIO
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

def image_to_base64(img, format="JPEG"):
    """
    Convert a PIL Image object to a base64-encoded string.
    
    Args:
        img (PIL.Image): Image object.
        format (str): Image format for encoding (e.g., 'JPEG', 'PNG').
    
    Returns:
        str: Base64-encoded string of the image.
    """
    buffer = BytesIO()
    img.save(buffer, format="JPEG")
    buffer.seek(0)
    img_bytes = buffer.read()
    b64_string = base64.b64encode(img_bytes).decode('utf-8')
    return b64_string

def resize_image(img):
    """
    Resize an image to 50% of its original size and return the resized image and its resolution.
    
    Args:
        image_path (str): Path to the input image.
    
    Returns:
        tuple: (resized_image (PIL.Image), resolution (tuple of width, height))
    """
    # Open the image
    buffer = BytesIO()
    img.save(buffer, format="JPEG")
    size_kb = len(buffer.getvalue()) / 1024
    while(size_kb > 29):
        # Compute new size (50%)
        new_size = (img.width // 2, img.height // 2)
        
        # Resize image
        img = img.resize(new_size, resample=Image.Resampling.LANCZOS)

        buffer = BytesIO()
        img.save(buffer, format="JPEG")
        size_kb = len(buffer.getvalue()) / 1024
    
    # Return resized image and resolution
    return img

def upload_base64_image(base64_str, location="", description = "", contact_info = ""):
    try:
        # Decode base64 string into image
        # print("IMAGE PRE", len(base64_str))

        

        image_data = base64.b64decode(base64_str, validate=True)
        image = (Image.open(io.BytesIO(image_data)))
        image_new = resize_image(image)


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
                    "metadata": {"location": location, "description": description, "contact_info": contact_info, "image_data": image_to_base64(image_new)}
                }
            ]
        )

        print(f"✅ Uploaded {hash_value} successfully.")
        return response

    except Exception as e:
        print(f"❌ Error uploading image: {e}")
        raise


