interface INavigator {
    getMessages(): Promise<string[] | null>
    respondToChat(message: string): Promise<void>
}

export {INavigator}