// framework.js
class ExtensionFramework {
  constructor(config) {
    this.config = config;
    this.statusDiv = null;
    this.button = null;
    this.inputs = {};
  }

  // 初始化UI
  initialize() {
    const container = document.getElementById('mainContainer');
    container.innerHTML = this.generateHTML();
    this.initializeReferences();
    this.initializeEventListeners();
  }

  // 生成HTML
  generateHTML() {
    let html = '';

    // 生成输入字段
    this.config.ui.inputs.forEach(input => {
      html += `
        <div class="input-group">
          <label for="${input.id}">${input.label}:</label>
          ${this.generateInputElement(input)}
        </div>
      `;
    });

    // 添加按钮和状态div
    html += `
      <button id="actionBtn">${this.config.ui.button.text}</button>
      <div id="status" class="status" style="display: none;"></div>
    `;

    return html;
  }

  // 生成输入元素
  generateInputElement(input) {
    if (input.type === 'select') {
      return `
        <select id="${input.id}" ${input.required ? 'required' : ''}>
          ${input.options.map(opt => 
            `<option value="${opt.value}">${opt.label}</option>`
          ).join('')}
        </select>
      `;
    }
    return `
      <input type="${input.type}" 
             id="${input.id}" 
             placeholder="${input.placeholder || ''}"
             ${input.required ? 'required' : ''}>
    `;
  }

  // 初始化DOM引用
  initializeReferences() {
    this.statusDiv = document.getElementById('status');
    this.button = document.getElementById('actionBtn');

    // 初始化所有输入字段引用
    this.config.ui.inputs.forEach(input => {
      this.inputs[input.id] = document.getElementById(input.id);
    });
  }

  // 初始化事件监听器
  initializeEventListeners() {
    // 自动填充URL
    const urlInput = this.config.ui.inputs.find(input => input.autoFill);
    if (urlInput) {
      chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
        const tab = tabs[0];
        if (tab?.url) {
          this.inputs[urlInput.id].value = tab.url;
        }
      });
    }

    // 按钮点击事件
    this.button.addEventListener('click', () => this.handleAction());
  }

// framework.js 中的 makeApiCall 方法修改如下
async makeApiCall(parameters) {
    try {
      const response = await fetch(this.config.api.endpoint, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.config.api.authToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          workflow_id: this.config.api.workflowId,
          parameters: parameters
        })
      });

      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      let buffer = '';
      let output = '';

      // 初始化状态显示
      this.updateStatus('开始采集...', 'success', true);

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });

        const events = buffer.split('\n\n');
        buffer = events.pop() || '';

        for (const event of events) {
          if (!event.trim()) continue;

          const lines = event.split('\n');
          for (const line of lines) {
            if (line.startsWith('data:')) {
              try {
                const data = JSON.parse(line.slice(5));
                if (data.content) {
                  if (data.node_is_finish) {
                    output += data.content + '\n';
                  } else {
                    output += data.content;
                  }
                  // 追加更新状态
                  this.updateStatus(output, 'success', false);
                }
              } catch (e) {
                console.error('解析事件数据失败:', e);
              }
            }
          }
        }
      }

      return output;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  // 修改更新状态的方法，添加 isNew 参数来控制是否覆盖内容
  updateStatus(message, type, isNew = true) {
    if (this.statusDiv) {
      if (isNew) {
        this.statusDiv.textContent = message;
      } else {
        // 追加内容而不是覆盖
        this.statusDiv.textContent = message;
      }
      this.statusDiv.className = `status ${type}`;
      this.statusDiv.style.display = 'block';
      this.statusDiv.scrollTop = this.statusDiv.scrollHeight;
    }
  }

  // 处理动作的方法也需要相应修改
  async handleAction() {
    try {
      const parameters = {};
      for (const input of this.config.ui.inputs) {
        const value = this.inputs[input.id].value;
        if (input.required && !value) {
          this.updateStatus(this.config.ui.messages.inputRequired, 'error', true);
          return;
        }
        parameters[input.paramName] = input.type === 'select' ? parseInt(value) : value;
      }

      this.button.disabled = true;
      this.button.textContent = this.config.ui.button.loadingText;

      const output = await this.makeApiCall(parameters);

      // 追加完成消息而不是覆盖
      this.updateStatus(output + '\n' + this.config.ui.messages.success, 'success', false);

    } catch (error) {
      this.updateStatus(this.config.ui.messages.error + error.message, 'error', true);
    } finally {
      this.button.disabled = false;
      this.button.textContent = this.config.ui.button.text;
    }
  }
}