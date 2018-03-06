#!/bin/bash -xv
TAG=LATEST_SUCCESSFULL
cd "${WORKSPACE}" || exit
DOESTAGEXISTCMD="git tag -l | grep $TAG"
eval "$DOESTAGEXISTCMD"
# shellcheck disable=SC2181
if [ $? -eq 0 ]; then
	git tag -d $TAG
	git push origin :$TAG
fi
git tag -a $TAG -m "Jenkins develop"
git push origin $TAG --force

#git fetch --prune origin +refs/tags/*:refs/tags/
git fetch --tags

#git show $TAG

#GIT_LATEST_SUCCESSFUL_COMMIT=$(git rev-parse --short $TAG)
GIT_LATEST_SUCCESSFUL_COMMIT=$(git rev-list -n 1 $TAG --abbrev-commit)
echo "GIT_LATEST_SUCCESSFUL_COMMIT= ${GIT_LATEST_SUCCESSFUL_COMMIT}"

#make version file
FILENAME=$TARGET_PROJECT"_VERSION.TXT"
echo "$JOB_NAME: BUILD: $BUILD_NUMBER SHA1:${GIT_LATEST_SUCCESSFUL_COMMIT}" > "${WORKSPACE}/${FILENAME}"
