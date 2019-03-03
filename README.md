### mini-program-cli
小程序初始化模版，可初始化 微信/支付宝 小程序

<!-- ![](https://img.shields.io/npm/dt/@yunlong.syl/mini-program-cli.svg) -->
![](https://img.shields.io/npm/l/@yunlong.syl/mini-program-cli.svg)

#### `mini init [name]`
> 初始化小程序项目 命令，`[name]` 为可选参数

```
mini init 为在当前目录下初始化项目
mini init [name] 为在当前目录下的 [name] 目录下初始化项目

选择平台：wechat / alipay
初始化对应小程序
```

#### `mini page <name>`
> 新增页面至pages目录，`<name>` 为必填参数

```
mini page <name> 新增一个 <name> 页面 
```

#### `mini mod <name>`
> 新增组件至components目录，`<name>` 为必填参数

```
mini page <name> 新增一个 <name> 页面 
```

#### `mini rename <type> <name> <oldname>`
> 重命名页面/组件，`<type>`值为page/mod

```
mini rename page <name> <oldname> 重命名 <oldname> 页面 为 <name> 
```

#### github
欢迎star [github](https://github.com/suyunlongsy/mini-program-cli.git) 

如果你觉得这个模版有哪些改进的地方，记的提issue。

[wechat模版地址](https://github.com/suyunlongsy/wechat-mini-template.git)
[alipay模版地址](https://github.com/suyunlongsy/alipay-mini-template.git)