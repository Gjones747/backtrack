import AWS from "aws-sdk";
import { Client } from "@opensearch-project/opensearch";
import dotenv from "dotenv";
import fs from "fs";

dotenv.config();

/** ---------- 1. CONFIG ---------- **/
const s3 = new AWS.S3({
  region: process.env.AWS_REGION,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

const osClient = new Client({
  node: process.env.OPENSEARCH_URL,
  auth: {
    username: process.env.OPENSEARCH_USER,
    password: process.env.OPENSEARCH_PASS,
  },
});

const bucket = process.env.S3_BUCKET;
const indexName = "vector-demo";

/** ---------- 2. CREATE INDEX WITH VECTOR FIELD ---------- **/
async function createIndex() {
  const exists = await osClient.indices.exists({ index: indexName });
  if (exists.body) {
    console.log(`Index '${indexName}' already exists`);
    return;
  }

  await osClient.indices.create({
    index: indexName,
    body: {
      settings: {
        index: {
          knn: true, // enable vector search
        },
      },
      mappings: {
        properties: {
          vector: {
            type: "knn_vector",
            dimension: 3, // adjust to match your embedding size
          },
          s3_key: { type: "keyword" },
        },
      },
    },
  });

  console.log(`✅ Index '${indexName}' created`);
}

/** ---------- 3. UPLOAD FILE TO S3 ---------- **/
async function uploadFileToS3(filePath) {
  const fileContent = fs.readFileSync(filePath);
  const key = `uploads/${Date.now()}-${filePath}`;

  await s3
    .putObject({
      Bucket: bucket,
      Key: key,
      Body: fileContent,
    })
    .promise();

  console.log(`✅ Uploaded file to S3: ${key}`);
  return key;
}

/** ---------- 4. INDEX VECTOR IN OPENSEARCH ---------- **/
async function indexVector(vector, s3Key) {
  await osClient.index({
    index: indexName,
    body: {
      vector,
      s3_key: s3Key,
    },
  });

  await osClient.indices.refresh({ index: indexName });
  console.log(`✅ Indexed vector for ${s3Key}`);
}

/** ---------- 5. VECTOR SEARCH ---------- **/
async function searchVector(queryVector, k = 1) {
  const result = await osClient.search({
    index: indexName,
    body: {
      knn: {
        field: "vector",
        query_vector: queryVector,
        k,
        num_candidates: 10,
      },
    },
  });

  const hits = result.body.hits.hits;
  if (hits.length === 0) {
    console.log("No matches found.");
    return [];
  }

  console.log(`🔍 Found ${hits.length} match(es):`);
  hits.forEach((hit, i) => {
    console.log(`#${i + 1}`, hit._source.s3_key, "score:", hit._score);
  });

  return hits.map((hit) => hit._source.s3_key);
}

/** ---------- 6. DOWNLOAD FROM S3 ---------- **/
async function downloadFromS3(key, destPath) {
  const data = await s3
    .getObject({
      Bucket: bucket,
      Key: key,
    })
    .promise();

  fs.writeFileSync(destPath, data.Body);
  console.log(`📥 Downloaded file to: ${destPath}`);
}

/** ---------- 7. DEMO WORKFLOW ---------- **/
(async () => {
  await createIndex();

  // STEP 1: upload a file to S3
  const s3Key = await uploadFileToS3("./sample.txt");

  // STEP 2: create a fake embedding vector (replace with real model later)
  const fakeVector = [0.1, 0.5, 0.9];

  // STEP 3: index in OpenSearch
  await indexVector(fakeVector, s3Key);

  // STEP 4: search by vector
  const matches = await searchVector([0.1, 0.52, 0.88]);

  // STEP 5: retrieve top match from S3
  if (matches.length > 0) {
    await downloadFromS3(matches[0], "./downloaded_sample.txt");
  }
})();
