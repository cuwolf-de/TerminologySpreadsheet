#!/bin/bash
# You can run this script as
#    gitAddNPush.sh
# Then it will automatically generate a commit message
# or you append a commit message directly
#    gitAddNPush.sh "Message"

git add --all
if [ $# -eq 1 ]; then
   git commit -m "$1"
else
   now=`date`
   git commit -m "tmp_test__${now}"
fi
git push