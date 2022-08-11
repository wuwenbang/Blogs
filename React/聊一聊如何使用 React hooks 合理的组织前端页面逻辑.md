# 聊一聊如何使用 React hooks 合理的组织前端页面逻辑

## 前言

时至今日，React Hooks 已经被越来越多的开发者使用，想必大家应该也非常熟悉 hooks 了。当谈及 hooks ，特别是将 hooks 和 class 写法进行对比，我们总是会说： “hooks 的写法更简洁，hooks 可以更方便的进行逻辑复用“。当然，这些都是 hooks 显而易见的优点，不过除此之外，笔者认为 hooks 还带来了一个特别的收益：通过 hooks 可以轻易的进行逻辑的抽象，即：**将关联的逻辑内聚，将无关的逻辑分隔**，帮助我们更加优雅的组织页面逻辑。

可能直接这么说会有一些抽象，下面我们结合一个 Demo 示例来说明：例如我们需要渲染一个常见的列表页面，包含以下 3 个模块：

- 搜索栏：负责对列表内容进行搜索
- 筛选栏：负责对列表标签进行筛选
- 列表：渲染列表项，包含内容和标签

[![vlDAjU.gif](https://s1.ax1x.com/2022/08/09/vlDAjU.gif)](https://imgtu.com/i/vlDAjU)

## 传统的 class 写法

传统的 class 写法，将状态（state）、方法（methods）、生命周期（lifecycle）分开书写。如下例：

```tsx
export default class App extends Component<
  {},
  { searchValue: string; tagFilter?: TagType; dataList: DataType[] }
> {
  constructor(props) {
    super(props);
    this.state = {
      searchValue: "",
      tagFilter: undefined,
      dataList: [],
    };
  }
  // 搜索列表内容方法
  onSearchChange(value: string) {
    this.setState((prevState) => ({
      ...prevState,
      searchValue: value,
    }));
  }
  // 筛选标签项方法
  onClickTag(tag: TagType) {
    this.setState((prevState) => ({
      ...prevState,
      tagFilter: prevState.tagFilter === tag ? undefined : tag,
    }));
  }
  // 初次请求列表数据
  componentDidMount(): void {
    this.fetchData();
  }
  // 重新请求列表数据
  componentDidUpdate(prevProps, prevState): void {
    if (
      prevState.searchValue !== this.state.searchValue ||
      prevState.tagFilter !== this.state.tagFilter
    ) {
      this.fetchData();
    }
  }
  // 请求列表数据方法
  async fetchData() {
    const data = await getDataList({
      tag: this.state.tagFilter,
      search: this.state.searchValue,
    });
    this.setState((prevState) => ({
      ...prevState,
      dataList: data,
    }));
  }
  render() {
    return (
      <div>
        <Input.Search
          className="search"
          onSearch={this.onSearchChange.bind(this)}
        />
        <Space className="filter">
          {TAGS.map((tag) => (
            <Tag.CheckableTag
              key={tag}
              checked={this.state.tagFilter === tag}
              onClick={() => this.onClickTag(tag)}
            >
              {tag}
            </Tag.CheckableTag>
          ))}
        </Space>
        <List bordered>
          {this.state.dataList.map((data) => (
            <List.Item key={data.content}>
              <span>{data.content}</span>
              <Tag color={data.tag}>{data.tag}</Tag>
            </List.Item>
          ))}
        </List>
      </div>
    );
  }
}
```

可以看到，class 的写法会造成关联逻辑的分离，如果页面逻辑简单，状态少，这样组织代码也是没有问题的，但是当页面逻辑复杂，状态繁多时就会导致相关的逻辑过度分散，查找和修改代码变得十分困难。

如下图所示，数据列表相关的逻辑（绿色框）： `dataList` 的类型声明与初始化，相关的方法 `fetchData` 的调用和更新逻辑，被分散在了不同的区域。同理，搜索逻辑（红色框）与标签筛选逻辑（蓝色框）也是如此。

[![vlzkRA.jpg](https://s1.ax1x.com/2022/08/09/vlzkRA.jpg)](https://imgtu.com/i/vlzkRA)

## 通过 hooks 实现关联逻辑的聚合

为了解决 class 写法逻辑分散的问题，我们可以通过 hooks 将关联的逻辑聚合在一起：

```tsx
const App = () => {
  // 搜索逻辑
  const [searchValue, setSearchValue] = useState("");
  const onSearchChange = (value: string) => {
    setSearchValue(value);
  };

  // 标签筛选逻辑
  const [tagFilter, setTagFilter] = useState<TagType>();
  const onClickTag = (tag: TagType) => {
    setTagFilter((prevTag) => (prevTag === tag ? undefined : tag));
  };

  // 列表获取逻辑
  const [dataList, setDataList] = useState<DataType[]>([]);
  useEffect(() => {
    const fetchData = async () => {
      const data = await getDataList({ tag: tagFilter, search: searchValue });
      setDataList(data);
    };
    fetchData();
  }, [tagFilter, searchValue]);

  return (
    <div>
      <Input.Search className="search" onSearch={onSearchChange} />
      <Space className="filter">
        {TAGS.map((tag) => (
          <Tag.CheckableTag
            key={tag}
            checked={tagFilter === tag}
            onClick={() => onClickTag(tag)}
          >
            {tag}
          </Tag.CheckableTag>
        ))}
      </Space>
      <List bordered>
        {dataList.map((data) => (
          <List.Item>
            <span>{data.content}</span>
            <Tag color={data.tag}>{data.tag}</Tag>
          </List.Item>
        ))}
      </List>
    </div>
  );
};

export default App;
```

通过 hooks 的写法，我们可以自由的组合状态、方法和副作用（模拟生命周期），将逻辑相关联的代码写在一起。如下图搜索逻辑（红）、标签筛选逻辑（蓝）、数据列表获取逻辑（绿）分别聚合在了不同的三个区域：

[![v1kyVI.jpg](https://s1.ax1x.com/2022/08/09/v1kyVI.jpg)](https://imgtu.com/i/v1kyVI)

## 通过自定义 hooks 实现不同逻辑的分离

上例子中我们通过 hooks 将相关联的逻辑聚合在一起的方式仅仅是将它们写在一块儿，但是它们还在同一个文件中，如果逻辑变得复杂代码行数会变得很长很长，还是不方便查找和修改。同时，不同的逻辑块中又有一些相依赖的逻辑（例如 `dataList` 依赖 `searchValue` 和 `tagFilter`），他们之间的依赖关系写在同一个函数中会显得特别混乱，难以理清楚依赖关系。

为了更好的组织逻辑，我们可以将相关联的逻辑封装到一个函数中，再将需要的状态和方法通过函数的返回值暴露出来。

- 将搜索逻辑封装成 `useSearchValue`

```tsx
export default function useSearchValue() {
  const [searchValue, setSearchValue] = useState("");

  const onSearchChange = (value: string) => {
    setSearchValue(value);
  };

  return { searchValue, onSearchChange };
}
```

- 将标签筛选逻辑封装成 `useTagFilter`

```tsx
export default function useTagFilter() {
  const [tagFilter, setTagFilter] = useState<TagType>();
  // 当点击 tag 筛选项
  const onClickTag = (tag: TagType) => {
    setTagFilter((prevTag) => (prevTag === tag ? undefined : tag));
  };

  return { tagFilter, onClickTag };
}
```

- 将标数据列表获取辑封装成 `useDataList`

```tsx
interface Props {
  tag: TagType;
  search: string;
}

export default function useDataList({ tag, search }: Props) {
  const [dataList, setDataList] = useState<DataType[]>([]);
  // 获取数据列表
  useEffect(() => {
    const fetchData = async () => {
      const data = await getDataList({ tag, search });
      setDataList(data);
    };
    fetchData();
  }, [tag, search]);

  return { dataList };
}
```

像以上这种内部包含 hooks 并且以 `use` 开头的函数，我们称之为`自定义 hooks`。

然后我们在对应页面目录下新建 hooks 目录，将封装的 3 个自定义 hooks 分别新建对应的文件，并统一放在 hooks 目录下：

[![v1m6aj.jpg](https://s1.ax1x.com/2022/08/09/v1m6aj.jpg)](https://imgtu.com/i/v1m6aj)

最后我们在页面的入口文件中调用我们写好的自定义 hooks：

```tsx
import { Input, List, Space, Tag } from "antd";
import "./App.css";
import { TAGS } from "./constants";
import useDataList from "./hooks/useDataList";
import useSearchValue from "./hooks/useSearchValue";
import useTagFilter from "./hooks/useTagFilter";

const App = () => {
  const { searchValue, onSearchChange } = useSearchValue();
  const { tagFilter, onClickTag } = useTagFilter();
  const { dataList } = useDataList({ search: searchValue, tag: tagFilter });

  return (
    <div className="App">
      <Input.Search className="search" onSearch={onSearchChange} />
      <Space className="filter">
        {TAGS.map((tag) => (
          <Tag.CheckableTag
            key={tag}
            checked={tagFilter === tag}
            onClick={() => onClickTag(tag)}
          >
            {tag}
          </Tag.CheckableTag>
        ))}
      </Space>
      <List bordered>
        {dataList.map((data) => (
          <List.Item>
            <span>{data.content}</span>
            <Tag color={data.tag}>{data.tag}</Tag>
          </List.Item>
        ))}
      </List>
    </div>
  );
};

export default App;
```

这样我们就通过自定义 hooks 实现了不同逻辑的分离，可以看到页面 App 函数内部变得非常简洁。当然这样的封装方式一定程度增加了编码负担，但同时它也会为我们的项目带来很大的收益：

1. 通过封装自定义 hooks ，我们将不关联的逻辑进行了分离，相关联的逻辑聚合在同一个文件的一个函数内，对于使用者来说我们隐藏了实现的细节，只暴露出需要的状态与方法。
2. 另一方面，这种函数组合式的编程方式，会将不同逻辑模块之间的依赖关系清晰的暴露出来。例如示例中数据列表模块的 `dataList` 依赖搜索模块 `searchValue` 和标签筛选模块的`tagFilter`，在图中我们可以清晰的看出依赖关系：
   [![v1KEqS.png](https://s1.ax1x.com/2022/08/09/v1KEqS.png)](https://imgtu.com/i/v1KEqS)

## 写在最后

本文探讨的是通过 React hooks 合理的组织页面中的代码逻辑：即将相关联的代码抽离成一个自定义 hooks ，然后将这些抽离好的逻辑统一放在 hooks 目录下进行管理。

注意：本文的自定义 hooks 抽离的逻辑主要是业务逻辑，而不是类似 `ahooks` 或 `react-use` 那样的通用逻辑。当然一些通用的业务逻辑也是可以复用的，但这不是本文的重点。本文着重想表达的是 hooks 带来的逻辑抽象能力，而不是 hooks 的逻辑复用能力。

通过 hooks 的逻辑抽象能力，可以帮助我们更好的组织页面逻辑，写出高内聚低耦合的代码；但同时这种编码方式一定程度增加了编码的负担，并且大量的自定义 hooks 也会带来了一些黑盒效应。这就要求我们在写自定义 hooks 一定要明确状态之间的依赖关系，对关联的逻辑进行合理的抽象，同时要学会合理的命名自定义 hooks ，增强代码的可读性。

