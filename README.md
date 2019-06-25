### 背景

现阶段，小程序再开发的时候需要4个文件,开发体验有待提高，尝试使用vue单文件组件的方式开发小程序，然后在编译阶段分离单文件组件，并且支持更高的es@next和预编译语言。

> 注意：这里只做文件分离不做语法转义

### smallmina-loader：

#### 实现
 借助社区 mina-loader通过改造成适合支付宝或者微信小程序版本
 
 #### 安装
 
```cmd
npm i smallmina-loader
```

#### loader配置

```javascript
module.exports = {
  module: {
    rules: [
      {
        test: /\.mina$/,
        loader: 'smallmina-loader',
        options:{
            //开发的源文件夹
             source: 'src',
             //编译后的文件交和原文件同目录
             target: 'build',
             //指定扩展名，默认是支付宝格式，如果需要的化可以指定为其他格式
             extension: {
                 style: 'acss',
                 template: 'axml'
             }
        }
      }
    ]
  }
}
```

#### 完成

- [x] 单文件组件
- [x] 预编译css
- [x] 模板语法（pug）
- [x] 提取公共模块

> 在提取公共模块的时候我使用的顶层对象是System。

### 示例
todo.mina
```vue
<template>
    <favorite>收藏小程序，下次使用更方便</favorite>

    <view class="page-todos">

        <view class="user">
            <image class="avatar" src="{{user.avatar || '../../assets/logo.png'}}" background-size="cover"></image>
            <view class="nickname">{{user.nickName && user.nickName + '\'s' || 'My'}} Todo List</view>
        </view>

        <view class="todo-items">

            <checkbox-group class="todo-items-group" onChange="onTodoChanged">
                <label a:for="{{todos}}" a:for-item="item" class="todo-item {{item.completed ? 'checked' : ''}}" a:key="*this">
                    <checkbox class="todo-item-checkbox" value="{{item.text}}" checked="{{item.completed}}" />
                    <text class="todo-item-text">{{item.text}}</text>
                </label>
            </checkbox-group>

        </view>
        <view>
            size:{{size}}
        </view>
        <view class="todo-footer">
            <add-button text="Add Todo" onClickMe="addTodo" ></add-button>
        </view>

    </view>
</template>
<script>
    import base from '../../common/base'
    base()
    const app = getApp();
    Page({
        data: {
            size:base()
        },

        onLoad() {
            app.getUserInfo().then(
                user => {
                    this.setData({
                        user,
                    });
                },
                () => {
                    // 获取用户信息失败
                }
            );
        },

        onShow() {
            this.setData({ todos: app.todos });
        },

        onTodoChanged(e) {
            const checkedTodos = e.detail.value;
            app.todos=app.todos.map((todo)=>{
                todo.completed=checkedTodos.indexOf(todo.text) > -1
                return todo
            })
            // app.todos = app.todos.map(todo => ({
            //     ...todo,
            //     completed: checkedTodos.indexOf(todo.text) > -1,
            // }));
            this.setData({ todos: app.todos });
        },

        addTodo() {
            my.navigateTo({ url: '../add-todo/add-todo' });
        },
    });

</script>
<style lang="stylus">
    .page-todos {
        display: flex;
        flex-direction: column;
        width: 100%;
        max-height: 100vh;
    }

    .user {
        display: flex;
        flex-shrink: 0;
        padding: 30px;
        color: #FFF;
        flex-direction: column;
        align-items: center;
    }

    .avatar {
        width: 130rpx;
        height: 130rpx;
        border-radius: 50%;
        background-color: #FFF;
        align-self: center;
    }

    .nickname {
        padding-top: 40rpx;
        text-align: center;
        font-size: 40rpx;
        font-weight: 100;
    }

    .todo-items {
        flex-grow: 1;
        font-size: 34rpx;
        padding: 50rpx 120rpx;
        color: #0EFFD6;
        overflow: auto;
    }

    .todo-items-group {
        display: flex;
        flex-direction: column;
    }

    .todo-item {
        position: relative;
        margin-bottom: 50rpx;
        padding-left:80rpx;
        line-height: 70rpx;
        height: 80rpx;
        box-sizing: border-box;
        border: 2px solid rgb(14, 255, 214);
        border-radius: 100rpx;
        overflow: hidden;
        text-overflow: ellipsis;
        /* white-space:nowrap; */

        transition: border 0.2s;
    }

    .todo-item:last-child {
        margin-bottom: 0;
    }

    .todo-item::before {
        content: '';
        position: absolute;
        left: 12rpx;
        margin-right: 20rpx;
        width: 45rpx;
        height: 45rpx;
        background-color: rgba(14, 222, 255, 0.3);
        border-radius: 50%;
        top: 50%;
        transform: translateY(-50%);

        transition: background-color 0.2s;
    }

    .todo-item::after {
        content: '';
        position: absolute;
        left: 29rpx;
        width: 8rpx;
        height: 18rpx;
        top: 50%;
        transform: translateY(-60%) rotate(38deg);
        border: 4rpx solid #FFF;
        border-width: 0 4rpx 4rpx 0;
        opacity: 0;

        transition: opacity 0.2s;
    }

    .todo-item-checkbox {
        display: none;
    }

    .checked .todo-item-text {
        text-decoration: line-through;
        color: #1AA0B8;
    }

    .checked.todo-item {
        border: 2px solid rgba(14, 222, 255, 0.2);
    }

    .checked.todo-item::before {
        background-color: rgba(14, 222, 255, 0.2);
    }

    .checked.todo-item::after {
        opacity: 1;
    }



    .todo-footer {
        flex-shrink: 0;
        padding: 50rpx 0 100rpx;
        font-size: 48rpx;
        font-weight: 200;
        text-align: center;
    }
</style>
```
page和component里面的json会复制到对应的文件夹,编译后生成对应的三个文件并把json文件复制回来，小程序所用到的4个文件就齐了

![image](https://cdn.nlark.com/yuque/0/2019/png/336449/1561461994060-a57c0ab3-15ca-445d-a28f-1ed4e83a483d.png)

### webpack个人配置
![github](https://github.com/569835014/minaloaders)