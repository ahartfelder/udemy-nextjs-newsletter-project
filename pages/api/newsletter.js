import clientPromise from "../../lib/mongodb";

export default async function handler(req, res) {
  try {
    const client = await clientPromise;
    const db = client.db("newsletter");
    const collection = db.collection("users");

    const { method, body } = req;

    if (method === "POST") {
      let { email } = body;

      if (!email || !email.includes("@")) {
        return res.status(422).json({ message: "Invalid email address!" });
      }

      // Verificar se o email já existe
      const existingUser = await collection.findOne({ email });

      if (existingUser) {
        return res.status(409).json({ message: "Email already exists!" });
      }

      const result = await collection.insertOne({ email });
      console.log("Inserted:", result);
      return res.status(201).json({ message: "Signed up!" });
    }

    if (method === "GET") {
      const users = await collection.find({}).toArray();
      console.log(users);
      return res.status(200).json(users);
    }

    res.setHeader("Allow", ["POST", "GET"]);
    res.status(405).end(`Method ${method} Not Allowed`);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong!" });
  }
}
