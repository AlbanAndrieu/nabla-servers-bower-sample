# Runbook

Follow-ups of the stack upgrade (PR #666) that need a human: hardware, accounts
outside this repository, or a decision.

## 1. Push the branch

The push goes through SSH with a YubiKey (`ED25519-SK`) key, which needs a touch:

```bash
git push -u origin build/drop-spring-maven-frontend-20261111
```

PR #666 was squash-merged; `feat/semantic-release-upgrade-20261110` still holds
`78920dd`, already carried by this branch, so the remote branch can be deleted.

## 2. Revoke secrets left in the Git history

The files no longer contain them, the history still does.

| Secret | Where it was | Action |
| --- | --- | --- |
| Docker swarm join tokens | `docker/docker-swarm.sh` | `docker swarm join-token --rotate manager` and `--rotate worker` |
| Sonar login token | `Jenkinsfile-full` | Revoke it in SonarCloud > My Account > Security |
| npm token (commented line) | `.npmrc` | Revoke it on npmjs.com > Access Tokens |

The first MegaLinter report artifact of PR #666 holds an expired `GITHUB_TOKEN`; delete it:

```bash
gh api repos/AlbanAndrieu/nabla-servers-bower-sample/actions/artifacts --paginate \
  -q '.artifacts[] | select(.name|test("MegaLinter")) | "\(.id) \(.created_at)"'
gh api -X DELETE repos/AlbanAndrieu/nabla-servers-bower-sample/actions/artifacts/<id>
```

## 3. Dedicated Cloudflare Access token for the CI

`CF_ACCESS_CLIENT_ID` / `CF_ACCESS_CLIENT_SECRET` reuse the `fastapi-sample-monitor`
service token, which about 40 Access applications accept. In nabla-compose, create a
`nexus-ci` service token allowed on the Nexus application only, apply it with
`scripts/infra/terragrunt-safe.sh` after a reviewed plan, then reset both GitHub
secrets of this repository.

The nabla-compose commits `2eae8774`, `06e4ef15` and `2508f3aa` (Access policies
and GitHub secrets of this repository) only exist on the local branch
`fix/truenas-rollout-followup-20261110`: move them to a new branch and open a PR
once that checkout is free.

## 4. Workstation

- `node_modules/.cache` belongs to root, so `npm ci` (and `./mvnw package`) fails
  with `EACCES` in this checkout: `sudo rm -rf node_modules/.cache`.
- The global mise `npm` 12.2.0 fails on `npm install --package-lock-only`
  (`require() of ES Module ... http-proxy-agent`). Use the npm bundled with node
  (`mise unuse -g npm`) or regenerate the lock in `node:26-slim`.
- `.git/hooks/commit-msg` imports `colorama`, which `.venv` lacks:
  `.venv/bin/pip install colorama`.

## 5. Scheduled reviews

| Date | What |
| --- | --- |
| 2027-02-10 | `osv-scanner.toml`: minimatch ignore, check that eslint supports minimatch 11 |
| 2027-05-10 | `osv-scanner.toml`: AngularJS 1.8.3 end-of-life ignores |
| Next Jetty 12.1 release | Add the `dos` module back in the `Dockerfile` (broken in 12.1.15) |

## 6. Known CI behaviours

- `repo.maven.apache.org` answers 429 to GitHub runners: MegaLinter's osv-scanner
  reads Google's Maven Central mirror and trivy-sbom runs offline
  (`.mega-linter.yml`).
- FOSSA (`License Compliance`, `Security Analysis`, `Dependency Quality`) reports
  findings that are only visible on app.fossa.com; no check is required on `master`.
