import React, { useState, useEffect, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { VscSend } from "react-icons/vsc";
import { IoChatbubbleOutline } from "react-icons/io5";
import { IoMdHeartEmpty } from "react-icons/io";
import { useDispatch, useSelector } from 'react-redux';
import { liked } from '../../../../services/operations/likeAPI';
import { createComments, deleteComment, getAllComments } from '../../../../services/operations/commentAPI';
import { FaHeart, FaShare, FaRegComment, FaPaintBrush, FaPencilAlt } from "react-icons/fa";
import Comment from './Comment';
import PostHeader from './PostHeader';
import { useNavigate } from 'react-router-dom';
import ShareModal from './ShareModal';
import toast from 'react-hot-toast';
import './post.css';

const Post = memo(function Post(props){
  const dispatch = useDispatch();
  const navigate = useNavigate();


  const [showComments, setShowComments] = useState(props?.showAllComment || false);
  const [allComments, setAllComments] = useState(props?.showAllComment || false);
  const [like, setLike] = useState(false);
  const [commentForm, setCommentForm] = useState("");
  const [totalLikes, setTotalLikes] = useState(props?.likes?.length || 0);
  const [comment, setComment] = useState([]);
  const [loading, setLoading] = useState(false);
  const [desc, setDesc] = useState(props?.description || "");

  const [totalComment, setTotalComment] = useState(props?.comments?.length || 0);

  const gradientColor = [
    "light1", "light2", "light3", "light4", "light5", "light6"
  ]

  const gradientColorDark = [
    "dark1", "dark2", "dark3", "dark4", "dark5", "dark6"
  ]

  const { post } = useSelector((state) => state.post);
  const token = useSelector((state) => state.auth.token);
  const { user } = useSelector((state) => state.profile);


  useEffect(() => {
    const posts = post.filter((p) => p?._id === props?._id);
    const likes = posts[0]?.likes || [];
    const isLiked = likes.some((like) => like?.author === user?._id);

    setLike(isLiked);

  }, [post, props?._id, user?._id]);

  useEffect(() => { 
    comment.length > 0 && comment[0]?.post !== props?._id && setShowComments(false);
  } , [comment])


  const likeHandler = async () => {
    let toastId='';
       if(like){
         toastId=toast.loading("unliking..");
       }
        else{
          toastId=toast.loading("liking..");
        }
    
      await dispatch(liked(token, { postId: props?._id }));
      const newLikeState = !like;
      setLike(newLikeState);
      await setTotalLikes((prevLikes) => newLikeState ? prevLikes + 1 : prevLikes - 1);
    

      const updatedPosts = post.map((p) => {
        if (p._id === props?._id) {
            return {
                ...p,
                likes: newLikeState
                    ? [...p.likes, {
                        post: p._id,
                        author: user?._id,
                        _id: new Date().toISOString(), 
                        createdAt: new Date().toISOString(),
                        updatedAt: new Date().toISOString(),
                        __v: 0
                    }]
                    : p.likes.filter((like) => like.author !== user?._id),
            };
        }
        return p;
      })


      localStorage.setItem('posts', JSON.stringify(updatedPosts));
      toast.dismiss(toastId);
  };
  

  useEffect(() => {
    const commentHandler = async () => {
      if (showComments) {
        setLoading(true);
        const postId = props?._id;
        setAllComments(false);
        setComment(await dispatch(getAllComments(token, postId)));
        setLoading(false);
      }
    };
    commentHandler();
  }, [showComments, props?._id]);

  const redirectionHandler = () => {
    navigate("/feed/" + props?._id);
  };

  const handleSubmitComment = async (event) => {
    event.preventDefault();
    event.stopPropagation();
    const commentResult = await dispatch(createComments(token, { postId: props?._id, comment: commentForm }));
    setTotalComment((prevComment) => prevComment + 1);
    setComment(commentResult)

    setCommentForm("");
  };


  const deleteCommentHandler = async (commentId) => {
    await dispatch(deleteComment(token, { postId: props?._id, commentId }));
    let oldcmts = comment;
    setComment(oldcmts.filter((cmt) => cmt._id !== commentId));    

    setTotalComment((prevComment) => prevComment - 1);
    
    const storedPosts = localStorage.getItem("post");
    if (storedPosts) {
      const posts = JSON.parse(storedPosts);
      const updatedPosts = posts.map(post => {
        if (post._id === props?._id) {
          return {
            ...post,
            comments: post.comments.filter(id => id !== commentId)
          };
        }
        return post;
      });
      localStorage.setItem("post", JSON.stringify(updatedPosts));
    }
    setComment(prevComments => prevComments.filter(id => id !== commentId));
  };

  return (
    <motion.div 
      className='mx-auto md:w-[520px] w-[98%] text-gray-900 dark:text-white my-5 p-5 backdrop-blur-md bg-white/90 dark:bg-gray-800/85 border border-purple-200 dark:border-purple-500/30 rounded-2xl shadow-xl transition-all duration-300'
      initial={{ opacity: 0, y: 25, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.4, type: "spring", stiffness: 120 }}
      whileHover={{ y: -4, boxShadow: "0 20px 35px -10px rgba(147, 51, 234, 0.25)" }}
    >
      {/* post header */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.1 }}
      >
        <PostHeader setDesc={setDesc} {...props}/>
      </motion.div>
     
      {/* content */}
      <motion.div 
        onClick={redirectionHandler}
        className={`p-4 md:p-5 min-h-[180px] hover:cursor-pointer text-center text-white md:text-lg content-center ${gradientColor[props?.color]} dark:${gradientColorDark[props?.color]} rounded-xl border border-gray-200 dark:border-white/20 break-words transition-all duration-300 hover:shadow-lg`}
        whileHover={{ scale: 1.02 }}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2 }}
      >
        {props?.description}
      </motion.div>

      {/* footer */}
      <motion.div 
        className='flex pt-4 justify-between px-4 flex-row'
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <div className='flex gap-4 content-center flex-row'>
          <motion.button 
            onClick={likeHandler}
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.9 }}
            className="flex items-center gap-1 transition-colors"
          >
            <motion.div
              animate={like ? { scale: [1, 1.3, 1] } : {}}
              transition={{ duration: 0.3 }}
            >
              {like ?
                <FaHeart color={"#DE3163"} fontSize={'24px'} />
                :
                <IoMdHeartEmpty fontSize={'24px'} className="text-gray-600 dark:text-gray-400"/>
              }
            </motion.div>
          </motion.button>

          {totalLikes > 0 && (
            <motion.div 
              className='ml-[-6px] content-center my-auto font-semibold text-gray-600 dark:text-gray-400'
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              key={totalLikes}
            >
              {totalLikes}
            </motion.div>
          )}

          <motion.button 
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setShowComments(!showComments)}
            className="flex items-center gap-1 transition-colors"
          >
            <FaRegComment fontSize={'22px'} className="text-gray-600 dark:text-gray-400"/>
          </motion.button>
          
          {totalComment > 0 && (
            <motion.div 
              className='ml-[-6px] content-center my-auto font-semibold text-gray-600 dark:text-gray-400'
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              key={totalComment}
            >
              {totalComment}
            </motion.div>
          )}

          <motion.div
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.9 }}
          >
            <ShareModal props={props?._id} />
          </motion.div>
        </div>
        <motion.div 
          className='content-center text-xs text-gray-500 dark:text-gray-400 font-medium'
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          {props?.createdAt?.substring(0,10)}
        </motion.div>
      </motion.div>

      {/* showComments */}
      <AnimatePresence>
        {showComments && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className='max-md:px-2 p-4 border-t border-gray-200 dark:border-slate-600 max-h-[300px] overflow-auto mt-3'
          >
            {loading ? (
              <motion.div 
                className='text-center py-4'
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                Loading comments...
              </motion.div>
            ) : (
              <>
                <form onSubmit={handleSubmitComment}>
                  <motion.div 
                    className='flex flex-row gap-3 pb-4 pt-2 px-1'
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <input 
                      type='text' 
                      placeholder='Add a comment...' 
                      value={commentForm} 
                      disabled={user?._id === "66d9f75d5950dde630be7c3c"}   
                      onChange={(e) => setCommentForm(e.target.value)} 
                      className='w-full h-10 border border-gray-300 dark:border-slate-500 text-black dark:text-white rounded-lg p-3 focus:ring-2 focus:ring-purple-500 focus:outline-none focus:border-transparent transition-all dark:bg-slate-700' 
                    />
                    <motion.button 
                      type="submit"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="bg-purple-500 hover:bg-purple-600 text-white p-2 rounded-lg transition-colors"
                    >
                      <VscSend fontSize={20} className='my-auto'/>
                    </motion.button>
                  </motion.div>
                </form>
                
                {comment?.length > 0 ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    {comment.slice(0, Math.min(4, comment?.length)).map((com, index) => (
                      <motion.div 
                        key={com?.id || index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <Comment key={com?._id} {...com} onDelete={() => deleteCommentHandler(com?._id)} />
                      </motion.div>
                    ))}
                  </motion.div>
                ) : (
                  <motion.div 
                    className='text-center py-4 text-gray-500 dark:text-gray-400'
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    No comments yet. Be the first to comment!
                  </motion.div>
                )}
                
                {comment?.length > 4 && (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    {!allComments ? (
                      <motion.button 
                        className='w-full text-center text-sm py-2 text-purple-500 hover:text-purple-600 font-medium cursor-pointer transition-colors'
                        onClick={() => setAllComments(true)}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        View all {comment?.length - 4} more comments
                      </motion.button>
                    ) : (
                      comment?.slice(4).map((com, index) => (
                        <motion.div 
                          key={com?.id || index}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                        >
                          <Comment {...com} onDelete={() => deleteCommentHandler(com?._id)}/>
                        </motion.div>
                      ))
                    )}
                  </motion.div>
                )}
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
});

export default Post;