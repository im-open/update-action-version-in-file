# update-action-version-in-file

This action has been created and configured for [im-open's] needs.

This action looks for usages of a specified GitHub action so it can update each instance with the latest version. It will return the updated content as an output and it can optionally save the changes to disk.

## Index

- [Inputs](#inputs)
- [Outputs](#outputs)
- [Usage Examples](#usage-examples)
- [Contributing](#contributing)
  - [Recompiling](#recompiling)
  - [Incrementing the Version](#incrementing-the-version)
- [Code of Conduct](#code-of-conduct)
- [License](#license)

## Inputs

| Parameter         | Is Required | Default | Description                                                                                                                                                                                                                  |
| ----------------- | ----------- | ------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `file-to-update`  | true        |         | The name of the file that should be updated with the new action version.                                                                                                                                                     |
| `action-name`     | true        |         | The name of the action that will be updated in the specified file. Format should be `org/repo` and any nested directories if applicable.</br>&nbsp;&nbsp;• `im-open/is-actor-authorized`</br>&nbsp;&nbsp;• `actions/aws/ec2` |
| `version-prefix`  | false       | `v`     | The prefix the action uses in its versions, if applicable.                                                                                                                                                                         |
| `updated-version` | true        |         | The new action version to replace other instances with in the specified file.                                                                                                                                                |
| `save-file`       | false       | true    | Flag indicating whether the changes to the specified file should be saved. <br/>Accepts: `true or false`.                                                                                                                    |

## Outputs

| Output            | Description                                                                     |
| ----------------- | ------------------------------------------------------------------------------- |
| `updated-content` | A copy of the original file content that has been updated with the new version. |

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

      - name: Build
        run: npm run build

      - name: Update readme with latest version
        uses: im-open/update-action-version-in-file@v1.0.0
        with:
          file-to-update: './README.md'
          action-name: 'im-open/is-actor-authorized' # Can also include a nested directory if needed like: actions/aws/ec2
          updated-version: ${{ env.NEXT_VERSION }}

      - name: Commit and push any changes to current branch
        run: |
          if [[ "$(git status --porcelain)" != "" ]]; then
            echo "There are changes to commit"
            git config user.name github-actions
            git config user.email github-actions@github.com
            git add .
            git commit -m "Update readme with next version."
            git push
          else
            echo "There were no changes to commit"
          fi
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

# This step does not include the prefix 'v', so it does not match and will not be updated

- uses: im-open/is-actor-authorized@1.1.1  
  with:
  actor: ${{ github.actor }}
  authorized-actors: ['izep', 'rowon']
```

## Contributing

When creating new PRs please ensure:

1. For major or minor changes, at least one of the commit messages contains the appropriate `+semver:` keywords listed under [Incrementing the Version](#incrementing-the-version).
1. The action code does not contain sensitive information.

When a pull request is created, a workflow will run that will recompile the action and push a commit to the branch if the PR author has not done so. The usage examples in the README.md will also be updated with the next version if they have not been updated manually.

1. The action has been recompiled. See the [Recompiling](#recompiling-manually) section below for more details.
1. The `README.md` example has been updated with the new version. See [Incrementing the Version](#incrementing-the-version).
1. This should happen automatically with most pull requests as part of the build workflow.  There may be some instances where the bot does not have permission to push back to the branch though so these steps should be done manually on those branches.

### Recompiling Manually

If changes are made to the action's code in this repository, or its dependencies, the action can be re-compiled by running the following command:

```sh
# Installs dependencies and bundles the code
npm run build

# Bundle the code (if dependencies are already installed)
npm run bundle
```

These commands utilize [esbuild](https://esbuild.github.io/getting-started/#bundling-for-node) to bundle the action and
its dependencies into a single file located in the `dist` folder.

### Incrementing the Version

This action uses [git-version-lite] to examine commit messages to determine whether to perform a major, minor or patch increment on merge. The following table provides the fragment that should be included in a commit message to active different increment strategies.
| Increment Type | Commit Message Fragment |
| -------------- | ------------------------------------------- |
| major | +semver:breaking |
| major | +semver:major |
| minor | +semver:feature |
| minor | +semver:minor |
| patch | _default increment type, no comment needed_ |

## Code of Conduct

This project has adopted the [im-open's Code of Conduct](https://github.com/im-open/.github/blob/main/CODE_OF_CONDUCT.md).

## License

Copyright &copy; 2022, Extend Health, LLC. Code released under the [MIT license](LICENSE).

[git-version-lite]: https://github.com/im-open/git-version-lite
[im-open's]: https://github.com/im-open
