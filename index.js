const express = require("express");
const { fetchLeetCodeData } = require("./leetcodeService");

const app = express();
const PORT = 5555;

app.get("/leetcode/:username", async (req, res) => {
  const username = req.params.username;

  try {
    const data = await fetchLeetCodeData(username);
    res.json(data);
  } catch (error) {
    console.error("Error fetching Leetcode data", error);
    res.status(500).json({ status: "error", message: "something went wrong" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
