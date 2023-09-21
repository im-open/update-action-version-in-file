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

const originalFileContent = fs.readFileSync(fileName, 'utf8');
const regexString = `${actionName}@${versionPrefix}([0-9]+)(\.[0-9]+)*(\.[0-9]+)*`;
const actionVersionRegex = new RegExp(regexString, 'ig');

const replacementValue = `${actionName}@${updatedVersion}`;

const updatedFileContent = originalFileContent.replace(actionVersionRegex, replacementValue);
const hasChanges = updatedFileContent != originalFileContent;

if (hasChanges) {
  core.info(`Version changes were detected in ${fileName}.`);
} else {
  core.info(`No version changes were detected in ${fileName}.`);
}

core.setOutput('has-changes', hasChanges);
core.setOutput('updated-content', updatedFileContent);

core.exportVariable('FILE_HAS_CHANGED', hasChanges);
core.exportVariable('UPDATED_CONTENT', updatedFileContent);
