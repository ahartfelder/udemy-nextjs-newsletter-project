import { getDocuments, insertDocument } from "../../lib/mongodb";

export default async function handler(req, res) {
  const dbName = "newsletter";

  try {
    const { method, body } = req;

    if (method === "POST") {
      let { email } = body;

      if (!email || !email.includes("@")) {
        return res.status(422).json({ message: "Invalid email address!" });
      }

      // Verificar se o email já existe
      const existingUser = await getDocuments(dbName, "users", { email });
      if (existingUser.length) {
        return res.status(409).json({ message: "Email already exists!" });
      }

      const result = await insertDocument(dbName, "users", { email });
      return res.status(201).json({
        message: "Signed up!",
        user: { email, _id: result.insertedId },
      });
    }

    if (method === "GET") {
      const users = await getDocuments(dbName, "users");
      return res.status(200).json(users);
    }

    res.setHeader("Allow", ["POST", "GET"]);
    res.status(405).end(`Method ${method} Not Allowed`);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong!" });
  }
}
