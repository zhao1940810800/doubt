# /bin/zsh
# 确保脚本抛出遇到的错误
set -e
# 生成静态文件
# npm run build
# 进入生成的文件夹
# cd ./dist
git add -A
git commit -m $1
# git push 
# 把下面的push命令按照你的情况修改后去掉注释
# 如果发布到 https://<USERNAME>.github.io
# git push -f git@github.com:lambertlt/learn-english.git master
# 如果发布到 https://<USERNAME>.github.io/<REPO>
# git push -f git@github.com:<USERNAME>/<REPO>.git master:gh-pages
