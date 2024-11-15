# coze_to_chrome_extension
coze工作流转chrome插件的框架代码
# Chrome Extension Framework 使用指南

## 1. 基础文件结构
首先创建以下目录结构：
```
your-extension/
├── manifest.json      // 扩展配置文件
├── popup.html        // 弹窗界面
├── config.js         // 配置文件（主要修改此文件）
├── framework.js      // 框架核心代码（通常不需要修改）
├── popup.js          // 初始化代码（通常不需要修改）
├── content.js        // 页面内容脚本（可选）
└── images/          // 图标文件夹
    ├── icon16.png    // 16x16 图标
    ├── icon48.png    // 48x48 图标
    └── icon128.png   // 128x128 图标
```

## 2. 配置文件修改指南 (config.js)

### 2.1 基础配置
修改扩展的基本信息：
```javascript
const EXTENSION_CONFIG = {
  extension: {
    name: "你的扩展名称",        // 修改为你的扩展名称
    description: "扩展描述",     // 修改为你的扩展描述
    version: "1.0",            // 版本号
  },
  ...
}
```

### 2.2 API配置
配置你的API端点和认证信息：
```javascript
api: {
  endpoint: "https://你的API地址",           // 修改为你的API地址
  authToken: "你的认证Token",               // 修改为你的Token
  workflowId: "你的工作流ID",               // 修改为你的工作流ID
},
```

### 2.3 UI配置
配置用户界面元素：
```javascript
ui: {
  title: "你的标题",            // 修改为你的功能标题
  width: 350,                 // 可以调整弹窗宽度
  
  // 配置输入字段
  inputs: [
    {
      id: "customField1",     // 字段唯一标识符
      label: "字段标签",        // 显示的标签文本
      type: "text",           // 输入类型：text 或 select
      placeholder: "提示文本",  // 输入框提示文本
      required: true,         // 是否必填
      paramName: "api_param", // 对应API参数名
      autoFill: true         // 是否自动填充当前页面URL
    },
    // 下拉选择示例
    {
      id: "customField2",
      label: "选择项",
      type: "select",
      options: [
        { value: "1", label: "选项1" },
        { value: "2", label: "选项2" }
      ],
      required: true,
      paramName: "select_param"
    }
  ],

  // 配置按钮文本
  button: {
    text: "执行操作",          // 按钮文本
    loadingText: "处理中..."   // 处理时的按钮文本
  },

  // 配置提示消息
  messages: {
    start: "开始处理...",
    success: "处理完成！",
    error: "处理失败: ",
    inputRequired: "请填写必填项"
  }
}
```

## 3. manifest.json 修改指南

需要修改的关键部分：
```json
{
  "name": "你的扩展名称",                    // 修改为你的扩展名称
  "description": "你的扩展描述",             // 修改为你的扩展描述
  "version": "1.0",
  "host_permissions": [
    "*://*.你的域名.com/*"                 // 修改为你需要访问的域名
  ]
}
```

## 4. 创建新扩展的步骤

1. **复制框架文件**
   - 复制整个框架目录到新的文件夹
   - 重命名文件夹为你的扩展名

2. **准备图标**
   - 创建三个尺寸的图标（16x16、48x48、128x128）
   - 放置在 images 文件夹中

3. **修改配置**
   - 更新 manifest.json 中的基本信息
   - 修改 config.js 中的配置
   - 根据需要调整 popup.html 中的样式

4. **特殊功能定制**
   如果需要特殊功能，可以：
   - 修改 content.js 添加页面交互功能
   - 在 framework.js 中扩展 ExtensionFramework 类
   - 调整 popup.js 中的初始化逻辑

## 5. 调试和测试

1. **加载扩展**
   - 打开 Chrome 浏览器
   - 访问 chrome://extensions/
   - 开启"开发者模式"
   - 点击"加载已解压的扩展程序"
   - 选择你的扩展目录

2. **测试流程**
   - 测试所有输入字段
   - 验证API调用
   - 检查错误处理
   - 测试流式输出

## 6. 注意事项

1. **API参数映射**
   - 确保 input 配置中的 paramName 与API期望的参数名匹配
   - 检查参数类型是否正确（字符串/数字）

2. **错误处理**
   - 添加适当的错误提示
   - 处理网络超时情况
   - 处理API错误响应

3. **安全性**
   - 不要在代码中硬编码敏感信息
   - 使用适当的CSP策略
   - 最小化host_permissions范围

4. **性能优化**
   - 减少不必要的API调用
   - 优化DOM操作
   - 合理处理大量数据

## 7. 示例配置

```javascript
// 一个完整的配置示例
const EXTENSION_CONFIG = {
  extension: {
    name: "数据采集助手",
    description: "自定义数据采集工具",
    version: "1.0",
  },
  
  api: {
    endpoint: "https://api.example.com/collect",
    authToken: "your-auth-token",
    workflowId: "your-workflow-id",
  },
  
  ui: {
    title: "数据采集",
    inputs: [
      {
        id: "dataUrl",
        label: "数据源地址",
        type: "text",
        placeholder: "请输入数据源地址",
        required: true,
        paramName: "source_url",
        autoFill: true
      },
      {
        id: "dataType",
        label: "数据类型",
        type: "select",
        options: [
          { value: "1", label: "类型A" },
          { value: "2", label: "类型B" }
        ],
        required: true,
        paramName: "data_type"
      }
    ],
    button: {
      text: "开始采集",
      loadingText: "采集中..."
    },
    messages: {
      start: "开始采集...",
      success: "采集完成！",
      error: "采集失败: ",
      inputRequired: "请填写必填项"
    }
  }
};
```
