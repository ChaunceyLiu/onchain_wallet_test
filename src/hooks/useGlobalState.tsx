import {
  createContext,
  ReactNode,
  useContext,
  useReducer,
  Dispatch,
} from "react";

interface State {
  balance: number;
}

// 定义Action类型
type Action = { type: "UPDATE_ACCOUNT"; payload: number };
// 可扩展其他Action类型
// | { type: 'RESET_ACCOUNT' };

type ContextType = {
  state: State;
  dispatch: Dispatch<Action>;
};

const StateContext = createContext<ContextType>({
  state: { balance: 0 },
  dispatch: () => null,
});

export const StateProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(
    (prevState: State, action: Action): State => {
      switch (action.type) {
        case "UPDATE_ACCOUNT":
          return { ...prevState, balance: action.payload };
        default:
          return prevState;
      }
    },
    { balance: 0 }
  );

  return (
    <StateContext.Provider value={{ state, dispatch }}>
      {children}
    </StateContext.Provider>
  );
};

// 快捷使用 Hook
export const useGlobalState = (): ContextType => {
  const context = useContext(StateContext);
  if (!context) {
    throw new Error("useGlobalState must be used within a StateProvider");
  }
  return context;
};
