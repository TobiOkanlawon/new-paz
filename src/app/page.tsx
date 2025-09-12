import styles from "./page.module.css";
import React from "react";
import Image from "next/image";
import { FaArrowRight } from "react-icons/fa";
import { permanentRedirect } from "next/navigation";

export default function Home() {
  return permanentRedirect("/login");
}
