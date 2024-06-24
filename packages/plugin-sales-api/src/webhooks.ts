import { generateModels } from "./connectionResolver";
import { getBoardItemLink } from "./models/utils";

export default {
  actions: [
    {
      label: "Deal created",
      action: "create",
      type: "sales:deal"
    },
    {
      label: "Deal updated",
      action: "update",
      type: "sales:deal"
    },
    {
      label: "Deal deleted",
      action: "delete",
      type: "sales:deal"
    },
    {
      label: "Deal moved",
      action: "createBoardItemMovementLog",
      type: "sales:deal"
    },
    {
      label: "Purchase created",
      action: "create",
      type: "sales:purchase"
    },
    {
      label: "Purchase updated",
      action: "update",
      type: "sales:purchase"
    },
    {
      label: "Purchase deleted",
      action: "delete",
      type: "sales:purchase"
    },
    {
      label: "Purchase moved",
      action: "createBoardItemMovementLog",
      type: "sales:purchase"
    },
    {
      label: "Task created",
      action: "create",
      type: "sales:task"
    },
    {
      label: "Task updated",
      action: "update",
      type: "sales:task"
    },
    {
      label: "Task deleted",
      action: "delete",
      type: "sales:task"
    },
    {
      label: "Task moved",
      action: "createBoardItemMovementLog",
      type: "sales:task"
    },
    {
      label: "Ticket created",
      action: "create",
      type: "sales:ticket"
    },
    {
      label: "Ticket updated",
      action: "update",
      type: "sales:ticket"
    },
    {
      label: "Ticket deleted",
      action: "delete",
      type: "sales:ticket"
    },
    {
      label: "Ticket moved",
      action: "createBoardItemMovementLog",
      type: "sales:ticket"
    }
  ],
  getInfo: async ({
    subdomain,
    data: { data, contentType, actionText, action }
  }) => {
    const models = await generateModels(subdomain);

    if (action === "createBoardItemMovementLog") {
      return {
        content: `${contentType} with name ${
          data.data.item.name || ""
        } has moved from ${data.data.activityLogContent.text}`,
        url: data.data.link
      };
    }

    if (!["create", "update"].includes(action)) {
      return {
        content: `${contentType} ${actionText}`,
        url: ""
      };
    }

    const { object } = data;

    return {
      url: await getBoardItemLink(models, object.stageId, object._id),
      content: `${contentType} ${actionText}`
    };
  }
};
