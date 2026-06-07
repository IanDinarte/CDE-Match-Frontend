// import { useState } from "react";
// import api from "./api"; 

// export default function useSuggestion() {
//   const [members, setMembers] = useState([]);
//   const [suggestedMemberIds, setSuggestedMemberIds] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [modalActive, setModalActive] = useState(false);

//   const loadMembers = (dealId, ownerId) => {
//     setModalActive(true);
//     setLoading(true);

//     api
//       .get(`api/member/suggest?dealId=${dealId}&excludeId=${ownerId}`)
//       .then((res) => {
//         const membersList =
//           res.data.members !== undefined ? res.data.members : res.data;
//         const suggestedIds = res.data.alreadySuggestedIds || [];

//         setMembers(membersList || []);
//         setSuggestedMemberIds(suggestedIds);
//         setLoading(false);
//       })
//       .catch((error) => {
//         console.log("Erro ao carregar membros:", error.message);
//         setLoading(false);
//       });
//   };

//   const sendSuggestion = (dealId, memberId) => {
//     const suggestionData = {
//       dealId: dealId,
//       suggestedTo: memberId,
//     };

//     api
//       .post("api/deal/suggestion", suggestionData)
//       .then(() => {
//         setSuggestedMemberIds((prevIds) => {
//           if (!prevIds.includes(memberId)) {
//             return [...prevIds, memberId];
//           }
//           return prevIds;
//         });
//       })
//       .catch((error) => {
//         console.log("Erro ao enviar sugestão:", error.message);
//       });
//   };

//   return {
//     members,
//     suggestedMemberIds,
//     loading,
//     modalActive,
//     setModalActive,
//     loadMembers,
//     sendSuggestion,
//   };
// }
