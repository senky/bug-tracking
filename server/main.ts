import app from "./app.ts";
import { CsvAdapter } from "./storage-adapters/csv/csv-adapter.ts";

const PORT = process.env.PORT || 3000;

app(new CsvAdapter()).listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
