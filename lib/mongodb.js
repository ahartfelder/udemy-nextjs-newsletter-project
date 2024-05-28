import { MongoClient } from "mongodb";

const URL = process.env.MONGODB_URL;
let client;
let clientPromise;

if (!URL) {
  throw new Error("Please add your Mongo URI to .env.local");
}

if (process.env.NODE_ENV === "development") {
  // In development mode, use a global variable so the client is not recreated on each change
  if (!global._mongoClientPromise) {
    client = new MongoClient(URL);
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  // In production mode, it's best to not use a global variable
  client = new MongoClient(URL);
  clientPromise = client.connect();
}

async function getCollection(dbName, collectionName) {
  const client = await clientPromise;
  const db = client.db(dbName);
  return db.collection(collectionName);
}

async function insertDocument(dbName, collectionName, document) {
  const collection = await getCollection(dbName, collectionName);
  return collection.insertOne(document);
}

async function getDocuments(dbName, collectionName, filter = {}, sort = {}) {
  const collection = await getCollection(dbName, collectionName);
  return collection.find(filter).sort(sort).toArray();
}

export { insertDocument, getDocuments };
