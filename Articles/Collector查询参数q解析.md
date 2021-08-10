Collector 查询参数中的 q 参数，用于对数据进行查询与筛选，根据是否设置查询路径分为**字段查询**和**全局查询**，以下是对于 q 参数的使用总结：

## 字段查询

### 基本格式

1. 格式：`paths @ [filed] && [type] [operator] [value]`
2. 作用：对 `extra` 内的指定的字段 `[filed]` 的值进行匹配。
3. 示例：`paths @ "所属居委" && string == "联洋四居委"`

- `paths @`：相对路径，默认为 `extra.`。 `paths @ "所属居委"` 等价于 `"extra.所属居委"`。
- `[filed]`： 字段名，只支持`extra`里的字段名。
- `&&`： 连接符，`&&`左边为查询路径，`&&`右边为查询条件。
- `[type]`： 数据类型，如 `string`,`number`,`boolean`等。
- `[operator]`： 操作符，如`>=`,`<`,`==`,`@~`等。
- `[value]`： 查询值，字符串类型需要加双引号`""`。

### 常用操作符

1. 比较操作符 `>` `<` `>=` `<=` `==` `!=`
2. 匹配操作符 `@`
3. 前缀匹配操作符 `@^`
4. 后缀匹配操作符 `@$`
5. 正则匹配操作符 `@~`

### 路径

1. `paths @` 为 `collector` 的默认路径，设置为 `extra.`。 `paths @ "所属居委"` 等价于 `"extra.所属居委"`。
2. 如果字段类型为 `Object`，可以通过 `.` 符号找到他属性的路径。
   例如：`{"a": {"b": {"c": "x" }}}` ，想要找到 `x` 的路径，可以通过 `a.b.c` 实现：`paths @ "a.b.c" && string == "x"`。

## 全局查询

1. 格式：`[type] [operator] [value]`
2. 作用：对 `extra` 内的所有字段值进行匹配，如果有一个字段符合条件，则匹配成功。
3. 示例：`string == "联洋四居委"`

- `[type]`： 数据类型，如 `string`,`number`,`boolean`等。
- `[operator]`： 操作符，如`>=`,`<`,`==`,`@~`等。
- `[value]`： 查询值，字符串类型需要加双引号`""`。

## 关系

当有多个查询条件并且满足与或关系时，可以通过关系符将其拼接在一起。

### 与关系

- 符号：`,`
- 示例：`paths @ "性别" && string == "女",paths @ "民族" && string == "汉族"`
  （筛选同时满足`性别为女`且`民族为汉族`的数据）。

### 或关系

- 符号：`||`
- 示例：`paths @ "性别" && string == "男" || paths @ "性别" && string == "女"`
  （筛选满足`性别为男`或`性别为女`的数据）。

### 路径简化

开头写过 `paths @` 后，后续的 `paths @` 可以省略：<br>
`paths @ "性别" && string == "男" || "性别" && string == "女"`

## 参考资料

- [PGroonga 全文检索语法](https://pgroonga.github.io/reference/operators/script-jsonb-v2.html)
- [Groonga Operator](https://groonga.org/docs/reference/grn_expr/script_syntax.html)
