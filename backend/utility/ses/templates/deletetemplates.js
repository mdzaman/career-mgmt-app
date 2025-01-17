const { SESClient, ListTemplatesCommand, DeleteTemplateCommand } = require("@aws-sdk/client-ses");

// Initialize SES client in the wrong region (us-east-1)
const sesClient = new SESClient({ region: "us-east-1" });

const deleteAllTemplates = async () => {
  try {
    // Step 1: List all templates
    const listCommand = new ListTemplatesCommand({});
    const listResponse = await sesClient.send(listCommand);

    const templates = listResponse.TemplatesMetadata || [];

    // Step 2: Delete each template
    for (const template of templates) {
      const templateName = template.Name;
      const deleteCommand = new DeleteTemplateCommand({ TemplateName: templateName });
      await sesClient.send(deleteCommand);
    }

  } catch (err) {
    console.error("Error deleting templates:", err.message);
  }
};

deleteAllTemplates();
