// import { useEffect, useRef, useState } from "react";
// import * as PIXI from "pixi.js";
// import { PixelateFilter } from "@pixi/filter-pixelate";

// const IntelliSlideshow = ({ imageUrls }) => {
//   const [currentIndex, setCurrentIndex] = useState(0);
//   const pixiContainer = useRef();
//   const [showFolderImageTransition, setShowFolderImageTransition] =
//     useState(false);
//   const [isTransitioning, setIsTransitioning] = useState(false);
//   const app = useRef(null);
//   const sprite = useRef(null);

//   const resize = () => {
//     if (app.current) {
//       app.current.renderer.resize(window.innerWidth, 500);
//       updateSprite(); // Update sprite to fit new dimensions
//     }
//   };

//   useEffect(() => {
//     app.current = new PIXI.Application({
//       transparent: true,
//       width: window.innerWidth,
//       height: 500,
//     });
//     pixiContainer.current.appendChild(app.current.view);

//     updateSprite();

//     const interval = setInterval(() => {
//       if (!isTransitioning) {
//         setShowFolderImageTransition((prev) => !prev);
//       }
//     }, 5000);

//     window.addEventListener("resize", resize);

//     return () => {
//       clearInterval(interval);
//       window.removeEventListener("resize", resize);
//       app.current.destroy(true);
//     };
//   }, [imageUrls]);

//   const updateSprite = () => {
//     if (sprite.current) {
//       app.current.stage.removeChild(sprite.current);
//       sprite.current.destroy();
//     }
//     const baseTexture = PIXI.BaseTexture.from(imageUrls[currentIndex]);
//     sprite.current = PIXI.Sprite.from(baseTexture);

//     const containerRatio = app.current.screen.width / app.current.screen.height;
//     const spriteRatio = sprite.current.width / sprite.current.height;

//     if (containerRatio > spriteRatio) {
//       sprite.current.width = app.current.screen.width;
//       sprite.current.height = app.current.screen.width / spriteRatio;
//     } else {
//       sprite.current.height = app.current.screen.height;
//       sprite.current.width = app.current.screen.height * spriteRatio;
//     }

//     app.current.stage.addChild(sprite.current);
//   };

//   useEffect(() => {
//     if (!showFolderImageTransition || isTransitioning) return;

//     setIsTransitioning(true);

//     const filter = new PixelateFilter();
//     sprite.current.filters = [filter];
//     let increasing = true;

//     const animate = () => {
//       if (increasing) {
//         filter.size[0] += 1;
//         filter.size[1] += 1;

//         if (filter.size[0] > 50) {
//           increasing = false;
//           setCurrentIndex((prevIndex) => (prevIndex + 1) % imageUrls.length);
//         }
//       } else if (filter.size[0] > 2) {
//         filter.size[0] -= 1;
//         filter.size[1] -= 1;
//       }

//       if (!increasing && filter.size[0] === 2) {
//         setShowFolderImageTransition(false);
//         setIsTransitioning(false);
//         app.current.ticker.remove(animate);
//       }
//     };

//     app.current.ticker.add(animate);
//   }, [currentIndex, showFolderImageTransition, imageUrls]);

//   useEffect(() => {
//     updateSprite();
//   }, [currentIndex, imageUrls]);

//   return (
//     <div ref={pixiContainer} style={{ width: "100%", height: "500px" }}></div>
//   );
// };

// export default IntelliSlideshow;
