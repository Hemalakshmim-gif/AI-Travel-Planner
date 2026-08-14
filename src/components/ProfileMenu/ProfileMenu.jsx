import "./ProfileMenu.css";

import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  Heart,
  Settings,
  LogOut,
} from "lucide-react";

function ProfileMenu({
  open,
  navigate,
  onLogout,
}) {
  return (
    <AnimatePresence>

      {open && (

        <motion.div
          className="profile-menu"
          initial={{
            opacity:0,
            y:-12,
            scale:.96,
          }}
          animate={{
            opacity:1,
            y:0,
            scale:1,
          }}
          exit={{
            opacity:0,
            y:-12,
            scale:.96,
          }}
          transition={{
            duration:.2,
          }}
        >

          <button onClick={()=>navigate("/profile")}>
            <User size={18}/>
            My Profile
          </button>

          <button onClick={()=>navigate("/saved-trips")}>
            <Heart size={18}/>
            Saved Trips
          </button>

          <button onClick={()=>navigate("/settings")}>
            <Settings size={18}/>
            Settings
          </button>

          <hr/>

          <button
            className="logout-item"
            onClick={onLogout}
          >
            <LogOut size={18}/>
            Logout
          </button>

        </motion.div>

      )}

    </AnimatePresence>
  );
}

export default ProfileMenu;