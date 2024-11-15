// config.js
const EXTENSION_CONFIG = {
  // 扩展基础配置
  extension: {
    name: "数据采集助手",
    description: "自定义数据采集工具",
    version: "1.0",
  },

  // API配置
  api: {
    endpoint: "https://api.coze.cn/v1/workflow/stream_run",
    authToken: "pat_LCY7rziQhmaUfJlAmFyylTFtcOIpQdDW2BJFy2LPs",
    workflowId: "7432984555261624346",
  },

  // 界面配置
  ui: {
    title: "数据采集",
    width: 350,

    // 输入字段配置
    inputs: [
      {
        id: "url",
        label: "视频链接",
        type: "text",
        placeholder: "请输入链接",
        autoFill: true,
        required: true,
        paramName: "share_url"
      },
      {
        id: "count",
        label: "采集数量",
        type: "select",
        options: [
          { value: "50", label: "50条" },
          { value: "100", label: "100条" },
          { value: "150", label: "150条" },
          { value: "200", label: "200条" },
          { value: "250", label: "250条" },
          { value: "300", label: "300条" }
        ],
        required: true,
        paramName: "count"
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