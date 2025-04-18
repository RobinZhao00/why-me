import { useReducer} from "react"

const reducerCreator = (reducer) => (initState, initializer) => useReducer(reducer, initState, initializer)
const countReducer = reducerCreator((state, action) => {
  switch (action.type) {
    case 'increment':
      return { count: state.count + 1 }
    case 'decrement':
      return { count: state.count - 1 }
    default:
      throw new Error(`Unknown action type: ${action.type}`)
  }
})


export {
  countReducer
} 

