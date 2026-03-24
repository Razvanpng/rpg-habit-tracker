'use client';

import { useEffect, type ReactNode } from 'react';
import { motion, AnimatePresence, type Variants } from 'framer-motion';
import { createPortal } from 'react-dom';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children: ReactNode;
  size?: 'sm' | 'md' | 'lg';
  closeOnOverlay?: boolean;
}

const sizeStyles = { sm: 'max-w-sm', md: 'max-w-md', lg: 'max-w-lg' };

// Am adaugat ': Variants' aici ca sa nu mai planga TypeScript
const overlayVariants: Variants = { 
  hidden: { opacity: 0 }, 
  visible: { opacity: 1 } 
};

// Si aici la fel
const panelVariants: Variants = {
  hidden: { opacity: 0, scale: 0.96, y: 8 },
  visible: { opacity: 1, scale: 1, y: 0, transition: { type: 'spring', stiffness: 380, damping: 30 } },
  exit: { opacity: 0, scale: 0.97, y: 4, transition: { duration: 0.15 } },
};

export function Modal({ isOpen, onClose, title, description, children, size = 'md', closeOnOverlay = true }: ModalProps) {
  // evitam scroll-ul pe fundal cand e deschis modalul
  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  // close la escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    if (isOpen) document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [isOpen, onClose]);

  if (typeof window === 'undefined') return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="modal-backdrop"
          variants={overlayVariants}
          initial="hidden" animate="visible" exit="hidden"
          transition={{ duration: 0.2 }}
          onClick={closeOnOverlay ? onClose : undefined}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
        >
          <motion.div
            key="modal-panel"
            variants={panelVariants}
            initial="hidden" animate="visible" exit="exit"
            onClick={(e) => e.stopPropagation()}
            className={`relative w-full glass rounded-2xl shadow-2xl ${sizeStyles[size]}`}
          >
            {(title ?? description) && (
              <div className="px-6 pt-6 pb-4 border-b border-surface-border">
                {title && <h2 className="text-lg font-semibold text-ink-primary tracking-tight">{title}</h2>}
                {description && <p className="text-sm text-ink-tertiary mt-1">{description}</p>}
              </div>
            )}

            <button
              onClick={onClose}
              className="absolute top-4 right-4 w-7 h-7 rounded-lg flex items-center justify-center text-ink-tertiary hover:text-ink-primary hover:bg-surface-hover transition-colors text-lg leading-none"
              aria-label="Close modal"
            >
              ✕
            </button>

            <div className="p-6">{children}</div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}