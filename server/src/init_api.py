import boto3
import hashlib
import json
import os
from dotenv import load_dotenv
from botocore.exceptions import ClientError

load_dotenv()

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

vector_bucket = "back-track-vector-bucket"
index_name = "main"

texts = "A little boy named Andy loves to be in his room, playing with his toys, especially his doll named But, what do the toys do when Andy is not with them, they come to life. Woody believes that his life (as a toy) is good. However, he must worry about Andy's family moving, and what Woody does not know is about Andy's birthday party."

def makeEmbedding(input):
    response = bedrock.invoke_model(
        modelId="amazon.titan-embed-image-v1",
        body=json.dumps({
            "inputImage": input
        })
    )
    
    response_body = json.loads(response["body"].read())
    embedding = response_body["embedding"]
    print("Embedding length:", len(embedding))

    return embedding

def vectorToJson(embedding, description, location, contactInfo, imageData):

    imageData = imageData.encode()

    hashedValue = hashlib.sha256(imageData).hexdigest()

    vector = [{
        "key": hashedValue,
        "data": {"float32": embedding},
        "metadata": {"description": description, "location": location, "contact": contactInfo}
    }]
    return vector


def addVector(input, description, location, contactInfo):
    embedding = makeEmbedding(input)
    vector = vectorToJson(embedding, description, location, contactInfo, input)

    try:
        resp = s3vectors.put_vectors(
            vectorBucketName=vector_bucket,
            indexName=index_name,
            vectors=vector
        )
        print("PutVectors response:", resp)
    except ClientError as e:
        print("ClientError:", e)
        print("Response code:", e.response["Error"]["Code"])
        print("Message:", e.response["Error"]["Message"])
        raise

