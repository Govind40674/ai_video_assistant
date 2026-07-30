import React from "react";
import { Link } from "react-router-dom";

import {
  BrainCircuit,
  FileText,
  CircleHelp,
  User,
  Mail,
  Globe,
  Heart,
} from "lucide-react";

import {
  FaYoutube,
  FaLinkedin,
} from "react-icons/fa";

import styles from "./Footer.module.css";

function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>

        {/* Brand */}
        <div className={styles.brand}>
          <div className={styles.logo}>
            <BrainCircuit size={34} />
            <h2>AI Video Assistant</h2>
          </div>

          <p>
            Transform any YouTube video into structured knowledge with AI.
            Instantly generate summaries, action items, key decisions,
            unanswered questions, and chat with your videos.
          </p>

          <div className={styles.socials}>
            <a href="#">
              <Globe size={20} />
            </a>

            <a href="#">
              <FaLinkedin size={20} />
            </a>

            <a href="#">
              <Mail size={20} />
            </a>
          </div>
        </div>

        {/* Quick Links */}
        <div className={styles.links}>
          <h3>Quick Links</h3>

          <Link to="/">Home</Link>

          <Link to="/save">
            <FaYoutube size={18} />
            Saved Videos
          </Link>

          <Link to="/history">
            <FileText size={18} />
            History
          </Link>

          <Link to="/profile">
            <User size={18} />
            Profile
          </Link>
        </div>

        {/* Features */}
        <div className={styles.links}>
          <h3>Features</h3>

          <span>AI Video Summarization</span>

          <span>Question Answering</span>

          <span>Action Items</span>

          <span>Key Decisions</span>

          <span>Meeting Notes</span>

          <span>Multi-language Support</span>
        </div>

        {/* Contact */}
        <div className={styles.links}>
          <h3>Contact</h3>

          <div className={styles.contactItem}>
            <Mail size={18} />
            <span>support@aivideoassistant.com</span>
          </div>

          <div className={styles.contactItem}>
            <CircleHelp size={18} />
            <span>24 × 7 AI Assistance</span>
          </div>

          <div className={styles.tech}>
            <Heart size={18} fill="#ef4444" color="#ef4444" />
            <span>Built with React • FastAPI • MongoDB • AI</span>
          </div>
        </div>

      </div>

      <div className={styles.bottom}>
        <p>
          © {new Date().getFullYear()} AI Video Assistant. All Rights Reserved.
        </p>
      </div>
    </footer>
  );
}

export default Footer;