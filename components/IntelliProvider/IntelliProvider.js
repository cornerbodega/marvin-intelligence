import { useState } from "react";
import IntelliContext from "../intelliContext/IntelliContext";

function IntelliProvider({ children }) {
  const [intelliUser, setIntelliUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState({});
  // const [selectedAgentByName, setSelectedAgentByName] = useState({});
  return (
    <IntelliContext.Provider
      value={{
        intelliUser,
        setIntelliUser,
        isAuthenticated,
        // setIsAuthenticated,
        // setSelectedAgent,
        // selectedAgent,
        // setSelectedAgentByName,
      }}
    >
      {children}
    </IntelliContext.Provider>
  );
}

export default IntelliProvider;
