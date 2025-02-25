import {INavigator} from "./navigator";
import {PlaywrightNavigator} from "./impl/playwright_navigator";

function getNavigator(type: "playwright" | "browser"): INavigator {
    switch (type) {
        case "playwright":
            return new PlaywrightNavigator()
        default:
            throw new Error("Navigator not supported")
    }
}

export {getNavigator}