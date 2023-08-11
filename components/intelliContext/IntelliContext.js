import { createContext } from "react";

const IntelliContext = createContext({
  user: null,
  setUser: () => {},
  isAuthenticated: false,
  setIsAuthenticated: () => {},
  // setSelectedAgent: () => {},
  // setSelectedAgentByName: (agentName) => {
  //   console.log("setSelectedAgentByName");
  //   console.log(agentName);
  // },
});

export default IntelliContext;
