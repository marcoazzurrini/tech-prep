export function applyAction(state, action) {
  switch (action.type) {
    case "add": {
      const todo = { id: action.id, text: action.text, done: false };

      return { ...state, todos: [...state.todos, todo] };
    }
    case "toggle": {
      return {
        ...state,
        todos: state.todos.map((todo) => (todo.id === action.id ? { ...todo, done: !todo.done } : todo)),
      };
    }
    case "remove": {
      return { ...state, todos: state.todos.filter((todo) => todo.id !== action.id) };
    }
    case "filter": {
      return { ...state, filter: action.value };
    }
    default: {
      return state;
    }
  }
}
