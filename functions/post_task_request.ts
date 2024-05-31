import { DefineFunction, Schema } from "deno-slack-sdk/mod.ts";
import { SlackFunction } from "deno-slack-sdk/mod.ts";
import { NotionFunction } from "./notion_requests.ts";

/**
 * Functions are reusable building blocks of automation that accept
 * inputs, perform calculations, and provide outputs. Functions can
 * be used independently or as steps in workflows.
 * https://api.slack.com/automation/functions/custom
 */
export const PostTaskRequest = DefineFunction({
  callback_id: "post_task",
  title: "Post a Task to Robbie's Notion ToDo List",
  description: "Create a Task from submitted form",
  source_file: "functions/post_task_request.ts",
  input_parameters: {
    properties: {
      task: {
        type: Schema.types.string,
        description: "Description of the task",
      },
      priority: {
        type: Schema.types.string,
        description: "priority of the task",
      },
      realm: {
        type: Schema.types.string,
        description: "Realm",
      },
      datePicker: {
        type: Schema.types.string,
        description: "The due date for the task",
      },
      additionalDetails: {
        type: Schema.types.string,
        description: "Any additional details",
      },
    },
    required: ["task"],
  },
  output_parameters: {
    properties: {
      channel: {
        type: Schema.slack.types.channel_id,
      },
      submitting_user: {
        type: Schema.slack.types.user_id,
      },
      task: {
        type: Schema.types.string,
        description: "Description of the task",
      },
      priority: {
        type: Schema.types.string,
        description: "priority of the task",
      },
      realm: {
        type: Schema.types.string,
        description: "Realm",
      },
      datePicker: {
        type: Schema.types.string,
        description: "The due date for the task",
      },
      additionalDetails: {
        type: Schema.types.string,
        description: "Additional Details",
      },
    },
    required: ["task"],
  },
});

/**
 * SlackFunction takes in two arguments: the CustomFunction
 * definition (see above), as well as a function that contains
 * handler logic that's run when the function is executed.
 * https://api.slack.com/automation/functions/custom
 */
export default SlackFunction(
  PostTaskRequest,
  async ({ inputs, env }) => {
    const {
      task,
      priority,
      realm,
      datePicker,
      additionalDetails,
    } = inputs;
    console.log(task, priority, realm, additionalDetails);
    await NotionFunction(
      task,
      priority,
      realm,
      datePicker,
      additionalDetails,
      env.Notion_Token,
      env.Notion_DB,
    );

    // // Return all inputs as outputs for consumption in subsequent functions
    return {
      outputs: {
        task,
        priority,
        realm,
        datePicker,
        additionalDetails,
      },
    };
  },
);
