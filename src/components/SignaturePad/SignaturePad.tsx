import React, { useState, useEffect, useCallback, useRef } from 'react';
import { PenLine, RotateCcw, Trash2, Check, Image, AlertCircle } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardBody, Button } from '@/components/ui';
import { cn } from '@/lib/utils';
import { useSignature } from '@/hooks/useSignature';
import type { SignaturePadProps } from './SignaturePad.types';
import type { ValidationError } from '@/types/form';

export const SignaturePad: React.FC<SignaturePadProps> = ({
  width = 600,
  height = 200,
  penColor = '#1a1a1a',
  penWidth = 2,
  backgroundColor = '#ffffff',
  showClearButton = true,
  showUndoButton = true,
  showConfirmButton = true,
  exportFormat = 'png',
  onSign,
  onSignStart,
  onSignEnd,
  onSignClear,
  onConfirm,
  value,
  onChange,
  onValidate,
  required = false,
  readOnly = false,
  disabled = false,
  validators = [],
  className
}) => {
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSigning, setIsSigning] = useState(false);
  const confirmButtonRef = useRef<HTMLButtonElement>(null);

  const {
    canvasRef,
    isDrawing,
    isEmpty,
    strokes,
    clear,
    undo,
    toDataURL,
    canUndo
  } = useSignature({
    width,
    height,
    penColor,
    penWidth,
    backgroundColor
  });

  useEffect(() => {
    if (value && strokes.length === 0 && !isConfirmed) {
      const img = document.createElement('img');
      img.onload = () => {
        const canvas = canvasRef.current;
        if (canvas) {
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.drawImage(img, 0, 0, width, height);
          }
        }
      };
      img.src = value;
      setIsConfirmed(true);
    }
  }, [value, strokes.length, isConfirmed, canvasRef, width, height]);

  const handleMouseDown = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    if (readOnly || disabled || isConfirmed) return;
    setIsSigning(true);
    onSignStart?.();
  }, [readOnly, disabled, isConfirmed, onSignStart]);

  const handleTouchStart = useCallback((e: React.TouchEvent<HTMLCanvasElement>) => {
    if (readOnly || disabled || isConfirmed) return;
    e.preventDefault();
    setIsSigning(true);
    onSignStart?.();
  }, [readOnly, disabled, isConfirmed, onSignStart]);

  const handleMouseUp = useCallback(() => {
    if (!isSigning) return;
    setIsSigning(false);
    const signatureData = toDataURL(exportFormat);
    onSignEnd?.(signatureData);
    onChange?.(signatureData);
    setError(null);
  }, [isSigning, toDataURL, exportFormat, onSignEnd, onChange]);

  const handleClear = useCallback(() => {
    clear();
    setIsConfirmed(false);
    setError(null);
    onSignClear?.();
  }, [clear, onSignClear]);

  const handleUndo = useCallback(() => {
    undo();
    setIsConfirmed(false);
  }, [undo]);

  const handleConfirm = useCallback(() => {
    if (isEmpty) {
      setError('请先签名');
      return;
    }

    const signatureData = toDataURL(exportFormat);
    setIsConfirmed(true);
    onSign?.(signatureData);
    onConfirm?.(signatureData);
    onChange?.(signatureData);
    setError(null);
  }, [isEmpty, toDataURL, exportFormat, onSign, onConfirm, onChange]);

  const validate = useCallback(() => {
    const errors: ValidationError[] = [];
    
    if (required && (isEmpty || !isConfirmed)) {
      errors.push({ field: 'signature', message: '请进行签名确认' });
      setError('请进行签名确认');
    }

    for (const validator of validators) {
      const signatureData = toDataURL(exportFormat);
      const isValid = typeof validator.rule === 'function'
        ? validator.rule(signatureData)
        : validator.rule.test(signatureData);
      
      if (!isValid) {
        errors.push({ field: 'signature', message: validator.message });
        setError(validator.message);
      }
    }

    onValidate?.(errors);
    return errors;
  }, [required, isEmpty, isConfirmed, validators, toDataURL, exportFormat, onValidate]);

  useEffect(() => {
    (window as any).validateSignature = validate;
    return () => {
      delete (window as any).validateSignature;
    };
  }, [validate]);

  useEffect(() => {
    if (!isDrawing && isSigning) {
      handleMouseUp();
    }
  }, [isDrawing, isSigning, handleMouseUp]);

  return (
    <Card className={cn('animate-fade-in', className)}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-medical-teal-100 flex items-center justify-center">
              <PenLine className="w-5 h-5 text-medical-teal-600" />
            </div>
            <div>
              <CardTitle>签名确认</CardTitle>
              <p className="text-sm text-slate-500 mt-0.5">
                {isConfirmed ? '已签名确认' : '请在下方区域签名'}
              </p>
            </div>
          </div>
          {isConfirmed && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium bg-medical-green-100 text-medical-green-700 rounded-full">
              <Check className="w-4 h-4" />
              已确认
            </span>
          )}
        </div>
      </CardHeader>
      <CardBody>
        {error && (
          <div className="mb-4 text-sm text-medical-red-600 bg-medical-red-50 px-4 py-2 rounded-lg flex items-center gap-2">
            <AlertCircle className="w-4 h-4" />
            {error}
          </div>
        )}

        <div className="relative">
          <div
            className={cn(
              'relative rounded-xl overflow-hidden border-2 transition-colors',
              isConfirmed ? 'border-medical-green-300 bg-medical-green-50/30' : 'border-slate-200 hover:border-slate-300',
              (readOnly || disabled) && 'bg-slate-50 cursor-not-allowed',
              isDrawing && 'border-medical-blue-400'
            )}
          >
            <div className="absolute inset-0 pointer-events-none"
              style={{
                backgroundImage: 'radial-gradient(circle, #e2e8f0 1px, transparent 1px)',
                backgroundSize: '20px 20px',
                opacity: 0.5
              }}
            />
            
            <div className="absolute bottom-3 left-3 text-xs text-slate-400 pointer-events-none">
              请在此处签名
            </div>
            
            <canvas
              ref={canvasRef}
              width={width}
              height={height}
              className={cn(
                'w-full cursor-crosshair touch-none',
                (readOnly || disabled || isConfirmed) && 'cursor-not-allowed'
              )}
              style={{ backgroundColor }}
              onMouseDown={handleMouseDown}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              onTouchStart={handleTouchStart}
              onTouchEnd={handleMouseUp}
            />
          </div>

          {!readOnly && !disabled && (
            <div className="flex items-center justify-between mt-4">
              <div className="flex items-center gap-2">
                {showUndoButton && (
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={handleUndo}
                    disabled={!canUndo || isConfirmed}
                  >
                    <RotateCcw className="w-4 h-4" />
                    撤销
                  </Button>
                )}
                {showClearButton && (
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={handleClear}
                    disabled={isEmpty && !isConfirmed}
                  >
                    <Trash2 className="w-4 h-4" />
                    清空
                  </Button>
                )}
              </div>
              <div className="flex items-center gap-2">
                {showConfirmButton && !isConfirmed && (
                  <Button
                    ref={confirmButtonRef}
                    size="sm"
                    onClick={handleConfirm}
                    disabled={isEmpty}
                  >
                    <Check className="w-4 h-4" />
                    确认签名
                  </Button>
                )}
                {isConfirmed && (
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={handleClear}
                  >
                    <RotateCcw className="w-4 h-4" />
                    重新签名
                  </Button>
                )}
              </div>
            </div>
          )}
        </div>

        {value && isConfirmed && (
          <div className="mt-4 pt-4 border-t border-slate-100">
            <div className="flex items-center gap-2 text-sm text-slate-500">
              <Image className="w-4 h-4" />
              <span>签名数据已生成，可用于电子归档</span>
            </div>
          </div>
        )}
      </CardBody>
    </Card>
  );
};

export default SignaturePad;
