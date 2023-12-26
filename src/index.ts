import app from "./app";

const port = process.env.PORT || 9000;

app.listen(port, () => {
  console.log(`Server is running of port ${port}`);
});
