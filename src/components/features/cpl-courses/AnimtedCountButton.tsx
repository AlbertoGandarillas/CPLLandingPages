// import React, { useState, useEffect } from "react";
// import { Button } from "@/components/ui/button";
// import { Mails } from "lucide-react";

// const AnimatedCountButton = ({ selectedCourses, setIsModalOpen }) => {
//   const [animate, setAnimate] = useState(false);

//   useEffect(() => {
//     // Trigger animation when selectedCourses changes
//     setAnimate(true);
//     const timer = setTimeout(() => setAnimate(false), 300); // Duration of animation
//     return () => clearTimeout(timer);
//   }, [selectedCourses.length]);

//   return (
//     <Button
//       onClick={() => setIsModalOpen(true)}
//       disabled={selectedCourses.length === 0}
//       className="relative"
//     >
//       <Mails className="mr-2" />
//       Request CPL Information (
//       <span className={`inline-block ${animate ? "animate-pop" : ""}`}>
//         {selectedCourses.length}
//       </span>
//       )
//     </Button>
//   );
// };

// export default AnimatedCountButton;

// // Add this to your global CSS file or a CSS module
// `
// @keyframes pop {
//   0% {
//     transform: scale(1);
//   }
//   50% {
//     transform: scale(1.3);
//   }
//   100% {
//     transform: scale(1);
//   }
// }

// .animate-pop {
//   animation: pop 0.3s ease-in-out;
// }
// `;
