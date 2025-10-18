import boto3
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

vector_bucket = "tester"
index_name = "movies"

texts = [
    "Star Wars: A farm boy …",
    "Jurassic Park: Scientists create dinosaurs …",
    "Finding Nemo: A father fish searches the ocean …"
]

embeddings = []
for text in texts:
    response = bedrock.invoke_model(
        modelId="amazon.titan-embed-text-v2:0",
        body=json.dumps({"inputText": text})
    )
    response_body = json.loads(response["body"].read())
    embedding = response_body["embedding"]
    print("Embedding length:", len(embedding))
    embeddings.append(embedding)

vectors_to_put = [
    {
        "key": "Star Wars",
        "data": {"float32": embeddings[0]},
        "metadata": {"source_text": texts[0], "genre": "scifi"}
    },
    {
        "key": "Jurassic Park",
        "data": {"float32": embeddings[1]},
        "metadata": {"source_text": texts[1], "genre": "scifi"}
    },
    {
        "key": "Finding Nemo",
        "data": {"float32": embeddings[2]},
        "metadata": {"source_text": texts[2], "genre": "family"}
    },
]

try:
    resp = s3vectors.put_vectors(
        vectorBucketName=vector_bucket,
        indexName=index_name,
        vectors=vectors_to_put
    )
    print("PutVectors response:", resp)
except ClientError as e:
    print("ClientError:", e)
    print("Response code:", e.response["Error"]["Code"])
    print("Message:", e.response["Error"]["Message"])
    raise
