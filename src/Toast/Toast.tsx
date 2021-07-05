// import React from "react"
// import { useState } from "react"

// export const Toast = () => {
//   const [position, setPosition] = useState<string>('')
//   const [showing, setShowing] = useState<boolean>(false)
//   const [displayTime, setDisplayTime] = useState<number>(0)
//   const [body, setBody] = useState<string>('')
//   const [className, setClassName] = useState<string>('')
//   const [bodyState, setBodyState] = useState<string>(body || '')
//   const [s, setS] = useState<boolean>(showing || false)
//   const [time, setTime] = useState<number>(displayTime || 10000)

//   return (
//       <div className={`
//       fixed z-50 transform transition-transform duartion-150
//       ${s && position?.includes('bottom') ? '-translate-y-12' : 'translate-y-12'}
//       ${s && position?.includes('top') ? 'translate-y-12' : '-translate-y-12'}
//       ${s && position?.includes('right') ? '-translate-x-12' : 'translate-x-12'}
//       ${s && position?.includes('left') ? 'translate-x-12' : '-translate-x-12'}
//       ${s && position?.includes('top') ? 'translate-y-12' : '-translate-y-12'}
//       ${ position?.includes('bottom') ? 'bottom-4' : 'top-4' } 
//       ${ position?.includes('right') ? 'right-4' : '' }
//       ${ position?.includes('left') ? 'left-4' : '' } 
//       ${ !position?.includes('right') || !position?.includes('left') ? 'right-1/2' : '' } px-6 py-3 bg-rose-600 rounded-md text-white ${className}`}>
//         {body}
//       </div>
//   )
// }

import React from "react";

const Ctx = React.createContext(null);

// Styled Components
// ==============================

const ToastContainer = props => (
  <div style={{ position: "fixed", right: 0, top: 0 }} {...props} />
);
const Toast = ({ children, onDismiss }) => (
  <div
    style={{
      background: "LemonChiffon",
      cursor: "pointer",
      fontSize: 14,
      margin: 10,
      padding: 10
    }}
    onClick={onDismiss}
  >
    {children}
  </div>
);

// Provider
// ==============================

let toastCount = 0;

export function ToastProvider({ children }: { children: any}) {
  const [toasts, setToasts] = React.useState([]);

  const add = content => {
    const id = toastCount++;
    const toast = { content, id };
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
        {toasts.map(({ content, id, ...rest }) => (
          <Toast key={id} Toast={Toast} onDismiss={onDismiss(id)} {...rest}>
            {id + 1} &mdash; {content}
          </Toast>
        ))}
      </ToastContainer>
    </Ctx.Provider>
  );
}

export const useToasts = () => React.useContext(Ctx);
