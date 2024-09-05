import { describe, it, expect, beforeAll, afterAll } from "vitest";
import neo4j, { Driver, Session } from "neo4j-driver";
import { connectNeo4j } from "../lib/neo4j";
import { beforeEach } from "node:test";

describe("Neo4j Tests", () => {
  let driver: Driver;
  let session: Session;

  beforeAll(() => {
    const neo4jCon = connectNeo4j();
    driver = neo4jCon.driver;
    session = neo4jCon.session;
  });

  afterAll(async () => {
    await session.close();
    await driver.close();
  });

  beforeEach(async () => {
    if (session) await session.close();
    session = driver.session();
  });

  describe("Idempotent Queries", () => {
    it("should expect session to be defined", () => {
      expect(session).toBeDefined();
    });

    it("should connect to the database", async () => {
      const result = await session.run("RETURN 1 AS number;");
      expect(result.records.length).toBeGreaterThan(0);
      expect(result.records[0].get("number").toInt()).toBe(1);
    });

    it("should create single bookmark node", async () => {
      const query = `
        MERGE (s:Site { url: $url }) 
        SET s = { name: $name, url: $url }
        RETURN s;
      `;

      const res = await session.run(query, {
        name: "Github",
        url: "https://www.github.com",
      });

      const properties = res.records.map((record) => record.get(0).properties);
      expect(properties.length === 1, "should return one item");
      expect(properties[0].name).toBeDefined();
      expect(properties[0].url).toBeDefined();
    });

    it("should create multiple bookmark nodes", async () => {
      const query = `
          UNWIND $sites AS site
          MERGE (s:Site { url: site.url })
          SET s = { name: site.name, url: site.url }
          RETURN s;
        `;

      const sites = [
        { name: "Github", url: "https://www.github.com" },
        { name: "Stack Overflow", url: "https://stackoverflow.com" },
        { name: "MDN", url: "https://developer.mozilla.org" },
      ];

      const res = await session.run(query, { sites });

      const properties = res.records.map((record) => record.get(0).properties);

      // Assert that 3 nodes are created
      expect(properties.length).toBe(3);

      // Check if each site's name and URL are defined
      properties.forEach((site, index) => {
        expect(site.name).toBeDefined();
        expect(site.url).toBeDefined();
        expect(site.name).toBe(sites[index].name);
        expect(site.url).toBe(sites[index].url);
      });
    });

    it("should update existing node with the same URL or create new one", async () => {
      const query = `
            MERGE (s:Site { url: $url })
            SET s = { url: $url, name: $name }     
            RETURN s;
        `;

      const newName = "Github - Home";
      const res = await session.run(query, {
        name: newName,
        url: "https://www.github.com",
      });

      const properties = res.records.map((record) => record.get(0).properties);
      expect(properties.length === 1, "should return one item");
      expect(properties[0].name).toBe(newName);
      expect(properties[0].url).toBe("https://www.github.com");

      const searchQuery = `
        MATCH (n:Site) 
        WHERE n.url = $url
        RETURN n;
      `;

      const searchRes = await session.run(searchQuery, {
        url: "https://www.github.com",
      });

      const searchProps = searchRes.records.map(
        (record) => record.get(0).properties
      );

      expect(searchProps.length).toBe(1);
      expect(searchProps[0].name).toBe(newName);
    });
  });
});
