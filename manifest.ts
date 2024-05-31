import { Manifest } from "deno-slack-sdk/mod.ts";
import SubmitTask from "./workflows/submit_task.ts";
import { PostTaskRequest } from "./functions/post_task_request.ts";

/**
 * The app manifest contains the app's configuration. This
 * file defines attributes like app name and description.
 * https://api.slack.com/automation/manifest
 */
export default Manifest({
  name: "Task",
  displayName: "Tasks",
  description:
    "A basic workflow that enables users to submit a Task to my Notion To Do List",
  icon: "assets/app_icon.png",
  workflows: [SubmitTask],
  outgoingDomains: ["api.notion.com"],
  botScopes: ["commands"],
  functions: [PostTaskRequest],
});
