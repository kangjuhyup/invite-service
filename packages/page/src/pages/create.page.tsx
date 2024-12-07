import React, { useState, useRef } from 'react';
import { Container, useMantineTheme } from '@mantine/core';
import { DropzoneButton } from '../components/button/dropzone/dropzone.button';
import { FileWithPath, MIME_TYPES } from '@mantine/dropzone';
import MoveResizeImage from '../components/image/move.resize.image';

const CreatePage = () => {
  const [file, setFile] = useState<FileWithPath | null>(null); // 선택된 파일 상태 관리
  const [position, setPosition] = useState({ x: 0, y: 0 }); // 이미지 위치 상태 관리
  const [size, setSize] = useState({ width: 200, height: 200 }); // 이미지 크기 상태 관리
  const [dragging, setDragging] = useState(false); // 드래그 상태 관리
  const [resizing, setResizing] = useState(false); // 크기 조정 상태 관리

  const dragRef = useRef({ x: 0, y: 0 }); // 드래그 시작 지점 저장
  const sizeRef = useRef({ width: 0, height: 0 }); // 크기 조정 시작 크기 저장

  const handleDrop = (files: FileWithPath[]) => {
    setFile(files[0]); // 첫 번째 파일만 설정
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (
      e.target instanceof HTMLDivElement &&
      e.target.className === 'resize-handle'
    ) {
      setResizing(true); // 크기 조정 시작
      sizeRef.current = { width: e.clientX, height: e.clientY }; // 크기 조정 시작 위치 기록
    } else {
      setDragging(true); // 드래그 시작
      dragRef.current = { x: e.clientX, y: e.clientY }; // 드래그 시작 위치 기록
    }
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (dragging) {
      const deltaX = e.clientX - dragRef.current.x; // 마우스 이동 거리 계산
      const deltaY = e.clientY - dragRef.current.y;
      setPosition((prev) => ({
        x: prev.x + deltaX,
        y: prev.y + deltaY,
      }));
      dragRef.current = { x: e.clientX, y: e.clientY }; // 새로운 드래그 시작 위치 기록
    } else if (resizing) {
      const deltaWidth = e.clientX - sizeRef.current.width; // 마우스 이동 거리 계산
      const deltaHeight = e.clientY - sizeRef.current.height;
      setSize((prev) => ({
        width: prev.width + deltaWidth,
        height: prev.height + deltaHeight,
      }));
      sizeRef.current = { width: e.clientX, height: e.clientY }; // 크기 조정 시작 위치 기록
    }
  };

  const handleMouseUp = () => {
    setDragging(false); // 드래그 종료
    setResizing(false); // 크기 조정 종료
  };

  useMantineTheme();

  // MouseMove 이벤트 리스너 등록 및 해제
  React.useEffect(() => {
    if (dragging || resizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    } else {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [dragging, resizing]);

  return (
    <Container style={{ width: '100vw', height: '100vh', padding: 0 }}>
      {/* DropzoneButton: 사용자가 이미지를 드래그 앤 드롭할 수 있도록 설정 */}
      <DropzoneButton
        onDrop={handleDrop}
        mimeTypes={[MIME_TYPES.png, MIME_TYPES.jpeg]} // png 및 jpeg 이미지 파일만 허용
        width="100%"
        height="50px"
      />

      {/* 이미지를 드래그해서 이동하고 크기 조정할 수 있는 Container */}
      <Container
        style={{
          backgroundColor: 'blue',
          width: '100vw',
          height: `calc(100vh - 50px)`, // Dropzone 높이 제외
          overflow: 'hidden', // 이미지가 Container를 초과하지 않도록 설정
          position: 'relative',
        }}
      >
        {file?.type.startsWith('image/') ? (
          <MoveResizeImage
            file={file}
            x={position.x}
            y={position.y}
            width={size.width}
            height={size.height}
            onMove={handleMouseDown}
            onResize={handleMouseDown}
          />
        ) : (
          <></>
        )}
      </Container>
    </Container>
  );
};

export default CreatePage;
