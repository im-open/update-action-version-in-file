# update-action-version-in-file

This action has been created and configured for [im-open's] needs.

This action looks for usages of a specified GitHub action so it can update each instance with the latest version. It will return the updated content as an output and it can optionally save the changes to disk.

## Index <!-- omit in toc -->

- [Inputs](#inputs)
- [Outputs](#outputs)
- [Usage Examples](#usage-examples)
- [Contributing](#contributing)
  - [Recompiling](#recompiling-manually)
  - [Incrementing the Version](#incrementing-the-version)
- [Code of Conduct](#code-of-conduct)
- [License](#license)

## Inputs

| Parameter         | Is Required | Default | Description                                                                                                                                                                                                                  |
|-------------------|-------------|---------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `file-to-update`  | true        |         | The name of the file that should be updated with the new action version.                                                                                                                                                     |
| `action-name`     | true        |         | The name of the action that will be updated in the specified file. Format should be `org/repo` and any nested directories if applicable.</br>&nbsp;&nbsp;• `im-open/is-actor-authorized`</br>&nbsp;&nbsp;• `actions/aws/ec2` |
| `version-prefix`  | false       | `v`     | The prefix the action uses in its versions, if applicable.                                                                                                                                                                   |
| `updated-version` | true        |         | The new action version to replace other instances with in the specified file.                                                                                                                                                |
| `save-file`       | false       | true    | Flag indicating whether the changes to the specified file should be saved. <br/>Accepts: `true or false`.                                                                                                                    |

## Outputs and Environment Variables

| Output                    | Description                                                                         |
|---------------------------|-------------------------------------------------------------------------------------|
| `outputs.updated-content` | A copy of the original file content that has been updated with the new version.     |
| `outputs.has-changes`     | Flag indicating whether or not version changes were detected in the specified file. |
| `env.UPDATED_CONTENT`     | A copy of the original file content that has been updated with the new version.     |
| `env.FILE_HAS_CHANGED`    | Flag indicating whether or not version changes were detected in the specified file. |

## Usage Examples

### Original README.md for the `is-actor-authorized` action before modification

```md
# is-actor-authorized

This action checks if users are authorized!

How to use:

- uses: im-open/is-actor-authorized@v1
  with:
  actor: ${{ github.actor }}
  authorized-actors: ['bob-the-builder', 'potato', 'QA-boy']

- uses: im-open/is-actor-authorized@v1.10.999
  with:
  actor: ${{ github.actor }}
  authorized-actors: ['CookieMonster83', 'BabyYoda', 'FrecklesBiggestFan']

# This step does not include the prefix 'v', so it does not match and will not be updated
- uses: im-open/is-actor-authorized@1.1.1  
  with:
  actor: ${{ github.actor }}
  authorized-actors: ['izep', 'rowon']
```

### Using this action in a build workflow to update `is-actor-authorized`'s README.md

```yml
jobs:
  build:
    runs-on: ubuntu-20.04
    steps:
      - uses: actions/checkout@v3

      # Do something real (like git-version-lite) to figure
      # out the next version...for the sake of the example:
      - run: |
          echo "CURRENT_VERSION=v1.10.999" >> $GITHUB_ENV
          echo "NEXT_VERSION=v2.0.0" >> $GITHUB_ENV

      - run: npm run build

      - name: Update readme with latest version
        # You may also reference just the major or major.minor version.
        uses: im-open/update-action-version-in-file@v1.1.1
        id: version-readme
        with:
          file-to-update: './README.md'
          action-name: 'im-open/is-actor-authorized' # Can also include a nested directory if needed like: actions/aws/ec2
          updated-version: ${{ env.NEXT_VERSION }}

      - name: Commit and push any changes to current branch
        if: steps.version-readme.outputs.has-changes
        run: |
          echo "There are changes to commit"
          git config user.name github-actions
          git config user.email github-actions@github.com
          git add .
          git commit -m "Update readme with next version."
          git push
```

### Updated README.md content after running `update-action-version-in-file`

```md
# is-actor-authorized

This action checks if users are authorized!

How to use:

- uses: im-open/is-actor-authorized@v2.0.0
  with:
  actor: ${{ github.actor }}
  authorized-actors: ['bob-the-builder', 'potato', 'QA-boy']

- uses: im-open/is-actor-authorized@v2.0.0
  with:
  actor: ${{ github.actor }}
  authorized-actors: ['CookieMonster83', 'BabyYoda', 'FrecklesBiggestFan']

# This step does not include the prefix 'v', so it did not match and was not updated
- uses: im-open/is-actor-authorized@1.1.1  
  with:
  actor: ${{ github.actor }}
  authorized-actors: ['izep', 'rowon']
```

## Contributing

When creating PRs, please review the following guidelines:

- [ ] The action code does not contain sensitive information.
- [ ] At least one of the commit messages contains the appropriate `+semver:` keywords listed under [Incrementing the Version] for major and minor increments.
- [ ] The action has been recompiled.  See [Recompiling Manually] for details.
- [ ] The README.md has been updated with the latest version of the action.  See [Updating the README.md] for details.

### Incrementing the Version

This repo uses [git-version-lite] in its workflows to examine commit messages to determine whether to perform a major, minor or patch increment on merge if [source code] changes have been made.  The following table provides the fragment that should be included in a commit message to active different increment strategies.

| Increment Type | Commit Message Fragment                     |
|----------------|---------------------------------------------|
| major          | +semver:breaking                            |
| major          | +semver:major                               |
| minor          | +semver:feature                             |
| minor          | +semver:minor                               |
| patch          | *default increment type, no comment needed* |

### Source Code Changes

The files and directories that are considered source code are listed in the `files-with-code` and `dirs-with-code` arguments in both the [build-and-review-pr] and [increment-version-on-merge] workflows.  

If a PR contains source code changes, the README.md should be updated with the latest action version and the action should be recompiled.  The [build-and-review-pr] workflow will ensure these steps are performed when they are required.  The workflow will provide instructions for completing these steps if the PR Author does not initially complete them.

If a PR consists solely of non-source code changes like changes to the `README.md` or workflows under `./.github/workflows`, version updates and recompiles do not need to be performed.

### Recompiling Manually

This command utilizes [esbuild] to bundle the action and its dependencies into a single file located in the `dist` folder.  If changes are made to the action's [source code], the action must be recompiled by running the following command:

```sh
# Installs dependencies and bundles the code
npm run build
```

### Updating the README.md

If changes are made to the action's [source code], the [usage examples] section of this file should be updated with the next version of the action.  Each instance of this action should be updated.  This helps users know what the latest tag is without having to navigate to the Tags page of the repository.  See [Incrementing the Version] for details on how to determine what the next version will be or consult the first workflow run for the PR which will also calculate the next version.

## Code of Conduct

This project has adopted the [im-open's Code of Conduct](https://github.com/im-open/.github/blob/main/CODE_OF_CONDUCT.md).

## License

Copyright &copy; 2023, Extend Health, LLC. Code released under the [MIT license](LICENSE).

<!-- Links -->
[Incrementing the Version]: #incrementing-the-version
[Recompiling Manually]: #recompiling-manually
[Updating the README.md]: #updating-the-readmemd
[source code]: #source-code-changes
[usage examples]: #usage-examples
[build-and-review-pr]: ./.github/workflows/build-and-review-pr.yml
[increment-version-on-merge]: ./.github/workflows/increment-version-on-merge.yml
[esbuild]: https://esbuild.github.io/getting-started/#bundling-for-node
[git-version-lite]: https://github.com/im-open/git-version-lite
[im-open's]: https://github.com/im-open
