```ts
export interface TreeNode {
  id: number
  title: string
  parentId: number
}

// 递归生成树结构
export const buildTree = (data: TreeNode[], parentId: number): TreeNode[] => {
  // 筛选出子节点
  const children = data.filter((item) => item.parentId === parentId)
  // 返回树状结构的子节点
  return children.map((item) => ({
    id: item.id,
    title: item.title,
    // 递归调用
    children: buildTree(data, item.id),
  }))
}
```
