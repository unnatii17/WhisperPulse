import React, { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion';
import Navbar from '../components/core/Feed/Navbar/Navbar'
import { useDispatch, useSelector } from 'react-redux';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import useOnClickOutsideProfile from '../hooks/useOnClickOutsideProfile';
import { MdSpaceDashboard } from 'react-icons/md';
import Sidebar from "../components/core/Feed/Sidebar"
import RightSidebar from "../components/core/Feed/RightSidebar"
import "../components/core/Feed/sidebar.css"
import Loader from '../components/common/Loader';
import { messaging } from '../firebase';
import { getToken } from 'firebase/messaging';
import { handleDevice } from '../services/operations/notificationAPI';
import { FaPalette, FaPaintBrush, FaShapes, FaTheaterMasks } from 'react-icons/fa';

const Feed = () => {
  const { token } = useSelector((state) => state.auth)
  const { device } = useSelector((state) => state.notification);
  const navigate = useNavigate()
  const location = useLocation()
  const isFullWidthPage = location.pathname.includes('/about-us') || location.pathname.includes('/stats') || location.pathname.includes('/buy-us-coffee');
  const { loading: authLoading } = useSelector((state) => state.auth);
  const { loading: profileLoading, user } = useSelector((state) => state.profile);
  const [show, setShow] = useState(false);
  const showRef = useRef();
  const stickRef = useRef();
  const showHandler = () => {
    setShow(false);
  }
  const dispatch=useDispatch();
  

  useEffect(() => {

    if (!token) {
      navigate("/")
    }

 
  }, [token, navigate])

  useOnClickOutsideProfile(showRef, stickRef, showHandler);


  //firebase push notifs code
  async function requestPermission() {
    const permission = await Notification.requestPermission();
    //By Defualt three kind of permissions->granted,default,denied

    console.log("Permission Type:",permission);
    
    if (permission === 'granted') {
      //Generate the token
      if (!device) {
        try{
        const vapidKey=process.env.REACT_APP_FIREBASE_VAPID_KEY;
        const deviceToken = await getToken(messaging, { vapidKey});
        const combinedString = navigator.userAgent + "|" + navigator.hardwareConcurrency + "|" + deviceToken;
        dispatch(handleDevice(user?._id,token,combinedString));
        console.log("Device token:",deviceToken)
        }catch(err){
          console.log("registering device error:",err);
        }
      }

      else {
        console.log("Device already present in slice")
      }
    }

    // else if (permission === 'denied') {
    //   alert("You denied for notification");
    // }
  }

   

  console.log("Current Device:",device);
  useEffect(() => {
    //req user for notification permission
     if ('serviceWorker' in navigator) {
    navigator.serviceWorker.ready.then((registration) => {
      console.log('Service Worker is ready and registered with scope:', registration.scope);

      if (registration.active) {
        console.log('Service Worker is active. Requesting notification permission...');
        requestPermission(); // Proceed with push subscription
      } else {
        console.log('Service Worker is not yet active, waiting...');

        // Listen for state change if it's not active
        registration.installing?.addEventListener('statechange', (event) => {
          if (event.target.state === 'activated') {
            console.log('Service Worker is now active. Requesting notification permission...');
            requestPermission(); // Now that the SW is active, request permission
          }
        });
      }
    }).catch((error) => {
      console.error('Service Worker ready check failed:', error);
    });
  } else {
    console.error("Service Workers are not supported in this browser.");
  }
  }, [])


  if (profileLoading || authLoading) {
    return (
      <div>
        <Loader />
      </div>
    )
  }

  return (
    <div className='bg-white dark:bg-gray-900 relative overflow-hidden min-h-screen' style={{
      backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 50 Q 25 25 50 50 T 100 50' stroke='%23FF6B6B' stroke-width='2' fill='none' opacity='0.1'/%3E%3Cpath d='M0 30 Q 50 0 100 30' stroke='%234ECDC4' stroke-width='2' fill='none' opacity='0.1'/%3E%3Ccircle cx='25' cy='25' r='15' stroke='%23FFE66D' stroke-width='2' fill='none' opacity='0.05'/%3E%3Ccircle cx='75' cy='75' r='10' stroke='%23FFA07A' stroke-width='2' fill='none' opacity='0.05'/%3E%3C/svg%3E")`,
      backgroundSize: '100px 100px'
    }}>
      {/* Artistic Background Pattern */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {/* Abstract Artistic Shapes */}
        <motion.div
          className="absolute top-10 left-5 w-16 h-16 border-4 border-dashed border-purple-400/30 rounded-2xl rotate-12"
          animate={{
            rotate: [12, 45, 12],
            scale: [1, 1.1, 1],
            borderRadius: ['20%', '50%', '20%']
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute top-32 right-16 w-20 h-20 border-4 border-dotted border-pink-400/30 rounded-full"
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360]
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute bottom-20 left-1/4 w-24 h-16 border-4 border-dashed border-blue-400/30 rounded-3xl"
          animate={{
            rotate: [-15, 15, -15],
            x: [0, 20, 0]
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute bottom-32 right-1/3 w-16 h-24 border-4 border-dotted border-yellow-400/30 rounded-2xl"
          animate={{
            rotate: [20, -20, 20],
            y: [0, -15, 0]
          }}
          transition={{
            duration: 7,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        
        {/* Artistic Scribbles */}
        <motion.div
          className="absolute top-1/4 left-12 text-purple-400/20"
          animate={{
            rotate: [0, 360],
            scale: [1, 1.2, 1]
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "linear"
          }}
        >
          <FaPalette size={32} />
        </motion.div>
        <motion.div
          className="absolute top-1/2 right-16 text-pink-400/20"
          animate={{
            rotate: [0, -360],
            scale: [1, 1.3, 1]
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "linear"
          }}
        >
          <FaPaintBrush size={28} />
        </motion.div>
        <motion.div
          className="absolute bottom-1/3 left-20 text-blue-400/20"
          animate={{
            rotate: [0, 360],
            scale: [1, 1.1, 1]
          }}
          transition={{
            duration: 14,
            repeat: Infinity,
            ease: "linear"
          }}
        >
          <FaShapes size={26} />
        </motion.div>
        <motion.div
          className="absolute bottom-1/4 right-24 text-orange-400/20"
          animate={{
            rotate: [0, -360],
            scale: [1, 1.2, 1]
          }}
          transition={{
            duration: 11,
            repeat: Infinity,
            ease: "linear"
          }}
        >
          <FaTheaterMasks size={24} />
        </motion.div>

        {/* Hand-drawn style lines */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ opacity: 0.05 }}>
          <motion.path
            d="M 50 100 Q 150 50 250 100"
            stroke="currentColor"
            strokeWidth="2"
            fill="none"
            className="text-purple-500 dark:text-purple-400"
            animate={{
              pathLength: [0, 300],
              opacity: [0.1, 0.3, 0.1]
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          <motion.path
            d="M 100 50 Q 200 150 300 50"
            stroke="currentColor"
            strokeWidth="2"
            fill="none"
            className="text-pink-500 dark:text-pink-400"
            animate={{
              pathLength: [0, 250],
              opacity: [0.1, 0.25, 0.1]
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        </svg>
      </div>

      <Navbar />
      <div className="flex relative w-full flex-row">
        <div className="relative flex min-h-[calc(100vh-3.5rem)]">
          <div ref={showRef} className={`z-30 container ${show ? `left-0 ` : `-left-96 `} sm:relative  absolute sm:left-0 transition-all duration-500 `}>
            <Sidebar />
          </div>
          <button onClick={() => {
            setShow(!show);
          }}
            ref={stickRef}
            className=" fixed bottom-4 right-10  shadow-2xl  hover:scale-95 transition-all duration-200  z-40 p-5 rounded-full dark:bg-[#fff9d8] bg-[#ffe865] sm:hidden">
            <MdSpaceDashboard fontSize={20} />
          </button>

        </div>

        <div className={`h-[calc(100vh-3.5rem)] w-full flex justify-center overflow-auto ${isFullWidthPage ? 'p-0' : 'px-4 py-6 gap-6'}`}>
          <div className={isFullWidthPage ? "w-full" : "w-full max-w-2xl"}>
            <Outlet />
          </div>
          {!isFullWidthPage && <RightSidebar />}
        </div>

      </div>
    </div>
  )
}

export default Feed
