import neo4j from "neo4j-driver";

export const connectNeo4j = () => {
  const databaseUrl = "bolt://localhost:7687";
  const driver = neo4j.driver(databaseUrl);
  const session = driver.session();
  return { driver, session };
};
