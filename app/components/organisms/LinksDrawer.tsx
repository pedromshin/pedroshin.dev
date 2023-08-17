import { useState } from "react";

import { Drawer } from "@material-tailwind/react";

export default ({ onClose, open }: { onClose: () => void; open: boolean }) => {
  return (
    <Drawer
      open={open}
      onClose={onClose}
      size={0.7 * window.innerWidth}
      className="p-4 bg-black bg-opacity-50 border-l-2 border-white-700/50"
      placement="right"
    >
      <div className="mb-6 flex items-center justify-between">
        <h1>asdasd</h1>
      </div>
    </Drawer>
  );
};
