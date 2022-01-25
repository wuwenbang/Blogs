## 1 Docker 初见

### 1.1 Docker 是什么

### 1.2.Docker 的三个概念

1. 镜像（Image）：类似于虚拟机中的镜像，是一个包含有文件系统的面向 Docker 引擎的只读模板。任何应用程序运行都需要环境，而镜像就是用来提供这种运行环境的。例如一个 Ubuntu 镜像就是一个包含 Ubuntu 操作系统环境的模板，同理在该镜像上装上 Apache 软件，就可以称为 Apache 镜像。
2. 容器（Container）：类似于一个轻量级的沙盒，可以将其看作一个极简的 Linux 系统环境（包括 root 权限、进程空间、用户空间和网络空间等），以及运行在其中的应用程序。Docker 引擎利用容器来运行、隔离各个应用。容器是镜像创建的应用实例，可以创建、启动、停止、删除容器，各个容器之间是是相互隔离的，互不影响。注意：镜像本身是只读的，容器从镜像启动时，Docker 在镜像的上层创建一个可写层，镜像本身不变。
3. 仓库（Repository）：类似于代码仓库，这里是镜像仓库，是 Docker 用来集中存放镜像文件的地方。注意与注册服务器（Registry）的区别：注册服务器是存放仓库的地方，一般会有多个仓库；而仓库是存放镜像的地方，一般每个仓库存放一类镜像，每个镜像利用 tag 进行区分，比如 Ubuntu 仓库存放有多个版本（12.04、14.04 等）的 Ubuntu 镜像。

![Docker Architecture](https://docs.docker.com/engine/images/architecture.svg)

### 1.3 Docker 安装

## 2 Docker 容器

### 2.1 容器 操作命令

#### 创建容器

首先让我们来创建一个新容器，创建容器的命令是：

```
docker run < image_name >
```

`image_name` 代表一个镜像名称，例如你可以创建一个 nginx 容器，就像这样：

```
docker run nginx
```

输入完成后，直接回车。如果系统中没有这个镜像，Docker 会自动去 Docker Hub 上拉取对应的镜像（最新版本）到本地，然后执行对应的 Shell 脚本，脚本会把镜像自动安装到 Docker 容器里，并最终启动对于的镜像服务（注意，这时候容器是在前台运行的）。

> Docker Hub 是 Docker 官方的镜像和社区，里边有很多开发者制作好的镜像，我们可以直接使用这些镜像。如果你有能力，也可以制作镜像，并上传到 Docker Hub。

#### 查看容器

创建完容器后，如果想查看这个容器的信息和状态，你可以再打开一个新的终端，然后可以使用下面的命令：

```
docker ps
```

然后你就可以看到如下信息：

```
CONTAINER ID   IMAGE     COMMAND                  CREATED         STATUS         PORTS     NAMES
4b2410514c51   nginx     "/docker-entrypoint.…"   8 seconds ago   Up 7 seconds   80/tcp    nice_ritchie
```

这些信息对应的含义如下表：
| 信息 | 含义 |
| ----------- | ----------- |
| CONTAINER ID | 容器对应的唯一 ID |
| IMAGE | 镜像名称 |
| COMMAND | 执行的相关命令 |
| CREATED | 创建的时间 |
| STATUS | 当前镜像的状态（Up 为运行中，Exited 为退出） |
| PORTS | 协议和端口 |
| NAMES | 容器的名称（不指定的话 Docker 会随机生成） |

#### 停止容器

如果你想停止掉一个正在运行的容器，可以使用下面的命令：

```
docker container stop <name or ID>
```

当容器停止后，再使用查看命令进行查看，你会发现没有任何容器。

```
docker container ls
```

这时候你要查看你所有容器，包含已经停止的容器，可以加一个-a,参数。

```
docker container ls -a
```
#### 删除容器

当我们停止容器之后，容器并没有删除，而只是停止掉了。这时候你可以使用下面的命令删除容器。

```
docker container rm <name or ID>
```

### 2.2 容器 attached 和 detached 模式

### 2.3 容器 交互模式

## 3 Docker 镜像

### 3.1 镜像 导入导出

### 3.2 镜像 Dockerfile 构筑镜像

### 3.3 镜像 Dockerhub 分享镜像

## 4 Dockerfile

### 4.1 Dockerfile FROM 指令

### 4.2 Dockerfile RUN 指令

### 4.3 Dockerfile 文件操作

### 4.4 Dockerfile ARG 与 ENV 指令

### 4.5 Dockerfile CMD 与 ENTRYPOINT 指令

## 5 Docker Compose

### 5.1 Docker Compose 介绍

### 5.2 Docker Compose 文件结构

### 5.3 Docker Compose 基础命令

### 5.4 Docker Compose 网络
