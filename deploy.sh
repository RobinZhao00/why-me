#!/bin/bash

# 进度条显示函数
show_spinner() {
    local pid=$!
    local spinstr='|/-\\'
    local i=0
    while kill -0 $pid 2>/dev/null; do
        i=$(((i + 1) % 4))
        printf "\r[%c] Running..." "${spinstr:i:1}"
        sleep .1
    done
    printf "\r[✔] Done\n"
}

# 部署项目函数
deploy_project() {
    # 获取传入的 Git 仓库地址
    REPO_URL=$1
    # 判断是否启用 -t 选项
    if [ "$USE_T_MODE" == "true" ]; then
        ROOT_DIR="/Users/zhaoyu/WorkSpace/var/www"
    else
        ROOT_DIR="/root"
    fi

    # 从 Git 仓库 URL 提取项目名称
    PROJECT_NAME=$(basename "$REPO_URL" .git)

    # 检查是否成功提取项目名称
    if [ -z "$PROJECT_NAME" ]; then
        echo "Failed to extract project name from Git URL!"
        return 1
    fi

    # 判断项目是否已经存在
    if [ -d "$ROOT_DIR/$PROJECT_NAME" ]; then
        # 项目已存在，强制拉取最新代码
        echo "Project $PROJECT_NAME already exists, pulling latest changes from the remote branch..."
        cd "$ROOT_DIR/$PROJECT_NAME" || {
            echo "Failed to access project directory!"
            exit 1
        }

        # 获取远程分支并更新
        git fetch --all || {
            echo "Git fetch failed!"
            exit 1
        }

        # 获取当前的主分支名称
        BRANCH_NAME=$(git rev-parse --abbrev-ref HEAD)

        # 强制重置到远程分支
        git reset --hard "origin/$BRANCH_NAME" || {
            echo "Git reset failed!"
            exit 1
        }
    else
        # 项目不存在，执行克隆操作
        echo "Cloning repository $REPO_URL into $ROOT_DIR/$PROJECT_NAME..."
        git clone $REPO_URL "$ROOT_DIR/$PROJECT_NAME" || {
            echo "Git clone failed!"
            exit 1
        }
    fi

    # 第二步：创建构建目录
    echo "Creating build directory $ROOT_DIR/$PROJECT_NAME-build..."
    mkdir -p "$ROOT_DIR/$PROJECT_NAME-build" || {
        echo "Failed to create build directory!"
        exit 1
    }

    # 第三步：进入项目目录并运行 npm run build
    echo "Running npm run build in $ROOT_DIR/$PROJECT_NAME..."
    cd "$ROOT_DIR/$PROJECT_NAME" || {
        echo "Project directory not found!"
        exit 1
    }
    npm install || {
        echo "npm install failed!"
        exit 1
    }

    # 在后台运行构建命令并显示进度条
    npm run build &
    show_spinner

    # 第四步：复制构建产物
    echo "Copying build artifacts to $ROOT_DIR/$PROJECT_NAME-build..."
    # 定义可能的构建目录路径
    BUILD_DIRS=(
        "$ROOT_DIR/$PROJECT_NAME/frontend/dist"
        "$ROOT_DIR/$PROJECT_NAME/dist"
        "$ROOT_DIR/$PROJECT_NAME/frontend/build"
        "$ROOT_DIR/$PROJECT_NAME/build"
    )

    # 遍历每个路径，找到存在的并复制文件
    for dir in "${BUILD_DIRS[@]}"; do
        if [ -d "$dir" ]; then
            cp -rf "$dir/." "/usr/share/nginx/html/$PROJECT_NAME/"
            echo "Copied build files from $dir"
            break
        fi
    done

    # 如果没有找到任何构建目录，打印错误信息并退出
    if [ ! -d "$ROOT_DIR/$PROJECT_NAME-build" ]; then
        echo "No dist or build directory found in project!"
        exit 1
    fi

      # 第五步：复制 nginx 配置文件
      echo "Copying Nginx config file to /etc/nginx/conf.d/"
      if [ -f "$ROOT_DIR/$PROJECT_NAME/$PROJECT_NAME.conf" ]; then
        cp -rf "$ROOT_DIR/$PROJECT_NAME/$PROJECT_NAME.conf" /etc/nginx/conf.d/
      else
        echo "Nginx config file $PROJECT_NAME.conf not found!"
      fi

      # 完成
      echo "Deployment completed successfully!"

      # 重新加载 Nginx 配置
      sudo nginx -s reload || { echo "Failed to reload Nginx!"; exit 1; }
}

# 解析命令行参数
USE_T_MODE="false"
while getopts ":t" opt; do
    case $opt in
    t)
        USE_T_MODE="true"
        ;;
    \?)
        echo "Usage: $0 [-t] <Git repository URL>"
        exit 1
        ;;
    esac
done

# 跳过已处理的参数，获取 Git 仓库 URL
shift $((OPTIND - 1))

# 检查是否传入 Git 仓库 URL
if [ -z "$1" ]; then
    echo "Usage: $0 [-t] <Git repository URL>"
    exit 1
fi

# 调用部署项目函数
deploy_project "$1"


#  /etc/nginx/conf.d/latteai.conf
# /usr/local/bin/deploy_project