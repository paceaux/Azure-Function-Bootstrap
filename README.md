# Azure-Bootstrap

This is a small starter project for building azure functions.

It includes:

1. A robust configuration architecture:
   - manage configurations in your app settings with `someThing-Specific` and get maps for accessing throughout the app
   - Ability to control configuration from app settings _or_ code
2. Loads of common utilities:
   - Http utilities for POST and GET
   - SAS token generation
   - time converters, a promiseified `delay`, async `forEach`
   - sql utility complete with stored procedure options
3. Promise-ified azure storage utilities for use with `async` /`await`
4. Application insights added and sprinkled through out
5. Two types of triggered functions
   - HttpTrigger
   - QueueTrigger
6. Code Quality
   - linter
   - unit tests

## Functions

This contains three functions:

- HttpTriggerInvokeProcedure
- HttpTriggerJob
- QueueTriggeredJob

### HttpTriggerJob

This accepts an http trigger. Code exists for using http to send a message to a queue.

Commented-out code shows sends a message to a queue. This is configured in `config/queues.config.js`.

#### How is it triggered?

This is triggered by an HTTP POST request. This is configured in `HttpTriggeredJob/function.json`. The in-bound binding is named `req`. The outbound binding is named `res`.

#### Input

The body of this http request is expected to be JSON.

#### Output

Add your documentation here

### QueueTriggerJob

This receives a message from a queue.

#### Input

Add your documentation here.

#### Output

Add your documentation here.

### HttpTriggerInvokeProcedure

This is a a function that can trigger a stored procedure.

#### Input

The body could look like this

```
{
  "callbackUrl": "somewhere.com"},
  "processInputParameters": {
    "outputBlobName": "data",
    "outputReportNames": "folder/file.json"
  },
  "processPlatform": "somePlatform"
}
```

#### Output

It will generate a SAS key to access the blob, and it will then trigger a stored procedure on the blob. It will return a `202` if successful.

```
{
  "processInputParameters": {
    "outputReportNames": "folder/file.json",
    "outputBlobName": "data"
  },
  "processPlatform": "somePlatform"
}
```

# Setup

## Prerequisites

- [Node.js](https://nodejs.org/en/download/releases/) 10+

- [Visual Studio Code](https://code.visualstudio.com/)

## IDE

1. Within Visual Studio Code, install the following extensions:

   - Azure Tools
   - Azure Logic Apps
   - Azure Functions

2. Install the [Azure CLI](https://docs.microsoft.com/en-us/cli/azure/install-azure-cli-windows?view=azure-cli-latest)
3. Within VS Code, open _this directory_ - **not** the parent folder. (If you set the parent folder as your workspace directory, it will try to install Azure Functions settings files)
4. Open a terminal in VS Code (ctrl + ` )
5. Install npm packages with `npm install`

## Debugging

1. Press `F5`. A debugging terminal will open
2. After the debugging terminal opens, it will display something like the following:

   > HttpTriggeredInvokeProcedure: [GET,POST] http://localhost:7071/api/HttpTriggeredInvokeProcedure
   > HttpTriggerJob: [GET,POST] http://localhost:7071/api/HttpTriggerJob

3) `ctrl + click` the link. Your default browser will open and the azure function will execute locally. You are now able to add any necessary breakpoints within the application.

_Note_
If you want to run .net core apps and this node.js azure function together, [you will need to change the ports](https://docs.microsoft.com/en-us/azure/azure-functions/functions-run-local#local-settings-file) in one of the two projects.

### local.settings.json

The following keys must have values in order to run the app locally:

- `AzureWebJobsStorage` OR `AZURE_STORAGE_CONNECTION_STRING`

You can acquire these values from a portal administrator or an existing function app. When the app runs, these are added to `process.env`.

## Deploying

User should be able to deploy from within VSCode. Click on the Azure button in the left side of the IDE screen. In the Functions pane, select an existing app, or create a new one to deploy to.

### Application settings

Application settings need to be added/updated in the azure portal.

1. Go to the function app in the portal.
2. Click "Function App Settings"
3. Click "manage application settings"

The following keys must be present and have values.

- `AzureWebJobsStorage`
- `sasAccessKey`
- `sqlPassword`
