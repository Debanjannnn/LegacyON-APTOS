// "use client";
// import React, { useState } from "react";
// import {
//   motion,
//   AnimatePresence,
//   useScroll,
//   useMotionValueEvent,
//   useSpring,
//   useTransform,
// } from "motion/react";
// import { cn } from "@/lib/utils";
// import { Poppins } from "next/font/google";
// import { Sparkles } from "lucide-react";
// import { InteractiveHoverButton } from "../magicui/interactive-hover-button";
// import { ShimmerButton } from "../magicui/shimmer-button";
// import { BorderBeam } from "../magicui/border-beam";

// const poppins = Poppins({
//   weight: ['400', '500', '600', '700'],
//   subsets: ['latin'],
// });

// export const FloatingNav = ({
//   navItems,
//   className,
// }: {
//   navItems: {
//     name: string;
//     link: string;
//     icon?: any;
//   }[];
//   className?: string;
// }) => {
//   const { scrollYProgress } = useScroll();
//   const [isVisible, setIsVisible] = useState(false);
//   const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

//   React.useEffect(() => {
//     setIsVisible(true);
//   }, []);

//   const getScale = (index: number) => {
//     if (hoveredIndex === null) return 1;
    
//     if (index === hoveredIndex) {
//       return 1.2; // Scale up the hovered item
//     }
    
//     return 1; // Keep other items at normal size
//   };

//   return (
//     <AnimatePresence mode="wait">
//       <motion.div
//         initial={{
//           opacity: 0,
//           y: -100,
//         }}
//         animate={{
//           y: 0,
//           opacity: 1,
//         }}
//         transition={{
//           duration: 0.8,
//           type: "spring",
//           stiffness: 50,
//           damping: 15
//         }}
//         className={cn(
//           "flex max-w-4xl mx-auto border border-gray-800 dark:border-white/[0.2] rounded-3xl bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#df500f] via-black to-black shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),0px_1px_0px_0px_rgba(25,28,33,0.02),0px_0px_0px_1px_rgba(25,28,33,0.08)] anim z-[5000] px-4 py-2 items-center justify-between space-x-2 relative overflow-hidden",
//           className
//         )}
//       >
//         {/* Animated gradient background */}
//         <motion.div 
//           className="absolute inset-0 z-[-1] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#df500f] via-black to-black rounded-3xl"
//           animate={{
//             scale: [1, 1.03, 0.97, 1.02, 1],
//             y: [0, -2, 3, -2, 0],
//             rotate: [0, 0.5, -0.5, 0.3, 0],
//             opacity: [0.7, 0.8, 0.75, 0.8, 0.7],
//           }}
//           transition={{
//             duration: 8,
//             repeat: Infinity,
//             ease: "easeInOut",
//             times: [0, 0.25, 0.5, 0.75, 1]
//           }}
//         />
        
//         <div className="flex items-center space-x-2">
//           <Sparkles className="w-6 h-6 text-[#df500f]" />
//           <span className={cn("text-xl font-semibold text-white", poppins.className)}>Qubik</span>
//         </div>

//         <div className="flex items-center space-x-6">
//           {navItems.map((navItem: any, idx: number) => (
//             <motion.a
//               key={`link=${idx}`}
//               href={navItem.link}
//               className={cn(
//                 "relative text-gray-400 items-center flex space-x-1",
//                 poppins.className
//               )}
//             >
//               <span className="block sm:hidden">{navItem.icon}</span>
//               <span className="hidden sm:block text-sm">{navItem.name}</span>
//             </motion.a>
//           ))}
//         </div>

        
//         <ShimmerButton>
//           <BorderBeam duration={8} colorFrom="#df500f" size={40} colorTo="#8c2744"/>
//           Try Demo
//         </ShimmerButton>
        
//       </motion.div>
//     </AnimatePresence>
//   );
// };

"use client"
import React, { useState } from "react"
import { motion, AnimatePresence, useScroll } from "motion/react"
import { cn } from "@/lib/utils"
import { Poppins } from "next/font/google"
import { Sparkles } from "lucide-react"
import { ShimmerButton } from "../magicui/shimmer-button"
import { BorderBeam } from "../magicui/border-beam"

const poppins = Poppins({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
})

export const FloatingNav = ({
  navItems,
  className,
}: {
  navItems: {
    name: string
    link: string
    icon?: any
  }[]
  className?: string
}) => {
  const { scrollYProgress } = useScroll()
  const [isVisible, setIsVisible] = useState(false)
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  React.useEffect(() => {
    setIsVisible(true)
  }, [])

  const getScale = (index: number) => {
    if (hoveredIndex === null) return 1

    if (index === hoveredIndex) {
      return 1.2 // Scale up the hovered item
    }

    return 1 // Keep other items at normal size
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div
        initial={{
          opacity: 0,
          y: -100,
        }}
        animate={{
          y: 0,
          opacity: 1,
        }}
        transition={{
          duration: 0.8,
          type: "spring",
          stiffness: 50,
          damping: 15,
        }}
        className={cn(
          "flex max-w-4xl mx-auto border border-white/20 dark:border-gray-300/20 rounded-3xl bg-white/10 backdrop-blur-md shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),0px_1px_0px_0px_rgba(255,255,255,0.1),0px_0px_0px_1px_rgba(255,255,255,0.05)] anim z-[5000] px-4 py-2 items-center justify-between space-x-2 relative overflow-hidden",
          className,
        )}
      >
        {/* Animated gradient background - now transparent */}
        <motion.div
          className="absolute inset-0 z-[-1] bg-gradient-to-r from-white/5 via-gray-100/10 to-white/5 rounded-3xl"
          animate={{
            scale: [1, 1.03, 0.97, 1.02, 1],
            y: [0, -2, 3, -2, 0],
            rotate: [0, 0.5, -0.5, 0.3, 0],
            opacity: [0.3, 0.5, 0.4, 0.5, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
            times: [0, 0.25, 0.5, 0.75, 1],
          }}
        />

        <div className="flex items-center space-x-2">
            <img src="https://i.pinimg.com/736x/49/b3/4c/49b34c656d327c34137701edfc7bc6ae.jpg" alt="Fork Work" width={32} height={32} className="rounded-full" />
          <span className={cn("text-xl font-semibold text-black dark:text-white", poppins.className)}>Qubik</span>
        </div>

        <div className="flex items-center space-x-6 ">
          {navItems.map((navItem: any, idx: number) => (
            <motion.a
              key={`link=${idx}`}
              href={navItem.link}
              className={cn("relative text-black dark:text-black  items-center flex space-x-1", poppins.className)}
            >
              <span className="block sm:hidden">{navItem.icon}</span>
              <span className="hidden sm:block text-sm">{navItem.name}</span>
            </motion.a>
          ))}
        </div>

        <ShimmerButton>
          <BorderBeam duration={8} colorFrom="#df500f" size={40} colorTo="#8c2744" />
          Try Demo
        </ShimmerButton>
      </motion.div>
    </AnimatePresence>
  )
}
