// // hooks/useUserId.js
// import { useState, useEffect } from "react";
// import { v4 as uuidv4 } from "uuid"; // UUID library

// const useUserId = (authUserId) => {
//   const [userId, setUserId] = useState(authUserId || "");

//   useEffect(() => {
//     if (!authUserId) {
//       let guestUserId = localStorage.getItem("guestUserId");
//       if (!guestUserId) {
//         guestUserId = uuidv4();
//         localStorage.setItem("guestUserId", guestUserId);
//         fetchFunnyAgencyName(guestUserId);
//       }
//       setUserId(guestUserId);
//     }
//   }, [authUserId]);

//   const fetchFunnyAgencyName = async (guestUserId) => {
//     try {
//       const response = await fetch("/api/generateFunnyAgencyName");
//       if (response.ok) {
//         const { agencyName } = await response.json();
//         const createUserModel = {
//           userId: guestUserId,
//           email: "not provided",
//           agencyName,
//         };
//         await saveToSupabase("users", createUserModel);
//       }
//     } catch (error) {
//       console.error("Error fetching funny agency name:", error);
//     }
//   };

//   return userId;
// };

// export default useUserId;
