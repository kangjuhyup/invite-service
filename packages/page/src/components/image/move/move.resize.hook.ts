import { useState, useRef, useEffect } from 'react';

const useMoveResize = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [size, setSize] = useState({ width: 200, height: 200 });
  const [dragging, setDragging] = useState(false);
  const [resizing, setResizing] = useState(false);

  const dragRef = useRef({ x: 0, y: 0 });
  const sizeRef = useRef({ width: 0, height: 0 });

  const handleMouseDown = (e: React.MouseEvent | React.TouchEvent) => {
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

    if (
      e.target instanceof HTMLDivElement &&
      e.target.className === 'resize-handle'
    ) {
      setResizing(true);
      sizeRef.current = { width: clientX, height: clientY };
    } else {
      setDragging(true);
      dragRef.current = { x: clientX, y: clientY };
    }
  };

  const handleMouseMove = (e: MouseEvent | TouchEvent) => {
    e.preventDefault();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

    if (dragging) {
      const deltaX = clientX - dragRef.current.x;
      const deltaY = clientY - dragRef.current.y;
      setPosition((prev) => ({
        x: prev.x + deltaX,
        y: prev.y + deltaY,
      }));
      dragRef.current = { x: clientX, y: clientY };
    } else if (resizing) {
      const deltaWidth = clientX - sizeRef.current.width;
      const deltaHeight = clientY - sizeRef.current.height;
      setSize((prev) => ({
        width: prev.width + deltaWidth,
        height: prev.height + deltaHeight,
      }));
      sizeRef.current = { width: clientX, height: clientY };
    }
  };

  const handleMouseUp = () => {
    setDragging(false);
    setResizing(false);
  };

  useEffect(() => {
    const options = { passive: false };

    if (dragging || resizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.addEventListener('touchmove', handleMouseMove, options);
      document.addEventListener('touchend', handleMouseUp, options);
    } else {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('touchmove', handleMouseMove);
      document.removeEventListener('touchend', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('touchmove', handleMouseMove);
      document.removeEventListener('touchend', handleMouseUp);
    };
  }, [dragging, resizing]);

  const init = (
    size: { width: number; height: number },
    position: { x: number; y: number },
  ) => {
    setPosition(position);
    setSize(size);
  };

  return {
    position,
    size,
    handleMouseDown,
    init,
  };
};

export default useMoveResize;
