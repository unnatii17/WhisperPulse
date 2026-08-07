import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import CreatePost from './Post/CreatePost';
import Post from './Post/Post';
import InfiniteScroll from 'react-infinite-scroll-component';
import { getPosts } from '../../../services/operations/postAPI';
import { useDispatch, useSelector } from 'react-redux';
import PostSkeleton from './Post/PostSkeleton';
import { FaRegSmile, FaFire, FaStar, FaMagic, FaHeart } from 'react-icons/fa';
import './Post/post.css';

const MyFeed = () => {
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.auth);
  const { post, totalPosts } = useSelector((state) => state.post);
  const [count, setCount] = useState(4);
  const [isLoading, setIsLoading] = useState(true);

  const fetchMoreData = async () => {
    try {
      dispatch(getPosts(count + 4, token));
      setCount(count + 4);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        await dispatch(getPosts(count, token));
        setIsLoading(false);
      } catch (err) {
        console.log(err);
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 12
      }
    }
  };

  return (
    <motion.div 
      className="w-full overflow-auto" 
      id="scrollableDiv"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-6"
      >
        <CreatePost />
      </motion.div>
      
      {/* Welcome Banner when no posts */}
      {post.length === 0 && !isLoading && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mb-8 p-8 bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 rounded-2xl text-center"
        >
          <motion.div
            animate={{ 
              rotate: [0, 10, -10, 0],
              scale: [1, 1.2, 1]
            }}
            transition={{ 
              duration: 3, 
              repeat: Infinity,
              ease: "easeInOut" 
            }}
            className="text-5xl mb-4"
          >
            <FaStar className="text-white mx-auto" />
          </motion.div>
          <h2 className="text-2xl font-bold text-white mb-2">🎨 Canvas Awaits Your Story!</h2>
          <p className="text-white/90">Be the first artist to paint this space with your thoughts</p>
        </motion.div>
      )}
      
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-4"
      >
        <InfiniteScroll
          dataLength={post.length}
          next={fetchMoreData}
          hasMore={post.length===totalPosts?(false):(true)}
          loader={
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex justify-center py-8"
            >
              <PostSkeleton/>
            </motion.div>
          }
          endMessage={
            <div className='mb-8 py-8 flex flex-col items-center justify-center'>
              <motion.div
                animate={{ 
                  rotate: [0, 10, -10, 0],
                  scale: [1, 1.1, 1]
                }}
                transition={{ 
                  duration: 2, 
                  repeat: Infinity,
                  ease: "easeInOut" 
                }}
                className="text-4xl mb-3"
              >
                <FaRegSmile className="text-yellow-500" />
              </motion.div>
              <p className='dark:text-white text-black text-center text-lg font-semibold'>
                Masterpiece Complete! 
                <motion.span
                  animate={{ rotate: [0, 20, -20, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  className="inline-block"
                >
                  🎭
                </motion.span>
              </p>
              <motion.p 
                className="text-sm text-gray-500 mt-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                Return soon for more artistic confessions!
              </motion.p>
              
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="mt-6 p-4 bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900 dark:to-pink-900 rounded-xl"
              >
                <div className="flex items-center justify-center gap-2">
                  <FaMagic className="text-purple-500" />
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Add your creative spark to this gallery!
                  </p>
                </div>
              </motion.div>
            </div>
          }
          scrollableTarget="scrollableDiv"
        >
          <AnimatePresence>
            {post?.map((p, index) => (
              <motion.div 
                key={p?.id || index}
                variants={itemVariants}
                initial="hidden"
                animate="visible"
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: index * 0.05 }}
              >
                <Post {...p} />
              </motion.div>
            ))}
          </AnimatePresence>
        </InfiniteScroll>
      </motion.div>
    </motion.div>
  );
};

export default MyFeed;
