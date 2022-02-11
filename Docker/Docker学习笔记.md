## 1 Docker 初见

### 1.1 Docker 是什么

- Docker 可以理解成一个超轻量级的虚拟机，专业的说法叫应用**容器**，它是在 LCX（linux 容器）基础上进行的封装。
- Docker 和传统虚拟化方式的不同之处在于容器是在操作系统层面上实现虚拟化，直接复用本地主机的操作系统，而传统方式则是在硬件层面实现。
- 相较于传统的 VM 虚拟化方法，Docker 的好处是启动速度快，资源利用率高，性能开销小。

### 1.2.Docker 的三个概念

1. 镜像（Image）：**Docker 镜像** 是一个特殊的文件系统，除了提供容器运行时所需的程序、库、资源、配置等文件外，还包含了一些为运行时准备的一些配置参数（如匿名卷、环境变量、用户等）。镜像 不包含 任何动态数据，其内容在构建之后也不会被改变。
2. 容器（Container）：Docker **镜像** 和 **容器** 的关系，就像是面向对象程序设计中的 **类** 和 **实例** 一样，镜像是静态的定义，容器是镜像运行时的实体。容器可以被创建、启动、停止、删除、暂停等。容器的实质是进程，但与直接在宿主执行的进程不同，容器进程运行于属于自己的独立的 **命名空间**。因此容器可以拥有自己的 root 文件系统、自己的网络配置、自己的进程空间，甚至自己的用户 ID 空间。
3. 仓库（Repository）：类似于代码仓库，这里是镜像仓库，是 Docker 用来集中存放镜像文件的地方。注意与注册服务器（Registry）的区别：注册服务器是存放仓库的地方，一般会有多个仓库；而仓库是存放镜像的地方，一般每个仓库存放一类镜像，每个镜像利用 tag 进行区分，比如 Ubuntu 仓库存放有多个版本（12.04、14.04 等）的 Ubuntu 镜像。

![Docker Architecture](https://docs.docker.com/engine/images/architecture.svg)

### 1.3 Docker 安装

不同系统的 Docker 安装方法可以直接参考 Docker 官方安装教程：[https://docs.docker.com/get-docker/](https://docs.docker.com/get-docker/)

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

| 信息         | 含义                                         |
| ------------ | -------------------------------------------- |
| CONTAINER ID | 容器对应的唯一 ID                            |
| IMAGE        | 镜像名称                                     |
| COMMAND      | 执行的相关命令                               |
| CREATED      | 创建的时间                                   |
| STATUS       | 当前镜像的状态（Up 为运行中，Exited 为退出） |
| PORTS        | 协议和端口                                   |
| NAMES        | 容器的名称（不指定的话 Docker 会随机生成）   |

#### 停止容器

如果你想停止掉一个正在运行的容器，可以使用下面的命令：

```
docker stop <container_id>
```

当容器停止后，再使用查看命令进行查看，你会发现没有任何容器。

```
docker ps
```

这是因为普通的 `ps` 指令只会查看正在运行的容器，这时候你要查看你所有容器，包含已经停止的容器，可以加一个 `-a` 参数。

```
docker ps -a
```

#### 删除容器

当我们停止容器之后，容器并没有删除，而只是停止掉了。这时候你可以使用下面的命令删除容器。

```
docker rm <container_id>
```

正在运行的容器是无法直接删除的，你可以是强制删除指令进行删除：

```
docker rm -f <container_id>
```

### 2.2 容器 attached 和 detached 模式

两种模式最简单的对比理解就是：`attached` 模式在**前台运行**`，detached` 模式在**后台运行**。

#### attached 模式

我们现在先用 Docker 创建一个 Nginx 容器，并把它映射在服务器的 80 端口，运行如下命令：

```
docker run nginx
```

这个时候你会发现你的命令行（Terminal）上打印出了相关的日志（log）。也就是说 Docker 容器的日志会实时的展现到窗口并且占用此端口。这种模式叫做 `attached` 模式。

如果这时候你按 Ctrl+C ，就会停止掉 Docker 服务。也就是在 Linux 上你的操作命令，会直接传递给 Docker 容器。这个缺点就是很容易误操作，你随便 Ctrl+C 一下整个服务就崩掉了。

所以我们需要一个更好的，更稳定的模式。也就是 `detached` 模式。`attached` 模式更适用于容器和程序的调试阶段。

#### detached 模式

`detached` 模式的开启方法，就是加一个参数 `-d` 或者 `--detach`。

```
docker run -d nginx
```

这次你会看到，和 `attached` 模式不同的是，这次输入完命令后，只显示出了容器的编号，并且可以再输入任何命令。就算我们关掉窗口，容器依然运行，也就是他是在系统后台进行运行的。我们可以通过输入命令 `docker ps` 查看，发现刚刚启动的 Nginx 服务正在后台运行中。

这种就比较适合在生产环境中运行，停掉和删除容器都需要使用 Shell 脚本的形式。减少了很多误操作。

如果你想在 `detached` 模式下查看日志，你可以使用以下命令：

```
docker container logs <container_id>
```

#### detached 模式转换 attached 模式

在运行之后，也有需要调试的时候，Docker 提供了两个模式间的转换。比如现在要把 `detached` 模式的容器，改为 `attached` 模式。我们可以输入一下命令：

```
docker logs <container_id>
```

虽然日志在窗口中出现了，但只打印一次 logs，如果想动态一直跟踪日志，可以在命令上加入一个 `-f`。

```
docker logs -f <container_id>
```

#### Docker 端口映射

如果想在浏览器上访问刚刚启动的 Nginx 服务，我们就需要做端口映射，在开启端口映射之前，你首先要之道 Docker 对应的容器端口是多少。比如 Nginx 镜像的端口是 80。知道这个端口后，就可以在启动容器的时候，用`-p <port:port>` 的形式，启用映射了。

```
docker run -p 80:80 nginx
```

等待项目启动后，打开浏览器窗口，在地址栏输入 127.0.0.1 或 localhost（默认指向 80 端口），就可以打开 Nginx 的默认网址。

第一个端口是映射到服务器本机的端口; 第二个端口是 Docker 容器使用的端口。 比如你想把 Docker 的 80 端口，映射到服务器的 90 端口。

```
docker container run -p 90:80 nginx
```

### 2.3 容器 交互模式

有时候容器的镜像不是简单的一个服务，而是需要交互的操作系统。例如创建一个 Ubuntu 系统，然后需要到系统里输入各种 Shell 命令和系统进行交互。这时候 attached 模式和 detached 模式就不能满足要求了。需要使用交互模式。

#### 使用 Ubuntu 镜像并开启交互模式

```
docker run -it ubuntu sh
```

`-it` 代表启用交互模式，`sh` 代表可以使用 Shell 脚本。当你输入玩这个脚本后，Docker 就会进入到交互模式。可以使用 `ls` 来得到目录下的文件。

这时候你想退出容器和交互模式可以输入 `exit` 命令。需要重点说明的是，随着命令退出后，容器也会跟着退出，变成 `Exited` 模式。

#### detached 模式下的交互

如果我们想退出交互，但是并不想停止容器。可以先开启 detached 模式，然后通过命令进入交互模式。

先用 `detached` 模式创建一个 nginx 镜像的容器。

```
docker run -d -p 80:80 nginx
```

然后直接通过下面的命令就可以进入到交互模式下了（这是我们以后要经常使用的一个命令）。

```
docker exec -it <container_id> sh

```

`exec` 是执行的意思，`-it `交互模式， `sh` 交互的方式，用 shell 脚本进行交互。
整个命令的意思是：用 shell 脚本的方式执行交互模式。

进入后可以使用 `ls` 来查看容器的文件系统。

这种模式的优点是，再使用 exit（或者 Ctrl+D）退出后，服务并不会停止，而只是退出了交互模式。可以自己尝试一下退出，然后使用 `docker container ls -a` 来查看一下容器的状态，你会发现依然是 `up` 状态。

## 3 Docker 镜像

镜像是 Docker 里最重要的一个知识点，如果你只会创建容器和使用官方的镜像，并不能算是 Docker 的高手或者是专业选手，只能说会使用 Docker。而制作镜像文件，并让广大网友使用，才是每个 Docker 人的追求。

### 3.1 镜像 基本操作

#### 获取镜像的三种方式

1. 从网络社区直接拉取，在 Docker 里这种社区叫做 Registry（登记处）。
2. 从 Dockerfile 构建一个镜像，这种像是 DIY 一个镜像，但是整个构建过程是需要联网，因为需要西在基础镜像，然后根据基础镜像进行构建（build from Dockerfile）。
3. 自有文件的导入，可以从本地导入已经构建好的镜像文件，在没有网络的时候可以用。这个文件是通过 已有的镜像导出来的压缩包，然后就可以进行使用了。

#### 镜像社区（Image registry）

镜像社区也叫做 Image registry（镜像登记处），是拉取和下载镜像的网站，你也可以通过 Dockerfile 制作镜像，让所有人使用，类似 Docker Image 专属的简单版 GitHub。

- dockerhub：网址- https://hub.docker.com/ ,Docker 官方社区，在使用 Docker 时默认的拉取网站。

#### 拉取镜像

我们先尝试从 Dockerhub 上拉取 nginx 镜像：

```bash
docker image pull nginx
# 可以简写为：
docker pull nginx
```

如果是第一次拉取镜像，则需要下载很多依赖的基础镜像。具体快慢会和网速有关。这里给出第一次拉取 nginx 的日志信息。

```bash
% docker pull nginx
Using default tag: latest
latest: Pulling from library/nginx
5eb5b503b376: Pull complete
1ae07ab881bd: Pull complete
78091884b7be: Pull complete
091c283c6a66: Pull complete
55de5851019b: Pull complete
b559bad762be: Pull complete
Digest: sha256:2834dc507516af02784808c5f48b7cbe38b8ed5d0f4837f16e78d00deb7e7767
Status: Downloaded newer image for nginx:latest
docker.io/library/nginx:latest

```

上面命令的第二行 tag 的意思就是版本,latest 代表的是最新版。因为这里并没有给版本号，你可以加入版本号进行下载的。到 dockerhub 上可以找到对应的版本号。比如我们要下载 wordpress 1.20 版本，就可以输入下面的命令。

```bash
docker pull nginx:1.20
```

#### 查看镜像

- 查看镜像列表

```bash
docker image ls
```

通过这条命令就可以查看 Docker 中有的镜像和相关信息。

- 查看具体镜像信息

```bash
docker image inspech <image_id>
```

通过这条命令就可以查看具体某个镜像的详细信息。

#### 删除镜像

- 删除单个镜像

```bash
docker image rm <image_id>
```

需要注意的是，当有容器在使用镜像时，是没有办法被删除的。即使容器是停止掉的，依然是没办法删除的。

- 删除所有未被容器使用的镜像

```bash
docker image prune -a
```

prune（修剪） 命令用来删除不再使用的 docker 对象。

#### 导出镜像

```bash
docker image save
```

在导出之前，你最好到一个好找的路径下面（比如 Desktop 目录），使用 mkdir 命令创建一个文件夹，进入文件后输入下面的命令。比如现在要导出镜像中的 nginx 镜像，可以这样写命令。

```bash
docker image save nginx:latest -o my_nginx.image
```

解读上面的命令：`save` 是导出/保存的意思，`nginx:latest` 是镜像名称+版本号， `-o` 代表输出，`my_nginx.image` 是导出后镜像的名字。

命令执行完成后，可以看到在执行命令所在的目录下就会多出一个 `my_nginx.image` 的文件，这就是刚才导出的镜像了。

#### 导入镜像

先删除掉本机已有的 `nginx` 镜像。

```bash
docker image rm nginx
```

删除后直接导入镜像。

```bash
docker image load -i .\my_nginx.image
```

执行完命令之后，再使用 `docker image ls` 命令查看，`nginx` 镜像已经回来了。

### 3.2 镜像 Dockerfile 构筑镜像

#### 初识 Dockerfile

已经讲了两种获取 Docker 镜像的方式，第一种是直接从 Registry 中拉去，第二种是自己导入导出镜像。接下来是第三种获得镜像的方法：通过 `Dockerfile` 来 DIY 制作镜像。

通过 Dockerfile 构建镜像虽然比较麻烦，这是最常使用的一种方式，必须掌握。它的知识点非常多，后期准备专门出一篇文章来讲解这个 Dockerfile 的使用、语法和注意问题。

什么是 Dockerfile ？

> Dockerfile 是一个包含用于组合映像的命令的文本文档。可以使用在命令行中调用任何命令。 Docker 通过读取 Dockerfile 中的指令自动生成映像。

可以简单总结为下面三点：

- Dockerfile 是用于构建 `docker镜像` 的文件。
- Dockerfile 里包含了构建镜像所需的**指令**。
- Dockerfile 有其特定的**语法规则**（重要学习）。

#### 第一个 Dockerfile Demo

有这样一个需求：制作一个镜像。镜像拥有一个 `nodejs` 环境，然后在系统上运行 `hello.js` 程序。JS 程序的内容非常简单，只要打印出 `Hello Docker!`，就可以了。这个需求可以分为一下几个步骤去实现：

1. 第一步，下载一个 Node 环境。
2. 第二步，准备 `hello.js` 文件。我们可以在 `Desktop` 目录下新建一个 `DockerTest` 文件夹，然后在文件夹中新建一个 `hello.js` 文件，然后编写下面的文件。

```js
console.log('Hello Docker!');
```

3. 第三步，运行 `hello.js`。

```bash
node hello.js
Hello Docker!
```

有了以上的步骤，我们就可以开始编写 `Dockerfile` 文件了：

```dockerfile
FROM node
ADD hello.js /
CMD ["node","hello.js"]
```

这算是最简单的一个 `Dockerfile` 文件的编写，有了这个文件之后，就可以通过 `Dockerfile` 来构建一个镜像了。

当有了 `Dockerfile` 和 `hello.js` 文件以后，通过命令行进入 `DockerTest` 文件夹。通过 Docker 命令就可以完成镜像的构建：

```bash
docker image build -t <name:tag> <file_path>
```

例如现在要通过已经写好的 `Dockerfile`，构建一个 `hello` 的镜像，就可以使用下面的命令构建。

```bash
docker image build -t hello .
```

（注意命令最后是有一个`.`的），如果你是第一次执行打包，这个过程还是需要 2-3 分钟的，当出现 `FINISHED` 后，说明打包完成了。

打包完成后，可以通过 `docker image ls` 命令来查看现在拥有的镜像列表。如果一切正常，你应该可以看到名字为 `hello` 的镜像已经存在了。

可以执行容器，验证一下自己 DIY 的镜像是否可用。

```bash
docker run node

```

镜像如果正常，应该正确现实出 `Hello Docker` 字样，然后就直接退出容器了。这是跟我们写的 `Dockerfile` 有关的。

### 3.3 镜像 Dockerhub 分享镜像

这一章节我们要把镜像 `push` 到 `dockerhub` 上去，这样就可以让所有人进行使用了。想要分享镜像，需要做到一下几步：

第一步，申请了一个账号，例如账号名为 `prayx` ，所以在点开 `Profile` 时是没有任何镜像的。

第二步，如果你想上传属于自己的镜像，需要遵守社区规则，就是 `用户ID/镜像名称`。可以最简单的方法，就是重新 build 一个镜像，镜像名称符合社区规则就可以了。

```bash
docker image build -t prayx/hello .
```

这时候就会生成一下新的镜像，但是 `Image ID` 是一摸一样的。

也可以通过 `docker image tag` 命令，具体语法如下：

```bash
docker image tag <old_image_name> <new_iamge_name>

```

例如把 hello 这个镜像，改为 prayx/hello 镜像,命令可以如下：

```bash
docker image tag hello prayx/hello
```

在推送前，需要先登录 Dockerhub 账号,登录命令如下：

```bash
docker login
```

执行命令好，会要求输入 `Username`，也就你 `Dockerhub ID`，还需要输入密码。如果输入正确，并出现 `Login Succeeded` 就证明登录成功了。

```bash
docker image push Name[:TAG]
```

比如就是把刚才的 `prayx/hello` 镜像 `push` 到社区，就可以使用下面的命令。

```bash
docker image push prayx/hello
```

输入完命令，就会给我们进行 `push` 到 `Dockerhub` 上了。这时候你可以到 `Dockerhub` 的 `profile` 页面，刷新一下，就可以看到刚刚 `push` 上去的镜像。

## 4 Dockerfile

### 4.1 Dockerfile FROM 指令

还记得上一章节，我们写的 Dockerfile 文件吗？

```dockerfile
FROM node
ADD hello.js /
CMD ["node","hello.js"]
```

第一句就是 `FROM node`，它的意思是选择一个基础镜像，我这里选择的是带最新版本 Node 的 Linux 系统。等价于 `FROM node:latest`。如果想选择固定版本的只需要在`:`后面加上版本号：`FROM node:16`。

使用 `Dockerfile` 定制镜像，就需要是以一个镜像为基础，在其上进行定制。就像我们之前运行了一个 `node` 镜像的容器，再进行修改一样，基础镜像是必须指定的。而 `FROM` 就是指定 基础镜像，因此一个 `Dockerfile` 中 `FROM` 是必备的指令，并且必须是第一条指令。
在 `Docker Hub` 上有非常多的高质量的官方镜像，有可以直接拿来使用的服务类的镜像，如 `nginx`、`redis`、`mongo`、`mysql`、`httpd`、`php`、`tomcat` 等；也有一些方便开发、构建、运行各种语言应用的镜像，如` node`、`openjdk`、`python`、`ruby`、`golang` 等。可以在其中寻找一个最符合我们最终目标的镜像为基础镜像进行定制。
如果没有找到对应服务的镜像，官方镜像中还提供了一些更为基础的操作系统镜像，如 `ubuntu`、`debian`、`centos`、`alpine` 等，这些操作系统的软件库为我们提供了更广阔的扩展空间。
除了选择现有镜像为基础镜像外，Docker 还存在一个特殊的镜像，名为 `scratch`。这个镜像是虚拟的概念，并不实际存在，它表示一个空白的镜像。如果你以 `scratch` 为基础镜像的话，意味着你不以任何镜像为基础，接下来所写的指令将作为镜像第一层开始存在。

```Dockerfile
FROM scratch
...
```

#### 选择基础镜像的三个原则

1. 官方镜像优于非官方的镜像。
2. 固定版本的 Tag，而不是每次都使用 latest。
3. 功能满足的前提下，选择体积小的镜像。

### 4.2 Dockerfile RUN 指令

`RUN` 是 Dockerfile 中一个重要的指令，它可以执行 `Shell` 指令，包括下载文件、安装软件、配置环境.....都是可以的。

例如我们先选定 `Ubuntu` 作为我们基础镜像，纯净的 `Ubuntu` 系统是没有 `ipinfo` 命令的，在安装完系统后，都会安装 `ipinfo` 命令。步骤如下：

```bash
$ apt-get update
$ apt-get install wget
$ wget https://github.com/ipinfo/cli/releases/download/ipinfo-2.0.1/ipinfo_2.0.1_linux_amd64.tar.gz
$ tar zxf ipinfo_2.0.1_linux_amd64.tar.gz
$ mv ipinfo_2.0.1_linux_amd64 /usr/bin/ipinfo
$ rm -rf ipinfo_2.0.1_linux_amd64.tar.gz
```

> 上面这段代码需要你会一些 Linux 的基本操作，其实就是安装，解压和删除下载文件的一个过程。

#### 不建议的 Dockerfile 写法

如果用 `RUN` 命令来编写，直接可以写成下面的样子。

```Dockerfile
FROM ubuntu:latest
RUN apt-get update
RUN apt-get install -y wget
RUN wget https://github.com/ipinfo/cli/releases/download/ipinfo-2.0.1/ipinfo_2.0.1_linux_amd64.tar.gz
RUN tar zxf ipinfo_2.0.1_linux_amd64.tar.gz
RUN mv ipinfo_2.0.1_linux_amd64 /usr/bin/ipinfo
RUN rm -rf ipinfo_2.0.1_linux_amd64.tar.gz
```

Dockerfile 中每一个指令都会建立一层（image layer），`RUN` 也不例外。每一个 `RUN` 的行为，就和刚才我们手工建立镜像的过程一样：新建立一层，在其上执行这些命令，执行结束后，`commit` 这一层的修改，构成新的镜像。

上面的这种写法，创建了 6 层镜像。这是完全没有意义的，而且很多运行时不需要的东西，都被装进了镜像里，比如编译环境、更新的软件包等等。结果就是产生非常臃肿、非常多层的镜像，不仅仅增加了构建部署的时间，也很容易出错。 这是很多初学 Docker 的人常犯的一个错误。

#### 建议的 Dockerfile 写法

把所有执行命令放到一个 `RUN` 里，并用`&& \`进行连接。就可以把很多命令写到一个 `RUN` 里边了。

```Dockerfile
FROM ubuntu:latest
RUN apt-get update && \
    apt-get install -y wget && \
    wget https://github.com/ipinfo/cli/releases/download/ipinfo-2.0.1/ipinfo_2.0.1_linux_amd64.tar.gz && \
    tar zxf ipinfo_2.0.1_linux_amd64.tar.gz && \
    mv ipinfo_2.0.1_linux_amd64 /usr/bin/ipinfo && \
    rm -rf ipinfo_2.0.1_linux_amd64.tar.gz
```

这样所有的 `RUN` 命令只生成一层 `image layer`。打包出来的镜像也没有那么大了。

### 4.3 Dockerfile 文件操作

制作镜像的时候，经常需要向镜像里添加文件。在 `Dockerfile` 中有两个命令可以向镜像中添加文件 `COPY` 和 `ADD`。这节我们聊一下这两个命令，并重点了解一下两个命令的不同。

#### 用 COPY 命令构建镜像

现在我们写一个 `Dockerfile`，里边的内容是用基础 `Node` 镜像，然后拷贝一个 `index.js` 文件进去。

Dockerfile.copy 内容如下:

```Dockerfile
FROM node:16
COPY index.js  /app/index.js
```

引用 `node` 16 版本，然后把 `index.js` 文件，拷贝到 `app` 目录下面。

`index.js` 文件如下。代码是我们在 3000 端口上，开启了一个最简单 web 服务，然后返回了 `Hello Nodejs` 两个单词。

```js
//1. 导入 http 模块
const http = require('http');
//2. 创建服务器对象
const server = http.createServer();
//3. 开启服务器
server.listen(3000, () => {
  console.log('Server is running...');
});
//4. 监听浏览器请求并进行处理
server.on('request', (req, res) => {
  // end方法能够将数据返回给浏览器，浏览器会显示该字符串
  res.end('Hello Nodejs');
});
```

两个文件准备好以后，用 `build` 命令进行构建。

```Dockerfile
docker image build -f Dockerfile.copy -t hello-copy .
```

构建完成后，可以使用 `docerk image ls` 命令进行查询。生成成功后，可以启用交互模式，再加上映射端口的形式，运行容器。

```bash
docker container run -it -p 3000:3000 hello-copy sh
```

这里映射了 `3000` 端口，这样我们就可以用 `127.0.0.1:3000` 进行访问了。

#### 用 ADD 构筑镜像

`ADD` 构建镜像和 `COPY` 最直观的一点不同，是 `ADD` 命令可以直接解压 `gzip` 压缩文件，这当我们有很多文件要上传操作的时候，就会变的简单很多。

Dockerfile.add 文件内容：

```Dockerfile
FROM node:alpine3.14
ADD index.tar  /app/
```

用 `ADD` 命令进行打包镜像

```bash
docker image build -f Dockerfile.add -t hello-gzip .
```

打包好以后使用交互模式，开启容器。

```bash
docker container run -it -p 3000:3000 hello-gzip sh
```

再进入 `app` 路径下面，可以看到下面自动给我们解压了 `index.tar` 文件。

#### WORKDIR 切换工作目录

在写 `Dockerfile` 文件时，默认的操作目录，是镜像的根目录。但有时候需要拷贝很多内容到镜像里是二级目录，就可以使用 `WORKDIR` 命令。把工作目录切换到二级，`WORKDIR` 命令像我们操作 `linux` 下的 `cd` 命令。

比如还是刚才的 `Dockerfile.add` 文件，我们可以使用 WORKDIR 命令，改成下面的形式。

```Dockerfile
FROM node:alpine3.14
WORKDIR /app
ADD index.tar index.js
```

这时候进入系统后的工作目录，就是在 `/app` 下面了。

### 4.4 Dockerfile ARG 与 ENV 指令

`ARG` 和 `ENV` 是经常容易被混淆的两个 `Dockerfile` 语法，它们都可以用来设置一个【变量】。但其实两个语法在细节上有很多不同。

还记得之前我们写过一个默认安装 `ipinfo` 的 `ubuntu` 系统吗，其 Dockerfile 文件如下：

```Dockerfile
FROM ubuntu:latest
RUN apt-get update && \
    apt-get install -y wget && \
    wget https://github.com/ipinfo/cli/releases/download/ipinfo-2.0.1/ipinfo_2.0.1_linux_amd64.tar.gz && \
    tar zxf ipinfo_2.0.1_linux_amd64.tar.gz && \
    mv ipinfo_2.0.1_linux_amd64 /usr/bin/ipinfo && \
    rm -rf ipinfo_2.0.1_linux_amd64.tar.gz
```

这段文件里有 `ipinfo` 的版本是 `ipinfo-2.0.1`,这个版本是有可能改变的。文件里一共出现了 5 次 `2.0.1`，修改起来已经比较麻烦了，如果出现更多次，几乎变的不可维护。所以这时候就需要定义一个变量，方便日后的维护。

#### ENV 定义变量

先用 `ENV` 的形式来修改变量，把上面的 `Dockerfile.ENV` 文件修改为下面的形式（这里有个小坑需要给大家说一下，就是注意在写变量时，值不要有任何的空格，否则在打包时会失败。）

```Dockerfile
FROM ubuntu:latest
ENV VERSION=2.0.1
RUN apt-get update && \
    apt-get install -y wget && \
    wget https://github.com/ipinfo/cli/releases/download/ipinfo-${VERSION}/ipinfo_${VERSION}_linux_amd64.tar.gz && \
    tar zxf ipinfo_${VERSION}_linux_amd64.tar.gz && \
    mv ipinfo_${VERSION}_linux_amd64 /usr/bin/ipinfo && \
    rm -rf ipinfo_${VERSION}_linux_amd64.tar.gz
```

这样写之后，如果以后版本改变了，我们只要修改一处，就可以完成所有的修改了。

我们现在来构建一下这个 ENV 的镜像。

```bash
docker image build -f Dockerfile.ENV -t ipinfo-env .
```

#### ARG 定义变量

跟上面的方法一样用 `ARG` 定义变量效果是一样。只是把 `ENV` 换成了 `ARG`。这个文件是 `Dockerfile.ARG`，内容如下：

```Dockerfile
FROM ubuntu:latest
ARG VERSION=2.0.1
RUN apt-get update && \
    apt-get install -y wget && \
    wget https://github.com/ipinfo/cli/releases/download/ipinfo-${VERSION}/ipinfo_${VERSION}_linux_amd64.tar.gz && \
    tar zxf ipinfo_${VERSION}_linux_amd64.tar.gz && \
    mv ipinfo_${VERSION}_linux_amd64 /usr/bin/ipinfo && \
    rm -rf ipinfo_${VERSION}_linux_amd64.tar.gz
```

我们可以通过命令来构建一下 `ARG` 的镜像：

```bash
docker image build -f `Dockerfile.ARG -t` ipinfo-arg .
```

#### ENV 和 ARG 的不同点

总的来说 ARG 和 ENV 有两点不同，第一点是声明变量的作用域不同，第二点是 ARG 声明后，可以在构建时修改变量。

1. ARG 是构建环境，ENV 可带到镜像中

用交互模式进入到 ipconfig-env 镜像中，然后输入 env 可以看到当前镜像的信息。

```bash
docker container run -it ipinfo-env
```

然后输入 `env`，可以看到里边是会有 `VERSION` 变量的。

2. ARG 可以在构建镜像时改变变量值

在构建时，可以使用 `—build-arg` 参数来更改变量的值，比如现在要把变量 `VERSION` 的值进行修改,就可以使用下面的命令。

```bash
docker image build -f Dockerfile.ARG -t ipinfo-arg-2.0.0 --build-arg VERSION=2.0.0 .
```

这时候我们再使用交互模式，开启 `ipinfo-arg-2.0.0` 容器。

```bash
docker container run -it ipinfo-arg-2.0.0

```

然后再通过 `shell` 命令，`ipinfo verison` 查看 `ipinfo` 的版本，可以看到版本已经变成了 `2.0.0` 了。

### 4.5 Dockerfile CMD 与 ENTRYPOINT 指令

#### CMD 容器启动命令

`CMD` 指令的格式有一下两种：

- `shell`格式：`CMD <命令>`

```Dockerfile
CMD node hello.js
```

- `exec` 格式：`CMD ["可执行文件", "参数 1", "参数 2"...]`

```Dockerfile
CMD ["node","hello.js"]
```

`CMD` 命令在使用时，有三个基本原则需要我们遵守。

- 容器启动时默认执行的命令
- 如果` docker container run` 启动容器时指定了其它命令，则 `CMD` 命令会被忽略
- 如果定义多个 `CMD`，只有最后一个 `CMD` 执行

#### ENTRYPOINT 入口点

`ENTRYPOINT` 的格式和 `CMD` 指令格式一样，分为 `exec` 格式和 `shell` 格式。

`ENTRYPOINT` 的目的和 `CMD` 一样，都是在指定容器启动程序及参数。`ENTRYPOINT` 在运行时也可以替代，不过比 `CMD` 要略显繁琐，
需要通过 `docker run` 的参数 `--entrypoint` 来指定。
当指定了 `ENTRYPOINT` 后，`CMD` 的含义就发生了改变，不再是直接的运行其命令，而是将 `CMD` 的内容作为参数传给 `ENTRYPOINT` 指令，
换句话说实际执行时，将变为：

```bash
<ENTRYPOINT> "<CMD>"
```

## 5 Docker Compose

### 5.1 Docker Compose 介绍

熟悉 `Linux` 都知道，我们可以把很多相关的命令写成一个 `xxx.sh` 文件，而且这些步骤也是相对固定的。

这样直接运行 `sh` 文件，就可以逐一执行很多相关的 `Docker` 命令。这种形式可以减少出错和解决复用问题。`Docker` 很贴心的为我们准备了一个专门的工具 `docker-compose`，实现类似 `sh` 文件的功能。让我们更加轻松的实现多 `Docker` 命令的操作。

你也可以把 `docker-compose` 就是把很多 `Docker` 命令写入一个专属的文件 `docker-compose.yml`，然后执行这个文件，就可以直接启动我们想要的容器。`docker-compose` 也为我们提供了对应的操作命令: `docker-compose up` 、`docker-compose stop`。

也就是说，操作 `docker-compose` 会有两个大的部分需要操作:

- 第一部分：编写 `docker-compose.yml` 文件。
- 第二部分：输入相关的命令构筑容器。

### 5.2 Docker Compose 文件结构

#### yaml 文件的基础结构

基本的 `docker-compose.yml` 文件格式如下：

```yml
version: '3.8'

services: # 容器
  servicename: # 服务名字，这个名字也是内部 bridge 网络可以使用的 DNS name
    image: # 镜像的名字
    command: # 可选，如果设置，则会覆盖默认镜像里的 CMD命令
    environment: # 可选，相当于 docker run里的 --env
    volumes: # 可选，相当于docker run里的 -v
    networks: # 可选，相当于 docker run里的 --network
    ports: # 可选，相当于 docker run里的 -p
  servicename2:

volumes: # 可选，相当于 docker volume create

networks: # 可选，相当于 docker network create
```

下面我们以一个 `wordpress` 的镜像为例，制作 `yaml` 文件。

- 用 `Docker` 命令的写法：

```bash
docker container run -d -p 80:80 wordpress
```

- 用 `yaml` 文件的写法：

```yml
version: '3.8'

services:
  my-wordpress:
    image: wordpress:latest
    ports:
      - 80:80
```

#### docker-compose 版本说明

> https://docs.docker.com/desktop/

打开这个网址，就会看到 `docker-compose` 和 `Docker` 版本的兼容关系表。比如 `3.8` 版本，要求 `Docker Engine` 的版本是 `19.03.0+`。

我们可以使用下面的命令查看当前电脑的版本。

```bash
docker --version
Docker version 20.10.10, build b485636
```

可以看到，我们现在的 `Docker` 版本是完全符合 `docker-compose` 的，所以在 `yaml` 文件的最开始写 `version: '3.8'` 是没有问题的。

这里需要说的是: `docker-compose` 现在有两个主要版本 `Version3` 和 `Version2`。这两个版本的 `yaml` 写法也略有不同，但是基础语法是相同的。

### 5.3 Docker Compose 基础命令

`docker-compose` 的命令我们可以直接在终端输入 `docker-compose` 查看：

```bash
Commands:
  build              Build or rebuild services
  config             Validate and view the Compose file
  create             Create services
  down               Stop and remove resources
  events             Receive real time events from containers
  exec               Execute a command in a running container
  help               Get help on a command
  images             List images
  kill               Kill containers
  logs               View output from containers
  pause              Pause services
  port               Print the public port for a port binding
  ps                 List containers
  pull               Pull service images
  push               Push service images
  restart            Restart services
  rm                 Remove stopped containers
  run                Run a one-off command
  scale              Set number of containers for a service
  start              Start services
  stop               Stop services
  top                Display the running processes
  unpause            Unpause services
  up                 Create and start containers
  version            Show version information and quit

```

#### docker-compose 启动容器

上一节我们配置了一个关于 `wordpress` 服务的 `docker-compose.yml` 文件：

```yml
version: '3.8'

services:
  my-wordpress:
    image: wordpress:latest
    ports:
      - 80:80
```

现在我们打开 `VSCode` 进入该文件所在的目录，打开终端输入容器启动命令 `docker compose up`，就可以开启 `wordpress` 容器了。但这时候的容器开启方式是有日志输出的，并且窗口被占用了。没办法进行其它操作了。可以加入 `-d` 参数，解决这个问题。

```bash
docker compose up -d
```

这样就是后台运行模式了，我们就可以继续操作这个终端了，如果你想查看 `service` 运行情况，可以使用下面的命令：

```bash
$ docker-compose ps
       Name                      Command               State                Ports
-----------------------------------------------------------------------------------------------
test_my-wordpress_1   docker-entrypoint.sh apach ...   Up      0.0.0.0:80->80/tcp,:::80->80/tcp
```

#### docker-compose 停止和删除容器

当你不在使用这个 `service` 的时候，就可以使用 `stop` 命令停止。停止以后，容器就处于 `Exited` 模式了。容器已经停止，就可以进行清理了。

```bash
docker compose stop
```

`rm` 命令会删除掉由 docker compose 所建立的容器，但用 docker 命令创建的容器不会被删除，对应的网络也不会被删除。

```bash
docker compose rm
```

#### docker-compose 命名规则

用 `docker-compose` 创建的容器，名字都会加入一个对应文件夹的名字，比如我在的文件夹叫做 `test` ，而我在 `yaml` 文件中起的名字是 `my-wordpress`，最终容器的名字就是 `test_my-wordpress_1`。

如果你想更改容器的名字，你可以在 `yaml` 文件里使用 `contaner_name: wordpress-demo`指定这个名字：

```yml
version: '3.8'

services:
  my-wordpress:
    container_name: wordpress-demo
    image: wordpress:latest
    ports:
      - 80:80
```

### 5.4 Docker Compose 自定义镜像构筑

如果我们想使用自己的 `Dockerfile` 去启动自定义的镜像容器，我们可以按以下步骤：

1. 先创建一个 `Dockerfile` 文件

```Dockerfile
FROM node:latest
CMD []
```

2. 在相同目录下创建 `docker-compose.yml` 文件

```yml
version: '3.8'

services:
  my-node:
    build: .
    container_name: 'my-node'
```

这里的 `build: .` 意思是：根据当前目录下 `Dockerfile` 文件构筑镜像，再启动容器。

3. 执行 `docker-compose up -d`

容器启动之后，你再使用 `docker image ls` 会看到自定义镜像。

## 参考文章

- [Docker Docs](https://docs.docker.com/)
- [Docker -- 从入门到实践](https://yeasy.gitbook.io/docker_practice/)
- [跟胖哥一起学 Docker](https://jspang.com/detailed?id=75#toc21)
