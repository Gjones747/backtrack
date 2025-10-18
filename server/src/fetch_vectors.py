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

# Query text to convert to an embedding. 
input_text = "going into the sea"

# Generate the vector embedding.
response = bedrock.invoke_model(
    modelId="amazon.titan-embed-text-v2:0",
    body=json.dumps({"inputText": input_text})
) 

# Extract embedding from response.
model_response = json.loads(response["body"].read())
embedding = model_response["embedding"]

# Query vector index.
response = s3vectors.query_vectors(
    vectorBucketName="tester",
    indexName="movies",
    queryVector={"float32": embedding}, 
    topK=3, 
    returnDistance=True,
    returnMetadata=True
)
print(json.dumps(response["vectors"][0], indent=2))

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
    