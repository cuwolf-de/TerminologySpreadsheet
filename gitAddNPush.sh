#!/bin/bash
git add --all
now=`date`
git commit -m "tmp_test__${now}"
git push