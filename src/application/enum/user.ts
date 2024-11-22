export enum UserFancFocus {
    Fanc,
    Focus,
}

export enum GoldType {
  Unknow,
  Init, // 初始资本
  Login, // 登录奖励
  CreateTheme, // 创建主题
  CreateReply, // 创建回复
  ThemeReply, // 主题回复收益
  SystemGift, // 系统赠送
  PurchaseBorder, // 购买头像边框
}

export const UserFancFocusLabel = {
  [UserFancFocus.Fanc]: '粉丝',
  [UserFancFocus.Focus]: '关注'
}

export const GoldTypeLabel = {
  [GoldType.Unknow]: '',
  [GoldType.Init]: '初始资金',
  [GoldType.Login]: '每日登录',
  [GoldType.CreateTheme]: '创建主题',
  [GoldType.CreateReply]: '创建回复',
  [GoldType.ThemeReply]: '主题回复收益',
  [GoldType.SystemGift]: '系统赠送',
  [GoldType.PurchaseBorder]: '商城消费'
}