import { axiosAPI } from "../axiosAPI";
import {resetPassword} from "@/types/Usuario"

export async function postResetPassword(
    data: resetPassword
  ): Promise<any> {
    const response = await axiosAPI.post(
      "auth/reset-password",
      data
    );
    return response.data; 
  }