import React, {useState} from 'react'



function Modal({children, onClose}) {

  return (
    <div className="fixed inset-0 bg-black bg-opacity-20 z-50 flex justify-center items-center">
        <div className="bg-white p-5 rounded">
          {children}
          <button
            className="mt-5 px-4 py-2 bg-red-400 text-white rounded hover:bg-red-700"
            onClick={onClose}
          >
            Close
          </button>
        </div>
    </div>
  )
}


function UserGameDataEditModal({isOpen, onClose, userGameData}) {
  return (
    <>
      <Modal onClose={onClose}>
        <div> Title</div>
        <div> Statuses </div>
        <div> Dates</div>
        <div> Notes</div>
        <div> remove close save</div>
        <div> {}</div>

      </Modal>

    </>

  )
}

export default UserGameDataEditModal