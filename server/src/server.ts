import express, { Response, Request } from "express";

const app = express();

const port = process.env.PORT || 5000;

app.get("/api/files", (req: Request, res: Response) => {
  res.json({
    data: [],
  });
});

app.listen(port, () => {
  console.log(`App is running on port ${port}`);
});
