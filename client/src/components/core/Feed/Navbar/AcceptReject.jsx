import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getInstaId } from '../../../../services/operations/notificationAPI';

const AcceptReject = ({ postId }) => {
  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.token);
  const [contactId, setContactId] = useState("");
  const [clicked, setClicked] = useState(false);

  async function getContact() {
    try {
      if(clicked) {
        setClicked(false);
      }
      else {
        const response = await dispatch(getInstaId(token, postId));
        setContactId(response);
        setClicked(true);
      }
    } catch (error) {
      console.error("Error fetching contact detail:", error);
    }
  }

  return (
    <div>
      <div className='mx-auto flex flex-row-reverse gap-10'>
        <button 
          onClick={getContact} 
          className='bg-purple-600 hover:bg-purple-700 transition-colors px-3 py-1.5 mt-[-25px] mb-1 text-white rounded-md text-xs font-semibold shadow-sm'
        >
          {!clicked ? "Connect with Confessor" : "Send them a message 😉"}
        </button>
      </div>

      {clicked && (
        <p className='text-center text-amber-500 dark:text-amber-400 text-sm py-1 font-medium'>
          Contact: {contactId ? contactId : 'Made private by user'}
        </p>
      )}
    </div>
  );
};

export default AcceptReject;
