import dotenv from "dotenv";

dotenv.config();

export const getLimitOffset = (page?: any, recordsPerPage?: any) => {
  // Calculating limit
  const limit = parseInt(recordsPerPage || process.env.DEFAULT_LIMIT) || 10;

  // Caluclating offset
  let offset = 0;
  page = parseInt(page);
  if (page > 1) offset = (page - 1) * limit;

  return { limit, offset };
};
