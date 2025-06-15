'use client';

import React from 'react';

// Define a simple AppProvider component
function SimpleComponent() {
  return <div>This is a simple component</div>;
}

// Export the AppProvider component specifically named to match the import in layout.tsx
export const AppProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <div style={{ display: "block", padding: "10px", margin: "10px" }}>
        <SimpleComponent />
      </div>
      {children}
    </>
  );
};