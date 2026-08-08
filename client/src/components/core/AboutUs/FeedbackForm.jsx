import React, { useState } from "react";
import { motion } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { sendFeedback } from "../../../services/operations/userAPI";
import {
  FaComment,
  FaPaperPlane,
  FaStar,
  FaCheckCircle,
} from "react-icons/fa";

const FeedbackForm = () => {
  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.token);

  const [feedback, setFeedback] = useState("");
  const [rating, setRating] = useState(5);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!feedback.trim()) return;

    dispatch(
      sendFeedback(token, {
        message: feedback,
        rating,
      })
    );

    setSubmitted(true);

    setTimeout(() => {
      setSubmitted(false);
      setFeedback("");
    }, 4000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="max-w-2xl mx-auto bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl p-8 rounded-3xl border border-gray-200 dark:border-gray-700 shadow-xl"
    >
      <div className="flex items-center justify-center gap-3 mb-3">
        <FaComment className="text-3xl text-purple-500" />
      </div>

      <h2 className="text-2xl font-bold text-center text-gray-900 dark:text-white">
        We'd Love Your Feedback 💬
      </h2>

      <p className="text-center text-gray-600 dark:text-gray-300 mt-2 mb-6">
        Have ideas or suggestions? Help us make WhisperPulse even better!
      </p>

      {submitted ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="p-6 rounded-2xl bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 text-center"
        >
          <FaCheckCircle className="text-4xl text-green-500 mx-auto mb-2" />

          <h4 className="font-bold text-gray-900 dark:text-white">
            Thank You for Your Feedback! ❤️
          </h4>

          <p className="text-xs text-gray-600 dark:text-gray-300 mt-1">
            Your thoughts mean the world to us.
          </p>
        </motion.div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex items-center justify-center gap-2 mb-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                className="text-2xl focus:outline-none transition-transform transform hover:scale-125"
              >
                <FaStar
                  className={
                    star <= rating
                      ? "text-amber-400"
                      : "text-gray-300 dark:text-gray-600"
                  }
                />
              </button>
            ))}
          </div>

          <div className="relative">
            <textarea
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="Share your thoughts, report an issue, or suggest a feature..."
              rows={4}
              className="w-full p-4 text-sm bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-400 text-gray-800 dark:text-white placeholder-gray-400 resize-none"
            />

            <span className="absolute right-4 bottom-3 text-xs text-gray-400 font-medium">
              {feedback.length} chars
            </span>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={!feedback.trim()}
            className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-purple-600 via-pink-500 to-amber-500 text-white font-extrabold text-sm shadow-md shadow-purple-500/20 flex items-center justify-center gap-2 disabled:opacity-50 transition-all"
          >
            <FaPaperPlane />
            Send Feedback
          </motion.button>
        </form>
      )}
    </motion.div>
  );
};

export default FeedbackForm;
