export type AmplifyDependentResourcesAttributes = {
    "function": {
        "generatetreasurehunt": {
            "Name": "string",
            "Arn": "string",
            "Region": "string",
            "LambdaExecutionRole": "string"
        }
    },
    "auth": {
        "treasurehunt": {
            "IdentityPoolId": "string",
            "IdentityPoolName": "string",
            "UserPoolId": "string",
            "UserPoolArn": "string",
            "UserPoolName": "string",
            "AppClientIDWeb": "string",
            "AppClientID": "string"
        }
    },
    "api": {
        "treasurehunt": {
            "RootUrl": "string",
            "ApiName": "string",
            "ApiId": "string"
        }
    }
}