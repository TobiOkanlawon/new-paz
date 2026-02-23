"use server";


// import { redirect } from "next/navigation";
import * as yup from 'yup';
import { RegisterSchema } from "./schema";

type RegisterSchema = yup.InferType<typeof RegisterSchema>;

export async function registerUser(payload: RegisterSchema) {

  const cleanedPayload = {
    firstName: payload.firstName,
    lastName: payload.lastName,
    email: payload.email,
    mobileNumber: payload.phoneNumber,
    password: payload.password
  }
  
  try {
    const res = await fetch(`${process.env.API_BASE_URL}/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(cleanedPayload),
      cache: "no-store",
    });

    const data = await res.json();

    if (!res.ok) {
      return {
        success: false,
        message: data.message || "Registration failed",
      };
    }

    return {
      success: true,
      data,
    };
  } catch (error) {
    return {
      success: false,
      message: "Something went wrong",
    };
  }
