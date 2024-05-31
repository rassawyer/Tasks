import { DefineWorkflow, Schema } from "deno-slack-sdk/mod.ts";
import { PostTaskRequest } from "../functions/post_task_request.ts";

/**
 * A workflow is a set of steps that are executed in order.
 * Each step in a workflow is a function.
 * https://api.slack.com/automation/workflows
 */
const SubmitTask = DefineWorkflow({
  callback_id: "submit_task",
  title: "Task",
  description: "Submit a Task to Robbie's Notion ToDo List",
  input_parameters: {
    properties: {
      interactivity: {
        type: Schema.slack.types.interactivity,
      },

      channel: {
        type: Schema.slack.types.channel_id,
      },
    },
    required: ["channel", "interactivity"],
  },
});

/**
 * For collecting input from users, we recommend the
 * built-in OpenForm function as a first step.
 * https://api.slack.com/automation/functions#open-a-form
 */

export const inputForm = SubmitTask.addStep(
  Schema.slack.functions.OpenForm,
  {
    title: "Submit a Task",
    interactivity: SubmitTask.inputs.interactivity,
    submit_label: "Submit",
    fields: {
      elements: [{
        name: "task",
        title: "Task to be done",
        type: Schema.types.string,
        long: false,
      }, {
        name: "priority",
        title: "Priority of task",
        type: Schema.types.string,
        enum: ["Low", "Medium", "High", "Nuclear"],
      }, {
        name: "Realm",
        title: "Realm of the task",
        type: Schema.types.string,
        enum: ["Integro", "TrueGeek", "Home", "Personal"],
      }, {
        name: "datePicker",
        title: "Due Date for the Task",
        type: Schema.slack.types.date,
      }, {
        name: "Additional_Details",
        title: "Additional Details",
        type: Schema.types.string,
        long: true,
      }],
      required: ["task"],
    },
  },
);

/**
 * Custom functions are reusable building blocks
 * of automation deployed to Slack infrastructure. They
 * accept inputs, perform calculations, and provide
 * outputs, just like typical programmatic functions.
 * https://api.slack.com/automation/functions/custom
 */

SubmitTask.addStep(
  PostTaskRequest,
  {
    task: inputForm.outputs.fields.task,
    priority: inputForm.outputs.fields.priority,
    realm: inputForm.outputs.fields.Realm,
    datePicker: inputForm.outputs.fields.datePicker,
    additionalDetails: inputForm.outputs.fields.Additional_Details,
  },
);

export default SubmitTask;
