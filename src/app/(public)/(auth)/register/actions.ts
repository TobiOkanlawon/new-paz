"use server";

import * as yup from 'yup';
import { RegisterSchema } from "./schema";
import { redirect } from 'next/navigation';

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
    const res = await fetch(`${process.env.API_BASE_URL}/v1/users/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(cleanedPayload),
      cache: "no-store",
    });

    const data = await res.json();
    
    console.log(data);
    
    if (!res.ok) {
      return {
        success: false,
        message: data.message || "Registration failed",
      };
    }

     redirect("/login?registered=true");
  } catch (error) {
    return {
      success: false,
      message: "Something went wrong",
    };
  }
}
