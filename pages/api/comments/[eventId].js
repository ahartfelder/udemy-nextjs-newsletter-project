import { getDocuments, insertDocument } from "../../../lib/mongodb";

export default async function handler(req, res) {
  const dbName = "newsletter";

  try {
    const { method, query, body } = req;
    const { eventId } = query;

    if (method === "POST") {
      const { email, name, text } = body;

      const existingUser = await getDocuments(dbName, "users", { email });
      if (!existingUser.length) {
        return res
          .status(404)
          .json({ message: "User not registered", comment: null });
      }

      if (
        !email ||
        email.trim() === "" ||
        !email.includes("@") ||
        !name ||
        name.trim() === "" ||
        !text ||
        text.trim() === ""
      ) {
        return res.status(422).json({ message: "Invalid input!" });
      }

      const comment = {
        email,
        name,
        text,
        eventId,
      };

      const result = await insertDocument(dbName, "comments", comment);

      return res.status(201).json({
        message: "Comment posted!",
        comment: {
          ...comment,
          _id: result.insertedId,
        },
      });
    } else if (method === "GET") {
      const comments = await getDocuments(
        dbName,
        "comments",
        { eventId },
        { _id: -1 }
      );
      return res.status(200).json(comments);
    }

    res.setHeader("Allow", ["GET", "POST"]);
    res.status(405).end(`Method ${method} not allowed!`);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong!" });
  }
}
