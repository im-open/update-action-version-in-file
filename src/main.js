const core = require('@actions/core');

// When used, this requiredArgOptions will cause the action to error if a value has not been provided.
const requiredArgOptions = {
  required: true,
  trimWhitespace: true
};

const fs = require('fs');

const fileName = core.getInput('file-to-update', requiredArgOptions);
const actionName = core.getInput('action-name', requiredArgOptions);

const versionPrefixInput = core.getInput('version-prefix', requiredArgOptions);
const versionPrefix = versionPrefixInput == 'none' ? '' : versionPrefixInput;

const updatedVersion = core.getInput('updated-version', requiredArgOptions);
const saveFile = core.getBooleanInput('save-file', requiredArgOptions);

const rawFileContent = fs.readFileSync(fileName, 'utf8');
const regexString = `${actionName}@${versionPrefix}([0-9]+)(\.[0-9]+)*(\.[0-9]+)*`;
const actionVersionRegex = new RegExp(regexString, 'ig');

const replacementValue = `${actionName}@${updatedVersion}`;

const updatedFileContent = rawFileContent.replace(actionVersionRegex, replacementValue);
if (saveFile) {
  fs.writeFileSync(fileName, updatedFileContent);
}

core.setOutput('updated-content', updatedFileContent);
