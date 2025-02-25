interface INavigator {
    init(messages_url: string): Promise<void>
    getMostRecentUnreadChatHistory(): Promise<string[] | null>
    respondToChat(message: string): Promise<void>
    closeSession(): Promise<void>
}

export {INavigator}