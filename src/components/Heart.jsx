import React, { useEffect, useState, useRef, memo } from "react";
import { nanoid } from "nanoid";
import "./Heart.css"; // You'll need to create this CSS file

const PATH_LENGTH = 1506;
const LAYERS = 20;
const LAYER_GAP = 2; // In pixels

const clamp = (min, max, n) => Math.min(max, Math.max(min, n));

const useDocumentEvent = (event, handler) => {
  useEffect(() => {
    const events = event.split(" ");
    events.forEach((event) => document.addEventListener(event, handler));
    return () =>
      events.forEach((event) => document.removeEventListener(event, handler));
  }, [event, handler]);
};

const usePerishable = () => {
  const [items, setItems] = useState([]);
  const timeouts = useRef({});

  useEffect(() => {
    return () => Object.values(timeouts.current).forEach(clearTimeout);
  }, []);

  return {
    items,
    add: (delay, data) => {
      const id = nanoid();
      setItems((arr) => [...arr, { id, data }]);
      timeouts.current[id] = setTimeout(() => {
        setItems((ids) => ids.filter((item) => item.id !== id));
        delete timeouts.current[id];
      }, delay);
    },
  };
};

const useCursorTilt = ({ ref, tilt, bounds }) => {
  const [rotate, setRotate] = useState([-25, 25]);

  useDocumentEvent("mousemove", (e) => {
    requestAnimationFrame(() => {
      const { left, top, width, height } = ref.current.getBoundingClientRect();
      const [x, y] = [e.clientX, e.clientY];
      const rect = bounds
        ? {
            top: top - bounds,
            left: left - bounds,
            width: width + bounds * 2,
            height: height + bounds * 2,
          }
        : {
            top: 0,
            left: 0,
            width: window.innerWidth,
            height: window.innerHeight,
          };

      setRotate([
        (-(clamp(0, rect.height, y - rect.top) - rect.height / 2) /
          rect.height) *
          tilt,
        ((clamp(0, rect.width, x - rect.left) - rect.width / 2) / rect.width) *
          tilt,
      ]);
    });
  });
  return rotate;
};

const Splash = memo(({ circles }) => {
  return (
    <svg viewBox="0 0 500 430" className="splash">
      {circles.map(({ id }) => (
        <HeartPath key={id} />
      ))}
    </svg>
  );
});

const HeartPath = () => (
  <path d="M500 143.64C500 286.45 321.49 322.15 250.08 429.26C178.68 322.15 0.17 286.45 0.17 143.64C0.17 72.24 53.72 0.83 142.98 0.83C214.38 0.83 250.08 72.24 250.08 72.24C250.08 72.24 285.79 0.83 357.19 0.83C446.45 0.83 500 72.24 500 143.64Z" />
);

const ShineSVG = ({ x, opacity, rotate, translateZ }) => (
  <svg
    viewBox="0 0 500 430"
    style={{
      transform: `rotateX(${rotate.x}deg) rotateY(${rotate.y}deg) translateZ(${translateZ}px) scale(0.9)`,
      transition: "opacity 0.3s, transform 0.3s",
    }}
    className="heart-shine"
  >
    <defs>
      <clipPath id="heart">
        <HeartPath />
      </clipPath>
    </defs>
    <rect
      x={500 - x * 700}
      y="0"
      width="200"
      height="430"
      fill={`rgba(255,255,255,${opacity}`}
      clipPath="url(#heart)"
    />
  </svg>
);

const HeartSVG = ({
  rotate: { x, y },
  translateZ,
  strokeDashoffset,
  scale = 1,
  className,
}) => (
  <svg
    className={className}
    viewBox="0 0 500 430"
    style={{
      transform: `rotateX(${x}deg) rotateY(${y}deg) translateZ(${translateZ}px) scale(${scale})`,
      strokeDashoffset,
      transition: "transform 0.3s, stroke-dashoffset 0.3s",
    }}
  >
    <HeartPath />
  </svg>
);

const Heart = ({
  // New props for positioning and styling
  position = "relative",
  top = "auto",
  left = "auto",
  right = "auto",
  bottom = "auto",
  transform = "",
  className = "",
  style = {},
  width = "auto",
  height = "auto",
  zIndex = "auto",
}) => {
  const ref = useRef();
  const [love, setLove] = useState(1);
  const [pressed, setPressed] = useState(false);
  const { items, add } = usePerishable();
  const [x, y] = useCursorTilt({ ref, tilt: 50, bounds: 50 });
  const offset =
    (Math.atan2(y, x) / Math.PI) * (PATH_LENGTH / 2) + PATH_LENGTH / 2;

  useDocumentEvent("mouseup", () => {
    setPressed((pressed) => {
      if (pressed) {
        setLove((a) => {
          if (a >= 1) {
            return 0;
          }
          add(1000);
          return a + 0.3;
        });
      }
      return false;
    });
  });

  // Combine custom styles with positioning styles
  const containerStyle = {
    position,
    top,
    left,
    right,
    bottom,
    transform,
    width,
    height,
    zIndex,
    ...style,
  };

  return (
    <button
      className={`heart ${className}`}
      onMouseDown={() => setPressed(true)}
      ref={ref}
      style={{
        ...containerStyle,
        "--lightness": `${love * 80 + 20}%`,
        "--scale": 0.8 + love * 0.2 - (pressed ? 0.1 : 0),
        transition: "transform 0.3s, --scale 0.3s",
      }}
    >
      <div className="inner-wrapper">
        <Splash circles={items} />
        {[...new Array(LAYERS)].map((_, i) => (
          <HeartSVG
            key={i}
            className="heart-layer"
            rotate={{ x, y }}
            translateZ={i * LAYER_GAP}
            scale={Math.sin((i / LAYERS) * Math.PI) / 10 + 1}
          />
        ))}
        <HeartSVG
          className="heart-stroke"
          rotate={{ x, y }}
          translateZ={(LAYERS + 1) * LAYER_GAP}
          strokeDashoffset={offset}
          scale={0.9}
        />
        <ShineSVG
          x={y / 50 + 0.5}
          opacity={x / 200 + 0.5}
          rotate={{ x, y }}
          translateZ={(LAYERS + 1) * LAYER_GAP}
        />
      </div>
    </button>
  );
};

export default Heart;
