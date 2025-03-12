interface INavigator {
    getMessages(): Promise<string[] | null>
}

export {INavigator}