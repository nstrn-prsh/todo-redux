export const logActions = createStore => {
    return (rootReducer, preloadedState, enhancer) => {
        const store = createStore(rootReducer, preloadedState, enhancer)

        function logActions(action) {
            const result = store.dispatch(action)
            console.log(action)

            return result
        }

        return { ...store, dispatch: logActions }
    }
}

export const logState = createStore => {
    return (rootReducer, preloadedState, enhancer) => {
        const store = createStore(rootReducer, preloadedState, enhancer)

        function logState() {
            const state = store.getState()
            console.log(state)

            return state
        }

        return { ...store, getState: logState }
    }
}