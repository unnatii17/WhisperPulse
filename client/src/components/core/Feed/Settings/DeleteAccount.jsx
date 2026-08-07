import React, { useState } from "react";
import { FiTrash2, FiAlertTriangle } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { removeUser } from "../../../../services/operations/userAPI";
import ConfirmationModal from "../../../common/ConfirmationModal";
import { motion } from "framer-motion";

export default function DeleteAccount() {
  const { token } = useSelector((state) => state.auth);
  const { user } = useSelector((state) => state.profile);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [confirmationModal, setConfirmationModal] = useState(null);

  async function handleDeleteAccount() {
    try {    
      const formData = new FormData();
      formData.append("userId", user?._id);
      dispatch(removeUser(formData, token, navigate));
    } catch (error) {
      console.log("ERROR MESSAGE - ", error.message);
    }
  }

  const triggerModal = () => {
    if (user?._id === "66d9f75d5950dde630be7c3c") return;
    setConfirmationModal({
      text1: "Are You Absolutely Sure?",
      text2: "Your account and all associated anonymous confessions will be permanently removed.",
      btn1Text: "Delete Account",
      btn2Text: "Cancel",
      btn1Handler: () => handleDeleteAccount(),
      btn2Handler: () => setConfirmationModal(null),
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.15 }}
      className="p-6 md:p-8 bg-rose-950/40 backdrop-blur-2xl border border-rose-500/30 rounded-3xl shadow-2xl relative overflow-hidden"
    >
      <div className="absolute top-0 right-0 w-32 h-32 bg-rose-500/10 rounded-bl-full blur-2xl pointer-events-none"></div>

      <div className="flex flex-col sm:flex-row items-start gap-5">
        <div className="p-3.5 bg-gradient-to-tr from-rose-600 to-red-500 text-white rounded-2xl shadow-lg shadow-rose-600/30 shrink-0">
          <FiAlertTriangle className="text-2xl animate-pulse" />
        </div>

        <div className="space-y-2 flex-1">
          <div>
            <h3 className="text-lg font-extrabold text-rose-300 tracking-wide">Danger Zone: Delete Account</h3>
            <p className="text-xs text-rose-200/80 leading-relaxed mt-1">
              Deleting your account is permanent. All your posted confessions, saved settings, and profile data will be permanently removed.
            </p>
          </div>

          <div className="pt-3">
            <button
              type="button"
              onClick={triggerModal}
              disabled={user?._id === "66d9f75d5950dde630be7c3c"}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-red-700 hover:from-rose-500 hover:to-red-600 text-white font-extrabold text-xs shadow-lg shadow-rose-600/30 transition duration-200 flex items-center gap-2"
            >
              <FiTrash2 className="text-sm" />
              I Want to Delete My Account
            </button>
          </div>
        </div>
      </div>

      {confirmationModal && <ConfirmationModal modalData={confirmationModal} setModal={setConfirmationModal} />}
    </motion.div>
  );
}