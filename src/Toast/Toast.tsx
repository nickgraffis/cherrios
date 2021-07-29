import React, { useState } from "react";
import { useEffect } from "react";

const Ctx = React.createContext(null);

// Styled Components
// ==============================

const ToastContainer = props => (
  <div style={{ position: "fixed", left: 6, bottom: 6, zIndex: 100 }} {...props} />
);
const Toast = ({ children, onDismiss, duration }) => {
  const [showing, setShowing] = useState<boolean>(false)
  const [moving, setMoving] = useState<string>('no')

  useEffect(() => {
    setShowing(false)
    setTimeout(() => {
      setShowing(true)
      setMoving('in')
      setTimeout(() => {
        setMoving('no')
      }, 250)
    }, 1)

    if (duration) {
      setTimeout(() => {
        dismiss()
      }, duration)
    }
  }, [])

  const dismiss = () => {
    setShowing(false)
    setMoving('out')
    setTimeout(() => {
      onDismiss()
    }, 500)
  }
    return (
      <div
        className={`bg-rose-500 text-white font-semibold px-6 py-3 
        rounded-lg m-4 cursor-pointer transition-transform transform duration-300 
        ${showing ? 'translate-x-0' : '-translate-x-96'}
        ${moving === 'no' ? 'skew-x-0' : moving === 'in' ? 'skew-x-6' : '-skew-x-6'}`}
        onClick={dismiss}
      >
        {children}
      </div>
    )
  };

// Provider
// ==============================

let toastCount = 0;

export function ToastProvider({ children }: { children: any}) {
  const [toasts, setToasts] = React.useState([]);

  const add = (content, duration) => {
    const id = toastCount++;
    const toast = { content, id, duration };
    setToasts([...toasts, toast]);
  };
  const remove = id => {
    const newToasts = toasts.filter(t => t.id !== id);
    setToasts(newToasts);
  };
  // avoid creating a new fn on every render
  const onDismiss = id => () => remove(id);

  return (
    <Ctx.Provider value={{ add, remove }}>
      {children}
      <ToastContainer>
        {toasts.map(({ content, id, duration, ...rest }) => (
          <Toast key={id} Toast={Toast} duration={duration} onDismiss={onDismiss(id)} {...rest}>
            {content}
          </Toast>
        ))}
      </ToastContainer>
    </Ctx.Provider>
  );
}

export const useToasts = () => React.useContext(Ctx);
