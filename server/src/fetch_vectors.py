# Query a vector index with an embedding from Amazon Titan Text Embeddings V2.
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

def getVectors(description):              

    response = bedrock.invoke_model(
        modelId="amazon.titan-embed-text-v2:0",
        body=json.dumps({"inputText": description})
    ) 

    model_response = json.loads(response["body"].read())
    embedding = model_response["embedding"]

    response = s3vectors.query_vectors(
        vectorBucketName="back-track-vector-bucket",
        indexName="main",
        queryVector={"float32": embedding}, 
        topK=3, 
        returnDistance=True,
        returnMetadata=True
    )
    return json.dumps(response["vectors"])

# # Query vector index with a metadata filter.
# response = s3vectors.query_vectors(
#     vectorBucketName="tester",
#     indexName="movies",
#     queryVector={"float32": embedding}, 
#     topK=3, 
#     filter={"genre": "scifi"},
#     returnDistance=True,
#     returnMetadata=True
# )
# [0]
    
