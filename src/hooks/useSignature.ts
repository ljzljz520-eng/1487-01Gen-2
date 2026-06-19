import { useRef, useState, useCallback, useEffect } from 'react';

interface Point {
  x: number;
  y: number;
  time: number;
}

interface Stroke {
  points: Point[];
  color: string;
  width: number;
}

interface UseSignatureOptions {
  width?: number;
  height?: number;
  penColor?: string;
  penWidth?: number;
  backgroundColor?: string;
}

interface UseSignatureReturn {
  canvasRef: React.RefObject<HTMLCanvasElement>;
  isDrawing: boolean;
  isEmpty: boolean;
  strokes: Stroke[];
  clear: () => void;
  undo: () => void;
  toDataURL: (type?: 'png' | 'jpeg' | 'svg') => string;
  canUndo: boolean;
}

export function useSignature(
  options: UseSignatureOptions = {}
): UseSignatureReturn {
  const {
    width = 600,
    height = 200,
    penColor = '#1a1a1a',
    penWidth = 2,
    backgroundColor = '#ffffff'
  } = options;

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [strokes, setStrokes] = useState<Stroke[]>([]);
  const [currentStroke, setCurrentStroke] = useState<Stroke | null>(null);

  const redraw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    for (const stroke of strokes) {
      if (stroke.points.length < 2) continue;

      ctx.beginPath();
      ctx.strokeStyle = stroke.color;
      ctx.lineWidth = stroke.width;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      ctx.moveTo(stroke.points[0].x, stroke.points[0].y);
      for (let i = 1; i < stroke.points.length; i++) {
        ctx.lineTo(stroke.points[i].x, stroke.points[i].y);
      }
      ctx.stroke();
    }

    if (currentStroke && currentStroke.points.length >= 2) {
      ctx.beginPath();
      ctx.strokeStyle = currentStroke.color;
      ctx.lineWidth = currentStroke.width;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      ctx.moveTo(currentStroke.points[0].x, currentStroke.points[0].y);
      for (let i = 1; i < currentStroke.points.length; i++) {
        ctx.lineTo(currentStroke.points[i].x, currentStroke.points[i].y);
      }
      ctx.stroke();
    }
  }, [strokes, currentStroke, backgroundColor]);

  const getPoint = useCallback((e: React.MouseEvent | React.TouchEvent | MouseEvent | TouchEvent): Point | null => {
    const canvas = canvasRef.current;
    if (!canvas) return null;

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    let clientX: number, clientY: number;

    if ('touches' in e) {
      if (e.touches.length === 0) return null;
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }

    return {
      x: (clientX - rect.left) * scaleX,
      y: (clientY - rect.top) * scaleY,
      time: Date.now()
    };
  }, []);

  const startDrawing = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    const point = getPoint(e);
    if (!point) return;

    setIsDrawing(true);
    setCurrentStroke({
      points: [point],
      color: penColor,
      width: penWidth
    });
  }, [getPoint, penColor, penWidth]);

  const draw = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    if (!isDrawing) return;

    const point = getPoint(e);
    if (!point) return;

    setCurrentStroke(prev => {
      if (!prev) return null;
      return {
        ...prev,
        points: [...prev.points, point]
      };
    });
  }, [isDrawing, getPoint]);

  const stopDrawing = useCallback(() => {
    if (!isDrawing) return;
    
    if (currentStroke && currentStroke.points.length > 1) {
      setStrokes(prev => [...prev, currentStroke]);
    }
    
    setIsDrawing(false);
    setCurrentStroke(null);
  }, [isDrawing, currentStroke]);

  const clear = useCallback(() => {
    setStrokes([]);
    setCurrentStroke(null);
    setIsDrawing(false);
  }, []);

  const undo = useCallback(() => {
    setStrokes(prev => prev.slice(0, -1));
  }, []);

  const toDataURL = useCallback((type: 'png' | 'jpeg' | 'svg' = 'png'): string => {
    const canvas = canvasRef.current;
    if (!canvas) return '';

    if (type === 'svg') {
      let svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">`;
      svg += `<rect width="${width}" height="${height}" fill="${backgroundColor}"/>`;
      
      for (const stroke of strokes) {
        if (stroke.points.length < 2) continue;
        
        let path = `M ${stroke.points[0].x} ${stroke.points[0].y}`;
        for (let i = 1; i < stroke.points.length; i++) {
          path += ` L ${stroke.points[i].x} ${stroke.points[i].y}`;
        }
        
        svg += `<path d="${path}" fill="none" stroke="${stroke.color}" stroke-width="${stroke.width}" stroke-linecap="round" stroke-linejoin="round"/>`;
      }
      
      svg += '</svg>';
      return 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svg)));
    }

    return canvas.toDataURL(`image/${type}`, 0.9);
  }, [strokes, width, height, backgroundColor]);

  useEffect(() => {
    redraw();
  }, [redraw]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (isDrawing) {
        e.preventDefault();
        const point = getPoint(e);
        if (!point) return;

        setCurrentStroke(prev => {
          if (!prev) return null;
          return {
            ...prev,
            points: [...prev.points, point]
          };
        });
      }
    };

    const handleMouseUp = () => {
      stopDrawing();
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (isDrawing) {
        e.preventDefault();
        const point = getPoint(e);
        if (!point) return;

        setCurrentStroke(prev => {
          if (!prev) return null;
          return {
            ...prev,
            points: [...prev.points, point]
          };
        });
      }
    };

    const handleTouchEnd = () => {
      stopDrawing();
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('touchmove', handleTouchMove, { passive: false });
    document.addEventListener('touchend', handleTouchEnd);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, [isDrawing, getPoint, stopDrawing]);

  return {
    canvasRef,
    isDrawing,
    isEmpty: strokes.length === 0,
    strokes,
    clear,
    undo,
    toDataURL,
    canUndo: strokes.length > 0
  };
}
