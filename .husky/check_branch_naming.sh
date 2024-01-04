#!/usr/bin/env bash
local_branch_name="$(git status)"

if [[ $local_branch_name =~ 'cherry-picking' || $local_branch_name =~ 'merging' ]]; then
  exit 0
fi

local_branch_name="$(git rev-parse --abbrev-ref HEAD)"

# valid_branch_regex='^(hotfix\.\d+\.\d+(\.\d+)?|feature\.(?:new|bugfix|revamp|refactoring)\.\d+\.\d+(?:_\w+)?(\.\d+)?|release\.[a-zA-Z]+.\d{8}$)$'

message="There is something wrong with your branch name.\nBranch name must adhere to this contract:
\n\tfeature.<common_task>
\tor feature.new|bugfix|revamp|refactoring.<ParentTaskNo.TaskNo>
\tor feature.new|bugfix|revamp|refactoring.<parentTaskNo.taskNo>_<summary>
\tor feature.new|bugfix|revamp|refactoring.<EpicNo.StoryNo.DevTaskNo>
\tor hotfix.<ParentTaskNo.TaskNo>
\tor hotfix.<EpicNo.StoryNo.DevTaskNo>
\tor release.<Environment>.<YYYYMMDD>
\nYour commit is rejected. Please rename branch and try again.\n\n"

if [[ ! $local_branch_name =~ $valid_branch_regex ]]; then
    printf "$message"
    exit 1
fi

exit 0
