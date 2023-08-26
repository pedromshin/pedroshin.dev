import envs from "@Envs";
import { Client } from "@notionhq/client";

export default new Client({ auth: envs.NOTION_API_KEY });
