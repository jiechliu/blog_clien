export enum ReleaseOrderBy {
    UpdateTime = 'updateTime',
    Focus = 'focus',
    Browse = 'browse',
    UserFocus = 'userFocus',
}

export enum CommentType {
    Comment,
    ChildrenComment,
}

export enum ReleaseType {
    Tips,
    Article,
}

// 当前文章是否审批通过
export enum ReleaseStatus {
    UnApproval,
    Success,
    Reject,
  }
  
