// import { Component, useState } from 'react';
// import {
//   X,
// } from 'lucide-react';
//
//
// class CreateToDoModal extends Component<{ onClose: any }> {
//   render() {
//     let { onClose } = this.props;
//     const [title, setTitle] = useState('');
//     const [folder, setFolder] = useState('New');
//     const [color, setColor] = useState('#9b59b6');
//
//     return (
//       <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
//         <div className="bg-[#fdfcf9] rounded-3xl shadow-lg w-96 overflow-hidden">
//           <div className="bg-purple-100 px-4 py-2 flex items-center justify-between">
//             <div className="flex items-center gap-2">
//               <div className="w-4 h-4" />
//               <span className="font-medium">Create a to-do list</span>
//             </div>
//             <button onClick={onClose}>
//               <X className="w-5 h-5" />
//             </button>
//           </div>
//
//           <div className="p-4 space-y-4">
//             <div>
//               <label className="text-sm font-medium">Title</label>
//               <input
//                 type="text"
//                 placeholder="Title"
//                 value={title}
//                 onChange={(e) => setTitle(e.target.value)}
//                 className="w-full mt-1 border rounded-md px-2 py-1"
//               />
//             </div>
//
//             <div>
//               <label className="text-sm font-medium">Choose folder</label>
//               <select
//                 value={folder}
//                 onChange={(e) => setFolder(e.target.value)}
//                 className="w-full mt-1 border rounded-md px-2 py-1"
//               >
//                 <option value="New">New</option>
//                 <option value="School">School</option>
//                 <option value="Work">Work</option>
//                 <option value="Personal">Personal</option>
//               </select>
//             </div>
//
//             <div>
//               <label className="text-sm font-medium">Choose color</label>
//               <input
//                 type="color"
//                 value={color}
//                 onChange={(e) => setColor(e.target.value)}
//                 className="w-10 h-10 mt-1 border rounded-full p-0 cursor-pointer"
//                 style={{ backgroundColor: color }}
//               />
//             </div>
//
//             <div className="flex justify-end gap-2">
//               <button onClick={onClose} className="px-4 py-1 border rounded-md">
//                 Cancel
//               </button>
//               <button className="px-4 py-1 bg-black text-white rounded-md">
//                 Ok
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>
//     );
//   }
// }
//
// export default CreateToDoModal;

import { useState } from 'react';
import { X } from 'lucide-react';

function CreateToDoModal({ onClose }) {
  const [title, setTitle] = useState('');
  const [folder, setFolder] = useState('New');
  const [color, setColor] = useState('#9b59b6');

  const handleSubmit = () => {
    console.log({ title, folder, color });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <div className="bg-[#fdfcf9] rounded-3xl shadow-lg w-96 overflow-hidden">
        <div className="bg-purple-100 px-4 py-2 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4" />
            <span className="font-medium">Create a to-do list</span>
          </div>
          <button onClick={onClose}>
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 space-y-4">
          <div>
            <label className="text-sm font-medium">Title</label>
            <input
              type="text"
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full mt-1 border rounded-md px-2 py-1"
            />
          </div>

          <div>
            <label className="text-sm font-medium">Choose folder</label>
            <select
              value={folder}
              onChange={(e) => setFolder(e.target.value)}
              className="w-full mt-1 border rounded-md px-2 py-1"
            >
              <option value="New">New</option>
              <option value="School">School</option>
              <option value="Work">Work</option>
              <option value="Personal">Personal</option>
            </select>
          </div>

          <div>
            <label className="text-sm font-medium">Choose color</label>
            <input
              type="color"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              className="w-10 h-10 mt-1 border rounded-full p-0 cursor-pointer"
              style={{ backgroundColor: color }}
            />
          </div>

          <div className="flex justify-end gap-2">
            <button onClick={onClose} className="px-4 py-1 border rounded-md">
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              className="px-4 py-1 bg-black text-white rounded-md"
            >
              Ok
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CreateToDoModal;

