import { Client } from "https://deno.land/x/notion_sdk/src/mod.ts";

export async function NotionFunction(
  task: string,
  priority: string | undefined,
  realm: string | undefined,
  datePicker: string | undefined,
  additionalDetails: string | undefined,
  notionToken: string,
  notionDB: string,
) {
  // Initializing a client
  const notion = new Client({
    auth: notionToken,
  });

  if (!priority) {
    priority = "Not Set";
  }
  if (!realm) {
    realm = "Uncategorized";
  }

  if (!additionalDetails) {
    additionalDetails = "";
  }
  if (datePicker) {
    await notion.pages.create({
      "parent": {
        "type": "database_id",
        "database_id": notionDB,
      },
      "properties": {
        "Name": {
          "title": [
            {
              "text": {
                "content": task,
              },
            },
          ],
        },
        "Realm": {
          "select": {
            "name": realm,
          },
        },
        "Additional Details": {
          "rich_text": [{
            "text": {
              "content": additionalDetails,
            },
          }],
        },
        "Priority": {
          "select": {
            "name": priority,
          },
        },
        "Due Date": {
          "date": { start: datePicker },
        },
        "Submitted Date": {
          "date": { start: new Date().toISOString().substring(0, 10) },
        },
      },
    });
  } else {
    await notion.pages.create({
      "parent": {
        "type": "database_id",
        "database_id": notionDB,
      },
      "properties": {
        "Name": {
          "title": [
            {
              "text": {
                "content": task,
              },
            },
          ],
        },
        "Realm": {
          "select": {
            "name": realm,
          },
        },
        "Additional Details": {
          "rich_text": [{
            "text": {
              "content": additionalDetails,
            },
          }],
        },
        "Priority": {
          "select": {
            "name": priority,
          },
        },

        "Submitted Date": {
          "date": { start: new Date().toISOString().substring(0, 10) },
        },
      },
    });
  }
}
