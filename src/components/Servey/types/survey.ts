export interface User {
  id: string
  name: string
  email: string
  phone: string
  department: string
  lastLogin: string
  avatar: string
}

export interface SurveySettings {
  assignBy: "all" | "select"
  selectedUsers: string[]
  publishNow: boolean
  publishDate: string
  publishTime: string
  notifyPushUp: boolean
  notificationText: string
  showOnFeed: boolean
  sendReminder: boolean
  reminderDate: string
  reminderTime: string
  showOnFeedAgency: boolean
}
