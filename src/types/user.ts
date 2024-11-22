export const rule = {
  username: [
    {
      min: 6,
      message: '用户名不能少于6位'
    },
    {
      max: 15,
      message: '用户名长度不能超过15位'
    },
    {
      required: true,
      message: '用户名不能为空'
    },
    {
      pattern: /^\w+$/,
      message: '用户名由字母、数字、下划线组成'
    },
  ],
  password: [
    {
      min: 6,
      message: '密码不能少于6位'
    },
    {
      max: 15,
      message: '密码长度不能超过15位'
    },
    {
      required: true,
      message: '密码不能为空'
    },
    {
      pattern: /^[^\u4e00-\u9fa5]+$/,
      message: '密码由数字，字母，下划线组成'
    }
  ],
  cname: [
    {
      min: 2,
      message: '昵称不能少于2位'
    },
    {
      max: 15,
      message: '昵称长度不能超过20位'
    },
    {
      required: true,
      message: '昵称不能为空'
    },
  ],
  email: [
    {
      required: true,
      message: '邮件地址不能为空'
    },
    {
      pattern: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,
      message: '请输入正确的邮件地址'
    }
  ],
  code: [
    {
      required: true,
      message: '验证码不能为空'
    },
  ]
};