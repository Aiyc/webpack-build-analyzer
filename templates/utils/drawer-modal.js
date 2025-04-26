// drawer-modal.js
(function () {
  const DrawerModal = {
    config: {
      width: 300,
      animationDuration: 0.3,
    },

    init() {
      this.createDOM();
      this.addEventListeners();
      this.injectStyles();
    },

    createDOM() {
      // 创建遮罩层
      this.overlay = document.createElement('div');
      this.overlay.className = 'drawer-overlay';

      // 创建抽屉主体
      this.drawer = document.createElement('div');
      this.drawer.className = 'drawer';

      // 创建内容容器
      this.contentContainer = document.createElement('div');
      this.contentContainer.className = 'drawer-content';

      // 创建关闭按钮
      this.closeBtn = document.createElement('button');
      this.closeBtn.innerHTML = '&times;';
      this.closeBtn.className = 'drawer-close-btn';

      this.drawer.appendChild(this.closeBtn);
      this.drawer.appendChild(this.contentContainer);
      document.body.appendChild(this.overlay);
      document.body.appendChild(this.drawer);
    },

    injectStyles() {
      const style = document.createElement('style');
      style.textContent = `
        .drawer-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.5);
          opacity: 0;
          transition: opacity ${this.config.animationDuration}s ease-in-out;
          z-index: 999;
          pointer-events: none;
        }

        .drawer {
          position: fixed;
          top: 0;
          right: -${this.config.width}px;
          width: ${this.config.width}px;
          height: 100%;
          background: white;
          box-shadow: -2px 0 12px rgba(0, 0, 0, 0.2);
          transition: right ${this.config.animationDuration}s ease-in-out;
          z-index: 1000;
        }

        .drawer-close-btn {
          position: absolute;
          top: 10px;
          right: 10px;
          background: none;
          border: none;
          font-size: 24px;
          cursor: pointer;
          padding: 5px;
        }

        .drawer-content {
          padding: 20px;
          height: calc(100% - 40px);
          overflow-y: auto;
        }

        .drawer-open .drawer-overlay {
          opacity: 1;
          pointer-events: all;
        }

        .drawer-open .drawer {
          right: 0;
        }
      `;
      document.head.appendChild(style);
    },

    addEventListeners() {
      this.overlay.addEventListener('click', this.close.bind(this));
      this.closeBtn.addEventListener('click', this.close.bind(this));
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && document.body.classList.contains('drawer-open')) {
          this.close();
        }
      });
    },

    open(content) {
      // 处理不同内容类型
      if (typeof content === 'string') {
        this.contentContainer.innerHTML = content;
      } else if (content instanceof HTMLElement) {
        this.contentContainer.innerHTML = '';
        this.contentContainer.appendChild(content);
      }

      // 添加打开状态类
      document.body.classList.add('drawer-open');

      // 禁用滚动
      document.body.style.overflow = 'hidden';
    },

    close() {
      document.body.classList.remove('drawer-open');
      document.body.style.overflow = '';
    },
  };

  // 初始化
  DrawerModal.init();

  // 暴露 API
  window.DrawerModal = {
    open: (content) => DrawerModal.open(content),
    close: () => DrawerModal.close(),
    config: (options) => Object.assign(DrawerModal.config, options),
  };
})();
