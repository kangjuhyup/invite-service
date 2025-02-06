import { useState, useRef, useEffect } from "react";

const useMoveResize = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [size, setSize] = useState({ width: 200, height: 200 });
  const [angle, setAngle] = useState(0);
  const [dragging, setDragging] = useState(false);
  const [resizing, setResizing] = useState(false);
  const [rotating, setRotating] = useState(false);

  const dragRef = useRef({ x: 0, y: 0 });
  const sizeRef = useRef({ width: 0, height: 0 });
  const rotateRef = useRef({ startAngle: 0, elementAngle: 0 });

  // 마우스/터치 이벤트 시작 시 호출
  const handleMouseDown = (e: React.MouseEvent | React.TouchEvent) => {
    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
    const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;
    const target = e.currentTarget as HTMLElement;

    // 클래스 이름으로 핸들 타입 확인
    if (target.classList.contains("resize-handle")) {
      // 리사이즈 시작
      e.stopPropagation();
      setResizing(true);
      sizeRef.current = { width: clientX, height: clientY };
    } else if (target.classList.contains("rotate-handle")) {
      // 회전 시작
      e.stopPropagation();
      setRotating(true);
      const rect = target.parentElement?.getBoundingClientRect() || {
        left: 0,
        top: 0,
        width: 0,
        height: 0,
      };
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      rotateRef.current = {
        startAngle: Math.atan2(clientY - centerY, clientX - centerX),
        elementAngle: angle,
      };
    } else {
      // 이동 시작
      setDragging(true);
      dragRef.current = { x: clientX, y: clientY };
    }
  };

  // 마우스/터치 이동 시 호출
  const handleMouseMove = (e: MouseEvent | TouchEvent) => {
    e.preventDefault();
    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
    const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;

    if (dragging) {
      // 이동 처리
      const deltaX = clientX - dragRef.current.x;
      const deltaY = clientY - dragRef.current.y;
      setPosition((prev) => ({
        x: prev.x + deltaX,
        y: prev.y + deltaY,
      }));
      dragRef.current = { x: clientX, y: clientY };
    } else if (resizing) {
      // 크기 조절 처리
      const deltaWidth = clientX - sizeRef.current.width;
      const deltaHeight = clientY - sizeRef.current.height;
      setSize((prev) => ({
        width: Math.max(50, prev.width + deltaWidth),
        height: Math.max(50, prev.height + deltaHeight),
      }));
      sizeRef.current = { width: clientX, height: clientY };
    } else if (rotating) {
      // 회전 처리
      const target = e.target as HTMLElement;
      const container = target.closest(".image-container");
      if (!container) return;
      const rect = container.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const currentAngle = Math.atan2(clientY - centerY, clientX - centerX);
      const angleDiff =
        (currentAngle - rotateRef.current.startAngle) * (180 / Math.PI);

      setAngle((prevAngle) => {
        const newAngle = (rotateRef.current.elementAngle + angleDiff) % 360;
        return newAngle < 0 ? newAngle + 360 : newAngle;
      });
    }
  };

  // 마우스/터치 종료 시 호출
  const handleMouseUp = () => {
    setDragging(false);
    setResizing(false);
    setRotating(false);
  };

  useEffect(() => {
    const options = { passive: false };

    if (dragging || resizing || rotating) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
      document.addEventListener("touchmove", handleMouseMove, options);
      document.addEventListener("touchend", handleMouseUp, options);
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
      document.removeEventListener("touchmove", handleMouseMove);
      document.removeEventListener("touchend", handleMouseUp);
    };
  }, [dragging, resizing, rotating]);

  const init = (
    position: { x: number; y: number },
    size?: { width: number; height: number },
    initialAngle?: number
  ) => {
    setPosition(position);
    if (size) setSize(size);
    if (initialAngle !== undefined) setAngle(initialAngle);
  };

  return {
    position,
    size,
    angle,
    handleMouseDown,
    init,
  };
};

export default useMoveResize;
