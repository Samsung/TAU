# Contributing guidelines

If you have improvements to TAU, send us your pull requests! For those just getting started, Github has a [howto](https://help.github.com/articles/using-pull-requests/).

## Commit policy

We recommend that use a 1 commit for the pull request.

## Commit message

OptionalTag: One line title in imperative

[Issue] <https://github.com/Samsung/TAU/issues/NN>

[Problem] Multiline text containing problem description. It should describe how
issue occured, in which situation, how it differed from expected behaviour. Use
past tense regarding what happened before this commit message.

[Solution] Multiline text containing solution description. It should describe
how problem was fixed.

[Remarks] Optional section containing additional comments on change, its
connection to other repositories, announcement of forthcoming changes related
to issue, etc.

[Test] Optional section describing how to test change after applying it. 
Added if it deviates from currently documented test methods.

Signed-off-by: info added when `git commit` ran with `-s` option

## Coding styles

Project has defined eslint rules (.eslintrc.js)
We recommend to run "npx grunt eslint" before uploading a pull request.

## Contributing code

* **Use your own fork of TAU** repository in order to prepare pull request (PR).
* If you prepare PR which is **not ready for review** yet, please add **"in progress"** label
* If your PR is **ready for review**, plase add **"in review"** label
* Assign TAU Maintainers for each PR which is ready to review
* In order to assure review and verification of your PR, **one of reviewers should be put as "Assignees"**.
  You may assign Reviewer as "Assignee" after getting his agreement.

## Review policy for TAU Maintainers

* Check pending reviews periodically <https://github.com/pulls/review-requested>
* If you are assigned to PR as **"Assignee"** <https://github.com/pulls/assigned> you should review given PR and **verify it**

## TAU Maintainers

grzegorz-czajkowski
korneliakobiela
lslachciak
singa2000
DohyungLim
HunseopJeong
TomaszLukawskiSam

## Merging pull request

* PR can be merged by PR owner or TAU reviewer if at least one TAU Reviewer approved and verified it.
* TAU Reviewers can not approve their own PR.
* When merging **standard PR use "Rebase and merge"** option in order to have straight git history
* When merging changes between tau_* branches use "Create a merge commit" option in order to allow to synchronization between branches.
